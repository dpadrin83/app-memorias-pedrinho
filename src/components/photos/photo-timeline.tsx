import { groupPhotosByMonth } from "@/lib/photos/group-by-month";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { PhotoCard } from "./photo-card";

type PhotoTimelineProps = {
  photos: PhotoGalleryItem[];
};

export function PhotoTimeline({ photos }: PhotoTimelineProps) {
  const groups = groupPhotosByMonth(photos);

  return (
    <div className="photo-timeline">
      {groups.map((group) => (
        <section key={group.key} className="month-group">
          <header className="month-head">
            <h2 className="month-title">{group.label}</h2>
            <span className="month-sub">{group.subtitle}</span>
          </header>
          <div className="ph-grid">
            {group.photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                priority={group.key !== "undated" && index < 4}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
