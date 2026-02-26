import type { ReactNode } from 'react';

type NoticeKind = 'info' | 'warn' | 'error' | 'ok';

type NoticeProps = {
  kind?: NoticeKind;
  children: ReactNode;
};

export function Notice({ kind = 'info', children }: NoticeProps) {
  return <div className={`notice notice-${kind}`}>{children}</div>;
}
