import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: { plugins: ['@emotion/babel-plugin'] }
    })
  ],
  resolve: {
    // Resolve the workspace package to its source so the example reloads on
    // library edits without rebuilding the library.
    alias: {
      '@solo.io/ui-components-oss': resolve(__dirname, '../solo-components/src/index.ts')
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
