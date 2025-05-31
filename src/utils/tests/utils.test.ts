import {
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
