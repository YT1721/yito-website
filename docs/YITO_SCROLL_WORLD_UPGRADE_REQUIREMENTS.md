# YITO 官网沉浸式滚动视觉升级需求文档

版本：V2.0  
日期：2026-08-24  
项目：YITO 官网  
定位：AI-Native Commercial Visual Studio

## 1. 升级目标

本次升级目标不是把官网做成普通作品集，也不是增加炫技动画，而是把 YITO 官网升级为更接近高端商业视觉工作室、广告导演工作室和 AI 原生影像公司的沉浸式展示网站。

目标效果参考：

- 参考视觉链接：用户提供的 GitHub 私有视频
- 参考开源项目：[oso95/scroll-world](https://github.com/oso95/scroll-world)

核心体验：

- 访客滚动页面时，画面像镜头一样穿越 YITO 的商业视觉世界。
- 每个板块不再只是静态信息块，而是对应一个视觉场景。
- AI 视觉、品牌策略、商业影像、案例能力和联系转化形成连续叙事。
- 页面保持黑色背景、克制高级、电影感，不做赛博朋克和廉价科技风。

## 2. 视觉方向

整体关键词：

- 黑色空间
- 电影级光影
- 高级商业视觉
- 极简排版
- 大面积留白
- 轻量绿色点缀
- 镜头穿梭感
- AI 原生生产系统

避免方向：

- 过度绿色滤镜
- 霓虹赛博朋克
- 普通 AI 工具站
- 纯炫技 3D
- 信息可读性被动画牺牲
- 所有板块同一种卡片布局

## 3. 页面结构升级

当前首页建议保留以下信息顺序，但表现形式升级为滚动镜头叙事：

```text
01 Hero
02 About YITO
03 Core Services
04 Selected Works
05 AI Studio System
06 Workflow
07 Why YITO / Clients & Industries
08 Contact
```

其中 Hero、AI Studio、Selected Works、Contact 是优先视觉化的关键节点。

## 4. Scroll World 场景规划

建议先制作 6 个连续场景，控制成本和复杂度。

### Scene 01：YITO Light Gate

对应板块：Hero  
画面：黑色建筑空间、巨大光门、单人剪影、弱绿色光线。  
作用：建立第一眼的电影感和高端感。  
文案：

```text
YITO
AI-Native Commercial Visual Studio
AI 原生商业视觉工作室
用 AI 技术，为品牌低成本制作电影级商业视觉内容。
```

### Scene 02：AI Visual Studio

对应板块：About / AI Studio  
画面：暗色创意工作室、屏幕墙、AI 视觉分镜、光影装置。  
作用：说明 YITO 不是单张生图服务，而是完整视觉生产系统。

### Scene 03：Commercial Film Set

对应板块：Core Services  
画面：广告片拍摄场景、产品台、灯光、镜头轨道、AI 生成屏幕。  
作用：展示 AI 品牌广告片、企业宣传片、商业短片能力。

### Scene 04：Selected Works Gallery

对应板块：Selected Works  
画面：暗色展厅，墙面或悬浮屏展示 6 个精选案例画面。  
作用：把案例从卡片列表升级为高端案例展厅。

### Scene 05：AI Production Pipeline

对应板块：Workflow  
画面：需求、创意、脚本、分镜、AI 生成、后期交付形成一条光线流程。  
作用：建立专业信任，让客户理解交付不是随机生成。

### Scene 06：Contact Light Door

对应板块：Contact  
画面：空间尽头的光门、YITO 标识、联系信息浮现。  
作用：完成转化，引导咨询。

## 5. 交互需求

### 5.1 桌面端

- 页面滚动驱动画面播放。
- 每个场景对应一段视频或连续视频片段。
- 文案随滚动淡入、停留、淡出。
- 导航仍可点击跳转到对应章节。
- 作品卡片和服务卡片保留 hover 反馈。
- CTA 始终清晰可点击。

### 5.2 移动端

移动端不建议直接裁切桌面横版视频。建议分两级：

第一阶段：

- 使用桌面视频的轻量裁切版本作为背景。
- 文案和 CTA 单列展示。
- 保证加载速度和可读性。

第二阶段：

- 单独生成 9:16 竖版视频链。
- 手机端使用原生竖屏构图，不使用简单中间裁切。

## 6. 视频与图片需求

本项目资产生成方式明确如下：

- 生图：优先使用 GPT 生成场景主图、poster、OG 图和移动端备用图。
- 生视频：使用即梦 CLI。安装命令：

```bash
curl -s https://jimeng.jianying.com/cli | bash
```

第一阶段只生成 720p 视频，用于验证滚动叙事、镜头方向、页面性能和转化路径。高清版本在样机通过后再手动转化或重新生成。

### 6.1 第一阶段资产

优先通过即梦生成 720p 视频，用于验证视觉与交互。

建议规格：

| 资产         |   比例 |      尺寸 | 用途                    |
| ------------ | -----: | --------: | ----------------------- |
| 桌面场景主图 |   16:9 | 1920x1080 | 每个场景首帧和 fallback |
| 桌面滚动视频 |   16:9 |  1280x720 | 第一阶段滚动预览        |
| 移动备用图   |   9:16 | 1080x1920 | 手机端 fallback         |
| OG 分享图    | 1.91:1 |  1200x630 | SEO 分享                |

### 6.2 第二阶段资产

在第一阶段通过后再生成：

- 1080p 横版视频链
- 9:16 竖版移动视频链
- webm / mp4 双格式
- poster 图
- 低码率 fallback 视频

## 7. 内容管理需求

后台需要新增或扩展以下字段：

```ts
scrollWorld: {
  enabled: boolean;
  mode: "static" | "scroll-video";
  desktopVideo: string;
  mobileVideo?: string;
  poster: string;
  scenes: Array<{
    id: string;
    sectionId: string;
    title: string;
    subtitle: string;
    body: string;
    start: number;
    end: number;
    poster: string;
  }>;
}
```

后台需要支持：

- 上传或填写滚动视频 URL
- 上传每个场景 poster
- 编辑每个场景对应的文字
- 设置场景起止进度
- 开关沉浸式滚动模式
- 保留当前静态页面作为 fallback

## 8. 技术约束

当前项目技术栈：

- Next.js 15
- React 19
- TypeScript
- TailwindCSS 4
- Framer Motion
- 本地 JSON CMS
- ECS + Nginx + PM2 部署

升级需要新增：

- Scroll scrub video 组件
- 视频预加载与延迟加载策略
- 移动端降级策略
- CMS 字段扩展
- 性能测试

暂不建议第一阶段引入复杂 WebGL 或 Three.js。优先使用 GPT / 即梦生成的预渲染视觉资产加滚动控制，因为它更稳定、更接近参考效果，也更适合当前 ECS 部署。

## 9. 验收标准

第一阶段验收：

- 首页可在本地正常运行。
- Hero 或首页前半段具备滚动驱动视频效果。
- 720p 视频加载后滚动播放流畅。
- 没有破坏现有案例页、后台、上传和 SEO。
- 移动端可读，不横向溢出。
- 视频加载失败时显示 poster 和原静态内容。
- `npm run lint` 通过。
- `npm run build` 通过。

第二阶段验收：

- 6 个场景形成连续视觉叙事。
- 桌面 1080p 效果可上线。
- 手机端使用 9:16 版本或明确降级方案。
- ECS 生产环境资源加载稳定。
- Lighthouse 不出现明显性能退化。
