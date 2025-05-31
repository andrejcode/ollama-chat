import ModelContext from '@/contexts/ModelContext';
import { useContext } from 'react';

export default function useModelContext() {
  const context = useContext(ModelContext);

  if (!context) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }

  return context;
}
