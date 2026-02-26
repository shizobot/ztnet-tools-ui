import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { IpTag } from './IpTag';

type TagBoxProps = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function TagBox({
  values,
  onChange,
  placeholder = 'Add value and press Enter',
}: TagBoxProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add();
    }
  };

  return (
    <div className="tag-box">
      <div className="tag-list">
        {values.map((value) => (
          <IpTag
            key={value}
            ip={value}
            onRemove={() => onChange(values.filter((item) => item !== value))}
          />
        ))}
      </div>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={placeholder}
      />
    </div>
  );
}
