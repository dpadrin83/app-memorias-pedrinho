import { tryCreateClient } from "@/lib/supabase/server";
import { albumColorForId } from "./colors";
import {
  flattenJoinPhotos,
  mapPhotoRowsToDisplay,
  PHOTO_INNER_SELECT,
} from "@/lib/photos/map-display-row";
import type { PhotoDisplayItem } from "@/lib/photos/types";
import { getSignedThumbnailUrl } from "@/lib/photos/urls";

export type { PhotoDisplayItem as PhotoGalleryItem } from "@/lib/photos/types";

export type AlbumListItem = {
  id: string;
  title: string;
  description: string | null;
  photoCount: number;
  coverUrl: string | null;
  dotColor: string;
  meta: string;
};

export type AlbumDetail = {
  id: string;
  title: string;
  description: string | null;
  coverPhotoId: string | null;
  dotColor: string;
};

async function resolveCoverUrl(
  coverPhotoId: string | null,
  albumId: string,
): Promise<string | null> {
  const supabase = await tryCreateClient();
  if (!supabase) return null;

  if (coverPhotoId) {
    const { data } = await supabase
      .from("photos")
      .select("thumbnail_path")
      .eq("id", coverPhotoId)
      .is("deleted_at", null)
      .maybeSingle();
    if (data?.thumbnail_path) {
      return getSignedThumbnailUrl(data.thumbnail_path);
    }
  }

  const { data: first } = await supabase
    .from("album_photos")
    .select("photos!inner(thumbnail_path)")
    .eq("album_id", albumId)
    .is("photos.deleted_at", null)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  const photo = first?.photos as { thumbnail_path: string } | { thumbnail_path: string }[] | null;
  const path = Array.isArray(photo) ? photo[0]?.thumbnail_path : photo?.thumbnail_path;
  if (!path) return null;
  return getSignedThumbnailUrl(path);
}

export type SidebarAlbumLink = {
  id: string;
  title: string;
  dotColor: string;
};

export async function getRecentAlbumsForSidebar(
  limit = 3,
): Promise<SidebarAlbumLink[]> {
  const supabase = await tryCreateClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("albums")
    .select("id, title")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    dotColor: albumColorForId(row.id),
  }));
}

export async function getActiveAlbums(): Promise<AlbumListItem[]> {
  const supabase = await tryCreateClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("albums")
    .select(
      "id, title, description, cover_photo_id, created_at, album_photos(count)",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [];

  const items: AlbumListItem[] = [];

  for (const row of data) {
    const countRow = row.album_photos as { count: number }[] | null;
    const photoCount = countRow?.[0]?.count ?? 0;
    const coverUrl = await resolveCoverUrl(row.cover_photo_id, row.id);
    const meta =
      row.description?.trim() ||
      new Date(row.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });

    items.push({
      id: row.id,
      title: row.title,
      description: row.description,
      photoCount,
      coverUrl,
      dotColor: albumColorForId(row.id),
      meta,
    });
  }

  return items;
}

export async function getAlbumById(id: string): Promise<AlbumDetail | null> {
  const supabase = await tryCreateClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("albums")
    .select("id, title, description, cover_photo_id")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    coverPhotoId: data.cover_photo_id,
    dotColor: albumColorForId(data.id),
  };
}

export async function getAlbumPhotos(
  albumId: string,
  limit = 500,
): Promise<PhotoDisplayItem[]> {
  const supabase = await tryCreateClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("album_photos")
    .select(`position, photos!inner(${PHOTO_INNER_SELECT})`)
    .eq("album_id", albumId)
    .is("photos.deleted_at", null)
    .order("position", { ascending: true })
    .limit(limit);

  if (error || !data?.length) return [];

  return mapPhotoRowsToDisplay(
    flattenJoinPhotos(data),
    getSignedThumbnailUrl,
  );
}

export type PickablePhoto = {
  id: string;
  title: string | null;
  thumbnailUrl: string;
};

export async function getPhotosAvailableForAlbum(
  albumId: string,
): Promise<PickablePhoto[]> {
  const supabase = await tryCreateClient();
  if (!supabase) return [];

  const { data: inAlbum } = await supabase
    .from("album_photos")
    .select("photo_id")
    .eq("album_id", albumId);

  const excludeIds = (inAlbum ?? []).map((r) => r.photo_id);

  let query = supabase
    .from("photos")
    .select("id, title, thumbnail_path")
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false })
    .limit(120);

  if (excludeIds.length) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error || !data?.length) return [];

  const items: PickablePhoto[] = [];
  for (const row of data) {
    const thumbnailUrl = await getSignedThumbnailUrl(row.thumbnail_path);
    if (!thumbnailUrl) continue;
    items.push({ id: row.id, title: row.title, thumbnailUrl });
  }
  return items;
}
