import type { AriaHasPopup } from '@/types';
import clsx from 'clsx';
import { ChevronDown as ChevronIcon } from 'lucide-react';
import Button from './ui/Button';

interface ChevronToggleButtonProps {
  buttonText: string;
  textClassName?: string;
  isOpen: boolean;
  onToggle: () => void;
  'aria-label'?: string;
  'aria-haspopup'?: AriaHasPopup;
  'aria-expanded'?: boolean;
}

export default function ChevronToggleButton({
  buttonText,
  textClassName,
  isOpen,
  onToggle,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHasPopup,
  'aria-expanded': ariaExpanded,
}: ChevronToggleButtonProps) {
  return (
    <Button
      onClick={onToggle}
      className="border border-neutral-200 dark:border-neutral-700"
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
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
