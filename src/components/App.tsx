import Sidebar from './ui/Sidebar';
import Header from './Header';
import GlobalAlert from './GlobalAlert';
import ChatContainer from './ChatContainer';
import SettingsModal from './SettingsModal';

export default function App() {
  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      <Sidebar />

      <div className="relative flex flex-1 flex-col p-4 pb-0 transition-all duration-500 ease-in-out">
        <Header />
        <ChatContainer />
        <GlobalAlert />
        <SettingsModal />
      </div>
    </div>
  );
}
