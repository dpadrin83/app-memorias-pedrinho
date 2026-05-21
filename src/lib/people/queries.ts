import { createClient } from "@/lib/supabase/server";
import { getSignedThumbnailUrl } from "@/lib/photos/urls";
import {
  flattenJoinPhotos,
  mapPhotoRowsToDisplay,
  PHOTO_INNER_SELECT,
} from "@/lib/photos/map-display-row";
import type { PhotoDisplayItem } from "@/lib/photos/types";

export type { PhotoDisplayItem as PhotoGalleryItem } from "@/lib/photos/types";
import { personInitials } from "./format";

export type PersonListItem = {
  id: string;
  name: string;
  relationship: string | null;
  photoCount: number;
  initials: string;
};

export type PersonDetail = {
  id: string;
  name: string;
  relationship: string | null;
  initials: string;
};

export async function getPeopleList(): Promise<PersonListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select("id, name, relationship, photo_people(count)")
    .order("name");

  if (error || !data?.length) return [];

  return data.map((row) => {
    const countRow = row.photo_people as { count: number }[] | null;
    return {
      id: row.id,
      name: row.name,
      relationship: row.relationship,
      photoCount: countRow?.[0]?.count ?? 0,
      initials: personInitials(row.name),
    };
  });
}

export async function getPersonById(id: string): Promise<PersonDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select("id, name, relationship")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    relationship: data.relationship,
    initials: personInitials(data.name),
  };
}

export async function getPhotosForPerson(
  personId: string,
  limit = 500,
): Promise<PhotoDisplayItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photo_people")
    .select(`photos!inner(${PHOTO_INNER_SELECT})`)
    .eq("person_id", personId)
    .is("photos.deleted_at", null)
    .order("event_date", {
      ascending: false,
      referencedTable: "photos",
    })
    .limit(limit);

  if (error || !data?.length) return [];

  const items = await mapPhotoRowsToDisplay(
    flattenJoinPhotos(data),
    getSignedThumbnailUrl,
  );

  items.sort((a, b) => {
    const da = a.eventDate ? new Date(a.eventDate).getTime() : 0;
    const db = b.eventDate ? new Date(b.eventDate).getTime() : 0;
    return db - da;
  });

  return items;
}
