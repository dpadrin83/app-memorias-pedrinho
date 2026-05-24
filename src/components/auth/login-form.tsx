"use client";

import { useState } from "react";
import { isPublicSupabaseEnvConfigured } from "@/lib/supabase/env";

type LoginFormProps = {
  serverError?: string;
};

export function LoginForm({ serverError }: LoginFormProps) {
  const [error, setError] = useState<string | undefined>(serverError);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);

    if (!isPublicSupabaseEnvConfigured()) {
      setError("Configuração Supabase ausente. Verifique as variáveis na Vercel.");
      setPending(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Preencha email e senha.");
      setPending(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Não foi possível entrar. Tente de novo.");
        setPending(false);
        return;
      }

      // Recarregamento completo para o servidor ler os cookies de sessão
      window.location.assign("/");
    } catch {
      setError("Erro de rede. Verifique a conexão e tente de novo.");
      setPending(false);
    }
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
          placeholder="••••••••"
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
