import { IpcChannels, type OllamaStreamResponse } from '../types';
import type { Message } from '@shared/types';
import { BrowserWindow, ipcMain } from 'electron';
import { wrapAsync } from '@shared/utils';
import { processNDJSONStream } from '../utils';
import { fetchChatStream } from './api';
import { getStoreValue, setStoreValue } from '@electron/store';
import { performHealthCheckAndUpdateModels } from './health';

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

  ipcMain.handle(IpcChannels.OLLAMA_URL_CHANGE, async (event, url: string) => {
    setStoreValue('ollamaUrl', url);

    const window = BrowserWindow.fromWebContents(event.sender);
    return await performHealthCheckAndUpdateModels(window);
  });

  ipcMain.handle(IpcChannels.OLLAMA_GET_HEALTH, () => {
    return getStoreValue('healthStatus');
  });

  ipcMain.handle(IpcChannels.OLLAMA_HEALTH_CHECK, async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    return await performHealthCheckAndUpdateModels(window);
  });

  ipcMain.handle(IpcChannels.OLLAMA_MODELS_GET, () => {
    return getStoreValue('models') || null;
  });

  ipcMain.handle(IpcChannels.OLLAMA_GET_CURRENT_MODEL, () => {
    return getStoreValue('currentModel');
  });

  ipcMain.handle(
    IpcChannels.OLLAMA_SET_CURRENT_MODEL,
    (_event, modelName: string) => {
      setStoreValue('currentModel', modelName);
      return true;
    },
  );
}

export function initializeOllama(window: BrowserWindow) {
  performHealthCheckAndUpdateModels(window)
    .then((health) => {
      console.log('Initial Ollama health check:', health.ok ? 'OK' : 'Failed');
    })
    .catch((error) => {
      console.error('Error during initial Ollama health check:', error);
    });

  // Set up periodic health checks every 5 minutes
  const checkInterval = setInterval(
    () => {
      if (window.isDestroyed()) {
        clearInterval(checkInterval);
        return;
      }

      performHealthCheckAndUpdateModels(window).catch((error) => {
        console.error('Error during periodic Ollama health check:', error);
      });
    },
    5 * 60 * 1000,
  );

  window.on('closed', () => {
    clearInterval(checkInterval);
  });
}
