import { getStoreValue, setStoreValue } from '@electron/store';
import { IpcChannels } from '@electron/types';
import { ipcMain } from 'electron';

export function registerSidebarHandlers() {
  ipcMain.on(IpcChannels.GET_IS_SIDEBAR_OPEN, (event) => {
    event.returnValue = getStoreValue('isSidebarOpen');
  });

  ipcMain.handle(IpcChannels.SET_IS_SIDEBAR_OPEN, (_event, isOpen: boolean) => {
    return setStoreValue('isSidebarOpen', isOpen);
  });
}
