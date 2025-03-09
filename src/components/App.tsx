import { useState } from 'react';
import clsx from 'clsx';
import Sidebar from './Sidebar';
import Header from './Header';
import Chat from './Chat';
import ChatFormContainer from './ChatFormContainer';
import type { Message } from '@shared/types';

export default function App() {
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      <div className="flex flex-1 flex-col p-4 pb-0 transition-all duration-500 ease-in-out">
        <Header isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />

        <main
          className={clsx(
            'flex w-full flex-1 transform flex-col items-center justify-end overflow-hidden transition-transform duration-500 ease-in-out',
            isChatStarted ? 'mt-0 translate-y-0' : 'mt-20 -translate-y-1/2',
          )}
        >
          {isChatStarted && <Chat messages={messages} />}
          <ChatFormContainer
            isChatStarted={isChatStarted}
            setIsChatStarted={setIsChatStarted}
            messages={messages}
            setMessages={setMessages}
          />
        </main>
      </div>
    </div>
  );
}
