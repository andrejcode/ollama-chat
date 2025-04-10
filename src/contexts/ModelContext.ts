import { createContext } from 'react';
import { Model } from '@shared/types';

interface ModelContextType {
  isLoading: boolean;
  models: Model[] | null;
  currentModel: string | null;
  updateCurrentModel: (modelName: string) => void;
}

const ModelContext = createContext<ModelContextType | null>(null);

export default ModelContext;
