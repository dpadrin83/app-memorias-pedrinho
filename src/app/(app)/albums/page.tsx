import { AlbumsScreen } from "@/components/albums/albums-screen";
import { getActiveAlbums } from "@/lib/albums/queries";

export default async function AlbumsPage() {
  const albums = await getActiveAlbums();
  return <AlbumsScreen albums={albums} />;
}
