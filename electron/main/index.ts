import { app, BrowserWindow } from 'electron';
import { initializeOllama, registerOllamaHandlers } from '../ollama';
import { registerSidebarHandlers } from '../sidebar';
import { initializeTheme, registerThemeHandlers } from './theme';
import createWindow from './window';

let window: BrowserWindow | null;

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    window = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    window = createWindow();
  }
});

void app.whenReady().then(() => {
  window = createWindow();
  if (window) {
    initializeOllama(window);
  }

  initializeTheme();

  registerThemeHandlers();
  registerOllamaHandlers();
  registerSidebarHandlers();
});
