import type { Theme } from '@shared/types';
import { useEffect, useState } from 'react';
import ThemeButton from './ThemeButton';

export default function ThemeSettings() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const currentTheme = await window.electronApi.getTheme();
        setTheme(currentTheme);
      } catch (error) {
        setTheme(null);
        console.error('Error fetching theme:', error);
      }
    };

    void fetchTheme();
  }, []);

  const setThemeDark = async () => {
    await window.electronApi.setThemeDark();
    setTheme('dark');
  };

  const setThemeLight = async () => {
    await window.electronApi.setThemeLight();
    setTheme('light');
  };

  const setThemeSystem = async () => {
    await window.electronApi.setThemeSystem();
    setTheme('system');
  };

  return (
    <div className="flex items-center justify-between">
      <h3>Theme</h3>
      <div className="flex overflow-hidden rounded border border-neutral-300 dark:border-neutral-500">
        <ThemeButton
          active={theme === 'dark'}
          onClick={() => void setThemeDark()}
        >
          Dark
        </ThemeButton>
        <ThemeButton
          active={theme === 'light'}
          onClick={() => void setThemeLight()}
        >
          Light
        </ThemeButton>
        <ThemeButton
          active={theme === 'system'}
          onClick={() => void setThemeSystem()}
          isLast
        >
          System
        </ThemeButton>
      </div>
    </div>
  );
}
