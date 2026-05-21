import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

/** Diagnóstico: qual projeto Supabase a Vercel está usando e quais emails estão autorizados. */
export async function GET(request: Request) {
  const { url } = getPublicSupabaseEnv();
  const projectRef =
    url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? "url-invalida";

  const hasServiceKey = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );

  const { searchParams } = new URL(request.url);
  const checkEmail = searchParams.get("email")?.trim().toLowerCase() ?? null;

  let allowedEmails: string[] = [];
  let adminError: string | null = null;
  let emailListed: boolean | null = null;

  if (hasServiceKey && url) {
    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("allowed_emails")
        .select("email")
        .order("email");

      if (error) {
        adminError = error.message;
      } else {
        allowedEmails = (data ?? []).map((r) => r.email);
        if (checkEmail) {
          emailListed = allowedEmails.includes(checkEmail);
        }
      }
    } catch (e) {
      adminError = e instanceof Error ? e.message : "erro desconhecido";
    }
  }

  return NextResponse.json({
    projectRef,
    supabaseHost: url ? new URL(url).host : null,
    hasServiceKey,
    allowedEmails,
    checkEmail,
    emailListed,
    adminError,
    hint:
      "O projectRef deve ser o mesmo projeto onde você rodou o SQL. Compare com Settings → API no Supabase.",
  });
}
