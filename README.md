# 🎨 ui-components-oss

Yarn v4 workspace for Solo.io's open-source React component library, published
publicly as `@solo-io/ui-components-oss` to the npm registry.

```
📦 ui-components-oss/
├── 🧩 solo-components/   ← the library
└── 🧪 example/           ← demo app that consumes it
```

## 🚀 Quickstart

```bash
nvm use            # use Node version in .nvmrc
yarn install
yarn example       # 🧪 demo app  →  http://localhost:5173
yarn storybook     # 📚 Storybook →  http://localhost:6006
yarn test          # ✅ unit tests
yarn build         # 📦 library build
```

## 📥 Consume in another repo

See [`solo-components/README.md`](./solo-components/README.md) for install
instructions.

## 🚢 Publishing

```bash
yarn patch-release
```

Bumps the latest `vX.Y.Z` tag's patch, creates a GitHub release (which fires
`publish.yml`), and streams the workflow until it lands. The workflow syncs
`solo-components/package.json` `version` from the tag automatically — the
field in the file is a local-dev placeholder.

🚫 **Additive changes only.** For breaking changes, cut a minor or major tag
manually so consumers see the bump.

🆕 **First publish only:** a one-time bootstrap (npm `@solo-io` org access +
`npm login` + enabling Trusted Publishing) is required — see
[`docs/initial-publish`](./docs/initial-publish/README.md). After that, cutting a
release needs only **write access to this repo** (no npm login).

## 🛠️ CI

| Workflow        | Trigger        | What it does                                   |
| --------------- | -------------- | ---------------------------------------------- |
| `test.yml`      | PRs + `main`   | ✅ typecheck · tests · library + example build |
| `storybook.yml` | push to `main` | 📚 builds Storybook → 🌐 GitHub Pages          |
| `publish.yml`   | tag `v*`       | 📦 publishes `@solo-io/ui-components-oss`      |

## 📚 More

- 🧩 Library docs → [`solo-components/README.md`](./solo-components/README.md)
- 🧪 Example app → [`example/README.md`](./example/README.md)
- ➕ Adding another library → [`docs/adding-another-library/README.md`](./docs/adding-another-library/README.md)
- 🚢 Initial publish setup → [`docs/initial-publish/README.md`](./docs/initial-publish/README.md)
- ⚠️ Troubleshooting → [`docs/troubleshooting/README.md`](./docs/troubleshooting/README.md)
