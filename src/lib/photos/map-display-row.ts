import type { PhotoDisplayItem } from "./types";

type PersonRef = { name: string } | { name: string }[] | null;
type TagRef = { name: string } | { name: string }[] | null;

type PhotoRowInput = {
  id: string;
  title: string | null;
  thumbnail_path: string;
  event_date: string | null;
  location?: string | null;
  lat?: number | null;
  lng?: number | null;
  is_favorite?: boolean | null;
  photo_people?: { people: PersonRef }[] | null;
  photo_tags?: { tags: TagRef }[] | null;
};

function extractNames(
  rows: { people?: PersonRef }[] | { tags?: TagRef }[] | null | undefined,
  key: "people" | "tags",
): string[] {
  if (!rows?.length) return [];
  const names: string[] = [];
  for (const row of rows) {
    const ref = key === "people" ? (row as { people?: PersonRef }).people : (row as { tags?: TagRef }).tags;
    const entity = Array.isArray(ref) ? ref[0] : ref;
    if (entity && "name" in entity && entity.name) {
      names.push(entity.name);
    }
  }
  return names;
}

export async function mapPhotoRowsToDisplay(
  rows: PhotoRowInput[],
  signUrl: (path: string) => Promise<string | null>,
): Promise<PhotoDisplayItem[]> {
  const items: PhotoDisplayItem[] = [];

  for (const row of rows) {
    const thumbnailUrl = await signUrl(row.thumbnail_path);
    if (!thumbnailUrl) continue;

    items.push({
      id: row.id,
      title: row.title,
      thumbnailUrl,
      eventDate: row.event_date,
      location: row.location ?? null,
      lat: row.lat ?? null,
      lng: row.lng ?? null,
      people: extractNames(row.photo_people ?? undefined, "people"),
      tags: extractNames(row.photo_tags ?? undefined, "tags"),
      isFavorite: row.is_favorite === true,
    });
  }

  return items;
}

export const PHOTO_INNER_SELECT = `
  id,
  title,
  thumbnail_path,
  event_date,
  location,
  lat,
  lng,
  is_favorite,
  photo_people(people(name)),
  photo_tags(tags(name))
`;

export function unwrapJoinPhoto<T extends PhotoRowInput>(
  raw: T | T[] | null | undefined,
): T | null {
  if (!raw) return null;
  return Array.isArray(raw) ? (raw[0] ?? null) : raw;
}

export function flattenJoinPhotos<T extends PhotoRowInput>(
  data: { photos: T | T[] | null }[],
): T[] {
  const rows: T[] = [];
  for (const row of data) {
    const photo = unwrapJoinPhoto(row.photos);
    if (photo?.id) rows.push(photo);
  }
  return rows;
}

export const PHOTO_DISPLAY_SELECT = PHOTO_INNER_SELECT;
