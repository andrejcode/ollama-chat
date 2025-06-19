import {
  formatDistanceToNow,
  getLastAssistantMessageIndex,
  wrapBoxedMathInDollarSigns,
} from '@/utils';
import type { Message } from '@shared/types';
import { describe, expect, it } from 'vitest';

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

describe('wrapBoxedMathInDollarSigns', () => {
  it('should wrap a simple boxed expression in dollar signs', () => {
    const input = 'The answer is \\boxed{42}';
    const expected = 'The answer is $\\boxed{42}$';
    expect(wrapBoxedMathInDollarSigns(input)).toBe(expected);
  });

  it('should handle text with multiple boxed expressions', () => {
    const input = 'Solve: \\boxed{x^2 + 3x + 2} = \\boxed{0}';
    const expected = 'Solve: $\\boxed{x^2 + 3x + 2}$ = $\\boxed{0}$';
    expect(wrapBoxedMathInDollarSigns(input)).toBe(expected);
  });

  it('should not wrap boxed expressions that are already wrapped in dollar signs', () => {
    const input = 'This is already wrapped: $\\boxed{x + y = z}$';
    expect(wrapBoxedMathInDollarSigns(input)).toBe(input);
  });

  it('should handle nested curly braces correctly', () => {
    const input = 'Complex expression: \\boxed{f(x) = \\{x | x > 0\\}}';
    const expected = 'Complex expression: $\\boxed{f(x) = \\{x | x > 0\\}}$';
    expect(wrapBoxedMathInDollarSigns(input)).toBe(expected);
  });

  it('should return the original text if no boxed expressions are found', () => {
    const input = 'This text has no boxed expressions';
    expect(wrapBoxedMathInDollarSigns(input)).toBe(input);
  });

  it('should handle mixed content correctly', () => {
    const input = 'Start $\\boxed{a}$ middle \\boxed{b} end';
    const expected = 'Start $\\boxed{a}$ middle $\\boxed{b}$ end';
    expect(wrapBoxedMathInDollarSigns(input)).toBe(expected);
  });
});

describe('formatDistanceToNow', () => {
  const mockDateNow = (timestamp: number) => {
    const originalDateNow = Date.now;
    Date.now = () => timestamp;
    return () => {
      Date.now = originalDateNow;
    };
  };

  it('should return "just now" for times less than 1 minute', () => {
    const now = 1000000000000; // Some timestamp
    const restore = mockDateNow(now);

    expect(formatDistanceToNow(now - 30000)).toBe('just now'); // 30 seconds ago
    expect(formatDistanceToNow(now - 59000)).toBe('just now'); // 59 seconds ago

    restore();
  });

  it('should handle minutes correctly with singular/plural forms', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    expect(formatDistanceToNow(now - 60000)).toBe('1 minute ago'); // 1 minute ago
    expect(formatDistanceToNow(now - 120000)).toBe('2 minutes ago'); // 2 minutes ago
    expect(formatDistanceToNow(now - 3540000)).toBe('59 minutes ago'); // 59 minutes ago

    restore();
  });

  it('should handle hours correctly with singular/plural forms', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    expect(formatDistanceToNow(now - 3600000)).toBe('1 hour ago'); // 1 hour ago
    expect(formatDistanceToNow(now - 7200000)).toBe('2 hours ago'); // 2 hours ago
    expect(formatDistanceToNow(now - 86399000)).toBe('23 hours ago'); // 23 hours ago

    restore();
  });

  it('should handle days correctly with singular/plural forms', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    expect(formatDistanceToNow(now - 86400000)).toBe('1 day ago'); // 1 day ago
    expect(formatDistanceToNow(now - 172800000)).toBe('2 days ago'); // 2 days ago
    expect(formatDistanceToNow(now - 2591999000)).toBe('29 days ago'); // 29 days ago

    restore();
  });

  it('should handle months correctly with singular/plural forms', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    expect(formatDistanceToNow(now - 2592000000)).toBe('1 month ago'); // 1 month ago
    expect(formatDistanceToNow(now - 5184000000)).toBe('2 months ago'); // 2 months ago
    expect(formatDistanceToNow(now - 31535999000)).toBe('12 months ago'); // 12 months ago

    restore();
  });

  it('should handle years correctly with singular/plural forms', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    expect(formatDistanceToNow(now - 31536000000)).toBe('1 year ago'); // 1 year ago
    expect(formatDistanceToNow(now - 63072000000)).toBe('2 years ago'); // 2 years ago
    expect(formatDistanceToNow(now - 94608000000)).toBe('3 years ago'); // 3 years ago

    restore();
  });

  it('should handle Date objects correctly', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    const dateObject = new Date(now - 3600000); // 1 hour ago
    expect(formatDistanceToNow(dateObject)).toBe('1 hour ago');

    restore();
  });

  it('should handle number timestamps correctly', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    const timestamp = now - 3600000; // 1 hour ago
    expect(formatDistanceToNow(timestamp)).toBe('1 hour ago');

    restore();
  });

  it('should handle edge cases around time boundaries', () => {
    const now = 1000000000000;
    const restore = mockDateNow(now);

    // Just under 1 minute
    expect(formatDistanceToNow(now - 59999)).toBe('just now');

    // Exactly 1 minute
    expect(formatDistanceToNow(now - 60000)).toBe('1 minute ago');

    // Just under 1 hour
    expect(formatDistanceToNow(now - 3599999)).toBe('59 minutes ago');

    // Exactly 1 hour
    expect(formatDistanceToNow(now - 3600000)).toBe('1 hour ago');

    restore();
  });
});
