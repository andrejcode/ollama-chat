import ChatFormContainer from '@/components/ChatContainer/ChatFormContainer';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import useMessageContext from '@/hooks/useMessageContext';
import AlertMessageProvider from '@/providers/AlertMessageProvider';
import { createMockElectronApi } from '@/tests/utils/mocks';
import { generateUniqueId } from '@/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { act, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useMessageContext');
vi.mock('@/hooks/useAlertMessageContext');
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

  const mockMessageContext = {
    messages: [],
    addEmptyAssistantMessage: vi.fn(),
    updateAssistantMessage: vi.fn(),
    addUserMessage: vi.fn(),
    isLoadingAssistantMessage: false,
    startLoadingAssistantMessage: vi.fn(),
    stopLoadingAssistantMessage: vi.fn(),
    isStreamMessageComplete: true,
    startStreamMessage: vi.fn(),
    stopStreamMessage: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useMessageContext).mockReturnValue(mockMessageContext);
    vi.mocked(useAlertMessageContext).mockReturnValue(mockAlertMessageContext);

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
    expect(mockMessageContext.addUserMessage).toHaveBeenCalledWith(
      'user-id',
      'Hello, Ollama!',
    );
    expect(mockMessageContext.startLoadingAssistantMessage).toHaveBeenCalled();
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

    expect(mockMessageContext.stopLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockMessageContext.updateAssistantMessage).toHaveBeenCalledWith(
      'assistant-id',
      'First chunk',
    );

    act(() => {
      capturedStreamHandler(' and second chunk');
    });

    expect(mockMessageContext.updateAssistantMessage).toHaveBeenCalledWith(
      'assistant-id',
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

    expect(mockMessageContext.stopLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockAlertMessageContext.updateAlertMessage).toHaveBeenCalledWith({
      message: 'Connection error',
      type: 'error',
    });
    expect(mockRemoveStreamListener).toHaveBeenCalled();
  });
});
