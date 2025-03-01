import { useCallback, useState } from 'react';
import clsx from 'clsx';
import WelcomeTitle from './WelcomeTitle';
import LoadingSpinner from './LoadingSpinner';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatForm from './ChatForm';
import ErrorAlert from './ErrorAlert';

export default function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sendPromptToOllama = useCallback((prompt: string) => {
    setMarkdown('');
    setErrorMessage('');
    setIsLoading(true);

    window.electronApi.sendPrompt(prompt);

    let markdownBuffer = '';
    let firstChunkReceived = false;

    window.electronApi.onStreamResponse((chunk: string) => {
      if (!firstChunkReceived) {
        setIsLoading(false);
        firstChunkReceived = true;
      }

      markdownBuffer += chunk;
      setMarkdown(markdownBuffer);
    });

    window.electronApi.onStreamError((error: string) => {
      setIsLoading(false);
      setErrorMessage(error);
    });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userInput.trim()) {
      sendPromptToOllama(userInput);
      setUserInput('');
      setIsChatStarted(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      <div className="flex flex-1 flex-col p-4 transition-all duration-500 ease-in-out">
        <Header isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />

        <main
          className={clsx(
            'mx-auto flex w-full max-w-2xl flex-1 transform flex-col items-center justify-end transition-transform duration-500 ease-in-out',
            isChatStarted ? 'mt-0 translate-y-0' : 'mt-20 -translate-y-1/2',
          )}
        >
          {isChatStarted && (
            <section className="my-4 self-start">{markdown}</section>
          )}

          {errorMessage && (
            <ErrorAlert errorMessage={errorMessage} className="self-start" />
          )}

          <WelcomeTitle isChatStarted={isChatStarted} />
          <LoadingSpinner isLoading={isLoading} />
          <ChatForm
            userInput={userInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
        </main>
      </div>
    </div>
  );
}
