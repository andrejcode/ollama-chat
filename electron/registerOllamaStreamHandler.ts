import type { OllamaStreamResponse } from './types';
import type { Message } from '@shared/types';
import { ipcMain } from 'electron';
import { wrapAsync } from '@shared/utils';
import { processNDJSONStream } from './utils';
import { fetchChatStream } from './api';

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
          (errorMessage) => {
            event.sender.send('ollama-stream-error', errorMessage);
          },
          () => {
            event.sender.send('ollama-stream-complete');
          },
        );
      } catch {
        const errorMessage =
          'Unable to connect to Ollama. Please check that the Ollama app is running on your computer and try again. If the problem persists, try restarting Ollama.';
        event.sender.send('ollama-stream-error', errorMessage);
      }
    }),
  );
}
