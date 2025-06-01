import useSidebarContext from '@/hooks/useSidebarContext';
import clsx from 'clsx';
import SidebarButton from '../Header/SidebarButton';

export default function Sidebar() {
  const { isSidebarOpen } = useSidebarContext();

  return (
    <aside
      className={clsx(
        'h-full overflow-hidden bg-neutral-100 transition-all duration-500 ease-in-out dark:bg-neutral-900',
        isSidebarOpen ? 'w-80' : 'w-0',
      )}
    >
      <div className="flex h-16 items-center px-4">
        <SidebarButton showOnlyWhenClosed={false} />
      </div>
    </aside>
  );
}
