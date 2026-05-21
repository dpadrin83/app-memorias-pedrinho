import { createAdminClient } from "@/lib/supabase/admin";
import { isPublicSupabaseEnvConfigured } from "@/lib/supabase/env";

export type EmailAllowedResult =
  | { allowed: true }
  | { allowed: false; reason: "not_listed" | "config" };

/**
 * Verifica allowed_emails com service role (ignora RLS).
 * A checagem com cliente autenticado falha no login porque a sessão
 * ainda não está visível na mesma requisição.
 */
export async function checkEmailAllowed(
  email: string,
): Promise<EmailAllowedResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { allowed: false, reason: "not_listed" };
  }

  if (!isPublicSupabaseEnvConfigured()) {
    return { allowed: false, reason: "config" };
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) {
    console.error("[auth] SUPABASE_SERVICE_ROLE_KEY ausente");
    return { allowed: false, reason: "config" };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("allowed_emails")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();

  if (error) {
    console.error("[auth] allowed_emails (admin):", error.message);
    return { allowed: false, reason: "config" };
  }

  if (!data) {
    return { allowed: false, reason: "not_listed" };
  }

  return { allowed: true };
}
