import { create } from 'zustand';

interface SidebarState {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen:
    typeof window !== 'undefined' && window.electronApi
      ? window.electronApi.getSidebarState()
      : true,

  closeSidebar: () => {
    if (typeof window !== 'undefined' && window.electronApi) {
      void window.electronApi.setSidebarState(false);
    }
    set({ isSidebarOpen: false });
  },

  openSidebar: () => {
    if (typeof window !== 'undefined' && window.electronApi) {
      void window.electronApi.setSidebarState(true);
    }
    set({ isSidebarOpen: true });
  },
}));
