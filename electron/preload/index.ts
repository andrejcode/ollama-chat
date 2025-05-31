import { IpcChannels } from '@electron/types';
import type { ElectronApi, Message, Model } from '@shared/types';
import { contextBridge, ipcRenderer } from 'electron';

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

  getSidebarState: () =>
    ipcRenderer.sendSync(IpcChannels.GET_IS_SIDEBAR_OPEN) as boolean,
  setSidebarState: (isOpen: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_IS_SIDEBAR_OPEN, isOpen),

  getOllamaUrl: () => ipcRenderer.invoke(IpcChannels.OLLAMA_URL_GET),
  setOllamaUrl: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OLLAMA_URL_CHANGE, url),

  getHealthStatus: () => ipcRenderer.invoke(IpcChannels.OLLAMA_GET_HEALTH),
  checkOllamaHealth: () => ipcRenderer.invoke(IpcChannels.OLLAMA_HEALTH_CHECK),
  onOllamaHealthStatus: (
    callback: (status: { ok: boolean; message: string }) => void,
  ) => {
    const boundCallback = (
      _event: Electron.IpcRendererEvent,
      status: { ok: boolean; message: string },
    ) => callback(status);
    ipcRenderer.on(IpcChannels.OLLAMA_HEALTH_STATUS, boundCallback);

    return () =>
      ipcRenderer.removeListener(
        IpcChannels.OLLAMA_HEALTH_STATUS,
        boundCallback,
      );
  },

  getModels: () => ipcRenderer.invoke(IpcChannels.OLLAMA_MODELS_GET),
  onModelsUpdated: (callback: (models: Model[]) => void) => {
    const boundCallback = (
      _event: Electron.IpcRendererEvent,
      models: Model[],
    ) => callback(models);
    ipcRenderer.on(IpcChannels.OLLAMA_MODELS_UPDATED, boundCallback);

    return () =>
      ipcRenderer.removeListener(
        IpcChannels.OLLAMA_MODELS_UPDATED,
        boundCallback,
      );
  },

  getCurrentModel: () =>
    ipcRenderer.invoke(IpcChannels.OLLAMA_GET_CURRENT_MODEL),
  setCurrentModel: (modelName: string) =>
    ipcRenderer.invoke(IpcChannels.OLLAMA_SET_CURRENT_MODEL, modelName),
  onCurrentModelChanged: (callback: (modelName: string) => void) => {
    const boundCallback = (
      _event: Electron.IpcRendererEvent,
      modelName: string,
    ) => callback(modelName);
    ipcRenderer.on(IpcChannels.OLLAMA_SET_CURRENT_MODEL, boundCallback);

    return () =>
      ipcRenderer.removeListener(
        IpcChannels.OLLAMA_SET_CURRENT_MODEL,
        boundCallback,
      );
  },

  getTheme: () => ipcRenderer.invoke(IpcChannels.THEME_GET),
  setThemeDark: () => ipcRenderer.invoke(IpcChannels.THEME_DARK),
  setThemeLight: () => ipcRenderer.invoke(IpcChannels.THEME_LIGHT),
  setThemeSystem: () => ipcRenderer.invoke(IpcChannels.THEME_SYSTEM),
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
