import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  const [showLoadingSpinner, setShowLoadingSpinner] =
    useState<boolean>(isLoading);
  const [fadeClass, setFadeClass] = useState<string>('opacity-0');

  useEffect(() => {
    if (isLoading) {
      setShowLoadingSpinner(true);
      // Small delay for the initial 'opacity-0' to be applied
      const timeout = setTimeout(() => {
        setFadeClass('opacity-100');
      }, 10);

      return () => clearTimeout(timeout);
    } else {
      setFadeClass('opacity-0');
      const timeout = setTimeout(() => setShowLoadingSpinner(false), 500);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    showLoadingSpinner && (
      <LoaderCircle
        className={clsx(
          'mb-4 animate-spin self-start transition-opacity duration-500 ease-in-out',
          fadeClass,
        )}
      />
    )
  );
}
