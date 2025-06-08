import { useAlertMessageStore, useHealthStore } from '@/stores';
import { useEffect } from 'react';

export default function useHealthInit() {
  useEffect(() => {
    const setHealthStatus = useHealthStore.getState().setHealthStatus;
    const updateAlertMessage =
      useAlertMessageStore.getState().updateAlertMessage;

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
  }, []);
}
