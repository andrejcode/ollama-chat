import { useSettingsModalStore } from '@/stores';
import Modal from '../ui/Modal';
import OllamaUrlSettings from './OllamaUrlSettings';
import ThemeSettings from './ThemeSettings';

export default function SettingsModal() {
  const isOpen = useSettingsModalStore((state) => state.isModalOpen);
  const closeModal = useSettingsModalStore((state) => state.closeModal);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Settings">
      <div className="flex flex-col gap-4">
        <ThemeSettings />
        <OllamaUrlSettings />
      </div>
    </Modal>
  );
}
