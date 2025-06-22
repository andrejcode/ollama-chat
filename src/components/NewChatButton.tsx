import { useAlertMessageStore, useSidebarStore } from '@/stores';
import { createNewChat } from '@/utils';
import { Plus } from 'lucide-react';
import Button from './ui/Button';

interface NewChatButtonProps {
  showOnlyWhenSidebarIsClosed?: boolean;
}

export default function NewChatButton({
  showOnlyWhenSidebarIsClosed = true,
}: NewChatButtonProps) {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  const updateAlertError = useAlertMessageStore(
    (state) => state.updateAlertMessage,
  );

  const handleNewChat = async () => {
    try {
      await createNewChat({
        shouldStopChat: true,
        onError: () => {
          updateAlertError({
            message: 'Failed to create new chat. Try restarting the app.',
            type: 'error',
          });
        },
      });
    } catch {
      // Error is already handled by onError callback
    }
  };

  if (showOnlyWhenSidebarIsClosed && isSidebarOpen) {
    return null;
  }

  return (
    <Button
      onClick={() => void handleNewChat()}
      aria-label="Start new chat"
      title="Start new chat"
    >
      <Plus />
    </Button>
  );
}
