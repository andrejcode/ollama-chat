export interface ElectronApi {
  sendPrompt: (messages: Message[]) => void;
  onStreamResponse: (callback: (data: string) => void) => () => void;
  onStreamError: (callback: (error: string) => void) => void;
  onStreamComplete: (callback: () => void) => void;

  getSidebarState: () => boolean;
  setSidebarState: (isOpen: boolean) => Promise<void>;

  getOllamaUrl: () => Promise<string>;
  setOllamaUrl: (url: string) => Promise<{ ok: boolean; message: string }>;

  getHealthStatus: () => Promise<{ ok: boolean; message: string }>;
  checkOllamaHealth: () => Promise<{ ok: boolean; message: string }>;
  onOllamaHealthStatus: (
    callback: (status: { ok: boolean; message: string }) => void,
  ) => () => void;

  getModels: () => Promise<Model[]>;
  onModelsUpdated: (callback: (models: Model[]) => void) => () => void;

  getCurrentModel: () => Promise<string | null>;
  setCurrentModel: (modelName: string) => Promise<boolean>;
  onCurrentModelChanged: (callback: (modelName: string) => void) => () => void;

  getTheme: () => Promise<Theme>;
  setThemeDark: () => Promise<void>;
  setThemeLight: () => Promise<void>;
  setThemeSystem: () => Promise<void>;
}

export type Theme = 'light' | 'dark' | 'system';

export interface Message {
  id: string;
  role: string;
  content: string;
}

interface ModelDetails {
  format: string;
  family: string;
  families: string[] | null;
  parameter_size: string;
  quantization_level: string;
}

export interface Model {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}
