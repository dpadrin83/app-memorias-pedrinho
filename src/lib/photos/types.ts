export type PhotoDisplayItem = {
  id: string;
  title: string | null;
  thumbnailUrl: string;
  eventDate: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  people: string[];
  tags: string[];
  isFavorite: boolean;
};

/** @deprecated Use PhotoDisplayItem */
export type PhotoGalleryItem = PhotoDisplayItem;
