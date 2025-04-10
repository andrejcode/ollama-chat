import { getStoreValue, setStoreValue } from '@electron/store';
import { BrowserWindow } from 'electron';
import { checkOllamaHealth, fetchModels } from './api';
import { IpcChannels } from '@electron/types';

export async function performHealthCheckAndUpdateModels(
  mainWindow?: BrowserWindow,
): Promise<{ ok: boolean; message: string }> {
  const healthStatus = await checkOllamaHealth();

  if (healthStatus.ok) {
    try {
      const { models } = await fetchModels();
      setStoreValue('models', models);

      const currentModel = getStoreValue('currentModel');

      if (models && models.length > 0 && !currentModel) {
        setStoreValue('currentModel', models[0].name);

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send(
            IpcChannels.OLLAMA_SET_CURRENT_MODEL,
            models[0].name,
          );
        }
      } else if (currentModel && models && models.length > 0) {
        const modelExists = models.some((model) => model.name === currentModel);

        if (!modelExists) {
          setStoreValue('currentModel', models[0].name);

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send(
              IpcChannels.OLLAMA_SET_CURRENT_MODEL,
              models[0].name,
            );
          }
        }
      }

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IpcChannels.OLLAMA_MODELS_UPDATED, models);
      }
    } catch {
      setStoreValue('models', null);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IpcChannels.OLLAMA_MODELS_UPDATED, null);
      }
    }
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(IpcChannels.OLLAMA_HEALTH_STATUS, healthStatus);
  }

  return healthStatus;
}
