import { ChangeEvent } from 'react';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  id?: string;
};

export function Toggle({ checked, onChange, disabled = false, label, hint, id }: ToggleProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="toggle-row">
      <label className="toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={handleChange} disabled={disabled} />
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
      </label>
      {(label || hint) && (
        <div>
          {label && <div>{label}</div>}
          {hint && <div className="field-hint">{hint}</div>}
        </div>
      )}
    </div>
  );
}
