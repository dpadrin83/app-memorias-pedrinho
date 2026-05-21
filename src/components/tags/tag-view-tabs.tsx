import { GalleryViewTabs } from "@/components/gallery/gallery-view-tabs";
import { buildTagHref, type TagViewParams } from "@/lib/tags/params";
import type { PhotoView } from "@/lib/photos/views";

type TagViewTabsProps = {
  tagId: string;
  viewParams: TagViewParams;
};

export function TagViewTabs({ tagId, viewParams }: TagViewTabsProps) {
  return (
    <GalleryViewTabs
      activeView={viewParams.view}
      buildHref={(view: PhotoView) =>
        buildTagHref(tagId, { view, loaded: 60 }, viewParams)
      }
    />
  );
}
