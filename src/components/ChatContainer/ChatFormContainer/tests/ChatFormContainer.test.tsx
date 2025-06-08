import ChatFormContainer from '@/components/ChatContainer/ChatFormContainer';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import useHealthContext from '@/hooks/useHealthContext';
import AlertMessageProvider from '@/providers/AlertMessageProvider';
import { useMessageStore } from '@/stores';
import { createMockElectronApi } from '@/tests/utils/mocks';
import { generateUniqueId } from '@/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { act, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/stores', () => ({
  useMessageStore: vi.fn(),
}));
vi.mock('@/hooks/useAlertMessageContext');
vi.mock('@/hooks/useHealthContext');
vi.mock('@/providers/HealthProvider', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('@/utils', () => ({
  generateUniqueId: vi.fn(),
}));

const TestWrapper = ({ children }: { children: ReactNode }) => {
  return <AlertMessageProvider>{children}</AlertMessageProvider>;
};

describe('ChatFormContainer component', () => {
  const mockStartChat = vi.fn();
  const mockRemoveStreamListener = vi.fn();
  let mockElectronApi: ReturnType<typeof createMockElectronApi>;

  const mockAlertMessageContext = {
    alertMessage: null,
    updateAlertMessage: vi.fn(),
    clearAlertMessage: vi.fn(),
  };

  const mockMessageStore = {
    completedMessages: [],
    streamingMessage: null,
    isLoadingAssistantMessage: false,
    isStreamMessageComplete: true,
    addUserMessage: vi.fn(),
    startAssistantMessage: vi.fn(),
    updateStreamingMessage: vi.fn(),
    completeStreamingMessage: vi.fn(),
    startLoadingAssistantMessage: vi.fn(),
    stopLoadingAssistantMessage: vi.fn(),
    startStreamMessage: vi.fn(),
    stopStreamMessage: vi.fn(),
  };

  const mockHealthContext = {
    healthStatus: {
      ok: true,
      message: 'Ollama is running.',
    },
  };

  beforeEach(() => {
    vi.mocked(useMessageStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockMessageStore);
      }
      return mockMessageStore;
    });

    (
      useMessageStore as typeof useMessageStore & {
        getState: () => typeof mockMessageStore;
      }
    ).getState = vi.fn().mockReturnValue(mockMessageStore);

    vi.mocked(useAlertMessageContext).mockReturnValue(mockAlertMessageContext);
    vi.mocked(useHealthContext).mockReturnValue(mockHealthContext);

    mockElectronApi = createMockElectronApi();
    window.electronApi = mockElectronApi;

    vi.mocked(generateUniqueId)
      .mockReturnValueOnce('user-id')
      .mockReturnValueOnce('assistant-id');

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders ChatForm and WelcomeTitle with correct props', () => {
    render(
      <ChatFormContainer isChatStarted={false} onChatStart={mockStartChat} />,
      { wrapper: TestWrapper },
    );

    const welcomeTitle = screen.getByTestId('welcome-title');
    expect(welcomeTitle).toBeInTheDocument();

    const chatForm = screen.getByTestId('chat-form');
    expect(chatForm).toBeInTheDocument();
  });

  it('submits the form and sends prompt to Ollama', () => {
    mockElectronApi.onStreamResponse.mockReturnValue(mockRemoveStreamListener);

    render(
      <ChatFormContainer isChatStarted={false} onChatStart={mockStartChat} />,
      { wrapper: TestWrapper },
    );

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Hello, Ollama!' } });

    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    expect(mockAlertMessageContext.clearAlertMessage).toHaveBeenCalled();
    expect(mockMessageStore.addUserMessage).toHaveBeenCalledWith(
      'user-id',
      'Hello, Ollama!',
    );
    expect(mockMessageStore.startLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockElectronApi.sendPrompt).toHaveBeenCalledWith([
      {
        id: 'user-id',
        role: 'user',
        content: 'Hello, Ollama!',
      },
    ]);
    expect(mockStartChat).toHaveBeenCalled();
  });

  it('handles empty user input correctly', () => {
    render(
      <ChatFormContainer isChatStarted={false} onChatStart={mockStartChat} />,
      { wrapper: TestWrapper },
    );

    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    expect(mockElectronApi.sendPrompt).not.toHaveBeenCalled();
    expect(mockStartChat).not.toHaveBeenCalled();
  });

  it('handles stream response correctly', () => {
    mockElectronApi.onStreamResponse.mockReturnValue(mockRemoveStreamListener);

    let capturedStreamHandler: (chunk: string) => void = () => {};
    mockElectronApi.onStreamResponse.mockImplementation(
      (handler: (chunk: string) => void) => {
        capturedStreamHandler = handler;
        return mockRemoveStreamListener;
      },
    );

    render(
      <ChatFormContainer isChatStarted={false} onChatStart={mockStartChat} />,
      { wrapper: TestWrapper },
    );

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Test message' } });
    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    act(() => {
      capturedStreamHandler('First chunk');
    });

    expect(mockMessageStore.stopLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockMessageStore.updateStreamingMessage).toHaveBeenCalledWith(
      'First chunk',
    );

    act(() => {
      capturedStreamHandler(' and second chunk');
    });

    expect(mockMessageStore.updateStreamingMessage).toHaveBeenCalledWith(
      ' and second chunk',
    );
  });

  it('handles stream error correctly', () => {
    mockElectronApi.onStreamResponse.mockReturnValue(mockRemoveStreamListener);

    let capturedErrorHandler: (error: string) => void = () => {};
    mockElectronApi.onStreamError.mockImplementation((handler) => {
      capturedErrorHandler = handler as (error: string) => void;
    });

    render(
      <ChatFormContainer isChatStarted={false} onChatStart={mockStartChat} />,
      { wrapper: TestWrapper },
    );

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Test message' } });
    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    act(() => {
      capturedErrorHandler('Connection error');
    });

    expect(mockMessageStore.stopLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockAlertMessageContext.updateAlertMessage).toHaveBeenCalledWith({
      message: 'Connection error',
      type: 'error',
    });
    expect(mockRemoveStreamListener).toHaveBeenCalled();
  });
});
