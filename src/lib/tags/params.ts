import { parsePhotoView, type PhotoView } from "@/lib/photos/views";

export type TagViewParams = {
  view: PhotoView;
  loaded: number;
};

export function parseTagViewParams(
  params: Record<string, string | string[] | undefined>,
): TagViewParams {
  return {
    view: parsePhotoView(
      typeof params.view === "string" ? params.view : undefined,
    ),
    loaded: Math.max(
      60,
      Number(typeof params.loaded === "string" ? params.loaded : 60) || 60,
    ),
  };
}

export function buildTagHref(
  tagId: string,
  patch: Partial<TagViewParams> = {},
  base?: TagViewParams,
): string {
  const view = patch.view ?? base?.view ?? "grid";
  const loaded = patch.loaded ?? base?.loaded ?? 60;
  const search = new URLSearchParams();
  if (view !== "grid") search.set("view", view);
  if (loaded > 60) search.set("loaded", String(loaded));
  const qs = search.toString();
  return qs ? `/tags/${tagId}?${qs}` : `/tags/${tagId}`;
}
