"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ImageIcon,
  Search,
  Settings,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import type { CurrentUser } from "@/lib/auth/types";
import type { SidebarAlbumLink } from "@/lib/albums/queries";
import { isNavActive, MAIN_NAV, UTILITY_NAV } from "@/lib/navigation";

function NavIcon({ href }: { href: string }) {
  const cls = { width: 14, height: 14, strokeWidth: 1.5 };
  if (href === "/") return <ImageIcon {...cls} />;
  if (href === "/search") return <Search {...cls} strokeWidth={1.75} />;
  if (href === "/trash") return <Trash2 {...cls} />;
  if (href === "/settings") return <Settings {...cls} />;
  return null;
}

type SidebarProps = {
  open: boolean;
  user: CurrentUser;
  recentAlbums: SidebarAlbumLink[];
  onNavigate?: () => void;
};

export function Sidebar({ open, user, recentAlbums, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`ld-sidebar app-sidebar${open ? " open" : ""}`}
      aria-label="Navegação principal"
    >
      <div className="app-sidebar-scroll">
        <Link className="ld-brand" href="/" onClick={onNavigate}>
          <span className="mark">M</span>
          Memórias
        </Link>

        {MAIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`ld-item${active ? ` ${item.activeClass}` : ""}`}
              onClick={onNavigate}
            >
              {item.dotColor ? (
                <span
                  className="dot-cat"
                  style={{ background: item.dotColor }}
                />
              ) : (
                <NavIcon href={item.href} />
              )}
              {item.label}
              {item.count != null ? (
                <span className="nav-count">{item.count}</span>
              ) : null}
            </Link>
          );
        })}

        {recentAlbums.length > 0 ? (
          <>
            <p className="nav-section-label">Álbuns recentes</p>
            {recentAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="ld-item sub"
                onClick={onNavigate}
              >
                <span
                  className="dot-cat"
                  style={{ background: album.dotColor }}
                />
                {album.title}
              </Link>
            ))}
          </>
        ) : null}

        <div className="nav-divider" />

        {UTILITY_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`ld-item${active ? ` ${item.activeClass}` : ""}`}
              onClick={onNavigate}
            >
              <NavIcon href={item.href} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <Link className="sidebar-user" href="/settings" onClick={onNavigate}>
          <span className="avatar md blue">{user.initials}</span>
          <div className="sidebar-user-meta">
            <p className="sidebar-user-name">{user.name ?? "Conta"}</p>
            <p className="sidebar-user-email">{user.email}</p>
          </div>
        </Link>
        <form action={signOut}>
          <button type="submit" className="btn-logout">
            Sair da conta
          </button>
        </form>
      </div>
    </aside>
  );
}

export { categoryIcons } from "./category-icons";
