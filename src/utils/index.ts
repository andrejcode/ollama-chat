import { THINK_TAG_REGEX } from '@/constants';
import { useChatStore } from '@/stores';
import type { Message } from '@shared/types';

export function getLastAssistantMessageIndex(messages: Message[]) {
  return messages.length > 0
    ? messages.map((message) => message.role).lastIndexOf('assistant')
    : -1;
}

// We are considering here that reasoning models will
// always return both opening and closing tags,
// and we remove the content in between
export const removeThinkingContent = (text: string): string => {
  return text.replace(THINK_TAG_REGEX, '').trim();
};

export const wrapBoxedMathInDollarSigns = (text: string) => {
  let result = text;
  let startIndex = 0;

  while ((startIndex = result.indexOf('\\boxed{', startIndex)) !== -1) {
    let isAlreadyWrapped = false;

    for (let i = startIndex - 1; i >= 0; i--) {
      if (result[i] === '$') {
        isAlreadyWrapped = true;
        break;
      } else if (!result[i].match(/\s/)) {
        break;
      }
    }

    if (!isAlreadyWrapped) {
      let openBraces = 0;
      let closingIndex = -1;

      for (let i = startIndex + 7; i < result.length; i++) {
        if (result[i] === '{') {
          openBraces++;
        } else if (result[i] === '}') {
          if (openBraces === 0) {
            closingIndex = i;
            break;
          }
          openBraces--;
        }
      }

      if (closingIndex !== -1) {
        result =
          result.substring(0, startIndex) +
          '$' +
          result.substring(startIndex, closingIndex + 1) +
          '$' +
          result.substring(closingIndex + 1);

        startIndex = closingIndex + 3;
      } else {
        startIndex += 7;
      }
    } else {
      startIndex += 7;
    }
  }

  return result;
};

export function formatDistanceToNow(date: number | Date): string {
  const now = Date.now();
  const then = typeof date === 'number' ? date : date.getTime();
  const diff = Math.floor((now - then) / 1000); // difference in seconds

  if (diff < 60) return 'just now';

  const minutes = Math.floor(diff / 60);
  if (diff < 3600) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(diff / 3600);
  if (diff < 86400) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(diff / 86400);
  if (diff < 2592000) return `${days} day${days === 1 ? '' : 's'} ago`;

  const months = Math.floor(diff / 2592000);
  if (diff < 31536000) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(diff / 31536000);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

export interface CreateNewChatOptions {
  shouldStopChat?: boolean;
  onError?: (error: Error) => void;
}

export async function createNewChat(options: CreateNewChatOptions = {}) {
  const { shouldStopChat = false, onError } = options;

  try {
    const chatId = await window.electronApi.createChat();
    const newChat = {
      id: chatId,
      title: null,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    // Get store actions
    const { addChat, setCurrentChat, stopChat } = useChatStore.getState();

    addChat(newChat);
    setCurrentChat(chatId);

    if (shouldStopChat) {
      stopChat();
    }

    return { chatId, newChat };
  } catch (error) {
    const errorMessage = 'Failed to create new chat. Try restarting the app.';
    console.error(errorMessage, error);

    if (onError && error instanceof Error) {
      onError(error);
    }

    throw error;
  }
}
