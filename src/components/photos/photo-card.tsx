import Image from "next/image";
import Link from "next/link";
import type { PhotoGalleryItem } from "@/lib/photos/queries";

type PhotoCardProps = {
  photo: PhotoGalleryItem;
  priority?: boolean;
};

export function PhotoCard({ photo, priority = false }: PhotoCardProps) {
  return (
    <Link href={`/photo/${photo.id}`} className="photo-card">
      <Image
        src={photo.thumbnailUrl}
        alt={photo.title ?? "Foto"}
        fill
        sizes="(max-width: 600px) 50vw, (max-width: 1200px) 25vw, 200px"
        className="photo-card-img"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
      />
    </Link>
  );
}
