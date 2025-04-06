import { createContext } from 'react';

type AlertMessageType = 'error' | 'success';

export interface AlertMessage {
  message: string;
  type: AlertMessageType;
}

interface AlertMessageContextType {
  alertMessage: AlertMessage | null;
  updateAlertMessage: (alertMessage: AlertMessage) => void;
  clearAlertMessage: () => void;
}

const AlertMessageContext = createContext<AlertMessageContextType | null>(null);

export default AlertMessageContext;
