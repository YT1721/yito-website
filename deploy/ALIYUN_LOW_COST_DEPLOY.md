# YITO 阿里云低成本部署方案

这个项目不需要一开始购买 RDS。最省钱的正式部署方式是：

- 一台阿里云轻量应用服务器或 ECS
- Node.js 运行 Next.js
- Nginx 反向代理
- 内容保存到服务器磁盘：`content/site.json`
- 少量图片保存到：`/var/www/yito/shared/uploads`
- 视频只填写外部链接，不上传到服务器

## 推荐配置

低成本起步：

- 轻量应用服务器或 ECS：2核2G 起
- 系统盘：40GB 起
- 带宽：3M 起
- 数据库：暂不购买
- OSS：暂不购买，图片很多时再加

如果访问量上涨：

- 升级到 2核4G
- 图片迁移到 OSS
- 视频统一放第三方平台或对象存储/CDN

## 首次部署

服务器准备：

```bash
sudo apt update
sudo apt install -y nginx git
```

安装 Node.js 20+，然后上传或拉取项目到：

```text
/var/www/yito
```

安装依赖并构建：

```bash
cd /var/www/yito
sudo mkdir -p /var/www/yito/shared/uploads
sudo chown -R "$USER":"$USER" /var/www/yito/shared/uploads
npm install --omit=dev
npm run build
```

创建生产环境变量：

```bash
cp .env.example .env.production
```

修改 `.env.production`：

```bash
ADMIN_USERNAME=你的后台账号
ADMIN_PASSWORD=强密码
NEXT_PUBLIC_SITE_URL=https://yitoai.top
UPLOAD_DIR=/var/www/yito/shared/uploads
MAX_IMAGE_UPLOAD_MB=12
MAX_VIDEO_UPLOAD_MB=200
```

## 启动方式 A：PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

更新代码后：

```bash
cd /var/www/yito
npm install --omit=dev
npm run build
pm2 reload yito-website
```

## 启动方式 B：systemd

复制示例服务：

```bash
sudo cp deploy/systemd-yito.service /etc/systemd/system/yito.service
sudo systemctl daemon-reload
sudo systemctl enable yito
sudo systemctl start yito
```

## Nginx

复制配置：

```bash
sudo cp deploy/nginx-yito.conf /etc/nginx/sites-available/yito
sudo ln -s /etc/nginx/sites-available/yito /etc/nginx/sites-enabled/yito
sudo nginx -t
sudo systemctl reload nginx
```

Nginx 示例已按 `yitoai.top` 和 `www.yitoai.top` 配置。

HTTPS 可以使用阿里云免费证书，或用 Certbot 自动签发。

## 日常备份

后台内容和上传图片在服务器本地磁盘中，需要定期备份：

```bash
npm run backup
```

建议加到 crontab，每天凌晨备份一次：

```bash
0 3 * * * cd /var/www/yito && npm run backup
```

备份目录：

```text
backups/
```

## 运维原则

- 后台密码必须修改，不要使用默认密码。
- 视频尽量使用外部链接，不上传大视频。
- 图片少时可以放本机，图片多了再迁移 OSS。
- 服务器磁盘要定期备份。
- 阿里云安全组只开放 80、443、22。
