import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  isLoading: boolean;
  className?: string;
}

export default function LoadingSpinner({
  isLoading,
  className,
}: LoadingSpinnerProps) {
  const [fadeClass, setFadeClass] = useState<'opacity-0' | 'opacity-100'>(
    'opacity-0',
  );

  useEffect(() => {
    if (isLoading) {
      // Small delay for the initial 'opacity-0' to be applied
      const timeout = setTimeout(() => {
        setFadeClass('opacity-100');
      }, 10);

      return () => clearTimeout(timeout);
    } else {
      setFadeClass('opacity-0');
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <LoaderCircle
      className={clsx(
        'mb-4 animate-spin transition-opacity duration-500 ease-in-out',
        fadeClass,
        className,
      )}
    />
  );
}
