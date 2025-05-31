import type { Model, Theme } from '@shared/types';
import Store from 'electron-store';

interface StoreSchema {
  isSidebarOpen: boolean;
  theme: Theme;
  ollamaUrl: string;
  healthStatus: { ok: boolean; message: string };
  models: Model[] | null;
  currentModel: string | null;
}

const defaults: StoreSchema = {
  isSidebarOpen: true,
  theme: 'system',
  ollamaUrl: 'http://localhost:11434',
  healthStatus: { ok: false, message: 'Checking Ollama connection...' },
  models: null,
  currentModel: null,
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
