"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { fromDatetimeLocalValue } from "./format";
import { generatePhotoEmbeddingSafe } from "@/lib/embeddings/generate";
import { photoFormSchema, type PhotoFormValues } from "./schema";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function resolvePersonIds(
  people: PhotoFormValues["people"],
): Promise<string[]> {
  const supabase = await createClient();
  const ids: string[] = [];

  for (const person of people) {
    if (person.id) {
      ids.push(person.id);
      continue;
    }

    const name = person.name.trim();
    const { data: existing } = await supabase
      .from("people")
      .select("id")
      .ilike("name", name)
      .maybeSingle();

    if (existing?.id) {
      ids.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabase
      .from("people")
      .insert({
        name,
        relationship: person.relationship?.trim() || null,
      })
      .select("id")
      .single();

    if (error || !created) {
      throw new Error(error?.message ?? "Não foi possível criar a pessoa.");
    }
    ids.push(created.id);
  }

  return [...new Set(ids)];
}

async function resolveTagIds(tagNames: string[]): Promise<string[]> {
  const supabase = await createClient();
  const normalized = [
    ...new Set(tagNames.map((t) => t.trim().toLowerCase()).filter(Boolean)),
  ];
  const ids: string[] = [];

  for (const name of normalized) {
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existing?.id) {
      ids.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabase
      .from("tags")
      .insert({ name })
      .select("id")
      .single();

    if (error || !created) {
      throw new Error(error?.message ?? "Não foi possível criar a tag.");
    }
    ids.push(created.id);
  }

  return ids;
}

async function syncPhotoPeople(photoId: string, personIds: string[]) {
  const supabase = await createClient();
  await supabase.from("photo_people").delete().eq("photo_id", photoId);

  if (!personIds.length) return;

  const { error } = await supabase.from("photo_people").insert(
    personIds.map((person_id) => ({ photo_id: photoId, person_id })),
  );

  if (error) throw new Error(error.message);
}

async function syncPhotoTags(photoId: string, tagIds: string[]) {
  const supabase = await createClient();
  await supabase.from("photo_tags").delete().eq("photo_id", photoId);

  if (!tagIds.length) return;

  const { error } = await supabase.from("photo_tags").insert(
    tagIds.map((tag_id) => ({ photo_id: photoId, tag_id })),
  );

  if (error) throw new Error(error.message);
}

export async function updatePhoto(
  photoId: string,
  values: PhotoFormValues,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const parsed = photoFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("photos")
    .update({
      title: data.title.trim() || null,
      description: data.description.trim() || null,
      event_date: fromDatetimeLocalValue(data.eventDate),
      location: data.location.trim() || null,
    })
    .eq("id", photoId)
    .is("deleted_at", null);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  try {
    const personIds = await resolvePersonIds(data.people);
    const tagIds = await resolveTagIds(data.tags);
    await syncPhotoPeople(photoId, personIds);
    await syncPhotoTags(photoId, tagIds);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao salvar relações.";
    return { ok: false, error: message };
  }

  revalidatePath("/");
  revalidatePath(`/photo/${photoId}`);
  revalidatePath("/search");
  void generatePhotoEmbeddingSafe(photoId);
  return { ok: true };
}

export async function searchPeople(query: string) {
  const user = await getCurrentUser();
  if (!user) return [];

  const q = query.trim();
  if (q.length < 1) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("people")
    .select("id, name, relationship")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(8);

  return data ?? [];
}

export async function searchTags(query: string) {
  const user = await getCurrentUser();
  if (!user) return [];

  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("tags")
    .select("id, name")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(8);

  return data ?? [];
}

export async function setPhotoFavorite(
  photoId: string,
  isFavorite: boolean,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("photos")
    .update({ is_favorite: isFavorite })
    .eq("id", photoId)
    .is("deleted_at", null);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/favorites");
  revalidatePath(`/photo/${photoId}`);
  return { ok: true };
}

export async function softDeletePhoto(photoId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("photos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", photoId)
    .is("deleted_at", null);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/trash");
  redirect("/trash");
}
