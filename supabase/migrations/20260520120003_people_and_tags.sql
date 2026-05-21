-- Pessoas e tags + tabelas de junção com fotos

create table public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relationship text,
  created_at timestamptz not null default now()
);

create index people_name_idx on public.people (name);

comment on table public.people is 'Pessoas marcadas nas fotos (ex: Pedrinho, vovó).';

alter table public.people enable row level security;

create policy "people_all_allowed"
  on public.people
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());

-- ---------------------------------------------------------------------------

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  constraint tags_name_lowercase check (name = lower(name))
);

create unique index tags_name_idx on public.tags (name);

comment on table public.tags is 'Tags únicas (nome normalizado em minúsculas).';

alter table public.tags enable row level security;

create policy "tags_all_allowed"
  on public.tags
  for all
  to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());
