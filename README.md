# TrichoScalp - Sistema de Gestão para Tricologia

TrichoScalp é um SaaS desenvolvido em React + Supabase, voltado a cabeleireiros, terapeutas capilares e tricologistas. O sistema oferece módulos completos de gestão de clientes, anamnese, tricoscopia e **Assessoria de Anamnese com Inteligência Artificial**.

## 🚀 Funcionalidades Principais

### Módulos Básicos
- **Gestão de Clientes**: Cadastro completo com dados pessoais e clínicos
- **Anamnese Digital**: Formulários estruturados para coleta de informações
- **Tricoscopia**: Upload e organização de imagens tricoscópicas e panorâmicas
- **Histórico de Avaliações**: Acompanhamento temporal das avaliações

### 🧠 Assessoria de Anamnese com IA (NOVO)
- **Análise Automatizada**: Processamento de imagens tricoscópicas via IA
- **Relatórios Quantitativos**: Densidade, oleosidade, descamação, miniaturização, inflamação
- **Relatórios Qualitativos**: Interpretação clínica e recomendações personalizadas
- **Comparativo Histórico**: Evolução entre avaliações com gráficos temporais
- **Exportação PDF**: Relatórios profissionais completos com imagens e gráficos
- **Armazenamento Seguro**: Imagens no Supabase Storage com políticas RLS

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn-ui** para interface
- **React Hook Form** + **Zod** para formulários
- **Recharts** para gráficos e visualizações
- **jsPDF** + **html2canvas** para geração de PDFs

### Backend
- **Supabase** (Auth, PostgREST, Storage, Edge Functions)
- **PostgreSQL** com tabelas JSONB para flexibilidade
- **Row Level Security (RLS)** para segurança de dados

### IA e Análise
- **Edge Functions** para processamento de análise IA
- **Algoritmos determinísticos** baseados em literatura científica
- **Referências científicas** de tricoscopia e dermatologia

## 📋 Estrutura de Dados

### Tabela `avaliacoes`
```sql
- id: UUID (PK)
- cliente_id: UUID (FK)
- user_id: UUID
- queixa_principal: JSONB
- dados_clinicos: JSONB
- tratamentos_anteriores: JSONB
- historico_saude: JSONB
- habitos: JSONB
- historico_familiar: JSONB
- exame_fisico: JSONB
- tricoscopia: JSONB
- informacoes: JSONB
- analise_ia: JSONB (NOVO)
- status: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Tabela `clientes`
```sql
- id: UUID (PK)
- user_id: UUID
- nome: TEXT
- email: TEXT
- telefone: TEXT
- data_nascimento: DATE
- cpf: TEXT
- endereco: TEXT
- cidade: TEXT
- estado: TEXT
- observacoes: TEXT
- consentimento_ia: BOOLEAN (NOVO)
- consentimento_ia_data: TIMESTAMP (NOVO)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Storage Buckets
- **`tricoscopia`**: Imagens tricoscópicas (10x-200x)
- **`fotos-cliente`**: Fotos panorâmicas do couro cabeludo

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ e npm
- Conta no Supabase
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd TrichoScalp

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Execute as migrações do banco
npx supabase db push

# 5. Deploy da Edge Function (opcional)
npx supabase functions deploy analisar-tricoscopia

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Para builds com Vite (local e Vercel), use as chaves abaixo. O cliente aceita ambos os nomes para a chave pública:

```env
VITE_SUPABASE_URL="https://<sua-instancia>.supabase.co"
VITE_SUPABASE_ANON_KEY="<sua-chave-anon-publica>"
# Alternativa aceita (caso já esteja usando este nome):
VITE_SUPABASE_PUBLISHABLE_KEY="<sua-chave-anon-publica>"
# Alias opcional (não recomendado, mas suportado):
VITE_SUPABASE_KEY="<sua-chave-anon-publica>"
```

Em Vercel, configure em `Settings → Environment Variables` e garanta que as variáveis estejam presentes nos ambientes `Production`, `Preview` e `Development` quando necessário. Após atualizar, faça um redeploy.

## 📊 Estrutura da Análise IA

### Dados Quantitativos
- **Densidade Capilar**: 0.0 - 1.0 (percentual de cobertura folicular)
- **Oleosidade**: 0.0 - 1.0 (área oleosa do couro cabeludo)
- **Descamação**: 0.0 - 1.0 (área descamativa)
- **Miniaturização**: 0.0 - 1.0 (fios miniaturizados)
- **Inflamação**: 0.0 - 1.0 (área inflamada)

### Dados Qualitativos
- **Resumo**: Interpretação geral da análise
- **Achados**: Lista de observações específicas
- **Recomendações**: Orientações personalizadas baseadas nos achados

### Comparativo Histórico
- **Variações**: Comparação com avaliação anterior
- **Evolução**: Status geral (melhora/piora/estável)
- **Score**: Pontuação de evolução (-100 a +100)

## 🔬 Referências Científicas

O sistema baseia-se em literatura científica reconhecida:

- Rudnicka, L. et al. (2008). "Hair shafts in trichoscopy: clues for diagnosis"
- Ross, E.K. et al. (2008). "Videodermoscopy in the evaluation of hair disorders"
- Miteva, M. & Tosti, A. (2012). "Hair and scalp dermatoscopy"
- Rakowska, A. et al. (2009). "Dermoscopy in female androgenic alopecia"

Ver [docs/referencias-cientificas.md](docs/referencias-cientificas.md) para lista completa.

## 🔒 Segurança e LGPD

- **Consentimento Explícito**: Termo de consentimento para análise IA
- **Armazenamento Seguro**: Imagens criptografadas no Supabase Storage
- **RLS Policies**: Acesso restrito por usuário
- **Não Persistência**: PDFs não são armazenados no servidor
- **Conformidade LGPD**: Direitos de acesso, correção e exclusão

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── anamnese/          # Componentes de anamnese
│   ├── avaliacoes/        # Componentes de avaliações
│   ├── clientes/          # Componentes de clientes
│   └── ui/                # Componentes base (shadcn-ui)
├── hooks/
│   ├── useAnaliseIA.ts    # Hooks para análise IA
│   └── useStorageUpload.ts # Hooks para upload
├── lib/
│   ├── storage.ts         # Utilitários de storage
│   ├── ia-anamnese.ts     # Serviço de análise IA
│   ├── comparativo-avaliacoes.ts # Comparativo
│   └── referencias-cientificas.ts # Referências
├── pages/                 # Páginas da aplicação
└── integrations/
    └── supabase/          # Configuração Supabase

supabase/
├── migrations/            # Migrações do banco
└── functions/             # Edge Functions
    └── analisar-tricoscopia/
```

## 🚀 Deploy

### Supabase
```bash
# Deploy das migrações
npx supabase db push

# Deploy da Edge Function
npx supabase functions deploy analisar-tricoscopia
```

### Frontend
O projeto pode ser deployado em qualquer plataforma que suporte React:
- Vercel
- Netlify
- Railway
- Lovable (recomendado)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)

## 📄 Relatório de Tricologia (PDF)

O projeto inclui um módulo completo para geração de relatórios em PDF com base em dados de anamnese, imagens de tricoscopia e análise de IA.

- Bibliotecas usadas: `jspdf`, `html2canvas`, `qrcode`, `recharts`
- Upload opcional para `Supabase Storage` (bucket `relatorios`)
- Geração de gráficos e captura via `html2canvas`
- Inclusão de QR Code e metadados

### Uso rápido

1) Importe e use o hook:

```tsx
import { usePDFGenerator, useTrichologyReportData } from "@/hooks/usePDFGenerator";

const { generatePDF } = usePDFGenerator();
const { prepareReportData } = useTrichologyReportData();

// Monte os dados a partir das suas fontes
const reportData = prepareReportData(paciente, anamnese, imagens, analiseIA, profissional);

await generatePDF(reportData, {
  theme: 'light',            // 'light' | 'dark'
  includeQRCode: true,       // adiciona QR code com metadados
  autoDownload: true,        // efetua download automático
  uploadToStorage: false     // envia para Supabase Storage se true
});
```

2) Upload para Supabase:

```tsx
await generatePDF(reportData, {
  uploadToStorage: true,
  autoDownload: false,
});
// URL pública estará disponível em `publicUrl` retornado pelo hook
```

### Página de teste

- Rota: `/test-pdf`
- Componentes: `src/components/test/PDFTestComponent.tsx` e `src/pages/TestPDF.tsx`
- Permite testar geração, download e upload com dados de exemplo

### Requisitos de ambiente

- `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Bucket `relatorios` criado no Supabase Storage

### Compatibilidade e dicas

- `html2canvas`: usa `useCORS` e imagens públicas. Prefira URLs acessíveis/anônimas.
- Imagens externas: habilite `CORS` ou faça upload para o Storage com URL assinada.
- `jsPDF`: geração em A4, mantém boa compatibilidade em navegadores modernos.
- Caso ocorra bloqueio de fontes, use fontes padrão do navegador ou configure fontes incorporadas.

3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato através dos issues do GitHub.

---

**Desenvolvido com ❤️ para a comunidade de tricologia**
