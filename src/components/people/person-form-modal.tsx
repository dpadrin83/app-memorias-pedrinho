"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPerson, updatePerson } from "@/lib/people/actions";

type PersonFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  personId?: string;
  initialName?: string;
  initialRelationship?: string;
};

export function PersonFormModal({
  open,
  onClose,
  mode,
  personId,
  initialName = "",
  initialRelationship = "",
}: PersonFormModalProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [relationship, setRelationship] = useState(initialRelationship);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setRelationship(initialRelationship);
      setError(null);
    }
  }, [open, initialName, initialRelationship]);

  if (!open) return null;

  const submit = async () => {
    setSaving(true);
    setError(null);

    const result =
      mode === "create"
        ? await createPerson({ name, relationship })
        : await updatePerson({ id: personId!, name, relationship });

    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    onClose();
    router.refresh();
    if (mode === "create" && result.id) {
      router.push(`/people/${result.id}`);
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
              {mode === "create" ? "Adicionar pessoa" : "Editar pessoa"}
            </h2>
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
          <label className="field-label" htmlFor="person-name">
            Nome
          </label>
          <input
            id="person-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Pedrinho"
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="person-rel">
            Parentesco (opcional)
          </label>
          <input
            id="person-rel"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Ex.: filho, avó, tio"
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
            className="btn btn-sm btn-pessoas-create"
            onClick={() => void submit()}
            disabled={saving}
          >
            {saving ? "Salvando…" : mode === "create" ? "Adicionar" : "Salvar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
