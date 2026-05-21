import type { ReactNode } from "react";

type EmptyPlaceholderProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyPlaceholder({
  title,
  description,
  icon,
  action,
}: EmptyPlaceholderProps) {
  return (
    <div className="empty-state">
      <div className="illu" aria-hidden>
        {icon}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {action}
    </div>
  );
}
