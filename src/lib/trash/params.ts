import { parsePhotoView, type PhotoView } from "@/lib/photos/views";

export type TrashSection = "photos" | "albums";

export type TrashViewParams = {
  section: TrashSection;
  view: PhotoView;
};

const TRASH_VIEWS = new Set(["grid", "timeline", "list"]);

export function parseTrashView(view: string | undefined): PhotoView {
  const parsed = parsePhotoView(view);
  if (TRASH_VIEWS.has(parsed)) return parsed;
  if (parsed === "map") return "grid";
  return "grid";
}

export function parseTrashParams(
  params: Record<string, string | string[] | undefined>,
): TrashViewParams {
  const section =
    params.section === "albums" ? "albums" : "photos";
  const view = parseTrashView(
    typeof params.view === "string" ? params.view : undefined,
  );

  return { section, view };
}

export function buildTrashHref(
  base: TrashViewParams,
  patch: Partial<TrashViewParams> = {},
): string {
  const next = { ...base, ...patch };
  const search = new URLSearchParams();
  if (next.section === "albums") search.set("section", "albums");
  if (next.view !== "grid") search.set("view", next.view);
  const qs = search.toString();
  return qs ? `/trash?${qs}` : "/trash";
}
