import { useState, useEffect, useCallback } from 'react';
import { StoreSchema } from '@shared/types';

export default function useStore<K extends keyof StoreSchema>(
  key: K,
  defaultValue: StoreSchema[K],
) {
  const [value, setValue] = useState<StoreSchema[K]>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue =
          await window.electronApi.getStoreValue<StoreSchema[K]>(key);
        setValue(storedValue !== undefined ? storedValue : defaultValue);
      } catch (error) {
        // TODO: Handle error
        console.error(`Error loading setting ${key}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadValue();
  }, [key, defaultValue]);

  const updateValue = useCallback(
    async (newValue: StoreSchema[K]) => {
      try {
        await window.electronApi.setStoreValue(key, newValue);
        setValue(newValue);
        return true;
      } catch (error) {
        // TODO: Handle error
        console.error(`Error updating setting ${key}:`, error);
        return false;
      }
    },
    [key],
  );

  return { value, updateValue, isLoading };
}
