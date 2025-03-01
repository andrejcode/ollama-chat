import clsx from 'clsx';
import { XCircle } from 'lucide-react';

interface ErrorAlertProps {
  errorMessage: string;
  className?: string;
}

export default function ErrorAlert({
  errorMessage,
  className,
}: ErrorAlertProps) {
  return (
    <div
      className={clsx(
        'my-4 flex items-center rounded-2xl border-2 border-red-800 bg-red-100 p-4 text-red-800 shadow-lg',
        className,
      )}
    >
      <XCircle className="mr-2 text-red-500" />
      <span>{errorMessage}</span>
    </div>
  );
}
