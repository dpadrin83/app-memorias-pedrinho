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
        <p className="login-sub" style={{ marginBottom: "1rem" }}>
          {error.message ||
            "Erro ao carregar a página. Confira as variáveis do Supabase na Vercel e tente de novo."}
        </p>
        <button type="button" className="btn btn-primary" onClick={reset}>
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
