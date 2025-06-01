import useMessageContext from '@/hooks/useMessageContext';
import { getLastAssistantMessageIndex } from '@/utils';
import clsx from 'clsx';
import { ArrowDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';

export default function Chat() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoadingAssistantMessage } = useMessageContext();

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const { scrollTop, clientHeight, scrollHeight } = container;

    const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setShowScrollButton(!atBottom);
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    handleScroll();
  }, [messages, handleScroll]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div ref={chatContainerRef} className="h-full w-full overflow-y-auto">
        <section
          className="mx-auto my-4 flex max-w-4xl flex-col gap-4 px-3"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((message, index) => {
            if (message.role === 'user') {
              return <ChatMessage key={message.id} message={message} />;
            } else if (message.role === 'assistant') {
              const isLastAssistantMessage =
                index === getLastAssistantMessageIndex(messages);
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLoadingAssistantMessage={
                    isLastAssistantMessage && isLoadingAssistantMessage
                  }
                />
              );
            }
            return null;
          })}
        </section>
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          className={clsx(
            'bg-neutral-300 dark:bg-neutral-600',
            'absolute bottom-4 left-1/2 -translate-x-1/2 transform',
            'animate-bounce',
            'cursor-pointer rounded-full p-2 shadow-lg',
            'focus:outline-none focus-visible:ring',
          )}
          aria-label="Scroll to latest message"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}
