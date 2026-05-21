"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { addPhotosToAlbum } from "@/lib/albums/actions";
import type { PickablePhoto } from "@/lib/albums/queries";

type AddPhotosModalProps = {
  open: boolean;
  onClose: () => void;
  albumId: string;
  photos: PickablePhoto[];
};

export function AddPhotosModal({
  open,
  onClose,
  albumId,
  photos,
}: AddPhotosModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = async () => {
    setSaving(true);
    setError(null);
    const result = await addPhotosToAlbum(albumId, [...selected]);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSelected(new Set());
    onClose();
    router.refresh();
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="modal-panel modal-panel-wide" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h2 className="modal-title">Adicionar fotos</h2>
            <p className="modal-sub">
              Selecione fotos da biblioteca para incluir neste álbum.
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

        {photos.length === 0 ? (
          <p className="modal-empty">
            Todas as fotos já estão neste álbum ou não há fotos na biblioteca.
          </p>
        ) : (
          <div className="pick-grid">
            {photos.map((photo) => {
              const isOn = selected.has(photo.id);
              return (
                <button
                  key={photo.id}
                  type="button"
                  className={`pick-card${isOn ? " pick-card-selected" : ""}`}
                  onClick={() => toggle(photo.id)}
                >
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title ?? "Foto"}
                    fill
                    sizes="120px"
                    className="pick-card-img"
                  />
                  {isOn ? <span className="pick-check">✓</span> : null}
                </button>
              );
            })}
          </div>
        )}

        {error ? <p className="field-error">{error}</p> : null}

        <footer className="modal-footer">
          <span className="modal-footer-hint">
            {selected.size} selecionada{selected.size === 1 ? "" : "s"}
          </span>
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
            onClick={() => void submit()}
            disabled={saving || selected.size === 0}
          >
            {saving ? "Adicionando…" : "Adicionar ao álbum"}
          </button>
        </footer>
      </div>
    </div>
  );
}
