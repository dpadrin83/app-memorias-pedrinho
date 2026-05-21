import { createClient } from "@/lib/supabase/server";
import { tagPillVariant } from "@/lib/photos/format";
import { getSignedThumbnailUrl } from "@/lib/photos/urls";
import {
  flattenJoinPhotos,
  mapPhotoRowsToDisplay,
  PHOTO_INNER_SELECT,
} from "@/lib/photos/map-display-row";
import type { PhotoDisplayItem } from "@/lib/photos/types";

export type { PhotoDisplayItem as PhotoGalleryItem } from "@/lib/photos/types";

export type TagListItem = {
  id: string;
  name: string;
  photoCount: number;
  pillClass: string;
  label: string;
};

export type TagDetail = {
  id: string;
  name: string;
  pillClass: string;
};

export async function getTagsList(): Promise<TagListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, photo_tags(count)")
    .order("name");

  if (error || !data?.length) return [];

  return data.map((row) => {
    const countRow = row.photo_tags as { count: number }[] | null;
    const count = countRow?.[0]?.count ?? 0;
    const variant = tagPillVariant(row.name);
    return {
      id: row.id,
      name: row.name,
      photoCount: count,
      pillClass: variant ? `tag-pill ${variant}` : "tag-pill",
      label: `${row.name} · ${count}`,
    };
  });
}

export async function getTagById(id: string): Promise<TagDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const variant = tagPillVariant(data.name);
  return {
    id: data.id,
    name: data.name,
    pillClass: variant ? `tag-pill ${variant}` : "tag-pill",
  };
}

export async function getPhotosForTag(
  tagId: string,
  limit = 500,
): Promise<PhotoDisplayItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photo_tags")
    .select(`photos!inner(${PHOTO_INNER_SELECT})`)
    .eq("tag_id", tagId)
    .is("photos.deleted_at", null)
    .limit(limit);

  if (error || !data?.length) return [];

  const items = await mapPhotoRowsToDisplay(
    flattenJoinPhotos(data),
    getSignedThumbnailUrl,
  );

  items.sort((a, b) => {
    const da = a.eventDate ? new Date(a.eventDate).getTime() : 0;
    const db = b.eventDate ? new Date(b.eventDate).getTime() : 0;
    return db - da;
  });

  return items;
}
