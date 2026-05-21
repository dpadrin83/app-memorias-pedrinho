"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export type ActionResult =
  | { ok: true; albumId?: string }
  | { ok: false; error: string };

export async function createAlbum(input: {
  title: string;
  description?: string;
  coverPhotoId?: string | null;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Título obrigatório." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .insert({
      title,
      description: input.description?.trim() || null,
      cover_photo_id: input.coverPhotoId ?? null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Erro ao criar álbum." };
  }

  revalidatePath("/albums");
  return { ok: true, albumId: data.id };
}

export async function updateAlbum(input: {
  id: string;
  title: string;
  description?: string;
  coverPhotoId?: string | null;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Título obrigatório." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("albums")
    .update({
      title,
      description: input.description?.trim() || null,
      cover_photo_id: input.coverPhotoId ?? null,
    })
    .eq("id", input.id)
    .is("deleted_at", null);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/albums");
  revalidatePath(`/albums/${input.id}`);
  return { ok: true, albumId: input.id };
}

export async function softDeleteAlbum(albumId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("albums")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", albumId)
    .is("deleted_at", null);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/albums");
  revalidatePath("/trash");
  redirect("/trash?section=albums");
}

export async function addPhotosToAlbum(
  albumId: string,
  photoIds: string[],
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };
  if (!photoIds.length) return { ok: false, error: "Selecione ao menos uma foto." };

  const supabase = await createClient();

  const { data: maxRow } = await supabase
    .from("album_photos")
    .select("position")
    .eq("album_id", albumId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  let position = (maxRow?.position ?? -1) + 1;
  const rows = photoIds.map((photo_id) => ({
    album_id: albumId,
    photo_id,
    position: position++,
  }));

  const { error } = await supabase.from("album_photos").upsert(rows, {
    onConflict: "album_id,photo_id",
    ignoreDuplicates: true,
  });

  if (error) return { ok: false, error: error.message };

  const { data: album } = await supabase
    .from("albums")
    .select("cover_photo_id")
    .eq("id", albumId)
    .maybeSingle();

  if (!album?.cover_photo_id && photoIds[0]) {
    await supabase
      .from("albums")
      .update({ cover_photo_id: photoIds[0] })
      .eq("id", albumId);
  }

  revalidatePath(`/albums/${albumId}`);
  revalidatePath("/albums");
  return { ok: true };
}

export async function removePhotoFromAlbum(
  albumId: string,
  photoId: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("album_photos")
    .delete()
    .eq("album_id", albumId)
    .eq("photo_id", photoId);

  if (error) return { ok: false, error: error.message };

  const { data: album } = await supabase
    .from("albums")
    .select("cover_photo_id")
    .eq("id", albumId)
    .maybeSingle();

  if (album?.cover_photo_id === photoId) {
    const { data: next } = await supabase
      .from("album_photos")
      .select("photo_id")
      .eq("album_id", albumId)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    await supabase
      .from("albums")
      .update({ cover_photo_id: next?.photo_id ?? null })
      .eq("id", albumId);
  }

  revalidatePath(`/albums/${albumId}`);
  revalidatePath("/albums");
  return { ok: true };
}

export async function reorderAlbumPhotos(
  albumId: string,
  orderedPhotoIds: string[],
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();

  for (let i = 0; i < orderedPhotoIds.length; i++) {
    const { error } = await supabase
      .from("album_photos")
      .update({ position: i })
      .eq("album_id", albumId)
      .eq("photo_id", orderedPhotoIds[i]);

    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(`/albums/${albumId}`);
  return { ok: true };
}
