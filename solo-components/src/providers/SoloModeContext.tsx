import { createContext, useContext } from 'react';

export type SoloMode = 'light' | 'dark';

const SoloModeContext = createContext<SoloMode>('dark');

/** Provides the active light/dark mode to descendants (e.g. the editor). */
export const SoloModeProvider = SoloModeContext.Provider;

/** Read the active Solo color mode. Defaults to `'dark'` outside a provider. */
export function useSoloMode(): SoloMode {
  return useContext(SoloModeContext);
}
