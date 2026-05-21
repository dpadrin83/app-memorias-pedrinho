-- Bucket privado para fotos originais (thumbnails via transformações na URL assinada)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  false,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Policies: usuários autenticados e autorizados (is_allowed_user)
-- ---------------------------------------------------------------------------

create policy "photos_storage_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'photos'
    and public.is_allowed_user()
  );

create policy "photos_storage_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and public.is_allowed_user()
  );

create policy "photos_storage_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'photos'
    and public.is_allowed_user()
  )
  with check (
    bucket_id = 'photos'
    and public.is_allowed_user()
  );

create policy "photos_storage_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and public.is_allowed_user()
  );
