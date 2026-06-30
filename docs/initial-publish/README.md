# 🚢 Initial publish (one-time setup)

`@solo.io/ui-components-oss` publishes to the **public npm registry** via **OIDC
Trusted Publishing** — CI authenticates with a short-lived token, no stored
secret. But a trusted publisher can only be attached to a package that already
exists, so the **first** publish is done manually. Do this once; after that,
releases are just `yarn patch-release` (see the [root README](../../README.md#-publishing)).

## 👤 Who needs to do this

Someone with **`@solo.io` npm org admin/owner** rights — they must be able to
publish in the org and configure its Trusted Publisher on npmjs.com. (Routine
releases afterward need only GitHub repo write access — no npm login.)

## 1. Create the package with one manual publish

```bash
npm login                         # 2-hour session (npm's current security model)
nvm use && yarn install
yarn build                        # produces solo-components/dist
cd solo-components
npm pkg set version=0.0.0         # throwaway bootstrap version
npm publish --access public       # creates @solo.io/ui-components-oss on npm
cd ..
```

> Publish `0.0.0` (not `0.0.1`) so it doesn't collide with the first automated
> release. This manual publish has no provenance — expected; CI releases will.

## 2. Enable Trusted Publishing on npmjs.com

Package → **Settings → Trusted Publisher → Add GitHub Actions**:

| Field | Value |
| ----- | ----- |
| Organization / owner | `solo-io` |
| Repository | `ui-components-oss` |
| Workflow filename | `publish.yml` |
| Environment | *(leave blank)* |

Done — from now on `yarn patch-release` publishes tokenlessly via OIDC.
