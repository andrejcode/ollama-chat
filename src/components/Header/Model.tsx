import { useState } from 'react';
import useModelContext from '@/hooks/useModelContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import {
  ChevronDown as ChevronIcon,
  RotateCcw as RotateIcon,
} from 'lucide-react';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import clsx from 'clsx';

export default function Model() {
  const [isReloading, setIsReloading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { isLoading, currentModel, models, updateCurrentModel } =
    useModelContext();
  const { updateAlertMessage } = useAlertMessageContext();

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await window.electronApi.checkOllamaHealth();
    } catch (error) {
      updateAlertMessage({
        message: 'An unexpected error occurred while trying to reload.',
        type: 'error',
      });
    } finally {
      setTimeout(() => {
        setIsReloading(false);
      }, 1000);
    }
  };

  const handleModelSelect = (modelName: string) => {
    updateCurrentModel(modelName);
    setShowDropdown(false);
  };

  if (isLoading) {
    return (
      <Button disabled>
        <LoadingSpinner isLoading={true} />
      </Button>
    );
  }

  if (isReloading) {
    return (
      <Button disabled>
        <RotateIcon className="animate-spin-once" />
      </Button>
    );
  }

  return currentModel && models ? (
    <div className="relative inline-block">
      <Button onClick={() => setShowDropdown((prev) => !prev)}>
        <div className="flex items-center justify-center gap-1 px-2">
          <div className="text-lg">{currentModel}</div>
          <ChevronIcon
            className={clsx(
              'transition-transform duration-200',
              showDropdown && 'rotate-180',
            )}
          />
        </div>
      </Button>
      <ul
        className={clsx(
          'absolute top-full left-0 z-10 mt-2 rounded-2xl bg-neutral-50 p-2 shadow transition-opacity duration-200 dark:bg-neutral-700',
          showDropdown
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        {models.map((model) => (
          <li key={model.name} className="flex items-center">
            <Button
              className="w-full text-left"
              onClick={() => handleModelSelect(model.name)}
            >
              <div className="px-2 py-1">{model.name}</div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <Button onClick={() => void handleReload()}>
      <RotateIcon />
    </Button>
  );
}
