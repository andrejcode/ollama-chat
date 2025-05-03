import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyTextButton from '@/components/CopyTextButton.tsx';
import useColorScheme from '@/hooks/useColorScheme.ts';
import useCopyText from '@/hooks/useCopyText.ts';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
  children: React.ReactNode;
}

export default function CodeBlock({
  language,
  children,
  ...rest
}: CodeBlockProps) {
  const { copyStatus, handleCopy } = useCopyText();
  const isDarkMode = useColorScheme();

  const codeText = String(children).replace(/\n$/, '');

  return (
    <div className="w-full rounded-lg border border-neutral-200 dark:border-none">
      <div className="flex items-center justify-between bg-neutral-200 px-2 py-1 dark:bg-neutral-700">
        <div className="text-neutral-800 dark:text-neutral-100">{language}</div>
        <CopyTextButton
          showCopyText={true}
          copyStatus={copyStatus}
          onClick={() => handleCopy(codeText)}
        />
      </div>
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        language={language}
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
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
}
