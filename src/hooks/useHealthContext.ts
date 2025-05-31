import HealthContext from '@/contexts/HealthContext';
import { useContext } from 'react';

export default function useHealthContext() {
  const context = useContext(HealthContext);

  if (!context) {
    throw new Error('useHealthContext must be used within a HealthProvider');
  }

  return context;
}
