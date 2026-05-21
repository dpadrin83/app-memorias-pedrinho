import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  MAX_PHOTO_BYTES,
} from "./constants";

const MIME_SET = new Set<string>(ACCEPTED_MIME_TYPES);

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

export function validatePhotoFile(file: File): string | null {
  if (file.size > MAX_PHOTO_BYTES) {
    return "Arquivo muito grande (máx. 50 MB).";
  }

  const ext = extensionOf(file.name);
  const mimeOk = MIME_SET.has(file.type);
  const extOk = ACCEPTED_EXTENSIONS.includes(
    ext as (typeof ACCEPTED_EXTENSIONS)[number],
  );

  if (!mimeOk && !extOk) {
    return "Formato não suportado. Use JPG, PNG, HEIC ou WebP.";
  }

  return null;
}

export function storageExtension(file: File): string {
  const ext = extensionOf(file.name);
  if (ext === ".jpeg") return "jpg";
  if (ext === ".heif") return "heic";
  if (ACCEPTED_EXTENSIONS.includes(ext as (typeof ACCEPTED_EXTENSIONS)[number])) {
    return ext.replace(".", "");
  }
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/heic" || file.type === "image/heif") return "heic";
  return "jpg";
}
