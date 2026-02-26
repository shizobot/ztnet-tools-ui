type BadgeProps = {
  value: number | string;
  alert?: boolean;
  className?: string;
};

export function Badge({ value, alert = false, className = '' }: BadgeProps) {
  const classes = ['badge', className, alert ? 'show' : ''].filter(Boolean).join(' ');
  return <span className={classes}>{value}</span>;
}
