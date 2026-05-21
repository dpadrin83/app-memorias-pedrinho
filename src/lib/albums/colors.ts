export const ALBUM_DOT_COLORS = [
  "var(--yellow)",
  "var(--green)",
  "var(--red)",
  "var(--purple)",
  "var(--blue)",
] as const;

export function albumColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % ALBUM_DOT_COLORS.length;
  }
  return ALBUM_DOT_COLORS[hash];
}
