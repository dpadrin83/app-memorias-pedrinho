import { GalleryViewTabs } from "@/components/gallery/gallery-view-tabs";
import { buildGalleryHref } from "@/lib/gallery/build-href";
import type { PhotoView } from "@/lib/photos/views";

type ViewTabsProps = {
  activeView: PhotoView;
};

export function ViewTabs({ activeView }: ViewTabsProps) {
  return (
    <GalleryViewTabs
      activeView={activeView}
      buildHref={(view) => buildGalleryHref("/", view)}
    />
  );
}
