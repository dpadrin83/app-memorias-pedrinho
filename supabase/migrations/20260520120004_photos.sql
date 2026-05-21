-- Fotos + relações N:N com pessoas e tags

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  thumbnail_path text not null,
  title text,
  description text,
  event_date timestamptz,
  location text,
  lat double precision,
  lng double precision,
  uploaded_by uuid not null references auth.users (id) on delete restrict,
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  embedding vector (1536)
);

create index photos_event_date_idx on public.photos (event_date desc nulls last);
create index photos_deleted_at_idx on public.photos (deleted_at);
create index photos_uploaded_by_idx on public.photos (uploaded_by);
create index photos_active_event_date_idx
  on public.photos (event_date desc nulls last)
  where deleted_at is null;

-- Busca semântica (HNSW — eficiente após ter dados)
create index photos_embedding_hnsw_idx
  on public.photos
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

comment on table public.photos is 'Registro de cada memória visual. Soft delete via deleted_at.';
comment on column public.photos.embedding is 'OpenAI text-embedding-3-small (1536 dims) para busca por IA.';

alter table public.photos enable row level security;

create trigger photos_updated_at
  before update on public.photos
  for each row
  execute function public.handle_updated_at();

create policy "photos_all_allowed"
  on public.photos
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());

-- ---------------------------------------------------------------------------

create table public.photo_people (
  photo_id uuid not null references public.photos (id) on delete cascade,
  person_id uuid not null references public.people (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (photo_id, person_id)
);

create index photo_people_person_id_idx on public.photo_people (person_id);

alter table public.photo_people enable row level security;

create policy "photo_people_all_allowed"
  on public.photo_people
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());

-- ---------------------------------------------------------------------------

create table public.photo_tags (
  photo_id uuid not null references public.photos (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (photo_id, tag_id)
);

create index photo_tags_tag_id_idx on public.photo_tags (tag_id);

alter table public.photo_tags enable row level security;

create policy "photo_tags_all_allowed"
  on public.photo_tags
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());
