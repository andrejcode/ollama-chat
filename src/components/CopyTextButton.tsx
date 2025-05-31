import Button from '@/components/ui/Button.tsx';
import type { CopyStatus } from '@/types';
import clsx from 'clsx';
import { Check, Copy, X } from 'lucide-react';

interface CopyTextButtonContentProps {
  showCopyText: boolean;
  icon: React.ReactNode;
  text: string;
}

function CopyTextButtonContent({
  showCopyText,
  icon,
  text,
}: CopyTextButtonContentProps) {
  return (
    <div className={clsx('flex items-center', showCopyText && 'gap-1')}>
      {icon}
      <span>{showCopyText && text}</span>
    </div>
  );
}

const renderButtonContent = (copyStatus: CopyStatus, showCopyText: boolean) => {
  if (copyStatus === 'copied') {
    return (
      <CopyTextButtonContent
        showCopyText={showCopyText}
        icon={<Check size={14} />}
        text="Copied"
      />
    );
  } else if (copyStatus === 'error') {
    return (
      <CopyTextButtonContent
        showCopyText={showCopyText}
        icon={<X size={14} />}
        text="Failed"
      />
    );
  } else {
    return (
      <CopyTextButtonContent
        showCopyText={showCopyText}
        icon={<Copy size={14} />}
        text="Copy"
      />
    );
  }
};

interface CopyButtonProps {
  className?: string;
  showCopyText?: boolean;
  copyStatus: CopyStatus;
  onClick: () => void;
}

export default function CopyTextButton({
  className,
  showCopyText = false,
  copyStatus,
  onClick,
}: CopyButtonProps) {
  return (
    <Button
      className={clsx(
        'z-10 rounded text-neutral-800 transition-opacity duration-500 ease-in-out dark:text-neutral-100',
        'focus:outline-none focus-visible:ring',
        className,
      )}
      onClick={onClick}
      aria-label={
        copyStatus === 'copied'
          ? 'Copied to clipboard'
          : copyStatus === 'error'
            ? 'Failed to copy'
            : 'Copy to clipboard'
      }
      title="Copy to clipboard"
    >
      {renderButtonContent(copyStatus, showCopyText)}
    </Button>
  );
}
