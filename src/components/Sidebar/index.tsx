import { useSidebarStore } from '@/stores';
import clsx from 'clsx';
import NewChatButton from '../NewChatButton';
import SidebarButton from '../SidebarButton';
import ChatList from './ChatList';

export default function Sidebar() {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  return (
    <aside
      className={clsx(
        'flex h-full flex-col overflow-hidden bg-neutral-100 transition-all duration-500 ease-in-out dark:bg-neutral-900',
        isSidebarOpen ? 'w-80' : 'w-0',
      )}
    >
      <div className="flex h-16 w-80 flex-shrink-0 items-center justify-between px-4">
        <SidebarButton showOnlyWhenClosed={false} />
        <NewChatButton showOnlyWhenSidebarIsClosed={false} />
      </div>

      <div className="min-h-0 w-80 flex-1">
        <ChatList />
      </div>
    </aside>
  );
}
