"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { groupPhotosByMonth } from "@/lib/photos/group-by-month";
import {
  permanentlyDeletePhoto,
  restorePhoto,
} from "@/lib/trash/actions";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import type { PhotoView } from "@/lib/photos/views";

type TrashPhotoViewsProps = {
  photos: PhotoDisplayItem[];
  view: PhotoView;
};

export function TrashPhotoViews({ photos, view }: TrashPhotoViewsProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const runRestore = async (photoId: string) => {
    setPendingId(photoId);
    await restorePhoto(photoId);
    setPendingId(null);
    router.refresh();
  };

  const runDelete = async () => {
    if (!confirmDeleteId) return;
    setPendingId(confirmDeleteId);
    await permanentlyDeletePhoto(confirmDeleteId);
    setPendingId(null);
    setConfirmDeleteId(null);
    router.refresh();
  };

  const cardProps = {
    pendingId,
    onRestore: runRestore,
    onDeleteRequest: setConfirmDeleteId,
  };

  return (
    <>
      {view === "list" ? (
        <TrashPhotoList photos={photos} {...cardProps} />
      ) : view === "timeline" ? (
        <div className="photo-timeline">
          {groupPhotosByMonth(photos).map((group) => (
            <section key={group.key} className="month-group">
              <header className="month-head">
                <h2 className="month-title">{group.label}</h2>
                <span className="month-sub">{group.subtitle}</span>
              </header>
              <div className="trash-ph-grid">
                {group.photos.map((photo) => (
                  <TrashPhotoCard
                    key={photo.id}
                    photo={photo}
                    busy={pendingId === photo.id}
                    onRestore={() => void runRestore(photo.id)}
                    onDelete={() => setConfirmDeleteId(photo.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="trash-ph-grid">
          {photos.map((photo) => (
            <TrashPhotoCard
              key={photo.id}
              photo={photo}
              busy={pendingId === photo.id}
              onRestore={() => void runRestore(photo.id)}
              onDelete={() => setConfirmDeleteId(photo.id)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirmDeleteId)}
        title="Apagar definitivamente?"
        description="A foto será removida do banco e do storage. Esta ação não pode ser desfeita."
        confirmLabel="Apagar definitivamente"
        loading={Boolean(pendingId)}
        onConfirm={() => void runDelete()}
        onClose={() => !pendingId && setConfirmDeleteId(null)}
      />
    </>
  );
}

function TrashPhotoCard({
  photo,
  busy,
  onRestore,
  onDelete,
}: {
  photo: PhotoDisplayItem;
  busy: boolean;
  onRestore: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="trash-photo-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.thumbnailUrl} alt="" className="trash-photo-card-img" />
      <div className="trash-photo-card-actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onRestore}
          disabled={busy}
        >
          <RotateCcw size={14} strokeWidth={1.75} />
          Restaurar
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onDelete}
          disabled={busy}
        >
          <Trash2 size={14} strokeWidth={1.75} />
          Apagar
        </button>
      </div>
    </article>
  );
}

function TrashPhotoList({
  photos,
  pendingId,
  onRestore,
  onDeleteRequest,
}: {
  photos: PhotoDisplayItem[];
  pendingId: string | null;
  onRestore: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}) {
  return (
    <ul className="trash-list">
      {photos.map((photo) => (
        <li key={photo.id} className="trash-list-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.thumbnailUrl} alt="" className="trash-list-thumb" />
          <div className="trash-list-main">
            <span className="trash-list-title">{photo.title ?? "Sem título"}</span>
          </div>
          <div className="trash-list-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onRestore(photo.id)}
              disabled={pendingId === photo.id}
            >
              Restaurar
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteRequest(photo.id)}
              disabled={pendingId === photo.id}
            >
              Apagar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
