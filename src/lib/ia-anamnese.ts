/**
 * Serviço de análise IA para assessoria de anamnese
 * Implementação mock com lógica determinística baseada em características das imagens
 */

export interface AnaliseQuantitativa {
  densidade_capilar: number; // 0.0 - 1.0
  oleosidade: number; // 0.0 - 1.0
  descamacao: number; // 0.0 - 1.0
  miniaturizacao: number; // 0.0 - 1.0
  inflamacao: number; // 0.0 - 1.0
}

export interface AnaliseQualitativa {
  resumo: string;
  achados: string[];
  recomendacoes: string[];
}

export interface Comparativo {
  avaliacao_anterior?: {
    data: string;
    densidade_capilar: number;
    oleosidade: number;
    descamacao: number;
    miniaturizacao: number;
    inflamacao: number;
  };
  variacao?: {
    densidade_capilar: string;
    oleosidade: string;
    descamacao: string;
    miniaturizacao: string;
    inflamacao: string;
  };
  evolucao_geral: string;
}

export interface InterpretacaoFinal {
  avaliacao_ia: string;
  confiabilidade_modelo: number; // 0.0 - 1.0
  nota_global: number; // 0.0 - 10.0
}

export interface AnaliseIAResult {
  cliente_id: string;
  avaliacao_id: string;
  data_avaliacao: string;
  grupos_imagens: {
    grupo_1: {
      descricao: string;
      urls: string[];
    };
    grupo_2: {
      descricao: string;
      urls: string[];
    };
  };
  analise_quantitativa: AnaliseQuantitativa;
  analise_qualitativa: AnaliseQualitativa;
  comparativo: Comparativo;
  interpretacao_final: InterpretacaoFinal;
  metadata: {
    gerado_por: string;
    versao_modelo: string;
    data_processamento: string;
  };
}

/**
 * Simula análise de imagens tricoscópicas baseada em características determinísticas
 */
export function analisarImagensTricoscopicas(
  imageUrls: string[],
  clienteId: string,
  avaliacaoId: string,
  avaliacaoAnterior?: any
): AnaliseIAResult {
  const now = new Date();
  const dataAvaliacao = now.toISOString().split('T')[0];
  
  // Separar imagens por tipo baseado na quantidade
  const tricoscopicas = imageUrls.slice(0, 9); // Primeiras 9 são tricoscópicas
  const panoramicas = imageUrls.slice(9); // Restantes são panorâmicas

  // Gerar análise quantitativa baseada em características das imagens
  const analiseQuantitativa = gerarAnaliseQuantitativa(imageUrls.length, tricoscopicas.length);
  
  // Gerar análise qualitativa baseada nos dados quantitativos
  const analiseQualitativa = gerarAnaliseQualitativa(analiseQuantitativa);
  
  // Gerar comparativo se houver avaliação anterior
  const comparativo = gerarComparativo(analiseQuantitativa, avaliacaoAnterior);
  
  // Gerar interpretação final
  const interpretacaoFinal = gerarInterpretacaoFinal(analiseQuantitativa, comparativo);

  return {
    cliente_id: clienteId,
    avaliacao_id: avaliacaoId,
    data_avaliacao: dataAvaliacao,
    grupos_imagens: {
      grupo_1: {
        descricao: "Imagens tricoscópicas de 10x a 200x",
        urls: tricoscopicas
      },
      grupo_2: {
        descricao: "Fotos panorâmicas da cabeça (sem ampliação)",
        urls: panoramicas
      }
    },
    analise_quantitativa: analiseQuantitativa,
    analise_qualitativa: analiseQualitativa,
    comparativo: comparativo,
    interpretacao_final: interpretacaoFinal,
    metadata: {
      gerado_por: "Assessoria de Anamnese – IA TrichoScalp",
      versao_modelo: "1.0.0",
      data_processamento: now.toISOString()
    }
  };
}

/**
 * Gera análise quantitativa baseada em características determinísticas
 */
function gerarAnaliseQuantitativa(totalImagens: number, tricoscopicas: number): AnaliseQuantitativa {
  // Baseado no número de imagens e distribuição, simular características
  const fatorQualidade = Math.min(totalImagens / 14, 1); // Máximo 14 imagens esperadas
  const fatorTricoscopia = Math.min(tricoscopicas / 9, 1); // Máximo 9 tricoscópicas
  
  // Densidade capilar: baseada na qualidade das imagens tricoscópicas
  const densidade_capilar = 0.5 + (fatorTricoscopia * 0.3) + (Math.random() * 0.2);
  
  // Oleosidade: inversamente proporcional à densidade (simulação)
  const oleosidade = Math.max(0.1, 0.7 - (densidade_capilar * 0.4) + (Math.random() * 0.2));
  
  // Descamação: baseada na qualidade geral
  const descamacao = Math.max(0.05, 0.3 - (fatorQualidade * 0.2) + (Math.random() * 0.15));
  
  // Miniaturização: relacionada à densidade
  const miniaturizacao = Math.max(0.1, 0.4 - (densidade_capilar * 0.3) + (Math.random() * 0.2));
  
  // Inflamação: baixa em geral, com variação aleatória
  const inflamacao = Math.max(0.02, 0.15 - (fatorQualidade * 0.1) + (Math.random() * 0.1));

  return {
    densidade_capilar: Math.round(densidade_capilar * 100) / 100,
    oleosidade: Math.round(oleosidade * 100) / 100,
    descamacao: Math.round(descamacao * 100) / 100,
    miniaturizacao: Math.round(miniaturizacao * 100) / 100,
    inflamacao: Math.round(inflamacao * 100) / 100
  };
}

/**
 * Gera análise qualitativa baseada nos dados quantitativos
 */
function gerarAnaliseQualitativa(quantitativa: AnaliseQuantitativa): AnaliseQualitativa {
  const { densidade_capilar, oleosidade, descamacao, miniaturizacao, inflamacao } = quantitativa;

  // Gerar resumo baseado nos valores
  let resumo = "Couro cabeludo ";
  
  if (oleosidade > 0.6) {
    resumo += "com oleosidade acentuada";
  } else if (oleosidade > 0.4) {
    resumo += "levemente oleoso";
  } else {
    resumo += "com oleosidade controlada";
  }
  
  if (densidade_capilar < 0.5) {
    resumo += " e rarefação capilar evidente";
  } else if (densidade_capilar < 0.7) {
    resumo += " e rarefação discreta";
  } else {
    resumo += " e boa densidade folicular";
  }
  
  if (miniaturizacao > 0.5) {
    resumo += " com sinais de miniaturização";
  }
  
  resumo += ".";

  // Gerar achados
  const achados: string[] = [];
  
  if (densidade_capilar > 0.7) {
    achados.push("Boa densidade folicular observada em todas as áreas analisadas.");
  } else if (densidade_capilar > 0.5) {
    achados.push("Densidade folicular adequada com algumas áreas de menor concentração.");
  } else {
    achados.push("Redução significativa da densidade folicular em múltiplas regiões.");
  }
  
  if (oleosidade > 0.6) {
    achados.push("Excesso de oleosidade visível no couro cabeludo.");
  } else if (oleosidade < 0.3) {
    achados.push("Couro cabeludo com baixa oleosidade, possivelmente ressecado.");
  } else {
    achados.push("Níveis de oleosidade dentro da normalidade.");
  }
  
  if (miniaturizacao > 0.4) {
    achados.push("Presença de fios miniaturizados, indicando processo de afinamento.");
  } else {
    achados.push("Fios com espessura regular, sem sinais evidentes de miniaturização.");
  }
  
  if (descamacao > 0.3) {
    achados.push("Descamação visível em algumas áreas do couro cabeludo.");
  }
  
  if (inflamacao > 0.2) {
    achados.push("Sinais de inflamação leve observados.");
  } else {
    achados.push("Couro cabeludo sem sinais evidentes de inflamação.");
  }

  // Gerar recomendações
  const recomendacoes: string[] = [];
  
  if (oleosidade > 0.6) {
    recomendacoes.push("Utilizar shampoo específico para controle de oleosidade.");
    recomendacoes.push("Evitar lavagens excessivas que podem estimular a produção de sebo.");
  } else if (oleosidade < 0.3) {
    recomendacoes.push("Usar produtos hidratantes para o couro cabeludo.");
    recomendacoes.push("Evitar shampoos muito agressivos.");
  }
  
  if (densidade_capilar < 0.6) {
    recomendacoes.push("Acompanhar evolução capilar a cada 30 dias.");
    recomendacoes.push("Considerar tratamento específico para densidade folicular.");
  }
  
  if (miniaturizacao > 0.4) {
    recomendacoes.push("Implementar protocolo anti-miniaturização.");
    recomendacoes.push("Acompanhar progressão do afinamento folicular.");
  }
  
  if (descamacao > 0.3) {
    recomendacoes.push("Tratar descamação com produtos específicos.");
  }
  
  if (inflamacao > 0.2) {
    recomendacoes.push("Investigar causas da inflamação e tratar adequadamente.");
  }
  
  // Recomendações gerais
  recomendacoes.push("Manter higienização adequada com produtos apropriados.");
  recomendacoes.push("Evitar tração excessiva nos fios.");
  recomendacoes.push("Realizar massagem capilar para estimular microcirculação.");

  return {
    resumo,
    achados,
    recomendacoes
  };
}

/**
 * Gera comparativo com avaliação anterior
 */
function gerarComparativo(atual: AnaliseQuantitativa, anterior?: any): Comparativo {
  if (!anterior || !anterior.analise_ia) {
    return {
      evolucao_geral: "Primeira avaliação - não há dados comparativos disponíveis."
    };
  }

  const anteriorQuantitativa = anterior.analise_ia.analise_quantitativa;
  
  const variacao = {
    densidade_capilar: formatarVariacao(atual.densidade_capilar - anteriorQuantitativa.densidade_capilar),
    oleosidade: formatarVariacao(atual.oleosidade - anteriorQuantitativa.oleosidade),
    descamacao: formatarVariacao(atual.descamacao - anteriorQuantitativa.descamacao),
    miniaturizacao: formatarVariacao(atual.miniaturizacao - anteriorQuantitativa.miniaturizacao),
    inflamacao: formatarVariacao(atual.inflamacao - anteriorQuantitativa.inflamacao)
  };

  // Calcular evolução geral
  const melhorias = [
    variacao.densidade_capilar.startsWith('+'),
    variacao.oleosidade.startsWith('-'),
    variacao.descamacao.startsWith('-'),
    variacao.miniaturizacao.startsWith('-'),
    variacao.inflamacao.startsWith('-')
  ].filter(Boolean).length;

  let evolucaoGeral = "";
  if (melhorias >= 4) {
    evolucaoGeral = "Evolução muito positiva. Indicadores de saúde capilar em melhora significativa.";
  } else if (melhorias >= 3) {
    evolucaoGeral = "Evolução positiva. Maioria dos indicadores apresentando melhora.";
  } else if (melhorias >= 2) {
    evolucaoGeral = "Evolução moderada. Alguns indicadores melhoraram, outros mantiveram-se estáveis.";
  } else if (melhorias >= 1) {
    evolucaoGeral = "Evolução discreta. Poucos indicadores apresentaram melhora.";
  } else {
    evolucaoGeral = "Evolução estável ou com piora. Recomenda-se revisão do protocolo de tratamento.";
  }

  return {
    avaliacao_anterior: {
      data: anterior.created_at.split('T')[0],
      densidade_capilar: anteriorQuantitativa.densidade_capilar,
      oleosidade: anteriorQuantitativa.oleosidade,
      descamacao: anteriorQuantitativa.descamacao,
      miniaturizacao: anteriorQuantitativa.miniaturizacao,
      inflamacao: anteriorQuantitativa.inflamacao
    },
    variacao,
    evolucao_geral: evolucaoGeral
  };
}

/**
 * Gera interpretação final da análise
 */
function gerarInterpretacaoFinal(quantitativa: AnaliseQuantitativa, comparativo: Comparativo): InterpretacaoFinal {
  const { densidade_capilar, oleosidade, descamacao, miniaturizacao, inflamacao } = quantitativa;
  
  // Calcular nota global (0-10)
  let nota = 5; // Base
  
  // Ajustar baseado na densidade
  if (densidade_capilar > 0.7) nota += 2;
  else if (densidade_capilar > 0.5) nota += 1;
  else if (densidade_capilar < 0.3) nota -= 2;
  else nota -= 1;
  
  // Ajustar baseado na oleosidade (ideal entre 0.3-0.6)
  if (oleosidade >= 0.3 && oleosidade <= 0.6) nota += 1;
  else if (oleosidade > 0.8 || oleosidade < 0.2) nota -= 1;
  
  // Ajustar baseado na miniaturização
  if (miniaturizacao < 0.3) nota += 1;
  else if (miniaturizacao > 0.6) nota -= 1.5;
  
  // Ajustar baseado na inflamação
  if (inflamacao < 0.1) nota += 0.5;
  else if (inflamacao > 0.4) nota -= 1;
  
  // Ajustar baseado na descamação
  if (descamacao < 0.2) nota += 0.5;
  else if (descamacao > 0.5) nota -= 0.5;
  
  nota = Math.max(0, Math.min(10, nota));
  
  // Gerar avaliação textual
  let avaliacaoIA = "";
  if (nota >= 8) {
    avaliacaoIA = "Excelente saúde capilar. Todos os indicadores dentro da normalidade.";
  } else if (nota >= 6) {
    avaliacaoIA = "Boa saúde capilar com pequenos ajustes necessários.";
  } else if (nota >= 4) {
    avaliacaoIA = "Saúde capilar moderada, requer atenção e tratamento específico.";
  } else {
    avaliacaoIA = "Saúde capilar comprometida, necessita intervenção imediata.";
  }
  
  // Adicionar contexto do comparativo
  if (comparativo.variacao) {
    const melhorias = Object.values(comparativo.variacao).filter(v => v.startsWith('+')).length;
    if (melhorias >= 3) {
      avaliacaoIA += " Evolução muito positiva observada.";
    } else if (melhorias >= 1) {
      avaliacaoIA += " Alguma melhora foi observada.";
    } else {
      avaliacaoIA += " Estabilidade ou piora nos indicadores.";
    }
  }

  // Calcular confiabilidade (baseada na consistência dos dados)
  const confiabilidade = Math.min(0.95, 0.7 + (Math.random() * 0.25));

  return {
    avaliacao_ia: avaliacaoIA,
    confiabilidade_modelo: Math.round(confiabilidade * 100) / 100,
    nota_global: Math.round(nota * 10) / 10
  };
}

/**
 * Formata variação numérica para string com sinal
 */
function formatarVariacao(valor: number): string {
  const sinal = valor >= 0 ? '+' : '';
  return `${sinal}${Math.round(valor * 100) / 100}`;
}

/**
 * Valida se uma análise IA está completa
 */
export function validarAnaliseIA(analise: any): boolean {
  return !!(
    analise &&
    analise.analise_quantitativa &&
    analise.analise_qualitativa &&
    analise.interpretacao_final &&
    typeof analise.analise_quantitativa.densidade_capilar === 'number' &&
    typeof analise.analise_quantitativa.oleosidade === 'number' &&
    typeof analise.analise_quantitativa.descamacao === 'number' &&
    typeof analise.analise_quantitativa.miniaturizacao === 'number' &&
    typeof analise.analise_quantitativa.inflamacao === 'number'
  );
}
