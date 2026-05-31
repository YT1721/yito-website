#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${1:-}"
BRANCH="${2:-main}"
APP_DIR="/var/www/yito"

if [ -z "$REPO_URL" ]; then
  echo "Usage: bash deploy/workbench-deploy-from-github.sh https://github.com/user/repo.git [branch]"
  exit 1
fi

echo "==> Installing system packages"
sudo apt update
sudo apt install -y nginx git curl tar

if ! command -v node >/dev/null 2>&1; then
  echo "==> Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Installing PM2"
  sudo npm install -g pm2
fi

echo "==> Preparing app directory: $APP_DIR"
sudo mkdir -p /var/www

if [ -d "$APP_DIR/.git" ]; then
  echo "==> Existing repository found. Pulling latest code."
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  echo "==> Cloning repository"
  sudo rm -rf "$APP_DIR"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

sudo chown -R "$USER":"$USER" "$APP_DIR"

if [ ! -f ".env.production" ]; then
  cp .env.example .env.production
  cat > .env.production <<'ENV'
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-before-public
NEXT_PUBLIC_SITE_URL=https://yitoai.top
MAX_IMAGE_UPLOAD_MB=12
MAX_VIDEO_UPLOAD_MB=200
ENV
  echo "==> Created .env.production. IMPORTANT: edit ADMIN_USERNAME and ADMIN_PASSWORD after deployment."
fi

echo "==> Installing dependencies"
npm install

echo "==> Building website"
npm run build

echo "==> Starting app with PM2"
pm2 start ecosystem.config.cjs || pm2 reload yito-website
pm2 save

echo "==> Configuring Nginx"
sudo cp deploy/nginx-yito.conf /etc/nginx/sites-available/yito
if [ ! -e /etc/nginx/sites-enabled/yito ]; then
  sudo ln -s /etc/nginx/sites-available/yito /etc/nginx/sites-enabled/yito
fi

sudo nginx -t
sudo systemctl reload nginx

echo "==> Deployment complete"
echo "Frontend: http://8.146.236.73"
echo "Admin:    http://8.146.236.73/admin"
echo ""
echo "Next step: edit $APP_DIR/.env.production and replace the default admin password, then run:"
echo "cd $APP_DIR && pm2 reload yito-website"
