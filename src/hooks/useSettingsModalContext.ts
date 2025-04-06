import { useContext } from 'react';
import SettingsModalContext from '@/contexts/SettingsModalContext';

export default function useSettingsModalContext() {
  const context = useContext(SettingsModalContext);

  if (context === null) {
    throw new Error(
      'useSettingsModalContext must be used within a SettingsModalProvider',
    );
  }

  return context;
}
