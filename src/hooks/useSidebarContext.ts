import SidebarContext from '@/contexts/SidebarContext';
import { useContext } from 'react';

export default function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (context === null) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }

  return context;
}
