import { clientsContent } from "./clients";
import { servicesContent } from "./services";
import { whyChooseContent } from "./whyChoose";
import { workflowContent } from "./workflow";
import { worksContent } from "./works";

export type SiteMetaContent = {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    siteName: string;
    locale: string;
    type: "website";
    image: string;
  };
};

export type HeroContentData = {
  title: string;
  subtitle: string;
  positioning: string;
  statement: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  tags: string[];
  cover: string;
};

export type AboutContentData = {
  title: string;
  subtitle: string;
  body: string[];
  capabilities: Array<{
    title: string;
    description: string;
  }>;
  statement: string;
  cover: string;
};

export type ContactContentData = {
  title: string;
  subtitle: string;
  description: string;
  note: string;
  email: string;
  wechat: string;
  xiaohongshu: string;
  location: string;
  cover: string;
};

export type ScrollWorldContentData = {
  enabled: boolean;
  desktopVideo: string;
  mobileVideo?: string;
  poster: string;
  introTitle: string;
  introSubtitle: string;
  fallbackMode: "poster" | "static";
  scenes: Array<{
    id: string;
    no: string;
    title: string;
    subtitle: string;
    body: string;
    serviceId?: string;
    poster?: string;
  }>;
};

export const siteContent = {
  navigation: {
    brand: "YITO",
    items: [
      { href: "#work", label: "WORK", zhLabel: "案例" },
      { href: "#services", label: "SERVICES", zhLabel: "服务" },
      { href: "#ai-studio", label: "WORKFLOW", zhLabel: "流程" },
      { href: "#about", label: "ABOUT", zhLabel: "关于" },
      { href: "#contact", label: "CONTACT", zhLabel: "联系" },
    ],
    cta: {
      href: "#contact",
      label: "联系合作",
    },
  },
  meta: {
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
  },
  hero: {
    title: "YITO",
    subtitle: "AI-Native Commercial Visual Studio",
    positioning: "AI 原生商业视觉工作室",
    statement: "用 AI 技术，为品牌低成本制作电影级商业视觉内容。",
    description:
      "YITO 结合 AI 生成技术、电影化视觉语言与商业品牌策略，为品牌提供广告片、企业宣传片、商业短片、概念视觉与社媒内容生产服务。",
    primaryCta: "查看案例",
    secondaryCta: "联系合作",
    tags: [
      "AI Commercial Film",
      "Brand Visual",
      "Cinematic Content",
      "Creative Direction",
      "Social Content",
    ],
    cover: "/images/hero/hero-light-gate.jpg",
  },
  scrollWorld: {
    enabled: true,
    desktopVideo: "/videos/scroll-world/yito-scroll-world-720p-scrub.mp4",
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
  },
  selectedWorks: {
    title: "Selected Works",
    subtitle: "精选案例",
    description:
      "我们用案例证明一件事：AI 不是廉价替代，而是一种新的商业视觉生产方式。",
    linkLabel: "点击任意案例查看详情",
  },
  about: {
    title: "About YITO",
    subtitle: "关于 YITO",
    body: [
      "YITO 是一家 AI 原生商业视觉工作室。",
      "我们从传统商业设计经验出发，结合 AI 生成技术、电影化镜头语言与品牌策略，为企业提供更高效、更灵活、更具视觉质感的新一代内容制作方案。",
      "我们不只是生成画面，而是围绕品牌目标、产品卖点和传播场景，完成从创意、脚本、分镜、AI 视觉生成到视频制作的完整商业内容交付。",
    ],
    capabilities: [
      {
        title: "AI 原生",
        description: "用 AI 提升视觉生产效率",
      },
      {
        title: "商业设计经验",
        description: "具备品牌、包装、营销视觉与项目交付经验",
      },
      {
        title: "电影级质感",
        description: "以导演思维处理镜头、光影、构图与节奏",
      },
      {
        title: "完整交付",
        description: "从创意到成片，不止是单张 AI 图片",
      },
    ],
    statement: "AI 是工具，导演判断才是价值。",
    cover: "/images/about/about-ai-face.jpg",
  },
  aiStudio: {
    title: "AI Studio System",
    subtitle: "AI 商业视觉生产系统",
    body: [
      "YITO 正在构建面向一人工作室的 AI 商业视觉生产系统，将创意策略、分镜设计、提示词工程、AI 静帧、AI 视频和后期制作整合为稳定流程。",
      "这套系统让我们可以更快完成视觉测试，更灵活地探索创意方向，并在有限预算内提供更高质量的商业视觉内容。",
    ],
    capabilities: [
      "AI 创意方向生成",
      "AI 分镜脚本设计",
      "AI 静态视觉生成",
      "AI 视频镜头生成",
      "AI 角色与场景设定",
      "AI 商业海报与 KV",
      "AI 社媒内容批量生产",
      "AI 视频后期辅助",
    ],
    statement: "我们不出售 AI 生成图，我们交付面向商业结果的视觉内容。",
    cover: "/images/system/ai-studio-system.jpg",
  },
  services: servicesContent,
  works: worksContent,
  workflow: workflowContent,
  whyChoose: whyChooseContent,
  clients: clientsContent,
  contact: {
    title: "Contact Us",
    subtitle: "联系合作",
    description:
      "如果你正在寻找一种更高效、更灵活、更具视觉质感的商业内容制作方式，欢迎与 YITO 联系。",
    note: "我们可以一起讨论你的品牌、产品、项目需求，以及适合 AI 商业视觉的制作方案。",
    email: "yt1721@126.com",
    wechat: "yito-visual",
    xiaohongshu: "YITO Visual",
    location: "Beijing / Remote",
    cover: "/images/contact/contact-light-door.jpg",
  },
  footer: {
    brand: "YITO",
    subtitle: "AI-Native Commercial Visual Studio",
    services:
      "AI品牌广告片｜企业宣传片｜AI商业短片｜概念视觉设计｜社媒内容视觉",
    copyright: "© 2026 YITO Visual. All Rights Reserved.",
    credit: "Designed with AI-native workflow.",
  },
} satisfies {
  navigation: {
    brand: string;
    items: Array<{
      href: string;
      label: string;
      zhLabel: string;
    }>;
    cta: {
      href: string;
      label: string;
    };
  };
  meta: SiteMetaContent;
  hero: HeroContentData;
  scrollWorld: ScrollWorldContentData;
  about: AboutContentData;
  aiStudio: {
    title: string;
    subtitle: string;
    body: string[];
    capabilities: string[];
    statement: string;
    cover: string;
  };
  services: typeof servicesContent;
  selectedWorks: {
    title: string;
    subtitle: string;
    description: string;
    linkLabel: string;
  };
  works: typeof worksContent;
  workflow: typeof workflowContent;
  whyChoose: typeof whyChooseContent;
  clients: typeof clientsContent;
  contact: ContactContentData;
  footer: {
    brand: string;
    subtitle: string;
    services: string;
    copyright: string;
    credit: string;
  };
};

export type SiteContentData = typeof siteContent;
