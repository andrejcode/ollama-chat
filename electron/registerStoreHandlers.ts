import { ipcMain } from 'electron';
import { getStoreValue, setStoreValue, StoreSchema } from './store';

export default function registerStoreHandlers() {
  ipcMain.handle('store-get', (_event, key: keyof StoreSchema) =>
    getStoreValue(key),
  );

  ipcMain.handle(
    'store-set',
    (_event, key: keyof StoreSchema, value: unknown) => {
      setStoreValue(key, value as StoreSchema[typeof key]);
      return true;
    },
  );
}
