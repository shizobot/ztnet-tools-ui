export type AccessValue = 'private' | 'public';

type AccessRadioGroupProps = {
  value: AccessValue;
  onChange: (value: AccessValue) => void;
};

export function AccessRadioGroup({ value, onChange }: AccessRadioGroupProps) {
  return (
    <div className="access-radio-group" role="radiogroup" aria-label="Network access">
      <label>
        <input
          type="radio"
          name="access"
          value="private"
          checked={value === 'private'}
          onChange={() => onChange('private')}
        />
        Private
      </label>
      <label>
        <input
          type="radio"
          name="access"
          value="public"
          checked={value === 'public'}
          onChange={() => onChange('public')}
        />
        Public
      </label>
    </div>
  );
}
