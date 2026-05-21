import Link from "next/link";
import type { PhotoView } from "@/lib/photos/views";
import { buildTrashHref, type TrashViewParams } from "@/lib/trash/params";

type TrashViewTabsProps = {
  params: TrashViewParams;
};

const MODES: { id: PhotoView; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "timeline", label: "Linha do tempo" },
  { id: "list", label: "Lista" },
];

export function TrashViewTabs({ params }: TrashViewTabsProps) {
  return (
    <nav className="tabs" aria-label="Modo de visualização da lixeira">
      {MODES.map((mode) => {
        const isActive = params.view === mode.id;
        return (
          <Link
            key={mode.id}
            href={buildTrashHref(params, { view: mode.id })}
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
