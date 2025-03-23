import type { Message } from '@shared/types';

export function getLastAssistantMessageIndex(messages: Message[]) {
  return messages.length > 0
    ? messages.map((message) => message.role).lastIndexOf('assistant')
    : -1;
}
