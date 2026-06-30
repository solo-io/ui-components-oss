import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// Library build config — referenced explicitly by `vite build --config vite.lib.config.ts`.
// Keeps the dts plugin and `build.lib` mode out of the default config so Storybook
// (which auto-loads `vite.config.ts`) doesn't try to roll up declaration files.
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: { plugins: ['@emotion/babel-plugin'] }
    }),
    // Multi-entry: emit per-source `.d.ts` files (mirroring `src/`) so each
    // package-exports subpath can point at its own `dist/<entry>.d.ts`. Rolling
    // all types into a single file would only work for one entry.
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.ts', 'src/**/*.stories.tsx'],
      entryRoot: 'src'
    })
  ],
  build: {
    lib: {
      // Multiple entries: `index` is the main package export, `styles` is the
      // `@solo-io/ui-components-oss/styles` subpath export. Add a line here per new subpath.
      entry: {
        'solo-components': resolve(__dirname, 'src/index.ts'),
        styles: resolve(__dirname, 'src/styles.ts')
      },
      name: 'SoloComponents',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@emotion/react',
        '@emotion/react/jsx-runtime',
        '@emotion/styled',
        '@monaco-editor/react',
        'monaco-editor',
        'monaco-vim',
        'antd',
        'lucide-react',
        'react-hot-toast'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          '@monaco-editor/react': 'MonacoReact',
          'monaco-editor': 'monaco',
          'monaco-vim': 'MonacoVim',
          antd: 'antd',
          'lucide-react': 'LucideReact',
          'react-hot-toast': 'reactHotToast'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
});
