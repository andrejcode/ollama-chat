import type { Model } from '@shared/types';
import { create } from 'zustand';

interface ModelState {
  isLoading: boolean;
  models: Model[];
  currentModel: string | null;
  setModels: (models: Model[]) => void;
  setCurrentModel: (modelName: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateCurrentModel: (modelName: string) => Promise<boolean>;
}

export const useModelStore = create<ModelState>((set) => ({
  isLoading: true,
  models: [],
  currentModel: null,

  setModels: (models: Model[]) => set({ models }),

  setCurrentModel: (modelName: string | null) =>
    set({ currentModel: modelName }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  updateCurrentModel: async (modelName: string) => {
    const result = await window.electronApi.setCurrentModel(modelName);
    if (result) {
      set({ currentModel: modelName });
    }
    return result;
  },
}));
