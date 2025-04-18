import Modal from '../ui/Modal';
import ThemeSettings from './ThemeSettings';
import OllamaUrlSettings from './OllamaUrlSettings';
import useSettingsModalContext from '@/hooks/useSettingsModalContext';

export default function SettingsModal() {
  const { isOpen, closeModal } = useSettingsModalContext();

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Settings">
      <div className="flex flex-col gap-4">
        <ThemeSettings />
        <OllamaUrlSettings />
      </div>
    </Modal>
  );
}
