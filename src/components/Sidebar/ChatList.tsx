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
        <div className="p-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`mb-2 w-full rounded-lg p-3 text-left transition-colors ${
                currentChatId === chat.id
                  ? 'bg-neutral-200 dark:bg-neutral-700'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare size={16} className="mt-1 flex-shrink-0" />
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
