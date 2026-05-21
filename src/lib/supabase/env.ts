/** Variáveis públicas do Supabase (trim + alias publishable). */
export function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    "";
  return { url, anonKey };
}

export function isPublicSupabaseEnvConfigured() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return Boolean(url && anonKey);
}
