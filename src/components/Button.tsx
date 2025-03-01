import clsx from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({
  type = 'button',
  className,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-lg p-1 hover:bg-neutral-300 focus:outline-none focus-visible:ring dark:hover:bg-neutral-600',
        className,
      )}
    >
      {children}
    </button>
  );
}
