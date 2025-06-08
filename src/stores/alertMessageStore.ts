import { create } from 'zustand';

type AlertMessageType = 'error' | 'success';

export interface AlertMessage {
  message: string;
  type: AlertMessageType;
}

interface AlertMessageState {
  alertMessage: AlertMessage | null;
  updateAlertMessage: (alertMessage: AlertMessage) => void;
  clearAlertMessage: () => void;
}

export const useAlertMessageStore = create<AlertMessageState>((set) => ({
  alertMessage: null,
  updateAlertMessage: (alertMessage: AlertMessage) => set({ alertMessage }),
  clearAlertMessage: () => set({ alertMessage: null }),
}));
