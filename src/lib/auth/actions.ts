"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha email e senha." };
  }

  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: "Email ou senha incorretos." };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user?.email) {
    await supabase.auth.signOut();
    return { error: "Não foi possível validar a sessão." };
  }

  const { data: allowed } = await supabase
    .from("allowed_emails")
    .select("id")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (!allowed) {
    await supabase.auth.signOut();
    return {
      error: "Este email não está autorizado a acessar o portal.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
