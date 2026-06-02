# YITO 官网项目 - Code Wiki

## 项目概述

**项目名称**: YITO AI-Native Commercial Visual Studio (YITO 官网)

**项目描述**: 一个高端商业视觉工作室官网，使用 Next.js 15、TailwindCSS、Framer Motion 与 TypeScript 构建。内置后台内容管理系统，支持修改网站所有主要内容。

**技术栈**:

- Next.js 15 App Router
- React 19
- TypeScript
- TailwindCSS 4
- Framer Motion
- lucide-react (图标库)
- PM2 (进程管理)

---

## 项目架构

### 目录结构

```
yito-ai-visual-studio/
├── app/                           # Next.js App Router 页面
│   ├── admin/                    # 后台管理页面
│   │   └── page.tsx              # CMS 主界面
│   ├── api/                      # API 路由
│   │   ├── content/              # 内容读写 API
│   │   │   └── route.ts
│   │   └── upload/               # 文件上传 API
│   │       └── route.ts
│   ├── works/                    # 作品详情页路由
│   │   └── [slug]/
│   │       ├── page.tsx          # 服务端组件
│   │       └── work-detail-client.tsx
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   ├── robots.ts                 # SEO robots
│   └── sitemap.ts                # SEO sitemap
├── content/                      # 内容数据存储
│   └── site.json                 # 主内容文件
├── deploy/                       # 部署相关文件
│   ├── ALIYUN_LOW_COST_DEPLOY.md
│   ├── WORKBENCH_DEPLOY_GUIDE.md
│   ├── YITOAI_TOP_GO_LIVE.md
│   ├── deploy-local-to-ecs.sh
│   ├── nginx-yito.conf
│   ├── server-bootstrap.sh
│   ├── server-start.sh
│   └── systemd-yito.service
├── lib/                          # 工具库
│   └── content-types.ts          # TypeScript 类型定义
├── public/                       # 静态资源
│   ├── uploads/                  # 上传文件目录（自动创建）
│   ├── yito-logo-white-v2.png
│   ├── yito-logo-white.png
│   └── yito-logo.png
├── scripts/                      # 脚本
│   └── backup-content.mjs        # 内容备份脚本
├── .env.example                  # 环境变量示例
├── ecosystem.config.cjs          # PM2 配置
├── next.config.ts                # Next.js 配置
├── package.json
└── middleware.ts                 # Next.js 中间件（认证）
```

---

## 主要模块职责

### 1. 首页模块 ([`app/page.tsx`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/page.tsx))

**职责**: 展示网站首页，包含所有主要章节

**主要功能**:

- Hero 首屏展示
- About 工作室介绍
- Services 服务展示
- Selected Works 精选案例
- Case Studies 案例预览
- Process 工作流程
- Why Choose 选择理由
- Contact 联系方式
- JSON-LD 结构化数据
- Framer Motion 动画效果

**关键组件**:

- `FloatingNav`: 悬浮导航栏
- `Chapter`: 章节容器组件
- `CinematicVisual`: 电影感视觉展示
- `VisualSurface`: 视觉卡片展示
- `HoverNavLink`: 导航链接

---

### 2. 后台管理模块 ([`app/admin/page.tsx`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/admin/page.tsx))

**职责**: 提供可视化的内容管理界面

**主要功能**:

- Hero 首屏编辑
- About 关于页面编辑
- Services 服务管理（增删改排序）
- Selected Works 精选案例管理
- Case Studies 案例详情管理
- Process 工作流程编辑
- Why Choose 选择理由编辑
- Contact 联系方式编辑
- 高级 JSON 编辑（批量操作）
- 图片/视频上传

**关键组件**:

- `Panel`: 编辑面板容器
- `Grid`: 栅格布局
- `Stack`: 堆叠布局
- `Field`: 文本输入框
- `TextArea`: 多行文本输入
- `SelectField`: 选择框
- `VisualEditor`: 视觉内容编辑器（支持上传和 URL）
- `EditableCard`: 可编辑卡片（支持上移、下移、删除）
- `AddButton`: 添加按钮
- `UploadOnly`: 仅上传组件

---

### 3. 作品详情页模块 ([`app/works/[slug]/page.tsx`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/works/[slug]/page.tsx))

**职责**: 展示单个作品的详细信息

**主要功能**:

- 作品元数据（generateMetadata）
- SEO 优化（Open Graph、Twitter Card）
- 动态路由匹配
- 调用客户端组件展示详情

**相关文件**:

- [`work-detail-client.tsx`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/works/[slug]/work-detail-client.tsx): 详情页客户端组件

---

### 4. 内容 API 模块 ([`app/api/content/route.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/api/content/route.ts))

**职责**: 处理内容的读写操作

**主要功能**:

- `GET`: 读取 `content/site.json` 内容
- `POST`: 写入新内容到 `content/site.json`
- 内容验证
- 自动备份（写入前先备份为 `site.backup.json`）
- 原子写入（使用临时文件确保一致性）

**验证规则**:

- Hero 标题必填
- Contact 邮箱必填
- caseStudies 必须是数组
- 每个 caseStudy 必须有 slug
- slug 不能重复

---

### 5. 上传 API 模块 ([`app/api/upload/route.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/api/upload/route.ts))

**职责**: 处理图片和视频上传

**主要功能**:

- 支持图片类型: jpeg, png, webp, gif
- 支持视频类型: mp4, webm, mov
- 文件大小限制（可配置）
- 自动生成唯一文件名
- 保存到 `public/uploads/` 目录
- 返回可访问的 URL

**配置项**:

- `MAX_IMAGE_UPLOAD_MB`: 图片大小限制（默认 12MB）
- `MAX_VIDEO_UPLOAD_MB`: 视频大小限制（默认 200MB）

---

### 6. 认证中间件 ([`middleware.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/middleware.ts))

**职责**: 保护后台和敏感 API 路由

**保护路由**:

- `/admin/*`: 后台管理页面
- `/api/upload/*`: 上传 API
- `/api/content/*` (非 GET 请求): 内容写入 API

**认证方式**: HTTP Basic Auth

**配置项**:

- `ADMIN_USERNAME`: 后台用户名（默认: admin）
- `ADMIN_PASSWORD`: 后台密码（默认: yito2026）

---

## 关键类与函数说明

### 类型定义 ([`lib/content-types.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/lib/content-types.ts))

```typescript
// 图标名称类型
type IconName =
  | "badge"
  | "boxes"
  | "clapperboard"
  | "film"
  | "gauge"
  | "pen"
  | "sparkles"
  | "wand";

// 视觉块类型
type VisualBlock = {
  visual: string; // 视觉风格名称
  image?: string; // 图片 URL（可选，优先使用）
};

// Hero 内容
type HeroContent = {
  no: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  visual: string;
  image?: string;
  visualLabel: string;
};

// About 内容
type AboutContent = {
  no: string;
  title: string;
  subtitle: string;
  body: string;
  capabilities: string[];
  statement: string;
  visual: string;
  image?: string;
  visualLabel: string;
};

// 服务项
type ServiceItem = VisualBlock & {
  title: string;
  en: string;
  icon: IconName;
};

// 精选案例项
type WorkItem = VisualBlock & {
  title: string;
  en: string;
  caseSlug?: string;
};

// 案例详情
type CaseStudy = VisualBlock & {
  no: string;
  slug: string;
  title: string;
  en: string;
  summary: string;
  description: string;
  industry: string;
  tags: string[];
  videoUrl?: string;
  meta: string[];
  thumbs: VisualBlock[];
};

// 网站内容根类型
type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  services: {
    no: string;
    title: string;
    subtitle: string;
    microCopy: string;
    items: ServiceItem[];
  };
  selectedWorks: {
    no: string;
    title: string;
    subtitle: string;
    intro: string;
    linkText: string;
    items: WorkItem[];
  };
  caseStudies: CaseStudy[];
  process: {
    no: string;
    title: string;
    subtitle: string;
    steps: { title: string; detail: string }[];
  };
  why: {
    no: string;
    title: string;
    subtitle: string;
    items: { title: string; text: string; icon: IconName }[];
  };
  contact: {
    no: string;
    title: string;
    subtitle: string;
    wechat: string;
    email: string;
    xiaohongshu: string;
    visual: string;
    image?: string;
    visualLabel: string;
  };
};
```

### 首页组件函数

#### `Home()`

- **用途**: 首页主组件
- **功能**: 从 `/api/content` 获取最新内容并渲染所有章节

#### `FloatingNav()`

- **用途**: 悬浮导航栏
- **功能**: 展示 Logo 和导航链接（About, Services, Work, Process, Contact）

#### `HoverNavLink({ href, en, zh })`

- **用途**: 带悬停效果的导航链接
- **参数**:
  - `href`: 链接目标
  - `en`: 英文文本
  - `zh`: 中文文本

#### `Chapter({ id, no, title, subtitle, className, children })`

- **用途**: 章节容器组件
- **功能**: 提供统一的章节样式和动画效果

#### `CinematicVisual({ block, label })`

- **用途**: 电影感视觉展示组件
- **功能**: 展示带标签和边框的大视觉块

#### `VisualSurface({ block, className })`

- **用途**: 视觉卡片组件
- **功能**: 展示较小的视觉块

#### `visualStyle(image?)`

- **用途**: 生成视觉块样式
- **返回**: CSS 样式对象或 undefined

---

### 后台管理组件函数

#### `AdminPage()`

- **用途**: 后台管理主组件
- **功能**:
  - 加载和保存内容
  - 管理编辑状态
  - 切换编辑面板
  - 提供高级 JSON 编辑

#### `update(mutator)`

- **用途**: 更新内容状态
- **参数**: `mutator` - 修改 draft 的函数
- **功能**: 使用 structuredClone 确保不可变更新

#### `save()`

- **用途**: 保存内容到服务器
- **功能**: POST 到 `/api/content`

#### `applyJson()`

- **用途**: 应用 JSON 编辑器内容
- **功能**: 解析并应用高级 JSON 编辑

#### `Panel({ title, intro, children })`

- **用途**: 编辑面板容器

#### `VisualEditor({ block, compact, onChange })`

- **用途**: 视觉内容编辑器
- **功能**:
  - 选择视觉风格
  - 输入图片 URL
  - 上传本地图片
  - 预览图片

#### `EditableCard({ title, children, onRemove, onMoveUp, onMoveDown })`

- **用途**: 可编辑卡片
- **功能**: 提供上移、下移、删除操作

#### `move<T>(items, from, to)`

- **用途**: 移动数组元素
- **参数**:
  - `items`: 数组
  - `from`: 源索引
  - `to`: 目标索引

#### `lines(value)`

- **用途**: 将多行文本转换为数组
- **功能**: 按行分割、去空、去首尾空格

#### `slugify(value)`

- **用途**: 生成 URL 友好的 slug
- **功能**: 转小写、替换非字母数字为连字符、截断

---

### API 函数

#### `GET()` ([`app/api/content/route.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/api/content/route.ts))

- **用途**: 读取网站内容
- **返回**: JSON 格式的 SiteContent

#### `POST(request)` ([`app/api/content/route.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/api/content/route.ts))

- **用途**: 保存网站内容
- **参数**: `request` - 包含 JSON 内容的请求
- **功能**: 验证、备份、原子写入

#### `validateContent(content)`

- **用途**: 验证内容结构
- **返回**: 错误信息字符串，验证通过返回空字符串

#### `POST(request)` ([`app/api/upload/route.ts`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/app/api/upload/route.ts))

- **用途**: 处理文件上传
- **参数**: `request` - FormData 请求
- **返回**: `{ url: string }`

---

## 依赖关系

### 生产依赖

| 依赖包        | 版本     | 用途           |
| ------------- | -------- | -------------- |
| next          | ^15.3.2  | Next.js 框架   |
| react         | ^19.1.0  | React 核心库   |
| react-dom     | ^19.1.0  | React DOM 渲染 |
| framer-motion | ^12.12.1 | 动画库         |
| lucide-react  | ^0.511.0 | 图标库         |

### 开发依赖

| 依赖包               | 版本      | 用途                     |
| -------------------- | --------- | ------------------------ |
| @tailwindcss/postcss | ^4.1.7    | TailwindCSS PostCSS 插件 |
| @types/node          | ^22.15.18 | Node.js 类型定义         |
| @types/react         | ^19.1.4   | React 类型定义           |
| @types/react-dom     | ^19.1.5   | React DOM 类型定义       |
| eslint               | ^9.27.0   | 代码检查                 |
| eslint-config-next   | ^15.3.2   | Next.js ESLint 配置      |
| tailwindcss          | ^4.1.7    | CSS 框架                 |
| typescript           | ^5.8.3    | TypeScript 编译器        |

---

## 项目运行方式

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问地址: `http://localhost:3063`

后台管理: `http://localhost:3063/admin`

- 默认账号: `admin`
- 默认密码: `yito2026`

### 生产构建

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

### PM2 部署

```bash
# 全局安装 PM2
npm install -g pm2

# 启动
npm run pm2:start

# 重载
npm run pm2:reload
```

---

## 环境变量

| 变量名                 | 说明                 | 默认值                    |
| ---------------------- | -------------------- | ------------------------- |
| `ADMIN_USERNAME`       | 后台用户名           | `admin`                   |
| `ADMIN_PASSWORD`       | 后台密码             | `yito2026`                |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL             | `https://www.yito.visual` |
| `MAX_IMAGE_UPLOAD_MB`  | 图片上传大小限制(MB) | `12`                      |
| `MAX_VIDEO_UPLOAD_MB`  | 视频上传大小限制(MB) | `200`                     |

---

## 部署方案

### 阿里云低成本部署

详细步骤见 [`deploy/ALIYUN_LOW_COST_DEPLOY.md`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/deploy/ALIYUN_LOW_COST_DEPLOY.md)

**推荐配置**:

- 服务器: 2核2G 起
- 系统盘: 40GB 起
- 带宽: 3M 起
- 不使用 RDS 和 OSS（起步阶段）

**核心组件**:

- Next.js 应用
- Nginx 反向代理
- PM2 进程管理 或 systemd
- 内容存储在 `content/site.json`
- 上传文件存储在 `public/uploads`

### Vercel 部署

**注意**: 当前后台使用文件系统存储，在 Vercel Serverless 环境中写入不是持久化的。如需在 Vercel 使用，需将内容存储改为数据库或 Sanity/Payload CMS 等。

---

## 内容数据结构

### [`content/site.json`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/content/site.json) 结构示例

```json
{
  "hero": {
    "no": "01",
    "title": "AI-NATIVE COMMERCIAL VISUAL STUDIO",
    "subtitle": "AI 原生商业视觉工作室",
    "primaryCta": "查看案例",
    "secondaryCta": "联系合作",
    "visual": "canyon",
    "visualLabel": "YITO VISUAL STUDIO"
  },
  "about": { ... },
  "services": { ... },
  "selectedWorks": { ... },
  "caseStudies": [ ... ],
  "process": { ... },
  "why": { ... },
  "contact": { ... }
}
```

---

## 关键注意事项

1. **安全**: 生产环境必须修改后台默认密码
2. **备份**: 定期备份 `content/site.json` 和 `public/uploads`
3. **存储**: 大量图片建议迁移到 OSS/CDN
4. **视频**: 大视频建议使用外部链接
5. **权限**: 确保服务器对 `content` 和 `public/uploads` 有写入权限
6. **HTTPS**: 生产环境必须使用 HTTPS

---

## SEO 优化

项目已内置:

- 全站 Metadata
- Open Graph / Twitter Card
- 作品详情页独立标题与描述
- `robots.txt`
- `sitemap.xml`
- Organization / CreativeWork JSON-LD 结构化数据

---

## 备份与恢复

### 备份

```bash
npm run backup
```

备份位置: `backups/` 目录

### 恢复

从备份目录复制 `site.json` 到 `content/` 目录，复制上传文件到 `public/uploads/` 目录。

---

## 相关文档

- [`README.md`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/README.md): 项目说明
- [`deploy/ALIYUN_LOW_COST_DEPLOY.md`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/deploy/ALIYUN_LOW_COST_DEPLOY.md): 阿里云部署指南
- [`deploy/WORKBENCH_DEPLOY_GUIDE.md`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/deploy/WORKBENCH_DEPLOY_GUIDE.md): Workbench 部署指南
- [`deploy/YITOAI_TOP_GO_LIVE.md`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/deploy/YITOAI_TOP_GO_LIVE.md): 上线指南
- [`ecosystem.config.cjs`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/ecosystem.config.cjs): PM2 配置
- [`deploy/nginx-yito.conf`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/deploy/nginx-yito.conf): Nginx 配置
- [`deploy/systemd-yito.service`](file:///Users/yangtao/Documents/Codex/2026-05-15/files-mentioned-by-the-user-yito/deploy/systemd-yito.service): systemd 服务配置
