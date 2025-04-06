import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SettingsModal from '../SettingsModal';
import useSettingsModalContext from '@/hooks/useSettingsModalContext';
import { createMockElectronApi } from '@/tests/utils/mocks';

vi.mock('@/hooks/useSettingsModalContext', () => ({
  default: vi.fn(),
}));

describe('SettingsModal component', () => {
  const mockCloseModal = vi.fn();
  let mockElectronApi: ReturnType<typeof createMockElectronApi>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSettingsModalContext).mockReturnValue({
      isOpen: true,
      closeModal: mockCloseModal,
      openModal: vi.fn(),
    });

    mockElectronApi = createMockElectronApi();
    window.electronApi = mockElectronApi;

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

  it('renders the modal when isOpen is true', () => {
    render(<SettingsModal />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('does not render content when isOpen is false', () => {
    vi.mocked(useSettingsModalContext).mockReturnValue({
      isOpen: false,
      closeModal: mockCloseModal,
      openModal: vi.fn(),
    });

    render(<SettingsModal />);
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('calls setThemeDark when Dark button is clicked', () => {
    render(<SettingsModal />);

    const darkButton = screen.getByText('Dark');
    fireEvent.click(darkButton);

    expect(mockElectronApi.setThemeDark).toHaveBeenCalledTimes(1);
  });

  it('calls setThemeLight when Light button is clicked', () => {
    render(<SettingsModal />);

    const lightButton = screen.getByText('Light');
    fireEvent.click(lightButton);

    expect(mockElectronApi.setThemeLight).toHaveBeenCalledTimes(1);
  });

  it('calls setThemeSystem when System button is clicked', () => {
    render(<SettingsModal />);

    const systemButton = screen.getByText('System');
    fireEvent.click(systemButton);

    expect(mockElectronApi.setThemeSystem).toHaveBeenCalledTimes(1);
  });

  it('calls closeModal when the close button is clicked', () => {
    render(<SettingsModal />);

    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
