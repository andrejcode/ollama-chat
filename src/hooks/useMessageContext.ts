import MessageContext from '@/contexts/MessageContext';
import { useContext } from 'react';

export default function useMessageContext() {
  const context = useContext(MessageContext);

  if (context === null) {
    throw new Error('useMessageContext must be used within a MessagesProvider');
  }

  return context;
}
