# 阿里云 Workbench 部署说明（GitHub 公开仓库）

适合你选择的方式二：不把 SSH 密码发给任何人，在阿里云 Workbench 里复制粘贴命令执行。

## 0. 先准备 GitHub 公开仓库

把当前项目上传到 GitHub 公开仓库，分支使用 `main`。

仓库地址格式类似：

```text
https://github.com/你的用户名/你的仓库名.git
```

## 1. 打开 Workbench

阿里云 ECS 控制台：

```text
实例列表 → 远程连接 → Workbench 远程连接
```

进入黑色命令窗口后，先确认系统：

```bash
cat /etc/os-release
```

如果是 Ubuntu/Debian，继续下面步骤。

## 2. 一键部署

把下面命令里的 `<你的GitHub仓库地址>` 换成真实仓库地址，然后复制到 Workbench 执行：

```bash
REPO_URL="<你的GitHub仓库地址>"

sudo apt update
sudo apt install -y nginx git curl tar

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

sudo mkdir -p /var/www
sudo rm -rf /var/www/yito
git clone --branch main "$REPO_URL" /var/www/yito
cd /var/www/yito
sudo chown -R "$USER":"$USER" /var/www/yito

cat > .env.production <<'ENV'
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-before-public
NEXT_PUBLIC_SITE_URL=https://yitoai.top
MAX_IMAGE_UPLOAD_MB=12
MAX_VIDEO_UPLOAD_MB=200
ENV

npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save

sudo cp deploy/nginx-yito.conf /etc/nginx/sites-available/yito
sudo ln -sf /etc/nginx/sites-available/yito /etc/nginx/sites-enabled/yito
sudo nginx -t
sudo systemctl reload nginx
```

## 3. 验证

```bash
pm2 status
curl -I http://127.0.0.1:3063
curl -I http://8.146.236.73
```

浏览器访问：

```text
http://8.146.236.73
http://8.146.236.73/admin
```

## 4. 修改后台密码

部署完成后必须修改：

```bash
cd /var/www/yito
nano .env.production
```

把默认值改掉：

```bash
ADMIN_USERNAME=你的后台账号
ADMIN_PASSWORD=你的强密码
```

保存后重启：

```bash
pm2 reload yito-website
```

## 5. 日常更新

以后你本地改完代码并推送到 GitHub 后，服务器执行：

```bash
cd /var/www/yito
git pull origin main
npm install
npm run build
pm2 reload yito-website
```
