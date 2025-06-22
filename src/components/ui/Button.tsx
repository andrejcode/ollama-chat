import type { AriaHasPopup } from '@/types';
import clsx from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-haspopup'?: AriaHasPopup;
  'aria-expanded'?: boolean;
  title?: string;
  disabled?: boolean;
}

export default function Button({
  type = 'button',
  className,
  onClick,
  children,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHasPopup,
  'aria-expanded': ariaExpanded,
  title,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'rounded-lg p-1 transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500',
        'hover:bg-neutral-300 dark:hover:bg-neutral-600',
        disabled ? 'cursor-default' : 'cursor-pointer',
        className,
      )}
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
