# 🧩 @solo-io/ui-components-oss

Open-source React component library. Vite library mode + TypeScript + Emotion.
Published as a public package to the npm registry.

## 📦 Install

Public on the npm registry — no authentication required:

```bash
yarn add @solo-io/ui-components-oss
```

## 🧩 Setup

Wrap your app once in `SoloContextProvider`. It wires up the emotion theme — the
Figtree web font and the `--color-*` CSS variables the editor reads — plus
editor settings and a react-hot-toast host, so every component works as a
drop-in:

```tsx
import { SoloContextProvider } from "@solo-io/ui-components-oss";

createRoot(document.getElementById("root")!).render(
  <SoloContextProvider>
    <App />
  </SoloContextProvider>
);
```

Opinionated by default, but open to extension. Toggle pieces with `features`
(all default to on) and customize them with the typed `config` (merged over the
defaults and any outer `ThemeProvider`):

```tsx
<SoloContextProvider
  features={{ toaster: false }}                // turn pieces off (e.g. you render your own Toaster)
  config={{
    theme: { colors: { primary: "#8023c3" } }, // SoloThemeOverride
    toaster: { position: "bottom-right" },      // react-hot-toast ToasterProps (when enabled)
  }}
>
  <App />
</SoloContextProvider>
```

`features` flags: `theme` (emotion ThemeProvider + CSS vars) and `toaster`
(react-hot-toast). Editor settings are always provided.

## 🎨 Use

```tsx
import { Button } from "@solo-io/ui-components-oss";

<Button color="purple" onClick={() => alert("hi")}>
  Click me
</Button>;
```

Styles are exported from `@solo-io/ui-components-oss/styles`. See `./src/styles.ts` for the exported style objects.

## 🖋️ Monaco editor

`MonacoEditorWithSettings` wraps [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react)
with a settings menu (copy, download, vim mode, word wrap). Editor settings and
the copy/download toasts are supplied by `SoloContextProvider` (see
[Setup](#-setup)), so the editor drops straight in:

```tsx
import { useState } from "react";
import { MonacoEditorWithSettings } from "@solo-io/ui-components-oss";

// Inside an app already wrapped in <SoloContextProvider>:
export const Example = () => {
  const [code, setCode] = useState('{\n  "hello": "world"\n}');
  return (
    <div style={{ height: 400 }}>
      <MonacoEditorWithSettings
        value={code}
        onChange={(v) => setCode(v ?? "")}
        language="json"
        theme="dark"
      />
    </div>
  );
};
```

### Editor peer dependencies (only if you use it)

These are **optional** peers — install them only when you use `MonacoEditorWithSettings`:

```bash
yarn add @monaco-editor/react monaco-editor monaco-vim antd lucide-react
```

- `@monaco-editor/react` + `monaco-editor` — the editor itself
- `monaco-vim` — vim keybindings (toggle from the settings menu)
- `antd` — the settings dropdown menu
- `lucide-react` — the settings (gear) icon

(`react-hot-toast` is a regular dependency provided by `SoloContextProvider` — nothing to install.)

### Theming

The editor chrome reads CSS custom properties. `SoloContextProvider` sets these
from its theme (override via `config.theme`), and they fall back to dark
defaults otherwise: `--color-bg-elevated`, `--color-border-base`,
`--color-bg-hover`, `--color-primary`, `--color-text-secondary`.

## 📐 Layout primitives

`Spacer` (margin / padding / sizing) and `FlexLayout` (flexbox) are emotion
styled `div`s for quick layout without one-off styled components:

```tsx
import { FlexLayout, Spacer } from "@solo-io/ui-components-oss";

<FlexLayout horizontal vertical gap={3}>
  <Spacer px="16px">Left</Spacer>
  <Spacer px="16px">Right</Spacer>
</FlexLayout>;
```

`FlexLayout` shorthands: `horizontal`/`vertical` (centering), `column`/`row`,
`gap` (a number is a `0.25em` scale step), `justifyContent`, `alignItems`, etc.
`FlexLayoutSpacer` drops a `flex-grow: 1` filler between items.

`Text` is a typography primitive (built on `Spacer`) — `size`, `weight`,
`truncate`, etc. Its default color is the theme's `--color-text-primary`, so it
follows the active light/dark mode unless you pass `color`.

## 🤝 Peer dependencies

- ⚛️ `react`, `react-dom` ≥ 18
- 💅 `@emotion/react`, `@emotion/styled` ^11
- 🖋️ Editor extras — optional, only for `MonacoEditorWithSettings` (see [Monaco editor](#-monaco-editor))

## 🧪 Develop

```bash
yarn storybook        # 📚 :6006
yarn test             # ✅ vitest
yarn build            # 📦 → dist/
```

## ➕ Add a component

1. `src/components/<Name>/<Name>.tsx` (+ `.style.ts`, `.test.tsx`, `.stories.tsx`)
2. Re-export from `src/components/<Name>/index.ts`
3. Add `export * from './components/<Name>';` to `src/index.ts`

## 🚢 Publishing

From the repo root:

```bash
yarn patch-release
```

See [Publishing in the root README](../README.md#-publishing) for the release
flow, or [`docs/initial-publish`](../docs/initial-publish/README.md) for the
one-time setup.

## 📄 License

[Apache-2.0](./LICENSE)
