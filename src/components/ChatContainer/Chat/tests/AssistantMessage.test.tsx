import AssistantMessage from '@/components/ChatContainer/Chat/AssistantMessage.tsx';
import { useMessageStore } from '@/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface ChevronToggleButtonProps {
  buttonText: string;
  textClassName?: string;
  isOpen: boolean;
  onToggle: () => void;
}

vi.mock('@/components/ChevronToggleButton', () => ({
  default: ({
    buttonText,
    isOpen,
    onToggle,
    textClassName,
  }: ChevronToggleButtonProps) => (
    <button
      onClick={onToggle}
      className={textClassName}
      data-testid="thinking-toggle"
      aria-expanded={isOpen}
    >
      {buttonText}
    </button>
  ),
}));

vi.mock('@/stores', () => ({
  useMessageStore: vi.fn(),
}));

const createMockMessageStore = (
  isLoadingAssistantMessage = false,
  isStreamMessageComplete = true,
) => {
  return {
    completedMessages: [],
    streamingMessage: null,
    isLoadingAssistantMessage,
    isStreamMessageComplete,
    addUserMessage: vi.fn(),
    startAssistantMessage: vi.fn(),
    updateStreamingMessage: vi.fn(),
    completeStreamingMessage: vi.fn(),
    startLoadingAssistantMessage: vi.fn(),
    stopLoadingAssistantMessage: vi.fn(),
    startStreamMessage: vi.fn(),
    stopStreamMessage: vi.fn(),
  };
};

const defaultProps = {
  content: 'Normal content without think tags',
  isStreaming: false,
  isModelThinking: false,
  onStartThinking: vi.fn(),
  onStopThinking: vi.fn(),
};

describe('AssistantMessage component', () => {
  beforeEach(() => {
    const mockStore = createMockMessageStore();
    vi.mocked(useMessageStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  it('renders content without think tags normally', () => {
    render(<AssistantMessage {...defaultProps} />);

    expect(
      screen.getByText('Normal content without think tags'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('thinking-toggle')).not.toBeInTheDocument();
  });

  it('renders content with think tags and shows toggle button', () => {
    render(
      <AssistantMessage
        {...defaultProps}
        content="Before <think>Thinking content</think> After"
      />,
    );

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
    expect(screen.getByTestId('thinking-toggle')).toBeInTheDocument();

    // Thinking content should be hidden initially
    expect(screen.queryByText('Thinking content')).not.toBeInTheDocument();
  });

  it('toggles thinking content visibility when clicked', () => {
    render(
      <AssistantMessage
        {...defaultProps}
        content="<think>Thinking content</think> Content"
      />,
    );

    const toggleButton = screen.getByTestId('thinking-toggle');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggleButton);

    expect(screen.getByText('Thinking content')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggleButton);

    expect(screen.queryByText('Thinking content')).not.toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles active thinking state without closing think tag', () => {
    const mockStore = createMockMessageStore(true, false);
    vi.mocked(useMessageStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockStore);
      }
      return mockStore;
    });

    render(
      <AssistantMessage
        {...defaultProps}
        content="<think>Active thinking"
        isStreaming={true}
        isModelThinking={true}
      />,
    );

    const toggleButton = screen.getByTestId('thinking-toggle');

    expect(toggleButton.className).toContain('text-transparent');
    expect(toggleButton.className).toContain('bg-clip-text');
  });

  it('handles markdown inside think blocks', () => {
    render(
      <AssistantMessage
        {...defaultProps}
        content="<think>**Bold thinking** and *italic thinking*</think>"
      />,
    );

    const toggleButton = screen.getByTestId('thinking-toggle');
    fireEvent.click(toggleButton);

    const boldThinking = screen.getByText('Bold thinking');
    const italicThinking = screen.getByText('italic thinking');

    expect(boldThinking).toBeInTheDocument();
    expect(italicThinking).toBeInTheDocument();
    expect(
      boldThinking.closest('strong') ||
        boldThinking.parentElement?.tagName === 'STRONG',
    ).toBeTruthy();
    expect(
      italicThinking.closest('em') ||
        italicThinking.parentElement?.tagName === 'EM',
    ).toBeTruthy();
  });
});
