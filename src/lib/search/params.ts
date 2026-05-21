import { parsePhotoView, type PhotoView } from "@/lib/photos/views";

export type SearchFilters = {
  q: string;
  ai: boolean;
  from: string;
  to: string;
  peopleIds: string[];
  tagIds: string[];
  view: PhotoView;
  loaded: number;
};

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): SearchFilters {
  const q = typeof params.q === "string" ? params.q : "";
  const ai =
    params.ai === "1" ||
    params.ai === "true" ||
    (typeof params.ai === "string" && params.ai.toLowerCase() === "on");
  const from = typeof params.from === "string" ? params.from : "";
  const to = typeof params.to === "string" ? params.to : "";
  const view = parsePhotoView(
    typeof params.view === "string" ? params.view : undefined,
  );
  const loaded = Math.max(
    60,
    Number(typeof params.loaded === "string" ? params.loaded : 60) || 60,
  );

  const peopleIds = parseIdList(params.people);
  const tagIds = parseIdList(params.tags);

  return { q, ai, from, to, peopleIds, tagIds, view, loaded };
}

function parseIdList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(",") : value;
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function hasSemanticSearch(filters: SearchFilters): boolean {
  return filters.ai && Boolean(filters.q.trim());
}

export function hasActiveSearch(filters: SearchFilters): boolean {
  if (hasSemanticSearch(filters)) return true;
  return Boolean(
    filters.q.trim() ||
      filters.from ||
      filters.to ||
      filters.peopleIds.length ||
      filters.tagIds.length,
  );
}

export function buildSearchHref(
  filters: SearchFilters,
  patch: Partial<SearchFilters> = {},
): string {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();

  if (next.q.trim()) params.set("q", next.q.trim());
  if (next.ai) params.set("ai", "1");
  if (next.from) params.set("from", next.from);
  if (next.to) params.set("to", next.to);
  if (next.peopleIds.length) params.set("people", next.peopleIds.join(","));
  if (next.tagIds.length) params.set("tags", next.tagIds.join(","));
  if (next.view !== "grid") params.set("view", next.view);
  if (next.loaded > 60) params.set("loaded", String(next.loaded));

  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}
