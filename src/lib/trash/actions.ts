"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { permanentlyDeletePhotoRecord } from "./purge-photo";

export type TrashActionResult = { ok: true } | { ok: false; error: string };

export type BulkTrashResult =
  | { ok: true; count: number }
  | { ok: false; error: string };

function revalidateTrash() {
  revalidatePath("/trash");
  revalidatePath("/");
  revalidatePath("/albums");
}

export async function restorePhoto(photoId: string): Promise<TrashActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("photos")
    .update({ deleted_at: null })
    .eq("id", photoId)
    .not("deleted_at", "is", null);

  if (error) return { ok: false, error: error.message };

  revalidateTrash();
  return { ok: true };
}

export async function permanentlyDeletePhoto(
  photoId: string,
): Promise<TrashActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("id, storage_path, thumbnail_path")
    .eq("id", photoId)
    .not("deleted_at", "is", null)
    .maybeSingle();

  if (fetchError) return { ok: false, error: fetchError.message };
  if (!photo) return { ok: false, error: "Foto não encontrada na lixeira." };

  const result = await permanentlyDeletePhotoRecord(supabase, photo);
  if (!result.ok) return result;

  revalidateTrash();
  return { ok: true };
}

export async function emptyTrashPhotos(): Promise<BulkTrashResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("id, storage_path, thumbnail_path")
    .not("deleted_at", "is", null);

  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: true, count: 0 };

  let count = 0;
  for (const photo of data) {
    const result = await permanentlyDeletePhotoRecord(supabase, photo);
    if (result.ok) count += 1;
  }

  revalidateTrash();
  return { ok: true, count };
}

export async function restoreAlbum(albumId: string): Promise<TrashActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("albums")
    .update({ deleted_at: null })
    .eq("id", albumId)
    .not("deleted_at", "is", null);

  if (error) return { ok: false, error: error.message };

  revalidateTrash();
  revalidatePath("/albums");
  return { ok: true };
}

export async function permanentlyDeleteAlbum(
  albumId: string,
): Promise<TrashActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", albumId)
    .not("deleted_at", "is", null);

  if (error) return { ok: false, error: error.message };

  revalidateTrash();
  revalidatePath("/albums");
  return { ok: true };
}

export async function emptyTrashAlbums(): Promise<BulkTrashResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select("id")
    .not("deleted_at", "is", null);

  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: true, count: 0 };

  const ids = data.map((r) => r.id);
  const { error: deleteError } = await supabase.from("albums").delete().in("id", ids);

  if (deleteError) return { ok: false, error: deleteError.message };

  revalidateTrash();
  revalidatePath("/albums");
  return { ok: true, count: ids.length };
}
