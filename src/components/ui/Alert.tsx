import clsx from 'clsx';
import { CheckCircle, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertProps {
  message: string | null;
  onDismiss: () => void;
  variant: 'error' | 'success';
  className?: string;
}

export default function Alert({
  message,
  variant,
  className,
  onDismiss,
}: AlertProps) {
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const [fadeClass, setFadeClass] = useState<'opacity-0' | 'opacity-100'>(
    'opacity-0',
  );

  useEffect(() => {
    if (message) {
      setShowAlert(true);

      const timeout = setTimeout(() => {
        setFadeClass('opacity-100');
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleClose = () => {
    setFadeClass('opacity-0');

    setTimeout(() => {
      onDismiss();
      setShowAlert(false);
    }, 500);
  };

  const renderIcon = () => {
    if (variant === 'error') {
      return (
        <XCircle
          className="mr-2 text-red-800"
          aria-label="Error"
          data-testid="error-icon"
        />
      );
    } else {
      return (
        <CheckCircle
          className="mr-2 text-green-800"
          aria-label="Success"
          data-testid="success-icon"
        />
      );
    }
  };

  return (
    showAlert &&
    message && (
      <div
        className={clsx(
          'flex items-center rounded-2xl border-2 p-4 shadow-lg transition-opacity duration-500 ease-in-out',
          variant === 'error'
            ? 'border-red-800 bg-red-100 text-red-800'
            : 'border-green-800 bg-green-100 text-green-800',
          fadeClass,
          className,
        )}
      >
        {renderIcon()}
        <span className="flex-1">{message}</span>
        <button
          type="button"
          onClick={handleClose}
          className="ml-auto cursor-pointer"
          aria-label="Close alert"
          title="Close alert"
        >
          <X />
        </button>
      </div>
    )
  );
}
