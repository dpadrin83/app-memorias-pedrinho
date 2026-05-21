-- Álbuns + fotos do álbum (com ordem)

create table public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_photo_id uuid references public.photos (id) on delete set null,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index albums_created_by_idx on public.albums (created_by);
create index albums_deleted_at_idx on public.albums (deleted_at);
create index albums_active_created_at_idx
  on public.albums (created_at desc)
  where deleted_at is null;

comment on table public.albums is 'Álbuns manuais. Soft delete via deleted_at.';

alter table public.albums enable row level security;

create trigger albums_updated_at
  before update on public.albums
  for each row
  execute function public.handle_updated_at();

create policy "albums_all_allowed"
  on public.albums
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());

-- ---------------------------------------------------------------------------

create table public.album_photos (
  album_id uuid not null references public.albums (id) on delete cascade,
  photo_id uuid not null references public.photos (id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (album_id, photo_id)
);

create index album_photos_photo_id_idx on public.album_photos (photo_id);
create index album_photos_album_position_idx on public.album_photos (album_id, position);

alter table public.album_photos enable row level security;

create policy "album_photos_all_allowed"
  on public.album_photos
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());
