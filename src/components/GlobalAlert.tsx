import { useAlertMessageStore } from '@/stores';
import Alert from './ui/Alert';

export default function GlobalAlert() {
  const { alertMessage, clearAlertMessage } = useAlertMessageStore();

  if (!alertMessage) return null;

  return (
    <Alert
      message={alertMessage.message}
      onDismiss={clearAlertMessage}
      variant={alertMessage.type}
      className="absolute top-0 right-0 left-0 z-50 mx-4 mt-18 w-auto sm:mx-auto sm:w-[90%] md:w-[80%] lg:w-[70%]"
    />
  );
}
