import useChat from '@/hooks/useChat';
import clsx from 'clsx';
import Chat from './Chat';
import ChatFormContainer from './ChatFormContainer';

export default function ChatContainer() {
  const { isChatStarted, startChat } = useChat();

  return (
    <main
      className={clsx(
        'flex w-full flex-1 transform flex-col items-center overflow-hidden px-4 transition-transform duration-500 ease-in-out',
        isChatStarted
          ? 'mt-0 translate-y-0'
          : 'mt-20 -translate-y-1/2 justify-end',
      )}
    >
      {isChatStarted && <Chat />}
      <ChatFormContainer
        isChatStarted={isChatStarted}
        onChatStart={startChat}
      />
    </main>
  );
}
