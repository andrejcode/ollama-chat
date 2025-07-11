import AssistantMessage from '@/components/ChatContainer/Chat/AssistantMessage.tsx';
import CopyTextButton from '@/components/CopyTextButton.tsx';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useCopyText from '@/hooks/useCopyText.ts';
import { removeThinkingContent } from '@/utils';
import type { Message } from '@shared/types';
import clsx from 'clsx';
import { memo, useCallback, useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isLoadingAssistantMessage?: boolean;
  isStreaming?: boolean;
}

const ChatMessage = memo(function ChatMessage({
  message,
  isLoadingAssistantMessage,
  isStreaming = false,
}: ChatMessageProps) {
  const { copyStatus, handleCopy } = useCopyText();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModelThinking, setIsModelThinking] = useState<boolean>(false);

  const startThinking = useCallback(() => {
    setIsModelThinking(true);
  }, []);

  const stopThinking = useCallback(() => {
    setIsModelThinking(false);
  }, []);

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
          <LoadingSpinner
            isLoading={!!isLoadingAssistantMessage}
            className="self-start"
          />
          {!isLoadingAssistantMessage && (
            <AssistantMessage
              content={message.content}
              isModelThinking={isModelThinking}
              onStartThinking={startThinking}
              onStopThinking={stopThinking}
              isStreaming={isStreaming}
            />
          )}
        </>
      )}

      {!isLoadingAssistantMessage && !isModelThinking && (
        <CopyTextButton
          className={clsx(
            'absolute -bottom-5',
            message.role === 'user' ? 'right-0' : 'left-0',
            isHovered ? 'opacity-100' : 'opacity-0',
          )}
          copyStatus={copyStatus}
          onClick={() => {
            const cleanedText = removeThinkingContent(message.content);
            handleCopy(cleanedText);
          }}
        />
      )}
    </div>
  );
});

export default ChatMessage;
