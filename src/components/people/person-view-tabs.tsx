import { GalleryViewTabs } from "@/components/gallery/gallery-view-tabs";
import { buildPersonHref, type PersonViewParams } from "@/lib/people/params";
import type { PhotoView } from "@/lib/photos/views";

type PersonViewTabsProps = {
  personId: string;
  viewParams: PersonViewParams;
};

export function PersonViewTabs({ personId, viewParams }: PersonViewTabsProps) {
  return (
    <GalleryViewTabs
      activeView={viewParams.view}
      buildHref={(view: PhotoView) =>
        buildPersonHref(personId, { view, loaded: 60 }, viewParams)
      }
    />
  );
}
