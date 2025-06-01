import { getStoreValue, setStoreValue } from '@electron/store';
import type { Message, Model } from '@shared/types';

export async function fetchChatStream(
  messages: Message[],
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const ollamaUrl = getStoreValue('ollamaUrl');
  const model = getStoreValue('currentModel');

  if (!ollamaUrl) {
    throw new Error('Ollama URL is not set.');
  }

  if (!model) {
    throw new Error('Model is not set.');
  }

  const chatResponse = await fetch(`${ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
    }),
  });

  if (!chatResponse.body) {
    throw new Error('No response body received.');
  }

  return chatResponse.body.getReader();
}

interface ModelsResponse {
  models: Model[];
}

export async function fetchModels(): Promise<ModelsResponse> {
  const ollamaUrl = getStoreValue('ollamaUrl');

  if (!ollamaUrl) {
    throw new Error('Ollama URL is not set.');
  }

  const response = await fetch(`${ollamaUrl}/api/tags`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Unable to get models.');
  }

  return (await response.json()) as ModelsResponse;
}

export async function checkOllamaHealth(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const ollamaUrl = getStoreValue('ollamaUrl');

    if (!ollamaUrl) {
      const status = {
        ok: false,
        message: 'Ollama URL is not set.',
      };
      setStoreValue('healthStatus', status);
      return status;
    }

    const response = await fetch(`${ollamaUrl}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const status = {
        ok: false,
        message: `Ollama server returned status: ${response.status}`,
      };
      setStoreValue('healthStatus', status);
      return status;
    }

    const data = await response.text();

    if (data !== 'Ollama is running') {
      const status = {
        ok: false,
        message: 'Unexpected response from Ollama server.',
      };
      setStoreValue('healthStatus', status);
      return status;
    }

    const status = {
      ok: true,
      message: 'Ollama is running.',
    };
    setStoreValue('healthStatus', status);
    return status;
  } catch (error) {
    const status = {
      ok: false,
      message:
        'Unable to connect to Ollama. Please check that the URL is correct and the service is running.',
    };
    setStoreValue('healthStatus', status);
    return status;
  }
}
