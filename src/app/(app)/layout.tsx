import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getRecentAlbumsForSidebar } from "@/lib/albums/queries";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isPublicSupabaseEnvConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isPublicSupabaseEnvConfigured()) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let recentAlbums: Awaited<ReturnType<typeof getRecentAlbumsForSidebar>> = [];
  try {
    recentAlbums = await getRecentAlbumsForSidebar(3);
  } catch (error) {
    console.error("[layout] recentAlbums:", error);
  }

  return (
    <AppShell user={user} recentAlbums={recentAlbums}>
      {children}
    </AppShell>
  );
}
