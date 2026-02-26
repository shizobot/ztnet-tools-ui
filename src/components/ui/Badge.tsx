import type { ReactNode } from 'react';

type BadgeTone = 'green' | 'red' | 'blue' | 'gray' | 'yellow' | 'orange';

type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};

export function Badge({ tone = 'gray', children }: BadgeProps) {
  return <span className={`badge b-${tone}`}>{children}</span>;
}
