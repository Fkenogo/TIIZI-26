#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

for p in 3000 3001 3002 5173 8080 9099 9399 5432; do
  pid="$(lsof -tiTCP:$p -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "${pid}" ]; then
    kill ${pid} 2>/dev/null || true
  fi
done

rm -rf node_modules/.vite dist

echo "Starting emulators (auth, firestore, dataconnect)..."
firebase emulators:start --only auth,firestore,dataconnect
