import Store from 'electron-store';
import type { StoreSchema } from '@shared/types';

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

export function getAll() {
  return store.store;
}

export type { StoreSchema };
