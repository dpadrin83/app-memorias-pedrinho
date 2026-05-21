import type { SupabaseClient } from "@supabase/supabase-js";
import { PHOTOS_BUCKET } from "@/lib/photos/constants";

type PhotoPaths = {
  id: string;
  storage_path: string;
  thumbnail_path: string;
};

export async function permanentlyDeletePhotoRecord(
  supabase: SupabaseClient,
  photo: PhotoPaths,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const paths = [...new Set([photo.storage_path, photo.thumbnail_path].filter(Boolean))];

  if (paths.length) {
    const { error: storageError } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .remove(paths);

    if (storageError) {
      return { ok: false, error: storageError.message };
    }
  }

  const { error: dbError } = await supabase.from("photos").delete().eq("id", photo.id);

  if (dbError) {
    return { ok: false, error: dbError.message };
  }

  return { ok: true };
}
