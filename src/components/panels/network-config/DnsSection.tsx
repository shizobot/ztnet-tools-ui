import { DnsServerRow } from '../../ui';

type DnsEditor = {
  appendItem: (value: string) => void;
  removeItem: (index: number) => void;
  replaceItem: (index: number, value: string) => void;
};

type DnsSectionProps = {
  dnsServers: string[];
  dnsEditor: DnsEditor;
};

export function DnsSection({ dnsServers, dnsEditor }: DnsSectionProps) {
  return (
    <>
      {dnsServers.map((dns, index) => (
        <DnsServerRow
          key={`${dns}-${index}`}
          value={dns}
          onChange={(value) => dnsEditor.replaceItem(index, value)}
          onRemove={() => dnsEditor.removeItem(index)}
        />
      ))}
      <button type="button" className="btn" onClick={() => dnsEditor.appendItem('')}>
        Add DNS
      </button>
    </>
  );
}
