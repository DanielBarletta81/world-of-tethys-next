#!/usr/bin/env bash
set -euo pipefail

# Push the current Basic-PacMan branch and history to a destination repository.
# Usage:
#   scripts/push_to_tethys.sh git@github.com:<org>/world-of-tethys-next.git [branch]

DEST_REMOTE_URL="${1:-}"
DEST_BRANCH="${2:-$(git rev-parse --abbrev-ref HEAD)}"
TEMP_REMOTE_NAME="tethys-next"

if [[ -z "$DEST_REMOTE_URL" ]]; then
  echo "Usage: $0 <destination-remote-url> [destination-branch]" >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: this script must be run inside a git repository." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is not clean. Commit or stash changes before pushing." >&2
  exit 1
fi

if git remote get-url "$TEMP_REMOTE_NAME" >/dev/null 2>&1; then
  git remote set-url "$TEMP_REMOTE_NAME" "$DEST_REMOTE_URL"
else
  git remote add "$TEMP_REMOTE_NAME" "$DEST_REMOTE_URL"
fi

SOURCE_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "Pushing ${SOURCE_BRANCH} -> ${TEMP_REMOTE_NAME}/${DEST_BRANCH}"
git push "$TEMP_REMOTE_NAME" "${SOURCE_BRANCH}:${DEST_BRANCH}"

echo "Done. Repository content has been pushed to ${DEST_REMOTE_URL} (${DEST_BRANCH})."
