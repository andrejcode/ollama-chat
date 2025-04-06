import { useState } from 'react';
import type { Message } from '@shared/types';
import ChatForm from './ChatForm';
import WelcomeTitle from './WelcomeTitle';
import { generateUniqueId } from '@/utils';
import useMessageContext from '@/hooks/useMessageContext';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';

interface ChatFormContainerProps {
  isChatStarted: boolean;
  onChatStart: () => void;
}

export default function ChatFormContainer({
  isChatStarted,
  onChatStart,
}: ChatFormContainerProps) {
  const [userInput, setUserInput] = useState<string>('');
  const [isStreamComplete, setIsStreamComplete] = useState<boolean>(true);

  const {
    updateAlertMessage: updateErrorMessage,
    clearAlertMessage: clearErrorMessage,
  } = useAlertMessageContext();

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
      updateErrorMessage({ message: errorMessage, type: 'error' });
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
      onChatStart();
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
