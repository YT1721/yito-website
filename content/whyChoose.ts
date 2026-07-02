import type { IconName } from "../lib/content-types";

export type WhyChooseItem = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

export const whyChooseContent = {
  title: "Why Choose YITO",
  subtitle: "为什么选择 YITO",
  description:
    "AI 能降低制作门槛，但真正决定作品价值的，依然是审美、策略、镜头语言与商业判断。",
  items: [
    {
      id: "commercial-design-experience",
      title: "商业设计经验",
      description:
        "YITO 拥有品牌设计、包装设计、营销视觉与商业内容制作经验，不只是生成画面，更理解品牌需要什么。",
      icon: "badge",
    },
    {
      id: "cinematic-visual-language",
      title: "电影化视觉表达",
      description:
        "我们以导演思维处理镜头、构图、光影、情绪与节奏，让 AI 内容更接近商业影像。",
      icon: "clapperboard",
    },
    {
      id: "efficient-cost",
      title: "更高效率与更低成本",
      description:
        "AI 让创意验证、视觉生成和内容制作更高效，帮助品牌以更灵活的预算完成高质感内容生产。",
      icon: "gauge",
    },
    {
      id: "complete-delivery",
      title: "完整交付流程",
      description:
        "从需求、创意、分镜、生成到后期交付，YITO 提供完整流程，而不是零散的 AI 图片或单次视频生成。",
      icon: "wand",
    },
  ],
} satisfies {
  title: string;
  subtitle: string;
  description: string;
  items: WhyChooseItem[];
};
