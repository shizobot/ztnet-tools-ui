import { ChangeEvent } from 'react';

export type RouteValue = {
  target: string;
  via: string;
};

type RouteRowProps = {
  value: RouteValue;
  onChange: (value: RouteValue) => void;
  onRemove: () => void;
};

export function RouteRow({ value, onChange, onRemove }: RouteRowProps) {
  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value: next } = event.target;
    onChange({ ...value, [name]: next });
  };

  return (
    <div className="route-row">
      <input name="target" value={value.target} onChange={update} placeholder="Target (e.g. 10.0.0.0/24)" />
      <input name="via" value={value.via} onChange={update} placeholder="Via (optional)" />
      <button type="button" className="btn btn-ghost" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
