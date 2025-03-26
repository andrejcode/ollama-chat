import { useState } from 'react';
import type { Message } from '@shared/types';
import ChatForm from './ChatForm';
import WelcomeTitle from './WelcomeTitle';
import { generateUniqueId } from '@/utils';
import useMessageContext from '@/hooks/useMessageContext';

interface ChatFormContainerProps {
  isChatStarted: boolean;
  startChat: () => void;
  clearErrorMessage: () => void;
  updateErrorMessage: (message: string) => void;
}

export default function ChatFormContainer({
  isChatStarted,
  startChat,
  clearErrorMessage,
  updateErrorMessage,
}: ChatFormContainerProps) {
  const [userInput, setUserInput] = useState<string>('');
  const [isStreamComplete, setIsStreamComplete] = useState<boolean>(true);

  const {
    messages,
    addEmptyAssistantMessage,
    updateAssistantMessage,
    addUserMessage,
    isLoadingAssistantMessage,
    startLoadingAssistantMessage,
    stopLoadingAssistantMessage,
  } = useMessageContext();

  const sendPromptToOllama = (messagesToSend: Message[]) => {
    clearErrorMessage();
    startLoadingAssistantMessage();
    setIsStreamComplete(false);

    window.electronApi.sendPrompt(messagesToSend);

    let firstChunkReceived = false;
    const assistantMessageId = generateUniqueId();
    addEmptyAssistantMessage(assistantMessageId);

    const handleStreamResponse = (chunk: string) => {
      if (!firstChunkReceived) {
        stopLoadingAssistantMessage();
        firstChunkReceived = true;
      }

      updateAssistantMessage(assistantMessageId, chunk);
    };

    const unsubscribe =
      window.electronApi.onStreamResponse(handleStreamResponse);

    window.electronApi.onStreamError((errorMessage: string) => {
      stopLoadingAssistantMessage();
      updateErrorMessage(errorMessage);
      setIsStreamComplete(true);

      unsubscribe();
    });

    window.electronApi.onStreamComplete(() => {
      setIsStreamComplete(true);

      unsubscribe();
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userInput.trim()) {
      const userMessageId = generateUniqueId();
      addUserMessage(userMessageId, userInput);

      const newMessage = {
        id: userMessageId,
        role: 'user',
        content: userInput,
      };
      const updatedMessages = [...messages, newMessage];

      sendPromptToOllama(updatedMessages);
      setUserInput('');
      startChat();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <WelcomeTitle isChatStarted={isChatStarted} />
      <ChatForm
        isStreamComplete={isStreamComplete}
        userInput={userInput}
        isLoadingAssistantMessage={isLoadingAssistantMessage}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </div>
  );
}
