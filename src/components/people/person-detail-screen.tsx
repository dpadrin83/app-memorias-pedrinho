"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { categoryIcons } from "@/components/layout/sidebar";
import { EntityPhotoGallery } from "@/components/shared/entity-photo-gallery";
import { PersonFormModal } from "@/components/people/person-form-modal";
import { PersonViewTabs } from "@/components/people/person-view-tabs";
import { deletePerson } from "@/lib/people/actions";
import { buildPersonHref, type PersonViewParams } from "@/lib/people/params";
import { formatPersonPhotoSubtitle } from "@/lib/people/format";
import type { PersonDetail } from "@/lib/people/queries";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { PHOTO_PAGE_SIZE } from "@/lib/photos/views";

type PersonDetailScreenProps = {
  person: PersonDetail;
  photos: PhotoGalleryItem[];
  viewParams: PersonViewParams;
};

export function PersonDetailScreen({
  person,
  photos,
  viewParams,
}: PersonDetailScreenProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deletePersonHandler = async () => {
    if (
      !window.confirm(
        `Remover "${person.name}" de todas as fotos? As fotos não serão apagadas.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    await deletePerson(person.id);
  };

  return (
    <>
      <CatHeader
        variant="pessoas"
        icon={categoryIcons.pessoas}
        title={person.name}
        subtitle={formatPersonPhotoSubtitle(photos.length, person.relationship)}
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={14} strokeWidth={1.75} />
              Editar
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => void deletePersonHandler()}
              disabled={deleting}
            >
              <Trash2 size={14} strokeWidth={1.75} />
              {deleting ? "Removendo…" : "Excluir"}
            </button>
          </>
        }
      />
      <div className="screen-body">
        <PersonViewTabs personId={person.id} viewParams={viewParams} />
        <EntityPhotoGallery
          photos={photos}
          view={viewParams.view}
          loaded={viewParams.loaded}
          loadMoreHref={buildPersonHref(person.id, {
            loaded: viewParams.loaded + PHOTO_PAGE_SIZE,
          }, viewParams)}
          emptyTitle="Sem fotos desta pessoa"
          emptyDescription="Marque esta pessoa nas fotos pelo painel de edição de cada memória."
        />
      </div>
      <PersonFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        personId={person.id}
        initialName={person.name}
        initialRelationship={person.relationship ?? ""}
      />
    </>
  );
}
