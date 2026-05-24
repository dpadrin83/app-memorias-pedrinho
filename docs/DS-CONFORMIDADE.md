# Conformidade com o Design System v0.2

## Referências

| Arquivo | Uso |
|---------|-----|
| `docs/design-system.html` | Tokens + anatomia + componentes §2–§4 |
| `docs/aprovacao/` | Mockups HTML aprovados por tela |
| `src/app/globals.css` | Tokens Tailwind + aliases `:root` |
| `docs/aprovacao/_ds.css` → `src/styles/ds-approved.css` | CSS aprovado (cópia sincronizada) |
| `src/styles/layout-ds.css` | Extensões do app (busca, lixeira, foto, modais) |

## Anatomia obrigatória (desktop)

```
.app-shell
  .ld-sidebar.app-sidebar     ← 280px
  .app-main
    .ld-topbar                ← barra branca (título + busca)
    .app-canvas
      .cat-header.{categoria}  ← fotos|albuns|pessoas|tags|favoritos
      .tabs                   ← modos de visualização (quando aplicável)
      .screen-body            ← conteúdo
```

Rotas utilitárias (`/search`, `/trash`, `/settings`): **sem** `.cat-header` colorido; **com** `.ld-topbar`.

## Categorias (cat-header)

| Rota | Classe | Cor |
|------|--------|-----|
| `/` | `.cat-header.fotos` | azul |
| `/albums` | `.cat-header.albuns` | amarelo |
| `/people` | `.cat-header.pessoas` | verde |
| `/tags` | `.cat-header.tags` | vermelho |
| `/favorites` | `.cat-header.favoritos` | roxo |

## O que não usar na UI do produto

- Componentes shadcn (`Button` de `@/components/ui/button`) em telas do app — preferir `.btn`
- Cores/tamanhos Tailwind arbitrários (`bg-zinc-500`, `p-7`) fora dos tokens
- Sidebar inventada fora de `.ld-item` / `.ld-brand`

Exceção: `/style-check` (dev) e utilitários internos.

## Pendências documentadas (MVP)

- Busca IA: chip desligado sem `OPENAI_API_KEY`

## Conflitos Tailwind (corrigido)

O `@layer base { * { border-border } }` do shadcn aplicava borda em **todos** os elementos e destruía o layout Material. Removido em `globals.css`. Tokens `--shadow-*`, `--radius-*` e `--text-body-lg` estão em `:root`.

## Antes de cada PR / entrega visual

1. Abrir mockup em `docs/aprovacao/XX-….html` da tela alterada
2. Conferir mobile em `docs/aprovacao/04-mobile.html` se mexeu em layout
3. `npm run build` sem erros
