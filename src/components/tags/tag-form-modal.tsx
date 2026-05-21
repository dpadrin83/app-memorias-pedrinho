"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createTag, updateTag } from "@/lib/tags/actions";

type TagFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  tagId?: string;
  initialName?: string;
};

export function TagFormModal({
  open,
  onClose,
  mode,
  tagId,
  initialName = "",
}: TagFormModalProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError(null);
    }
  }, [open, initialName]);

  if (!open) return null;

  const submit = async () => {
    setSaving(true);
    setError(null);

    const result =
      mode === "create"
        ? await createTag(name)
        : await updateTag(tagId!, name);

    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    onClose();
    router.refresh();
    if (mode === "create" && result.id) {
      router.push(`/tags/${result.id}`);
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
              {mode === "create" ? "Criar tag" : "Renomear tag"}
            </h2>
            <p className="modal-sub">Nome em minúsculas, único no portal.</p>
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
          <label className="field-label" htmlFor="tag-name">
            Nome
          </label>
          <input
            id="tag-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: família, praia, aniversário"
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
            className="btn btn-sm btn-tags-create"
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
