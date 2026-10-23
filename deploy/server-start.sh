#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/yito"
UPLOAD_DIR="/var/www/yito/shared/uploads"
RUN_USER="deploy"

chown -R "$RUN_USER:$RUN_USER" "$APP_DIR"
mkdir -p "$UPLOAD_DIR"
chown -R "$RUN_USER:$RUN_USER" "$UPLOAD_DIR"
cd "$APP_DIR"

if [ ! -f ".env.production" ]; then
  cp .env.example .env.production
  echo "Created .env.production. Please edit ADMIN_USERNAME and ADMIN_PASSWORD before exposing /admin."
fi

echo "==> Installing dependencies, building and restarting (user: $RUN_USER)"
su - "$RUN_USER" -c "cd $APP_DIR && npm install && npm run build && (pm2 reload yito-website || pm2 start ecosystem.config.cjs) && pm2 save"

echo "==> Configuring Nginx"
if [ ! -e /etc/nginx/sites-enabled/yito ]; then
  cp deploy/nginx-yito.conf /etc/nginx/sites-available/yito
  ln -s /etc/nginx/sites-available/yito /etc/nginx/sites-enabled/yito
  nginx -t
  systemctl reload nginx
fi

echo "==> YITO is running. Test: https://www.yitoai.top"
