import ChatFormContainer from '@/components/ChatContainer/ChatFormContainer';
import {
  useAlertMessageStore,
  useChatStore,
  useHealthStore,
  useMessageStore,
} from '@/stores';
import { createMockElectronApi } from '@/tests/utils/mocks';
import { createNewChat } from '@/utils';
import { generateUniqueId } from '@shared/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { act, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/stores', () => ({
  useMessageStore: vi.fn(),
  useAlertMessageStore: vi.fn(),
  useHealthStore: vi.fn(),
  useChatStore: vi.fn(),
}));
vi.mock('@/utils', () => ({
  createNewChat: vi.fn(),
}));
vi.mock('@/providers/HealthProvider', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('@shared/utils', () => ({
  generateUniqueId: vi.fn(),
}));

describe('ChatFormContainer component', () => {
  const mockRemoveStreamListener = vi.fn();
  let mockElectronApi: ReturnType<typeof createMockElectronApi>;

  const mockAlertMessageStore = {
    alertMessage: null,
    updateAlertMessage: vi.fn(),
    clearAlertMessage: vi.fn(),
  };

  const mockMessageStore = {
    completedMessages: [] as Array<{
      id: string;
      role: string;
      content: string;
    }>,
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
    loadMessagesForChat: vi.fn(),
    clearMessages: vi.fn(),
    getState: vi.fn(),
  };

  const mockChatStore = {
    chats: [],
    currentChatId: null,
    isLoading: false,
    isChatStarted: false,
    setChats: vi.fn(),
    addChat: vi.fn(),
    setCurrentChat: vi.fn(),
    setLoading: vi.fn(),
    startChat: vi.fn(),
    stopChat: vi.fn(),
    getCurrentChat: vi.fn(),
  };

  const mockHealthStore = {
    healthStatus: {
      ok: true,
      message: 'Ollama is running.',
    },
    setHealthStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useMessageStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockMessageStore);
      }
      return mockMessageStore;
    });

    (useMessageStore as unknown as Record<'getState', unknown>).getState = vi
      .fn()
      .mockReturnValue(mockMessageStore);

    vi.mocked(useAlertMessageStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockAlertMessageStore);
      }
      return mockAlertMessageStore;
    });

    vi.mocked(useChatStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockChatStore);
      }
      return mockChatStore;
    });

    vi.mocked(useHealthStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockHealthStore);
      }
      return mockHealthStore;
    });

    vi.mocked(createNewChat).mockResolvedValue({
      chatId: 'new-chat-id',
      newChat: {
        id: 'new-chat-id',
        title: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    });

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

  it('renders ChatForm and WelcomeTitle', () => {
    render(<ChatFormContainer />);

    const welcomeTitle = screen.getByTestId('welcome-title');
    expect(welcomeTitle).toBeInTheDocument();

    const chatForm = screen.getByTestId('chat-form');
    expect(chatForm).toBeInTheDocument();
  });

  it('submits the form and sends prompt to Ollama', async () => {
    mockElectronApi.onStreamResponse.mockReturnValue(mockRemoveStreamListener);

    render(<ChatFormContainer />);

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Hello, Ollama!' } });

    const form = screen.getByTestId('chat-form');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.submit(form);
    });
    await Promise.resolve();

    expect(createNewChat).toHaveBeenCalledWith({
      shouldStopChat: false,
      onError: expect.any(Function) as unknown as (error: Error) => void,
    });
    expect(mockAlertMessageStore.clearAlertMessage).toHaveBeenCalled();
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
    expect(mockChatStore.startChat).toHaveBeenCalled();
  });

  it('handles empty user input correctly', () => {
    render(<ChatFormContainer />);

    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    expect(createNewChat).not.toHaveBeenCalled();
    expect(mockElectronApi.sendPrompt).not.toHaveBeenCalled();
    expect(mockChatStore.startChat).not.toHaveBeenCalled();
  });

  it('handles stream response correctly', async () => {
    mockElectronApi.onStreamResponse.mockReturnValue(mockRemoveStreamListener);

    let capturedStreamHandler: (chunk: string) => void = () => {};
    mockElectronApi.onStreamResponse.mockImplementation(
      (handler: (chunk: string) => void) => {
        capturedStreamHandler = handler;
        return mockRemoveStreamListener;
      },
    );

    render(<ChatFormContainer />);

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Test message' } });
    const form = screen.getByTestId('chat-form');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.submit(form);
    });
    await Promise.resolve();

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

  it('handles stream error correctly', async () => {
    mockElectronApi.onStreamResponse.mockReturnValue(mockRemoveStreamListener);

    let capturedErrorHandler: (error: string) => void = () => {};
    mockElectronApi.onStreamError.mockImplementation((handler) => {
      capturedErrorHandler = handler as (error: string) => void;
    });

    render(<ChatFormContainer />);

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Test message' } });
    const form = screen.getByTestId('chat-form');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.submit(form);
    });
    await Promise.resolve();

    act(() => {
      capturedErrorHandler('Connection error');
    });

    expect(mockMessageStore.stopLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockAlertMessageStore.updateAlertMessage).toHaveBeenCalledWith({
      message: 'Connection error',
      type: 'error',
    });
    expect(mockRemoveStreamListener).toHaveBeenCalled();
  });
});
