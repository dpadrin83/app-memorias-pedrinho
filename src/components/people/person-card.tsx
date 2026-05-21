import Link from "next/link";
import type { PersonListItem } from "@/lib/people/queries";
import { formatPhotoCount } from "@/lib/photos/format";

type PersonCardProps = {
  person: PersonListItem;
};

export function PersonCard({ person }: PersonCardProps) {
  const meta = person.relationship
    ? `${formatPhotoCount(person.photoCount)} · ${person.relationship}`
    : formatPhotoCount(person.photoCount);

  return (
    <Link href={`/people/${person.id}`} className="person-card">
      <span className="avatar ph-avatar green">{person.initials}</span>
      <p className="person-name">{person.name}</p>
      <p className="person-meta">{meta}</p>
    </Link>
  );
}
