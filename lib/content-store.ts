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
    "为小红书、抖音、视频号、Instagram 等平台制作短视频视觉、封面海报、内容包装与批量化视觉资产。重点不是把画面做满，而是让每一张封面和每一段短片都具备点击欲、识别度和品牌质感。",
  platform: "小红书 / 抖音 / 视频号 / Instagram",
  cards: [
    {
      title: "短剧封面视觉",
      en: "Drama Cover",
      platform: "抖音 / 视频号",
      visual: "social-drama",
      image: "/project-assets/social-phone-vertical.jpg",
    },
    {
      title: "概念短视频海报",
      en: "Concept Reel",
      platform: "小红书 / 抖音",
      visual: "social-concept",
      image: "/project-assets/reborn-door-vertical.jpg",
    },
    {
      title: "游戏内容封面",
      en: "Game Launch",
      platform: "视频号 / B站",
      visual: "social-game",
      image: "/project-assets/redwolf-card-action.jpg",
    },
    {
      title: "产品细节种草",
      en: "Product Detail",
      platform: "小红书",
      visual: "social-product",
      image: "/project-assets/product-detail-card.jpg",
    },
  ],
  metrics: [
    {
      label: "封面方向探索",
      value: "6组+",
    },
    {
      label: "短视频适配比例",
      value: "9:16",
    },
    {
      label: "内容交付周期",
      value: "3-5天",
    },
  ],
};

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    socialContent: content.socialContent ?? defaultSocialContent,
  };
}
