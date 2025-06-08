import { create } from 'zustand';

export interface HealthStatus {
  ok: boolean;
  message: string;
}

interface HealthState {
  healthStatus: HealthStatus;
  setHealthStatus: (status: HealthStatus) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  healthStatus: {
    ok: false,
    message: 'Checking Ollama connection...',
  },
  setHealthStatus: (status: HealthStatus) => set({ healthStatus: status }),
}));
