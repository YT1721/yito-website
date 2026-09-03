export type IconName =
  | "badge"
  | "boxes"
  | "clapperboard"
  | "film"
  | "gauge"
  | "pen"
  | "sparkles"
  | "wand";

export type VisualBlock = {
  visual?: string;
  image?: string;
};

export type HeroContent = {
  no: string;
  title: string;
  subtitle: string;
  positioning?: string;
  description?: string;
  note?: string;
  primaryCta: string;
  secondaryCta: string;
  tags?: string[];
  visual?: string;
  image?: string;
  visualLabel: string;
};

export type AboutContent = {
  no: string;
  title: string;
  subtitle: string;
  body: string;
  capabilities: string[];
  statement: string;
  visual?: string;
  image?: string;
  visualLabel: string;
};

export type ServiceItem = VisualBlock & {
  id?: string;
  title: string;
  en: string;
  description?: string;
  scenes?: string;
  icon: IconName;
};

export type WorkVideo = {
  type: "bilibili" | "external" | "local";
  url: string;
  embedUrl?: string;
  title?: string;
};

export type SeoContent = {
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

export type WorkItem = VisualBlock & {
  title: string;
  en: string;
  caseSlug?: string;
};

export type WorkSection = {
  no: string;
  title: string;
  subtitle: string;
  intro: string;
  linkText: string;
  categories?: string[];
  items: WorkItem[];
};

export type ServiceSection = {
  no: string;
  title: string;
  subtitle: string;
  microCopy: string;
  items: ServiceItem[];
};

export type CaseStudy = VisualBlock & {
  no: string;
  slug: string;
  title: string;
  en: string;
  category?: string;
  year?: string;
  cover?: string;
  summary: string;
  description: string;
  challenge?: string;
  strategy?: string;
  solution?: string;
  result?: string;
  services?: string[];
  serviceIds?: string[];
  industry: string;
  tags: string[];
  video?: WorkVideo;
  videoUrl?: string;
  featured?: boolean;
  homepageOrder?: number;
  meta: string[];
  thumbs: VisualBlock[];
};

export type ProcessStep = {
  title: string;
  en?: string;
  detail: string;
};

export type AiCapabilitySection = {
  no: string;
  title: string;
  subtitle: string;
  intro: string;
  items: string[];
  note: string;
};

export type AiStudioSection = VisualBlock & {
  no: string;
  title: string;
  subtitle: string;
  body: string;
  items: string[];
  statement: string;
};

export type WhyItem = {
  title: string;
  text: string;
  icon: IconName;
};

export type ContactContent = {
  no: string;
  title: string;
  subtitle: string;
  intro?: string;
  note?: string;
  wechat: string;
  email: string;
  xiaohongshu: string;
  location?: string;
  visual?: string;
  image?: string;
  visualLabel: string;
};

export type ClientGroup = {
  title: string;
  subtitle: string;
  items: string[];
};

export type ClientsSection = {
  no: string;
  title: string;
  subtitle: string;
  intro: string;
  groups: ClientGroup[];
};

export type FooterContent = {
  brand: string;
  subtitle: string;
  services: string;
  copyright: string;
  credit: string;
};

export type ScrollWorldContent = {
  enabled: boolean;
  desktopVideo: string;
  mobileVideo?: string;
  poster: string;
  introTitle: string;
  introSubtitle: string;
  fallbackMode: "poster" | "static";
  scenes?: ScrollWorldScene[];
};

export type ScrollWorldScene = {
  id: string;
  no: string;
  title: string;
  subtitle: string;
  body: string;
  serviceId?: string;
  poster?: string;
};

export type SiteContent = {
  meta?: SeoContent;
  scrollWorld?: ScrollWorldContent;
  hero: HeroContent;
  about: AboutContent;
  services: ServiceSection;
  selectedWorks: WorkSection;
  caseStudies: CaseStudy[];
  aiStudio?: AiStudioSection;
  process: {
    no: string;
    title: string;
    subtitle: string;
    intro?: string;
    steps: ProcessStep[];
  };
  why: {
    no: string;
    title: string;
    subtitle: string;
    intro?: string;
    items: WhyItem[];
  };
  clients?: ClientsSection;
  aiCapability: AiCapabilitySection;
  contact: ContactContent;
  footer?: FooterContent;
};
