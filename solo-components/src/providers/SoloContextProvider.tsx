import { css, Global, ThemeProvider, type Theme } from '@emotion/react';
import type { ReactNode } from 'react';
import { Toaster, type ToasterProps } from 'react-hot-toast';
// Import the context directly (not the MonacoEditor barrel) so this provider
// never pulls the editor's heavy optional deps (antd / monaco) into apps that
// only use it for theming + toasts.
import { EditorSettingsProvider } from '../components/MonacoEditor/EditorSettingsContext';
import { SoloModeProvider, type SoloMode } from './SoloModeContext';

// region Helpers

/** Theme tokens the library — and the Monaco editor chrome — read from. */
export interface SoloTheme {
  mode: SoloMode;
  fontFamily: string;
  colors: {
    background: string;
    bgElevated: string;
    bgHover: string;
    /** Pressed/active surface — a clearly distinct step from `bgHover`. */
    bgActive: string;
    borderBase: string;
    primary: string;
    textPrimary: string;
    textSecondary: string;
  };
}

const FONT_FAMILY = "'Figtree', ui-sans-serif, system-ui, sans-serif";

// Light and dark palettes. The editor chrome and components read these via the
// `--color-*` CSS variables the provider injects.
// Purple-core: neutrals are tinted toward the brand violet (#8134e2, hue ~267) so
// purple reads as the system. `bgHover` → `bgActive` is a clear, deliberate step.
const palettes: Record<SoloMode, SoloTheme['colors']> = {
  dark: {
    background: '#0f0b18',
    bgElevated: '#1b1624',
    bgHover: '#282035',
    bgActive: '#352b48',
    borderBase: '#3d344d',
    primary: '#8134e2',
    textPrimary: '#f6f4fb',
    textSecondary: '#a6a0b8'
  },
  light: {
    background: '#ffffff',
    bgElevated: '#f6f3fb',
    bgHover: '#ece7f5',
    bgActive: '#ddd3ee',
    borderBase: '#ded7ec',
    primary: '#8134e2',
    textPrimary: '#1a1623',
    textSecondary: '#585465'
  }
};

/** Default Solo theme (dark). */
export const defaultSoloTheme: SoloTheme = { mode: 'dark', fontFamily: FONT_FAMILY, colors: palettes.dark };

/** Theme overrides — non-recursive (one level of `colors`) to keep types cheap. */
export interface SoloThemeOverride {
  fontFamily?: string;
  colors?: Partial<SoloTheme['colors']>;
}

/** Toggle which providers `SoloContextProvider` sets up. Each defaults to `true`. */
export interface SoloFeatures {
  /** emotion `ThemeProvider`, the `--color-*` CSS variables, and the web fonts. */
  theme?: boolean;
  /** react-hot-toast `<Toaster />`. */
  toaster?: boolean;
}

/** Fully typed customization for the enabled features. */
export interface SoloConfig {
  /** Theme overrides, merged over the mode palette and any outer `ThemeProvider`. */
  theme?: SoloThemeOverride;
  /** Props for the bundled react-hot-toast `<Toaster />`. */
  toaster?: ToasterProps;
}

// Loads Figtree (UI), DM Sans, and DM Mono. Kept first in the injected sheet so
// the @import stays valid.
const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');";

// Non-destructive merge: start from the mode palette, keep outer emotion theme
// keys, then apply the caller's overrides.
const mergeTheme = (mode: SoloMode, outer: Theme | undefined, overrides?: SoloThemeOverride): SoloTheme => {
  const outerOverride = (outer ?? {}) as SoloThemeOverride;
  return {
    ...(outer as object),
    mode,
    fontFamily: overrides?.fontFamily ?? outerOverride.fontFamily ?? FONT_FAMILY,
    colors: {
      ...palettes[mode],
      ...(outerOverride.colors ?? {}),
      ...(overrides?.colors ?? {})
    }
  };
};

const globalStyles = (theme: SoloTheme) => css`
  ${FONT_IMPORT}

  :root {
    --solo-font-family: ${theme.fontFamily};
    --color-background: ${theme.colors.background};
    --color-bg-elevated: ${theme.colors.bgElevated};
    --color-bg-hover: ${theme.colors.bgHover};
    --color-bg-active: ${theme.colors.bgActive};
    --color-border-base: ${theme.colors.borderBase};
    --color-primary: ${theme.colors.primary};
    --color-text-primary: ${theme.colors.textPrimary};
    --color-text-secondary: ${theme.colors.textSecondary};
  }

  body {
    font-family: ${theme.fontFamily};
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// region Component

/**
 * Wraps children in the emotion theme + CSS variables + web fonts, or passes
 * them through untouched when theming is off. Isolating this keeps
 * `SoloContextProvider` a flat, declarative tree instead of branching inline.
 */
function ThemeLayer({
  enabled,
  mode,
  overrides,
  children
}: {
  enabled: boolean;
  mode: SoloMode;
  overrides?: SoloThemeOverride;
  children: ReactNode;
}) {
  if (!enabled) return <>{children}</>;

  const theme = mergeTheme(mode, undefined, overrides);
  return (
    <ThemeProvider theme={outer => mergeTheme(mode, outer, overrides)}>
      <Global styles={globalStyles(theme)} />
      {children}
    </ThemeProvider>
  );
}

export interface SoloContextProviderProps {
  children: ReactNode;
  /** Light or dark color mode. Drives the palette and the editor's default theme. Defaults to `'dark'`. */
  mode?: SoloMode;
  /** Toggle which providers are set up. Each feature defaults to on. */
  features?: SoloFeatures;
  /** Fully typed customization for the enabled features. */
  config?: SoloConfig;
}

/**
 * Single top-level provider for apps consuming this library. Composes the
 * color mode + emotion theme (web fonts + the `--color-*` CSS variables the
 * editor chrome reads), editor settings, and a react-hot-toast `<Toaster />` —
 * so the library's components work as drop-ins.
 *
 * Opinionated by default (closed to modification), open to extension: pick
 * `mode`, toggle pieces with `features`, and customize them with `config`.
 *
 * The body reads top-down as the provider tree it renders:
 * mode → theme → editor settings → toaster → your app.
 */
export function SoloContextProvider({ children, mode = 'dark', features, config }: SoloContextProviderProps) {
  const themeEnabled = features?.theme !== false;
  const toasterEnabled = features?.toaster !== false;

  return (
    <SoloModeProvider value={mode}>
      <ThemeLayer enabled={themeEnabled} mode={mode} overrides={config?.theme}>
        <EditorSettingsProvider>
          {toasterEnabled && (
            <Toaster
              {...config?.toaster}
              position={config?.toaster?.position ?? 'bottom-right'}
              toastOptions={{
                ...config?.toaster?.toastOptions,
                // Themed via CSS variables so toasts match light/dark automatically.
                style: {
                  background: 'var(--color-bg-elevated, #1e1e22)',
                  color: 'var(--color-text-primary, #fafafa)',
                  border: '1px solid var(--color-border-base, #3f3f46)',
                  ...config?.toaster?.toastOptions?.style
                }
              }}
            />
          )}
          {children}
        </EditorSettingsProvider>
      </ThemeLayer>
    </SoloModeProvider>
  );
}
