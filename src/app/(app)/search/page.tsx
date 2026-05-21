import { SearchScreen } from "@/components/search/search-screen";
import {
  hasActiveSearch,
  hasSemanticSearch,
  parseSearchParams,
} from "@/lib/search/params";
import {
  getSearchFilterOptions,
  searchPhotos,
  searchPhotosSemantic,
} from "@/lib/search/queries";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const raw = await searchParams;
  const filters = parseSearchParams(raw);
  const aiSearchEnabled = Boolean(process.env.OPENAI_API_KEY?.trim());

  const [{ people, tags }, photos] = await Promise.all([
    getSearchFilterOptions(),
    hasActiveSearch(filters)
      ? hasSemanticSearch(filters) && aiSearchEnabled
        ? searchPhotosSemantic(filters)
        : searchPhotos(filters)
      : Promise.resolve([]),
  ]);

  return (
    <SearchScreen
      filters={filters}
      photos={photos}
      people={people}
      tags={tags}
      aiSearchEnabled={aiSearchEnabled}
    />
  );
}
