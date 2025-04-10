import { createContext } from 'react';

interface HealthContextType {
  healthStatus: {
    ok: boolean;
    message: string;
  };
}

const HealthContext = createContext<HealthContextType | null>(null);

export default HealthContext;
