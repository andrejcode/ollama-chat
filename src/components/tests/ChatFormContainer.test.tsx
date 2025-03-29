import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatFormContainer from '../ChatFormContainer';
import useMessageContext from '@/hooks/useMessageContext';
import { generateUniqueId } from '@/utils';
import { act } from 'react';

vi.mock('@/hooks/useMessageContext');
vi.mock('@/utils', () => ({
  generateUniqueId: vi.fn(),
}));

describe('ChatFormContainer', () => {
  const mockStartChat = vi.fn();
  const mockClearErrorMessage = vi.fn();
  const mockUpdateErrorMessage = vi.fn();

  const mockMessageContext = {
    messages: [],
    addEmptyAssistantMessage: vi.fn(),
    updateAssistantMessage: vi.fn(),
    addUserMessage: vi.fn(),
    isLoadingAssistantMessage: false,
    startLoadingAssistantMessage: vi.fn(),
    stopLoadingAssistantMessage: vi.fn(),
  };

  const mockElectronApi = {
    sendPrompt: vi.fn(),
    onStreamResponse: vi.fn(),
    onStreamError: vi.fn(),
    onStreamComplete: vi.fn(),
    getStoreValue: vi.fn(),
    setStoreValue: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useMessageContext).mockReturnValue(mockMessageContext);

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
      <ChatFormContainer
        isChatStarted={false}
        startChat={mockStartChat}
        clearErrorMessage={mockClearErrorMessage}
        updateErrorMessage={mockUpdateErrorMessage}
      />,
    );

    const welcomeTitle = screen.getByTestId('welcome-title');
    expect(welcomeTitle).toBeInTheDocument();

    const chatForm = screen.getByTestId('chat-form');
    expect(chatForm).toBeInTheDocument();
  });

  it('submits the form and sends prompt to Ollama', () => {
    const mockUnsubscribe = vi.fn();
    mockElectronApi.onStreamResponse.mockReturnValue(mockUnsubscribe);

    render(
      <ChatFormContainer
        isChatStarted={false}
        startChat={mockStartChat}
        clearErrorMessage={mockClearErrorMessage}
        updateErrorMessage={mockUpdateErrorMessage}
      />,
    );

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Hello, Ollama!' } });

    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    expect(mockClearErrorMessage).toHaveBeenCalled();
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
      <ChatFormContainer
        isChatStarted={false}
        startChat={mockStartChat}
        clearErrorMessage={mockClearErrorMessage}
        updateErrorMessage={mockUpdateErrorMessage}
      />,
    );

    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    expect(mockElectronApi.sendPrompt).not.toHaveBeenCalled();
    expect(mockStartChat).not.toHaveBeenCalled();
  });

  it('handles stream response correctly', () => {
    const mockUnsubscribe = vi.fn();
    mockElectronApi.onStreamResponse.mockReturnValue(mockUnsubscribe);

    let capturedStreamHandler: (chunk: string) => void = () => {};
    mockElectronApi.onStreamResponse.mockImplementation(
      (handler: (chunk: string) => void) => {
        capturedStreamHandler = handler;
        return mockUnsubscribe;
      },
    );

    render(
      <ChatFormContainer
        isChatStarted={false}
        startChat={mockStartChat}
        clearErrorMessage={mockClearErrorMessage}
        updateErrorMessage={mockUpdateErrorMessage}
      />,
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
    const mockUnsubscribe = vi.fn();
    mockElectronApi.onStreamResponse.mockReturnValue(mockUnsubscribe);

    let capturedErrorHandler: (error: string) => void = () => {};
    mockElectronApi.onStreamError.mockImplementation((handler) => {
      capturedErrorHandler = handler as (error: string) => void;
    });

    render(
      <ChatFormContainer
        isChatStarted={false}
        startChat={mockStartChat}
        clearErrorMessage={mockClearErrorMessage}
        updateErrorMessage={mockUpdateErrorMessage}
      />,
    );

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Test message' } });
    const form = screen.getByTestId('chat-form');
    fireEvent.submit(form);

    act(() => {
      capturedErrorHandler('Connection error');
    });

    expect(mockMessageContext.stopLoadingAssistantMessage).toHaveBeenCalled();
    expect(mockUpdateErrorMessage).toHaveBeenCalledWith('Connection error');
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
