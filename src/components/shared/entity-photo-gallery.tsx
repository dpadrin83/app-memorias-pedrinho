import { PhotoGalleryView } from "@/components/gallery/photo-gallery-view";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import type { PhotoView } from "@/lib/photos/views";
import { PHOTO_PAGE_SIZE } from "@/lib/photos/views";

type EntityPhotoGalleryProps = {
  photos: PhotoDisplayItem[];
  view: PhotoView;
  loaded: number;
  loadMoreHref: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function EntityPhotoGallery({
  photos,
  view,
  loaded,
  loadMoreHref,
  emptyTitle,
  emptyDescription,
}: EntityPhotoGalleryProps) {
  const displayed = photos.slice(0, loaded);

  return (
    <PhotoGalleryView
      view={view}
      photos={displayed}
      totalCount={photos.length}
      loadedCount={loaded}
      loadMoreHref={loadMoreHref}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}

export { PHOTO_PAGE_SIZE };
