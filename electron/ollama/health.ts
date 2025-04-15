import { getStoreValue, setStoreValue } from '@electron/store';
import { BrowserWindow } from 'electron';
import { checkOllamaHealth, fetchModels } from './api';
import { IpcChannels } from '@electron/types';

export async function performHealthCheckAndUpdateModels(
  window: BrowserWindow | null,
): Promise<{ ok: boolean; message: string }> {
  const healthStatus = await checkOllamaHealth();

  if (healthStatus.ok) {
    try {
      const { models } = await fetchModels();
      setStoreValue('models', models);

      if (!models || models.length === 0) {
        setStoreValue('currentModel', null);
        if (window && !window.isDestroyed()) {
          window.webContents.send(IpcChannels.OLLAMA_SET_CURRENT_MODEL, null);
        }
      } else {
        const currentModel = getStoreValue('currentModel');
        const modelExists =
          currentModel && models.some((model) => model.name === currentModel);

        if (!modelExists) {
          setStoreValue('currentModel', models[0].name);
          if (window && !window.isDestroyed()) {
            window.webContents.send(
              IpcChannels.OLLAMA_SET_CURRENT_MODEL,
              models[0].name,
            );
          }
        }
      }

      if (window && !window.isDestroyed()) {
        window.webContents.send(IpcChannels.OLLAMA_MODELS_UPDATED, models);
      }
    } catch (error) {
      setStoreValue('models', null);
      setStoreValue('currentModel', null);

      if (window && !window.isDestroyed()) {
        window.webContents.send(IpcChannels.OLLAMA_MODELS_UPDATED, null);
        window.webContents.send(IpcChannels.OLLAMA_SET_CURRENT_MODEL, null);
      }
    }
  } else {
    setStoreValue('models', null);
    setStoreValue('currentModel', null);

    if (window && !window.isDestroyed()) {
      window.webContents.send(IpcChannels.OLLAMA_MODELS_UPDATED, null);
      window.webContents.send(IpcChannels.OLLAMA_SET_CURRENT_MODEL, null);
    }
  }

  if (window && !window.isDestroyed()) {
    window.webContents.send(IpcChannels.OLLAMA_HEALTH_STATUS, healthStatus);
  }

  return healthStatus;
}
