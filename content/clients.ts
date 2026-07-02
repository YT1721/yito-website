export type ClientIndustryGroup = {
  title: string;
  subtitle: string;
  items: string[];
};

export const clientsContent = {
  title: "Clients & Industries",
  subtitle: "客户与行业",
  description:
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
} satisfies {
  title: string;
  subtitle: string;
  description: string;
  groups: ClientIndustryGroup[];
};
