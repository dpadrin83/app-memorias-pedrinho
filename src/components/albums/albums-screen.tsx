"use client";

import { useState } from "react";
import { ArrowUpDown, FolderOpen, Plus } from "lucide-react";
import { CatHeader } from "@/components/layout/cat-header";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { categoryIcons } from "@/components/layout/sidebar";
import { AlbumCard } from "@/components/albums/album-card";
import { AlbumFormModal } from "@/components/albums/album-form-modal";
import type { AlbumListItem } from "@/lib/albums/queries";
import { formatAlbumCount } from "@/lib/albums/format";

type AlbumsScreenProps = {
  albums: AlbumListItem[];
};

export function AlbumsScreen({ albums }: AlbumsScreenProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <CatHeader
        variant="albuns"
        icon={categoryIcons.albuns}
        title="Álbuns"
        subtitle={formatAlbumCount(albums.length)}
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm">
              <ArrowUpDown size={14} strokeWidth={1.75} />
              Ordenar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-album-create"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={14} strokeWidth={2} />
              Criar álbum
            </button>
          </>
        }
      />
      <div className="screen-body">
        {albums.length > 0 ? (
          <div className="album-grid">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            title="Nenhum álbum ainda"
            description="Crie álbuns para agrupar memórias por evento, viagem ou tema."
            icon={<FolderOpen size={36} strokeWidth={1.5} />}
            action={
              <button
                type="button"
                className="btn btn-sm btn-album-create"
                onClick={() => setCreateOpen(true)}
              >
                Criar primeiro álbum
              </button>
            }
          />
        )}
      </div>

      <AlbumFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
      />
    </>
  );
}
