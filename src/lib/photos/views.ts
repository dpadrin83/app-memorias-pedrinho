export const PHOTO_PAGE_SIZE = 60;

export type PhotoView = "grid" | "timeline" | "map" | "list";

const VIEW_SET = new Set<string>(["grid", "timeline", "map", "list", "lista", "mapa"]);

export function parsePhotoView(value: string | undefined): PhotoView {
  if (value === "mapa") return "map";
  if (value === "lista") return "list";
  if (value && VIEW_SET.has(value)) {
    return value as PhotoView;
  }
  return "grid";
}

export function photoViewToParam(view: PhotoView): string {
  return view;
}

export function photoViewLabel(view: PhotoView): string {
  switch (view) {
    case "timeline":
      return "Linha do tempo";
    case "map":
      return "Mapa";
    case "list":
      return "Lista";
    default:
      return "Grid";
  }
}
