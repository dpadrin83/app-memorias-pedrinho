export const PHOTO_PAGE_SIZE = 60;

export type PhotoView = "grid" | "timeline" | "calendar" | "map" | "list";

const VIEW_SET = new Set<string>([
  "grid",
  "timeline",
  "calendar",
  "calendario",
  "map",
  "mapa",
  "list",
  "lista",
]);

export function parsePhotoView(value: string | undefined): PhotoView {
  if (value === "mapa") return "map";
  if (value === "lista") return "list";
  if (value === "calendario") return "calendar";
  if (value && VIEW_SET.has(value)) {
    return value as PhotoView;
  }
  return "grid";
}

export function photoViewToParam(view: PhotoView): string {
  if (view === "calendar") return "calendario";
  return view;
}

export function photoViewLabel(view: PhotoView): string {
  switch (view) {
    case "timeline":
      return "Linha do tempo";
    case "calendar":
      return "Calendário";
    case "map":
      return "Mapa";
    case "list":
      return "Lista";
    default:
      return "Grid";
  }
}
