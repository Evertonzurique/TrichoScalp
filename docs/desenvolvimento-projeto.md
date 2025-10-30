# TrichoScalp — Documento de Desenvolvimento do Projeto

Este documento consolida o estado atual do desenvolvimento do projeto TrichoScalp, cobrindo objetivos, arquitetura, estrutura, progresso, próximos passos e instruções de uso. A linguagem é técnica e objetiva, com diagramas e exemplos de código para facilitar o entendimento.

## 1. Introdução

### Objetivos e Propósito
- Fornecer um sistema SaaS para profissionais de tricologia (cabeleireiros, terapeutas capilares e tricologistas) que centraliza gestão de clientes, anamnese, tricoscopia e histórico de avaliações.
- Oferecer Assessoria de Anamnese com IA, gerando análises quantitativas e qualitativas, comparativos históricos e relatórios profissionais em PDF.
- Garantir segurança, escalabilidade e uma UX moderna baseada em práticas de frontend robustas.

### Contexto e Justificativa
- A tricoscopia demanda organização de dados clínicos e imagens para conclusões consistentes. O projeto sistematiza a coleta e análise, incorporando uma camada de IA baseada em literatura científica.
- Profissionais precisam consolidar dados e evoluções dos clientes ao longo do tempo, com políticas de acesso seguras e relatórios consistentes.

### Público-alvo
- Profissionais de tricologia e estética capilar.
- Clínicas e consultórios que desejam digitalizar fluxos de anamnese e tricoscopia.
- Pesquisadores e equipes técnicas que necessitam padronização e comparabilidade de avaliações.

## 2. Estrutura do Projeto

### Diagrama de Arquitetura

```mermaid
flowchart LR
    U[Usuário (Browser)] -->|Auth| FE[React + Vite + TS]
    FE -->|CRUD + Forms| DB[(Supabase Postgres)]
    FE -->|Storage SDK| ST[(Supabase Storage)]
    FE -->|Chamada HTTP| EF[Supabase Edge Function]
    EF -->|Processamento IA| AI[Serviço/Algoritmos IA]
    FE -->|PDF| PDF[Gerador de PDF]

    subgraph Supabase
      DB
      ST
      EF
    end

    classDef svc fill:#eef,stroke:#88a;
    class EF,DB,ST svc;
```

### Organização de Diretórios e Arquivos Principais

```
TrichoScalp/
├── src/
│   ├── components/
│   │   ├── anamnese/              # Componentes de anamnese
│   │   ├── avaliacoes/            # Componentes de avaliações
│   │   ├── clientes/              # Componentes de clientes
│   │   └── ui/                    # Base UI (shadcn-ui)
│   ├── hooks/
│   │   ├── useAnaliseIA.ts        # Hook para análise IA
│   │   └── useStorageUpload.ts    # Hook para upload de imagens
│   ├── lib/
│   │   ├── ia-anamnese.ts         # Serviço/transformação de análise IA
│   │   ├── comparativo-avaliacoes.ts
│   │   ├── pdf-generator.ts       # Geração de PDF
│   │   ├── referencias-cientificas.ts
│   │   └── storage.ts             # Utilitários de storage
│   ├── pages/                     # Páginas da aplicação
│   │   ├── Auth.tsx               # Autenticação
│   │   ├── Clientes.tsx           # Gestão de clientes
│   │   ├── Anamnese.tsx           # Coleta de dados clínicos
│   │   ├── AvaliacaoHistorico.tsx # Histórico / comparativos
│   │   ├── Dashboard.tsx          # Visão geral
│   │   └── SelecionarCliente.tsx  # Fluxo de seleção
│   └── main.tsx / App.tsx         # Bootstrapping e roteamento
├── supabase/
│   ├── migrations/                # Migrações de banco
│   └── functions/
│       └── analisar-tricoscopia/  # Edge Function IA
├── docs/                          # Documentação
│   └── referencias-cientificas.md # Base científica da análise
├── README.md                      # Visão geral e instruções rápidas
├── .env / .env.local              # Configuração ambiente
└── package.json / vite.config.ts  # Configuração de build
```

### Dependências e Tecnologias Utilizadas
- Frontend: `React 18`, `Vite`, `TypeScript`
- UI/Estilo: `Tailwind CSS`, `shadcn-ui`, `lucide-react`
- Formulários/Validação: `react-hook-form`, `zod`
- Visualização: `recharts`
- PDF: `jspdf`, `html2canvas`
- Backend-as-a-Service: `Supabase` (Auth, PostgREST, Storage, Edge Functions)
- Banco de Dados: `PostgreSQL` com campos `JSONB`
- Segurança: `Row Level Security (RLS)` nas tabelas e policies em buckets

## 3. Progresso Atual

### Funcionalidades Implementadas
- Gestão de clientes com consentimento de IA e dados pessoais/clínicos.
- Anamnese digital estruturada com coleta e persistência de dados.
- Tricoscopia com upload organizado de imagens (buckets `tricoscopia` e `fotos-cliente`).
- Histórico de avaliações e comparativo temporal entre medições.
- Assessoria de Anamnese com IA (mock e algoritmos determinísticos), incluindo:
  - Análise quantitativa: densidade, oleosidade, descamação, miniaturização, inflamação.
  - Análise qualitativa: resumo, achados e recomendações.
  - Comparativo com avaliação anterior e interpretação final.
- Geração de relatório profissional em PDF (dados + imagens + gráficos).
- Políticas de segurança e índices otimizados em banco e storage.

### Desafios Encontrados e Soluções Adotadas
- Upload e organização de imagens: criado fluxo com hooks dedicados (`useStorageUpload`) e mapeamento de posições padrão (frontal/meio/posterior), garantindo feedback de progresso.
- Segurança de dados: aplicação de RLS nas tabelas e criação de policies de acesso em buckets; separação de escopos por `user_id` e `cliente_id`.
- Processamento IA: uso de Edge Function para isolamento do processamento e preparo para substituição de mock por API real; definição de schema de resposta consistente.
- Comparativos históricos: índices (`cliente_id, created_at DESC`) e utilitários (`comparativo-avaliacoes.ts`) para cálculo eficiente de variações.
- Geração de PDF: padronização de layouts com `jsPDF` e captura de componentes com `html2canvas`, mitigando diferenças de renderização.

### Exemplos de Código Relevantes

Edge Function — estrutura de resposta consolidada:

```ts
// supabase/functions/analisar-tricoscopia/index.ts (trecho)
const result = {
  cliente_id: clienteId,
  avaliacao_id: avaliacaoId,
  data_avaliacao: now.toISOString().slice(0, 10),
  grupos_imagens: {
    grupo_1: { descricao: "Imagens tricoscópicas 10x-200x", urls: tricoscopicas },
    grupo_2: { descricao: "Fotos panorâmicas", urls: panoramicas }
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
```

Componente de Tricoscopia — mapeamento e upload:

```tsx
// src/components/anamnese/Tricoscopia.tsx (trecho)
interface AvaliacaoPadraoImages {
  frontalEsquerda?: string;
  meioFrontal?: string;
  frontalDireita?: string;
  meioEsquerda?: string;
  meio?: string;
  meioDireita?: string;
  posteriorEsquerda?: string;
  posteriorMeio?: string;
  posteriorDireita?: string;
}

// Hook de upload provê progresso, toast e validação de tipo
const { uploadImage, progress } = useSingleImageUpload({ bucket: "tricoscopia" });
```

Migração de Banco — campos e índices para IA e consentimento:

```sql
-- supabase/migrations/20250125000000_add_ia_anamnese_features.sql (trecho)
ALTER TABLE public.avaliacoes ADD COLUMN analise_ia JSONB;
ALTER TABLE public.clientes ADD COLUMN consentimento_ia BOOLEAN DEFAULT false,
  ADD COLUMN consentimento_ia_data TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_avaliacoes_analise_ia ON public.avaliacoes USING GIN (analise_ia);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cliente_created ON public.avaliacoes (cliente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_consentimento_ia ON public.clientes (consentimento_ia);
```

## 4. Próximos Passos

### Roadmap de Desenvolvimento
- Substituir mock de IA por integração com API real (Edge Function → serviço externo) com chaves e rotas seguras.
- Expandir painéis e visualizações (gráficos avançados, filtros por período/condição).
- Melhorar UX de upload (arrastar/soltar, processamento em lote, pré-visualização).
- Auditoria e trilhas de acesso (logs detalhados e monitoramento de políticas RLS).
- Testes automatizados (unitários em hooks/libs e e2e para fluxos críticos).
- Otimizações de performance (code-splitting, memoização, caching de requests).

### Funcionalidades Planejadas
- Template de laudo personalizável para PDF (branding e campos dinâmicos).
- Módulo de protocolos de tratamento com vínculo a achados IA.
- Exportações adicionais (CSV/JSON) e integrações com storage externo.
- Internacionalização (i18n) e acessibilidade (a11y) aprimorada.

### Prazos Estimados
- Integração IA real: 2–3 semanas.
- Visualizações avançadas e UX de upload: 2 semanas.
- Testes e monitoramento: 1–2 semanas.
- PDFs personalizáveis e i18n/a11y: 2–3 semanas.

## 5. Instruções de Uso

### Requisitos do Sistema
- `Node.js 18+` e `npm`
- Conta e projeto no `Supabase`
- Acesso a variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)

### Como Executar/Configurar

```bash
# 1) Instalação
git clone <URL_DO_REPOSITORIO>
cd TrichoScalp
npm install

# 2) Ambiente
cp .env.example .env.local
# Edite .env.local com URL e chave pública do Supabase

# 3) Banco e Funções
npx supabase db push
npx supabase functions deploy analisar-tricoscopia

# 4) Dev server
npm run dev
```

### Dicas para Desenvolvimento
- Use contas de teste no Supabase e habilite RLS com policies apropriadas para leitura/escrita.
- Utilize buckets `tricoscopia` e `fotos-cliente` com tipos de imagem suportados (jpeg/png/webp).
- Estruture commits por módulo (clientes, anamnese, tricoscopia, IA) e mantenha PRs focados.
- Para gerar PDFs, valide dimensões de componentes e teste renderização com `html2canvas` em diversos navegadores.
- Ao preparar a IA real, centralize chamadas e secrets na Edge Function, isolando credenciais (via `Deno.env`).

---

## Anexos e Referências
- Documentação base: `README.md` e `DEPLOY_IA.md`.
- Referências científicas: `docs/referencias-cientificas.md`.
- Configurações UI: `components.json` (aliases e Tailwind).
- Metadados HTML/SEO: `index.html`.

Última atualização: Janeiro 2025