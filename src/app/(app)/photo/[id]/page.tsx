import { notFound } from "next/navigation";
import { PhotoEditor } from "@/components/photos/photo-editor";
import { getPhotoById } from "@/lib/photos/get-photo";

type PhotoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) {
    notFound();
  }

  return <PhotoEditor photo={photo} />;
}
