import { ReactNode } from 'react';

type CardProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, actions, children, className = '' }: CardProps) {
  return (
    <section className={['card', className].filter(Boolean).join(' ')}>
      {(title || actions) && (
        <header className="card-hdr">
          {title && <h3>{title}</h3>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
