import { notFound } from "next/navigation";
import { PersonDetailScreen } from "@/components/people/person-detail-screen";
import { parsePersonViewParams } from "@/lib/people/params";
import { getPersonById, getPhotosForPerson } from "@/lib/people/queries";

type PersonPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PersonPage({
  params,
  searchParams,
}: PersonPageProps) {
  const { id } = await params;
  const viewParams = parsePersonViewParams(await searchParams);

  const person = await getPersonById(id);
  if (!person) notFound();

  const photos = await getPhotosForPerson(id, viewParams.loaded);

  return (
    <PersonDetailScreen
      person={person}
      photos={photos}
      viewParams={viewParams}
    />
  );
}
