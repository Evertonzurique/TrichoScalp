---
title: "Passo a Passo do Projeto – TrichoScalp"
author: "Equipe TrichoScalp"
version: "1.0"
date: "2025-10-30"
---

# Passo a Passo do Projeto – TrichoScalp

Documento de acompanhamento para saber onde estamos e para onde vamos. Atualizado regularmente e versionado junto com o código.

## Índice
- [Situação Atual](#situação-atual)
- [Próximos Passos](#próximos-passos)
- [Histórico](#histórico)
- [Notas de Manutenção](#notas-de-manutenção)

---

## Situação Atual

### Status do Projeto
- Status: Em desenvolvimento ativo
- Última atualização: 30/10/2025
- Ambiente de desenvolvimento:
  - Servidor dev: `http://localhost:8081/`
  - Rota de teste PDF: `http://localhost:8080/test-pdf?auto=download`

### Principais funcionalidades implementadas
- Gestão de clientes: listagem, busca e navegação (`src/pages/Clientes.tsx`).
- Coleta de anamnese e histórico de avaliações com comparativos (`src/pages/Anamnese.tsx`, `src/pages/AvaliacaoHistorico.tsx`).
- Geração de relatórios PDF clínicos: temas claro/escuro, QR Code, upload opcional ao Supabase Storage, metadados (`src/lib/pdf-generator.ts`, `src/hooks/usePDFGenerator.ts`).
- Suporte a modo claro/escuro via tokens HSL e classes `.dark` (`src/index.css`).
- Landing page com hero, features e benefícios (`src/pages/Index.tsx`).
- Integração Supabase (Auth, Storage, PostgREST) e estrutura para Edge Function de IA (`supabase/functions/analisar-tricoscopia`).

### Bloqueios / Desafios atuais
- Renderização cross-browser de PDFs com `html2canvas` (qualidade de imagem, escala, fontes incorporadas).
- Acessibilidade e contraste em modo escuro (garantir WCAG AA em todos os estados interativos).
- Políticas de segurança (RLS) e performance no Supabase para cargas de imagens tricoscópicas.
- Padronização de dados clínicos para alimentar IA (estrutura e qualidade).

### Métricas de progresso (estimativas)
- Frontend (páginas principais): ~75%
  - Páginas presentes: 9 (`Index`, `Auth`, `Dashboard`, `Clientes`, `Anamnese`, `AvaliacaoHistorico`, `SelecionarCliente`, `TestPDF`, `NotFound`).
- Módulo de PDF: ~80%
  - Geração, metadados e upload; pendente ampliação de gráficos/temas avançados.
- Integração Supabase (Auth/DB/Storage): ~70%
  - Migrações em dia; IA em Edge Function a consolidar.
- Acessibilidade/UX: ~60%
  - Meta Lighthouse Acessibilidade ≥ 90; contraste e `focus-visible` em revisão.
- Documentação: ~65%
  - `README.md`, `docs/identidade-visual.md`, `docs/guia-componentes.md`; pendente guia de impressão/exportação automática.

---

## Próximos Passos

### Roadmap (alto nível)
1. Consolidar IA na Edge Function (`analisar-tricoscopia`) com secrets e validação clínica.
2. Ampliar Dashboard com gráficos (Recharts) e KPIs clínicos/operacionais.
3. Fortalecer fluxo de autenticação (recuperação de senha, OTP quando aplicável) e UX de formulários.
4. Testes de acessibilidade e desempenho: contraste WCAG AA, Lighthouse ≥ 90, cross-browser `html2canvas`.
5. Documentar/automatizar exportação dos guias em PDF (`md-to-pdf`/`pandoc`) com cabeçalho/rodapé e paginação.

### Cronograma estimado
- Semana 1 (até 07/11/2025):
  - IA na Edge Function: integração, validação e logs.
  - Testes iniciais cross-browser de PDF (Chrome/Firefox/Edge).
- Semana 2 (até 14/11/2025):
  - Dashboard com KPIs e gráficos (Recharts), performance de renderização.
  - Ajustes de tokens e estados interativos em modo escuro.
- Semana 3 (até 21/11/2025):
  - Fluxo Auth (recuperação/OTP), melhorias de formulários e mensagens.
  - Revisão UX de navegação e responsividade.
- Semana 4 (até 28/11/2025):
  - Auditoria A11y, Lighthouse ≥ 90, checklist WCAG AA.
  - Exportação dos docs em PDF com tema de impressão e paginação.

### Dependências e pré-requisitos
- `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Supabase CLI para deploy de migrações e Edge Functions.
- Google Fonts carregadas: Poppins, Open Sans (`index.html`).
- Ferramentas de exportação: `md-to-pdf` ou `pandoc` (para gerar PDFs dos docs).
- Navegadores-alvo: Chrome, Firefox, Edge (validação de `html2canvas`).

### Objetivos
- Curto prazo (≤ 4 semanas):
  - IA consolidada, Dashboard com KPIs, Auth robusto, A11y ≥ 90.
  - Exportação de documentos em PDF consistente.
- Longo prazo (> 4 semanas):
  - Evolução da IA com modelos mais avançados e feedback clínico.
  - Relatórios dinâmicos com gráficos interativos e histórico comparativo.
  - Suporte a internacionalização e apps móveis (tokens e arquitetura compatíveis).

---

## Histórico

### Decisões principais
- Design System com tokens HSL e Tailwind; modo claro/escuro via `.dark` (`src/index.css`, `tailwind.config.ts`).
- Tipografia: Poppins (títulos) e Open Sans (corpo), via Google Fonts.
- PDF stack: `jspdf`, `html2canvas`, `qrcode`; hook `usePDFGenerator` para orquestração e upload.
- Backend: Supabase (Auth, PostgREST, Storage, Edge Functions) com RLS.

### Mudanças significativas de escopo
- Inclusão de campos para análise de IA nas migrações e nos fluxos de avaliação.
- Ampliação do relatório PDF com QR Code, metadados e upload ao Storage.

### Lições aprendidas
- Necessidade de padronização de dados clínicos para qualidade da IA.
- Tokens HSL facilitam consistência entre claro/escuro e garantem contraste.
- `html2canvas` exige ajustes cuidadosos de escala, fontes e carregamento cross-origin.

---

## Notas de Manutenção
- Este documento deve ser atualizado a cada sprint (semanal) com:
  - Data da atualização e status.
  - Progresso percentual por área.
  - Novos bloqueios e decisões.
- Versão e histórico mantidos no repositório (`docs/passo-a-passo-do-projeto.md`).

Última atualização: 30/10/2025