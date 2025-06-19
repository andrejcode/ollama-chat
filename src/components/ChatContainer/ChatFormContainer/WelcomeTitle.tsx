import { useChatStore } from '@/stores';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function WelcomeTitle() {
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const isChatStarted = useChatStore((store) => store.isChatStarted);

  useEffect(() => {
    if (isChatStarted) {
      // Remove the element after the fade-out transition completes
      const timeout = setTimeout(() => setShowTitle(false), 500);

      return () => clearTimeout(timeout);
    } else {
      // Show the title immediately when chat is not started
      setShowTitle(true);
    }
  }, [isChatStarted]);

  return (
    showTitle && (
      <h1
        className={clsx(
          'mb-4 self-start text-2xl transition-opacity duration-500 ease-out sm:text-3xl md:text-4xl',
          isChatStarted ? 'opacity-0' : 'opacity-100',
        )}
        data-testid="welcome-title"
      >
        Welcome to OllamaChat
      </h1>
    )
  );
}
