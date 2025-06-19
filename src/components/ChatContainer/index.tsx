import { useChatStore, useMessageStore } from '@/stores';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import Chat from './Chat';
import ChatFormContainer from './ChatFormContainer';

export default function ChatContainer() {
  const { currentChatId, isChatStarted } = useChatStore();
  const { loadMessagesForChat, clearMessages } = useMessageStore();

  const previousChatIdRef = useRef<string | null>(null);

  // Load messages when current chat changes
  useEffect(() => {
    if (currentChatId) {
      // Only load messages if this is an existing chat (not a newly created one)
      // If previousChatId was null and currentChatId is set, it's likely a new chat
      if (previousChatIdRef.current !== null) {
        void loadMessagesForChat(currentChatId);
      }
    } else {
      clearMessages();
    }
    previousChatIdRef.current = currentChatId;
  }, [currentChatId, loadMessagesForChat, clearMessages]);

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
      <ChatFormContainer />
    </main>
  );
}
