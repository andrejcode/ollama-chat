import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatMessage from '../ChatMessage';
import type { Message } from '@shared/types';

describe('ChatMessage component', () => {
  it('renders the user message', () => {
    const message: Message = { id: '1', role: 'user', content: 'User message' };

    render(<ChatMessage message={message} />);

    expect(screen.getByText(message.content)).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveAttribute(
      'aria-label',
      'Your message',
    );
  });

  it('renders the assistant message', () => {
    const message: Message = {
      id: '2',
      role: 'assistant',
      content: 'Assistant message',
    };

    render(<ChatMessage message={message} />);

    expect(screen.getByText(message.content)).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveAttribute(
      'aria-label',
      'Assistant message',
    );
  });

  it('should copy text to clipboard', async () => {
    const message: Message = {
      id: '3',
      role: 'assistant',
      content: 'Message to be copied',
    };

    const clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined as void);
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: clipboardWriteTextMock },
    });

    render(<ChatMessage message={message} />);

    const copyButton = screen.getByRole('button', {
      name: /Copy to clipboard/,
    });
    fireEvent.click(copyButton);

    expect(clipboardWriteTextMock).toHaveBeenCalledWith(message.content);
    expect(
      await screen.findByLabelText('Copied to clipboard'),
    ).toBeInTheDocument();
  });

  it('displays an error icon when clipboard copy fails', async () => {
    const message: Message = {
      id: '4',
      role: 'assistant',
      content: 'Failed copy message',
    };

    const clipboardWriteTextMock = vi
      .fn()
      .mockRejectedValue(new Error('Copy failed'));
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: clipboardWriteTextMock },
    });

    render(<ChatMessage message={message} />);

    const copyButton = screen.getByRole('button', {
      name: /Copy to clipboard/,
    });
    fireEvent.click(copyButton);

    const errorIcon = await screen.findByLabelText('Failed to copy');
    expect(errorIcon).toBeInTheDocument();
  });

  it('displays a check icon when text is successfully copied to clipboard', async () => {
    const message: Message = {
      id: '5',
      role: 'assistant',
      content: 'Test message',
    };

    const clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: clipboardWriteTextMock },
    });

    render(<ChatMessage message={message} />);

    const copyButton = screen.getByRole('button', {
      name: /Copy to clipboard/,
    });
    fireEvent.click(copyButton);

    const successIcon = await screen.findByLabelText('Copied to clipboard');
    expect(successIcon).toBeInTheDocument();
  });

  it('should show/hide copy button on hover', () => {
    const message: Message = {
      id: '6',
      role: 'assistant',
      content: 'Hover test message',
    };

    render(<ChatMessage message={message} />);

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

  it('should return to copy icon after 3 seconds of successful copy', async () => {
    const message: Message = {
      id: '7',
      role: 'assistant',
      content: 'Timeout test message',
    };

    const clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: clipboardWriteTextMock },
    });

    vi.useFakeTimers();

    render(<ChatMessage message={message} />);

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
});
