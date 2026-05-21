import { formatMonthYear, formatPhotoCount } from "./format";
import type { PhotoGalleryItem } from "./queries";

export type TimelineMonthGroup = {
  key: string;
  label: string;
  subtitle: string;
  photos: PhotoGalleryItem[];
};

function monthKeyFromIso(iso: string): string {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function groupPhotosByMonth(
  photos: PhotoGalleryItem[],
): TimelineMonthGroup[] {
  const buckets = new Map<string, PhotoGalleryItem[]>();

  for (const photo of photos) {
    const key = photo.eventDate ? monthKeyFromIso(photo.eventDate) : "undated";
    const list = buckets.get(key) ?? [];
    list.push(photo);
    buckets.set(key, list);
  }

  const groups: TimelineMonthGroup[] = [];

  for (const [key, items] of buckets) {
    if (key === "undated") {
      groups.push({
        key,
        label: "Sem data definida",
        subtitle: formatPhotoCount(items.length),
        photos: items,
      });
      continue;
    }

    const label = formatMonthYear(items[0].eventDate!);
    groups.push({
      key,
      label,
      subtitle: formatPhotoCount(items.length),
      photos: items,
    });
  }

  return groups.sort((a, b) => {
    if (a.key === "undated") return 1;
    if (b.key === "undated") return -1;
    return b.key.localeCompare(a.key);
  });
}
