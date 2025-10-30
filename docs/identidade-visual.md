---
title: "Guia de Identidade Visual – TrichoScalp"
author: "Equipe TrichoScalp"
version: "1.0"
date: "2025-10-30"
---

# Guia de Identidade Visual – TrichoScalp

Este documento apresenta a identidade visual oficial do projeto TrichoScalp, com diretrizes completas para cores, tipografia, elementos gráficos, logotipo e aplicações em interfaces. Inclui um índice navegável, especificações técnicas e instruções de exportação para PDF (digital editável) e versão para impressão.

## Índice
1. [Introdução](#1-introdução)
2. [Cores](#2-cores)
3. [Tipografia](#3-tipografia)
4. [Elementos Gráficos](#4-elementos-gráficos)
5. [Logotipo](#5-logotipo)
6. [Aplicações Específicas](#6-aplicações-específicas)
7. [Diretrizes de Uso](#7-diretrizes-de-uso)
8. [Guia Rápido](#guia-rápido)
9. [Exportação para PDF e Impressão](#exportação-para-pdf-e-impressão)

> Nota sobre paginação: quando exportado para PDF com as instruções deste guia, o documento incluirá numeração de páginas em rodapé (ver seção “Exportação para PDF e Impressão”).

---

## 1. Introdução

### Objetivos da identidade visual
- Comunicar a marca como uma plataforma profissional, confiável e moderna para tricologia.
- Refletir os valores do projeto: precisão clínica, acessibilidade, ética, privacidade e inovação.
- Diferenciais: uso de IA de apoio à análise, visual limpo e consistente, foco na legibilidade e acessibilidade (WCAG AA).

### Público-alvo
- Personas:
  - Profissional de tricologia/dermatologia: busca relatórios, histórico e visualização organizada.
  - Clínica/estética: precisa de gestão de clientes, cadastro rápido, segurança e consistência.
  - Pesquisador/assistente: foca em dados, comparativos e exportação.
- Faixa etária: 24–55 anos.
- Preferências visuais: interface clara, tipografia legível, boa hierarquia, contraste adequado, cores profissionais (azuis) com acentos controlados.

### Mensagem central do projeto
- Tom de voz: técnico, acolhedor e objetivo.
- Sensação a ser transmitida: confiança clínica, tecnologia acessível e organização.

---

## 2. Cores

As cores oficiais baseiam-se em tokens definidos em `src/index.css` e Tailwind (`tailwind.config.ts`). Para consistência entre design e código, as definições abaixo incluem HEX, RGB, CMYK e Pantone (aproximações visuais; valide com gráfica).

### Paleta primária (3–5 cores)
1) Azul Primário
- HEX: `#3D7CB8`
- RGB: `61, 124, 184`
- CMYK: `67, 33, 0, 28` (aprox.)
- Pantone: 7689 C (aprox.)
- Uso: títulos, botões principais, gradientes e elementos de destaque.

2) Azul Secundário
- HEX: `#2A5C8B`
- RGB: `42, 92, 139`
- CMYK: `70, 34, 0, 45` (aprox.)
- Pantone: 7698 C (aprox.)
- Uso: texto principal em componentes, fundos de blocos, gradientes.

3) Acento Verde/Aqua
- HEX: `#6BD6B1`
- RGB: `107, 214, 177`
- CMYK: `50, 0, 17, 16` (aprox.)
- Pantone: 3375 C (aprox.)
- Uso: realces, badges e ícones.

4) Roxo de apoio
- HEX: `#B8A1C9`
- RGB: `184, 161, 201`
- CMYK: `8, 20, 0, 21` (aprox.)
- Pantone: 5295 C (aprox.)
- Uso: gradientes e destaques secundários.

5) Fundo Base
- HEX: `#F5F7FA`
- RGB: `245, 247, 250`
- CMYK: `2, 1, 0, 2` (aprox.)
- Pantone: — (papel branco; valide com gráfica)
- Uso: background geral da aplicação.

### Paleta secundária (apoio e estados)
- Borda/Divisores: HEX `#E4E7EB` (HSL `220 13% 91%`), Pantone Cool Gray 1 C (aprox.)
- Muted foreground: HSL `216 19% 44%` (cinza azulado legível)
- Sucesso: HEX `#43A047` (aprox.), CMYK `58, 0, 56, 37` (aprox.), Pantone 7740 C (aprox.)
- Aviso: HEX `#FFC107` (aprox.), CMYK `0, 24, 97, 0` (aprox.), Pantone 123 C (aprox.)
- Erro/Destrutivo: HEX `#D32F2F` (aprox.), CMYK `0, 78, 78, 17` (aprox.), Pantone 7621 C (aprox.)

### Diretrizes de uso
- Proporções sugeridas (modo claro):
  - Primário Azul: 35–45%
  - Secundário Azul: 20–30%
  - Acento Verde/Aqua: 10–15%
  - Roxo: 5–10%
  - Neutros (fundo/bordas): restante
- Combinações permitidas:
  - `#3D7CB8` com `#6BD6B1` (alto contraste + frescor)
  - `#2A5C8B` com `#B8A1C9` (sofisticação)
- Combinações a evitar:
  - Acento (`#6BD6B1`) com Roxo (`#B8A1C9`) sem neutros — pode reduzir legibilidade.
  - Primário e Secundário em texto sobre fundos saturados — use neutros para base.

### Variações para modo claro e escuro
- Claro (tokens): `--background: #F5F7FA`, `--foreground: #2A5C8B`, `--primary: #3D7CB8`, `--accent: #6BD6B1`.
- Escuro (tokens): `--background: ~#101722`, `--foreground: ~#E3EBF6`, `--primary: #6BD6B1`, `--secondary: #3D7CB8`.
- Regra geral: aumentar luminância/contraste para cumprir WCAG AA (≥4.5:1), reduzir transparências e manter outlines em acento.

> Referências de implementação: `src/index.css` e `tailwind.config.ts` (tokens HSL, cores e fontes).

---

## 3. Tipografia

### Família de fontes
- Principal de títulos: Poppins (Google Fonts)
  - Download/licença: https://fonts.google.com/specimen/Poppins
- Corpo de texto: Open Sans (Google Fonts)
  - Download/licença: https://fonts.google.com/specimen/Open+Sans

### Fontes complementares
- Alternativa técnica: Inter (sistemas internos)
  - https://fonts.google.com/specimen/Inter

### Hierarquia tipográfica
- H1: Poppins 700, 32–40px, `--foreground`
- H2: Poppins 600, 24–32px, `--foreground`
- H3: Poppins 600, 20–24px, `--foreground`
- H4: Poppins 600, 18–20px, `--foreground`
- H5: Poppins 600, 16–18px, `--foreground`
- H6: Poppins 600, 14–16px, `--foreground`
- Parágrafo: Open Sans 400/600, 14–18px, `text-muted-foreground` para descrições
- Legendas/Notas: Open Sans 400, 12–14px

### Tamanhos, pesos e espaçamentos
- Linhas: 1.4–1.6 para corpo; 1.2–1.3 para títulos.
- Espaçamento de seção: usar `--shadow-card`, `--radius`, e `container.padding`.
- Tokens específicos de seção: em `src/index.css` (ex.: `.avaliacao-detalhes` define tamanhos/espacamentos).

### Diretrizes de legibilidade
- Fundo claro: texto `--foreground`, subtítulos com `--muted-foreground`.
- Fundo escuro: aumentar contraste dos títulos e links; outlines em `--accent`.
- Limite de largura de parágrafo: 60–75 caracteres.

---

## 4. Elementos Gráficos

### Estilo de ilustrações
- Preferência por flat/line art com filtros suaves; evitar hiper-realismo.
- Gradientes: usar `gradient-primary` e `gradient-card` (ver utilitários em `src/index.css`).

### Biblioteca de ícones
- Ícones: `lucide-react`.
- Tamanhos padrões: 16/20/24px (ajustar conforme hierarquia).
- Uso: ícones sempre com `text-accent` ou `text-foreground` em contraste adequado.

### Padrões de formas
- Bordas arredondadas com `--radius` (`lg: 12px` aprox.).
- Cartões com `shadow-card` e estados `hover` com `shadow-elevated`.

### Texturas, padrões e efeitos
- Textura do Dashboard: `.dashboard-background` usando `/public/brand/background.png`.
- Efeito glass: `.card-brand` com `backdrop-filter: blur(10px)` e transparências leves.

### Grids e alinhamento
- Tailwind container centralizado, `padding: 2rem`, `2xl: 1400px`.
- Sistemas de grid: 12 colunas (via Tailwind), espaçamento consistente.

> Exemplos visuais: `public/brand/frame11.png`, `public/brand/Frame 12.png`, `public/brand/background.png`.

---

## 5. Logotipo

### Versões
- Horizontal: `public/brand/logo-com-texto.png`
- Vertical: versão sugerida a criar (derivada do horizontal)
- Ícone: derivar do símbolo capilar do logo
- Favicon: `public/favicon.ico`

### Área de proteção e proporções
- Área de proteção: “x” = altura do ícone; manter margem mínima de `0.5x` em todos os lados.
- Proporção base: manter razão do arquivo original; não deformar.

### Tamanhos mínimos
- Web: 24px ícone; 120px versão horizontal em headers.
- Impressos: logo ≥ 20mm em materiais A4.

### Aplicações e variações
- Fundos claros: usar versão colorida padrão.
- Fundos escuros: usar versão branca/monocromática.
- Fundos coloridos: preferir monocromático em branco/preto com área de proteção reforçada.

### Monocromáticas e usos especiais
- Monocromático: preto, branco ou `--foreground`.
- Usos especiais: marca d’água em relatórios (opacidade 5–10%).

> Exemplos: `public/brand/logo-com-texto.png`, `public/favicon.ico`.

---

## 6. Aplicações Específicas

Esta seção detalha a identidade aplicada às principais páginas. Para cada aplicação: wireframe, componentes UI, estados interativos, variações e especificações técnicas. Screenshots de referência podem ser capturados do servidor local (`npm run dev`).

### 6.1 Landing Page
- Layout: hero com `gradient-card`, grid de features (cards), seção de benefícios.
- Wireframe básico:

```
Header
└─ Logo + Navegação
Hero (full-width, gradient)
└─ Título (H1) + Descrição + CTA
Features (grid 3x)
└─ Card: ícone + título + texto
Benefícios (grid 2x)
└─ Lista com ícones
Footer
```

- Componentes UI: `Card`, `Button`, ícones `lucide-react`, utilitários `shadow-card`.
- Estados: `hover`/`active`/`focus-visible`; botões com `accent`.
- Variações dispositivo: responsivo (mobile col-1, desktop col-3).
- Especificações técnicas: ver `src/pages/Index.tsx` e `src/index.css`.
- Screenshots: abrir `http://localhost:8081/` e capturar hero, grid e footer.

### 6.2 Autenticação
- Layout: formulário centrado, campo de email/senha/OTP (se aplicável), mensagens de erro.
- Wireframe:

```
Logo
Título (H2)
Form
└─ Email + Senha + CTA
Auxiliares
└─ Esqueci a senha / Criar conta
```

- Componentes: `Input`, `Button`, `Card`, estados de `disabled`/`error`.
- Estados: `hover`, `active`, `disabled`, mensagens inline.
- Variações: modo escuro/claro, mobile com `container` estreito.
- Especificações: ver `src/pages/Auth.tsx`.
- Screenshots: `http://localhost:8081/auth` (se rota disponível no projeto).

### 6.3 Dashboard
- Estrutura: hero, cards de métricas, atalhos, possíveis gráficos.
- Wireframe:

```
Header
Hero (gradient-card)
Cards (grid)
Gráficos/Atalhos
```

- Componentes: `Card`, `Tabs` (se aplicável), `ThemeToggle`.
- Estados: `hover`, `focus-visible`, transitions.
- Variações: `.dashboard-background` opcional; modo escuro.
- Especificações: `src/pages/Dashboard.tsx`, utilitários em `src/index.css`.
- Screenshots: `http://localhost:8081/dashboard`.

### 6.4 Gerenciar Cliente
- Estrutura: busca, tabela/lista, ações (ver, editar, excluir), modais.
- Wireframe:

```
Header
Barra de busca + ações
Lista/Tabela de clientes
Modais (detalhes/editar)
```

- Componentes: `Input`, `Button`, `Card`, ícones.
- Estados: filtros ativos, botões `disabled`, `focus-visible`.
- Especificações: `src/pages/Clientes.tsx`.
- Screenshots: `http://localhost:8081/clientes`.

### 6.5 Ver Detalhes (Avaliação)
- Hierarquia: tabs (Anamnese/IA/Imagens), cards, botões de ações (PDF, tema).
- Wireframe:

```
Dialog/Modal
└─ Header + Ações
Tabs (3)
└─ Conteúdo scrollável
```

- Componentes: `Dialog`, `Tabs`, `ScrollArea`, `Button`, `ThemeToggle`.
- Estados: `hover`, `active`, `disabled`, `focus-visible`, progresso de PDF.
- Variações: tokens dedicados em `.avaliacao-detalhes` (claro/escuro).
- Especificações: `src/components/avaliacoes/AvaliacaoDetalhes.tsx` + tokens em `src/index.css`.
- Screenshots: abrir um cliente e avaliação, acionar detalhes.

### 6.6 Modo claro e escuro
- Padrões: classes `:root` e `.dark` configuradas em `src/index.css`.
- Diretrizes: aumentar contraste, ajustar sombras, preservar outlines.
- Testes: validar contraste (WCAG AA), estados de foco e transições.

---

## 7. Diretrizes de Uso

### Melhores práticas
- Usar tokens HSL já definidos (nunca cores “soltas”).
- Manter hierarquia tipográfica consistente com Poppins/Open Sans.
- Em componentes interativos, sempre definir `hover`, `active`, `focus-visible`.

### Erros comuns a evitar
- Distorcer o logotipo; alterar proporções.
- Aplicar acento sobre fundo saturado sem neutro.
- Quebrar contraste mínimo em textos (WCAG AA ≥ 4.5:1).

### Exemplos incorretos e correções
- Texto acento sobre roxo sem neutro → corrigir adicionando fundo neutro.
- Botão primário com outline invisível → corrigir com `outline: 2px` em acento.

### Consistência entre plataformas
- Definir tokens equivalentes em mobile (React Native) quando aplicável.
- Garantir fontes disponíveis via Google Fonts em web.

### Processo para novos materiais
- Brief (objetivo, público, mensagem), seleção de tokens, wireframe, mockups, revisão WCAG, handoff com especificações.

---

## Guia Rápido

- Cores: usar `--primary`, `--secondary`, `--accent`, `--foreground`, `--background`.
- Fontes: `font-heading: Poppins`, `font-body: Open Sans`.
- Utilitários: `gradient-card`, `shadow-card`, `shadow-elevated`, `transition-smooth`.
- Componentes padrão: `Card`, `Button`, `Tabs`, `Dialog` com estados interativos.
- Assets: `public/brand/logo-com-texto.png`, `public/brand/background.png`, `public/favicon.ico`.

---

## Exportação para PDF e Impressão

### Versão digital em PDF (editável)
- Sugestão: usar `md-to-pdf` ou `pandoc` para exportar este `.md` com cabeçalho/rodapé e índices clicáveis.
- Recomendações:
  - Papel: A4, retrato.
  - Rodapé com paginação automática.
  - Fonte incorporada (Poppins/Open Sans) via CSS do tema de exportação.

### Versão para impressão
- Ajustar cores para CMYK em gráfica (validar Pantone aproximado).
- Remover fundos muito saturados; preservar contraste; configurar margens de 20–25mm.

### Como gerar (exemplo com md-to-pdf)
1) Instale globalmente ou no projeto: `npm i -D md-to-pdf`
2) Crie um CSS de impressão com rodapé/paginação.
3) Execute: `npx md-to-pdf docs/identidade-visual.md --config-file print-config.json`

> Alternativa: `pandoc` com template de PDF (LaTeX) para paginação avançada.

---

## Exemplos Visuais e Mockups

- Exemplos (alta qualidade):
  - `public/brand/frame11.png`
  - `public/brand/Frame 12.png`
  - `public/brand/background.png`
- Mockups sugeridos:
  - Headers com logo horizontal
  - Cards com glass effect (`.card-brand`)
  - Botões primários com acento

## Screenshots de Implementação de Referência

- Landing: `http://localhost:8081/`
- Teste PDF: `http://localhost:8080/test-pdf?auto=download` (gera relatório)
- Dashboard: `http://localhost:8081/dashboard` (se disponível)
- Clientes: `http://localhost:8081/clientes` (se disponível)
- Autenticação: `http://localhost:8081/auth` (se disponível)

> Capturar imagens diretamente do servidor local e salvar em `docs/assets/` (sugestão) para futuras versões do PDF.

---

Última atualização: 30/10/2025