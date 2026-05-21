import Link from "next/link";
import {
  buildSearchHref,
  type SearchFilters,
} from "@/lib/search/params";
import type { PhotoView } from "@/lib/photos/views";

type SearchViewTabsProps = {
  filters: SearchFilters;
};

const MODES: { id: PhotoView; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "timeline", label: "Linha do tempo" },
];

export function SearchViewTabs({ filters }: SearchViewTabsProps) {
  return (
    <nav className="tabs" aria-label="Modo de visualização dos resultados">
      {MODES.map((mode) => {
        const isActive = filters.view === mode.id;
        const href = buildSearchHref(filters, { view: mode.id, loaded: 60 });
        return (
          <Link
            key={mode.id}
            href={href}
            className={`tab${isActive ? " active" : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            {mode.label}
          </Link>
        );
      })}
    </nav>
  );
}
