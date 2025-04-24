import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatMessage from '../ChatMessage';
import type { Message } from '@shared/types';
import MessageProvider from '@/providers/MessageProvider.tsx';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <MessageProvider>{children}</MessageProvider>;
};

describe('ChatMessage component', () => {
  const testMessages: Record<string, Message> = {
    user: { id: '1', role: 'user', content: 'User message' },
    assistant: { id: '2', role: 'assistant', content: 'Assistant message' },
    copyTest: { id: '3', role: 'assistant', content: 'Message to be copied' },
    withThinking: {
      id: '4',
      role: 'assistant',
      content: '<think>\nThinking process here\n</think>\nActual content',
    },
    onlyThinking: {
      id: '5',
      role: 'assistant',
      content: '<think>Only thinking content here</think>',
    },
  };

  it('renders the user message', () => {
    render(<ChatMessage message={testMessages.user} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText(testMessages.user.content)).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveAttribute(
      'aria-label',
      'Your message',
    );
  });

  it('renders the assistant message', () => {
    render(<ChatMessage message={testMessages.assistant} />, {
      wrapper: TestWrapper,
    });

    expect(
      screen.getByText(testMessages.assistant.content),
    ).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveAttribute(
      'aria-label',
      'Assistant message',
    );
  });

  it('should show/hide copy button on hover', () => {
    render(<ChatMessage message={testMessages.assistant} />, {
      wrapper: TestWrapper,
    });

    const messageElement = screen.getByRole('listitem');
    const copyButton = screen.getByRole('button', {
      name: /Copy to clipboard/,
    });

    expect(copyButton).toHaveClass('opacity-0');

    fireEvent.mouseEnter(messageElement);
    expect(copyButton).toHaveClass('opacity-100');

    fireEvent.mouseLeave(messageElement);
    expect(copyButton).toHaveClass('opacity-0');
  });

  describe('clipboard operations', () => {
    let clipboardWriteTextMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: { writeText: clipboardWriteTextMock },
      });
    });

    it('should copy text to clipboard', async () => {
      render(<ChatMessage message={testMessages.copyTest} />, {
        wrapper: TestWrapper,
      });

      const copyButton = screen.getByRole('button', {
        name: /Copy to clipboard/,
      });
      fireEvent.click(copyButton);

      expect(clipboardWriteTextMock).toHaveBeenCalledWith(
        testMessages.copyTest.content,
      );
      expect(
        await screen.findByLabelText('Copied to clipboard'),
      ).toBeInTheDocument();
    });

    it('displays an error icon when clipboard copy fails', async () => {
      clipboardWriteTextMock.mockRejectedValue(new Error('Copy failed'));

      render(<ChatMessage message={testMessages.copyTest} />, {
        wrapper: TestWrapper,
      });

      const copyButton = screen.getByRole('button', {
        name: /Copy to clipboard/,
      });
      fireEvent.click(copyButton);

      const errorIcon = await screen.findByLabelText('Failed to copy');
      expect(errorIcon).toBeInTheDocument();
    });

    it('displays a check icon when text is successfully copied to clipboard', async () => {
      render(<ChatMessage message={testMessages.copyTest} />, {
        wrapper: TestWrapper,
      });

      const copyButton = screen.getByRole('button', {
        name: /Copy to clipboard/,
      });
      fireEvent.click(copyButton);

      const successIcon = await screen.findByLabelText('Copied to clipboard');
      expect(successIcon).toBeInTheDocument();
    });

    it('should return to copy icon after 3 seconds of successful copy', async () => {
      vi.useFakeTimers();

      render(<ChatMessage message={testMessages.copyTest} />, {
        wrapper: TestWrapper,
      });

      const copyButton = screen.getByRole('button', {
        name: /Copy to clipboard/,
      });
      fireEvent.click(copyButton);

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(copyButton).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should remove thinking content before copying to clipboard', async () => {
      render(<ChatMessage message={testMessages.withThinking} />, {
        wrapper: TestWrapper,
      });

      const copyButton = screen.getByRole('button', {
        name: /Copy to clipboard/,
      });
      fireEvent.click(copyButton);

      // Assert clipboard was called with the cleaned text (without thinking tags)
      expect(clipboardWriteTextMock).toHaveBeenCalledWith('Actual content');

      expect(
        await screen.findByLabelText('Copied to clipboard'),
      ).toBeInTheDocument();
    });

    it('should handle message with only thinking content', async () => {
      render(<ChatMessage message={testMessages.onlyThinking} />, {
        wrapper: TestWrapper,
      });

      const copyButton = screen.getByRole('button', {
        name: /Copy to clipboard/,
      });

      // eslint-disable-next-line @typescript-eslint/require-await
      await act(async () => {
        fireEvent.click(copyButton);
      });

      // Assert clipboard was called with an empty string (all content was in thinking tags)
      expect(clipboardWriteTextMock).toHaveBeenCalledWith('');
    });
  });
});
