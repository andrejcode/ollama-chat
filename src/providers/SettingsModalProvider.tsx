import { useState } from 'react';
import SettingsModalContext from '@/contexts/SettingsModalContext';

export default function SettingsModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <SettingsModalContext.Provider
      value={{ isOpen: isModalOpen, openModal, closeModal }}
    >
      {children}
    </SettingsModalContext.Provider>
  );
}
