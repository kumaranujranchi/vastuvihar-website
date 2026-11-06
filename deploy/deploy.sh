#!/usr/bin/env bash
# Fast zero-downtime deployment script for AWS Lightsail
set -e

APP_DIR="/var/www/vastuvihar-website"
cd "$APP_DIR"

echo "=== [1/5] Pulling latest code from origin/main ==="
git pull origin main

echo "=== [2/5] Installing dependencies ==="
npm ci

echo "=== [3/5] Updating database schema ==="
npx prisma db push

echo "=== [4/5] Building Next.js production build ==="
npm run build

echo "=== [5/5] Reloading PM2 app (vastuvihar) ==="
pm2 reload vastuvihar --update-env || pm2 restart vastuvihar

echo "=== Deployment successful and live! ==="
