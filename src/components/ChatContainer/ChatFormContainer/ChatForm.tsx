import useMessageContext from '@/hooks/useMessageContext.ts';
import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ChatFormProps {
  userInput: string;
  isLoadingAssistantMessage: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function ChatForm({
  userInput,
  isLoadingAssistantMessage,
  onSubmit,
  onChange,
}: ChatFormProps) {
  const { isStreamMessageComplete } = useMessageContext();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let modifierActive = false;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        modifierActive = true;
        return;
      }

      if (modifierActive) {
        return;
      }

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    const handleGlobalKeyUp = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        modifierActive = false;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
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

      // If loading is in progress or the stream is not complete, don't submit
      if (isLoadingAssistantMessage || !isStreamMessageComplete) {
        return;
      }

      onSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      className="mb-4 flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow dark:border-none dark:bg-neutral-700"
      onSubmit={onSubmit}
      data-testid="chat-form"
    >
      <textarea
        ref={textareaRef}
        className="'mr-4 max-h-[200px] w-full resize-none overflow-y-auto text-neutral-800 focus:outline-none dark:text-neutral-100"
        placeholder="Ask anything"
        value={userInput}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        disabled={
          isLoadingAssistantMessage ||
          userInput.length === 0 ||
          !isStreamMessageComplete
        }
        className="cursor-pointer rounded-full bg-neutral-800 p-2.5 text-neutral-100 shadow-md transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 disabled:cursor-not-allowed dark:bg-neutral-100 dark:text-neutral-800 dark:hover:bg-neutral-200"
      >
        <SendHorizontal size={20} />
      </button>
    </form>
  );
}
