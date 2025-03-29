import clsx from 'clsx';
import Sidebar from './ui/Sidebar';
import Header from './Header';
import Chat from './Chat';
import ChatFormContainer from './ChatFormContainer';
import Alert from './ui/Alert';
import useError from '@/hooks/useError';
import useChat from '@/hooks/useChat';

export default function App() {
  const { isChatStarted, startChat } = useChat();
  const { errorMessage, clearErrorMessage, updateErrorMessage } = useError();

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      <Sidebar />

      <div className="relative flex flex-1 flex-col p-4 pb-0 transition-all duration-500 ease-in-out">
        <Header />

        <main
          className={clsx(
            'flex w-full flex-1 transform flex-col items-center justify-end overflow-hidden transition-transform duration-500 ease-in-out',
            isChatStarted ? 'mt-0 translate-y-0' : 'mt-20 -translate-y-1/2',
          )}
        >
          {isChatStarted && <Chat />}
          <ChatFormContainer
            isChatStarted={isChatStarted}
            startChat={startChat}
            clearErrorMessage={clearErrorMessage}
            updateErrorMessage={updateErrorMessage}
          />
        </main>

        <Alert
          message={errorMessage}
          clearMessage={clearErrorMessage}
          variant="error"
          className="absolute top-0 right-0 left-0 z-50 mx-4 mt-18 w-auto sm:mx-auto sm:w-[90%] md:w-[80%] lg:w-[70%]"
        />
      </div>
    </div>
  );
}
