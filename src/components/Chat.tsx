import type { Message } from '@shared/types';
import ChatMessage from './ChatMessage';

export default function Chat({ messages }: { messages: Message[] }) {
  return (
    <div className="h-full w-full overflow-auto">
      <section
        className="mx-auto my-4 flex max-w-2xl flex-col"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.map((message) => {
          if (message.role === 'user') {
            return <ChatMessage key={message.id} message={message} />;
          } else if (message.role === 'assistant') {
            return <ChatMessage key={message.id} message={message} />;
          }
        })}
      </section>
    </div>
  );
}
