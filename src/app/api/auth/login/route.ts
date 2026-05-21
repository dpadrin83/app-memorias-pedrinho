import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

  const { data: allowed, error: allowedError } = await supabase
    .from("allowed_emails")
    .select("id")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (allowedError) {
    console.error("[api/auth/login] allowed_emails:", allowedError.message);
    return NextResponse.json(
      { error: "Erro ao verificar permissão. Tente de novo." },
      { status: 500 },
    );
  }

  if (!allowed) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Este email não está autorizado a acessar o portal." },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true });
}
