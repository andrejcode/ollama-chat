import { SendHorizonal } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ChatFormProps {
  isStreamComplete: boolean;
  userInput: string;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function ChatForm({
  isStreamComplete,
  userInput,
  isLoading,
  onSubmit,
  onChange,
}: ChatFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleGlobalKeyDown = () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get the correct scrollHeight value
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [userInput]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      onSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      className="mb-4 flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow dark:border-none dark:bg-neutral-700"
      onSubmit={onSubmit}
    >
      <textarea
        ref={textareaRef}
        className="'mr-4 max-h-[200px] w-full resize-none overflow-y-auto focus:outline-none"
        placeholder="Ask anything"
        value={userInput}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        disabled={isLoading || userInput.length === 0 || !isStreamComplete}
        className="cursor-pointer rounded-full bg-neutral-800 p-2.5 text-neutral-100 shadow-md transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 disabled:cursor-not-allowed dark:bg-neutral-100 dark:text-neutral-800 dark:hover:bg-neutral-200"
      >
        <SendHorizonal size={20} />
      </button>
    </form>
  );
}
