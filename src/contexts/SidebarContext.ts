import { createContext } from 'react';

interface SidebarContextType {
  isSidebarOpen: boolean | null;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export default SidebarContext;
