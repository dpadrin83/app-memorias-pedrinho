import { GalleryViewTabs } from "@/components/gallery/gallery-view-tabs";
import { buildAlbumHref, type AlbumViewParams } from "@/lib/albums/params";
import type { PhotoView } from "@/lib/photos/views";

type AlbumViewTabsProps = {
  albumId: string;
  viewParams: AlbumViewParams;
};

export function AlbumViewTabs({ albumId, viewParams }: AlbumViewTabsProps) {
  return (
    <GalleryViewTabs
      activeView={viewParams.view}
      buildHref={(view: PhotoView) =>
        buildAlbumHref(albumId, { view, loaded: 60 }, viewParams)
      }
    />
  );
}
