#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/yito"
UPLOAD_DIR="/var/www/yito/shared/uploads"

cd "$APP_DIR"

mkdir -p "$UPLOAD_DIR"

if [ ! -f ".env.production" ]; then
  cp .env.example .env.production
  echo "Created .env.production. Please edit ADMIN_USERNAME and ADMIN_PASSWORD before exposing /admin."
fi

echo "==> Installing dependencies"
npm install

echo "==> Building"
npm run build

echo "==> Starting app with PM2"
pm2 start ecosystem.config.cjs || pm2 reload yito-website
pm2 save

echo "==> Configuring Nginx"
if [ ! -e /etc/nginx/sites-enabled/yito ]; then
  sudo cp deploy/nginx-yito.conf /etc/nginx/sites-available/yito
  sudo ln -s /etc/nginx/sites-available/yito /etc/nginx/sites-enabled/yito
  sudo nginx -t
  sudo systemctl reload nginx
fi

echo "==> YITO is running. Test: http://8.146.236.73"
