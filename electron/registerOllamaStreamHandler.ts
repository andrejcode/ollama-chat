import type { Message, OllamaStreamResponse } from '@shared/types';
import { ipcMain } from 'electron';
import { wrapAsync } from '@shared/utils';
import { processNDJSONStream } from './utils';

async function fetchChatStream(
  messages: Message[],
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const chatResponse = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma2:latest',
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
    }),
  });

  if (!chatResponse.body) {
    throw new Error('No response body received');
  }

  return chatResponse.body.getReader();
}

export default function registerOllamaStreamHandler() {
  ipcMain.on(
    'ollama-stream',
    wrapAsync(async (event: Electron.IpcMainEvent, messages: Message[]) => {
      try {
        const streamReader = await fetchChatStream(messages);

        await processNDJSONStream(
          streamReader,
          (parsedData: OllamaStreamResponse) => {
            if (!parsedData.done) {
              event.sender.send(
                'ollama-stream-response',
                parsedData.message.content,
              );
            }
          },
          (errorMessage: string) => {
            event.sender.send('ollama-stream-error', errorMessage);
          },
          () => {
            event.sender.send('ollama-stream-complete');
          },
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        event.sender.send('ollama-stream-error', errorMessage);
      }
    }),
  );
}
