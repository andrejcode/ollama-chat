import type { CopyStatus } from '@/types';
import { useState } from 'react';

export default function useCopyText() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyStatus('copied');

        setTimeout(() => {
          setCopyStatus('idle');
        }, 3000);
      })
      .catch(() => {
        setCopyStatus('error');

        setTimeout(() => {
          setCopyStatus('idle');
        }, 3000);
      });
  };

  return { copyStatus, handleCopy };
}
