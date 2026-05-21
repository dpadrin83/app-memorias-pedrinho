import { photoViewToParam, type PhotoView } from "@/lib/photos/views";

export function buildGalleryHref(
  basePath: string,
  view: PhotoView,
  options?: { loaded?: number },
): string {
  const params = new URLSearchParams();
  if (view !== "grid") {
    params.set("view", photoViewToParam(view));
  }
  if (options?.loaded && options.loaded > 60) {
    params.set("loaded", String(options.loaded));
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
