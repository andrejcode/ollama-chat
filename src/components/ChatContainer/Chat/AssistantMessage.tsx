import clsx from 'clsx';
import { useEffect, useState } from 'react';
import MarkdownRenderer from '@/components/ChatContainer/Chat/MarkdownRenderer';
import ChevronToggleButton from '@/components/ChevronToggleButton';
import useMessageContext from '@/hooks/useMessageContext.ts';
import {
  CLOSING_THINK_TAG_PATTERN,
  OPENING_THINK_TAG_PATTERN,
  THINK_TAG_SPLIT_PATTERN,
} from '@/constants';
import { wrapBoxedMathInDollarSigns } from '@/utils';

export default function AssistantMessage({
  content,
  isModelThinking,
  onStartThinking,
  onStopThinking,
}: {
  content: string;
  isModelThinking: boolean;
  onStartThinking: () => void;
  onStopThinking: () => void;
}) {
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>(
    {},
  );

  const { isStreamMessageComplete } = useMessageContext();

  const splitSegments = content.split(THINK_TAG_SPLIT_PATTERN);

  useEffect(() => {
    const firstOpeningThinkTagMatch = content.match(OPENING_THINK_TAG_PATTERN);
    const hasClosingThinkTag = CLOSING_THINK_TAG_PATTERN.test(content);

    if (firstOpeningThinkTagMatch) {
      onStartThinking();
    }

    if (hasClosingThinkTag || isStreamMessageComplete) {
      onStopThinking();
    }
  }, [content, isStreamMessageComplete, onStartThinking, onStopThinking]);

  const toggleExpand = (segmentIndex: number) => {
    setExpandedStates((prev) => ({
      ...prev,
      [segmentIndex]: !prev[segmentIndex],
    }));
  };

  return splitSegments.map((segmentText, segmentIndex) => {
    // Process the content before rendering
    const processedText = wrapBoxedMathInDollarSigns(segmentText);

    // Odd indices correspond to a text inside a <think>-style tag pair
    const isThinkBlock = segmentIndex % 2 === 1;
    if (isThinkBlock) {
      const isExpanded = Boolean(expandedStates[segmentIndex]);
      const isEmpty = processedText.trim() === '';

      return (
        <div key={segmentIndex} className="mb-3">
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
            isOpen={isExpanded}
            onToggle={() => toggleExpand(segmentIndex)}
          />
          {isExpanded && !isEmpty && (
            <MarkdownRenderer
              content={processedText}
              className="text-neutral-italic mt-2 dark:text-neutral-400"
            />
          )}
        </div>
      );
    }

    return <MarkdownRenderer key={segmentIndex} content={processedText} />;
  });
}
