-- Extensão pgvector (arquivo separado — falha aqui não apaga as funções)

create extension if not exists vector with schema extensions;

grant usage on schema extensions to postgres, anon, authenticated, service_role;
