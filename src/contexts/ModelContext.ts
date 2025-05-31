import { Model } from '@shared/types';
import { createContext } from 'react';

interface ModelContextType {
  isLoading: boolean;
  models: Model[] | null;
  currentModel: string | null;
  updateCurrentModel: (modelName: string) => void;
}

const ModelContext = createContext<ModelContextType | null>(null);

export default ModelContext;
