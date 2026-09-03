import { readFile } from "fs/promises";
import path from "path";
import type {
  AiCapabilitySection,
  AiStudioSection,
  ClientsSection,
  FooterContent,
  SeoContent,
  SiteContent,
  ScrollWorldContent,
} from "./content-types";

const contentPath = path.join(process.cwd(), "content", "site.json");

export const defaultSeo: SeoContent = {
  title: "YITO｜AI-Native Commercial Visual Studio",
  description:
    "YITO 是一家 AI 原生商业视觉工作室，专注 AI 品牌广告片、企业宣传片、商业短片、电影级视觉与品牌内容创作。",
  keywords: [
    "AI商业视觉",
    "AI广告片",
    "AI品牌宣传片",
    "AI企业宣传片",
    "AI视频制作",
    "AI商业短片",
    "AI视觉工作室",
    "品牌广告片",
    "电影感视觉",
    "商业视觉设计",
    "YITO",
  ],
  openGraph: {
    title: "YITO｜AI-Native Commercial Visual Studio",
    description: "用 AI 技术，为品牌低成本制作电影级商业视觉内容。",
    siteName: "YITO Visual",
    locale: "zh_CN",
    type: "website",
    image: "/images/seo/og-image.jpg",
  },
};

export async function readSiteContent(): Promise<SiteContent> {
  const file = await readFile(contentPath, "utf8");
  return normalizeSiteContent(JSON.parse(file) as SiteContent);
}

export function getUploadDirectory() {
  return (
    process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")
  );
}

export const defaultAiCapability: AiCapabilitySection = {
  no: "05",
  title: "AI Studio System",
  subtitle: "AI 商业视觉生产系统",
  intro:
    "YITO 正在构建面向一人工作室的 AI 商业视觉生产系统，将创意策略、分镜设计、提示词工程、AI 静帧、AI 视频和后期制作整合为稳定流程。",
  items: [
    "AI 创意方向生成",
    "AI 分镜脚本设计",
    "AI 静态视觉生成",
    "AI 视频镜头生成",
    "AI 角色与场景设定",
    "AI 商业海报与 KV",
    "AI 社媒内容批量生产",
    "AI 视频后期辅助",
  ],
  note: "AI 是工具，导演判断才是价值。",
};

export const defaultAiStudio: AiStudioSection = {
  no: "05",
  title: "AI Studio System",
  subtitle: "AI 商业视觉生产系统",
  body: "YITO 正在构建面向一人工作室的 AI 商业视觉生产系统，将创意策略、分镜设计、提示词工程、AI 静帧、AI 视频和后期制作整合为稳定流程。\n\n这套系统让我们可以更快完成视觉测试，更灵活地探索创意方向，并在有限预算内提供更高质量的商业视觉内容。",
  items: defaultAiCapability.items,
  statement: "我们不出售 AI 生成图，我们交付面向商业结果的视觉内容。",
  image: "/project-assets/yito-site/contact-board.png",
  visual: "ai-studio-system",
};

export const defaultClients: ClientsSection = {
  no: "08",
  title: "Clients & Industries",
  subtitle: "客户与行业",
  intro:
    "YITO 过去服务经验覆盖科技、医疗、金融、消费品、文化、空间、互联网与营销传播等多个领域。",
  groups: [
    {
      title: "Past Design Clients",
      subtitle: "过往设计服务客户",
      items: ["科技", "医疗健康", "金融", "消费品牌", "酒类饮品", "文化旅游"],
    },
    {
      title: "AI Visual Direction",
      subtitle: "AI 商业视觉方向",
      items: [
        "AI 品牌广告",
        "企业宣传片",
        "商业短片",
        "概念视觉",
        "社媒内容",
        "品牌 Campaign",
      ],
    },
  ],
};

export const defaultFooter: FooterContent = {
  brand: "YITO",
  subtitle: "AI-Native Commercial Visual Studio",
  services: "AI品牌广告片｜企业宣传片｜AI商业短片｜概念视觉设计",
  copyright: "© 2026 YITO Visual. All Rights Reserved.",
  credit: "Designed with AI-native workflow.",
};

export const defaultScrollWorld: ScrollWorldContent = {
  enabled: false,
  desktopVideo: "/videos/scroll-world/yito-scroll-world-720p.mp4",
  mobileVideo: "",
  poster: "/images/scroll-world/generated/01-yito-portal.png",
  introTitle: "YITO Scroll World",
  introSubtitle: "滚动穿越 AI 商业视觉世界",
  fallbackMode: "poster",
  scenes: [
    {
      id: "portal",
      no: "01",
      title: "YITO Portal",
      subtitle: "AI 原生商业视觉工作室",
      body: "从一个光门进入 YITO 的商业视觉生产世界。",
      poster: "/images/scroll-world/generated/01-yito-portal.png",
    },
    {
      id: "ai-brand-film",
      no: "02",
      title: "AI 品牌广告片",
      subtitle: "Brand film powered by AI",
      body: "把品牌发布、产品广告和招商传播转化为电影级商业影像。",
      serviceId: "ai-brand-film",
      poster: "/images/scroll-world/generated/02-ai-brand-film.png",
    },
    {
      id: "ai-corporate-film",
      no: "03",
      title: "AI 企业宣传片",
      subtitle: "Corporate visual narrative",
      body: "为官网、展会、发布会和招商场景建立更高级的企业形象内容。",
      serviceId: "ai-corporate-film",
      poster: "/images/scroll-world/generated/03-ai-corporate-film.png",
    },
    {
      id: "ai-commercial-short-film",
      no: "04",
      title: "AI 商业短片",
      subtitle: "Cinematic short content",
      body: "用镜头、角色和节奏完成品牌故事、产品短片和内容 IP。",
      serviceId: "ai-commercial-short-film",
      poster: "/images/scroll-world/generated/04-ai-commercial-short.png",
    },
    {
      id: "ai-concept-visual",
      no: "05",
      title: "AI 概念视觉设计",
      subtitle: "Concept visual system",
      body: "为 Campaign、KV、海报和视觉提案快速建立方向。",
      serviceId: "ai-concept-visual",
      poster: "/images/scroll-world/generated/05-ai-concept-visual.png",
    },
    {
      id: "social-content-visual",
      no: "06",
      title: "社媒内容视觉",
      subtitle: "Social content visual",
      body: "为小红书、抖音、视频号和品牌日常内容建立可持续视觉生产方式。",
      serviceId: "social-content-visual",
      poster: "/images/scroll-world/generated/06-social-content-visual.png",
    },
  ],
};

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    meta: {
      ...defaultSeo,
      ...(content.meta ?? {}),
      openGraph: {
        ...defaultSeo.openGraph,
        ...(content.meta?.openGraph ?? {}),
      },
      keywords: content.meta?.keywords?.length
        ? content.meta.keywords
        : defaultSeo.keywords,
    },
    scrollWorld: {
      ...defaultScrollWorld,
      ...(content.scrollWorld ?? {}),
    },
    aiCapability: content.aiCapability ?? defaultAiCapability,
    aiStudio: content.aiStudio ?? defaultAiStudio,
    clients: content.clients ?? defaultClients,
    footer: content.footer ?? defaultFooter,
  };
}
