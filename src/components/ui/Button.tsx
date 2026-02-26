import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'success' | 'warn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  small?: boolean;
  iconOnly?: boolean;
  full?: boolean;
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = 'ghost',
  small,
  iconOnly,
  full,
  loading,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    small ? 'btn-sm' : '',
    iconOnly ? 'btn-icon' : '',
    full ? 'btn-full' : '',
    loading ? 'loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
