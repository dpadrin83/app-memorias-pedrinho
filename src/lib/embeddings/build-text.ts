type PhotoEmbeddingSource = {
  title: string | null;
  description: string | null;
  location: string | null;
  people: string[];
  tags: string[];
};

export function buildPhotoEmbeddingText(source: PhotoEmbeddingSource): string {
  const parts: string[] = [];

  if (source.title?.trim()) parts.push(source.title.trim());
  if (source.description?.trim()) parts.push(source.description.trim());
  if (source.location?.trim()) parts.push(source.location.trim());
  if (source.people.length) parts.push(source.people.join(", "));
  if (source.tags.length) parts.push(source.tags.map((t) => `#${t}`).join(" "));

  if (parts.length === 0) {
    return "Foto de memória familiar sem título nem descrição.";
  }

  return parts.join("\n");
}
