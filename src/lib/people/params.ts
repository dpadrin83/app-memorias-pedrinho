import { parsePhotoView, type PhotoView } from "@/lib/photos/views";

export type PersonViewParams = {
  view: PhotoView;
  loaded: number;
};

export function parsePersonViewParams(
  params: Record<string, string | string[] | undefined>,
): PersonViewParams {
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

export function buildPersonHref(
  personId: string,
  patch: Partial<PersonViewParams> = {},
  base?: PersonViewParams,
): string {
  const view = patch.view ?? base?.view ?? "grid";
  const loaded = patch.loaded ?? base?.loaded ?? 60;
  const search = new URLSearchParams();
  if (view !== "grid") search.set("view", view);
  if (loaded > 60) search.set("loaded", String(loaded));
  const qs = search.toString();
  return qs ? `/people/${personId}?${qs}` : `/people/${personId}`;
}
