import { useState } from 'react';

export default function useError() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const updateErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  return { errorMessage, clearErrorMessage, updateErrorMessage };
}
