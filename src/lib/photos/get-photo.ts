import { createClient } from "@/lib/supabase/server";
import { formatEventDateLabel, toDatetimeLocalValue } from "./format";
import type { PhotoFormValues } from "./schema";
import { getSignedPhotoUrl } from "./urls";

export type PhotoDetail = {
  id: string;
  imageUrl: string;
  storagePath: string;
  formDefaults: PhotoFormValues;
  eventDateLabel: string | null;
  lat: number | null;
  lng: number | null;
  isFavorite: boolean;
};

export async function getPhotoById(id: string): Promise<PhotoDetail | null> {
  const supabase = await createClient();

  const { data: photo, error } = await supabase
    .from("photos")
    .select(
      "id, storage_path, title, description, event_date, location, lat, lng, is_favorite",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !photo) return null;

  const imageUrl = await getSignedPhotoUrl(photo.storage_path);
  if (!imageUrl) return null;

  const { data: peopleRows } = await supabase
    .from("photo_people")
    .select("people ( id, name, relationship )")
    .eq("photo_id", id);

  const { data: tagRows } = await supabase
    .from("photo_tags")
    .select("tags ( id, name )")
    .eq("photo_id", id);

  type PersonRow = { id: string; name: string; relationship: string | null };
  type TagRow = { id: string; name: string };

  const people: PhotoFormValues["people"] = [];
  for (const row of peopleRows ?? []) {
    const p = row.people as PersonRow | PersonRow[] | null;
    const person = Array.isArray(p) ? p[0] : p;
    if (person?.id && person.name) {
      people.push({
        id: person.id,
        name: person.name,
        relationship: person.relationship ?? undefined,
      });
    }
  }

  const tags: string[] = [];
  for (const row of tagRows ?? []) {
    const t = row.tags as TagRow | TagRow[] | null;
    const tag = Array.isArray(t) ? t[0] : t;
    if (tag?.name) tags.push(tag.name);
  }

  const formDefaults: PhotoFormValues = {
    title: photo.title ?? "",
    description: photo.description ?? "",
    eventDate: toDatetimeLocalValue(photo.event_date),
    location: photo.location ?? "",
    people,
    tags,
  };

  return {
    id: photo.id,
    imageUrl,
    storagePath: photo.storage_path,
    formDefaults,
    eventDateLabel: formatEventDateLabel(photo.event_date),
    lat: photo.lat,
    lng: photo.lng,
    isFavorite: photo.is_favorite === true,
  };
}
