# 🧪 example

Tiny Vite app that imports `@solo.io/ui-components-oss` from the workspace.

## ▶️ Run

```bash
yarn install      # from repo root
yarn example      # 🌐 http://localhost:5173
```

## 🪄 How it works

Vite aliases `@solo.io/ui-components-oss` → `../solo-components/src/index.ts`, so library edits **hot-reload instantly** — no rebuild needed.

## 📁 Files

- 🚪 `src/main.tsx` — entry
- 🖼️ `src/App.tsx` — Button showcase
