#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/yito"
DOMAIN="yitoai.top"

echo "==> Installing system packages"
sudo apt update
sudo apt install -y nginx curl git tar

if ! command -v node >/dev/null 2>&1; then
  echo "==> Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Installing PM2"
  sudo npm install -g pm2
fi

echo "==> Preparing app directory"
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER":"$USER" "$APP_DIR"

echo "==> Done. Upload project files to $APP_DIR, then run deploy/server-start.sh"
