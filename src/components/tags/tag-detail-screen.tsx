"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { categoryIcons } from "@/components/layout/sidebar";
import { EntityPhotoGallery } from "@/components/shared/entity-photo-gallery";
import { TagFormModal } from "@/components/tags/tag-form-modal";
import { TagViewTabs } from "@/components/tags/tag-view-tabs";
import { deleteTag } from "@/lib/tags/actions";
import { buildTagHref, type TagViewParams } from "@/lib/tags/params";
import type { TagDetail } from "@/lib/tags/queries";
import { formatTagPhotoSubtitle } from "@/lib/tags/format";
import type { PhotoGalleryItem } from "@/lib/photos/queries";
import { PHOTO_PAGE_SIZE } from "@/lib/photos/views";

type TagDetailScreenProps = {
  tag: TagDetail;
  photos: PhotoGalleryItem[];
  viewParams: TagViewParams;
};

export function TagDetailScreen({
  tag,
  photos,
  viewParams,
}: TagDetailScreenProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteTagHandler = async () => {
    if (
      !window.confirm(
        `Remover a tag "${tag.name}" de todas as fotos? As fotos não serão apagadas.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    await deleteTag(tag.id);
  };

  return (
    <>
      <CatHeader
        variant="tags"
        icon={categoryIcons.tags}
        title={tag.name}
        subtitle={formatTagPhotoSubtitle(photos.length)}
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={14} strokeWidth={1.75} />
              Renomear
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => void deleteTagHandler()}
              disabled={deleting}
            >
              <Trash2 size={14} strokeWidth={1.75} />
              {deleting ? "Removendo…" : "Excluir"}
            </button>
          </>
        }
      />
      <div className="screen-body">
        <TagViewTabs tagId={tag.id} viewParams={viewParams} />
        <EntityPhotoGallery
          photos={photos}
          view={viewParams.view}
          loaded={viewParams.loaded}
          loadMoreHref={buildTagHref(tag.id, {
            loaded: viewParams.loaded + PHOTO_PAGE_SIZE,
          }, viewParams)}
          emptyTitle="Sem fotos com esta tag"
          emptyDescription="Adicione esta tag ao editar fotos individuais."
        />
      </div>
      <TagFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        tagId={tag.id}
        initialName={tag.name}
      />
    </>
  );
}
