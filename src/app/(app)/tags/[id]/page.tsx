import { notFound } from "next/navigation";
import { TagDetailScreen } from "@/components/tags/tag-detail-screen";
import { parseTagViewParams } from "@/lib/tags/params";
import { getPhotosForTag, getTagById } from "@/lib/tags/queries";

type TagPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { id } = await params;
  const viewParams = parseTagViewParams(await searchParams);

  const tag = await getTagById(id);
  if (!tag) notFound();

  const photos = await getPhotosForTag(id, viewParams.loaded);

  return (
    <TagDetailScreen tag={tag} photos={photos} viewParams={viewParams} />
  );
}
