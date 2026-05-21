-- Cole no SQL Editor se aparecer: function public.is_allowed_user() does not exist
-- (rode só isto; depois continue as migrations que falharam)

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Requer tabela public.allowed_emails — rode o início de 20260520120002 antes se ainda não existir
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
