import Link from "next/link";
import type { TagListItem } from "@/lib/tags/queries";

type TagChipLinkProps = {
  tag: TagListItem;
  large?: boolean;
};

export function TagChipLink({ tag, large = false }: TagChipLinkProps) {
  return (
    <Link
      href={`/tags/${tag.id}`}
      className={`${tag.pillClass}${large ? " tag-pill-lg" : ""}`}
    >
      {tag.name}
      <span className="tag-count">· {tag.photoCount}</span>
    </Link>
  );
}
