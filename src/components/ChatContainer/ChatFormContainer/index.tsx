import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import { useMessageStore } from '@/stores';
import { generateUniqueId } from '@/utils';
import type { Message } from '@shared/types';
import { useState } from 'react';
import ChatForm from './ChatForm';
import WelcomeTitle from './WelcomeTitle';

interface ChatFormContainerProps {
  isChatStarted: boolean;
  onChatStart: () => void;
}

export default function ChatFormContainer({
  isChatStarted,
  onChatStart,
}: ChatFormContainerProps) {
  const [userInput, setUserInput] = useState<string>('');

  const {
    updateAlertMessage: updateErrorMessage,
    clearAlertMessage: clearErrorMessage,
  } = useAlertMessageContext();

  const isLoadingAssistantMessage = useMessageStore(
    (state) => state.isLoadingAssistantMessage,
  );

  const sendPromptToOllama = (messagesToSend: Message[]) => {
    const store = useMessageStore.getState();

    clearErrorMessage();
    store.startLoadingAssistantMessage();
    store.startStreamMessage();

    window.electronApi.sendPrompt(messagesToSend);

    let firstChunkReceived = false;
    const assistantMessageId = generateUniqueId();
    store.startAssistantMessage(assistantMessageId);

    const handleStreamResponse = (chunk: string) => {
      if (!firstChunkReceived) {
        store.stopLoadingAssistantMessage();
        firstChunkReceived = true;
      }

      store.updateStreamingMessage(chunk);
    };

    const removeStreamListener =
      window.electronApi.onStreamResponse(handleStreamResponse);

    window.electronApi.onStreamError((errorMessage: string) => {
      store.stopLoadingAssistantMessage();
      store.stopStreamMessage();
      updateErrorMessage({ message: errorMessage, type: 'error' });

      removeStreamListener();
    });

    window.electronApi.onStreamComplete(() => {
      store.stopStreamMessage();
      store.completeStreamingMessage();

      removeStreamListener();
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userInput.trim()) {
      const userMessageId = generateUniqueId();
      const store = useMessageStore.getState();

      store.addUserMessage(userMessageId, userInput);

      const newMessage = {
        id: userMessageId,
        role: 'user',
        content: userInput,
      };

      const allMessages = store.streamingMessage
        ? [...store.completedMessages, store.streamingMessage, newMessage]
        : [...store.completedMessages, newMessage];

      sendPromptToOllama(allMessages);
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
        userInput={userInput}
        isLoadingAssistantMessage={isLoadingAssistantMessage}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </div>
  );
}
