#!/usr/bin/env bash
# patch-release — bump the patch version, fire the publish workflow, and watch it land. 🚀
set -euo pipefail

emoji_step()    { printf '\n🎬  %s\n' "$*"; }
emoji_info()    { printf 'ℹ️   %s\n' "$*"; }
emoji_ok()      { printf '✅  %s\n' "$*"; }
emoji_warn()    { printf '⚠️   %s\n' "$*"; }
emoji_fail()    { printf '💥  %s\n' "$*" >&2; }
emoji_wait()    { printf '⏳  %s\n' "$*"; }
emoji_link()    { printf '🔗  %s\n' "$*"; }
emoji_party()   { printf '🎉  %s\n' "$*"; }

# 🛡️  Prereq checks
command -v gh >/dev/null || { emoji_fail "GitHub CLI (gh) not found. Install: https://cli.github.com/"; exit 1; }
gh auth status >/dev/null 2>&1 || { emoji_fail "gh is not authenticated. Run: gh auth login"; exit 1; }

emoji_step "🔎  Looking up the latest release tag"
LATEST_TAG=$(gh release list --limit 1 --json tagName --jq '.[0].tagName // empty')
if [[ -z "$LATEST_TAG" ]]; then
  emoji_warn "No prior releases found — starting from v0.0.0"
  LATEST_TAG="v0.0.0"
fi
emoji_info "Latest release:  🏷️  $LATEST_TAG"

# 🧮  Parse semver and bump patch
SEMVER_RE='^v([0-9]+)\.([0-9]+)\.([0-9]+)$'
if [[ ! "$LATEST_TAG" =~ $SEMVER_RE ]]; then
  emoji_fail "Latest tag '$LATEST_TAG' isn't plain vMAJOR.MINOR.PATCH — can't auto-bump. Cut the next release manually."
  exit 1
fi
MAJOR="${BASH_REMATCH[1]}"; MINOR="${BASH_REMATCH[2]}"; PATCH="${BASH_REMATCH[3]}"
NEW_PATCH=$((PATCH + 1))
NEW_TAG="v${MAJOR}.${MINOR}.${NEW_PATCH}"
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"
emoji_info "Next release:    🆕  $NEW_TAG"

# 🚦  Confirm the tag isn't already taken (race / manual creation)
if gh release view "$NEW_TAG" >/dev/null 2>&1; then
  emoji_fail "Release '$NEW_TAG' already exists. Bailing so we don't trample it."
  exit 1
fi

emoji_step "🚀  Creating GitHub release $NEW_TAG (this pushes the tag → fires publish.yml)"
RELEASE_URL=$(gh release create "$NEW_TAG" --generate-notes --title "$NEW_TAG")
emoji_ok "Release created:  $RELEASE_URL"
emoji_party "📦  New version: $NEW_VERSION"

# 🔍  The push-tag event fires publish.yml; the run usually appears within a few seconds.
emoji_step "🛰️   Locating the publish.yml workflow run for $NEW_TAG"
REPO_SLUG=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
RUN_ID=""
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  RUN_ID=$(gh run list \
    --workflow=publish.yml \
    --event=push \
    --limit 5 \
    --json databaseId,headBranch,status \
    --jq ".[] | select(.headBranch==\"$NEW_TAG\") | .databaseId" \
    | head -n1)
  if [[ -n "$RUN_ID" ]]; then break; fi
  emoji_wait "Workflow run hasn't shown up yet (attempt $attempt/10) — sleeping 3s…"
  sleep 3
done

if [[ -z "$RUN_ID" ]]; then
  emoji_fail "Could not find a publish.yml run for $NEW_TAG after 30s."
  emoji_link "Check manually: https://github.com/$REPO_SLUG/actions/workflows/publish.yml"
  exit 1
fi

RUN_URL="https://github.com/$REPO_SLUG/actions/runs/$RUN_ID"
emoji_ok "Workflow run found 🆔 $RUN_ID"
emoji_link "Watch in browser: $RUN_URL"

# 👀  Stream status updates until the run terminates. `gh run watch` polls every ~3s
# and exits non-zero on failure thanks to --exit-status.
emoji_step "👀  Streaming workflow status (this blocks until the run finishes)"
emoji_info "You can Ctrl+C to detach — the workflow keeps running on GitHub regardless. 🏃"

if gh run watch "$RUN_ID" --exit-status; then
  emoji_party "🟢  Publish workflow succeeded for $NEW_TAG"
  emoji_link "Run summary: $RUN_URL"
  emoji_link "Package:    https://www.npmjs.com/package/@solo-io/ui-components-oss"
  emoji_party "✨  @solo-io/ui-components-oss@$NEW_VERSION is live on npm 📬"
  exit 0
else
  emoji_fail "🔴  Publish workflow failed for $NEW_TAG"
  emoji_link "Logs:       $RUN_URL"
  emoji_warn "📜  Tailing failed-step logs below (gh run view --log-failed):"
  echo
  gh run view "$RUN_ID" --log-failed || true
  exit 1
fi
