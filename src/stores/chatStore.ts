import type { Chat } from '@shared/types';
import { create } from 'zustand';

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  isChatStarted: boolean;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  setCurrentChat: (chatId: string | null) => void;

  setLoading: (loading: boolean) => void;
  startChat: () => void;
  stopChat: () => void;

  getCurrentChat: () => Chat | null;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChatId: null,
  isLoading: false,
  isChatStarted: false,

  setChats: (chats: Chat[]) => set({ chats }),

  addChat: (chat: Chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),

  setCurrentChat: (chatId: string | null) => set({ currentChatId: chatId }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  startChat: () => set({ isChatStarted: true }),
  stopChat: () => set({ isChatStarted: false }),

  getCurrentChat: () => {
    const { chats, currentChatId } = get();
    return chats.find((chat) => chat.id === currentChatId) || null;
  },
}));
