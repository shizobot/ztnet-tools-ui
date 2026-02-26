import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  icon?: string;
};

export function EmptyState({ title, description, icon = '∅' }: EmptyStateProps) {
  return (
    <div className="empty" role="status" aria-live="polite">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div>{description}</div>
    </div>
  );
}
