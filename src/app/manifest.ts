import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portal de Memórias",
    short_name: "Memórias",
    description: "Memórias da família, organizadas com calma.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2eb",
    theme_color: "#1a73e8",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
