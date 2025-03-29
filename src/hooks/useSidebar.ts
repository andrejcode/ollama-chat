import { useCallback } from 'react';
import useStore from './useStore';

export default function useSidebar() {
  const { value: isSidebarOpen, updateValue: setSidebarOpen } = useStore(
    'isSidebarOpen',
    true, // default value
  );

  const openSidebar = useCallback(() => {
    void setSidebarOpen(true);
  }, [setSidebarOpen]);

  const closeSidebar = useCallback(() => {
    void setSidebarOpen(false);
  }, [setSidebarOpen]);

  return {
    isSidebarOpen: isSidebarOpen ?? true,
    openSidebar,
    closeSidebar,
  };
}
