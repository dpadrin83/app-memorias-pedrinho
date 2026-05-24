import { tryCreateClient } from "@/lib/supabase/server";
import {
  mapPhotoRowsToDisplay,
  PHOTO_DISPLAY_SELECT,
} from "./map-display-row";
import type { PhotoDisplayItem } from "./types";
import { getSignedThumbnailUrl } from "./urls";

export type { PhotoDisplayItem, PhotoGalleryItem } from "./types";

export async function getActivePhotosCount(): Promise<number> {
  const supabase = await tryCreateClient();
  if (!supabase) return 0;
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
  const supabase = await tryCreateClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("photos")
    .select(PHOTO_DISPLAY_SELECT)
    .is("deleted_at", null)
    .order("event_date", { ascending: false })
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[photos] gallery:", error.message);
    return [];
  }

  if (!data?.length) return [];

  try {
    return await mapPhotoRowsToDisplay(data, getSignedThumbnailUrl);
  } catch (err) {
    console.error("[photos] mapPhotoRowsToDisplay:", err);
    return [];
  }
}

export async function getFavoritePhotosCount(): Promise<number> {
  const supabase = await tryCreateClient();
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null)
    .eq("is_favorite", true);

  if (error) return 0;
  return count ?? 0;
}

export async function getFavoritePhotosForGallery(
  limit = 60,
): Promise<PhotoDisplayItem[]> {
  const supabase = await tryCreateClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("photos")
    .select(PHOTO_DISPLAY_SELECT)
    .is("deleted_at", null)
    .eq("is_favorite", true)
    .order("event_date", { ascending: false })
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[photos] favorites:", error.message);
    return [];
  }

  if (!data?.length) return [];

  try {
    return await mapPhotoRowsToDisplay(data, getSignedThumbnailUrl);
  } catch (err) {
    console.error("[photos] mapPhotoRowsToDisplay (favorites):", err);
    return [];
  }
}

/** @deprecated Use getActivePhotosForGallery */
export async function getActivePhotosForGrid(limit = 60) {
  return getActivePhotosForGallery(limit);
}
