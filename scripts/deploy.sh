#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_TARGET="${REMOTE_TARGET:-federico-cerutti@web.unibs.it:website/}"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
DRY_RUN=false
BACKUP_ONLY=false

usage() {
  cat <<'EOF'
Usage: deploy.sh [--dry-run] [--backup-only]

Options:
  --dry-run      Show the deploy rsync changes without writing remote files
  --backup-only  Create the backup and stop before build/deploy
  -h, --help     Show this help text
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      ;;
    --backup-only)
      BACKUP_ONLY=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

if [[ "$REMOTE_TARGET" != *:* ]]; then
  echo "REMOTE_TARGET must be in the form user@host:path" >&2
  exit 1
fi

REMOTE_SPEC="${REMOTE_TARGET%/}"
REMOTE_HOST="${REMOTE_SPEC%%:*}"
REMOTE_PATH="${REMOTE_SPEC#*:}"
REMOTE_PARENT_DIR="$(dirname "$REMOTE_PATH")"
REMOTE_SITE_NAME="$(basename "$REMOTE_PATH")"
REMOTE_BACKUP_DIR="${REMOTE_BACKUP_DIR:-${REMOTE_PARENT_DIR}/.${REMOTE_SITE_NAME}-backups}"
REMOTE_BACKUP_FILE="${REMOTE_BACKUP_DIR%/}/${REMOTE_SITE_NAME}-${TIMESTAMP}.tar.gz"
LOCAL_BACKUP_DIR="${LOCAL_BACKUP_DIR:-$ROOT_DIR/backups/$REMOTE_SITE_NAME}"
LOCAL_BACKUP_FILE="$LOCAL_BACKUP_DIR/${REMOTE_SITE_NAME}-${TIMESTAMP}.tar.gz"

mkdir -p "$LOCAL_BACKUP_DIR"

echo "Creating remote backup: ${REMOTE_HOST}:${REMOTE_BACKUP_FILE}"
ssh "$REMOTE_HOST" \
  "set -euo pipefail; mkdir -p '$REMOTE_BACKUP_DIR'; test -d '$REMOTE_PATH'; tar -C '$REMOTE_PATH' -czf '$REMOTE_BACKUP_FILE' ."

echo "Copying backup locally: $LOCAL_BACKUP_FILE"
rsync -avz "${REMOTE_HOST}:${REMOTE_BACKUP_FILE}" "$LOCAL_BACKUP_FILE"

if [[ "$BACKUP_ONLY" == true ]]; then
  echo "Backup completed; no build or deploy performed"
  echo "Remote backup: ${REMOTE_HOST}:${REMOTE_BACKUP_FILE}"
  echo "Local backup: $LOCAL_BACKUP_FILE"
  exit 0
fi

cd "$ROOT_DIR"
echo "Building site"
npm run build

echo "Deploying to $REMOTE_TARGET"
RSYNC_FLAGS=(-avz --delete)
if [[ "$DRY_RUN" == true ]]; then
  RSYNC_FLAGS+=(--dry-run)
fi
rsync "${RSYNC_FLAGS[@]}" dist/ "$REMOTE_TARGET"

if [[ "$DRY_RUN" == true ]]; then
  echo "Deploy preview completed; no remote files were modified"
else
  echo "Deploy completed"
fi
echo "Remote backup: ${REMOTE_HOST}:${REMOTE_BACKUP_FILE}"
echo "Local backup: $LOCAL_BACKUP_FILE"
