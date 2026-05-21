"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TrashAlbumsList } from "@/components/trash/trash-albums-list";
import { TrashPhotoViews } from "@/components/trash/trash-photo-views";
import { TrashViewTabs } from "@/components/trash/trash-view-tabs";
import {
  emptyTrashAlbums,
  emptyTrashPhotos,
} from "@/lib/trash/actions";
import { buildTrashHref, type TrashViewParams } from "@/lib/trash/params";
import type { TrashAlbumItem } from "@/lib/trash/queries";
import type { PhotoDisplayItem } from "@/lib/photos/types";

type TrashScreenProps = {
  params: TrashViewParams;
  photos: PhotoDisplayItem[];
  albums: TrashAlbumItem[];
};

export function TrashScreen({ params, photos, albums }: TrashScreenProps) {
  const router = useRouter();
  const [emptying, setEmptying] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const isPhotos = params.section === "photos";
  const count = isPhotos ? photos.length : albums.length;
  const isEmpty = count === 0;

  const runEmpty = async () => {
    setEmptying(true);
    const result = isPhotos ? await emptyTrashPhotos() : await emptyTrashAlbums();
    setEmptying(false);
    setConfirmEmpty(false);
    if (result.ok) router.refresh();
  };

  return (
    <div className="screen-body trash-page">
      <header className="trash-page-head">
        <div>
          <h1 className="trash-page-title">Lixeira</h1>
          <p className="trash-page-lead">
            Itens ficam aqui por 30 dias e depois são removidos automaticamente.
          </p>
        </div>
        {!isEmpty ? (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setConfirmEmpty(true)}
            disabled={emptying}
          >
            <Trash2 size={14} strokeWidth={1.75} />
            Esvaziar lixeira
          </button>
        ) : null}
      </header>

      <nav className="tabs" aria-label="Tipo de item na lixeira">
        <Link
          href={buildTrashHref({ section: "photos", view: params.view })}
          className={`tab${isPhotos ? " active" : ""}`}
        >
          Fotos ({photos.length})
        </Link>
        <Link
          href={buildTrashHref({ section: "albums", view: "grid" })}
          className={`tab${!isPhotos ? " active" : ""}`}
        >
          Álbuns ({albums.length})
        </Link>
      </nav>

      {isEmpty ? (
        <EmptyPlaceholder
          title={isPhotos ? "Nenhuma foto na lixeira" : "Nenhum álbum na lixeira"}
          description="Itens excluídos aparecem aqui antes da remoção definitiva."
          icon={<Trash2 size={36} strokeWidth={1.5} />}
        />
      ) : isPhotos ? (
        <>
          <TrashViewTabs params={params} />
          <TrashPhotoViews photos={photos} view={params.view} />
        </>
      ) : (
        <TrashAlbumsList albums={albums} />
      )}

      <ConfirmModal
        open={confirmEmpty}
        title="Esvaziar lixeira?"
        description={
          isPhotos
            ? "Todas as fotos na lixeira serão apagadas definitivamente do banco e do storage."
            : "Todos os álbuns na lixeira serão removidos definitivamente do banco."
        }
        confirmLabel="Esvaziar lixeira"
        loading={emptying}
        onConfirm={() => void runEmpty()}
        onClose={() => !emptying && setConfirmEmpty(false)}
      />
    </div>
  );
}
