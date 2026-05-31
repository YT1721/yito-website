#!/usr/bin/env bash
set -euo pipefail

SERVER="${1:-}"
APP_DIR="/var/www/yito"

if [ -z "$SERVER" ]; then
  echo "Usage: deploy/deploy-local-to-ecs.sh root@8.146.236.73"
  exit 1
fi

echo "==> Creating archive"
tar \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./.npm-cache' \
  --exclude='./backups' \
  --exclude='./deploy/dist' \
  --exclude='./.env' \
  --exclude='./.env.local' \
  --exclude='./.env.production' \
  -czf deploy/dist/yito-website.tar.gz .

echo "==> Uploading archive"
ssh "$SERVER" "sudo mkdir -p $APP_DIR && sudo chown -R \$(whoami):\$(whoami) $APP_DIR"
scp deploy/dist/yito-website.tar.gz "$SERVER:/tmp/yito-website.tar.gz"
ssh "$SERVER" "tar -xzf /tmp/yito-website.tar.gz -C $APP_DIR && cd $APP_DIR && bash deploy/server-start.sh"

echo "==> Deployment complete"
