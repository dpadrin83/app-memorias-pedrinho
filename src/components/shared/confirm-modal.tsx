"use client";

import { X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="modal-panel confirm-modal" role="alertdialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-sub">{description}</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </header>
        <footer className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn${variant === "danger" ? " btn-danger" : " btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Aguarde…" : confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
