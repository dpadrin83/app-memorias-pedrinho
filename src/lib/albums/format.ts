import { formatPhotoCount } from "@/lib/photos/format";

export function formatAlbumCount(count: number): string {
  const albums = count === 1 ? "álbum" : "álbuns";
  return `${count} ${albums} · Por evento, viagem ou tema`;
}

export function formatAlbumPhotoSubtitle(
  count: number,
  description: string | null,
) {
  const base = formatPhotoCount(count);
  return description?.trim() ? `${base} · ${description.trim()}` : base;
}
