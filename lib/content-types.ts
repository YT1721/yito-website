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
  visual: string;
  image?: string;
};

export type HeroContent = {
  no: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  visual: string;
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
  visual: string;
  image?: string;
  visualLabel: string;
};

export type ServiceItem = VisualBlock & {
  title: string;
  en: string;
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
  summary: string;
  description: string;
  industry: string;
  tags: string[];
  videoUrl?: string;
  meta: string[];
  thumbs: VisualBlock[];
};

export type ProcessStep = {
  title: string;
  detail: string;
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
  wechat: string;
  email: string;
  xiaohongshu: string;
  visual: string;
  image?: string;
  visualLabel: string;
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  services: ServiceSection;
  selectedWorks: WorkSection;
  caseStudies: CaseStudy[];
  process: {
    no: string;
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  why: {
    no: string;
    title: string;
    subtitle: string;
    items: WhyItem[];
  };
  contact: ContactContent;
};
