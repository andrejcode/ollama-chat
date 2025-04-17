import { createPortal } from 'react-dom';
import Button from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-900/80" />

      <div
        className="z-40 w-xl rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-800 shadow-lg dark:border-none dark:bg-neutral-700 dark:text-neutral-100"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl">{title}</h2>
          <Button onClick={onClose} title="Close modal">
            <X />
          </Button>
        </div>
        <hr className="my-4 border-neutral-200 dark:border-neutral-500" />

        {children}
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement,
  );
}
