import { Star } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { ViewTabs } from "@/components/layout/view-tabs";
import { categoryIcons } from "@/components/layout/category-icons";
import { PhotoGalleryView } from "@/components/gallery/photo-gallery-view";
import { buildGalleryHref } from "@/lib/gallery/build-href";
import {
  getFavoritePhotosCount,
  getFavoritePhotosForGallery,
} from "@/lib/photos/queries";
import { PHOTO_PAGE_SIZE, parsePhotoView } from "@/lib/photos/views";

export const dynamic = "force-dynamic";

type FavoritesPageProps = {
  searchParams?: Promise<{ view?: string; loaded?: string }>;
};

function formatCount(count: number) {
  const label = count === 1 ? "item" : "itens";
  return `${count} ${label} · Memórias marcadas com estrela`;
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const params = searchParams ? await searchParams : {};
  const view = parsePhotoView(params.view);
  const loaded = Math.max(
    PHOTO_PAGE_SIZE,
    Number(params.loaded) || PHOTO_PAGE_SIZE,
  );

  let count = 0;
  let photos: Awaited<ReturnType<typeof getFavoritePhotosForGallery>> = [];

  try {
    [count, photos] = await Promise.all([
      getFavoritePhotosCount(),
      getFavoritePhotosForGallery(loaded),
    ]);
  } catch (error) {
    console.error("[favorites/page]", error);
  }

  return (
    <>
      <CatHeader
        variant="favoritos"
        icon={categoryIcons.favoritos}
        title="Favoritos"
        subtitle={formatCount(count)}
      />
      <div className="screen-body">
        <ViewTabs activeView={view} basePath="/favorites" />
        <PhotoGalleryView
          view={view}
          photos={photos}
          totalCount={count}
          loadedCount={loaded}
          loadMoreHref={buildGalleryHref("/favorites", view, {
            loaded: loaded + PHOTO_PAGE_SIZE,
          })}
          emptyTitle="Nenhum favorito ainda"
          emptyDescription="Abra uma foto e toque na estrela para marcá-la — ela aparece aqui com os mesmos modos de visualização."
          emptyIcon={<Star size={36} strokeWidth={1.5} />}
        />
      </div>
    </>
  );
}
