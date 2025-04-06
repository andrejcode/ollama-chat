import clsx from 'clsx';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import useSettingsModalContext from '@/hooks/useSettingsModalContext';

export default function SettingsButton() {
  const [isSpinning, setIsSpinning] = useState(false);

  const { openModal } = useSettingsModalContext();

  const handleClick = () => {
    setIsSpinning(true);
    openModal();

    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <Button onClick={handleClick}>
      <Settings className={clsx(isSpinning && 'animate-spin-once')} />
    </Button>
  );
}
