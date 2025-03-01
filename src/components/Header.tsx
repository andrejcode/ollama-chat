import { PanelLeft, Settings } from 'lucide-react';
import Button from './Button';

interface HeaderProps {
  isSidebarOpen: boolean;
  openSidebar: () => void;
}

export default function Header({ isSidebarOpen, openSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <Button onClick={openSidebar}>
            <PanelLeft />
          </Button>
        )}
        <div>Model</div>
      </div>
      <Button>
        <Settings />
      </Button>
    </header>
  );
}
