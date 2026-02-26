export type IpRangeOption = {
  cidr: string;
  title: string;
  hint?: string;
};

type IpRangeGridProps = {
  items: IpRangeOption[];
  selected?: string;
  onSelect: (cidr: string) => void;
};

export function IpRangeGrid({ items, selected, onSelect }: IpRangeGridProps) {
  return (
    <div className="ip-range-grid">
      {items.map((item) => (
        <button
          key={item.cidr}
          type="button"
          className={`ip-range ${selected === item.cidr ? 'active' : ''}`}
          onClick={() => onSelect(item.cidr)}
        >
          <strong>{item.cidr}</strong>
          <span>{item.title}</span>
          {item.hint && <small>{item.hint}</small>}
        </button>
      ))}
    </div>
  );
}
