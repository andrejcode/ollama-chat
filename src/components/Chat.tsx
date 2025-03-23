import type { Message } from '@shared/types';
import ChatMessage from './ChatMessage';
import { getLastAssistantMessageIndex } from '@/utils';

interface ChatProps {
  messages: Message[];
  isLoadingAssistantMessage: boolean;
}

export default function Chat({
  messages,
  isLoadingAssistantMessage,
}: ChatProps) {
  return (
    <div className="h-full w-full overflow-auto">
      <section
        className="mx-auto my-4 flex max-w-4xl flex-col"
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
        })}
      </section>
    </div>
  );
}
