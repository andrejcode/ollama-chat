import useSidebarContext from '@/hooks/useSidebarContext';
import { PanelLeft } from 'lucide-react';
import Button from '../ui/Button';

interface SidebarButtonProps {
  showOnlyWhenClosed?: boolean;
}

export default function SidebarButton({
  showOnlyWhenClosed = true,
}: SidebarButtonProps) {
  const { isSidebarOpen, openSidebar, closeSidebar } = useSidebarContext();

  const handleClick = () => {
    if (isSidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  if (showOnlyWhenClosed && isSidebarOpen) {
    return null;
  }

  return (
    <Button onClick={handleClick}>
      <PanelLeft />
    </Button>
  );
}
