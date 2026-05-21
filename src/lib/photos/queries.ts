import { createClient } from "@/lib/supabase/server";
import {
  mapPhotoRowsToDisplay,
  PHOTO_DISPLAY_SELECT,
} from "./map-display-row";
import type { PhotoDisplayItem } from "./types";
import { getSignedThumbnailUrl } from "./urls";

export type { PhotoDisplayItem, PhotoGalleryItem } from "./types";

export async function getActivePhotosCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  if (error) return 0;
  return count ?? 0;
}

export async function getActivePhotosForGallery(
  limit = 60,
): Promise<PhotoDisplayItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select(PHOTO_DISPLAY_SELECT)
    .is("deleted_at", null)
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) return [];

  return mapPhotoRowsToDisplay(data, getSignedThumbnailUrl);
}

/** @deprecated Use getActivePhotosForGallery */
export async function getActivePhotosForGrid(limit = 60) {
  return getActivePhotosForGallery(limit);
}
