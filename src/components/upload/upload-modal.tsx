"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Upload, X } from "lucide-react";
import { uploadPhoto } from "@/lib/photos/actions";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
} from "@/lib/photos/constants";
import { validatePhotoFile } from "@/lib/photos/validate";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

type FileUploadState = {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

const ACCEPT = Object.fromEntries(
  ACCEPTED_MIME_TYPES.map((mime) => [mime, [...ACCEPTED_EXTENSIONS]]),
);

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function UploadModal({ open, onClose }: UploadModalProps) {
  const router = useRouter();
  const inputId = useId();
  const [queue, setQueue] = useState<FileUploadState[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const processingRef = useRef(false);

  const reset = useCallback(() => {
    setQueue([]);
    setIsRunning(false);
    processingRef.current = false;
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const updateItem = useCallback(
    (id: string, patch: Partial<FileUploadState>) => {
      setQueue((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
      );
    },
    [],
  );

  const runUploads = useCallback(
    async (batch: FileUploadState[]) => {
      if (processingRef.current || !batch.length) return;
      processingRef.current = true;
      setIsRunning(true);

      let hasError = false;

      for (const item of batch) {
        if (item.status !== "pending") continue;

        updateItem(item.id, { status: "uploading", progress: 12 });

        const tick = window.setInterval(() => {
          setQueue((prev) =>
            prev.map((entry) => {
              if (entry.id !== item.id || entry.status !== "uploading")
                return entry;
              return {
                ...entry,
                progress: Math.min(entry.progress + 8, 88),
              };
            }),
          );
        }, 200);

        const formData = new FormData();
        formData.append("file", item.file);
        const result = await uploadPhoto(formData);

        window.clearInterval(tick);

        if (result.ok) {
          updateItem(item.id, { status: "done", progress: 100 });
        } else {
          hasError = true;
          updateItem(item.id, {
            status: "error",
            progress: 0,
            error: result.error,
          });
        }
      }

      processingRef.current = false;
      setIsRunning(false);

      if (!hasError) {
        router.refresh();
        onClose();
      }
    },
    [onClose, router, updateItem],
  );

  const enqueueFiles = useCallback(
    (files: File[]) => {
      const next: FileUploadState[] = files.map((file) => {
        const validationError = validatePhotoFile(file);
        return {
          id: fileKey(file),
          file,
          status: validationError ? "error" : "pending",
          progress: 0,
          error: validationError ?? undefined,
        };
      });

      if (!next.length) return;

      const pending = next.filter((item) => item.status === "pending");

      setQueue((prev) => {
        const existing = new Set(prev.map((item) => item.id));
        return [
          ...prev,
          ...next.filter((item) => !existing.has(item.id)),
        ];
      });

      if (pending.length) {
        void runUploads(pending);
      }
    },
    [runUploads],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length || processingRef.current) return;
      enqueueFiles(accepted);
    },
    [enqueueFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open: openPicker } =
    useDropzone({
      onDrop,
      accept: ACCEPT,
      disabled: isRunning,
      multiple: true,
      noClick: isRunning,
    });

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isRunning) onClose();
      }}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        <header className="modal-header">
          <div>
            <h2 id="upload-modal-title" className="modal-title">
              Enviar fotos
            </h2>
            <p className="modal-sub">
              JPG, PNG, HEIC ou WebP — uma ou várias de uma vez.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm modal-close"
            onClick={onClose}
            disabled={isRunning}
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </header>

        <div
          {...getRootProps()}
          className={`dropzone${isDragActive ? " dropzone-active" : ""}${isRunning ? " dropzone-disabled" : ""}`}
        >
          <input {...getInputProps({ id: inputId })} />
          <div className="dropzone-icon" aria-hidden>
            <ImagePlus size={28} strokeWidth={1.5} />
          </div>
          <p className="dropzone-title">
            {isDragActive
              ? "Solte as fotos aqui"
              : "Arraste fotos ou clique para escolher"}
          </p>
          <p className="dropzone-hint">Até 50 MB por arquivo</p>
        </div>

        {queue.length > 0 && (
          <ul className="upload-queue">
            {queue.map((item) => (
              <li key={item.id} className="upload-item">
                <div className="upload-item-head">
                  <span className="upload-item-name">{item.file.name}</span>
                  <span className={`upload-item-status status-${item.status}`}>
                    {item.status === "pending" && "Na fila"}
                    {item.status === "uploading" && "Enviando…"}
                    {item.status === "done" && "Concluído"}
                    {item.status === "error" && (item.error ?? "Erro")}
                  </span>
                </div>
                {(item.status === "uploading" || item.status === "done") && (
                  <div className="progress-track" aria-hidden>
                    <div
                      className="progress-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <footer className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isRunning}
          >
            {isRunning ? "Aguarde…" : "Cancelar"}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isRunning}
            onClick={openPicker}
          >
            <Upload size={16} strokeWidth={2} />
            Escolher arquivos
          </button>
        </footer>
      </div>
    </div>
  );
}
