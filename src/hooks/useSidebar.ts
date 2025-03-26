import { useState } from 'react';

export default function useSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return { isSidebarOpen, openSidebar, closeSidebar };
}
