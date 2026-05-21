import { formatPhotoCount } from "@/lib/photos/format";
import { personInitials } from "@/lib/photos/format";

export function formatPeopleSubtitle(count: number) {
  const label = count === 1 ? "pessoa marcada" : "pessoas marcadas";
  return `${count} ${label} em suas fotos`;
}

export function formatPersonPhotoSubtitle(
  count: number,
  relationship: string | null,
) {
  const base = formatPhotoCount(count);
  return relationship?.trim() ? `${base} · ${relationship.trim()}` : base;
}

export { personInitials };
