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
  title: string;
  en: string;
  description?: string;
  scenes?: string;
  icon: IconName;
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
  industry: string;
  tags: string[];
  videoUrl?: string;
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

export type SiteContent = {
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
