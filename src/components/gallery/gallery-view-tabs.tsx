import Link from "next/link";
import type { PhotoView } from "@/lib/photos/views";

type GalleryViewTabsProps = {
  activeView: PhotoView;
  buildHref: (view: PhotoView) => string;
};

const MODES: { id: PhotoView | "calendario"; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "timeline", label: "Linha do tempo" },
  { id: "calendario", label: "Calendário" },
  { id: "map", label: "Mapa" },
  { id: "list", label: "Lista" },
];

export function GalleryViewTabs({ activeView, buildHref }: GalleryViewTabsProps) {
  return (
    <nav className="tabs" aria-label="Modo de visualização">
      {MODES.map((mode) => {
        const isActive = mode.id === activeView;

        if (mode.id === "calendario") {
          return (
            <span
              key={mode.label}
              className="tab tab-disabled"
              aria-disabled="true"
              title="Em breve"
            >
              {mode.label}
            </span>
          );
        }

        return (
          <Link
            key={mode.label}
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
