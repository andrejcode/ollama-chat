import { vi } from 'vitest';

export function createMockElectronApi() {
  return {
    sendPrompt: vi.fn(),
    onStreamResponse: vi.fn(),
    onStreamError: vi.fn(),
    onStreamComplete: vi.fn(),

    setThemeDark: vi.fn(),
    setThemeLight: vi.fn(),
    setThemeSystem: vi.fn(),

    getStoreValue: vi.fn(),
    setStoreValue: vi.fn(),
  };
}
