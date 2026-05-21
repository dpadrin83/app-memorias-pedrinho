-- Busca semântica por similaridade de embedding (pgvector)

create or replace function public.search_photos_semantic(
  p_embedding vector(1536),
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_people uuid[] default '{}',
  p_tags uuid[] default '{}',
  p_limit int default 30
)
returns table (
  id uuid,
  title text,
  thumbnail_path text,
  event_date timestamptz,
  distance real
)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
begin
  if not public.is_allowed_user() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.title,
    p.thumbnail_path,
    p.event_date,
    (p.embedding <=> p_embedding)::real as distance
  from public.photos p
  where p.deleted_at is null
    and p.embedding is not null
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
  order by p.embedding <=> p_embedding
  limit greatest(least(p_limit, 60), 1);
end;
$$;

grant execute on function public.search_photos_semantic(
  vector, timestamptz, timestamptz, uuid[], uuid[], int
) to authenticated;

comment on function public.search_photos_semantic is
  'Busca por similaridade de cosseno (operador <=>) com filtros opcionais.';
