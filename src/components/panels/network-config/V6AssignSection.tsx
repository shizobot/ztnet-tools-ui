import { Toggle } from '../../ui';

type V6State = { zt: boolean; rfc4193: boolean; '6plane': boolean };

type V6AssignSectionProps = {
  value: V6State;
  onChange: (next: V6State) => void;
};

export function V6AssignSection({ value, onChange }: V6AssignSectionProps) {
  return (
    <>
      <Toggle checked={value.zt} onChange={(zt) => onChange({ ...value, zt })} label="IPv6 zt" />
      <Toggle
        checked={value.rfc4193}
        onChange={(rfc4193) => onChange({ ...value, rfc4193 })}
        label="IPv6 rfc4193"
      />
      <Toggle
        checked={value['6plane']}
        onChange={(sixplane) => onChange({ ...value, '6plane': sixplane })}
        label="IPv6 6plane"
      />
    </>
  );
}
