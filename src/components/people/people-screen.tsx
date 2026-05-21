"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { categoryIcons } from "@/components/layout/sidebar";
import { PersonCard } from "@/components/people/person-card";
import { PersonFormModal } from "@/components/people/person-form-modal";
import type { PersonListItem } from "@/lib/people/queries";
import { formatPeopleSubtitle } from "@/lib/people/format";

type PeopleScreenProps = {
  people: PersonListItem[];
};

export function PeopleScreen({ people }: PeopleScreenProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <CatHeader
        variant="pessoas"
        icon={categoryIcons.pessoas}
        title="Pessoas"
        subtitle={formatPeopleSubtitle(people.length)}
        actions={
          <button
            type="button"
            className="btn btn-sm btn-pessoas-create"
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={14} strokeWidth={2} />
            Adicionar pessoa
          </button>
        }
      />
      <div className="screen-body">
        {people.length > 0 ? (
          <div className="people-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            title="Nenhuma pessoa cadastrada"
            description="Adicione pessoas para marcar nas fotos e filtrar memórias."
            icon={<Users size={36} strokeWidth={1.5} />}
            action={
              <button
                type="button"
                className="btn btn-sm btn-pessoas-create"
                onClick={() => setCreateOpen(true)}
              >
                Adicionar pessoa
              </button>
            }
          />
        )}
      </div>
      <PersonFormModal open={createOpen} onClose={() => setCreateOpen(false)} mode="create" />
    </>
  );
}
