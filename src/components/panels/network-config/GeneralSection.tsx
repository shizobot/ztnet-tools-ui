import { Toggle } from '../../ui';

type GeneralSectionProps = {
  name: string;
  description: string;
  isPrivate: boolean;
  enableBroadcast: boolean;
  multicastLimit: number;
  v4Mode: 'zt' | 'none';
  dnsDomain: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIsPrivateChange: (value: boolean) => void;
  onEnableBroadcastChange: (value: boolean) => void;
  onMulticastLimitChange: (value: number) => void;
  onV4ModeChange: (value: 'zt' | 'none') => void;
  onDnsDomainChange: (value: string) => void;
};

export function GeneralSection({
  name,
  description,
  isPrivate,
  enableBroadcast,
  multicastLimit,
  v4Mode,
  dnsDomain,
  onNameChange,
  onDescriptionChange,
  onIsPrivateChange,
  onEnableBroadcastChange,
  onMulticastLimitChange,
  onV4ModeChange,
  onDnsDomainChange,
}: GeneralSectionProps) {
  return (
    <>
      <label htmlFor="networkName">Name</label>
      <input id="networkName" value={name} onChange={(event) => onNameChange(event.target.value)} />
      <label htmlFor="networkDescription">Description</label>
      <input
        id="networkDescription"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
      />
      <Toggle checked={isPrivate} onChange={onIsPrivateChange} label="Private" />
      <Toggle
        checked={enableBroadcast}
        onChange={onEnableBroadcastChange}
        label="Enable broadcast"
      />
      <label htmlFor="multicastLimit">Multicast recipient limit</label>
      <input
        id="multicastLimit"
        type="number"
        min={0}
        value={multicastLimit}
        onChange={(event) => onMulticastLimitChange(Number(event.target.value) || 0)}
      />
      <label htmlFor="v4Mode">IPv4 assignment mode</label>
      <select
        id="v4Mode"
        value={v4Mode}
        onChange={(event) => onV4ModeChange(event.target.value as 'zt' | 'none')}
      >
        <option value="zt">ZeroTier managed</option>
        <option value="none">None</option>
      </select>
      <label htmlFor="dnsDomain">DNS domain</label>
      <input
        id="dnsDomain"
        value={dnsDomain}
        onChange={(event) => onDnsDomainChange(event.target.value)}
      />
    </>
  );
}
