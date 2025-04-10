import { useState, useEffect } from 'react';
import type { Model } from '@shared/types';
import ModelContext from '@/contexts/ModelContext';

export default function ModelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [models, setModels] = useState<Model[]>([]);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedModels = await window.electronApi.getModels();
        const fetchedCurrentModel = await window.electronApi.getCurrentModel();

        setModels(fetchedModels || []);
        setCurrentModel(fetchedCurrentModel || null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchInitialData();

    const removeModelListener = window.electronApi.onModelsUpdated(
      (updatedModels) => {
        setModels(updatedModels || []);
      },
    );

    const removeCurrentModelListener = window.electronApi.onCurrentModelChanged(
      (modelName) => {
        setCurrentModel(modelName);
      },
    );

    return () => {
      removeModelListener();
      removeCurrentModelListener();
    };
  }, []);

  const updateCurrentModel = async (modelName: string) => {
    const result = await window.electronApi.setCurrentModel(modelName);
    if (result) {
      setCurrentModel(modelName);
    }
    return result;
  };

  const value = {
    isLoading,
    models,
    currentModel,
    updateCurrentModel,
  };

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}
