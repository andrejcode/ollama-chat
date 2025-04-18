import { vi } from 'vitest';

export function createMockElectronApi() {
  return {
    sendPrompt: vi.fn(),
    onStreamResponse: vi.fn(),
    onStreamError: vi.fn(),
    onStreamComplete: vi.fn(),

    getSidebarState: vi.fn(),
    setSidebarState: vi.fn(),

    getOllamaUrl: vi.fn(),
    setOllamaUrl: vi.fn(),

    getHealthStatus: vi.fn(),
    checkOllamaHealth: vi.fn(),
    onOllamaHealthStatus: vi.fn(),

    getModels: vi.fn(),
    onModelsUpdated: vi.fn(),

    getCurrentModel: vi.fn(),
    setCurrentModel: vi.fn(),
    onCurrentModelChanged: vi.fn(),

    getTheme: vi.fn(),
    setThemeDark: vi.fn(),
    setThemeLight: vi.fn(),
    setThemeSystem: vi.fn(),
  };
}
