"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import {
  permanentlyDeleteAlbum,
  restoreAlbum,
} from "@/lib/trash/actions";
import type { TrashAlbumItem } from "@/lib/trash/queries";

type TrashAlbumsListProps = {
  albums: TrashAlbumItem[];
};

export function TrashAlbumsList({ albums }: TrashAlbumsListProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const runRestore = async (albumId: string) => {
    setPendingId(albumId);
    await restoreAlbum(albumId);
    setPendingId(null);
    router.refresh();
  };

  const runDelete = async () => {
    if (!confirmDeleteId) return;
    setPendingId(confirmDeleteId);
    await permanentlyDeleteAlbum(confirmDeleteId);
    setPendingId(null);
    setConfirmDeleteId(null);
    router.refresh();
  };

  return (
    <>
      <ul className="trash-albums-list">
        {albums.map((album) => (
          <li key={album.id} className="trash-album-row">
            <div
              className="album-dot"
              style={{ background: album.dotColor }}
              aria-hidden
            />
            <div className="trash-album-cover">
              {album.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={album.coverUrl} alt="" />
              ) : (
                <span className="trash-album-cover-empty" />
              )}
            </div>
            <div className="trash-album-main">
              <span className="trash-album-title">{album.title}</span>
              <span className="trash-album-meta">{album.meta}</span>
            </div>
            <div className="trash-list-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => void runRestore(album.id)}
                disabled={pendingId === album.id}
              >
                <RotateCcw size={14} strokeWidth={1.75} />
                Restaurar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setConfirmDeleteId(album.id)}
                disabled={pendingId === album.id}
              >
                <Trash2 size={14} strokeWidth={1.75} />
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={Boolean(confirmDeleteId)}
        title="Apagar álbum definitivamente?"
        description="O álbum será removido do banco. As fotos permanecem na biblioteca."
        confirmLabel="Apagar definitivamente"
        loading={Boolean(pendingId)}
        onConfirm={() => void runDelete()}
        onClose={() => !pendingId && setConfirmDeleteId(null)}
      />
    </>
  );
}
