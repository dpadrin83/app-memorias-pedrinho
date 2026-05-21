"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { PhotoTimeline } from "@/components/photos/photo-timeline";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import type { PhotoView } from "@/lib/photos/views";
import { PHOTO_PAGE_SIZE } from "@/lib/photos/views";
import { PhotoList } from "./photo-list";

const PhotoMap = dynamic(
  () => import("./photo-map").then((m) => m.PhotoMap),
  { ssr: false, loading: () => <div className="photo-map-loading">Carregando mapa…</div> },
);

type PhotoGalleryViewProps = {
  view: PhotoView;
  photos: PhotoDisplayItem[];
  totalCount: number;
  loadedCount: number;
  loadMoreHref: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: React.ReactNode;
};

export function PhotoGalleryView({
  view,
  photos,
  totalCount,
  loadedCount,
  loadMoreHref,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: PhotoGalleryViewProps) {
  if (photos.length === 0) {
    return (
      <EmptyPlaceholder
        title={emptyTitle}
        description={emptyDescription}
        icon={<ImageIcon size={36} strokeWidth={1.5} />}
        action={emptyAction}
      />
    );
  }

  const hasMore = loadedCount < totalCount;
  const geoCount = photos.filter((p) => p.lat != null && p.lng != null).length;
  const hiddenGeo = photos.length - geoCount;

  return (
    <>
      {view === "timeline" ? (
        <PhotoTimeline photos={photos} />
      ) : view === "map" ? (
        <PhotoMap photos={photos} hiddenCount={hiddenGeo} />
      ) : view === "list" ? (
        <PhotoList photos={photos} />
      ) : (
        <PhotoGrid photos={photos} />
      )}

      {hasMore && view !== "map" ? (
        <div className="gallery-load-more">
          <Link href={loadMoreHref} className="btn btn-outline">
            Carregar mais fotos
          </Link>
          <p className="gallery-load-meta">
            Mostrando {photos.length} de {totalCount}
          </p>
        </div>
      ) : null}
    </>
  );
}

export { PHOTO_PAGE_SIZE };
