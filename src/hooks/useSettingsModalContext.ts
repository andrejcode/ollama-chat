import SettingsModalContext from '@/contexts/SettingsModalContext';
import { useContext } from 'react';

export default function useSettingsModalContext() {
  const context = useContext(SettingsModalContext);

  if (context === null) {
    throw new Error(
      'useSettingsModalContext must be used within a SettingsModalProvider',
    );
  }

  return context;
}
