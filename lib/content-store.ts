import { readFile } from "fs/promises";
import path from "path";
import type { SiteContent, SocialContentSection } from "./content-types";

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

export const defaultSocialContent: SocialContentSection = {
  no: "09",
  title: "社媒内容视觉",
  subtitle: "SOCIAL CONTENT",
  intro:
    "为小红书、抖音、视频号、Instagram 等平台制作短视频视觉、封面海报、内容包装与批量化视觉资产，让品牌内容既有质感，也适合平台传播节奏。",
  platform: "小红书 / 抖音 / 视频号 / Instagram",
  cards: [
    {
      title: "腕表种草视觉",
      en: "Watch Campaign",
      platform: "小红书",
      visual: "social-watch",
      image: "/visuals/social-watch.png",
    },
    {
      title: "科技新品海报",
      en: "Future Launch",
      platform: "抖音",
      visual: "social-tech",
      image: "/visuals/social-tech.png",
    },
    {
      title: "咖啡品牌内容",
      en: "Coffee Time",
      platform: "Instagram",
      visual: "social-coffee",
      image: "/visuals/social-coffee.png",
    },
    {
      title: "城市穿搭短片",
      en: "Urban Visual",
      platform: "视频号",
      visual: "social-fashion",
      image: "/visuals/social-fashion.png",
    },
  ],
  metrics: [
    {
      label: "内容生产效率",
      value: "3-5天",
    },
    {
      label: "视觉方向探索",
      value: "6组+",
    },
    {
      label: "多平台适配",
      value: "4类+",
    },
  ],
};

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    socialContent: content.socialContent ?? defaultSocialContent,
  };
}
