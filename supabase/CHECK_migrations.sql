-- =============================================================================
-- Portal de Memórias — checagem de migrations (rodar no SQL Editor do Supabase)
-- Cole e execute o arquivo INTEIRO de uma vez (Run).
-- Resultado: todas as linhas com status = 'OK'
-- =============================================================================

drop table if exists _portal_migration_checks;

create temp table _portal_migration_checks (
  migration text not null,
  item text not null,
  ok boolean not null
);

insert into _portal_migration_checks (migration, item, ok)
select '00', 'handle_updated_at()', exists (
  select 1 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'handle_updated_at'
)
union all
select '01', 'extensão vector', exists (
  select 1 from pg_extension where extname = 'vector'
)
union all
select '02', 'tabela allowed_emails', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'allowed_emails'
)
union all
select '02', 'tabela profiles', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'profiles'
)
union all
select '02', 'função is_allowed_user()', exists (
  select 1 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'is_allowed_user'
)
union all
select '03', 'tabela people', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'people'
)
union all
select '03', 'tabela tags', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'tags'
)
union all
select '04', 'tabela photos', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'photos'
)
union all
select '04', 'coluna photos.embedding', exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'photos' and column_name = 'embedding'
)
union all
select '04', 'coluna photos.deleted_at', exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'photos' and column_name = 'deleted_at'
)
union all
select '04', 'tabela photo_people', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'photo_people'
)
union all
select '04', 'tabela photo_tags', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'photo_tags'
)
union all
select '04', 'índice HNSW embedding', exists (
  select 1 from pg_indexes
  where schemaname = 'public' and tablename = 'photos' and indexname = 'photos_embedding_hnsw_idx'
)
union all
select '05', 'tabela albums', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'albums'
)
union all
select '05', 'coluna albums.deleted_at', exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'albums' and column_name = 'deleted_at'
)
union all
select '05', 'tabela album_photos', exists (
  select 1 from information_schema.tables
  where table_schema = 'public' and table_name = 'album_photos'
)
union all
select '06', 'bucket storage photos', exists (
  select 1 from storage.buckets where id = 'photos'
)
union all
select '07', 'coluna photos.search_vector', exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'photos' and column_name = 'search_vector'
)
union all
select '07', 'função photos_build_search_vector()', exists (
  select 1 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'photos_build_search_vector'
)
union all
select '07', 'função search_photos()', exists (
  select 1 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'search_photos'
)
union all
select '07', 'índice GIN search_vector', exists (
  select 1 from pg_indexes
  where schemaname = 'public' and tablename = 'photos' and indexname = 'photos_search_vector_gin_idx'
)
union all
select '08', 'função search_photos_semantic()', exists (
  select 1 from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'search_photos_semantic'
);

-- 1) Detalhe por item
select
  migration,
  item,
  case when ok then 'OK' else 'FALTA' end as status
from _portal_migration_checks
order by migration, item;

-- 2) Resumo
select
  count(*) filter (where ok) as ok_count,
  count(*) filter (where not ok) as missing_count,
  count(*) as total_checks,
  case
    when count(*) filter (where not ok) = 0 then 'TODAS AS MIGRATIONS OK'
    else 'EXISTEM MIGRATIONS PENDENTES — veja linhas FALTA acima'
  end as resumo
from _portal_migration_checks;

-- 3) Emails autorizados (login)
select
  'extra' as migration,
  'pelo menos 1 email em allowed_emails' as item,
  case when exists (select 1 from public.allowed_emails limit 1) then 'OK' else 'FALTA' end as status;

select email, created_at
from public.allowed_emails
order by created_at;
