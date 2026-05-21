import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { PhotoCard } from "./photo-card";

type PhotoGridProps = {
  photos: PhotoGalleryItem[];
};

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="ph-grid">
      {photos.map((photo, index) => (
        <PhotoCard key={photo.id} photo={photo} priority={index < 6} />
      ))}
    </div>
  );
}
