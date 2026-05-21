"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  serverError?: string;
};

export function LoginForm({ serverError }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(serverError);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Preencha email e senha.");
      setPending(false);
      return;
    }

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email ou senha incorretos.");
      setPending(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      await supabase.auth.signOut();
      setError("Não foi possível validar a sessão.");
      setPending(false);
      return;
    }

    const { data: allowed, error: allowedError } = await supabase
      .from("allowed_emails")
      .select("id")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    if (allowedError || !allowed) {
      await supabase.auth.signOut();
      setError("Este email não está autorizado a acessar o portal.");
      setPending(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="field">
        <label className="field-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seu@email.com"
          required
          disabled={pending}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="login-password">
          Senha
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          required
          minLength={6}
          disabled={pending}
        />
      </div>

      {error ? (
        <p className="field-hint field-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary login-submit"
        disabled={pending}
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
