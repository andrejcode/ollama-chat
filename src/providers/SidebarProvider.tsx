import SidebarContext from '@/contexts/SidebarContext';
import useElectronStore from '@/hooks/useElectronStore';

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { value: isSidebarOpen, updateValue } =
    useElectronStore('isSidebarOpen');

  const closeSidebar = () => {
    void updateValue(false);
  };

  const openSidebar = () => {
    void updateValue(true);
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
