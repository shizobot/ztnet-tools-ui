import type { ReactNode } from 'react';

type CardProps = {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
};

export function Card({ title, right, children }: CardProps) {
  return (
    <section className="card">
      {(title || right) && (
        <header className="card-hdr">
          {title ? <div className="card-title">{title}</div> : <span />}
          {right}
        </header>
      )}
      {children}
    </section>
  );
}
