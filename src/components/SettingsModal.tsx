import useSettingsModalContext from '@/hooks/useSettingsModalContext';
import Modal from './ui/Modal';

export default function SettingsModal() {
  const { isOpen, closeModal } = useSettingsModalContext();

  const setThemeDark = async () => {
    await window.electronApi.setThemeDark();
  };

  const setThemeLight = async () => {
    await window.electronApi.setThemeLight();
  };

  const setThemeSystem = async () => {
    await window.electronApi.setThemeSystem();
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
      </div>
    </Modal>
  );
}
