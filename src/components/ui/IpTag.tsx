type IpTagProps = {
  ip: string;
  onRemove?: () => void;
};

export function IpTag({ ip, onRemove }: IpTagProps) {
  return (
    <span className="ip-tag">
      {ip}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${ip}`}>
          ×
        </button>
      )}
    </span>
  );
}
