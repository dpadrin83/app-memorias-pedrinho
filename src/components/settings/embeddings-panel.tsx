"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { regenerateAllEmbeddings } from "@/lib/embeddings/actions";

type EmbeddingsPanelProps = {
  enabled: boolean;
};

export function EmbeddingsPanel({ enabled }: EmbeddingsPanelProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    if (
      !window.confirm(
        "Regenerar embeddings de todas as fotos ativas? Pode levar alguns minutos e consome créditos da OpenAI.",
      )
    ) {
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await regenerateAllEmbeddings();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(
        `Concluído: ${result.processed} atualizadas${result.failed ? `, ${result.failed} com erro` : ""}.`,
      );
    });
  };

  return (
    <section className="settings-panel">
      <div className="settings-panel-head">
        <Sparkles size={20} strokeWidth={1.75} aria-hidden />
        <div>
          <h2 className="settings-panel-title">Busca por IA</h2>
          <p className="settings-panel-lead">
            Embeddings OpenAI (<code>text-embedding-3-small</code>) são gerados após
            upload e ao salvar metadados. Use este comando para reprocessar o acervo
            inteiro.
          </p>
        </div>
      </div>
      {!enabled ? (
        <p className="settings-panel-status" style={{ color: "var(--text-secondary)" }}>
          Busca por IA desativada — adicione <code>OPENAI_API_KEY</code> no{" "}
          <code>.env.local</code> quando quiser usar.
        </p>
      ) : (
        <button
          type="button"
          className="btn btn-outline"
          onClick={run}
          disabled={pending}
        >
          {pending ? "Regenerando…" : "Regenerar todos os embeddings"}
        </button>
      )}
      {message ? (
        <p className="settings-panel-status settings-panel-status-ok" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="settings-panel-status settings-panel-status-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
