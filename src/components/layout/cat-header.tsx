import type { ReactNode } from "react";

export type CategoryVariant =
  | "fotos"
  | "albuns"
  | "pessoas"
  | "tags"
  | "favoritos";

type CatHeaderProps = {
  variant: CategoryVariant;
  icon: ReactNode;
  title: ReactNode;
  subtitle: string;
  actions?: ReactNode;
};

export function CatHeader({
  variant,
  icon,
  title,
  subtitle,
  actions,
}: CatHeaderProps) {
  return (
    <header className={`cat-header ${variant}`}>
      <div className="cat-head-left">
        <div className="cat-icon">{icon}</div>
        <div className="cat-text">
          <h1 className="cat-title">{title}</h1>
          <p className="cat-sub">{subtitle}</p>
        </div>
      </div>
      {actions ? <div className="cat-actions">{actions}</div> : null}
    </header>
  );
}
