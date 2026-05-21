-- Full-text search em photos (português) + função de busca com filtros

-- ---------------------------------------------------------------------------
-- Vetor de busca (título, descrição, local, pessoas, tags)
-- ---------------------------------------------------------------------------

alter table public.photos
  add column if not exists search_vector tsvector;

create or replace function public.photos_build_search_vector(p_photo_id uuid)
returns tsvector
language sql
stable
set search_path = public
as $$
  select
    setweight(to_tsvector('portuguese', coalesce(p.title, '')), 'A')
    || setweight(to_tsvector('portuguese', coalesce(p.description, '')), 'B')
    || setweight(to_tsvector('portuguese', coalesce(p.location, '')), 'C')
    || setweight(
      to_tsvector(
        'portuguese',
        coalesce(
          (
            select string_agg(distinct pe.name, ' ')
            from public.photo_people pp
            join public.people pe on pe.id = pp.person_id
            where pp.photo_id = p.id
          ),
          ''
        )
      ),
      'B'
    )
    || setweight(
      to_tsvector(
        'portuguese',
        coalesce(
          (
            select string_agg(distinct t.name, ' ')
            from public.photo_tags pt
            join public.tags t on t.id = pt.tag_id
            where pt.photo_id = p.id
          ),
          ''
        )
      ),
      'B'
    )
  from public.photos p
  where p.id = p_photo_id;
$$;

create or replace function public.photos_sync_search_vector()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
begin
  if tg_table_name = 'photos' then
    pid := coalesce(new.id, old.id);
  elsif tg_table_name in ('photo_people', 'photo_tags') then
    pid := coalesce(new.photo_id, old.photo_id);
  else
    return coalesce(new, old);
  end if;

  update public.photos
  set search_vector = public.photos_build_search_vector(pid)
  where id = pid;

  return coalesce(new, old);
end;
$$;

drop trigger if exists photos_search_vector_sync on public.photos;
create trigger photos_search_vector_sync
  after insert or update of title, description, location
  on public.photos
  for each row
  execute function public.photos_sync_search_vector();

drop trigger if exists photo_people_search_vector_sync on public.photo_people;
create trigger photo_people_search_vector_sync
  after insert or delete
  on public.photo_people
  for each row
  execute function public.photos_sync_search_vector();

drop trigger if exists photo_tags_search_vector_sync on public.photo_tags;
create trigger photo_tags_search_vector_sync
  after insert or delete
  on public.photo_tags
  for each row
  execute function public.photos_sync_search_vector();

update public.photos
set search_vector = public.photos_build_search_vector(id)
where search_vector is null;

create index if not exists photos_search_vector_gin_idx
  on public.photos
  using gin (search_vector);

-- ---------------------------------------------------------------------------
-- RPC: busca textual + filtros (URL params do app)
-- ---------------------------------------------------------------------------

create or replace function public.search_photos(
  p_query text default null,
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_people uuid[] default '{}',
  p_tags uuid[] default '{}',
  p_limit int default 60
)
returns table (
  id uuid,
  title text,
  thumbnail_path text,
  event_date timestamptz,
  rank real
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  tsq tsquery;
begin
  if not public.is_allowed_user() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  tsq := case
    when p_query is not null and btrim(p_query) <> '' then
      plainto_tsquery('portuguese', btrim(p_query))
    else null
  end;

  return query
  select
    p.id,
    p.title,
    p.thumbnail_path,
    p.event_date,
    case
      when tsq is not null then ts_rank(p.search_vector, tsq)
      else 0::real
    end as rank
  from public.photos p
  where p.deleted_at is null
    and (
      tsq is null
      or p.search_vector @@ tsq
    )
    and (p_from is null or p.event_date >= p_from)
    and (p_to is null or p.event_date <= p_to)
    and (
      coalesce(cardinality(p_people), 0) = 0
      or exists (
        select 1
        from public.photo_people pp
        where pp.photo_id = p.id
          and pp.person_id = any (p_people)
      )
    )
    and (
      coalesce(cardinality(p_tags), 0) = 0
      or exists (
        select 1
        from public.photo_tags pt
        where pt.photo_id = p.id
          and pt.tag_id = any (p_tags)
      )
    )
  order by rank desc, p.event_date desc nulls last, p.uploaded_at desc
  limit greatest(p_limit, 1);
end;
$$;

grant execute on function public.search_photos(
  text, timestamptz, timestamptz, uuid[], uuid[], int
) to authenticated;

comment on function public.search_photos is
  'Busca full-text (português) com filtros de período, pessoas e tags.';
