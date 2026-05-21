import { BookOpen, ImageIcon, Star, Tag, Users } from "lucide-react";

/** Ícones de categoria para cat-header (sem "use client" — usável em Server Components). */
export const categoryIcons = {
  fotos: <ImageIcon width={22} height={22} strokeWidth={1.75} />,
  albuns: <BookOpen width={22} height={22} strokeWidth={1.75} />,
  pessoas: <Users width={22} height={22} strokeWidth={1.75} />,
  tags: <Tag width={22} height={22} strokeWidth={1.75} />,
  favoritos: <Star width={22} height={22} strokeWidth={1.75} />,
};
