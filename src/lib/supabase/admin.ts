import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com secret key — apenas em Server Actions/API routes.
 * Nunca importar em componentes client-side.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
