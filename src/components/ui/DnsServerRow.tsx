import { ChangeEvent } from 'react';

type DnsServerRowProps = {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
};

export function DnsServerRow({ value, onChange, onRemove }: DnsServerRowProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className="dns-row">
      <input value={value} onChange={handleChange} placeholder="DNS server (e.g. 1.1.1.1)" />
      <button type="button" className="btn btn-ghost" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
