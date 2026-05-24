import { GalleryViewTabs } from "@/components/gallery/gallery-view-tabs";
import { buildGalleryHref } from "@/lib/gallery/build-href";
import type { PhotoView } from "@/lib/photos/views";

type ViewTabsProps = {
  activeView: PhotoView;
  basePath?: string;
};

export function ViewTabs({ activeView, basePath = "/" }: ViewTabsProps) {
  return (
    <GalleryViewTabs
      activeView={activeView}
      buildHref={(view) => buildGalleryHref(basePath, view)}
    />
  );
}
