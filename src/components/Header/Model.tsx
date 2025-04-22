import clsx from 'clsx';
import { useState } from 'react';
import { RotateCcw as RotateIcon } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import ChevronToggleButton from '../ChevronToggleButton';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import useModelContext from '@/hooks/useModelContext';

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

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
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
      <ChevronToggleButton
        buttonText={currentModel}
        textClassName="text-lg"
        isOpen={showDropdown}
        onToggle={handleDropdownToggle}
      />
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
