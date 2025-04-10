import Modal from './ui/Modal';
import useSettingsModalContext from '@/hooks/useSettingsModalContext';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';

export default function SettingsModal() {
  const { isOpen, closeModal } = useSettingsModalContext();
  const { updateAlertMessage } = useAlertMessageContext();

  const setThemeDark = async () => {
    await window.electronApi.setThemeDark();
  };

  const setThemeLight = async () => {
    await window.electronApi.setThemeLight();
  };

  const setThemeSystem = async () => {
    await window.electronApi.setThemeSystem();
  };

  // TODO: Add Ollama URL input
  const updateOllamaUrl = async (url: string) => {
    try {
      const status = await window.electronApi.setOllamaUrl(url);

      if (!status.ok) {
        updateAlertMessage({
          message: status.message,
          type: 'error',
        });
      } else {
        updateAlertMessage({
          message: 'Ollama URL updated successfully.',
          type: 'success',
        });
      }
    } catch (error) {
      updateAlertMessage({
        message: 'Failed to update Ollama URL',
        type: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Settings">
      <div>
        <h3>Theme</h3>
        <div className="flex gap-2">
          <button onClick={() => void setThemeDark()}>Dark</button>
          <button onClick={() => void setThemeLight()}>Light</button>
          <button onClick={() => void setThemeSystem()}>System</button>
        </div>

        <h3>Url</h3>
        <button onClick={() => void updateOllamaUrl('http://localhost:11434')}>
          Set Ollama URL
        </button>
      </div>
    </Modal>
  );
}
