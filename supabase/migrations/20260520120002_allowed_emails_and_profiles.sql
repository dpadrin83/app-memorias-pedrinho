-- 3/6 — Lista de emails autorizados + perfil (cria is_allowed_user após a tabela)

create table public.allowed_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint allowed_emails_email_lowercase check (email = lower(email)),
  constraint allowed_emails_email_format check (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

create unique index allowed_emails_email_idx on public.allowed_emails (email);

comment on table public.allowed_emails is
  'Emails com permissão de acesso ao portal. Gerenciar via SQL/dashboard (service role).';

alter table public.allowed_emails enable row level security;

-- Usuário autenticado só pode verificar se o próprio email está na lista
create policy "allowed_emails_select_own"
  on public.allowed_emails
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Função RLS (precisa existir antes das policies em profiles / demais tabelas)
create or replace function public.is_allowed_user()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.allowed_emails ae
    where lower(ae.email) = lower(auth.jwt() ->> 'email')
  );
end;
$$;

comment on function public.is_allowed_user() is
  'Retorna true quando o usuário autenticado está na lista allowed_emails.';

-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (email);

comment on table public.profiles is
  'Perfil do usuário (nome exibido). id = auth.users.id.';

alter table public.profiles enable row level security;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Cria perfil ao registrar no Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create policy "profiles_select_allowed"
  on public.profiles
  for select
  to authenticated
  using (public.is_allowed_user());

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (public.is_allowed_user() and id = auth.uid())
  with check (public.is_allowed_user() and id = auth.uid());
