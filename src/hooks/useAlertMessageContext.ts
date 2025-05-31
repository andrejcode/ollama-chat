import AlertMessageContext from '@/contexts/AlertMessageContext';
import { useContext } from 'react';

export default function useAlertMessageContext() {
  const context = useContext(AlertMessageContext);

  if (context === null) {
    throw new Error(
      'useAlertMessageContext must be used within an AlertMessageProvider',
    );
  }

  return context;
}
