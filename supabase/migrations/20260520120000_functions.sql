-- 1/6 — RODE PRIMEIRO. Só handle_updated_at (sem depender de tabelas).

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
