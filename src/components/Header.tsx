import { PanelLeft, Settings } from 'lucide-react';
import Button from './ui/Button';

interface HeaderProps {
  isSidebarOpen: boolean;
  openSidebar: () => void;
}

export default function Header({ isSidebarOpen, openSidebar }: HeaderProps) {
  return (
    <header className="z-10 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <Button onClick={() => openSidebar()}>
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
