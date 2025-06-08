/* eslint-disable @typescript-eslint/require-await */
import AlertMessageProvider from '@/providers/AlertMessageProvider';
import { useSettingsModalStore } from '@/stores';
import { createMockElectronApi } from '@/tests/utils/mocks';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsModal from '../index';

vi.mock('@/stores/settingsModalStore', () => ({
  useSettingsModalStore: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AlertMessageProvider>{children}</AlertMessageProvider>;
};

describe('SettingsModal component', () => {
  const mockCloseModal = vi.fn();
  let mockElectronApi: ReturnType<typeof createMockElectronApi>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSettingsModalStore).mockImplementation((selector) => {
      const mockState = {
        isModalOpen: true,
        closeModal: mockCloseModal,
        openModal: vi.fn(),
      };
      return selector(mockState);
    });

    mockElectronApi = createMockElectronApi();
    window.electronApi = mockElectronApi;

    mockElectronApi.getTheme.mockResolvedValue('system');
    mockElectronApi.getOllamaUrl.mockResolvedValue('http://localhost:11434');

    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('renders the modal when isModalOpen is true', async () => {
    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('does not render content when isModalOpen is false', async () => {
    vi.mocked(useSettingsModalStore).mockImplementation((selector) => {
      const mockState = {
        isModalOpen: false,
        closeModal: mockCloseModal,
        openModal: vi.fn(),
      };
      return selector(mockState);
    });

    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('calls setThemeDark when Dark button is clicked', async () => {
    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    const darkButton = screen.getByText('Dark');
    await act(async () => {
      fireEvent.click(darkButton);
    });

    expect(mockElectronApi.setThemeDark).toHaveBeenCalledTimes(1);
  });

  it('calls setThemeLight when Light button is clicked', async () => {
    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    const lightButton = screen.getByText('Light');
    await act(async () => {
      fireEvent.click(lightButton);
    });

    expect(mockElectronApi.setThemeLight).toHaveBeenCalledTimes(1);
  });

  it('calls setThemeSystem when System button is clicked', async () => {
    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    const systemButton = screen.getByText('System');
    await act(async () => {
      fireEvent.click(systemButton);
    });

    expect(mockElectronApi.setThemeSystem).toHaveBeenCalledTimes(1);
  });

  it('calls closeModal when the close button is clicked', async () => {
    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('renders Ollama URL input with fetched value', async () => {
    mockElectronApi.getOllamaUrl.mockResolvedValue('http://localhost:1111');

    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    const input = screen.getByPlaceholderText('http://localhost:11434');
    expect(input).toHaveValue('http://localhost:1111');
  });

  it('updates Ollama URL when form is submitted', async () => {
    mockElectronApi.getOllamaUrl.mockResolvedValue('http://localhost:1111');

    const newUrl = 'http://new-url.com';

    await act(async () => {
      render(<SettingsModal />, { wrapper: TestWrapper });
    });

    const input = screen.getByPlaceholderText('http://localhost:11434');

    await act(async () => {
      fireEvent.change(input, { target: { value: `  ${newUrl}  ` } });
    });

    const submitButton = input
      .closest('form')!
      .querySelector('button[type="submit"]')!;

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockElectronApi.setOllamaUrl).toHaveBeenCalledWith(newUrl);
    expect(input).toHaveValue(newUrl);
  });
});
