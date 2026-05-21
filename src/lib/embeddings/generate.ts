import { createClient } from "@/lib/supabase/server";
import { buildPhotoEmbeddingText } from "./build-text";
import { embedText } from "./openai";

type PersonRef = { name: string } | { name: string }[] | null;
type TagRef = { name: string } | { name: string }[] | null;

function namesFromJoin(
  rows: { people?: PersonRef }[] | { tags?: TagRef }[] | null | undefined,
  key: "people" | "tags",
): string[] {
  if (!rows?.length) return [];
  const names: string[] = [];
  for (const row of rows) {
    const ref =
      key === "people"
        ? (row as { people?: PersonRef }).people
        : (row as { tags?: TagRef }).tags;
    const entity = Array.isArray(ref) ? ref[0] : ref;
    if (entity && "name" in entity && entity.name) {
      names.push(entity.name);
    }
  }
  return names;
}

export async function generatePhotoEmbedding(
  photoId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select(
      `
      id,
      title,
      description,
      location,
      deleted_at,
      photo_people(people(name)),
      photo_tags(tags(name))
    `,
    )
    .eq("id", photoId)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: fetchError.message };
  }
  if (!photo || photo.deleted_at) {
    return { ok: false, error: "Foto não encontrada." };
  }

  const text = buildPhotoEmbeddingText({
    title: photo.title,
    description: photo.description,
    location: photo.location,
    people: namesFromJoin(photo.photo_people, "people"),
    tags: namesFromJoin(photo.photo_tags, "tags"),
  });

  try {
    const embedding = await embedText(text);
    const { error: updateError } = await supabase
      .from("photos")
      .update({ embedding })
      .eq("id", photoId);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao gerar embedding.";
    return { ok: false, error: message };
  }
}

export function isEmbeddingEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generatePhotoEmbeddingSafe(photoId: string): Promise<void> {
  if (!isEmbeddingEnabled()) return;

  const result = await generatePhotoEmbedding(photoId);
  if (!result.ok) {
    console.error(`[embedding] photo ${photoId}: ${result.error}`);
  }
}
