import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analisarImagensTricoscopicas, validarAnaliseIA, type AnaliseIAResult } from '@/lib/ia-anamnese';

export interface UseAcionarAnaliseIAReturn {
  acionarAnalise: (avaliacaoId: string, imageUrls: string[], clienteId: string) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

export interface UseStatusAnaliseReturn {
  status: 'idle' | 'processing' | 'completed' | 'error';
  analise: AnaliseIAResult | null;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseComparativoAvaliacoesReturn {
  comparativo: any | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para acionar análise IA de uma avaliação
 */
export function useAcionarAnaliseIA(): UseAcionarAnaliseIAReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const acionarAnalise = useCallback(async (
    avaliacaoId: string,
    imageUrls: string[],
    clienteId: string
  ): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);

      // Verificar se há imagens para analisar
      if (!imageUrls || imageUrls.length === 0) {
        setError('Nenhuma imagem disponível para análise');
        return false;
      }

      // Validar parâmetros obrigatórios
      if (!avaliacaoId || !clienteId) {
        console.error('Parâmetros inválidos para análise IA:', { avaliacaoId, clienteId });
        setError('Parâmetros inválidos para análise');
        return false;
      }

      // Buscar avaliação anterior do mesmo cliente para comparativo
      const { data: avaliacaoAnterior, error: prevErr } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('cliente_id', clienteId)
        .neq('id', avaliacaoId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (prevErr) {
        console.warn('Falha ao buscar avaliação anterior (seguiremos sem comparativo):', prevErr);
      }

      // Opcional: refletir status em processamento para melhor UX
      await supabase
        .from('avaliacoes')
        .update({ status: 'analisando' })
        .eq('id', avaliacaoId);

      // Gerar análise IA (mock)
      const analiseIA = analisarImagensTricoscopicas(
        imageUrls,
        clienteId,
        avaliacaoId,
        avaliacaoAnterior
      );

      // Salvar análise no banco
      const { error: updateError } = await supabase
        .from('avaliacoes')
        .update({ analise_ia: analiseIA })
        .eq('id', avaliacaoId);

      if (updateError) {
        console.error('Erro ao salvar análise IA:', updateError);
        setError('Erro ao salvar análise no banco de dados');
        return false;
      }

      // Atualizar status para concluída
      await supabase
        .from('avaliacoes')
        .update({ status: 'concluida' })
        .eq('id', avaliacaoId);

      return true;
    } catch (err) {
      console.error('Erro na análise IA:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado na análise IA';
      setError(errorMsg);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    acionarAnalise,
    isProcessing,
    error,
    clearError
  };
}

/**
 * Hook para monitorar status de análise IA
 */
export function useStatusAnalise(avaliacaoId: string): UseStatusAnaliseReturn {
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [analise, setAnalise] = useState<AnaliseIAResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!avaliacaoId) return;

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('avaliacoes')
        .select('analise_ia, status')
        .eq('id', avaliacaoId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar análise:', fetchError);
        setError('Erro ao carregar análise');
        setStatus('error');
        return;
      }

      if (data.analise_ia && validarAnaliseIA(data.analise_ia)) {
        setAnalise(data.analise_ia);
        setStatus('completed');
      } else if (data.status === 'analisando') {
        setStatus('processing');
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('Erro no refetch:', err);
      setError('Erro inesperado ao carregar análise');
      setStatus('error');
    }
  }, [avaliacaoId]);

  // Polling para verificar status
  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(refetch, 2000); // Verificar a cada 2 segundos
      return () => clearInterval(interval);
    }
  }, [status, refetch]);

  // Carregar dados iniciais
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    status,
    analise,
    error,
    refetch
  };
}

/**
 * Hook para buscar comparativo de avaliações de um cliente
 */
export function useComparativoAvaliacoes(clienteId: string): UseComparativoAvaliacoesReturn {
  const [comparativo, setComparativo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!clienteId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('avaliacoes')
        .select('id, created_at, analise_ia')
        .eq('cliente_id', clienteId)
        .not('analise_ia', 'is', null)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar avaliações:', fetchError);
        setError('Erro ao carregar histórico de avaliações');
        return;
      }

      if (data && data.length > 0) {
        setComparativo(data);
      } else {
        setComparativo(null);
      }
    } catch (err) {
      console.error('Erro no refetch comparativo:', err);
      setError('Erro inesperado ao carregar comparativo');
    } finally {
      setIsLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    comparativo,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook combinado para gerenciar análise IA completa
 */
export function useAnaliseIACompleta(avaliacaoId: string, clienteId: string) {
  const acionarAnalise = useAcionarAnaliseIA();
  const statusAnalise = useStatusAnalise(avaliacaoId);
  const comparativo = useComparativoAvaliacoes(clienteId);

  const processarAnalise = useCallback(async (imageUrls: string[]) => {
    const success = await acionarAnalise.acionarAnalise(avaliacaoId, imageUrls, clienteId);
    if (success) {
      // Aguardar um pouco e refetch para pegar o resultado
      setTimeout(() => {
        statusAnalise.refetch();
        comparativo.refetch();
      }, 1000);
    }
    return success;
  }, [avaliacaoId, clienteId, acionarAnalise, statusAnalise, comparativo]);

  return {
    // Análise
    processarAnalise,
    isProcessing: acionarAnalise.isProcessing || statusAnalise.status === 'processing',
    analise: statusAnalise.analise,
    status: statusAnalise.status,
    
    // Comparativo
    historico: comparativo.comparativo,
    isLoadingHistorico: comparativo.isLoading,
    
    // Erros
    error: acionarAnalise.error || statusAnalise.error || comparativo.error,
    clearError: () => {
      acionarAnalise.clearError();
      // statusAnalise não tem clearError, mas podemos refetch
      if (statusAnalise.error) statusAnalise.refetch();
      if (comparativo.error) comparativo.refetch();
    },
    
    // Refetch
    refetch: () => {
      statusAnalise.refetch();
      comparativo.refetch();
    }
  };
}
