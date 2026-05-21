"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { formatEventDateLabel } from "@/lib/photos/format";
import type { PhotoDisplayItem } from "@/lib/photos/types";

type PhotoListProps = {
  photos: PhotoDisplayItem[];
};

export function PhotoList({ photos }: PhotoListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = photos.length > 0 && selected.size === photos.length;
  const someSelected = selected.size > 0;

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === photos.length) return new Set();
      return new Set(photos.map((p) => p.id));
    });
  }, [photos]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const selectedLabel = useMemo(() => {
    const n = selected.size;
    return n === 1 ? "1 foto selecionada" : `${n} fotos selecionadas`;
  }, [selected.size]);

  return (
    <div className="photo-list-wrap">
      <div className="photo-list-toolbar">
        <label className="photo-list-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            aria-label="Selecionar todas"
          />
          <span>Selecionar todas</span>
        </label>
        <span className="photo-list-count">{photos.length} fotos</span>
      </div>

      <ul className="photo-list" role="list">
        {photos.map((photo) => {
          const isChecked = selected.has(photo.id);
          const dateLabel = formatEventDateLabel(photo.eventDate);
          const metaParts = [
            dateLabel,
            photo.location,
            photo.people.length ? photo.people.join(", ") : null,
            photo.tags.length ? photo.tags.map((t) => `#${t}`).join(" ") : null,
          ].filter(Boolean);

          return (
            <li key={photo.id} className={`photo-list-row${isChecked ? " is-selected" : ""}`}>
              <input
                type="checkbox"
                className="photo-list-check"
                checked={isChecked}
                onChange={() => toggleOne(photo.id)}
                aria-label={`Selecionar ${photo.title ?? "foto"}`}
              />
              <Link href={`/photo/${photo.id}`} className="photo-list-link">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.thumbnailUrl} alt="" className="photo-list-thumb" />
                <div className="photo-list-main">
                  <span className="photo-list-title">{photo.title ?? "Sem título"}</span>
                  {metaParts.length > 0 ? (
                    <span className="photo-list-meta">{metaParts.join(" · ")}</span>
                  ) : (
                    <span className="photo-list-meta photo-list-meta-muted">Sem metadados</span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {someSelected ? (
        <div className="photo-list-batch" role="toolbar" aria-label="Ações em lote">
          <span className="photo-list-batch-label">{selectedLabel}</span>
          <div className="photo-list-batch-actions">
            <button type="button" className="btn btn-outline btn-sm" disabled title="Em breve">
              Atribuir tag
            </button>
            <button type="button" className="btn btn-outline btn-sm" disabled title="Em breve">
              Atribuir pessoa
            </button>
            <button type="button" className="btn btn-outline btn-sm" disabled title="Em breve">
              Mover para álbum
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearSelection}>
              Limpar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
