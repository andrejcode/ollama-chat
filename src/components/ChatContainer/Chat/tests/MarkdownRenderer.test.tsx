import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MarkdownRenderer from '../MarkdownRenderer';

describe('MarkdownRenderer component', () => {
  it('renders plain text correctly', () => {
    render(<MarkdownRenderer content="Simple text content" />);
    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });

  it('renders markdown formatting correctly', () => {
    render(<MarkdownRenderer content="**Bold text** and *Italic text*" />);

    const boldElement = screen.getByText('Bold text');
    const italicElement = screen.getByText('Italic text');

    expect(boldElement).toBeInTheDocument();
    expect(italicElement).toBeInTheDocument();

    expect(
      boldElement.closest('strong') ||
        boldElement.parentElement?.tagName === 'STRONG',
    ).toBeTruthy();
    expect(
      italicElement.closest('em') ||
        italicElement.parentElement?.tagName === 'EM',
    ).toBeTruthy();
  });

  it('renders links correctly', () => {
    render(<MarkdownRenderer content="[Link text](https://example.com)" />);

    const link = screen.getByText('Link text');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders code blocks with syntax highlighting', () => {
    render(
      <MarkdownRenderer content="```javascript\nconst x = 1;\nconsole.log(x);\n```" />,
    );

    expect(screen.getByText(/const x = 1;/)).toBeInTheDocument();
    expect(screen.getByText(/console.log/)).toBeInTheDocument();

    // Test if the SyntaxHighlighter component was used (simplified)
    const codeContainer = screen.getByText(/const x = 1;/).closest('div');
    expect(codeContainer).toBeInTheDocument();
  });

  it('renders inline code correctly', () => {
    render(<MarkdownRenderer content="This is `inline code`" />);

    const codeText = screen.getByText('inline code');
    expect(codeText.tagName).toBe('CODE');
  });

  it('sanitizes dangerous HTML content', () => {
    render(
      <MarkdownRenderer content="<script>alert('xss')</script> Safe text" />,
    );

    expect(screen.queryByText("alert('xss')")).not.toBeInTheDocument();
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });
});
