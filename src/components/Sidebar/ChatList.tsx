import { useChatStore } from '@/stores';
import { formatDistanceToNow } from '@/utils';
import { MessageSquare } from 'lucide-react';

export default function ChatList() {
  const { chats, currentChatId, setCurrentChat, startChat } = useChatStore();

  const handleChatSelect = (chatId: string) => {
    setCurrentChat(chatId);
    startChat();
  };

  return (
    <div className="h-full overflow-y-auto">
      {chats.length === 0 ? (
        <div className="p-4 text-center text-neutral-500">
          There are no chats yet.
        </div>
      ) : (
        <div className="p-2" role="list" aria-label="Chat history">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`mb-2 w-full cursor-pointer rounded-lg p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500 ${
                currentChatId === chat.id
                  ? 'bg-neutral-200 dark:bg-neutral-700'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
              role="listitem"
              aria-label={`Select chat: ${chat.title || 'New Chat'}, created ${formatDistanceToNow(chat.created_at)}`}
              aria-current={currentChatId === chat.id ? 'page' : undefined}
            >
              <div className="flex items-start gap-2">
                <MessageSquare
                  size={16}
                  className="mt-1 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {chat.title || 'New Chat'}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {formatDistanceToNow(chat.created_at)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
