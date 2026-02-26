import type { ReactNode } from 'react';

type TagBoxProps = {
  children: ReactNode;
};

export function TagBox({ children }: TagBoxProps) {
  return <div className="tag-box">{children}</div>;
}
