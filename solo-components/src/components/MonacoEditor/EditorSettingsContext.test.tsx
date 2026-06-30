import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorSettingsProvider, useEditorSettings } from './EditorSettingsContext';

// Exercises the context only — Monaco itself can't render under happy-dom.
const Probe = () => {
  const { vimEnabled, toggleVimMode, wordWrapEnabled, toggleWordWrap } = useEditorSettings();
  return (
    <div>
      <span data-testid='vim'>{String(vimEnabled)}</span>
      <span data-testid='wrap'>{String(wordWrapEnabled)}</span>
      <button onClick={toggleVimMode}>toggle vim</button>
      <button onClick={toggleWordWrap}>toggle wrap</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <EditorSettingsProvider>
      <Probe />
    </EditorSettingsProvider>
  );

describe('EditorSettingsContext', () => {
  beforeEach(() => localStorage.clear());

  it('defaults both settings to disabled', () => {
    renderProbe();
    expect(screen.getByTestId('vim')).toHaveTextContent('false');
    expect(screen.getByTestId('wrap')).toHaveTextContent('false');
  });

  it('toggles vim mode and persists it to localStorage', async () => {
    const user = userEvent.setup();
    renderProbe();
    await user.click(screen.getByRole('button', { name: 'toggle vim' }));
    expect(screen.getByTestId('vim')).toHaveTextContent('true');
    expect(localStorage.getItem('monaco-editor-vim-mode')).toBe('true');
  });

  it('hydrates initial state from localStorage', () => {
    localStorage.setItem('monaco-editor-word-wrap', 'true');
    renderProbe();
    expect(screen.getByTestId('wrap')).toHaveTextContent('true');
  });

  it('throws when the hook is used outside the provider', () => {
    // Suppress the expected React error log for the thrown render.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/within EditorSettingsProvider/);
    spy.mockRestore();
  });
});
