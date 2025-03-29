import { useState, useEffect, useCallback } from 'react';
import type { StoreSchema } from '@shared/types';

export default function useElectronStore<K extends keyof StoreSchema>(key: K) {
  const [value, setValue] = useState<StoreSchema[K] | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue =
          await window.electronApi.getStoreValue<StoreSchema[K]>(key);
        setValue(storedValue);
      } catch {
        console.error(`Failed to load store value for key "${key}".`);
      }
    };

    void loadValue();
  }, [key]);

  const updateValue = useCallback(
    async (newValue: StoreSchema[K]) => {
      try {
        await window.electronApi.setStoreValue(key, newValue);
        setValue(newValue);

        return true;
      } catch {
        console.error(`Failed to update store value for key "${key}".`);

        return false;
      }
    },
    [key],
  );

  return { value, updateValue };
}
