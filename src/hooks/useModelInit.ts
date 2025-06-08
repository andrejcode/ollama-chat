import { useModelStore } from '@/stores';
import { useEffect } from 'react';

export default function useModelInit() {
  useEffect(() => {
    const setModels = useModelStore.getState().setModels;
    const setCurrentModel = useModelStore.getState().setCurrentModel;
    const setIsLoading = useModelStore.getState().setIsLoading;

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
}
