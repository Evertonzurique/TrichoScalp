/**
 * Serviço para comparação entre avaliações e análise de evolução
 */

import type { AnaliseQuantitativa } from './ia-anamnese';

export interface VariacaoIndicadores {
  densidade_capilar: number;
  oleosidade: number;
  descamacao: number;
  miniaturizacao: number;
  inflamacao: number;
}

export interface VariacaoFormatada {
  densidade_capilar: string;
  oleosidade: string;
  descamacao: string;
  miniaturizacao: string;
  inflamacao: string;
}

export interface EvolucaoGeral {
  status: 'melhora' | 'piora' | 'estavel' | 'mista';
  descricao: string;
  indicadores_melhoraram: number;
  indicadores_pioraram: number;
  indicadores_estaveis: number;
  score_evolucao: number; // -100 a +100
}

export interface ComparativoDetalhado {
  atual: AnaliseQuantitativa;
  anterior: AnaliseQuantitativa;
  variacao_absoluta: VariacaoIndicadores;
  variacao_relativa: VariacaoIndicadores;
  variacao_formatada: VariacaoFormatada;
  evolucao_geral: EvolucaoGeral;
  tempo_entre_avaliacoes: number; // em dias
}

/**
 * Compara duas avaliações e calcula variações
 */
export function compararAvaliacoes(
  atual: AnaliseQuantitativa,
  anterior: AnaliseQuantitativa
): ComparativoDetalhado {
  // Calcular variações absolutas
  const variacao_absoluta: VariacaoIndicadores = {
    densidade_capilar: atual.densidade_capilar - anterior.densidade_capilar,
    oleosidade: atual.oleosidade - anterior.oleosidade,
    descamacao: atual.descamacao - anterior.descamacao,
    miniaturizacao: atual.miniaturizacao - anterior.miniaturizacao,
    inflamacao: atual.inflamacao - anterior.inflamacao
  };

  // Calcular variações relativas (percentual)
  const variacao_relativa: VariacaoIndicadores = {
    densidade_capilar: anterior.densidade_capilar > 0 
      ? (variacao_absoluta.densidade_capilar / anterior.densidade_capilar) * 100 
      : 0,
    oleosidade: anterior.oleosidade > 0 
      ? (variacao_absoluta.oleosidade / anterior.oleosidade) * 100 
      : 0,
    descamacao: anterior.descamacao > 0 
      ? (variacao_absoluta.descamacao / anterior.descamacao) * 100 
      : 0,
    miniaturizacao: anterior.miniaturizacao > 0 
      ? (variacao_absoluta.miniaturizacao / anterior.miniaturizacao) * 100 
      : 0,
    inflamacao: anterior.inflamacao > 0 
      ? (variacao_absoluta.inflamacao / anterior.inflamacao) * 100 
      : 0
  };

  // Formatar variações para exibição
  const variacao_formatada: VariacaoFormatada = {
    densidade_capilar: formatarVariacao(variacao_absoluta.densidade_capilar),
    oleosidade: formatarVariacao(variacao_absoluta.oleosidade),
    descamacao: formatarVariacao(variacao_absoluta.descamacao),
    miniaturizacao: formatarVariacao(variacao_absoluta.miniaturizacao),
    inflamacao: formatarVariacao(variacao_absoluta.inflamacao)
  };

  // Calcular evolução geral
  const evolucao_geral = gerarEvolucaoGeral(variacao_absoluta);

  return {
    atual,
    anterior,
    variacao_absoluta,
    variacao_relativa,
    variacao_formatada,
    evolucao_geral,
    tempo_entre_avaliacoes: 0 // Será calculado externamente se necessário
  };
}

/**
 * Gera análise de evolução geral baseada nas variações
 */
export function gerarEvolucaoGeral(variacoes: VariacaoIndicadores): EvolucaoGeral {
  const indicadores = Object.entries(variacoes);
  
  let indicadores_melhoraram = 0;
  let indicadores_pioraram = 0;
  let indicadores_estaveis = 0;
  let score_total = 0;

  indicadores.forEach(([indicador, variacao]) => {
    const peso = getPesoIndicador(indicador as keyof VariacaoIndicadores);
    const score = variacao * peso;
    score_total += score;

    if (Math.abs(variacao) < 0.05) { // Variação menor que 5% é considerada estável
      indicadores_estaveis++;
    } else if (isMelhora(indicador as keyof VariacaoIndicadores, variacao)) {
      indicadores_melhoraram++;
    } else {
      indicadores_pioraram++;
    }
  });

  // Determinar status da evolução
  let status: EvolucaoGeral['status'];
  if (indicadores_melhoraram > indicadores_pioraram && indicadores_melhoraram > indicadores_estaveis) {
    status = 'melhora';
  } else if (indicadores_pioraram > indicadores_melhoraram && indicadores_pioraram > indicadores_estaveis) {
    status = 'piora';
  } else if (indicadores_estaveis > indicadores_melhoraram && indicadores_estaveis > indicadores_pioraram) {
    status = 'estavel';
  } else {
    status = 'mista';
  }

  // Gerar descrição
  const descricao = gerarDescricaoEvolucao(status, indicadores_melhoraram, indicadores_pioraram, indicadores_estaveis);

  return {
    status,
    descricao,
    indicadores_melhoraram,
    indicadores_pioraram,
    indicadores_estaveis,
    score_evolucao: Math.round(score_total * 100) / 100
  };
}

/**
 * Determina se uma variação representa melhora para um indicador específico
 */
function isMelhora(indicador: keyof VariacaoIndicadores, variacao: number): boolean {
  switch (indicador) {
    case 'densidade_capilar':
      return variacao > 0; // Aumento é melhora
    case 'oleosidade':
    case 'descamacao':
    case 'miniaturizacao':
    case 'inflamacao':
      return variacao < 0; // Redução é melhora
    default:
      return false;
  }
}

/**
 * Retorna o peso de cada indicador para cálculo do score
 */
function getPesoIndicador(indicador: keyof VariacaoIndicadores): number {
  const pesos = {
    densidade_capilar: 3.0, // Mais importante
    oleosidade: 2.0,
    miniaturizacao: 2.5,
    inflamacao: 2.0,
    descamacao: 1.5 // Menos importante
  };
  return pesos[indicador];
}

/**
 * Gera descrição textual da evolução
 */
function gerarDescricaoEvolucao(
  status: EvolucaoGeral['status'],
  melhoraram: number,
  pioraram: number,
  estaveis: number
): string {
  switch (status) {
    case 'melhora':
      if (melhoraram >= 4) {
        return "Evolução muito positiva. Todos os indicadores principais apresentaram melhora significativa.";
      } else if (melhoraram >= 3) {
        return "Evolução positiva. Maioria dos indicadores apresentando melhora consistente.";
      } else {
        return "Evolução moderada. Alguns indicadores melhoraram, outros mantiveram-se estáveis.";
      }
    
    case 'piora':
      if (pioraram >= 4) {
        return "Evolução preocupante. Múltiplos indicadores apresentaram piora significativa.";
      } else if (pioraram >= 3) {
        return "Evolução negativa. Maioria dos indicadores apresentando piora.";
      } else {
        return "Evolução desfavorável. Alguns indicadores pioraram, requer atenção.";
      }
    
    case 'estavel':
      return "Evolução estável. Indicadores mantiveram-se dentro dos valores esperados.";
    
    case 'mista':
      return "Evolução mista. Alguns indicadores melhoraram, outros pioraram. Análise individual necessária.";
    
    default:
      return "Evolução não determinada.";
  }
}

/**
 * Formata variação numérica para string com sinal e percentual
 */
function formatarVariacao(valor: number): string {
  const sinal = valor >= 0 ? '+' : '';
  const valorAbsoluto = Math.abs(valor);
  
  if (valorAbsoluto < 0.01) {
    return '0.00';
  }
  
  return `${sinal}${Math.round(valorAbsoluto * 100) / 100}`;
}

/**
 * Calcula tempo entre duas datas em dias
 */
export function calcularTempoEntreAvaliacoes(dataAtual: string, dataAnterior: string): number {
  const atual = new Date(dataAtual);
  const anterior = new Date(dataAnterior);
  const diffTime = Math.abs(atual.getTime() - anterior.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gera resumo executivo da evolução
 */
export function gerarResumoExecutivo(comparativo: ComparativoDetalhado): string {
  const { evolucao_geral, variacao_formatada } = comparativo;
  
  let resumo = `Evolução ${evolucao_geral.status}: ${evolucao_geral.descricao}\n\n`;
  
  resumo += "Principais variações observadas:\n";
  
  // Ordenar por magnitude da variação
  const variacoes = Object.entries(variacao_formatada)
    .map(([indicador, variacao]) => ({
      indicador: formatarNomeIndicador(indicador),
      variacao: parseFloat(variacao.replace('+', '')),
      sinal: variacao.startsWith('+') ? '+' : '-'
    }))
    .sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao));
  
  variacoes.forEach(({ indicador, variacao, sinal }) => {
    if (Math.abs(variacao) >= 0.1) { // Só mostrar variações significativas
      resumo += `• ${indicador}: ${sinal}${variacao.toFixed(2)}\n`;
    }
  });
  
  if (evolucao_geral.score_evolucao > 0) {
    resumo += `\nScore de evolução: +${evolucao_geral.score_evolucao.toFixed(1)} (positivo)`;
  } else if (evolucao_geral.score_evolucao < 0) {
    resumo += `\nScore de evolução: ${evolucao_geral.score_evolucao.toFixed(1)} (negativo)`;
  } else {
    resumo += `\nScore de evolução: ${evolucao_geral.score_evolucao.toFixed(1)} (neutro)`;
  }
  
  return resumo;
}

/**
 * Formata nome do indicador para exibição
 */
function formatarNomeIndicador(indicador: string): string {
  const nomes = {
    densidade_capilar: 'Densidade Capilar',
    oleosidade: 'Oleosidade',
    descamacao: 'Descamação',
    miniaturizacao: 'Miniaturização',
    inflamacao: 'Inflamação'
  };
  return nomes[indicador as keyof typeof nomes] || indicador;
}

/**
 * Valida se duas avaliações podem ser comparadas
 */
export function validarComparacao(atual: AnaliseQuantitativa, anterior: AnaliseQuantitativa): boolean {
  return !!(
    atual &&
    anterior &&
    typeof atual.densidade_capilar === 'number' &&
    typeof anterior.densidade_capilar === 'number' &&
    typeof atual.oleosidade === 'number' &&
    typeof anterior.oleosidade === 'number' &&
    typeof atual.descamacao === 'number' &&
    typeof anterior.descamacao === 'number' &&
    typeof atual.miniaturizacao === 'number' &&
    typeof anterior.miniaturizacao === 'number' &&
    typeof atual.inflamacao === 'number' &&
    typeof anterior.inflamacao === 'number'
  );
}
