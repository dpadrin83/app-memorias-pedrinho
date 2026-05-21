"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Menu, Search } from "lucide-react";
import type { CurrentUser } from "@/lib/auth/types";
import {
  getTopbarBackHref,
  getTopbarTitle,
  showAppTopbar,
} from "@/lib/navigation";
import type { SidebarAlbumLink } from "@/lib/albums/queries";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: React.ReactNode;
  user: CurrentUser;
  recentAlbums: SidebarAlbumLink[];
};

export function AppShell({ children, user, recentAlbums }: AppShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const topbarTitle = getTopbarTitle(pathname);
  const topbarBackHref = getTopbarBackHref(pathname);
  const showTopbar = showAppTopbar(pathname);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="app-shell">
      <div
        className={`drawer-backdrop${drawerOpen ? " open" : ""}`}
        aria-hidden={!drawerOpen}
        onClick={closeDrawer}
      />

      <Sidebar
        open={drawerOpen}
        onNavigate={closeDrawer}
        user={user}
        recentAlbums={recentAlbums}
      />

      <div className="app-main">
        <div className="ld-topbar-mobile">
          <button
            type="button"
            className="icon-btn"
            aria-label="Abrir menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
          <span className="ld-topbar-title">{topbarTitle}</span>
        </div>

        {showTopbar ? (
          <div className="ld-topbar">
            <div className="ld-topbar-start">
              {topbarBackHref ? (
                <Link
                  className="icon-btn sm"
                  href={topbarBackHref}
                  aria-label="Voltar"
                >
                  <ArrowLeft size={18} strokeWidth={1.75} />
                </Link>
              ) : null}
              <span className="ld-topbar-title">{topbarTitle}</span>
            </div>
            <Link
              className="icon-btn sm"
              href="/search"
              aria-label="Buscar"
            >
              <Search size={16} strokeWidth={1.75} />
            </Link>
          </div>
        ) : null}

        <div className="app-canvas">{children}</div>
      </div>
    </div>
  );
}
