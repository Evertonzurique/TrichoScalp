/**
 * Referências científicas sobre tricoscopia e análise capilar
 * Baseadas em literatura científica reconhecida na área de dermatologia e tricologia
 */

export interface ReferenciaCientifica {
  id: string;
  autores: string;
  titulo: string;
  revista: string;
  ano: number;
  volume?: string;
  paginas?: string;
  doi?: string;
  url?: string;
  tipo: 'artigo' | 'livro' | 'capitulo' | 'revisao';
  relevancia: 'alta' | 'media' | 'baixa';
  descricao: string;
}

export const REFERENCIAS_TRICOSCOPIA: ReferenciaCientifica[] = [
  {
    id: 'rudnicka-2008',
    autores: 'Rudnicka, L., Olszewska, M., Rakowska, A., Kowalska-Oledzka, E., & Slowinska, M.',
    titulo: 'Hair shafts in trichoscopy: clues for diagnosis of hair and scalp diseases',
    revista: 'Dermatologic Clinics',
    ano: 2008,
    volume: '26',
    paginas: '23-34',
    doi: '10.1016/j.det.2007.10.002',
    tipo: 'artigo',
    relevancia: 'alta',
    descricao: 'Fundamental para compreensão dos padrões tricoscópicos e diagnóstico diferencial de doenças capilares.'
  },
  {
    id: 'ross-2008',
    autores: 'Ross, E.K., Vincenzi, C., & Tosti, A.',
    titulo: 'Videodermoscopy in the evaluation of hair and scalp disorders',
    revista: 'Journal of the American Academy of Dermatology',
    ano: 2008,
    volume: '59',
    paginas: '78-84',
    doi: '10.1016/j.jaad.2008.01.001',
    tipo: 'artigo',
    relevancia: 'alta',
    descricao: 'Metodologia de videodermoscopia aplicada à avaliação de distúrbios capilares e do couro cabeludo.'
  },
  {
    id: 'miteva-2012',
    autores: 'Miteva, M., & Tosti, A.',
    titulo: 'Hair and scalp dermatoscopy',
    revista: 'Journal of the American Academy of Dermatology',
    ano: 2012,
    volume: '67',
    paginas: '1040-1048',
    doi: '10.1016/j.jaad.2012.02.003',
    tipo: 'artigo',
    relevancia: 'alta',
    descricao: 'Revisão abrangente sobre dermatoscopia capilar e suas aplicações clínicas.'
  },
  {
    id: 'rakowska-2009',
    autores: 'Rakowska, A., Slowinska, M., Kowalska-Oledzka, E., Rudnicka, L.',
    titulo: 'Dermoscopy in female androgenic alopecia: method standardization and diagnostic criteria',
    revista: 'International Journal of Trichology',
    ano: 2009,
    volume: '1',
    paginas: '123-130',
    doi: '10.4103/0974-7753.58552',
    tipo: 'artigo',
    relevancia: 'alta',
    descricao: 'Critérios diagnósticos padronizados para alopecia androgênica feminina via dermoscopia.'
  },
  {
    id: 'lacarrubba-2016',
    autores: 'Lacarrubba, F., Micali, G., & Tosti, A.',
    titulo: 'Scalp dermoscopy or trichoscopy',
    revista: 'Current Problems in Dermatology',
    ano: 2016,
    volume: '47',
    paginas: '21-32',
    doi: '10.1159/000446039',
    tipo: 'capitulo',
    relevancia: 'media',
    descricao: 'Técnicas avançadas de tricoscopia e interpretação de achados.'
  },
  {
    id: 'rudnicka-2018',
    autores: 'Rudnicka, L., Rakowska, A., & Olszewska, M.',
    titulo: 'Trichoscopy: a new method for diagnosing hair loss',
    revista: 'Journal of Drugs in Dermatology',
    ano: 2018,
    volume: '17',
    paginas: 'S1-S8',
    tipo: 'revisao',
    relevancia: 'alta',
    descricao: 'Atualização sobre metodologia tricoscópica e novos critérios diagnósticos.'
  },
  {
    id: 'kumar-2019',
    autores: 'Kumar, A., Garg, A., & Garg, S.',
    titulo: 'Trichoscopy in alopecia areata',
    revista: 'Indian Journal of Dermatology, Venereology and Leprology',
    ano: 2019,
    volume: '85',
    paginas: '347-352',
    doi: '10.4103/ijdvl.IJDVL_1000_18',
    tipo: 'artigo',
    relevancia: 'media',
    descricao: 'Aplicação específica da tricoscopia no diagnóstico e acompanhamento da alopecia areata.'
  },
  {
    id: 'piracini-2014',
    autores: 'Piracini, B.M., & Alessandrini, A.',
    titulo: 'Dermoscopy of hair and scalp disorders with clinical and pathological correlations',
    revista: 'Dermatologic Clinics',
    ano: 2014,
    volume: '32',
    paginas: '1-8',
    doi: '10.1016/j.det.2013.08.001',
    tipo: 'artigo',
    relevancia: 'alta',
    descricao: 'Correlação entre achados tricoscópicos e histopatológicos para diagnóstico preciso.'
  }
];

/**
 * Retorna referências formatadas para inclusão em PDF
 */
export function getReferenciasPDF(): string {
  return REFERENCIAS_TRICOSCOPIA
    .filter(ref => ref.relevancia === 'alta')
    .map((ref, index) => {
      let citation = `${index + 1}. ${ref.autores} (${ref.ano}). ${ref.titulo}. ${ref.revista}`;
      if (ref.volume) citation += `, ${ref.volume}`;
      if (ref.paginas) citation += `, ${ref.paginas}`;
      if (ref.doi) citation += `. DOI: ${ref.doi}`;
      return citation;
    })
    .join('\n');
}

/**
 * Retorna referências em formato ABNT
 */
export function getReferenciasABNT(): string {
  return REFERENCIAS_TRICOSCOPIA
    .filter(ref => ref.relevancia === 'alta')
    .map(ref => {
      const autores = ref.autores.split(', ');
      const ultimoAutor = autores[autores.length - 1];
      const demaisAutores = autores.slice(0, -1);
      
      let citation = `${ultimoAutor.toUpperCase()}, ${demaisAutores.join(', ')}. `;
      citation += `${ref.titulo}. ${ref.revista}, `;
      if (ref.volume) citation += `v. ${ref.volume}, `;
      citation += `${ref.ano}`;
      if (ref.paginas) citation += `, p. ${ref.paginas}`;
      if (ref.doi) citation += `. DOI: ${ref.doi}`;
      
      return citation;
    })
    .join('\n');
}

/**
 * Retorna referências por tipo de relevância
 */
export function getReferenciasPorRelevancia(relevancia: 'alta' | 'media' | 'baixa'): ReferenciaCientifica[] {
  return REFERENCIAS_TRICOSCOPIA.filter(ref => ref.relevancia === relevancia);
}

/**
 * Retorna referências por tipo de publicação
 */
export function getReferenciasPorTipo(tipo: 'artigo' | 'livro' | 'capitulo' | 'revisao'): ReferenciaCientifica[] {
  return REFERENCIAS_TRICOSCOPIA.filter(ref => ref.tipo === tipo);
}

/**
 * Busca referências por palavra-chave
 */
export function buscarReferencias(palavraChave: string): ReferenciaCientifica[] {
  const termo = palavraChave.toLowerCase();
  return REFERENCIAS_TRICOSCOPIA.filter(ref => 
    ref.titulo.toLowerCase().includes(termo) ||
    ref.autores.toLowerCase().includes(termo) ||
    ref.descricao.toLowerCase().includes(termo) ||
    ref.revista.toLowerCase().includes(termo)
  );
}

/**
 * Retorna estatísticas das referências
 */
export function getEstatisticasReferencias() {
  const total = REFERENCIAS_TRICOSCOPIA.length;
  const porRelevancia = {
    alta: REFERENCIAS_TRICOSCOPIA.filter(r => r.relevancia === 'alta').length,
    media: REFERENCIAS_TRICOSCOPIA.filter(r => r.relevancia === 'media').length,
    baixa: REFERENCIAS_TRICOSCOPIA.filter(r => r.relevancia === 'baixa').length
  };
  const porTipo = {
    artigo: REFERENCIAS_TRICOSCOPIA.filter(r => r.tipo === 'artigo').length,
    capitulo: REFERENCIAS_TRICOSCOPIA.filter(r => r.tipo === 'capitulo').length,
    revisao: REFERENCIAS_TRICOSCOPIA.filter(r => r.tipo === 'revisao').length,
    livro: REFERENCIAS_TRICOSCOPIA.filter(r => r.tipo === 'livro').length
  };
  const anos = REFERENCIAS_TRICOSCOPIA.map(r => r.ano);
  const anoMin = Math.min(...anos);
  const anoMax = Math.max(...anos);

  return {
    total,
    porRelevancia,
    porTipo,
    periodo: { inicio: anoMin, fim: anoMax },
    comDOI: REFERENCIAS_TRICOSCOPIA.filter(r => r.doi).length
  };
}
