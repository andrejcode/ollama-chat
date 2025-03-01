import { PanelLeft } from 'lucide-react';
import Button from './Button';
import clsx from 'clsx';

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, closeSidebar }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'h-full overflow-hidden bg-neutral-100 transition-all duration-500 ease-in-out dark:bg-neutral-900',
        isSidebarOpen ? 'w-80' : 'w-0',
      )}
    >
      <div className="p-4">
        <Button onClick={() => closeSidebar()}>
          <PanelLeft />
        </Button>
      </div>
    </aside>
  );
}
