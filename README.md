# YITO 官网

YITO AI-Native Commercial Visual Studio 的高端商业视觉工作室官网。项目使用 Next.js 15、TailwindCSS、Framer Motion 与 TypeScript 构建，适合后续接入案例 CMS、Open WebUI 知识库或自动内容更新流程。

## 技术栈

- Next.js 15 App Router
- React 19
- TypeScript
- TailwindCSS 4
- Framer Motion
- lucide-react

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3063` 查看页面。

后台管理入口：

```text
http://localhost:3063/admin
```

## 后台管理

后台入口默认启用了基础访问保护：

```text
默认账号：admin
默认密码：yito2026
```

正式部署前请在环境变量中修改：

```bash
ADMIN_USERNAME=your-admin-name
ADMIN_PASSWORD=your-strong-password
```

后台支持直接修改网站所有主要内容：

- Hero：主标题、副标题、按钮、首屏视觉
- About：工作室介绍、能力标签、观点文案
- Services：服务卡片，可新增、删除、排序、替换封面
- Selected Works：精选案例入口，可新增、删除、排序、替换封面
- Case Studies：作品二级详情页，可编辑 slug、简介、详细介绍、行业、标签、视频、主视觉、缩略图
- Process：工作流程，可新增、删除、排序
- Why Choose：优势卡片，可编辑图标、标题、说明
- Contact：微信、邮箱、小红书和结尾视觉
- JSON：高级批量编辑、备份、迁移

修改后点击「保存并发布」。前台刷新后会读取最新内容。

内容保存时会先校验基础结构，并自动生成 `content/site.backup.json` 备份。

## 替换图片

每个可视化区域都有两种方式：

1. 上传本地图片：后台会自动保存到 `public/uploads`。
2. 填写图片 URL：可使用外部 CDN 或站内路径。

如果不上传图片，页面会使用内置的电影感渐变视觉作为备用封面。

上传限制默认如下，可通过环境变量调整：

```bash
MAX_IMAGE_UPLOAD_MB=12
MAX_VIDEO_UPLOAD_MB=200
```

## 作品二级页

作品详情页路径格式：

```text
/works/作品slug
```

示例：

```text
http://localhost:3063/works/ev-launch-film
```

在后台的「案例详情」中可以维护每个作品的：

- `slug`：详情页路径
- 作品简介
- 详细介绍
- 行业
- 标签
- 项目信息
- 主视觉图片
- 缩略图
- 视频地址或上传视频

在「精选案例」里可以选择关联到哪个详情页。

## 生产构建

```bash
npm run build
npm run start
```

## SEO

项目已内置：

- 全站 Metadata
- Open Graph / Twitter Card
- 作品详情页独立标题与描述
- `robots.txt`
- `sitemap.xml`
- Organization / CreativeWork JSON-LD 结构化数据

正式上线前请设置站点域名：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 内容维护

当前首页内容集中在 `content/site.json`：

- `hero`：首屏内容
- `about`：关于介绍
- `services`：服务内容
- `selectedWorks`：精选案例
- `caseStudies`：案例详情
- `process`：工作流程
- `why`：选择理由
- `contact`：联系方式

后台会通过 `/api/content` 读写这份文件，图片上传接口为 `/api/upload`。

## Vercel 部署

1. 将项目推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 新建项目并导入仓库。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用 `npm run build`。
5. Output Directory 保持默认。
6. 部署完成后，在 Vercel Project Settings 中绑定自定义域名。

注意：当前内置后台使用项目文件系统保存内容，适合本地运维或自有 Node 服务器。Vercel Serverless 环境的文件写入不是持久化存储；如果要在 Vercel 上长期使用后台，需要把 `/api/content` 和 `/api/upload` 换成数据库、Vercel Blob、Sanity、Payload CMS、Strapi 等持久化方案。

生产部署建议：

- 必须修改后台默认账号密码
- 自有服务器需要给 `content` 和 `public/uploads` 目录写入权限
- Vercel 等 Serverless 平台需要接入持久化存储
- 上传大视频建议使用对象存储或 CDN

## 阿里云低成本部署

如果作品数量不多、视频用外部链接呈现，可以不购买 RDS 数据库，也不购买 OSS：

- 一台阿里云轻量应用服务器或 ECS
- Next.js + Nginx
- 内容持久化到 `content/site.json`
- 少量上传图片放到 `public/uploads`
- 视频只保存链接
- 每天定时备份 `content` 和 `public/uploads`

详细步骤见：

```text
deploy/ALIYUN_LOW_COST_DEPLOY.md
```

如果使用阿里云 Workbench 和 GitHub 公开仓库部署，直接看：

```text
deploy/WORKBENCH_DEPLOY_GUIDE.md
```

项目已提供：

- `ecosystem.config.cjs`：PM2 启动配置
- `deploy/nginx-yito.conf`：Nginx 反向代理示例
- `deploy/systemd-yito.service`：systemd 服务示例
- `scripts/backup-content.mjs`：内容与上传文件备份脚本

## 品牌资产

LOGO 已放置在 `public/yito-logo-white.png`，页面导航和后台会直接引用该文件。
