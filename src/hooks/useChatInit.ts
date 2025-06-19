import { useAlertMessageStore, useChatStore } from '@/stores';
import { useEffect } from 'react';

export default function useChatInit() {
  useEffect(() => {
    const setChats = useChatStore.getState().setChats;
    const setLoading = useChatStore.getState().setLoading;
    const setCurrentChat = useChatStore.getState().setCurrentChat;
    const startChat = useChatStore.getState().startChat;
    const updateAlertError = useAlertMessageStore.getState().updateAlertMessage;

    const loadChats = async () => {
      try {
        setLoading(true);
        const chats = await window.electronApi.getChats();
        setChats(chats);

        // Set the current chat to the newest one if there are any chats
        if (chats.length > 0) {
          setCurrentChat(chats[0].id);
          startChat();
        }
      } catch (error) {
        console.error('Failed to load chats:', error);

        updateAlertError({
          message: 'Failed to load chats. Try restarting the app.',
          type: 'error',
        });

        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    void loadChats();
  }, []);
}
