# Encerramento MVP — Portal de Memórias

## Relatório (CONTEXTO.md §13)

**Valor de mercado:** R$ 45.000 – R$ 65.000 (estimativa equipe freelancer/PJ Brasil: UX/UI parcial, dev full-stack sênior ~3–4 semanas, Supabase + Next.js 16, 15 prompts de produto)

**Pessoas envolvidas:** 1 profissional (produto/dev) + IA como par de implementação

**Feito em:** ~2–3 semanas de iteração por prompts (setup → auth → upload → galeria → busca → álbuns → pessoas/tags → mapa/lista → lixeira → PWA base)

**Envolvidos:** 1 pessoa (Danilo + IA)

---

## Escopo entregue

| Área | Status |
|------|--------|
| Auth + RLS + allowed_emails | ✅ |
| Upload EXIF + Storage | ✅ |
| Galeria (grid, timeline, mapa, lista) | ✅ |
| Foto individual + auto-save | ✅ |
| Busca textual + filtros | ✅ |
| Álbuns CRUD + reorder | ✅ |
| Pessoas + Tags | ✅ |
| Lixeira + purge 30 dias (edge function) | ✅ |
| Busca semântica (IA) | ⏸ Código pronto; ativar com `OPENAI_API_KEY` |
| Favoritos | ✅ Toggle estrela + tela `/favorites` com mesmas views |
| Calendário | ✅ Grade mensal com thumbnails por dia |
| Deploy Vercel | Documentado no README |

---

## Antes do primeiro uso em produção

1. Rodar todas as migrations em `supabase/migrations/`
2. `insert into allowed_emails` + usuário Auth
3. Variáveis na Vercel: `NEXT_PUBLIC_SUPABASE_*` (sem OpenAI se não for usar IA)
4. Opcional: deploy `purge-trash` + cron (README)

---

## Auditoria visual (Prompt 14)

Resumo em `docs/aprovacao/16-auditoria-visual.html`.

Correções já aplicadas nesta etapa:

- Sidebar: álbuns recentes reais (não mock); removido contador fixo “14”
- Token `--sidebar-width` para barra de lista em lote
- Mobile 760px: lixeira e ações empilhadas

Pendente de produto (não bloqueia MVP):

- (nenhum)

Encerrado nesta etapa:

- Favoritos: coluna `is_favorite` em `photos` (migration `20260521120000_photo_favorites.sql`), server action `setPhotoFavorite`, toggle estrela no editor, badge no card, tela `/favorites` real.
- Calendário: novo modo nos ViewTabs com grade mensal (uma seção por mês) e cells clicáveis com thumbnail.
- PWA: ícones PNG 192/512 (any + maskable) e apple-touch-icon 180 gerados a partir do SVG, manifesto e metadata atualizados.
