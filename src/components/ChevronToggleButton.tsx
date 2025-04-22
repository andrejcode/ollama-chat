import clsx from 'clsx';
import Button from './ui/Button';
import { ChevronDown as ChevronIcon } from 'lucide-react';

interface ChevronToggleButtonProps {
  buttonText: string;
  textClassName?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChevronToggleButton({
  buttonText,
  textClassName,
  isOpen,
  onToggle,
}: ChevronToggleButtonProps) {
  return (
    <Button
      onClick={onToggle}
      className="border border-neutral-200 dark:border-neutral-700"
    >
      <div className="flex items-center justify-center gap-1 px-2">
        <div className={textClassName}>{buttonText}</div>
        <ChevronIcon
          className={clsx(
            'transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </div>
    </Button>
  );
}
