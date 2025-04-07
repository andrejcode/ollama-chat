import { IpcChannels, type OllamaStreamResponse } from '../types';
import type { Message } from '@shared/types';
import { ipcMain } from 'electron';
import { wrapAsync } from '@shared/utils';
import { processNDJSONStream } from '../utils';
import { fetchChatStream } from './api';
import { setStoreValue } from '@electron/store';
import { checkOllamaHealth } from './health';

export function registerOllamaHandlers() {
  ipcMain.on(
    IpcChannels.OLLAMA_STREAM,
    wrapAsync(async (event: Electron.IpcMainEvent, messages: Message[]) => {
      try {
        const streamReader = await fetchChatStream(messages);

        await processNDJSONStream(
          streamReader,
          (parsedData: OllamaStreamResponse) => {
            if (!parsedData.done) {
              event.sender.send(
                IpcChannels.OLLAMA_RESPONSE,
                parsedData.message.content,
              );
            }
          },
          (errorMessage) => {
            event.sender.send(IpcChannels.OLLAMA_ERROR, errorMessage);
          },
          () => {
            event.sender.send(IpcChannels.OLLAMA_COMPLETE);
          },
        );
      } catch {
        const errorMessage =
          'Unable to connect to Ollama. Please check that the Ollama app is running on your computer and try again. If the problem persists, try restarting Ollama.';
        event.sender.send(IpcChannels.OLLAMA_ERROR, errorMessage);
      }
    }),
  );

  ipcMain.handle(IpcChannels.OLLAMA_URL_CHANGE, (_event, url: string) => {
    setStoreValue('ollamaUrl', url);
    return true;
  });

  ipcMain.handle(IpcChannels.OLLAMA_HEALTH_CHECK, async () => {
    return await checkOllamaHealth();
  });
}
