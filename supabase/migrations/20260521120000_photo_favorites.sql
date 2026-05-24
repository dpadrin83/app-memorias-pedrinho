-- Favoritos por foto

alter table public.photos
  add column if not exists is_favorite boolean not null default false;

comment on column public.photos.is_favorite is
  'Marcação de favorito. Usado em /favorites. Independente de soft delete.';

create index if not exists photos_favorites_event_date_idx
  on public.photos (event_date desc nulls last)
  where is_favorite = true and deleted_at is null;
