import type { Message } from '@shared/types';
import { v4 } from 'uuid';

export function getLastAssistantMessageIndex(messages: Message[]) {
  return messages.length > 0
    ? messages.map((message) => message.role).lastIndexOf('assistant')
    : -1;
}

export function generateUniqueId() {
  return v4();
}
