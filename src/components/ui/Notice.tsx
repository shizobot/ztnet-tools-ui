import type { ReactNode } from 'react';

type NoticeKind = 'info' | 'warn' | 'error' | 'ok';

type NoticeProps = {
  kind?: NoticeKind;
  children: ReactNode;
};

const KIND_ICON: Record<NoticeKind, string> = {
  info: 'ℹ',
  warn: '⚠',
  error: '✕',
  ok: '✓',
};

export function Notice({ kind = 'info', children }: NoticeProps) {
  return (
    <div className={`notice ${kind}`}>
      <span className="notice-icon">{KIND_ICON[kind]}</span>
      <span>{children}</span>
    </div>
  );
}
