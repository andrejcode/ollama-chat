import { useAlertMessageStore, useChatStore, useMessageStore } from '@/stores';
import { createNewChat } from '@/utils';
import type { Message } from '@shared/types';
import { generateUniqueId } from '@shared/utils';
import { useState } from 'react';
import ChatForm from './ChatForm';
import WelcomeTitle from './WelcomeTitle';

export default function ChatFormContainer() {
  const [userInput, setUserInput] = useState<string>('');

  const {
    updateAlertMessage: updateErrorMessage,
    clearAlertMessage: clearErrorMessage,
  } = useAlertMessageStore();

  const isLoadingAssistantMessage = useMessageStore(
    (state) => state.isLoadingAssistantMessage,
  );

  const { currentChatId, isChatStarted, startChat } = useChatStore();

  const sendPromptToOllama = (messagesToSend: Message[], chatId: string) => {
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

      // Get the last message from completedMessages after completing the stream
      const storeState = useMessageStore.getState();
      const lastMessage =
        storeState.completedMessages[storeState.completedMessages.length - 1];

      // Save both user and assistant messages to database
      if (chatId && lastMessage && lastMessage.role === 'assistant') {
        const userMessage = messagesToSend[messagesToSend.length - 1];
        void window.electronApi
          .addMessageToChat(chatId, userMessage)
          .then(() => window.electronApi.addMessageToChat(chatId, lastMessage))
          .catch((error) => {
            console.error('Failed to save messages:', error);
          });
      }

      removeStreamListener();
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    // Create a new chat if none is selected
    if (!currentChatId) {
      try {
        await createNewChat({
          shouldStopChat: false,
          onError: () => {
            updateErrorMessage({
              message: 'Failed to create new chat. Try restarting the app.',
              type: 'error',
            });
          },
        });
      } catch {
        // Error is already handled by onError callback
        return;
      }
    }

    const userMessageId = generateUniqueId();
    const store = useMessageStore.getState();

    const newMessage = {
      id: userMessageId,
      role: 'user',
      content: userInput,
    };

    store.addUserMessage(userMessageId, userInput);

    const allMessages = store.streamingMessage
      ? [...store.completedMessages, store.streamingMessage, newMessage]
      : [...store.completedMessages, newMessage];

    // Ensure we have a chat started before sending the prompt
    if (!isChatStarted) {
      startChat();
    }

    // Pass the currentChatId directly to avoid closure issues
    sendPromptToOllama(allMessages, currentChatId!);
    setUserInput('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <WelcomeTitle />
      <ChatForm
        userInput={userInput}
        isLoadingAssistantMessage={isLoadingAssistantMessage}
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        onChange={handleChange}
      />
    </div>
  );
}
