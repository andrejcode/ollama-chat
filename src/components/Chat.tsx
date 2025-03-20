import type { Message } from '@shared/types';
import ChatMessage from './ChatMessage';

interface ChatProps {
  messages: Message[];
  isLoadingAssistantMessage: boolean;
}

export default function Chat({
  messages,
  isLoadingAssistantMessage,
}: ChatProps) {
  const lastAssistantMessageIndex =
    messages.length > 0
      ? messages.map((message) => message.role).lastIndexOf('assistant')
      : -1;

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
            const isLastAssistantMessage = index === lastAssistantMessageIndex;
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
