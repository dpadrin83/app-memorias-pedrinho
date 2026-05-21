import { SearchForm } from "./search-form";
import { SearchFiltersPanel } from "./search-filters";
import { SearchResults } from "./search-results";
import { SearchViewTabs } from "./search-view-tabs";
import type { SearchFilters } from "@/lib/search/params";
import type { FilterPerson, FilterTag } from "@/lib/search/queries";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { hasActiveSearch } from "@/lib/search/params";

type SearchScreenProps = {
  filters: SearchFilters;
  photos: PhotoGalleryItem[];
  people: FilterPerson[];
  tags: FilterTag[];
  aiSearchEnabled?: boolean;
};

export function SearchScreen({
  filters,
  photos,
  people,
  tags,
  aiSearchEnabled = false,
}: SearchScreenProps) {
  return (
    <div className="screen-body search-page">
      <SearchForm filters={filters} aiSearchEnabled={aiSearchEnabled} />

      <div className="search-layout">
        <div className="search-main">
          {hasActiveSearch(filters) ? (
            <SearchViewTabs filters={filters} />
          ) : null}
          <SearchResults filters={filters} photos={photos} />
        </div>
        <SearchFiltersPanel filters={filters} people={people} tags={tags} />
      </div>
    </div>
  );
}
