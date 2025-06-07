import type { Message } from '@shared/types';
import { create } from 'zustand';

interface MessageState {
  completedMessages: Message[];
  streamingMessage: Message | null;

  isLoadingAssistantMessage: boolean;
  isStreamMessageComplete: boolean;

  addUserMessage: (userMessageId: string, content: string) => void;
  startAssistantMessage: (assistantMessageId: string) => void;
  updateStreamingMessage: (contentChunk: string) => void;
  completeStreamingMessage: () => void;
  startLoadingAssistantMessage: () => void;
  stopLoadingAssistantMessage: () => void;
  startStreamMessage: () => void;
  stopStreamMessage: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  completedMessages: [],
  streamingMessage: null,
  isLoadingAssistantMessage: false,
  isStreamMessageComplete: true,

  addUserMessage: (userMessageId: string, content: string) =>
    set((state) => ({
      completedMessages: [
        ...state.completedMessages,
        { id: userMessageId, role: 'user', content },
      ],
    })),

  startAssistantMessage: (assistantMessageId: string) =>
    set({
      streamingMessage: {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
      },
    }),

  updateStreamingMessage: (contentChunk: string) =>
    set((state) => ({
      streamingMessage: state.streamingMessage
        ? {
            ...state.streamingMessage,
            content: state.streamingMessage.content + contentChunk,
          }
        : null,
    })),

  completeStreamingMessage: () =>
    set((state) => ({
      completedMessages: state.streamingMessage
        ? [...state.completedMessages, state.streamingMessage]
        : state.completedMessages,
      streamingMessage: null,
    })),

  startLoadingAssistantMessage: () => set({ isLoadingAssistantMessage: true }),
  stopLoadingAssistantMessage: () => set({ isLoadingAssistantMessage: false }),
  startStreamMessage: () => set({ isStreamMessageComplete: false }),
  stopStreamMessage: () => set({ isStreamMessageComplete: true }),
}));
