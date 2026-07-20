#!/usr/bin/env bash
# Deploy the latest main branch. Runs ON the EC2 instance (invoked by the
# GitHub Actions workflow over SSH, or manually).
set -euo pipefail

APP_DIR="/var/app/business-prospect-manager"
cd "$APP_DIR"

echo "== Pulling main"
git fetch origin main
git reset --hard origin/main

echo "== Installing dependencies"
npm ci

echo "== Building"
npm run build

# The SQLite schema is created and seeded automatically on server start
# (src/instrumentation.ts) — no separate migration step.

echo "== Restarting"
pm2 restart bpm 2>/dev/null || pm2 start npm --name bpm -- start
pm2 save

echo "== Health check"
sleep 3
curl -sf http://127.0.0.1:3000/api/health
echo
echo "Deploy complete"
