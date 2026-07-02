#!/usr/bin/env bash
# 快速部署脚本 - 拉取 GitHub 最新代码并部署到服务器
# 使用方法: bash deploy-quick.sh root@8.146.236.73

SERVER="${1:-}"

if [ -z "$SERVER" ]; then
  echo "使用方法: bash deploy-quick.sh root@8.146.236.73"
  exit 1
fi

echo "🚀 开始部署..."
echo "目标服务器: $SERVER"

ssh "$SERVER" << 'ENDSSH'
cd /var/www/yito

echo "📥 拉取最新代码..."
git pull origin main

echo "📦 安装依赖..."
npm install

echo "🔨 构建应用..."
npm run build

echo "🔄 重启服务..."
pm2 reload yito-website

echo "✅ 部署完成！"
pm2 status
ENDSSH

echo ""
echo "🎉 部署成功！"
echo "访问网站: http://8.146.236.73"
