import useSidebarContext from '@/hooks/useSidebarContext';
import { PanelLeft } from 'lucide-react';
import Button from '../ui/Button';

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
