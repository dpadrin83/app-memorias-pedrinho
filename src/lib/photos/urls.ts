import { tryCreateClient } from "@/lib/supabase/server";
import { PHOTOS_BUCKET, THUMBNAIL_TRANSFORM } from "./constants";

const SIGNED_URL_TTL = 60 * 60;

export async function getSignedThumbnailUrl(
  storagePath: string,
): Promise<string | null> {
  const supabase = await tryCreateClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL, {
      transform: THUMBNAIL_TRANSFORM,
    });

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function getSignedPhotoUrl(
  storagePath: string,
): Promise<string | null> {
  const supabase = await tryCreateClient();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL, {
      transform: { width: 1600, resize: "contain" },
    });

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
