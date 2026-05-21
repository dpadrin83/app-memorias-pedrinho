import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "./env";

/**
 * Cliente com secret key — apenas em Server Actions/API routes.
 * Nunca importar em componentes client-side.
 */
export function createAdminClient() {
  const { url } = getPublicSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  return createClient(
    url,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
