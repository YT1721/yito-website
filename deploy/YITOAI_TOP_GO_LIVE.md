# yitoai.top 上线步骤

你当前服务器信息：

- ECS 公网 IP：`8.146.236.73`
- 域名：`yitoai.top`
- 规格：2核 / 2GiB
- 地域：华北6（乌兰察布）

## 1. 域名解析

在阿里云 DNS 里添加两条 A 记录：

```text
@      A      8.146.236.73
www    A      8.146.236.73
```

解析生效后：

```text
yitoai.top
www.yitoai.top
```

都会指向这台服务器。

## 2. 安全组

ECS 安全组至少开放：

```text
22   SSH
80   HTTP
443  HTTPS
```

不要开放 3063 给公网，3063 只给 Nginx 本机反代使用。

## 3. 备案

如果要用中国大陆 ECS 正式访问域名，需要完成 ICP 备案。

备案完成前可以先用公网 IP 测试部署：

```text
http://8.146.236.73
```

## 4. 项目目录

建议放到：

```text
/var/www/yito
```

## 5. 生产环境变量

在服务器项目目录创建 `.env.production`：

```bash
ADMIN_USERNAME=你的后台账号
ADMIN_PASSWORD=你的强密码
NEXT_PUBLIC_SITE_URL=https://yitoai.top
MAX_IMAGE_UPLOAD_MB=12
MAX_VIDEO_UPLOAD_MB=200
```

## 6. 构建启动

```bash
npm install --omit=dev
npm run build
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
```

如果你使用 GitHub 公开仓库 + Workbench 部署，优先看：

```text
deploy/WORKBENCH_DEPLOY_GUIDE.md
```

## 7. Nginx

```bash
sudo cp deploy/nginx-yito.conf /etc/nginx/sites-available/yito
sudo ln -s /etc/nginx/sites-available/yito /etc/nginx/sites-enabled/yito
sudo nginx -t
sudo systemctl reload nginx
```

## 8. HTTPS

备案和解析完成后，再配置 HTTPS。

可以用阿里云免费证书，或使用 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yitoai.top -d www.yitoai.top
```

## 9. 每日备份

```bash
crontab -e
```

加入：

```text
0 3 * * * cd /var/www/yito && npm run backup
```
