import type { ReactNode } from 'react';

type AddSubCardProps = {
  title: string;
  onAdd: () => void;
  children?: ReactNode;
};

export function AddSubCard({ title, onAdd, children }: AddSubCardProps) {
  return (
    <div className="card sub-card">
      <div className="card-hdr">
        <h4>{title}</h4>
        <button type="button" className="btn" onClick={onAdd}>
          Add
        </button>
      </div>
      {children}
    </div>
  );
}
