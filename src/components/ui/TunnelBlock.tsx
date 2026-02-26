import { ReactNode, useState } from 'react';

type TunnelBlockProps = {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function TunnelBlock({ id, title, children, defaultOpen = false }: TunnelBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  // Original behavior: toggleTunnel(id) => block.classList.toggle('open')
  const toggleTunnel = () => {
    setOpen((prev) => !prev);
  };

  return (
    <section id={id} className={`tunnel-block ${open ? 'open' : ''}`}>
      <button type="button" className="tunnel-toggle" onClick={toggleTunnel} aria-expanded={open}>
        {title}
      </button>
      <div className="tunnel-body">{children}</div>
    </section>
  );
}
