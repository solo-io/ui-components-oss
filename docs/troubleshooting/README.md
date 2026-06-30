# ⚠️ Troubleshooting

Things that bite when integrating `@solo-io/ui-components-oss` into a consumer.

## ⚛️ Duplicate React instances

- 💥 **Symptom:** "Invalid hook call", missing context, components rendering
  twice, hooks throwing inside `<Button>`.
- 🧠 **Cause:** `react` got bundled into `dist/` or the consumer ended up with
  two resolved copies.
- 🧹 **Fix:** `react` / `react-dom` are peer deps here, never `dependencies`.
  Verify with `yarn why react` in the consumer — only one copy should show up.

## 🎨 Duplicate Emotion (`@emotion/react`, `@emotion/styled`)

- 💥 **Symptom:** Styles fail to apply, `ThemeProvider` value is `undefined`
  inside library components, or `css` props are silently dropped.
- 🧠 **Cause:** Two `@emotion/react` instances → two caches → broken context.
- 🧹 **Fix:** Same as React — peer dep only. `yarn why @emotion/react` should
  return exactly one resolution.

## 📦 `404 Not Found` on install

- 💥 **Symptom:** `yarn add @solo-io/ui-components-oss` fails with `404`.
- 🧠 **Cause:** a typo in the scope (it's `@solo-io`, with a hyphen), or the
  version you pinned hasn't been published yet.
- 🧹 **Fix:** the package is public on the npm registry — no token needed.
  List the published versions with:
  ```bash
  npm view @solo-io/ui-components-oss versions
  ```
