import { useCallback, useState } from 'react';
import AlertMessageContext, {
  AlertMessage,
} from '@/contexts/AlertMessageContext';

export default function AlertMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  const updateAlertMessage = useCallback((alertMessage: AlertMessage) => {
    setAlertMessage(alertMessage);
  }, []);

  const clearAlertMessage = () => {
    setAlertMessage(null);
  };

  return (
    <AlertMessageContext.Provider
      value={{ alertMessage, updateAlertMessage, clearAlertMessage }}
    >
      {children}
    </AlertMessageContext.Provider>
  );
}
