export type NavCategory =
  | "fotos"
  | "albuns"
  | "pessoas"
  | "tags"
  | "favoritos"
  | "neutral";

export type NavItem = {
  href: string;
  label: string;
  category: NavCategory;
  topbarTitle: string;
  /** Classe ld-item quando ativo (ex: active, active-albuns) */
  activeClass: string;
  /** Bolinha colorida — omitir em Fotos (usa ícone SVG) */
  dotColor?: string;
  count?: number;
  /** Rotas utilitárias sem cat-header colorido */
  utility?: boolean;
};

export const MAIN_NAV: NavItem[] = [
  {
    href: "/",
    label: "Fotos",
    category: "fotos",
    topbarTitle: "Fotos",
    activeClass: "active",
  },
  {
    href: "/albums",
    label: "Álbuns",
    category: "albuns",
    topbarTitle: "Álbuns",
    activeClass: "active-albuns",
    dotColor: "var(--yellow)",
  },
  {
    href: "/people",
    label: "Pessoas",
    category: "pessoas",
    topbarTitle: "Pessoas",
    activeClass: "active-pessoas",
    dotColor: "var(--green)",
  },
  {
    href: "/tags",
    label: "Tags",
    category: "tags",
    topbarTitle: "Tags",
    activeClass: "active-tags",
    dotColor: "var(--red)",
  },
  {
    href: "/favorites",
    label: "Favoritos",
    category: "favoritos",
    topbarTitle: "Favoritos",
    activeClass: "active-favoritos",
    dotColor: "var(--purple)",
  },
];

export const UTILITY_NAV: NavItem[] = [
  {
    href: "/search",
    label: "Buscar",
    category: "neutral",
    topbarTitle: "Buscar",
    activeClass: "active-neutral",
    utility: true,
  },
  {
    href: "/trash",
    label: "Lixeira",
    category: "neutral",
    topbarTitle: "Lixeira",
    activeClass: "active-neutral",
    utility: true,
  },
  {
    href: "/settings",
    label: "Configurações",
    category: "neutral",
    topbarTitle: "Configurações",
    activeClass: "active-neutral",
    utility: true,
  },
];

export const VIEW_MODES = [
  "Grid",
  "Linha do tempo",
  "Calendário",
  "Mapa",
  "Lista",
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getTopbarTitle(pathname: string): string {
  if (pathname.startsWith("/photo/")) return "Foto";
  if (pathname.startsWith("/albums/") && pathname !== "/albums") {
    return "Álbum";
  }
  if (pathname.startsWith("/people/") && pathname !== "/people") {
    return "Pessoa";
  }
  if (pathname.startsWith("/tags/") && pathname !== "/tags") {
    return "Tag";
  }
  const all = [...MAIN_NAV, ...UTILITY_NAV];
  const match = all.find((item) => isNavActive(pathname, item.href));
  return match?.topbarTitle ?? "Memórias";
}

export function getTopbarBackHref(pathname: string): string | null {
  if (pathname.startsWith("/photo/")) return "/";
  if (pathname.startsWith("/albums/") && pathname !== "/albums") {
    return "/albums";
  }
  if (pathname.startsWith("/people/") && pathname !== "/people") {
    return "/people";
  }
  if (pathname.startsWith("/tags/") && pathname !== "/tags") {
    return "/tags";
  }
  return null;
}

/** DS §3.1 — ld-topbar branca em todas as rotas do app-shell (inclui /search). */
export function showAppTopbar(_pathname: string): boolean {
  return true;
}
