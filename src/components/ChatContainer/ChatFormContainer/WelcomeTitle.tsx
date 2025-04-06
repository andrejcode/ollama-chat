import clsx from 'clsx';
import { useState, useEffect } from 'react';

export default function WelcomeTitle({
  isChatStarted,
}: {
  isChatStarted: boolean;
}) {
  const [showTitle, setShowTitle] = useState<boolean>(true);

  useEffect(() => {
    if (isChatStarted) {
      // Remove the element after the fade-out transition completes
      const timeout = setTimeout(() => setShowTitle(false), 500);

      return () => clearTimeout(timeout);
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
