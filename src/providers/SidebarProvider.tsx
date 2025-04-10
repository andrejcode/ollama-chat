import SidebarContext from '@/contexts/SidebarContext';
import { useEffect, useState } from 'react';

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const getInitialSidebarState = async () => {
      const sidebarState = await window.electronApi.getSidebarState();
      setIsSidebarOpen(sidebarState);
    };

    void getInitialSidebarState();
  }, []);

  const closeSidebar = () => {
    void window.electronApi.setSidebarState(false);
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    void window.electronApi.setSidebarState(true);
    setIsSidebarOpen(true);
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
