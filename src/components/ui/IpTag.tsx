type IpTagProps = {
  value: string;
  onRemove?: () => void;
};

export function IpTag({ value, onRemove }: IpTagProps) {
  return (
    <span className="ip-tag">
      {value}
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={`Remove ${value}`}>
          ×
        </button>
      ) : null}
    </span>
  );
}
