import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChevronToggleButton from '../ChevronToggleButton';

describe('ChevronToggleButton component', () => {
  it('renders the button with text', () => {
    render(
      <ChevronToggleButton
        buttonText="Test Button"
        isOpen={false}
        onToggle={() => {}}
      />,
    );

    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom text className when provided', () => {
    render(
      <ChevronToggleButton
        buttonText="Test Button"
        textClassName="text-red-500"
        isOpen={false}
        onToggle={() => {}}
      />,
    );

    const textElement = screen.getByText('Test Button');
    expect(textElement).toHaveClass('text-red-500');
  });

  it('rotates chevron icon when isOpen is true', () => {
    render(
      <ChevronToggleButton
        buttonText="Test Button"
        isOpen={true}
        onToggle={() => {}}
      />,
    );

    const chevronIcon = screen.getByRole('button').querySelector('svg');
    expect(chevronIcon).toHaveClass('rotate-180');
  });

  it('does not rotate chevron icon when isOpen is false', () => {
    render(
      <ChevronToggleButton
        buttonText="Test Button"
        isOpen={false}
        onToggle={() => {}}
      />,
    );

    const chevronIcon = screen.getByRole('button').querySelector('svg');
    expect(chevronIcon).not.toHaveClass('rotate-180');
  });

  it('calls onToggle when clicked', () => {
    const handleToggle = vi.fn();

    render(
      <ChevronToggleButton
        buttonText="Test Button"
        isOpen={false}
        onToggle={handleToggle}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
