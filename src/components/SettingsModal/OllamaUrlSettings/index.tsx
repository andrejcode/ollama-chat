import Button from '@/components/ui/Button';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OllamaUrlSettings() {
  const { updateAlertMessage } = useAlertMessageContext();

  const [ollamaUrl, setOllamaUrl] = useState<string>('');

  useEffect(() => {
    const getOllamaUrl = async () => {
      try {
        const url = await window.electronApi.getOllamaUrl();
        setOllamaUrl(url);
      } catch (error) {
        setOllamaUrl('');
        console.error('Error fetching Ollama URL:', error);
      }
    };

    void getOllamaUrl();
  }, []);

  const updateOllamaUrl = async (url: string) => {
    try {
      const status = await window.electronApi.setOllamaUrl(url);

      if (status.ok) {
        updateAlertMessage({
          message: 'Ollama URL updated successfully.',
          type: 'success',
        });
      }
    } catch (error) {
      updateAlertMessage({
        message: 'An unexpected error occurred while updating the Ollama URL.',
        type: 'error',
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOllamaUrl(ollamaUrl.trim());
    void updateOllamaUrl(ollamaUrl.trim());
  };

  return (
    <div className="flex items-center justify-between">
      <h3 id="ollama-url-heading">Ollama URL</h3>
      <form
        className="flex items-center justify-between gap-0.5 rounded border border-neutral-300 p-2 dark:border-neutral-500"
        onSubmit={handleSubmit}
      >
        <input
          className="border-none focus:outline-none"
          type="text"
          value={ollamaUrl}
          onChange={(event) => setOllamaUrl(event.target.value)}
          placeholder="http://localhost:11434"
          aria-labelledby="ollama-url-heading"
        />
        <Button type="submit" disabled={ollamaUrl.trim() === ''}>
          <Save size={16} />
        </Button>
      </form>
    </div>
  );
}
