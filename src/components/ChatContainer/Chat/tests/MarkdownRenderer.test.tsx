import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MarkdownRenderer from '../MarkdownRenderer';
import type { Message } from '@shared/types';
import MessageContext from '@/contexts/MessageContext';

interface ChevronToggleButtonProps {
  buttonText: string;
  textClassName?: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Mock the ChevronToggleButton component
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

const createMockMessageProvider = (
  messages: Message[] = [],
  isLoadingAssistantMessage = false,
  isStreamMessageComplete = true,
) => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <MessageContext.Provider
      value={{
        messages,
        addEmptyAssistantMessage: vi.fn(),
        updateAssistantMessage: vi.fn(),
        addUserMessage: vi.fn(),
        isLoadingAssistantMessage,
        startLoadingAssistantMessage: vi.fn(),
        stopLoadingAssistantMessage: vi.fn(),
        isStreamMessageComplete,
        startStreamMessage: vi.fn(),
        stopStreamMessage: vi.fn(),
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

const TestWrapper = createMockMessageProvider();

describe('MarkdownRenderer component', () => {
  it('renders plain text correctly', () => {
    render(<MarkdownRenderer content="Simple text content" />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });

  it('renders markdown formatting correctly', () => {
    render(<MarkdownRenderer content="**Bold text** and *Italic text*" />, {
      wrapper: TestWrapper,
    });

    const boldElement = screen.getByText('Bold text');
    const italicElement = screen.getByText('Italic text');

    expect(boldElement).toBeInTheDocument();
    expect(italicElement).toBeInTheDocument();

    expect(
      boldElement.closest('strong') ||
        boldElement.parentElement?.tagName === 'STRONG',
    ).toBeTruthy();
    expect(
      italicElement.closest('em') ||
        italicElement.parentElement?.tagName === 'EM',
    ).toBeTruthy();
  });

  it('renders links correctly', () => {
    render(<MarkdownRenderer content="[Link text](https://example.com)" />, {
      wrapper: TestWrapper,
    });

    const link = screen.getByText('Link text');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders code blocks with syntax highlighting', () => {
    render(
      <MarkdownRenderer content="```javascript\nconst x = 1;\nconsole.log(x);\n```" />,
      { wrapper: TestWrapper },
    );

    expect(screen.getByText(/const x = 1;/)).toBeInTheDocument();
    expect(screen.getByText(/console.log/)).toBeInTheDocument();

    // Test if the SyntaxHighlighter component was used (simplified)
    const codeContainer = screen.getByText(/const x = 1;/).closest('div');
    expect(codeContainer).toBeInTheDocument();
  });

  it('renders inline code correctly', () => {
    render(<MarkdownRenderer content="This is `inline code`" />, {
      wrapper: TestWrapper,
    });

    const codeText = screen.getByText('inline code');
    expect(codeText.tagName).toBe('CODE');
  });

  it('renders content without think tags normally', () => {
    render(<MarkdownRenderer content="Normal content without think tags" />, {
      wrapper: TestWrapper,
    });

    expect(
      screen.getByText('Normal content without think tags'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('thinking-toggle')).not.toBeInTheDocument();
  });

  it('renders content with think tags and shows toggle button', () => {
    render(
      <MarkdownRenderer content="Before <think>Thinking content</think> After" />,
      { wrapper: TestWrapper },
    );

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
    expect(screen.getByTestId('thinking-toggle')).toBeInTheDocument();

    // Thinking content should be hidden initially
    expect(screen.queryByText('Thinking content')).not.toBeInTheDocument();
  });

  it('toggles thinking content visibility when clicked', () => {
    render(
      <MarkdownRenderer content="Before <think>Thinking content</think> After" />,
      { wrapper: TestWrapper },
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

  it('handles multiple think blocks correctly', () => {
    render(
      <MarkdownRenderer content="Start <think>First thinking</think> Middle <think>Second thinking</think> End" />,
      { wrapper: TestWrapper },
    );

    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();

    const toggleButtons = screen.getAllByTestId('thinking-toggle');
    expect(toggleButtons).toHaveLength(2);

    fireEvent.click(toggleButtons[0]);
    expect(screen.getByText('First thinking')).toBeInTheDocument();
    expect(screen.queryByText('Second thinking')).not.toBeInTheDocument();

    fireEvent.click(toggleButtons[1]);
    expect(screen.getByText('First thinking')).toBeInTheDocument();
    expect(screen.getByText('Second thinking')).toBeInTheDocument();
  });

  it('handles active thinking state (no closing tag)', () => {
    const TestWrapper = createMockMessageProvider([], true, false);

    render(<MarkdownRenderer content="Start <think>Active thinking" />, {
      wrapper: TestWrapper,
    });

    const toggleButton = screen.getByTestId('thinking-toggle');

    expect(toggleButton.className).toContain('text-transparent');
    expect(toggleButton.className).toContain('bg-clip-text');
  });

  it('handles markdown inside think blocks', () => {
    render(
      <MarkdownRenderer content="<think>**Bold thinking** and *italic thinking*</think>" />,
      { wrapper: TestWrapper },
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

  it('sanitizes dangerous HTML content', () => {
    render(
      <MarkdownRenderer content="<script>alert('xss')</script> Safe text" />,
      { wrapper: TestWrapper },
    );

    expect(screen.queryByText("alert('xss')")).not.toBeInTheDocument();
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });
});
