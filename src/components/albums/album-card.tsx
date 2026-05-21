import Image from "next/image";
import Link from "next/link";
import type { AlbumListItem } from "@/lib/albums/queries";
import { formatPhotoCount } from "@/lib/photos/format";

type AlbumCardProps = {
  album: AlbumListItem;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`} className="album-card">
      <div className="album-cover">
        {album.coverUrl ? (
          <Image
            src={album.coverUrl}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 280px"
            className="album-cover-img"
          />
        ) : (
          <div className="album-cover-placeholder" aria-hidden />
        )}
        <span className="count-badge">{formatPhotoCount(album.photoCount)}</span>
      </div>
      <div className="album-info">
        <h2 className="album-title">
          <span
            className="album-color-tag"
            style={{ background: album.dotColor }}
          />
          {album.title}
        </h2>
        <p className="album-meta">{album.meta}</p>
      </div>
    </Link>
  );
}
