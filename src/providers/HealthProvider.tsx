import HealthContext from '@/contexts/HealthContext';
import { useAlertMessageStore } from '@/stores';
import { useEffect, useState } from 'react';

export default function HealthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [healthStatus, setHealthStatus] = useState({
    ok: false,
    message: 'Checking Ollama connection...',
  });

  const updateAlertMessage = useAlertMessageStore(
    (state) => state.updateAlertMessage,
  );

  useEffect(() => {
    // Load the stored health status
    window.electronApi
      .getHealthStatus()
      .then((status) => {
        if (status) {
          setHealthStatus(status);

          // Show an error message if a health check failed
          if (!status.ok) {
            updateAlertMessage({
              message: status.message,
              type: 'error',
            });
          }
        }
      })
      .catch((error) => {
        console.error('Failed to retrieve health status:', error);
      });

    // Listen for future health status updates
    const removeHealthListener = window.electronApi.onOllamaHealthStatus(
      (status) => {
        setHealthStatus(status);

        if (!status.ok) {
          updateAlertMessage({
            message: status.message,
            type: 'error',
          });
        }
      },
    );

    return () => {
      removeHealthListener();
    };
  }, [updateAlertMessage]);

  return (
    <HealthContext.Provider value={{ healthStatus }}>
      {children}
    </HealthContext.Provider>
  );
}
