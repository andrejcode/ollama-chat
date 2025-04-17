import clsx from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
  title?: string;
  disabled?: boolean;
}

export default function Button({
  type = 'button',
  className,
  onClick,
  children,
  'aria-label': ariaLabel,
  title,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'rounded-lg p-1 transition-colors duration-200 hover:bg-neutral-300 focus:outline-none focus-visible:ring dark:hover:bg-neutral-600',
        disabled ? 'cursor-default' : 'cursor-pointer',
        className,
      )}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
