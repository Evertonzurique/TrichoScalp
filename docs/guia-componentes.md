# Guia de Componentes — Estilos da Seção "Detalhes da Avaliação"

Este guia documenta os ajustes de estilo aplicados aos cards e elementos interativos da seção "Detalhes da Avaliação", garantindo consistência no modo claro e escuro.

## Tokens e Variáveis
- Globais (definidos em `src/index.css`): `--background`, `--foreground`, `--card`, `--accent`, `--primary`, `--radius`, `--shadow-card`, `--shadow-elevated`, `--transition-smooth`.
- Seção (escopo `.avaliacao-detalhes`):
  - `--avaliacao-primary-color`: hsl(var(--primary)) no claro; azul acessível no escuro
  - `--avaliacao-card-bg`: hsl(var(--card))
  - `--avaliacao-card-border`: hsl(var(--border))
  - `--avaliacao-text-color`: hsl(var(--foreground)); `--avaliacao-muted-text`: hsl(var(--muted-foreground))
  - Tipografia (modo claro):
    - `--avaliacao-size-title`: 16px; `--avaliacao-font-title`: 600
    - `--avaliacao-size-subtitle`: 15px; `--avaliacao-font-subtitle`: 500
    - `--avaliacao-size-body`: 14px; `--avaliacao-font-body`: 400

## Padrões de Cards
- Classe base: `.avaliacao-detalhes .card-brand`
- Propriedades:
  - `border-radius: var(--radius)`
  - `padding: 22px` (mobile: `16px`; desktop: `24px`)
  - `box-shadow: var(--shadow-card)`; `:hover` → `var(--shadow-elevated)`
  - Fundo e borda derivados das variáveis por tema
- Título do card em `var(--avaliacao-primary-color)`; corpo em `var(--avaliacao-muted-text)`
  - Título: tamanho 16px (semibold); corpo: 14px (regular)
  - `:focus-within` com `outline` em `accent` para acessibilidade

## Elementos Interativos
- Links e botões dentro de `.card-brand`:
  - Transições suaves (`0.3s`), `hover` com leve `brightness`, `active` com `translateY(1px)`
  - `:focus-visible` com `outline` em `accent`
  - Tabs da seção usam `tabs-avaliacao` e `tab-trigger` com fonte azul no modo claro

## Responsividade
- Mobile (`max-width: 640px`): menor padding e o gap das tabs
- Desktop (`min-width: 1024px`): padding ampliado para melhor leitura

## Boas Práticas de Acessibilidade
- Contraste WCAG AA atendido via tokens e variáveis
- Placeholders e texto com `foreground`/`muted-foreground`
- Estados `focus-visible` consistentes nos interativos

## Referências de Implementação
- Arquivos alterados:
  - `src/index.css` — regras e variáveis da seção
  - `src/components/avaliacoes/AvaliacaoDetalhes.tsx` — classes para tabs e conteúdos

## Checklist de Testes
- Verificar contraste de títulos e corpo nos cards (WCAG AA ≥ 4.5:1)
- Validar hover/focus/active de links e botões
- Testar responsividade de 320px a 1920px
- Medir transições (FPS > 60) e Lighthouse (Acessibilidade ≥ 90)
 - Confirmar fidelidade aos mockups (cores, tipografia, espaçamento e grid)