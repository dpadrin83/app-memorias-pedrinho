import { notFound } from "next/navigation";
import { AlbumDetailScreen } from "@/components/albums/album-detail-screen";
import { parseAlbumViewParams } from "@/lib/albums/params";
import {
  getAlbumById,
  getAlbumPhotos,
  getPhotosAvailableForAlbum,
} from "@/lib/albums/queries";

type AlbumDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AlbumDetailPage({
  params,
  searchParams,
}: AlbumDetailPageProps) {
  const { id } = await params;
  const rawParams = await searchParams;
  const viewParams = parseAlbumViewParams(rawParams);

  const album = await getAlbumById(id);
  if (!album) notFound();

  const [photos, pickablePhotos] = await Promise.all([
    getAlbumPhotos(id, viewParams.loaded),
    getPhotosAvailableForAlbum(id),
  ]);

  return (
    <AlbumDetailScreen
      album={album}
      photos={photos}
      pickablePhotos={pickablePhotos}
      viewParams={viewParams}
    />
  );
}
