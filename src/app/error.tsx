"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Algo deu errado</h1>
        <p className="login-sub">
          {error.message ||
            "Erro ao carregar a página. Confira as variáveis do Supabase na Vercel e tente de novo."}
        </p>
        {error.digest ? (
          <p className="field-hint">Código: {error.digest}</p>
        ) : null}
        <button
          type="button"
          className="btn btn-primary login-submit"
          onClick={reset}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
