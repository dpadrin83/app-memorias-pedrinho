import { PeopleScreen } from "@/components/people/people-screen";
import { getPeopleList } from "@/lib/people/queries";

export default async function PeoplePage() {
  const people = await getPeopleList();
  return <PeopleScreen people={people} />;
}
