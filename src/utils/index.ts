import { THINK_TAG_REGEX } from '@/constants';
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

// We are considering here that reasoning models will
// always return both opening and closing tags
// and we remove the content in between
export const removeThinkingContent = (text: string): string => {
  return text.replace(THINK_TAG_REGEX, '').trim();
};
