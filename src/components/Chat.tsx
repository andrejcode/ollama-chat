import type { Message } from '@shared/types';
import MarkdownRenderer from './MarkdownRenderer';

export default function Chat({ messages }: { messages: Message[] }) {
  return (
    <div className="h-full w-full overflow-auto">
      <section className="mx-auto my-4 flex max-w-2xl flex-col">
        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <div
                key={message.id}
                className="mx-3 my-2 self-end rounded-2xl bg-neutral-200 px-4 py-2 whitespace-pre-wrap dark:bg-neutral-700"
              >
                {message.content}
              </div>
            );
          } else if (message.role === 'assistant') {
            return (
              <div key={message.id} className="mx-3 my-2 self-start">
                <MarkdownRenderer content={message.content} />
              </div>
            );
          }
        })}
      </section>
    </div>
  );
}
