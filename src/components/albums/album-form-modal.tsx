"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { createAlbum, updateAlbum } from "@/lib/albums/actions";

type AlbumFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  albumId?: string;
  initialTitle?: string;
  initialDescription?: string;
};

export function AlbumFormModal({
  open,
  onClose,
  mode,
  albumId,
  initialTitle = "",
  initialDescription = "",
}: AlbumFormModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      title,
      description,
    };

    const result =
      mode === "create"
        ? await createAlbum(payload)
        : await updateAlbum({ id: albumId!, ...payload });

    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onClose();
    router.refresh();
    if (mode === "create" && result.albumId) {
      router.push(`/albums/${result.albumId}`);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="modal-panel" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h2 className="modal-title">
              {mode === "create" ? "Criar álbum" : "Editar álbum"}
            </h2>
            <p className="modal-sub">
              Título e descrição aparecem na lista de álbuns.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </header>

        <div className="field">
          <label className="field-label" htmlFor="album-title">
            Título
          </label>
          <input
            id="album-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Aniversário do Pedrinho"
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="album-desc">
            Descrição
          </label>
          <textarea
            id="album-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opcional — viagem, evento, tema"
          />
        </div>

        {error ? <p className="field-error">{error}</p> : null}

        <footer className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: "var(--yellow)", color: "var(--text-primary)" }}
            onClick={() => void submit()}
            disabled={saving}
          >
            {saving ? "Salvando…" : mode === "create" ? "Criar" : "Salvar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
