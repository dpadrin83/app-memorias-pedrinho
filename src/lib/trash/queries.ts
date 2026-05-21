import { createClient } from "@/lib/supabase/server";
import { albumColorForId } from "@/lib/albums/colors";
import {
  mapPhotoRowsToDisplay,
  PHOTO_DISPLAY_SELECT,
} from "@/lib/photos/map-display-row";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import { getSignedThumbnailUrl } from "@/lib/photos/urls";

export type TrashAlbumItem = {
  id: string;
  title: string;
  description: string | null;
  photoCount: number;
  coverUrl: string | null;
  dotColor: string;
  deletedAt: string;
  meta: string;
};

export async function getDeletedPhotos(): Promise<PhotoDisplayItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select(PHOTO_DISPLAY_SELECT)
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  if (error || !data?.length) return [];

  return mapPhotoRowsToDisplay(data, getSignedThumbnailUrl);
}

export async function getDeletedAlbums(): Promise<TrashAlbumItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select(
      "id, title, description, cover_photo_id, deleted_at, album_photos(count)",
    )
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  if (error || !data?.length) return [];

  const items: TrashAlbumItem[] = [];

  for (const row of data) {
    const countRow = row.album_photos as { count: number }[] | null;
    const photoCount = countRow?.[0]?.count ?? 0;
    let coverUrl: string | null = null;

    if (row.cover_photo_id) {
      const { data: cover } = await supabase
        .from("photos")
        .select("thumbnail_path")
        .eq("id", row.cover_photo_id)
        .maybeSingle();
      if (cover?.thumbnail_path) {
        coverUrl = await getSignedThumbnailUrl(cover.thumbnail_path);
      }
    }

    const deletedDate = row.deleted_at
      ? new Date(row.deleted_at).toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

    items.push({
      id: row.id,
      title: row.title,
      description: row.description,
      photoCount,
      coverUrl,
      dotColor: albumColorForId(row.id),
      deletedAt: row.deleted_at!,
      meta: `Excluído em ${deletedDate} · ${photoCount} foto${photoCount === 1 ? "" : "s"}`,
    });
  }

  return items;
}
