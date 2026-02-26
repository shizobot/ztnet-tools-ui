import { useId } from 'react';
import type { ChangeEvent } from 'react';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  id?: string;
};

export function Toggle({ checked, onChange, disabled = false, label, hint, id }: ToggleProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="toggle-row">
      <label className="toggle" htmlFor={inputId}>
        <span
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
          }}
        >
          {label ?? 'Toggle'}
        </span>
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
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
