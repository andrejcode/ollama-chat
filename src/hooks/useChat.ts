import { useState } from 'react';

export default function useChat() {
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);

  const startChat = () => {
    setIsChatStarted(true);
  };

  const stopChat = () => {
    setIsChatStarted(false);
  };

  return {
    isChatStarted,
    startChat,
    stopChat,
  };
}
