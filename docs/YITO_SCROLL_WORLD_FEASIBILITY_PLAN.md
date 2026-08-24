# YITO 官网 Scroll World 升级可行性与开发方案

版本：V1.0  
日期：2026-08-24

## 1. 结论

可行，但不建议一次性全站重构。

推荐方案是：

1. 先做 720p 的 Hero / 首页前半段滚动视频样机。
2. 验证视觉效果、加载速度、滚动手感和移动端降级。
3. 再扩展为 6 个场景的完整 Scroll World。
4. 最后根据通过的 720p 样机手动转高清或重新生成 1080p 版本。

原因：

- 当前 YITO 官网已经具备 Next.js、内容管理、案例页、部署链路，没必要推倒重做。
- 参考项目 `scroll-world` 的核心是预渲染视频链加滚动播放，不要求实时 3D。
- 全量生成 6 场景连续视频有成本、时间和风格一致性风险，先做样机更稳。
- 当前 ECS 可以承载静态视频和 Next.js 页面，但大视频最好后续放 CDN 或对象存储。

## 2. 参考项目判断

参考项目：[oso95/scroll-world](https://github.com/oso95/scroll-world)

该项目 README 和技能说明显示，它的核心方式是：

- 生成多个场景 still image。
- 为每个场景生成 camera flight 视频。
- 生成场景之间的 connector 视频。
- 前端使用 scroll scrub engine 让滚动控制视频时间。
- 页面本身播放预渲染视频，不做实时 3D 渲染。

这和 YITO 官网目标匹配。YITO 应采用“预渲染电影视觉 + 滚动控制”的路线，而不是直接做复杂实时 3D。

## 3. 当前项目适配性

### 3.1 已具备条件

当前项目已经具备：

- Next.js 15 App Router
- TypeScript
- Framer Motion
- 图片 fallback 组件
- 内容集中管理
- 后台 CMS
- ECS 部署
- Nginx 反代
- PM2 运行

这些条件足以承载第一阶段开发。

### 3.2 需要补充能力

需要新增：

- `ScrollVideoScene` 或 `ScrollWorldHero` 客户端组件
- 视频滚动进度控制
- 视频 poster fallback
- 视频 lazy load
- CMS scrollWorld 字段
- 后台视频 URL 和 poster 编辑
- 移动端降级逻辑

可选新增：

- `ffmpeg` 压缩脚本
- 视频 manifest 文件
- CDN / OSS 视频托管配置

## 4. 生成链路可行性

用户已明确生成链路：

- 生图直接使用 GPT。
- 生视频使用即梦 CLI。

即梦 CLI 安装命令：

```bash
curl -s https://jimeng.jianying.com/cli | bash
```

因此开发方案应把“资产生成”和“前端接入”拆开：

### 4.1 资产生成

由 GPT 生成每个场景主图、poster、移动端备用图和 OG 图。

由即梦 CLI 生成 720p 视频片段：

- 6 个场景视频
- 5 个场景连接视频
- 或先做 1 条连续测试视频

第一阶段建议只生成：

- Hero 场景主图 1 张
- Hero 滚动视频 1 条
- AI Studio / Works 衔接测试视频 1 条

### 4.2 前端接入

前端不依赖具体生成平台。只需要拿到：

```text
poster.jpg
scroll-world-preview.mp4
scroll-world-preview.webm 可选
scene manifest JSON
```

即可接入。

## 5. 推荐开发阶段

### Phase 0：需求与资产脚本准备

目标：

- 固定 6 个场景。
- 固定每个场景的文案、视觉关键词、镜头方向。
- 准备 GPT 生图提示词和即梦 CLI 视频提示词。

验收：

- 文档中每个场景有明确画面描述。
- 每个场景有主文案和对应官网板块。
- 明确第一阶段只做 720p。

### Phase 1：滚动视频样机

目标：

- 新增一个不破坏现有页面的 Scroll World 样机组件。
- 可通过 CMS 开关启用。
- 先接入 1 条 720p 视频。

范围：

- Hero 或 Hero + About 区间。
- 页面静态内容保留。
- 视频作为背景或主视觉，不影响 CTA。

验收：

- 本地 `#hero` 滚动时视频可随滚动播放。
- 视频失败时显示 poster。
- 移动端不报错。
- `npm run build` 通过。

### Phase 2：完整 6 场景首页

目标：

- 完成 6 场景滚动叙事。
- 每个场景对应一个首页板块。
- 支持桌面端完整浏览。

验收：

- 滚动节奏自然。
- 文案淡入淡出清楚。
- 作品入口和联系入口可点击。
- 首页没有明显卡顿。

### Phase 3：移动端和高清上线

目标：

- 手机端使用 9:16 竖版视频或轻量降级。
- 横版视频替换为高清版本。
- 生产环境部署。

验收：

- 桌面端高清稳定播放。
- 手机端加载可接受。
- ECS 带宽压力可控。
- 正式域名可访问。

## 6. 技术实现建议

### 6.1 组件结构

建议新增：

```text
components/ScrollWorld.tsx
components/ScrollWorldSceneText.tsx
lib/scroll-progress.ts
```

首页使用方式：

```tsx
{
  content.scrollWorld.enabled ? (
    <ScrollWorld config={content.scrollWorld} />
  ) : (
    <CurrentHomepage />
  );
}
```

第一阶段可以更保守：

```tsx
<HeroScrollVideo />
```

只替换 Hero 主视觉，不影响其他区块。

### 6.2 滚动控制逻辑

实现方式：

- 使用 `useRef<HTMLVideoElement>`
- 使用 `requestAnimationFrame`
- 根据 section scroll progress 设置 `video.currentTime`
- 使用 `preload="metadata"`
- 使用 poster 做首屏兜底

注意：

- 不把滚动进度存到 React state。
- 不在每一帧触发 React render。
- 移动端避免强制 autoplay 依赖。
- 尊重 `prefers-reduced-motion`。

### 6.3 视频托管

第一阶段：

- 可以放在 `public/videos/`。
- 720p 视频控制在 8-20MB 内。

正式上线：

- 建议使用阿里云 OSS + CDN 或其他 CDN。
- ECS 3Mbps 带宽不适合长期直接扛大视频访问。

## 7. 风险评估

### 风险 1：生成资产风格不统一

原因：

- 多场景图片可能构图、光线、材质不一致。
- 多段视频连接可能有跳变。

控制方式：

- 所有 scene prompt 使用同一 style preamble。
- 先生成 stills，人工审核统一性。
- 第一阶段不追求完整无缝，只验证方向。

### 风险 2：视频连接处跳帧

原因：

- 连接视频起止帧不一致。

控制方式：

- 场景连接必须使用前后片段的实际首尾帧。
- 若做完整 scroll-world，需要按 frame-identical seam 规则生成。

### 风险 3：页面性能下降

原因：

- 视频体积过大。
- 移动端解码压力高。

控制方式：

- 第一阶段 720p。
- poster 先显示。
- 视频延迟加载。
- 移动端可使用静态图或短视频。

### 风险 4：影响现有后台和内容维护

原因：

- 如果直接重写首页，可能破坏 CMS。

控制方式：

- 新增字段，不删除原字段。
- 使用开关切换新旧首页模式。
- 原有页面作为 fallback。

## 8. 工作量评估

### 方案 A：只做 Hero 滚动视频增强

工作量：1-2 天开发，不含资产生成。  
风险：低。  
适合：快速验证视觉方向。

### 方案 B：Hero + AI Studio + Works 三段滚动叙事

工作量：3-5 天开发，不含资产生成。  
风险：中。  
适合：形成明显官网升级效果。

### 方案 C：完整 6 场景 Scroll World 首页

工作量：7-12 天开发，不含资产生成和返工。  
风险：中高。  
适合：确认视觉方向后实施。

推荐：

先做方案 A，再做方案 B。不要直接进入方案 C。

## 9. 后台升级范围

后台第一阶段只需要增加：

- Scroll World 开关
- 桌面视频 URL
- 移动视频 URL 可选
- Poster 图片
- 是否启用静态 fallback

第二阶段再增加：

- 场景列表
- 每个场景标题、说明、起止进度
- 每个场景 poster
- 排序功能

## 10. 上线策略

上线必须保留回滚能力：

- 默认仍使用当前首页。
- 新效果通过 `scrollWorld.enabled` 打开。
- 如果生产环境视频加载异常，后台关闭开关即可恢复静态首页。

上线前检查：

```bash
npm run lint
npm run build
```

ECS 检查：

```bash
pm2 status
curl -I http://127.0.0.1:3063
curl -I http://yitoai.top
```

## 11. 下一步

建议下一步执行 Phase 0：

1. 确认是否先做 Hero 单段 720p 样机。
2. 固定 3 个测试场景。
3. 使用 GPT 生成场景图。
4. 使用即梦 CLI 生成 720p 视频。
5. 开发 `HeroScrollVideo` 组件并接入后台开关。

如果 Phase 0 确认通过，再进入代码开发。
