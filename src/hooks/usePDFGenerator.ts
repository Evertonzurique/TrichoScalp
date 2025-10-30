import { useState, useCallback } from 'react';
import { 
  generateTrichologyPDF, 
  uploadPDFToSupabase, 
  generatePDFFileName,
  type TrichologyReportData,
  type PDFOptions 
} from '../lib/pdf-generator';
import { supabase } from '@/integrations/supabase/client';

// ==================== INTERFACES ====================

export interface PDFGenerationState {
  isGenerating: boolean;
  isUploading: boolean;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
  publicUrl: string | null;
}

export interface PDFGenerationOptions extends PDFOptions {
  autoDownload?: boolean;
  uploadToStorage?: boolean;
  customFileName?: string;
}

// ==================== HOOK PRINCIPAL ====================

export const usePDFGenerator = () => {
  const [state, setState] = useState<PDFGenerationState>({
    isGenerating: false,
    isUploading: false,
    progress: 0,
    error: null,
    downloadUrl: null,
    publicUrl: null
  });

  /**
   * Atualiza o estado de progresso
   */
  const updateProgress = useCallback((progress: number, status?: Partial<PDFGenerationState>) => {
    setState(prev => ({
      ...prev,
      progress,
      ...status
    }));
  }, []);

  /**
   * Gera PDF e opcionalmente faz download/upload
   */
  const generatePDF = useCallback(async (
    data: TrichologyReportData,
    options: PDFGenerationOptions = {}
  ): Promise<{ blob: Blob; downloadUrl: string; publicUrl?: string }> => {
    try {
      // Reset do estado
      setState({
        isGenerating: true,
        isUploading: false,
        progress: 0,
        error: null,
        downloadUrl: null,
        publicUrl: null
      });

      updateProgress(10, { isGenerating: true });

      // Gerar PDF
      const pdfBlob = await generateTrichologyPDF(data, options);
      updateProgress(60);

      // Criar URL para download
      const downloadUrl = URL.createObjectURL(pdfBlob);
      updateProgress(70, { downloadUrl });

      let publicUrl: string | undefined;

      // Upload para Supabase Storage (se solicitado)
      if (options.uploadToStorage && supabase) {
        updateProgress(75, { isUploading: true });
        
        const fileName = options.customFileName || 
          generatePDFFileName(data.paciente.nome, data.data);
        
        try {
          publicUrl = await uploadPDFToSupabase(pdfBlob, fileName, supabase);
          updateProgress(90, { publicUrl });
        } catch (uploadError) {
          console.warn('Erro no upload, continuando com download local:', uploadError);
        }
      }

      // Auto download (se solicitado)
      if (options.autoDownload) {
        const fileName = options.customFileName || 
          generatePDFFileName(data.paciente.nome, data.data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.rel = 'noopener';
        document.body.appendChild(link);

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
          // Safari tem restrições de download programático - abrir em nova aba
          window.open(downloadUrl, '_blank');
        } else {
          link.click();
        }
        document.body.removeChild(link);
      }

      updateProgress(100, {
        isGenerating: false,
        isUploading: false
      });

      return { blob: pdfBlob, downloadUrl, publicUrl };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        isGenerating: false,
        isUploading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [supabase, updateProgress]);

  /**
   * Limpa URLs de download para liberar memória
   */
  const cleanup = useCallback(() => {
    if (state.downloadUrl) {
      URL.revokeObjectURL(state.downloadUrl);
    }
    setState(prev => ({
      ...prev,
      downloadUrl: null,
      publicUrl: null,
      error: null
    }));
  }, [state.downloadUrl]);

  /**
   * Reset do estado
   */
  const reset = useCallback(() => {
    cleanup();
    setState({
      isGenerating: false,
      isUploading: false,
      progress: 0,
      error: null,
      downloadUrl: null,
      publicUrl: null
    });
  }, [cleanup]);

  return {
    ...state,
    generatePDF,
    cleanup,
    reset
  };
};

// ==================== HOOK PARA DADOS DE RELATÓRIO ====================

/**
 * Hook para preparar dados do relatório a partir de diferentes fontes
 */
export const useTrichologyReportData = () => {
  const prepareReportData = useCallback((
    paciente: any,
    anamnese: any,
    imagens: any,
    analiseIA: any,
    profissional: any,
    observacoes?: string,
    recomendacoes?: string[]
  ): TrichologyReportData => {
    return {
      paciente: {
        nome: paciente.nome || '',
        idade: paciente.idade || 0,
        genero: paciente.genero || '',
        telefone: paciente.telefone,
        email: paciente.email,
        data_nascimento: paciente.data_nascimento
      },
      anamnese: anamnese || {},
      imagens: imagens || {},
      analiseIA: {
        analise_quantitativa: analiseIA?.analise_quantitativa || {},
        analise_qualitativa: analiseIA?.analise_qualitativa || '',
        interpretacao_final: analiseIA?.interpretacao_final || '',
        comparativo: analiseIA?.comparativo
      },
      profissional: {
        nome: profissional.nome || '',
        crm: profissional.crm,
        especialidade: profissional.especialidade,
        contato: profissional.contato
      },
      data: new Date().toISOString(),
      observacoes,
      recomendacoes
    };
  }, []);

  return { prepareReportData };
};

// ==================== HOOK PARA VALIDAÇÃO ====================

/**
 * Hook para validar dados antes da geração do PDF
 */
export const usePDFValidation = () => {
  const validateReportData = useCallback((data: TrichologyReportData): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!data.paciente.nome) {
      errors.push('Nome do paciente é obrigatório');
    }

    if (!data.paciente.idade || data.paciente.idade <= 0) {
      errors.push('Idade do paciente deve ser maior que zero');
    }

    if (!data.profissional.nome) {
      errors.push('Nome do profissional é obrigatório');
    }

    if (!data.analiseIA.interpretacao_final) {
      errors.push('Interpretação final da IA é obrigatória');
    }

    // Validações de aviso
    if (Object.keys(data.anamnese).length === 0) {
      warnings.push('Nenhum dado de anamnese fornecido');
    }

    if (Object.keys(data.imagens).length === 0) {
      warnings.push('Nenhuma imagem de tricoscopia fornecida');
    }

    if (Object.keys(data.analiseIA.analise_quantitativa).length === 0) {
      warnings.push('Nenhum dado quantitativo da IA fornecido');
    }

    if (!data.profissional.crm) {
      warnings.push('CRM do profissional não informado');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  return { validateReportData };
};

// ==================== HOOK PARA PREVIEW ====================

/**
 * Hook para gerar preview do PDF sem download
 */
export const usePDFPreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const generatePreview = useCallback(async (
    data: TrichologyReportData,
    options?: PDFOptions
  ): Promise<string> => {
    setIsGeneratingPreview(true);
    
    try {
      const pdfBlob = await generateTrichologyPDF(data, options);
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
      return url;
    } finally {
      setIsGeneratingPreview(false);
    }
  }, []);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  return {
    previewUrl,
    isGeneratingPreview,
    generatePreview,
    clearPreview
  };
};

// ==================== TIPOS EXPORTADOS ====================

export type {
  PDFGenerationState,
  PDFGenerationOptions,
  TrichologyReportData,
  PDFOptions
};