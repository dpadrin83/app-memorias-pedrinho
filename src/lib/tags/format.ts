import { formatPhotoCount } from "@/lib/photos/format";

export function formatTagPhotoSubtitle(count: number) {
  return formatPhotoCount(count);
}
