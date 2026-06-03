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
    "为品牌社媒、内容种草与活动传播制作高质感竖版视觉资产，兼顾商业质感与平台传播效率。",
  platform: "抖音 / 小红书 / Instagram",
  cards: [
    {
      title: "腕表种草视觉",
      en: "Watch Campaign",
      platform: "小红书",
      visual: "social-watch",
    },
    {
      title: "科技新品海报",
      en: "Future Launch",
      platform: "抖音",
      visual: "social-tech",
    },
    {
      title: "咖啡品牌内容",
      en: "Coffee Time",
      platform: "Instagram",
      visual: "social-coffee",
    },
    {
      title: "城市穿搭短片",
      en: "Urban Visual",
      platform: "小红书",
      visual: "social-fashion",
    },
  ],
  metrics: [
    {
      label: "曝光提升",
      value: "300%+",
    },
    {
      label: "互动增长",
      value: "200%+",
    },
    {
      label: "内容迭代",
      value: "150%+",
    },
  ],
};

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    socialContent: content.socialContent ?? defaultSocialContent,
  };
}
