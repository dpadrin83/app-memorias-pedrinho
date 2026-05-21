# Portal de Memórias

Web app privado para organizar memórias visuais da família — fotos com história, datas, pessoas e tags.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (Auth, Postgres, Storage)
- Design system em `/docs/design-system.html`

## Começar

```bash
npm install
cp .env.example .env.local
# Preencha as chaves — ver docs/GUIA-SUPABASE.md
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para validar os tokens do design system: [http://localhost:3000/style-check](http://localhost:3000/style-check).

## Documentação do projeto

| Arquivo | Conteúdo |
|---------|----------|
| `docs/CONTEXTO.md` | Visão geral, modelo de dados, roadmap |
| `docs/direcao-criativa.md` | Identidade visual e UX |
| `docs/design-system.html` | Componentes e tokens (fonte da verdade) |
| `docs/PROMPTS_CURSOR.md` | Sequência de prompts de desenvolvimento |
| `docs/GUIA-SUPABASE.md` | Quais chaves copiar do Supabase |
| `docs/aprovacao/index.html` | Mockups HTML do layout (abrir no navegador) |
| `docs/ENCERRAMENTO-MVP.md` | Relatório de encerramento e checklist produção |

## Banco de dados (Supabase)

Migrations em `supabase/migrations/` (ordem cronológica):

| Ordem | Arquivo | Conteúdo |
|-------|---------|----------|
| 1 | `20260520120000_functions.sql` | `handle_updated_at()` |
| 2 | `20260520120001_enable_vector.sql` | extensão pgvector |
| 3 | `20260520120002_allowed_emails_and_profiles.sql` | `allowed_emails`, **`is_allowed_user()`**, `profiles` |
| 4 | `20260520120003_people_and_tags.sql` | `people`, `tags` |
| 5 | `20260520120004_photos.sql` | `photos`, junções, índice HNSW |
| 6 | `20260520120005_albums.sql` | `albums`, `album_photos` |
| 7 | `20260520120006_storage_photos_bucket.sql` | bucket `photos` |
| 8 | `20260520120007_photos_fts.sql` | FTS + RPC `search_photos` |
| 9 | `20260520120008_semantic_search.sql` | RPC `search_photos_semantic` |

### Busca semântica (OpenAI) — opcional

Defina `OPENAI_API_KEY` no `.env.local` quando quiser ativar o chip **IA** na busca. Sem a chave, o app usa só busca textual e não gera embeddings.

### Lixeira — purge automático (30 dias)

Edge Function `supabase/functions/purge-trash` remove fotos e álbuns com `deleted_at` há mais de 30 dias (storage + banco).

**Deploy da função:**

```bash
npx supabase functions deploy purge-trash --no-verify-jwt
```

Defina os secrets no projeto Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e, opcionalmente, `CRON_SECRET`.

**Agendar (cron)** no [Dashboard Supabase](https://supabase.com/dashboard) → Edge Functions → `purge-trash` → Schedules, ou via SQL:

```sql
select cron.schedule(
  'purge-trash-daily',
  '0 4 * * *',
  $$
  select net.http_post(
    url := 'https://SEU_PROJECT_REF.supabase.co/functions/v1/purge-trash',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer SEU_CRON_SECRET'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

Ative as extensões `pg_cron` e `pg_net` no projeto se usar o SQL acima.

### Deploy (Vercel)

1. Repositório no GitHub → importar na Vercel.
2. Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (se precisar em server), opcional `OPENAI_API_KEY`.
3. `npm run build` deve passar localmente antes do deploy.
4. Domínio customizado: Vercel → Settings → Domains.

Erro `is_allowed_user() does not exist`? Rode `supabase/FIX_is_allowed_user.sql` e depois repita a migration que falhou.

**Verificar se tudo foi aplicado:** cole e execute `supabase/CHECK_migrations.sql` no SQL Editor (todas as linhas devem ficar `OK`).

**Aplicar no projeto Supabase** (SQL Editor → colar cada arquivo em ordem, ou CLI):

```bash
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

**Antes do primeiro login**, autorize seu email:

```sql
insert into public.allowed_emails (email) values ('seu.email@exemplo.com');
```

Modelo completo em `docs/CONTEXTO.md` §4. RLS: só usuários em `allowed_emails` acessam as tabelas.

## Scripts

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm run lint         # ESLint
npm run format       # Prettier
npm run format:check # checagem Prettier
```

## Estrutura

```
src/
  app/              # rotas Next.js
  components/ui/    # primitivos shadcn
  lib/
    supabase/       # clientes browser, server e admin
    utils.ts
supabase/migrations/  # SQL migrations
docs/                 # referência de produto e design
```
