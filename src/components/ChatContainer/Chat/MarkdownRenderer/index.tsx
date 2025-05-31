import CodeBlock from '@/components/ChatContainer/Chat/MarkdownRenderer/CodeBlock.tsx';
import clsx from 'clsx';
import 'katex/dist/katex.min.css';
import Markdown, { type Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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
        <CodeBlock language={match[1]} {...rest}>
          {children}
        </CodeBlock>
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
