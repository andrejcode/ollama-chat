import ChatMessage from './ChatMessage';
import useMessageContext from '@/hooks/useMessageContext';
import { getLastAssistantMessageIndex } from '@/utils';

export default function Chat() {
  const { messages, isLoadingAssistantMessage } = useMessageContext();

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
