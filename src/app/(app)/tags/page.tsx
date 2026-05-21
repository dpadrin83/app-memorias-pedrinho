import { TagsScreen } from "@/components/tags/tags-screen";
import { getTagsList } from "@/lib/tags/queries";

export default async function TagsPage() {
  const tags = await getTagsList();
  return <TagsScreen tags={tags} />;
}
