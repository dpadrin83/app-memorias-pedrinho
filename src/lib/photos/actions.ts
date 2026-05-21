"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { PHOTOS_BUCKET } from "./constants";
import { extractPhotoMetadata } from "./exif";
import { generatePhotoEmbeddingSafe } from "@/lib/embeddings/generate";
import { storageExtension, validatePhotoFile } from "./validate";

export type UploadPhotoResult =
  | { ok: true; photoId: string }
  | { ok: false; error: string };

export async function uploadPhoto(
  formData: FormData,
): Promise<UploadPhotoResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Sessão inválida. Faça login novamente." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nenhum arquivo enviado." };
  }

  const validationError = validatePhotoFile(file);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const photoId = crypto.randomUUID();
  const ext = storageExtension(file);
  const storagePath = `${user.id}/${photoId}/original.${ext}`;

  const buffer = await file.arrayBuffer();
  const { eventDate, lat, lng } = await extractPhotoMetadata(buffer);

  const supabase = await createClient();

  const { error: storageError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });

  if (storageError) {
    return {
      ok: false,
      error: storageError.message || "Falha ao enviar para o storage.",
    };
  }

  const { error: dbError } = await supabase.from("photos").insert({
    id: photoId,
    storage_path: storagePath,
    thumbnail_path: storagePath,
    event_date: eventDate,
    lat,
    lng,
    uploaded_by: user.id,
  });

  if (dbError) {
    await supabase.storage.from(PHOTOS_BUCKET).remove([storagePath]);
    return {
      ok: false,
      error: dbError.message || "Falha ao salvar o registro da foto.",
    };
  }

  revalidatePath("/");
  void generatePhotoEmbeddingSafe(photoId);
  return { ok: true, photoId };
}
