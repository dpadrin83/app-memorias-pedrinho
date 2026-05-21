import exifr from "exifr";

export type ExtractedPhotoMetadata = {
  eventDate: string | null;
  lat: number | null;
  lng: number | null;
};

function toIsoDate(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function extractPhotoMetadata(
  buffer: ArrayBuffer,
): Promise<ExtractedPhotoMetadata> {
  try {
    const meta = await exifr.parse(buffer, {
      pick: [
        "DateTimeOriginal",
        "CreateDate",
        "ModifyDate",
        "latitude",
        "longitude",
      ],
      gps: true,
    });

    if (!meta) {
      return { eventDate: null, lat: null, lng: null };
    }

    const eventDate =
      toIsoDate(meta.DateTimeOriginal) ??
      toIsoDate(meta.CreateDate) ??
      toIsoDate(meta.ModifyDate);

    const lat =
      typeof meta.latitude === "number" && Number.isFinite(meta.latitude)
        ? meta.latitude
        : null;
    const lng =
      typeof meta.longitude === "number" && Number.isFinite(meta.longitude)
        ? meta.longitude
        : null;

    return { eventDate, lat, lng };
  } catch {
    return { eventDate: null, lat: null, lng: null };
  }
}
