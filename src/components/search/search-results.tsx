import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { PhotoTimeline } from "@/components/photos/photo-timeline";
import {
  buildSearchHref,
  hasActiveSearch,
  hasSemanticSearch,
  type SearchFilters,
} from "@/lib/search/params";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { PHOTO_PAGE_SIZE } from "@/lib/photos/views";

type SearchResultsProps = {
  filters: SearchFilters;
  photos: PhotoGalleryItem[];
};

export function SearchResults({
  filters,
  photos,
}: SearchResultsProps) {
  if (!hasActiveSearch(filters)) {
    return (
      <EmptyPlaceholder
        title="Digite para buscar"
        description="Use o campo acima para buscar em título, história, local, pessoas e tags. Ative o chip IA para busca em linguagem natural."
        icon={<ImageIcon size={36} strokeWidth={1.5} />}
      />
    );
  }

  if (photos.length === 0) {
    return (
      <EmptyPlaceholder
        title="Nenhum resultado"
        description="Tente outros termos ou remova alguns filtros."
        icon={<ImageIcon size={36} strokeWidth={1.5} />}
      />
    );
  }

  const semantic = hasSemanticSearch(filters);
  const hasMore = !semantic && photos.length >= filters.loaded;
  const nextHref = buildSearchHref(filters, {
    loaded: filters.loaded + PHOTO_PAGE_SIZE,
  });

  return (
    <>
      <p className="search-results-meta">
        {photos.length} resultado{photos.length === 1 ? "" : "s"}
        {semantic ? " · busca por IA" : null}
        {filters.q.trim() ? (
          <>
            {" "}
            para <strong>&ldquo;{filters.q.trim()}&rdquo;</strong>
          </>
        ) : null}
      </p>

      {filters.view === "timeline" ? (
        <PhotoTimeline photos={photos} />
      ) : (
        <PhotoGrid photos={photos} />
      )}

      {hasMore ? (
        <div className="gallery-load-more">
          <Link href={nextHref} className="btn btn-outline">
            Carregar mais resultados
          </Link>
        </div>
      ) : null}
    </>
  );
}
