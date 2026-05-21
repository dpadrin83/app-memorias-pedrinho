"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpDown,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { categoryIcons } from "@/components/layout/sidebar";
import { AlbumFormModal } from "@/components/albums/album-form-modal";
import { AddPhotosModal } from "@/components/albums/add-photos-modal";
import { AlbumViewTabs } from "@/components/albums/album-view-tabs";
import { SortableAlbumGrid } from "@/components/albums/sortable-album-grid";
import { PhotoList } from "@/components/gallery/photo-list";
import { PhotoTimeline } from "@/components/photos/photo-timeline";

const PhotoMap = dynamic(
  () => import("@/components/gallery/photo-map").then((m) => m.PhotoMap),
  { ssr: false, loading: () => <div className="photo-map-loading">Carregando mapa…</div> },
);
import { softDeleteAlbum } from "@/lib/albums/actions";
import type { AlbumViewParams } from "@/lib/albums/params";
import { buildAlbumHref } from "@/lib/albums/params";
import type { AlbumDetail, PickablePhoto } from "@/lib/albums/queries";
import { formatAlbumPhotoSubtitle } from "@/lib/albums/format";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { ImageIcon } from "lucide-react";

type AlbumDetailScreenProps = {
  album: AlbumDetail;
  photos: PhotoGalleryItem[];
  pickablePhotos: PickablePhoto[];
  viewParams: AlbumViewParams;
};

export function AlbumDetailScreen({
  album,
  photos,
  pickablePhotos,
  viewParams,
}: AlbumDetailScreenProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const displayed = photos.slice(0, viewParams.loaded);
  const hasMore =
    viewParams.view !== "map" && photos.length > viewParams.loaded;
  const geoOnPage = displayed.filter((p) => p.lat != null && p.lng != null).length;
  const hiddenGeo = displayed.length - geoOnPage;

  const deleteAlbum = async () => {
    if (
      !window.confirm(
        `Mover o álbum "${album.title}" para a lixeira? As fotos permanecem na biblioteca.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    await softDeleteAlbum(album.id);
  };

  return (
    <>
      <CatHeader
        variant="albuns"
        icon={categoryIcons.albuns}
        title={album.title}
        subtitle={formatAlbumPhotoSubtitle(photos.length, album.description)}
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={14} strokeWidth={1.75} />
              Editar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-album-create"
              onClick={() => setAddOpen(true)}
            >
              <Plus size={14} strokeWidth={2} />
              Adicionar fotos
            </button>
          </>
        }
      />
      <div className="screen-body">
        <AlbumViewTabs albumId={album.id} viewParams={viewParams} />

        {photos.length === 0 ? (
          <EmptyPlaceholder
            title="Álbum vazio"
            description="Adicione fotos da biblioteca para montar este álbum."
            icon={<ImageIcon size={36} strokeWidth={1.5} />}
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setAddOpen(true)}
              >
                <ImagePlus size={16} strokeWidth={2} />
                Adicionar fotos
              </button>
            }
          />
        ) : viewParams.view === "timeline" ? (
          <PhotoTimeline photos={displayed} />
        ) : viewParams.view === "map" ? (
          <PhotoMap photos={displayed} hiddenCount={hiddenGeo} />
        ) : viewParams.view === "list" ? (
          <PhotoList photos={displayed} />
        ) : (
          <>
            <p className="album-dnd-hint">
              <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
              Arraste as fotos para reordenar (modo Grid)
            </p>
            <SortableAlbumGrid albumId={album.id} photos={displayed} />
          </>
        )}

        {hasMore ? (
          <div className="gallery-load-more">
            <Link
              href={buildAlbumHref(album.id, {
                loaded: viewParams.loaded + 60,
              }, viewParams)}
              className="btn btn-outline"
            >
              Carregar mais fotos
            </Link>
          </div>
        ) : null}

        <div className="album-detail-actions">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => void deleteAlbum()}
            disabled={deleting}
          >
            <Trash2 size={14} strokeWidth={1.75} />
            {deleting ? "Movendo…" : "Mover álbum pra lixeira"}
          </button>
        </div>
      </div>

      <AlbumFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        albumId={album.id}
        initialTitle={album.title}
        initialDescription={album.description ?? ""}
      />
      <AddPhotosModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        albumId={album.id}
        photos={pickablePhotos}
      />
    </>
  );
}
