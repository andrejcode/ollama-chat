import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
  CLOSING_THINK_TAG_PATTERN,
  OPENING_THINK_TAG_PATTERN,
  THINK_TAG_SPLIT_PATTERN,
} from '@/constants';
import ChevronToggleButton from '@/components/ChevronToggleButton';
import useMessageContext from '@/hooks/useMessageContext.ts';
import Markdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>(
    {},
  );
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const { isStreamMessageComplete } = useMessageContext();

  // Process the content to wrap \boxed{} expressions in $ signs for KaTeX rendering
  const wrapBoxedMathInDollarSigns = (text: string) => {
    return text.replace(/\\boxed\{[^}]+}/g, (match) => {
      // Only wrap in $ if not already wrapped
      if (!match.startsWith('$')) {
        return `$${match}$`;
      }
      return match;
    });
  };

  const splitSegments = content.split(THINK_TAG_SPLIT_PATTERN);

  useEffect(() => {
    const firstOpeningThinkTagMatch = content.match(OPENING_THINK_TAG_PATTERN);
    const hasClosingThinkTag = CLOSING_THINK_TAG_PATTERN.test(content);

    if (firstOpeningThinkTagMatch) {
      setIsThinking(true);
    }

    if (hasClosingThinkTag || isStreamMessageComplete) {
      setIsThinking(false);
    }
  }, [content, isStreamMessageComplete]);

  const toggleExpand = (segmentIndex: number) => {
    setExpandedStates((prev) => ({
      ...prev,
      [segmentIndex]: !prev[segmentIndex],
    }));
  };

  const markdownComponents: Components = {
    code: ({
      children,
      className,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ref,
      ...rest
    }) => {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          language={match[1]}
          style={oneDark}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      );
    },
  };

  const markdownProps = {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeRaw, rehypeSanitize, rehypeKatex],
    components: markdownComponents,
  };

  return (
    <div className="prose dark:prose-invert prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-transparent prose-pre:p-0 max-w-4xl">
      {splitSegments.map((segmentText, segmentIndex) => {
        // Process the content before rendering
        const processedText = wrapBoxedMathInDollarSigns(segmentText);

        // Odd indices correspond to a text inside a <think>-style tag pair
        const isThinkBlock = segmentIndex % 2 === 1;
        if (isThinkBlock) {
          const isExpanded = Boolean(expandedStates[segmentIndex]);
          const isEmpty = processedText.trim() === '';

          return (
            <div key={segmentIndex}>
              <ChevronToggleButton
                buttonText="Thinking"
                textClassName={clsx(
                  !isThinking && 'text-neutral-600 dark:text-neutral-400',
                  isThinking && [
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
                <div className="text-neutral-italic dark:text-neutral-400">
                  <Markdown {...markdownProps}>{processedText}</Markdown>
                </div>
              )}
            </div>
          );
        }

        return (
          <Markdown key={segmentIndex} {...markdownProps}>
            {processedText}
          </Markdown>
        );
      })}
    </div>
  );
}
