import { ipcRenderer, contextBridge } from 'electron';
import type { ElectronApi, Message } from '@shared/types';
import { IpcChannels } from '@electron/types';

const electronApi: ElectronApi = {
  sendPrompt: (messages: Message[]) =>
    ipcRenderer.send(IpcChannels.OLLAMA_STREAM, messages),
  onStreamResponse: (callback: (data: string) => void) => {
    const boundCallback = (_event: Electron.IpcRendererEvent, data: string) =>
      callback(data);
    ipcRenderer.on(IpcChannels.OLLAMA_RESPONSE, boundCallback);

    return () =>
      ipcRenderer.removeListener(IpcChannels.OLLAMA_RESPONSE, boundCallback);
  },
  onStreamError: (callback: (errorMessage: string) => void) => {
    const boundCallback = (
      _event: Electron.IpcRendererEvent,
      errorMessage: string,
    ) => callback(errorMessage);
    ipcRenderer.once(IpcChannels.OLLAMA_ERROR, boundCallback);
  },
  onStreamComplete: (callback: () => void) => {
    const boundCallback = () => callback();
    ipcRenderer.once(IpcChannels.OLLAMA_COMPLETE, boundCallback);
  },

  setThemeDark: () => ipcRenderer.invoke(IpcChannels.THEME_DARK),
  setThemeLight: () => ipcRenderer.invoke(IpcChannels.THEME_LIGHT),
  setThemeSystem: () => ipcRenderer.invoke(IpcChannels.THEME_SYSTEM),

  getStoreValue: <T>(key: string) =>
    ipcRenderer.invoke(IpcChannels.STORE_GET, key) as Promise<T>,
  setStoreValue: (key: string, value: unknown) =>
    ipcRenderer.invoke(IpcChannels.STORE_SET, key, value),
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
