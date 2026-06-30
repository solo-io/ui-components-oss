# ➕ Adding another library to the workspace

This workspace currently ships one library (`solo-components`). To add a
second (say `@solo.io/<new-lib>`), copy `solo-components/` as a template and
wire it into the workspace + CI.

## 1. 🗂️ Scaffold the package

```bash
cp -R solo-components <new-lib>
cd <new-lib>
rm -rf node_modules dist storybook-static
```

Edit `<new-lib>/package.json`:

- 🏷️ `name`: `@solo.io/<new-lib>`
- 🔢 `version`: `0.0.1` (local-dev placeholder — CI overwrites from the tag)
- 📦 `main` / `module` / `exports`: replace `solo-components` filenames with
  `<new-lib>` (must match the entry name you set in vite config below)

Edit `<new-lib>/vite.lib.config.ts`:

- ✏️ `build.lib.entry` key → `<new-lib>` (and `name` → a UMD-safe global)
- ➕ Add or remove subpath entries (`styles`, etc.) as needed

## 2. 🧬 Register the workspace

In the root `package.json`:

```jsonc
"workspaces": [
  "solo-components",
  "<new-lib>",            // ← add
  "example"
]
```

Add convenience scripts if you want root-level shortcuts:

```jsonc
"scripts": {
  "build:<new-lib>": "yarn workspace @solo.io/<new-lib> build",
  "test:<new-lib>":  "yarn workspace @solo.io/<new-lib> test"
}
```

Then `yarn install` from the root to link it.

## 3. 🧪 Wire up the example (optional)

If you want hot-reload from the demo app, alias the new package to its
source in `example/vite.config.ts`:

```ts
alias: {
  '@solo.io/ui-components-oss': resolve(__dirname, '../solo-components/src/index.ts'),
  '@solo.io/<new-lib>':     resolve(__dirname, '../<new-lib>/src/index.ts')
}
```

And add it to `example/package.json` dependencies:

```jsonc
"@solo.io/<new-lib>": "workspace:^"
```

## 4. 🚢 Publishing

`publish.yml` and `scripts/patch-release.sh` are currently hardcoded to
`solo-components` — both need updates before a second library can ship.

### `.github/workflows/publish.yml`

The `working-directory: solo-components` lines in the version-sync and
publish steps are package-scoped. Options:

- 🧩 **Per-package tags** (recommended): switch the tag pattern to
  `<new-lib>-v*` / `ui-components-oss-v*` and branch on `GITHUB_REF_NAME` to
  pick the right `working-directory`. Each library gets independent
  versions.
- 🔗 **Synced versions**: keep `v*` tags but publish every library on every
  tag (loop over directories in the publish step). Simpler, but every
  release bumps every package.

### `scripts/patch-release.sh`

Mirrors whatever tag scheme you pick above. The script currently parses
`vMAJOR.MINOR.PATCH` from the latest release — generalize to take a package
name and bump the latest tag matching that package's prefix.

## 5. ✅ Sanity check

```bash
yarn install
yarn workspace @solo.io/<new-lib> build       # 📦 dist/ populated
yarn workspace @solo.io/<new-lib> test        # ✅ tests pass
yarn example                                  # 🌐 imports resolve
```

Then ship a PR. The first publish will happen the next time you cut a tag
under the new scheme.
