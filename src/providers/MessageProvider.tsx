import MessageContext from '@/contexts/MessageContext';
import { Message } from '@shared/types';
import { ReactNode, useState } from 'react';

export default function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingAssistantMessage, setIsLoadingAssistantMessage] =
    useState<boolean>(false);
  const [isStreamMessageComplete, setIsStreamMessageComplete] =
    useState<boolean>(true);

  const addEmptyAssistantMessage = (assistantMessageId: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: assistantMessageId, role: 'assistant', content: '' },
    ]);
  };

  const updateAssistantMessage = (
    assistantMessageId: string,
    contentChunk: string,
  ) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === assistantMessageId
          ? { ...message, content: message.content + contentChunk }
          : message,
      ),
    );
  };

  const addUserMessage = (userMessageId: string, content: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: userMessageId, role: 'user', content },
    ]);
  };

  const startLoadingAssistantMessage = () => {
    setIsLoadingAssistantMessage(true);
  };

  const stopLoadingAssistantMessage = () => {
    setIsLoadingAssistantMessage(false);
  };

  const startStreamMessage = () => {
    setIsStreamMessageComplete(false);
  };

  const stopStreamMessage = () => {
    setIsStreamMessageComplete(true);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        addEmptyAssistantMessage,
        updateAssistantMessage,
        addUserMessage,
        isLoadingAssistantMessage,
        startLoadingAssistantMessage,
        stopLoadingAssistantMessage,
        isStreamMessageComplete,
        startStreamMessage,
        stopStreamMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
