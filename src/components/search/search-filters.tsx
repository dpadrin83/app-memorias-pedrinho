"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Filter, X } from "lucide-react";
import {
  buildSearchHref,
  type SearchFilters,
} from "@/lib/search/params";
import type { FilterPerson, FilterTag } from "@/lib/search/queries";

type SearchFiltersPanelProps = {
  filters: SearchFilters;
  people: FilterPerson[];
  tags: FilterTag[];
};

export function SearchFiltersPanel({
  filters,
  people,
  tags,
}: SearchFiltersPanelProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const push = (patch: Partial<SearchFilters>) => {
    router.push(buildSearchHref(filters, { ...patch, loaded: 60 }));
    setMobileOpen(false);
  };

  const togglePerson = (id: string) => {
    const next = filters.peopleIds.includes(id)
      ? filters.peopleIds.filter((p) => p !== id)
      : [...filters.peopleIds, id];
    push({ peopleIds: next });
  };

  const toggleTag = (id: string) => {
    const next = filters.tagIds.includes(id)
      ? filters.tagIds.filter((t) => t !== id)
      : [...filters.tagIds, id];
    push({ tagIds: next });
  };

  const clearAll = () => {
    router.push("/search");
    setMobileOpen(false);
  };

  const panel = (
    <div className="search-filters-panel">
      <div className="search-filters-head">
        <h2 className="search-filters-title">Filtros</h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
          Limpar
        </button>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="filter-from">
          Período — de
        </label>
        <input
          id="filter-from"
          type="date"
          value={filters.from}
          onChange={(e) => push({ from: e.target.value })}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="filter-to">
          Período — até
        </label>
        <input
          id="filter-to"
          type="date"
          value={filters.to}
          onChange={(e) => push({ to: e.target.value })}
        />
      </div>

      <div className="search-filters-block">
        <p className="search-filters-label">Pessoas</p>
        <div className="filters-row">
          {people.length === 0 ? (
            <p className="search-filters-empty">Nenhuma pessoa cadastrada</p>
          ) : (
            people.map((person) => (
              <button
                key={person.id}
                type="button"
                className={`chip${filters.peopleIds.includes(person.id) ? " active" : ""}`}
                onClick={() => togglePerson(person.id)}
              >
                {person.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="search-filters-block">
        <p className="search-filters-label">Tags</p>
        <div className="filters-row">
          {tags.length === 0 ? (
            <p className="search-filters-empty">Nenhuma tag cadastrada</p>
          ) : (
            tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={`chip${filters.tagIds.includes(tag.id) ? " active" : ""}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm search-filters-mobile-toggle"
        onClick={() => setMobileOpen(true)}
      >
        <Filter size={14} strokeWidth={1.75} />
        Filtros
      </button>

      <aside className="search-filters-aside">{panel}</aside>

      {mobileOpen ? (
        <div
          className="search-filters-drawer-overlay"
          role="presentation"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="search-filters-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros de busca"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="icon-btn sm search-filters-drawer-close"
              aria-label="Fechar filtros"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} strokeWidth={1.75} />
            </button>
            {panel}
          </div>
        </div>
      ) : null}
    </>
  );
}
