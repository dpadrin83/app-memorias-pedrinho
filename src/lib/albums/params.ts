import { parsePhotoView, type PhotoView } from "@/lib/photos/views";

export type AlbumViewParams = {
  view: PhotoView;
  loaded: number;
};

export function parseAlbumViewParams(
  params: Record<string, string | string[] | undefined>,
): AlbumViewParams {
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

export function buildAlbumHref(
  albumId: string,
  patch: Partial<AlbumViewParams> = {},
  base?: AlbumViewParams,
): string {
  const view = patch.view ?? base?.view ?? "grid";
  const loaded = patch.loaded ?? base?.loaded ?? 60;
  const search = new URLSearchParams();
  if (view !== "grid") search.set("view", view);
  if (loaded > 60) search.set("loaded", String(loaded));
  const qs = search.toString();
  return qs ? `/albums/${albumId}?${qs}` : `/albums/${albumId}`;
}
