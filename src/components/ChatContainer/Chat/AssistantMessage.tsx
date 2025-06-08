import MarkdownRenderer from '@/components/ChatContainer/Chat/MarkdownRenderer';
import ChevronToggleButton from '@/components/ChevronToggleButton';
import {
  CLOSING_THINK_TAG_PATTERN,
  OPENING_THINK_TAG_PATTERN,
} from '@/constants';
import { useMessageStore } from '@/stores';
import { wrapBoxedMathInDollarSigns } from '@/utils';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface AssistantMessageProps {
  content: string;
  isStreaming: boolean;
  isModelThinking: boolean;
  onStartThinking: () => void;
  onStopThinking: () => void;
}

export default function AssistantMessage({
  content,
  isStreaming,
  isModelThinking,
  onStartThinking,
  onStopThinking,
}: AssistantMessageProps) {
  const isStreamMessageComplete = useMessageStore((state) =>
    isStreaming ? state.isStreamMessageComplete : true,
  );

  const [isThinkingExpanded, setIsThinkingExpanded] = useState<boolean>(false);

  // Check if content starts with an opening think tag
  const trimmedContent = content.trimStart();
  const startsWithThinkTag = OPENING_THINK_TAG_PATTERN.test(trimmedContent);

  // Extract thinking content and remaining content
  let thinkingContent = '';
  let remainingContent = content;

  if (startsWithThinkTag) {
    const firstOpeningMatch = trimmedContent.match(OPENING_THINK_TAG_PATTERN);
    if (firstOpeningMatch) {
      const openingTagEnd =
        firstOpeningMatch.index! + firstOpeningMatch[0].length;
      const closingMatch = trimmedContent.match(CLOSING_THINK_TAG_PATTERN);

      if (closingMatch) {
        // Found both opening and closing tags
        thinkingContent = trimmedContent.slice(
          openingTagEnd,
          closingMatch.index,
        );
        remainingContent = trimmedContent.slice(
          closingMatch.index! + closingMatch[0].length,
        );
      } else {
        // Only opening tag found, take everything after it as thinking content
        thinkingContent = trimmedContent.slice(openingTagEnd);
        remainingContent = '';
      }
    }
  }

  useEffect(() => {
    if (startsWithThinkTag) {
      onStartThinking();
    }

    const hasClosingThinkTag = CLOSING_THINK_TAG_PATTERN.test(content);
    if (hasClosingThinkTag || isStreamMessageComplete) {
      onStopThinking();
    }
  }, [
    content,
    isStreamMessageComplete,
    onStartThinking,
    onStopThinking,
    startsWithThinkTag,
  ]);

  const toggleThinkingExpand = () => {
    setIsThinkingExpanded((prev) => !prev);
  };

  return (
    <>
      {startsWithThinkTag && (
        <div className="mb-3">
          <ChevronToggleButton
            buttonText="Thinking"
            textClassName={clsx(
              !isModelThinking && 'text-neutral-600 dark:text-neutral-400',
              isModelThinking && [
                'text-transparent',
                'bg-clip-text',
                'bg-gradient-to-r from-neutral-600 via-neutral-400 to-white dark:from-neutral-800 dark:via-neutral-600 dark:to-neutral-100',
                'bg-[length:200%_100%]',
                'bg-[position:-100%_0]',
                'will-change-[background-position]',
                'animate-wipe',
              ],
            )}
            isOpen={isThinkingExpanded}
            onToggle={toggleThinkingExpand}
          />
          {isThinkingExpanded && thinkingContent.trim() !== '' && (
            <MarkdownRenderer
              content={wrapBoxedMathInDollarSigns(thinkingContent)}
              className="text-neutral-italic mt-2 text-neutral-500 dark:text-neutral-400"
            />
          )}
        </div>
      )}
      {remainingContent.trim() !== '' && (
        <MarkdownRenderer
          content={wrapBoxedMathInDollarSigns(remainingContent)}
        />
      )}
    </>
  );
}
