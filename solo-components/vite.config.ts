import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Default Vite config used by Storybook (which auto-discovers `vite.config.ts`).
// The library build uses `vite.lib.config.ts` instead so the dts plugin and lib
// mode don't run during Storybook builds.
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: { plugins: ['@emotion/babel-plugin'] }
    })
  ]
});
