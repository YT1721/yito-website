import type { IconName } from "../lib/content-types";

export type ServiceContent = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  scenes: string[];
  icon: IconName;
  cover: string;
};

export const servicesContent = {
  title: "Core Services",
  subtitle: "核心服务",
  description:
    "YITO 提供从创意到交付的一体化 AI 商业视觉服务，帮助品牌更快、更灵活地完成高质感内容生产。",
  items: [
    {
      id: "ai-brand-film",
      title: "AI 品牌广告片",
      subtitle: "AI Brand Film",
      description:
        "面向品牌发布、产品推广、招商传播与社媒投放，提供从创意脚本、分镜设计到 AI 视频制作的一体化服务。",
      scenes: ["新品发布", "产品广告", "品牌升级", "社媒投放"],
      icon: "clapperboard",
      cover: "/images/services/service-ai-brand-film.jpg",
    },
    {
      id: "ai-corporate-film",
      title: "AI 企业宣传片",
      subtitle: "Corporate Film",
      description:
        "为企业打造高质感形象短片、业务介绍片、产品宣传片，适合官网、展会、发布会与招商场景。",
      scenes: ["企业官网", "展会展厅", "招商路演", "品牌介绍"],
      icon: "film",
      cover: "/images/services/service-corporate-film.jpg",
    },
    {
      id: "ai-commercial-short-film",
      title: "AI 商业短片",
      subtitle: "Commercial Short Film",
      description:
        "以更灵活的 AI 视频制作方式，为品牌、产品和内容 IP 打造电影感短片，适合线上传播和活动展示。",
      scenes: ["品牌故事", "产品短片", "剧情广告", "内容 IP"],
      icon: "sparkles",
      cover: "/images/services/service-commercial-short.jpg",
    },
    {
      id: "ai-concept-visual",
      title: "AI 概念视觉设计",
      subtitle: "AI Concept Visual",
      description:
        "为品牌 Campaign、产品广告、活动 KV、电影感海报与视觉提案提供高效率概念设计，帮助客户快速看到视觉方向。",
      scenes: ["活动 KV", "海报设计", "产品概念", "视觉提案"],
      icon: "pen",
      cover: "/images/services/service-concept-visual.jpg",
    },
    {
      id: "social-content-visual",
      title: "社媒内容视觉",
      subtitle: "Social Content Visual",
      description:
        "为小红书、抖音、TikTok、视频号等平台提供短视频视觉、封面海报、内容包装与批量化视觉生产服务。",
      scenes: ["小红书", "抖音", "TikTok", "视频号", "品牌日常内容"],
      icon: "boxes",
      cover: "/images/services/service-social-content.jpg",
    },
  ],
} satisfies {
  title: string;
  subtitle: string;
  description: string;
  items: ServiceContent[];
};
