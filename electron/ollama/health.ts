import { getStoreValue } from '@electron/store';

export async function checkOllamaHealth(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const ollamaUrl = getStoreValue('ollamaUrl');

    if (!ollamaUrl) {
      return {
        ok: false,
        message: 'Ollama URL is not set.',
      };
    }

    const response = await fetch(ollamaUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return {
        ok: false,
        message: `Ollama server returned status: ${response.status}`,
      };
    }

    const data = await response.text();

    if (data !== 'Ollama is running') {
      return {
        ok: false,
        message: 'Unexpected response from Ollama server.',
      };
    }

    return {
      ok: true,
      message: 'Ollama is running.',
    };
  } catch {
    return {
      ok: false,
      message:
        'Unable to connect to Ollama. Please check that the URL is correct and the service is running.',
    };
  }
}
