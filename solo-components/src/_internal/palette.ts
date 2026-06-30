import type { SoloMode } from '../providers/SoloModeContext';

/** Semantic color names shared across components (buttons today, more later). */
export type SoloColorName = 'dark-purple' | 'red' | 'warning' | 'success' | 'gray' | 'black' | 'blue';

/** A value that can differ by light/dark mode, or be the same for both. */
export type PerMode<T> = T | { light: T; dark: T };

export interface SoloColorTokens {
  /** Solid fill. */
  bg: string;
  /** Solid hover fill. */
  hover: string;
  /** Solid active fill. */
  active: string;
  /** Solid text. */
  fg: string;
  /** Optional solid border, where the fill needs help separating from the page. */
  border?: string;
  /** Outline + text for the bare variant; legible on the dim bg (>=3:1). */
  bareFg: PerMode<string>;
}

/**
 * Semantic palette — the basis for color theming across components. Solid fills
 * use white text; `bareFg` is the outline/text for the bare variant, picked to
 * stay legible (>=3:1) on the dim background in both light and dark modes.
 */
export const soloColorTokens: Record<SoloColorName, SoloColorTokens> = {
  // Bare dark-purple is brighter on dark, darker on light, so it reads well on both.
  'dark-purple': { bg: '#8023c3', hover: '#9534d4', active: '#6a1ba3', fg: '#ffffff', bareFg: { dark: '#a855f7', light: '#7e22ce' } },
  blue: { bg: '#2563eb', hover: '#3b82f6', active: '#1d4ed8', fg: '#ffffff', bareFg: '#2563eb' },
  red: { bg: '#a82f25', hover: '#c0392b', active: '#871f17', fg: '#ffffff', bareFg: '#c64f48' },
  // Deep amber, near-complementary to the purple theme.
  warning: { bg: '#b45309', hover: '#d97706', active: '#92400e', fg: '#ffffff', bareFg: '#cf7032' },
  success: { bg: '#15803d', hover: '#16a34a', active: '#166534', fg: '#ffffff', bareFg: '#2f9e5c' },
  // Gray bare is lighter on dark; black bare is darker on light — each pulls away
  // from the dim background it sits on.
  gray: { bg: '#636370', hover: '#71717a', active: '#52525b', fg: '#ffffff', bareFg: { dark: '#a1a1aa', light: '#82828c' } },
  black: { bg: '#27272a', hover: '#37373d', active: '#1c1c1f', fg: '#ffffff', border: '#52525b', bareFg: { dark: '#808086', light: '#3f3f46' } }
};

/** Resolve a possibly per-mode bare color for the active mode. */
export function resolveBareFg(bareFg: PerMode<string>, mode: SoloMode): string {
  return typeof bareFg === 'string' ? bareFg : bareFg[mode];
}
