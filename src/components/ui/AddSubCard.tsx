import type { ReactNode } from 'react';

type AddSubCardProps = {
  title: string;
  children: ReactNode;
};

export function AddSubCard({ title, children }: AddSubCardProps) {
  return (
    <div className="add-sub-card">
      <div className="add-sub-title">{title}</div>
      {children}
    </div>
  );
}
