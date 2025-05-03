import clsx from 'clsx';
import useColorScheme from '@/hooks/useColorScheme.ts';
import Markdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  const isDarkMode = useColorScheme();

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
        <div className="w-full rounded-lg border border-neutral-200 dark:border-none">
          <div className="bg-neutral-200 px-2 py-1 dark:bg-neutral-700">
            <div className="text-neutral-800 dark:text-neutral-100">
              {match[1]}
            </div>
          </div>
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            language={match[1]}
            style={isDarkMode ? oneDark : oneLight}
            customStyle={{
              width: '100%',
              minWidth: '100%',
              margin: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      );
    },
    pre: ({ children, ...rest }) => (
      <pre className="w-full min-w-full" {...rest}>
        {children}
      </pre>
    ),
  };

  const markdownProps = {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeRaw, rehypeSanitize, rehypeKatex],
    components: markdownComponents,
  };

  return (
    <div
      className={clsx(
        'prose dark:prose-invert w-full min-w-full',
        "prose-code:before:content-[''] prose-code:after:content-['']",
        'prose-pre:bg-transparent prose-pre:p-0 prose-pre:w-full',
        className,
      )}
    >
      <Markdown {...markdownProps}>{content}</Markdown>
    </div>
  );
}
