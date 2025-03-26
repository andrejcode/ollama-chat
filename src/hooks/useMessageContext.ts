import { useContext } from 'react';
import MessageContext from '@/contexts/MessageContext';

export default function useMessageContext() {
  const context = useContext(MessageContext);

  if (context === null) {
    throw new Error('useMessageContext must be used within a MessagesProvider');
  }

  return context;
}
