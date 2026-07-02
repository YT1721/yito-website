export type WorkContent = {
  slug: string;
  title: string;
  subtitle: string;
  group: WorkGroup;
  category: string;
  industry: string;
  cover: string;
  video?: string;
  videoUrl?: string;
  description: string;
  challenge: string;
  strategy: string;
  visualKeywords: string[];
  process: string[];
  representativeProjects?: string[];
  result: string;
  services: string[];
  tags: string[];
  images: string[];
  featured: boolean;
  homepageOrder: number;
};

export type WorkGroup =
  | "AI Visual Direction"
  | "Brand & Product Visual"
  | "Design Foundation";

export const worksPageContent = {
  title: "Selected Works",
  subtitle: "精选案例",
  description:
    "我们用案例证明一件事：AI 不是廉价替代，而是一种新的商业视觉生产方式。",
};

export const workGroups = [
  {
    id: "AI Visual Direction",
    title: "AI Visual Direction",
    subtitle: "AI 商业视觉方向",
  },
  {
    id: "Brand & Product Visual",
    title: "Brand & Product Visual",
    subtitle: "品牌与产品视觉",
  },
  {
    id: "Design Foundation",
    title: "Design Foundation",
    subtitle: "设计基础能力",
  },
] satisfies Array<{
  id: WorkGroup;
  title: string;
  subtitle: string;
}>;

export const worksContent = [
  {
    slug: "ai-automotive-brand-film",
    title: "AI 汽车品牌广告片",
    subtitle: "AI Automotive Brand Film",
    group: "AI Visual Direction",
    category: "AI 品牌广告片",
    industry: "汽车 / 科技 / 高端消费",
    cover: "/images/works/ai-car/cover.jpg",
    description:
      "这是一个面向高端汽车品牌的 AI 广告片概念案例。项目以夜景城市、金属车身、速度感镜头和电影级光影为核心，探索 AI 技术在汽车品牌广告中的视觉表达可能。",
    challenge:
      "建立高端、未来、速度与科技感兼具的品牌视觉印象，让产品不只是交通工具，而成为一种关于力量、身份和未来生活方式的视觉符号。",
    strategy:
      "我们将画面重点放在“夜景、反光、速度、低角度镜头、车身曲线、城市光影”上，用电影广告语言塑造品牌调性，而不是简单展示汽车外观。",
    visualKeywords: [
      "黑色车身",
      "雨夜道路",
      "城市反光",
      "速度感",
      "金属质感",
      "电影级光影",
      "未来豪华",
    ],
    process: [
      "视觉方向设定",
      "汽车广告镜头参考分析",
      "AI 静帧生成",
      "关键画面筛选",
      "AI 视频镜头生成",
      "节奏剪辑与调色",
    ],
    result:
      "最终形成一组适用于品牌广告片、发布会视觉、官网首屏视频和社媒传播的汽车商业视觉方案。",
    services: ["AI 品牌广告片", "AI 视觉生成", "视频制作"],
    tags: ["AI Video", "Automotive", "Brand Film", "Cinematic"],
    images: [
      "/images/works/ai-car/shot-01.jpg",
      "/images/works/ai-car/shot-02.jpg",
      "/images/works/ai-car/shot-03.jpg",
      "/images/works/ai-car/shot-04.jpg",
    ],
    featured: true,
    homepageOrder: 1,
  },
  {
    slug: "apollo-offroad-brand-film",
    title: "Apollo 越野启蒙师品牌片",
    subtitle: "Apollo Off-road Education Brand Film",
    group: "AI Visual Direction",
    category: "AI 品牌广告片",
    industry: "汽车教育 / 户外 / 亲子消费",
    cover: "/images/works/apollo/cover.jpg",
    description:
      "Apollo 项目围绕“再勇敢一点”的品牌精神与“越野启蒙师”的品牌定位展开，将赛场、泥土、亲子成长、女性品牌力量和越野精神转化为可持续传播的品牌影像系统。",
    challenge:
      "为品牌建立一个既能打动客户，又能长期延展的品牌视频方向。第一支片子要具备情绪穿透力，后续可继续扩展为系列内容。",
    strategy:
      "我们没有把重点放在单纯炫车，而是把品牌放在“成长、勇气、启蒙、陪伴”的叙事里。通过真实赛场氛围、孩子第一次挑战、家长注视、女性创始人精神等元素，强化品牌温度。",
    visualKeywords: [
      "泥土",
      "赛道",
      "勇敢",
      "成长",
      "启蒙",
      "亲子",
      "女性品牌精神",
      "真实运动感",
    ],
    process: [
      "品牌定位梳理",
      "对标视频分析",
      "创意脚本",
      "导演分镜",
      "AI 视觉测试",
      "视频生成与剪辑",
      "后续内容规划",
    ],
    result:
      "项目可延展为品牌主片、产品介绍、赛场纪录、亲子成长短片、社媒切片等多种内容形式。",
    services: ["AI 品牌广告片", "品牌叙事", "商业短片"],
    tags: ["Brand Film", "Outdoor", "Education", "AI Visual"],
    images: [
      "/images/works/apollo/race-01.jpg",
      "/images/works/apollo/kid-ride-01.jpg",
      "/images/works/apollo/founder-spirit-01.jpg",
      "/images/works/apollo/storyboard-01.jpg",
    ],
    featured: true,
    homepageOrder: 2,
  },
  {
    slug: "fresh-life-product-film",
    title: "瑞康 / 新鲜生活 AI 企业与产品宣传片",
    subtitle: "Ruikang Fresh Life AI Corporate & Product Film",
    group: "AI Visual Direction",
    category: "AI 企业宣传片",
    industry: "健康消费 / 食品科技 / 企业服务",
    cover: "/images/works/fresh-life/cover.jpg",
    description:
      "该项目围绕瑞康日用品科技自有品牌“新鲜生活”展开，重点展示轻食系列、竹纤维系列、小懒盒、竹纤维纸杯、竹筷子、小竹签等产品，并将绿色笑脸视觉符号贯穿品牌表达。",
    challenge:
      "为展会展厅和线上传播打造一支兼具品牌理念、产品展示、生产工艺与企业气质的宣传视频。",
    strategy:
      "我们将品牌的绿色笑脸元素作为视觉线索，把产品展示、生活方式、环保材料和企业生产能力串联起来，让内容不只是产品罗列，而是一个有记忆点的品牌系统。",
    visualKeywords: [
      "绿色笑脸",
      "新鲜生活",
      "轻食",
      "竹纤维",
      "环保材料",
      "干净明亮",
      "生活方式",
      "展厅播放",
    ],
    process: [
      "产品系列梳理",
      "品牌视觉符号提炼",
      "创意脚本",
      "产品展示镜头规划",
      "AI 场景与分镜设计",
      "视频制作与展厅适配",
    ],
    result:
      "最终视频可用于展厅循环播放、官网展示、招商介绍、线上传播与产品系列推广。",
    services: ["AI 企业宣传片", "产品视觉", "企业形象内容"],
    tags: ["Corporate Film", "Product Film", "Fresh Life", "AI Production"],
    images: [
      "/images/works/fresh-life/product-01.jpg",
      "/images/works/fresh-life/smile-symbol-01.jpg",
      "/images/works/fresh-life/light-food-01.jpg",
      "/images/works/fresh-life/bamboo-fiber-01.jpg",
    ],
    featured: true,
    homepageOrder: 3,
  },
  {
    slug: "junlin-product-image-film",
    title: "君临塑料高端产品形象片",
    subtitle: "Junlin Plastic Premium Product Film",
    group: "Brand & Product Visual",
    category: "AI 企业宣传片",
    industry: "日用品 / 高端产品 / 生活方式",
    cover: "/images/works/junlin/cover.jpg",
    description:
      "该项目目标是将传统日用品产品展示升级为更高端、更克制、更具生活方式质感的品牌形象片。整体参考高端、大气、简约的品牌广告气质，使用真实人物和产品细节构建品牌档次。",
    challenge:
      "弱化低端产品展示感，强化产品与人物、空间、光影、生活场景之间的关系，让产品具备更高级的商业表达。",
    strategy:
      "我们以真人角色、简洁空间、克制表演、近景产品细节和电影化光影为核心，构建一个既能展示产品，又能提升品牌档次的视觉叙事。",
    visualKeywords: [
      "高级",
      "简约",
      "真实人物",
      "产品细节",
      "生活方式",
      "黑白灰",
      "柔和光影",
      "品牌质感",
    ],
    process: [
      "对标视频拉片",
      "品牌调性重构",
      "人物角色设定",
      "产品镜头设计",
      "剧本提案",
      "AI 视觉测试与视频生成",
    ],
    result: "项目适合用于品牌招商、官网展示、展会播放、电商主视觉与社媒宣传。",
    services: ["AI 企业宣传片", "产品形象片", "生活方式视觉"],
    tags: ["Product Film", "Lifestyle", "Premium Visual", "Brand Image"],
    images: [
      "/images/works/junlin/lifestyle-01.jpg",
      "/images/works/junlin/product-detail-01.jpg",
      "/images/works/junlin/character-01.jpg",
      "/images/works/junlin/light-01.jpg",
    ],
    featured: true,
    homepageOrder: 4,
  },
  {
    slug: "luxury-liquor-brand-visual",
    title: "高端酒类品牌视觉",
    subtitle: "Luxury Liquor Brand Visual",
    group: "Brand & Product Visual",
    category: "AI 概念视觉设计",
    industry: "酒类 / 高端消费 / 礼品",
    cover: "/images/works/liquor/cover.jpg",
    description:
      "该案例基于 YITO 过往酒类与高端消费品包装设计经验，展示品牌识别、包装系统、产品气质与商业视觉之间的关系。",
    challenge:
      "通过包装、字体、材质、色彩和品牌图形，建立产品的高端感、礼品属性和文化气质。",
    strategy:
      "酒类品牌不只是包装好看，更要建立场景感和价值感。我们通过暗调视觉、东方元素、材质对比和产品陈列，强化品牌的高级消费属性。",
    visualKeywords: [
      "东方气质",
      "高端礼品",
      "暗调光影",
      "包装系统",
      "酒瓶质感",
      "文化属性",
    ],
    process: ["包装系统梳理", "品牌图形提炼", "材质与色彩设定", "商业视觉延展"],
    result:
      "该类经验可继续延展到 AI 酒类广告片、产品短片、招商视觉和电商主视觉中。",
    services: ["AI 概念视觉设计", "产品视觉", "品牌视觉"],
    tags: ["Luxury Brand", "Liquor", "Product Visual", "Commercial"],
    images: [
      "/images/works/liquor/package-01.jpg",
      "/images/works/liquor/package-02.jpg",
      "/images/works/liquor/bottle-01.jpg",
      "/images/works/liquor/detail-01.jpg",
    ],
    featured: true,
    homepageOrder: 5,
  },
  {
    slug: "brand-visual-selected-works",
    title: "品牌视觉设计精选",
    subtitle: "Brand Visual Selected Works",
    group: "Design Foundation",
    category: "品牌设计 / 包装设计 / 商业视觉",
    industry: "金融 / 科技 / 医疗 / 消费品牌",
    cover: "/images/works/brand-selected/cover.jpg",
    description:
      "YITO 起步于商业视觉设计，过往项目覆盖金融、科技、医疗、文化、消费品牌等方向。这些项目经验构成了今天 YITO 转向 AI 商业视觉的审美、策略和交付基础。",
    challenge:
      "展示 YITO 在传统商业设计领域的积累，让客户理解：YITO 并不是单纯 AI 工具使用者，而是有设计判断和商业项目经验的视觉工作室。",
    strategy:
      "本案例不作为单一项目展示，而作为历史能力合集。重点呈现品牌识别、应用系统、行业适配能力和商业审美基础。",
    visualKeywords: [
      "品牌识别",
      "应用系统",
      "行业适配",
      "商业审美",
      "跨行业视觉表达",
    ],
    process: ["品牌识别", "应用系统", "包装设计", "营销视觉", "跨行业视觉沉淀"],
    representativeProjects: [
      "丰收证券",
      "奥陶世卫星",
      "松果健康",
      "孔子学院总部",
    ],
    result:
      "这些历史项目证明 YITO 具备品牌识别、商业设计和跨行业视觉表达经验，可为 AI 商业视觉项目提供更稳定的审美与策略支撑。",
    services: ["品牌视觉设计", "包装设计", "商业视觉", "AI 视觉策略"],
    tags: ["Brand Identity", "Packaging", "Visual System", "Design"],
    images: [
      "/images/works/brand-selected/foison-01.jpg",
      "/images/works/brand-selected/ordovician-01.jpg",
      "/images/works/brand-selected/sungo-01.jpg",
      "/images/works/brand-selected/confucius-01.jpg",
    ],
    featured: true,
    homepageOrder: 6,
  },
] satisfies WorkContent[];
