import Store from 'electron-store';
import type { StoreSchema } from '@shared/types';
import { ipcMain } from 'electron';
import { IpcChannels } from '@electron/types';

const defaults: StoreSchema = {
  isSidebarOpen: true,
};

const store = new Store<StoreSchema>({
  name: 'settings',
  defaults,
});

export function getStoreValue<K extends keyof StoreSchema>(key: K) {
  return store.get(key);
}

export function setStoreValue<K extends keyof StoreSchema>(
  key: K,
  value: StoreSchema[K],
) {
  store.set(key, value);
}

export function registerStoreHandlers() {
  ipcMain.handle(IpcChannels.STORE_GET, (_event, key: keyof StoreSchema) =>
    getStoreValue(key),
  );

  ipcMain.handle(
    IpcChannels.STORE_SET,
    (_event, key: keyof StoreSchema, value: unknown) => {
      setStoreValue(key, value as StoreSchema[typeof key]);
      return true;
    },
  );
}
