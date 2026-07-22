#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$APP_ROOT"

if [[ -f package-lock.json ]]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

if pm2 describe "${PM2_APP_NAME}" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --only "${PM2_APP_NAME}" --update-env
else
  pm2 start ecosystem.config.js --only "${PM2_APP_NAME}" --update-env
fi

pm2 save
