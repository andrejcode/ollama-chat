import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AssistantMessage from '@/components/ChatContainer/Chat/AssistantMessage.tsx';
import { removeThinkingContent } from '@/utils';
import type { Message } from '@shared/types';

type CopyStatus = 'idle' | 'copied' | 'error';

interface ChatMessageProps {
  message: Message;
  isLoadingAssistantMessage?: boolean;
}

export default function ChatMessage({
  message,
  isLoadingAssistantMessage,
}: ChatMessageProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModelThinking, setIsModelThinking] = useState<boolean>(false);

  const startThinking = useCallback(() => {
    setIsModelThinking(true);
  }, []);

  const stopThinking = useCallback(() => {
    setIsModelThinking(false);
  }, []);

  const handleCopy = (text: string) => {
    const cleanedText = removeThinkingContent(text);

    navigator.clipboard
      .writeText(cleanedText)
      .then(() => {
        setCopyStatus('copied');
      })
      .catch(() => {
        setCopyStatus('error');
      });
  };

  useEffect(() => {
    if (copyStatus === 'copied' || copyStatus === 'error') {
      const timer = setTimeout(() => {
        setCopyStatus('idle');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const renderIcon = () => {
    if (copyStatus === 'copied') {
      return <Check size={14} />;
    } else if (copyStatus === 'error') {
      return <X size={14} />;
    } else {
      return <Copy size={14} />;
    }
  };

  return (
    <div
      className={clsx(
        'relative',
        message.role === 'user'
          ? 'self-end rounded-2xl bg-neutral-200 px-4 py-2 whitespace-pre-wrap dark:bg-neutral-700'
          : 'w-full max-w-4xl self-start',
      )}
      role="listitem"
      aria-label={
        message.role === 'user' ? 'Your message' : 'Assistant message'
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.role === 'user' ? (
        <div>{message.content}</div>
      ) : (
        <>
          <LoadingSpinner isLoading={!!isLoadingAssistantMessage} />
          {!isLoadingAssistantMessage && (
            <AssistantMessage
              content={message.content}
              isModelThinking={isModelThinking}
              onStartThinking={startThinking}
              onStopThinking={stopThinking}
            />
          )}
        </>
      )}

      {!isLoadingAssistantMessage && !isModelThinking && (
        <Button
          className={clsx(
            'absolute -bottom-6 rounded transition-opacity duration-500 ease-in-out focus:outline-none focus-visible:ring',
            message.role === 'user' ? 'right-0' : 'left-0',
            isHovered ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => handleCopy(message.content)}
          aria-label={
            copyStatus === 'copied'
              ? 'Copied to clipboard'
              : copyStatus === 'error'
                ? 'Failed to copy'
                : 'Copy to clipboard'
          }
          title="Copy to clipboard"
        >
          {renderIcon()}
        </Button>
      )}
    </div>
  );
}
