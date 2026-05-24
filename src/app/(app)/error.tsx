"use client";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Não foi possível abrir o portal</h1>
        <p className="login-sub">
          {error.message ||
            "Erro ao carregar a página. Tente entrar de novo ou recarregue."}
        </p>
        {error.digest ? (
          <p className="field-hint">Código: {error.digest}</p>
        ) : null}
        <div className="login-card-actions">
          <button type="button" className="btn btn-primary" onClick={reset}>
            Tentar novamente
          </button>
          <a href="/login" className="btn btn-outline">
            Voltar ao login
          </a>
        </div>
      </div>
    </div>
  );
}
