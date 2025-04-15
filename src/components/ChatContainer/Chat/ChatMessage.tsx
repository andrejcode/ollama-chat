import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import { Message } from '@shared/types';

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

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
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
        'relative m-3',
        message.role === 'user'
          ? 'self-end rounded-2xl bg-neutral-200 px-4 py-2 whitespace-pre-wrap dark:bg-neutral-700'
          : 'self-start',
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
            <MarkdownRenderer content={message.content} />
          )}
        </>
      )}

      <Button
        className={clsx(
          'absolute -bottom-6 rounded transition-opacity duration-500 ease-in-out focus:outline-none focus-visible:ring',
          message.role === 'user' ? 'right-0' : 'left-0',
          isHovered
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
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
    </div>
  );
}
