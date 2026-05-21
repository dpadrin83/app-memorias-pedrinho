import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getRecentAlbumsForSidebar } from "@/lib/albums/queries";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const recentAlbums = await getRecentAlbumsForSidebar(3);

  return (
    <AppShell user={user} recentAlbums={recentAlbums}>
      {children}
    </AppShell>
  );
}
