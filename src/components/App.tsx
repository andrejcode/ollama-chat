import useChatInit from '@/hooks/useChatInit';
import useHealthInit from '@/hooks/useHealthInit';
import useModelInit from '@/hooks/useModelInit';
import { useChatStore } from '@/stores';
import clsx from 'clsx';
import ChatContainer from './ChatContainer';
import GlobalAlert from './GlobalAlert';
import Header from './Header';
import SettingsModal from './SettingsModal';
import Sidebar from './Sidebar';
import LoadingSpinner from './ui/LoadingSpinner';

export default function App() {
  useHealthInit();
  useModelInit();
  useChatInit();

  const isLoading = useChatStore((state) => state.isLoading);

  const renderLoadingState = () => <LoadingSpinner isLoading={isLoading} />;

  const renderMainContent = () => (
    <>
      <Sidebar />
      <div className="relative flex flex-1 flex-col transition-all duration-500 ease-in-out">
        <Header />
        <ChatContainer />
        <GlobalAlert />
        <SettingsModal />
      </div>
    </>
  );

  return (
    <div
      className={clsx(
        'flex h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100',
        isLoading && 'items-center justify-center',
      )}
    >
      {isLoading ? renderLoadingState() : renderMainContent()}
    </div>
  );
}
