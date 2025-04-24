import Markdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import clsx from 'clsx';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
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
    <div
      className={clsx(
        'prose dark:prose-invert max-w-4xl',
        "prose-code:before:content-[''] prose-code:after:content-['']",
        'prose-pre:bg-transparent prose-pre:p-0',
        className,
      )}
    >
      <Markdown {...markdownProps}>{content}</Markdown>
    </div>
  );
}
