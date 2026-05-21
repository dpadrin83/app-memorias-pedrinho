import { UploadButton } from "@/components/upload/upload-button";
import { PhotoGalleryView } from "@/components/gallery/photo-gallery-view";
import { buildGalleryHref } from "@/lib/gallery/build-href";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import type { PhotoView } from "@/lib/photos/views";
import { PHOTO_PAGE_SIZE } from "@/lib/photos/views";

type FotosGalleryProps = {
  view: PhotoView;
  photos: PhotoDisplayItem[];
  totalCount: number;
  loadedCount: number;
};

export function FotosGallery({
  view,
  photos,
  totalCount,
  loadedCount,
}: FotosGalleryProps) {
  return (
    <PhotoGalleryView
      view={view}
      photos={photos}
      totalCount={totalCount}
      loadedCount={loadedCount}
      loadMoreHref={buildGalleryHref("/", view, {
        loaded: loadedCount + PHOTO_PAGE_SIZE,
      })}
      emptyTitle="Nenhuma foto ainda"
      emptyDescription="Envie a primeira memória — extraímos data e local do EXIF automaticamente."
      emptyAction={
        <UploadButton className="btn btn-primary">Enviar fotos</UploadButton>
      }
    />
  );
}
