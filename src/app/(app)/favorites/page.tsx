import { CatHeader } from "@/components/layout/cat-header";
import { EmptyPlaceholder } from "@/components/layout/empty-placeholder";
import { ViewTabs } from "@/components/layout/view-tabs";
import { categoryIcons } from "@/components/layout/sidebar";
import { Star } from "lucide-react";

export default function FavoritesPage() {
  return (
    <>
      <CatHeader
        variant="favoritos"
        icon={categoryIcons.favoritos}
        title="Favoritos"
        subtitle="Memórias marcadas com estrela"
      />
      <div className="screen-body">
        <ViewTabs activeView="grid" />
        <EmptyPlaceholder
          title="Nenhum favorito ainda"
          description="Marque fotos com estrela para vê-las aqui, com os mesmos modos de visualização de Fotos."
          icon={<Star size={36} strokeWidth={1.5} />}
        />
      </div>
    </>
  );
}
