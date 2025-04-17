import { getStoreValue, setStoreValue } from '@electron/store';
import { IpcChannels } from '@electron/types';
import { ipcMain, nativeTheme } from 'electron';

export function initializeTheme() {
  const theme = getStoreValue('theme');
  if (theme) {
    nativeTheme.themeSource = theme;
  } else {
    nativeTheme.themeSource = 'system';
  }
}

export function registerThemeHandlers() {
  ipcMain.handle(IpcChannels.THEME_GET, () => {
    return getStoreValue('theme');
  });

  ipcMain.handle(IpcChannels.THEME_SYSTEM, () => {
    nativeTheme.themeSource = 'system';
    setStoreValue('theme', 'system');
  });

  ipcMain.handle(IpcChannels.THEME_DARK, () => {
    nativeTheme.themeSource = 'dark';
    setStoreValue('theme', 'dark');
  });

  ipcMain.handle(IpcChannels.THEME_LIGHT, () => {
    nativeTheme.themeSource = 'light';
    setStoreValue('theme', 'light');
  });
}
