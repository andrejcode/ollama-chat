import { useState } from 'react';
import { Message } from '@shared/types';
import MessageContext from '@/contexts/MessageContext';

export default function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingAssistantMessage, setIsLoadingAssistantMessage] =
    useState<boolean>(false);

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
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
