export interface ElectronApi {
  sendPrompt: (messages: Message[]) => void;
  onStreamResponse: (callback: (data: string) => void) => () => void;
  onStreamError: (callback: (error: string) => void) => void;
  onStreamComplete: (callback: () => void) => void;

  setThemeDark: () => Promise<void>;
  setThemeLight: () => Promise<void>;
  setThemeSystem: () => Promise<void>;

  getStoreValue: <T>(key: string) => Promise<T>;
  setStoreValue: (key: string, value: unknown) => Promise<boolean>;
}

type Theme = 'dark' | 'light' | 'system';

export interface StoreSchema {
  isSidebarOpen: boolean;
  theme: Theme;
}

export interface Message {
  id: string;
  role: string;
  content: string;
}
