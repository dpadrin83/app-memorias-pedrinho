import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkEmailAllowed } from "@/lib/auth/is-email-allowed";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const { url, anonKey } = getPublicSupabaseEnv();

  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "Supabase não configurado no servidor." },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Preencha email e senha." },
      { status: 400 },
    );
  }

  const allowedCheck = await checkEmailAllowed(email);
  if (allowedCheck.allowed === false) {
    if (allowedCheck.reason === "config") {
      return NextResponse.json(
        {
          error:
            "Servidor sem SUPABASE_SERVICE_ROLE_KEY na Vercel. Adicione a chave e faça redeploy.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        error:
          "Este email não está em allowed_emails neste projeto Supabase. Confira o SQL no dashboard do mesmo projeto da Vercel.",
      },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    const message =
      signInError.message === "Invalid login credentials"
        ? "Email ou senha incorretos."
        : signInError.message;
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Não foi possível validar a sessão." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
