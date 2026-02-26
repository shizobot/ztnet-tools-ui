import type { ReactNode } from 'react';

type TunnelBlockProps = {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function TunnelBlock({ title, subtitle, open, onToggle, children }: TunnelBlockProps) {
  return (
    <section className={`tunnel-block ${open ? 'open' : ''}`}>
      <button type="button" className="tunnel-block-hdr" onClick={onToggle}>
        <span className="tunnel-block-hl" />
        <span>
          <span className="tunnel-block-title">{title}</span>
          {subtitle ? <span className="tunnel-block-sub">{subtitle}</span> : null}
        </span>
        <span className="tunnel-arrow">▾</span>
      </button>
      <div className="tunnel-block-body">{children}</div>
    </section>
  );
}
