import type { ReactNode } from 'react';

type TabBarProps = {
  children: ReactNode;
};

export function TabBar({ children }: TabBarProps) {
  return <div className="tab-bar">{children}</div>;
}
