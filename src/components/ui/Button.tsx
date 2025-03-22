import clsx from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
  title?: string;
}

export default function Button({
  type = 'button',
  className,
  onClick,
  children,
  'aria-label': ariaLabel,
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-lg p-1 hover:bg-neutral-300 focus:outline-none focus-visible:ring dark:hover:bg-neutral-600',
        className,
      )}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </button>
  );
}
