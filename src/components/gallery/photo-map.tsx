"use client";

import Link from "next/link";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { PhotoDisplayItem } from "@/lib/photos/types";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

type PhotoMapProps = {
  photos: PhotoDisplayItem[];
  hiddenCount: number;
};

export function PhotoMap({ photos, hiddenCount }: PhotoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const geoPhotos = photos.filter(
    (p) => p.lat != null && p.lng != null && Number.isFinite(p.lat) && Number.isFinite(p.lng),
  );
  const geoKey = geoPhotos.map((p) => `${p.id}:${p.lat},${p.lng}`).join("|");

  const activePhoto = geoPhotos.find((p) => p.id === activeId) ?? null;

  useEffect(() => {
    if (!containerRef.current || geoPhotos.length === 0) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [geoPhotos[0]!.lng!, geoPhotos[0]!.lat!],
      zoom: 10,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    const bounds = new maplibregl.LngLatBounds();

    for (const photo of geoPhotos) {
      const lng = photo.lng!;
      const lat = photo.lat!;
      bounds.extend([lng, lat]);

      const el = document.createElement("button");
      el.type = "button";
      el.className = "map-marker";
      el.setAttribute("aria-label", photo.title ?? "Foto");
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveId(photo.id);
      });

      new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
    }

    if (geoPhotos.length > 1) {
      map.fitBounds(bounds, { padding: 48, maxZoom: 14 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // geoKey tracks marker set without re-init on unrelated renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoKey]);

  if (geoPhotos.length === 0) {
    return (
      <div className="map-empty">
        <p>Nenhuma foto com localização nesta seleção.</p>
        {hiddenCount > 0 ? (
          <p className="map-empty-hint">
            {hiddenCount} {hiddenCount === 1 ? "foto sem" : "fotos sem"} coordenadas GPS.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="photo-map-wrap">
      {hiddenCount > 0 ? (
        <p className="map-geo-hint" role="status">
          {hiddenCount} {hiddenCount === 1 ? "foto sem" : "fotos sem"} localização{" "}
          {hiddenCount === 1 ? "fica" : "ficam"} fora do mapa.
        </p>
      ) : null}
      <div ref={containerRef} className="photo-map-canvas" />
      {activePhoto ? (
        <div className="map-popup" role="dialog" aria-label="Pré-visualização">
          <button
            type="button"
            className="map-popup-close"
            onClick={() => setActiveId(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activePhoto.thumbnailUrl} alt="" className="map-popup-thumb" />
          <div className="map-popup-body">
            <p className="map-popup-title">{activePhoto.title ?? "Sem título"}</p>
            {activePhoto.location ? (
              <p className="map-popup-meta">{activePhoto.location}</p>
            ) : null}
            <Link href={`/photo/${activePhoto.id}`} className="btn btn-primary btn-sm">
              Abrir foto
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
