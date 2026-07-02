import { readFile } from "fs/promises";
import path from "path";
import type {
  AiCapabilitySection,
  AiStudioSection,
  ClientsSection,
  FooterContent,
  SiteContent,
} from "./content-types";

const contentPath = path.join(process.cwd(), "content", "site.json");

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

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    aiCapability: content.aiCapability ?? defaultAiCapability,
    aiStudio: content.aiStudio ?? defaultAiStudio,
    clients: content.clients ?? defaultClients,
    footer: content.footer ?? defaultFooter,
  };
}
