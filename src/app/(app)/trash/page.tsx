import { TrashScreen } from "@/components/trash/trash-screen";
import { getDeletedAlbums, getDeletedPhotos } from "@/lib/trash/queries";
import { parseTrashParams } from "@/lib/trash/params";

type TrashPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrashPage({ searchParams }: TrashPageProps) {
  const raw = await searchParams;
  const params = parseTrashParams(raw);

  const [photos, albums] = await Promise.all([
    getDeletedPhotos(),
    getDeletedAlbums(),
  ]);

  return (
    <TrashScreen params={params} photos={photos} albums={albums} />
  );
}
