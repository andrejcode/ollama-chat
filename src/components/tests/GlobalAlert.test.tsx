import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GlobalAlert from '../GlobalAlert';
import useAlertMessageContext from '@/hooks/useAlertMessageContext';

vi.mock('@/hooks/useAlertMessageContext', () => ({
  default: vi.fn(),
}));

describe('GlobalAlert component', () => {
  const mockClearAlertMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when alertMessage is null', () => {
    vi.mocked(useAlertMessageContext).mockReturnValue({
      alertMessage: null,
      updateAlertMessage: vi.fn(),
      clearAlertMessage: mockClearAlertMessage,
    });

    const { container } = render(<GlobalAlert />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders error alert with correct message', () => {
    vi.mocked(useAlertMessageContext).mockReturnValue({
      alertMessage: {
        message: 'Error occurred',
        type: 'error',
      },
      updateAlertMessage: vi.fn(),
      clearAlertMessage: mockClearAlertMessage,
    });

    render(<GlobalAlert />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();

    const errorIcon = screen.getByTestId('error-icon');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveAttribute('aria-label', 'Error');
  });

  it('renders success alert with correct message', () => {
    vi.mocked(useAlertMessageContext).mockReturnValue({
      alertMessage: {
        message: 'Operation successful',
        type: 'success',
      },
      updateAlertMessage: vi.fn(),
      clearAlertMessage: mockClearAlertMessage,
    });

    render(<GlobalAlert />);

    expect(screen.getByText('Operation successful')).toBeInTheDocument();

    const successIcon = screen.getByTestId('success-icon');
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveAttribute('aria-label', 'Success');
  });

  it('calls clearAlertMessage when close button is clicked', () => {
    vi.mocked(useAlertMessageContext).mockReturnValue({
      alertMessage: {
        message: 'Test message',
        type: 'error',
      },
      updateAlertMessage: vi.fn(),
      clearAlertMessage: mockClearAlertMessage,
    });

    vi.useFakeTimers();

    render(<GlobalAlert />);

    // First, the component needs to fade in
    act(() => {
      vi.advanceTimersByTime(10);
    });

    const closeButton = screen.getByLabelText('Close alert');
    act(() => {
      fireEvent.click(closeButton);
    });

    // The Alert component first transitions to opacity-0
    expect(mockClearAlertMessage).not.toHaveBeenCalled();

    // Now advance time to account for the fade-out animation (500ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // Check that the clear function was called
    expect(mockClearAlertMessage).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('applies the correct classes for styling the error alert', () => {
    vi.mocked(useAlertMessageContext).mockReturnValue({
      alertMessage: {
        message: 'Test message',
        type: 'error',
      },
      updateAlertMessage: vi.fn(),
      clearAlertMessage: mockClearAlertMessage,
    });

    render(<GlobalAlert />);

    const alertElement = screen.getByText('Test message').closest('div');
    expect(alertElement).toHaveClass('absolute');
    expect(alertElement).toHaveClass('top-0');
    expect(alertElement).toHaveClass('z-50');

    // Conditional classes for error type
    expect(alertElement).toHaveClass('border-red-800');
    expect(alertElement).toHaveClass('bg-red-100');
    expect(alertElement).toHaveClass('text-red-800');
  });
});
