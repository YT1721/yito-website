import { siteContent as defaultSiteContent } from "../content/site";
import type { SiteContentData } from "../content/site";
import type { WorkContent, WorkGroup } from "../content/works";
import type {
  CaseStudy,
  IconName,
  ServiceItem,
  SiteContent,
} from "./content-types";
import { readSiteContent } from "./content-store";

type EditableCaseStudy = CaseStudy & {
  group?: WorkGroup;
  subtitle?: string;
  visualKeywords?: string[];
  process?: string[];
  images?: string[];
  featured?: boolean;
  homepageOrder?: number;
  representativeProjects?: string[];
};

export async function readRuntimeSiteContent(): Promise<SiteContentData> {
  try {
    return adaptEditableContent(await readSiteContent());
  } catch {
    return defaultSiteContent;
  }
}

export async function readRuntimeWorks(): Promise<WorkContent[]> {
  const content = await readRuntimeSiteContent();
  return content.works;
}

export function adaptEditableContent(content: SiteContent): SiteContentData {
  const works = mapWorks(content.caseStudies);

  return {
    ...defaultSiteContent,
    hero: {
      ...defaultSiteContent.hero,
      title: content.hero?.title || defaultSiteContent.hero.title,
      subtitle: content.hero?.subtitle || defaultSiteContent.hero.subtitle,
      positioning:
        content.hero?.positioning || defaultSiteContent.hero.positioning,
      statement: content.hero?.description || defaultSiteContent.hero.statement,
      description: content.hero?.note || defaultSiteContent.hero.description,
      primaryCta:
        content.hero?.primaryCta || defaultSiteContent.hero.primaryCta,
      secondaryCta:
        content.hero?.secondaryCta || defaultSiteContent.hero.secondaryCta,
      tags: content.hero?.tags?.length
        ? content.hero.tags
        : defaultSiteContent.hero.tags,
      cover: content.hero?.image || defaultSiteContent.hero.cover,
    },
    selectedWorks: {
      ...defaultSiteContent.selectedWorks,
      title:
        content.selectedWorks?.title || defaultSiteContent.selectedWorks.title,
      subtitle:
        content.selectedWorks?.subtitle ||
        defaultSiteContent.selectedWorks.subtitle,
      description:
        content.selectedWorks?.intro ||
        defaultSiteContent.selectedWorks.description,
      linkLabel:
        content.selectedWorks?.linkText ||
        defaultSiteContent.selectedWorks.linkLabel,
    },
    about: {
      ...defaultSiteContent.about,
      title: content.about?.title || defaultSiteContent.about.title,
      subtitle: content.about?.subtitle || defaultSiteContent.about.subtitle,
      body: splitParagraphs(content.about?.body).length
        ? splitParagraphs(content.about?.body)
        : defaultSiteContent.about.body,
      capabilities: mapCapabilities(content.about?.capabilities),
      statement: content.about?.statement || defaultSiteContent.about.statement,
      cover: content.about?.image || defaultSiteContent.about.cover,
    },
    services: {
      ...defaultSiteContent.services,
      title: content.services?.title || defaultSiteContent.services.title,
      subtitle:
        content.services?.subtitle || defaultSiteContent.services.subtitle,
      description:
        content.services?.microCopy || defaultSiteContent.services.description,
      items: content.services?.items?.length
        ? content.services.items.map(mapService)
        : defaultSiteContent.services.items,
    },
    works,
    aiStudio: {
      ...defaultSiteContent.aiStudio,
      title: content.aiStudio?.title || defaultSiteContent.aiStudio.title,
      subtitle:
        content.aiStudio?.subtitle || defaultSiteContent.aiStudio.subtitle,
      body: splitParagraphs(content.aiStudio?.body).length
        ? splitParagraphs(content.aiStudio?.body)
        : defaultSiteContent.aiStudio.body,
      capabilities: content.aiStudio?.items?.length
        ? content.aiStudio.items
        : defaultSiteContent.aiStudio.capabilities,
      statement:
        content.aiStudio?.statement || defaultSiteContent.aiStudio.statement,
      cover: content.aiStudio?.image || defaultSiteContent.aiStudio.cover,
    },
    workflow: {
      ...defaultSiteContent.workflow,
      title: content.process?.title || defaultSiteContent.workflow.title,
      subtitle:
        content.process?.subtitle || defaultSiteContent.workflow.subtitle,
      description:
        content.process?.intro || defaultSiteContent.workflow.description,
      steps: content.process?.steps?.length
        ? content.process.steps.map((step, index) => ({
            id: slugify(step.en || step.title || `step-${index + 1}`),
            title: step.title,
            subtitle:
              step.en ||
              defaultSiteContent.workflow.steps[index]?.subtitle ||
              "",
            description:
              step.detail ||
              defaultSiteContent.workflow.steps[index]?.description ||
              "",
          }))
        : defaultSiteContent.workflow.steps,
    },
    whyChoose: {
      ...defaultSiteContent.whyChoose,
      title: content.why?.title || defaultSiteContent.whyChoose.title,
      subtitle: content.why?.subtitle || defaultSiteContent.whyChoose.subtitle,
      description:
        content.why?.intro || defaultSiteContent.whyChoose.description,
      items: content.why?.items?.length
        ? content.why.items.map((item, index) => ({
            id: slugify(item.title || `reason-${index + 1}`),
            title: item.title,
            description: item.text,
            icon: item.icon,
          }))
        : defaultSiteContent.whyChoose.items,
    },
    clients: {
      ...defaultSiteContent.clients,
      title: content.clients?.title || defaultSiteContent.clients.title,
      subtitle:
        content.clients?.subtitle || defaultSiteContent.clients.subtitle,
      description:
        content.clients?.intro || defaultSiteContent.clients.description,
      groups: content.clients?.groups?.length
        ? content.clients.groups
        : defaultSiteContent.clients.groups,
    },
    contact: {
      ...defaultSiteContent.contact,
      title: content.contact?.title || defaultSiteContent.contact.title,
      subtitle:
        content.contact?.subtitle || defaultSiteContent.contact.subtitle,
      description:
        content.contact?.intro || defaultSiteContent.contact.description,
      note: content.contact?.note || defaultSiteContent.contact.note,
      email: content.contact?.email || defaultSiteContent.contact.email,
      wechat: content.contact?.wechat || defaultSiteContent.contact.wechat,
      xiaohongshu:
        content.contact?.xiaohongshu || defaultSiteContent.contact.xiaohongshu,
      location:
        content.contact?.location || defaultSiteContent.contact.location,
      cover: content.contact?.image || defaultSiteContent.contact.cover,
    },
    footer: {
      ...defaultSiteContent.footer,
      ...(content.footer ?? {}),
    },
  } as SiteContentData;
}

function mapService(service: ServiceItem, index: number) {
  return {
    id: slugify(service.en || service.title || `service-${index + 1}`),
    title: service.title,
    subtitle: service.en,
    description: service.description || "",
    scenes: splitList(service.scenes),
    icon: service.icon as IconName,
    cover:
      service.image || defaultSiteContent.services.items[index]?.cover || "",
  };
}

function mapWorks(caseStudies: CaseStudy[] = []): WorkContent[] {
  const source = caseStudies.length ? caseStudies : [];

  if (!source.length) return defaultSiteContent.works;

  return source.map((item, index) => mapWork(item as EditableCaseStudy, index));
}

function mapWork(item: EditableCaseStudy, index: number): WorkContent {
  const images =
    item.images?.filter(Boolean) ??
    item.thumbs?.map((thumb) => thumb.image || "").filter(Boolean) ??
    [];

  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle || item.en,
    group: item.group || inferWorkGroup(item),
    category: item.category || "",
    industry: item.industry || "",
    cover: item.cover || item.image || images[0] || "/images/placeholder.jpg",
    video: item.videoUrl,
    videoUrl: item.videoUrl,
    description: item.description || item.summary,
    challenge: item.challenge || item.summary || item.description,
    strategy: item.strategy || item.solution || item.description,
    visualKeywords: item.visualKeywords?.length
      ? item.visualKeywords
      : item.tags?.length
        ? item.tags
        : splitList(item.industry),
    process: item.process?.length
      ? item.process
      : item.services?.length
        ? item.services
        : splitList(item.solution),
    representativeProjects: item.representativeProjects,
    result: item.result || item.solution || item.description,
    services: item.services || [],
    tags: item.tags || [],
    images,
    featured: item.featured ?? index < 6,
    homepageOrder: (item.homepageOrder ?? Number(item.no)) || index + 1,
  };
}

function inferWorkGroup(work: EditableCaseStudy): WorkGroup {
  const text = `${work.slug} ${work.title} ${work.category}`.toLowerCase();

  if (text.includes("brand-visual") || text.includes("品牌视觉设计")) {
    return "Design Foundation";
  }

  if (
    text.includes("liquor") ||
    text.includes("junlin") ||
    text.includes("product") ||
    text.includes("包装") ||
    text.includes("产品")
  ) {
    return "Brand & Product Visual";
  }

  return "AI Visual Direction";
}

function mapCapabilities(capabilities?: string[]) {
  if (!capabilities?.length) return defaultSiteContent.about.capabilities;

  return capabilities.map((item) => {
    const [title, ...rest] = item.split(/\n|：|:/).map((part) => part.trim());

    return {
      title: title || item,
      description: rest.join(" ") || "",
    };
  });
}

function splitParagraphs(value?: string) {
  return (value || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitList(value?: string | string[]) {
  if (Array.isArray(value)) return value.filter(Boolean);

  return (value || "")
    .split(/\n|\/|、|，|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
