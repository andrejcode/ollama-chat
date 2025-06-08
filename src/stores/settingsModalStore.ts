import { create } from 'zustand';

interface SettingsModalState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
