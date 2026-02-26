import type { ReactNode } from 'react';

type TerminalProps = {
  title?: string;
  children: ReactNode;
};

export function Terminal({ title = 'Terminal', children }: TerminalProps) {
  return (
    <div className="terminal">
      <div className="terminal-hdr">
        <span className="term-dot" style={{ background: '#ff5f57' }} />
        <span className="term-dot" style={{ background: '#febc2e' }} />
        <span className="term-dot" style={{ background: '#28c840' }} />
        <span className="term-title">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
