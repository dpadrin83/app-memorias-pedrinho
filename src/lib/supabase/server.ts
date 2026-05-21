import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseEnv, isPublicSupabaseEnvConfigured } from "./env";

/** Cliente Supabase ou null — não lança (uso em páginas/queries). */
export async function tryCreateClient() {
  try {
    if (!isPublicSupabaseEnvConfigured()) return null;
    return await createClient();
  } catch (error) {
    console.error("[supabase] tryCreateClient:", error);
    return null;
  }
}

export async function createClient() {
  const { url, anonKey } = getPublicSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel e faça redeploy.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Ignorado em Server Components; server actions renovam a sessão.
        }
      },
    },
  });
}
