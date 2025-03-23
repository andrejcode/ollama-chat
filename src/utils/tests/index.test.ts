import { describe, it, expect } from 'vitest';
import { getLastAssistantMessageIndex } from '../index';
import type { Message } from '@shared/types';

describe('getLastAssistantMessageIndex', () => {
  it('should return -1 for empty array', () => {
    const messages: Message[] = [];
    expect(getLastAssistantMessageIndex(messages)).toBe(-1);
  });

  it('should return -1 when no assistant messages exist', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'user', content: 'How are you?' },
    ];
    expect(getLastAssistantMessageIndex(messages)).toBe(-1);
  });

  it('should return the index of the only assistant message', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there!' },
    ];
    expect(getLastAssistantMessageIndex(messages)).toBe(1);
  });

  it('should return the index of the last assistant message', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there!' },
      { id: '3', role: 'user', content: 'How are you?' },
      { id: '4', role: 'assistant', content: 'I am good, thanks!' },
      { id: '5', role: 'user', content: 'Great' },
    ];
    expect(getLastAssistantMessageIndex(messages)).toBe(3);
  });

  it('should return the last index when the last message is from assistant', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there!' },
      { id: '3', role: 'user', content: 'How are you?' },
      { id: '4', role: 'assistant', content: 'I am good, thanks!' },
    ];
    expect(getLastAssistantMessageIndex(messages)).toBe(3);
  });
});
