import { ipcRenderer, contextBridge } from 'electron';
import type { ElectronApi, Message } from '@shared/types';

const electronApi: ElectronApi = {
  sendPrompt: (messages: Message[]) =>
    ipcRenderer.send('ollama-stream', messages),
  onStreamResponse: (callback: (data: string) => void) => {
    const boundCallback = (_event: Electron.IpcRendererEvent, data: string) =>
      callback(data);
    ipcRenderer.on('ollama-stream-response', boundCallback);

    return () =>
      ipcRenderer.removeListener('ollama-stream-response', boundCallback);
  },
  onStreamError: (callback: (error: string) => void) => {
    const boundCallback = (_event: Electron.IpcRendererEvent, error: string) =>
      callback(error);
    ipcRenderer.once('ollama-stream-error', boundCallback);
  },
  onStreamComplete: (callback: () => void) => {
    const boundCallback = () => callback();
    ipcRenderer.once('ollama-stream-complete', boundCallback);
  },
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
