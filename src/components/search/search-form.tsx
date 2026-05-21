"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import {
  buildSearchHref,
  type SearchFilters,
} from "@/lib/search/params";

type SearchFormProps = {
  filters: SearchFilters;
  aiSearchEnabled?: boolean;
};

export function SearchForm({ filters, aiSearchEnabled = false }: SearchFormProps) {
  const router = useRouter();
  const [q, setQ] = useState(filters.q);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    router.push(buildSearchHref(filters, { q, loaded: 60 }));
  };

  const toggleAi = () => {
    router.push(
      buildSearchHref(filters, { ai: !filters.ai, q, loaded: 60 }),
    );
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <Search
        className="lead"
        size={20}
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        type="search"
        name="q"
        placeholder={
          filters.ai
            ? "Descreva em linguagem natural (ex.: fotos na praia)"
            : "Buscar em todas as fotos"
        }
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <button
        type="button"
        className={`ia-chip${filters.ai && aiSearchEnabled ? " ia-chip-active" : ""}${!aiSearchEnabled ? " ia-chip-disabled" : ""}`}
        onClick={aiSearchEnabled ? toggleAi : undefined}
        disabled={!aiSearchEnabled}
        aria-pressed={filters.ai && aiSearchEnabled}
        title={
          aiSearchEnabled
            ? filters.ai
              ? "Busca por IA ativa — clique para busca textual"
              : "Ativar busca semântica por IA"
            : "Busca por IA — configure OPENAI_API_KEY para ativar"
        }
      >
        <Sparkles size={14} strokeWidth={2} />
        IA
      </button>
    </form>
  );
}
