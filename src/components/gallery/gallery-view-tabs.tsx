import Link from "next/link";
import type { PhotoView } from "@/lib/photos/views";

type GalleryViewTabsProps = {
  activeView: PhotoView;
  buildHref: (view: PhotoView) => string;
};

const MODES: { id: PhotoView; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "timeline", label: "Linha do tempo" },
  { id: "calendar", label: "Calendário" },
  { id: "map", label: "Mapa" },
  { id: "list", label: "Lista" },
];

export function GalleryViewTabs({ activeView, buildHref }: GalleryViewTabsProps) {
  return (
    <nav className="tabs" aria-label="Modo de visualização">
      {MODES.map((mode) => {
        const isActive = mode.id === activeView;
        return (
          <Link
            key={mode.id}
            href={buildHref(mode.id)}
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
