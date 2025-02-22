import { ipcRenderer, contextBridge } from 'electron';
import { ElectronApi } from '@shared/types';

const electronApi: ElectronApi = {
  sendPrompt: (prompt: string) => ipcRenderer.send('ollama-stream', prompt),
  onStreamResponse: (callback: (data: string) => void) =>
    ipcRenderer.on(
      'ollama-stream-response',
      (_event: Electron.IpcRendererEvent, data: string) => callback(data),
    ),
  onStreamError: (callback: (error: string) => void) =>
    ipcRenderer.on(
      'ollama-stream-error',
      (_event: Electron.IpcRendererEvent, error: string) => callback(error),
    ),
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
