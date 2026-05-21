"use client";

import { useActionState } from "react";
import { signIn, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

type LoginFormProps = {
  serverError?: string;
};

export function LoginForm({ serverError }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const error = state.error ?? serverError;

  return (
    <form action={formAction} className="login-form">
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
