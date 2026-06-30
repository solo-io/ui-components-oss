import type { SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { Editor, type OnMount } from '@monaco-editor/react';
import { Dropdown, Tooltip, type MenuProps } from 'antd';
import { Copy, Settings } from 'lucide-react';
import type * as monacoEditor from 'monaco-editor';
import { initVimMode, type VimMode, VimMode as VimModeClass } from 'monaco-vim';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useEditorSettings } from './EditorSettingsContext';
import { useSoloMode } from '../../providers/SoloModeContext';

// region Styles

// The component reads its palette from CSS custom properties so consumers can
// theme it, but ships dark-theme fallbacks so it looks right with no theming.
const EditorContainer = styled.div<{ height: string; styleOverrides?: SerializedStyles }>`
  position: relative;
  width: 100%;
  height: ${props => props.height};
  display: flex;
  flex-direction: column;
  background: transparent;
  /* Themed frame — subtle in dark, and gives the editor a visible edge against a
     light page where its background would otherwise blend in. */
  border: 1px solid var(--color-border-base, #3f3f46);
  border-radius: 8px;
  overflow: hidden;
  ${props => props.styleOverrides}
`;

const EditorWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
  background: transparent;
`;

// Top-right control bar holding the (read-only) copy button and the settings gear.
// Shifts left by `offsetRight` so it clears the editor's vertical scrollbar.
const ControlsBar = styled.div<{ offsetRight: number }>`
  position: absolute;
  top: 8px;
  right: ${props => props.offsetRight}px;
  z-index: 10;
  display: flex;
  gap: 6px;
  transition: right 0.15s ease;
`;

const IconActionButton = styled.button`
  background: var(--color-bg-elevated, #1e1e22);
  border: 1px solid var(--color-border-base, #3f3f46);
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.05s ease;

  &:hover {
    background: var(--color-bg-hover, #2a2a30);
    border-color: var(--color-primary, #6844ff);
  }

  &:active {
    background: var(--color-bg-hover, #2a2a30);
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #6844ff);
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
    color: var(--color-text-primary, #fafafa);
  }
`;

const VimStatusBar = styled.div`
  padding: 4px 8px;
  background: var(--color-bg-elevated, #1e1e22);
  border-top: 1px solid var(--color-border-base, #3f3f46);
  font-family: monospace;
  font-size: 12px;
  min-height: 24px;
`;

// region Component

export interface MonacoEditorWithSettingsProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language: string;
  height?: string;
  /** Defaults to the active `SoloContextProvider` mode when omitted. */
  theme?: 'light' | 'dark';
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions;
  onMount?: OnMount;
  readOnly?: boolean;
  downloadFileName?: string;
  onSave?: () => void;
  onQuit?: () => void;
  /** Emotion styles appended to the outer container. */
  styleOverrides?: SerializedStyles;
}

export function MonacoEditorWithSettings({
  value,
  onChange,
  language,
  height = '100%',
  theme,
  options = {},
  onMount,
  readOnly = false,
  downloadFileName,
  onSave,
  onQuit,
  styleOverrides,
}: MonacoEditorWithSettingsProps) {
  const { vimEnabled, toggleVimMode, wordWrapEnabled, toggleWordWrap } = useEditorSettings();
  // Vim is suppressed in read-only mode, regardless of the user's saved setting.
  const vimActive = vimEnabled && !readOnly;
  // Fall back to the provider's light/dark mode when no explicit theme is given.
  const soloMode = useSoloMode();
  const resolvedTheme = theme ?? soloMode;
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const vimModeRef = useRef<VimMode | null>(null);
  const statusNodeRef = useRef<HTMLDivElement | null>(null);
  const onSaveRef = useRef(onSave);
  const onQuitRef = useRef(onQuit);
  const disposablesRef = useRef<monacoEditor.IDisposable[]>([]);
  // Width of the vertical scrollbar when it's visible; the controls shift left by this.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Keep onSave and onQuit refs up to date
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onQuitRef.current = onQuit;
  }, [onQuit]);

  // Enable/disable vim mode for this editor instance
  useEffect(() => {
    if (!editorRef.current) return;

    if (vimActive) {
      // Enable vim mode
      if (!vimModeRef.current && statusNodeRef.current) {
        vimModeRef.current = initVimMode(editorRef.current, statusNodeRef.current);

        // Set up vim save and quit commands using VimMode.Vim
        setTimeout(() => {
          try {
            const Vim = (VimModeClass as any).Vim;
            if (Vim && Vim.defineEx) {
              if (onSaveRef.current) {
                Vim.defineEx('write', 'w', () => {
                  onSaveRef.current?.();
                });
              }
              if (onQuitRef.current) {
                Vim.defineEx('quit', 'q', () => {
                  onQuitRef.current?.();
                });
              }
              if (onSaveRef.current && onQuitRef.current) {
                Vim.defineEx('wq', 'wq', () => {
                  onSaveRef.current?.();
                  onQuitRef.current?.();
                });
              }
            }
          } catch (e) {
            console.error('Failed to setup vim commands:', e);
          }
        }, 100);
      }
    } else {
      // Disable vim mode
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    }
  }, [vimActive]);

  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Track the vertical scrollbar so the top-right controls can clear it.
      const syncScrollbar = () => {
        const layout = editor.getLayoutInfo();
        const hasVerticalScrollbar = editor.getScrollHeight() > layout.height;
        setScrollbarWidth(hasVerticalScrollbar ? layout.verticalScrollbarWidth : 0);
      };
      syncScrollbar();
      disposablesRef.current.push(
        editor.onDidContentSizeChange(syncScrollbar),
        editor.onDidLayoutChange(syncScrollbar)
      );

      // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
      if (onSaveRef.current) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          onSaveRef.current?.();
        });
      }

      // Initialize vim mode if enabled (never in read-only mode)
      if (vimActive && statusNodeRef.current && !vimModeRef.current) {
        vimModeRef.current = initVimMode(editor, statusNodeRef.current);

        // Set up vim save and quit commands using VimMode.Vim
        setTimeout(() => {
          try {
            const Vim = (VimModeClass as any).Vim;
            if (Vim && Vim.defineEx) {
              if (onSaveRef.current) {
                Vim.defineEx('write', 'w', () => {
                  onSaveRef.current?.();
                });
              }
              if (onQuitRef.current) {
                Vim.defineEx('quit', 'q', () => {
                  onQuitRef.current?.();
                });
              }
              if (onSaveRef.current && onQuitRef.current) {
                Vim.defineEx('wq', 'wq', () => {
                  onSaveRef.current?.();
                  onQuitRef.current?.();
                });
              }
            }
          } catch (e) {
            console.error('Failed to setup vim commands:', e);
          }
        }, 100);
      }

      // Call custom onMount if provided
      if (onMount) {
        onMount(editor, monaco);
      }
    },
    [onMount, vimActive]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      vimModeRef.current?.dispose();
      disposablesRef.current.forEach(d => d.dispose());
    };
  }, []);

  const handleCopy = useCallback(async () => {
    // Read the live editor content, not the (possibly stale) `value` prop.
    const text = editorRef.current?.getValue() ?? value;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, [value]);

  const handleDownload = useCallback(() => {
    const text = editorRef.current?.getValue() ?? value;
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Determine file extension from language
      let extension = 'txt';
      if (language === 'json') extension = 'json';
      else if (language === 'yaml' || language === 'yml') extension = 'yaml';
      else if (language === 'javascript' || language === 'typescript')
        extension = language === 'typescript' ? 'ts' : 'js';
      else if (language === 'html') extension = 'html';
      else if (language === 'css') extension = 'css';

      a.download = downloadFileName || `content.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded successfully');
    } catch {
      toast.error('Failed to download file');
    }
  }, [value, language, downloadFileName]);

  const menuItems: MenuProps['items'] = [
    // Copy lives in its own always-visible button (left of the gear), not the menu.
    {
      key: 'download',
      label: 'Download',
      onClick: handleDownload,
    },
    {
      type: 'divider',
    },
    // Vim mode is meaningless when read-only, so omit the toggle there.
    !readOnly && {
      key: 'vim',
      label: vimEnabled ? 'Disable Vim Mode' : 'Enable Vim Mode',
      onClick: toggleVimMode,
    },
    {
      key: 'wordwrap',
      label: wordWrapEnabled ? 'Disable Word Wrap' : 'Enable Word Wrap',
      onClick: toggleWordWrap,
    },
  ].filter(Boolean) as MenuProps['items'];

  return (
    <EditorContainer height={height} styleOverrides={styleOverrides}>
      <EditorWrapper>
        <ControlsBar offsetRight={8 + scrollbarWidth}>
          <Tooltip title='Copy to clipboard'>
            <IconActionButton type='button' aria-label='Copy to clipboard' onClick={handleCopy}>
              <Copy />
            </IconActionButton>
          </Tooltip>
          <Dropdown menu={{ items: menuItems }} placement='bottomRight' trigger={['click']}>
            <Tooltip title='More options'>
              <IconActionButton type='button' aria-label='Editor settings'>
                <Settings />
              </IconActionButton>
            </Tooltip>
          </Dropdown>
        </ControlsBar>
        <Editor
          height='100%'
          language={language}
          value={value}
          onChange={onChange}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
          onMount={handleEditorMount}
          options={{
            ...options,
            readOnly,
            wordWrap: wordWrapEnabled ? 'on' : 'off',
          }}
        />
      </EditorWrapper>
      {vimActive && <VimStatusBar ref={statusNodeRef as any} className='monaco-vim-status' />}
    </EditorContainer>
  );
}
