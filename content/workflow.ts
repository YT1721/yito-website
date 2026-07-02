export type WorkflowStep = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

export const workflowContent = {
  title: "Our Workflow",
  subtitle: "工作流程",
  description:
    "AI 创作有不确定性，所以更需要清晰流程。YITO 用导演式工作方法管理创意、画面、节奏与交付质量。",
  steps: [
    {
      id: "understand",
      title: "需求沟通",
      subtitle: "Understand",
      description:
        "明确品牌背景、传播目标、目标受众、使用场景、预算范围与交付周期。",
    },
    {
      id: "strategy",
      title: "创意方向",
      subtitle: "Strategy",
      description:
        "根据项目目标制定视觉风格、内容方向、情绪基调与创意表达策略。",
    },
    {
      id: "storyboard",
      title: "脚本与分镜",
      subtitle: "Storyboard",
      description: "将创意转化为可执行的脚本、镜头结构、画面节奏与分镜方案。",
    },
    {
      id: "ai-generation",
      title: "AI 视觉生成",
      subtitle: "AI Generation",
      description:
        "通过 AI 静帧、角色设定、场景设定与视频生成，完成核心视觉资产。",
    },
    {
      id: "production",
      title: "视频制作",
      subtitle: "Production",
      description:
        "对镜头衔接、画面节奏、字幕、声音、调色与整体质感进行后期制作。",
    },
    {
      id: "delivery",
      title: "成片交付",
      subtitle: "Delivery",
      description:
        "按照官网、展会、社媒、发布会等使用场景，交付成片与相关视觉素材。",
    },
  ],
} satisfies {
  title: string;
  subtitle: string;
  description: string;
  steps: WorkflowStep[];
};
