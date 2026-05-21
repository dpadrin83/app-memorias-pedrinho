"use client";

import { ArrowUpDown, Plus } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { ViewTabs } from "@/components/layout/view-tabs";
import { categoryIcons } from "@/components/layout/sidebar";
import { UploadButton } from "@/components/upload/upload-button";
import { UploadProvider } from "@/components/upload/upload-provider";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import type { PhotoView } from "@/lib/photos/views";
import { FotosGallery } from "./fotos-gallery";

type FotosScreenProps = {
  view: PhotoView;
  count: number;
  photos: PhotoGalleryItem[];
  loadedCount: number;
};

function formatCount(count: number) {
  const label = count === 1 ? "item" : "itens";
  return `${count} ${label} · Todas as memórias`;
}

export function FotosScreen({
  view,
  count,
  photos,
  loadedCount,
}: FotosScreenProps) {
  return (
    <UploadProvider>
      <CatHeader
        variant="fotos"
        icon={categoryIcons.fotos}
        title="Fotos"
        subtitle={formatCount(count)}
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm">
              <ArrowUpDown size={14} strokeWidth={1.75} />
              Ordenar
            </button>
            <UploadButton className="btn btn-primary btn-sm">
              <Plus size={14} strokeWidth={2} />
              Enviar
            </UploadButton>
          </>
        }
      />
      <div className="screen-body">
        <ViewTabs activeView={view} />
        <FotosGallery
          view={view}
          photos={photos}
          totalCount={count}
          loadedCount={loadedCount}
        />
      </div>
    </UploadProvider>
  );
}
