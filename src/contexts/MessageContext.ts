import type { Message } from '@shared/types';
import { createContext } from 'react';

interface MessageContextType {
  messages: Message[];
  addEmptyAssistantMessage: (assistantMessageId: string) => void;
  updateAssistantMessage: (
    assistantMessageId: string,
    contentChunk: string,
  ) => void;
  addUserMessage: (userMessageId: string, content: string) => void;
  isLoadingAssistantMessage: boolean;
  startLoadingAssistantMessage: () => void;
  stopLoadingAssistantMessage: () => void;
  isStreamMessageComplete: boolean;
  startStreamMessage: () => void;
  stopStreamMessage: () => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export default MessageContext;
