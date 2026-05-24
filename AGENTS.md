<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portal de Memórias — regras do agente

## Design System (obrigatório)

Fonte da verdade, nesta ordem:

1. `docs/design-system.html` (v0.2)
2. `docs/aprovacao/*.html` (mockups aprovados)
3. `docs/aprovacao/_ds.css` → implementado em `src/styles/layout-ds.css`

**Não inventar** cores, tipografia, espaçamento ou componentes. Usar classes oficiais:

- Layout: `.app-shell`, `.ld-sidebar`, `.ld-topbar`, `.cat-header`, `.screen-body`
- Navegação: `.ld-item`, `.ld-brand`, `.tabs` / `.tab`
- Ações: `.btn`, `.btn-primary`, `.btn-outline`, `.icon-btn`
- Formulários: `.field`, `.field-label`, `.search-bar`, `.chip`
- Galeria: `.ph-grid`, `.photo-card`
- Modais: `.modal-overlay`, `.modal-panel`, `.modal-header`, `.modal-footer`

Tokens CSS: variáveis `:root` em `src/app/globals.css` (`--blue`, `--bg`, `--space-*`, etc.).

Comparar visualmente: abrir `docs/aprovacao/index.html` no navegador.

Ver checklist: `docs/DS-CONFORMIDADE.md`.
