import useSidebarContext from '@/hooks/useSidebarContext';
import Button from '../ui/Button';
import { PanelLeft } from 'lucide-react';

export default function SidebarButton() {
  const { isSidebarOpen, openSidebar } = useSidebarContext();

  return (
    !isSidebarOpen && (
      <Button onClick={() => openSidebar()}>
        <PanelLeft />
      </Button>
    )
  );
}
