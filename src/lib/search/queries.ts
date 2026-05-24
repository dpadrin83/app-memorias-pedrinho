import { createClient } from "@/lib/supabase/server";
import { embedText } from "@/lib/embeddings/openai";
import { getSignedThumbnailUrl } from "@/lib/photos/urls";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { hasSemanticSearch, type SearchFilters } from "./params";

const SEMANTIC_SEARCH_LIMIT = 30;

export type FilterPerson = { id: string; name: string };
export type FilterTag = { id: string; name: string };

export async function getSearchFilterOptions(): Promise<{
  people: FilterPerson[];
  tags: FilterTag[];
}> {
  const supabase = await createClient();

  const [{ data: people }, { data: tags }] = await Promise.all([
    supabase.from("people").select("id, name").order("name"),
    supabase.from("tags").select("id, name").order("name"),
  ]);

  return {
    people: people ?? [],
    tags: tags ?? [],
  };
}

export async function searchPhotosSemantic(
  filters: SearchFilters,
): Promise<PhotoGalleryItem[]> {
  if (!hasSemanticSearch(filters)) return [];

  const supabase = await createClient();
  const fromIso = filters.from
    ? new Date(`${filters.from}T00:00:00`).toISOString()
    : null;
  const toIso = filters.to
    ? new Date(`${filters.to}T23:59:59.999`).toISOString()
    : null;

  let queryEmbedding: number[];
  try {
    queryEmbedding = await embedText(filters.q.trim());
  } catch {
    return [];
  }

  const { data, error } = await supabase.rpc("search_photos_semantic", {
    p_embedding: queryEmbedding,
    p_from: fromIso,
    p_to: toIso,
    p_people: filters.peopleIds,
    p_tags: filters.tagIds,
    p_limit: SEMANTIC_SEARCH_LIMIT,
  });

  if (error || !data?.length) return [];

  const items: PhotoGalleryItem[] = [];

  for (const row of data) {
    const thumbnailUrl = await getSignedThumbnailUrl(row.thumbnail_path);
    if (!thumbnailUrl) continue;
    items.push({
      id: row.id,
      title: row.title,
      thumbnailUrl,
      eventDate: row.event_date,
      location: null,
      lat: null,
      lng: null,
      people: [],
      tags: [],
      isFavorite: false,
    });
  }

  return items;
}

export async function searchPhotos(
  filters: SearchFilters,
): Promise<PhotoGalleryItem[]> {
  const supabase = await createClient();

  const fromIso = filters.from
    ? new Date(`${filters.from}T00:00:00`).toISOString()
    : null;
  const toIso = filters.to
    ? new Date(`${filters.to}T23:59:59.999`).toISOString()
    : null;

  const { data, error } = await supabase.rpc("search_photos", {
    p_query: filters.q.trim() || null,
    p_from: fromIso,
    p_to: toIso,
    p_people: filters.peopleIds,
    p_tags: filters.tagIds,
    p_limit: filters.loaded,
  });

  if (error || !data?.length) return [];

  const items: PhotoGalleryItem[] = [];

  for (const row of data) {
    const thumbnailUrl = await getSignedThumbnailUrl(row.thumbnail_path);
    if (!thumbnailUrl) continue;
    items.push({
      id: row.id,
      title: row.title,
      thumbnailUrl,
      eventDate: row.event_date,
      location: row.location ?? null,
      lat: row.lat ?? null,
      lng: row.lng ?? null,
      people: [],
      tags: [],
      isFavorite: false,
    });
  }

  return items;
}
