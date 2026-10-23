#!/usr/bin/env bash
# 部署到 ECS。
# 用法: deploy/deploy-local-to-ecs.sh <user@host> [--push-content]
#
# 内容规则（线上为准）：
#   - 默认不下发 content/site.json，线上后台改的内容不会被覆盖。
#   - 本地内容与线上不一致时脚本会中止，避免误覆盖。
#   - 需要把本地内容发布上去时，显式加 --push-content。
set -euo pipefail

SERVER="${1:-}"
PUSH_CONTENT=0
for arg in "$@"; do
  [ "$arg" = "--push-content" ] && PUSH_CONTENT=1
done

APP_DIR="/var/www/yito"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/yito_deploy}"
SSH_OPTS=(-o BatchMode=yes)

if [ -f "$SSH_KEY" ]; then
  SSH_OPTS+=(-i "$SSH_KEY")
fi

if [ -z "$SERVER" ]; then
  echo "Usage: deploy/deploy-local-to-ecs.sh user@8.146.236.73 [--push-content]"
  exit 1
fi

echo "==> Syncing remote content"
mkdir -p tmp
scp "${SSH_OPTS[@]}" "$SERVER:$APP_DIR/content/site.json" tmp/remote-site.json

# 按 JSON 语义比较：后台保存过的文件会被重新排版，字节不同但内容一致
same_content() {
  node -e '
    const fs = require("fs");
    const norm = (p) => JSON.stringify(JSON.parse(fs.readFileSync(p, "utf8")));
    process.exit(norm(process.argv[1]) === norm(process.argv[2]) ? 0 : 1);
  ' content/site.json tmp/remote-site.json 2>/dev/null
}

if [ "$PUSH_CONTENT" -eq 0 ] && ! same_content; then
  echo "!! 本地 content/site.json 与线上不一致。"
  echo "   发布内容请加 --push-content；放弃本地改动请先执行："
  echo "   cp tmp/remote-site.json content/site.json"
  exit 1
fi

echo "==> Creating archive (push-content=$PUSH_CONTENT)"
EXCLUDES=(
  --exclude='./node_modules'
  --exclude='./.next'
  --exclude='./.next.cache-bak-*'
  --exclude='./.npm-cache'
  --exclude='./backups'
  --exclude='./tmp'
  --exclude='./deploy/dist'
  --exclude='./.env'
  --exclude='./.env.local'
  --exclude='./.env.production'
  --exclude='./public/videos'
  --exclude='./public/project-assets'
  --exclude='./.git'
  --exclude='**/._*'
  --exclude='.DS_Store'
)
if [ "$PUSH_CONTENT" -eq 0 ]; then
  EXCLUDES+=(--exclude='./content/site.json')
fi

COPYFILE_DISABLE=1 tar --no-xattrs "${EXCLUDES[@]}" -czf deploy/dist/yito-website.tar.gz .

echo "==> Uploading archive"
ssh "${SSH_OPTS[@]}" "$SERVER" "mkdir -p $APP_DIR"
scp "${SSH_OPTS[@]}" deploy/dist/yito-website.tar.gz "$SERVER:/tmp/yito-website.tar.gz"

echo "==> Extract and restart"
ssh "${SSH_OPTS[@]}" "$SERVER" "cd $APP_DIR && tar -xzf /tmp/yito-website.tar.gz && bash deploy/server-start.sh"

echo "==> Deployment complete"
