import Modal from '../ui/Modal';
import useSettingsModalContext from '@/hooks/useSettingsModalContext';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import ThemeSettings from './ThemeSettings';

export default function SettingsModal() {
  const { isOpen, closeModal } = useSettingsModalContext();
  const { updateAlertMessage } = useAlertMessageContext();

  // TODO: Add Ollama URL input
  const updateOllamaUrl = async (url: string) => {
    try {
      const status = await window.electronApi.setOllamaUrl(url);

      if (status.ok) {
        updateAlertMessage({
          message: 'Ollama URL updated successfully.',
          type: 'success',
        });
      }
    } catch (error) {
      updateAlertMessage({
        message: 'An unexpected error occurred while updating the Ollama URL.',
        type: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Settings">
      <div className="flex flex-col gap-4">
        <ThemeSettings />

        <div className="flex items-center justify-between">
          <h3>Ollama URL</h3>
          <button
            onClick={() => void updateOllamaUrl('http://localhost:11434')}
          >
            Set Ollama URL
          </button>
        </div>
      </div>
    </Modal>
  );
}
