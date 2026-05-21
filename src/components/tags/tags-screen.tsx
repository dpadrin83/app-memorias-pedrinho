"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { categoryIcons } from "@/components/layout/sidebar";
import { TagChipLink } from "@/components/tags/tag-chip-link";
import { TagFormModal } from "@/components/tags/tag-form-modal";
import type { TagListItem } from "@/lib/tags/queries";

type TagsScreenProps = {
  tags: TagListItem[];
};

export function TagsScreen({ tags }: TagsScreenProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <CatHeader
        variant="tags"
        icon={categoryIcons.tags}
        title="Tags"
        subtitle={
          tags.length
            ? `${tags.length} tags · Organize memórias por palavras-chave`
            : "Organize memórias por palavras-chave"
        }
        actions={
          <button
            type="button"
            className="btn btn-sm btn-tags-create"
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={14} strokeWidth={2} />
            Criar tag
          </button>
        }
      />
      <div className="screen-body">
        {tags.length > 0 ? (
          <div className="tags-cloud">
            {tags.map((tag) => (
              <TagChipLink key={tag.id} tag={tag} large />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            title="Nenhuma tag ainda"
            description="Crie tags ao editar fotos ou adicione novas aqui."
            icon={<Tag size={36} strokeWidth={1.5} />}
            action={
              <button
                type="button"
                className="btn btn-sm btn-tags-create"
                onClick={() => setCreateOpen(true)}
              >
                Criar tag
              </button>
            }
          />
        )}
      </div>
      <TagFormModal open={createOpen} onClose={() => setCreateOpen(false)} mode="create" />
    </>
  );
}
