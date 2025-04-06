import { createContext } from 'react';

interface SettingsModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextType | null>(
  null,
);

export default SettingsModalContext;
