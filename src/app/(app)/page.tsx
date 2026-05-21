import { FotosScreen } from "@/components/photos/fotos-screen";
import {
  getActivePhotosCount,
  getActivePhotosForGallery,
} from "@/lib/photos/queries";
import { PHOTO_PAGE_SIZE, parsePhotoView } from "@/lib/photos/views";

export const dynamic = "force-dynamic";

type FotosPageProps = {
  searchParams?: Promise<{ view?: string; loaded?: string }>;
};

export default async function FotosPage({ searchParams }: FotosPageProps) {
  const params = searchParams ? await searchParams : {};
  const view = parsePhotoView(params.view);
  const loaded = Math.max(
    PHOTO_PAGE_SIZE,
    Number(params.loaded) || PHOTO_PAGE_SIZE,
  );

  let count = 0;
  let photos: Awaited<ReturnType<typeof getActivePhotosForGallery>> = [];

  try {
    [count, photos] = await Promise.all([
      getActivePhotosCount(),
      getActivePhotosForGallery(loaded),
    ]);
  } catch (error) {
    console.error("[fotos/page]", error);
  }

  return (
    <FotosScreen
      view={view}
      count={count}
      photos={photos}
      loadedCount={loaded}
    />
  );
}
