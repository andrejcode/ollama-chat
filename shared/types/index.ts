export interface ElectronApi {
  sendPrompt: (messages: Message[]) => void;
  onStreamResponse: (callback: (data: string) => void) => () => void;
  onStreamError: (callback: (error: string) => void) => void;
  onStreamComplete: (callback: () => void) => void;

  getStoreValue: <T>(key: string) => Promise<T>;
  setStoreValue: (key: string, value: unknown) => Promise<boolean>;
}

export interface StoreSchema {
  isSidebarOpen: boolean;
}

export interface Message {
  id: string;
  role: string;
  content: string;
}
