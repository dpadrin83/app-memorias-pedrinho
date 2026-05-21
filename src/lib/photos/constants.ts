export const PHOTOS_BUCKET = "photos";

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const ACCEPTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
] as const;

export const MAX_PHOTO_BYTES = 50 * 1024 * 1024;

export const THUMBNAIL_TRANSFORM = {
  width: 400,
  height: 400,
  resize: "cover" as const,
};
