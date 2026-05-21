"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GripVertical, X } from "lucide-react";
import { reorderAlbumPhotos, removePhotoFromAlbum } from "@/lib/albums/actions";
import type { PhotoGalleryItem } from "@/lib/photos/queries";

type SortableAlbumGridProps = {
  albumId: string;
  photos: PhotoGalleryItem[];
};

function SortablePhotoItem({
  photo,
  albumId,
  onRemove,
}: {
  photo: PhotoGalleryItem;
  albumId: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`photo-card photo-card-album${isDragging ? " photo-card-dragging" : ""}`}
    >
      <button
        type="button"
        className="album-drag-handle"
        aria-label="Arrastar para reordenar"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} strokeWidth={1.75} />
      </button>
      <Link href={`/photo/${photo.id}`} className="photo-card-link">
        <Image
          src={photo.thumbnailUrl}
          alt={photo.title ?? "Foto"}
          fill
          sizes="200px"
          className="photo-card-img"
        />
      </Link>
      <button
        type="button"
        className="album-remove-photo"
        aria-label="Remover do álbum"
        onClick={() => void onRemove()}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export function SortableAlbumGrid({ albumId, photos }: SortableAlbumGridProps) {
  const router = useRouter();
  const [items, setItems] = useState(photos);

  useEffect(() => {
    setItems(photos);
  }, [photos]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await reorderAlbumPhotos(
      albumId,
      next.map((p) => p.id),
    );
    router.refresh();
  };

  const remove = async (photoId: string) => {
    if (!window.confirm("Remover esta foto do álbum?")) return;
    await removePhotoFromAlbum(albumId, photoId);
    setItems((prev) => prev.filter((p) => p.id !== photoId));
    router.refresh();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => void handleDragEnd(e)}
    >
      <SortableContext items={items.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="ph-grid">
          {items.map((photo) => (
            <SortablePhotoItem
              key={photo.id}
              photo={photo}
              albumId={albumId}
              onRemove={() => void remove(photo.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
