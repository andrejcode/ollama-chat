import clsx from 'clsx';
import Chat from './Chat';
import ChatFormContainer from './ChatFormContainer';
import useChat from '@/hooks/useChat';

export default function ChatContainer() {
  const { isChatStarted, startChat } = useChat();

  return (
    <main
      className={clsx(
        'flex w-full flex-1 transform flex-col items-center justify-end overflow-hidden transition-transform duration-500 ease-in-out',
        isChatStarted ? 'mt-0 translate-y-0' : 'mt-20 -translate-y-1/2',
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
