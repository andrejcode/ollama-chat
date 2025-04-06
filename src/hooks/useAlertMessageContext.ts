import { useContext } from 'react';
import AlertMessageContext from '@/contexts/AlertMessageContext';

export default function useAlertMessageContext() {
  const context = useContext(AlertMessageContext);

  if (context === null) {
    throw new Error(
      'useAlertMessageContext must be used within an AlertMessageProvider',
    );
  }

  return context;
}
