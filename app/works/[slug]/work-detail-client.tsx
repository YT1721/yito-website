"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Film, ImageIcon, Tag } from "lucide-react";
import type {
  CaseStudy,
  SiteContent,
  VisualBlock,
} from "../../../lib/content-types";
import type { WorkContent } from "../../../content/works";
import ImageWithFallback from "../../../components/ImageWithFallback";

type DetailWork = CaseStudy & {
  year?: string;
  category?: string;
  challenge?: string;
  strategy?: string;
  solution?: string;
  result?: string;
  services?: string[];
};

export default function WorkDetailClient({
  slug,
  initialContent,
  initialWork,
  initialWorks,
}: {
  slug: string;
  initialContent?: SiteContent;
  initialWork?: WorkContent;
  initialWorks?: WorkContent[];
}) {
  const [content, setContent] = useState<SiteContent | undefined>(
    initialContent,
  );

  useEffect(() => {
    if (initialWork) return;

    fetch("/api/content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((nextContent: SiteContent | null) => {
        if (nextContent) setContent(nextContent);
      })
      .catch(() => undefined);
  }, [initialWork]);

  const work = useMemo<DetailWork | undefined>(() => {
    if (initialWork) return mapContentWork(initialWork);
    return content?.caseStudies.find((item) => item.slug === slug);
  }, [content?.caseStudies, initialWork, slug]);
  const nextWorks = useMemo<DetailWork[]>(() => {
    if (initialWorks) {
      return initialWorks
        .filter((item) => item.slug !== slug)
        .sort((a, b) => a.homepageOrder - b.homepageOrder)
        .slice(0, 3)
        .map(mapContentWork);
    }

    return (
      content?.caseStudies.filter((item) => item.slug !== slug).slice(0, 3) ??
      []
    );
  }, [content?.caseStudies, initialWorks, slug]);

  if (!work) {
    return (
      <main className="work-detail-shell">
        <DetailNav />
        <section className="work-not-found">
          <p>404</p>
          <h1>没有找到这个作品</h1>
          <Link href="/#work">返回案例列表</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="work-detail-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: work.title,
            description: work.summary,
            genre: work.tags,
            industry: work.industry,
            creator: {
              "@type": "Organization",
              name: "YITO",
            },
          }),
        }}
      />
      <DetailNav />

      <section className="work-hero">
        <div className="work-hero-copy">
          <span className="work-no">{work.no}</span>
          <p className="work-kicker">
            {[work.category, work.en].filter(Boolean).join(" / ")}
          </p>
          <h1>{work.title}</h1>
          <p className="work-summary">{work.summary}</p>
          <div className="work-tags">
            <span>
              <Tag size={14} />
              {work.industry}
            </span>
            {work.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <MediaStage work={work} />
      </section>

      <section className="work-detail-grid">
        <div className="work-description">
          <p className="work-section-label">Project Brief</p>
          <h2>作品简介</h2>
          <p>{work.description}</p>
        </div>
        <div className="work-meta-panel">
          <p className="work-section-label">Information</p>
          {work.year ? <p>年份 {work.year}</p> : null}
          {publicMeta(work.meta).map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="work-story-section">
        <StoryBlock
          label="Objective"
          title="项目目标"
          text={work.challenge ?? work.summary}
        />
        <StoryBlock
          label="Visual Strategy"
          title="视觉策略"
          text={work.strategy ?? work.description}
        />
        <StoryBlock
          label="Production"
          title="制作流程"
          text={work.solution ?? (work.services ?? []).join(" / ")}
        />
        <StoryBlock
          label="Result"
          title="成果展示"
          text={
            work.result ??
            "形成可用于品牌传播、提案展示与后续视频制作的视觉资产。"
          }
        />
      </section>

      <section className="work-gallery-section">
        <div className="work-gallery-heading">
          <p className="work-section-label">Gallery</p>
          <h2>图片 / 视频画面浏览</h2>
        </div>
        <div className="work-gallery">
          {work.thumbs.map((thumb, index) => (
            <VisualTile
              key={`${work.slug}-${index}`}
              block={thumb}
              index={index + 1}
            />
          ))}
        </div>
      </section>

      <section className="work-fit-section">
        <div>
          <p className="work-section-label">Best Fit</p>
          <h2>适用客户</h2>
          <p>
            适合正在筹备品牌发布、产品推广、企业宣传、内容营销或视觉提案的品牌与团队。
          </p>
        </div>
        <div className="work-service-tags">
          {(work.services ?? work.tags).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <Link href="/#contact" className="work-contact-cta">
          联系合作 <ArrowUpRight size={15} />
        </Link>
      </section>

      <section className="more-works">
        <div>
          <p className="work-section-label">More Works</p>
          <h2>继续浏览作品</h2>
        </div>
        <div className="more-work-grid">
          {nextWorks.map((item) => (
            <Link
              key={item.slug}
              href={`/works/${item.slug}`}
              className="more-work-card"
            >
              <VisualTile block={item} compact />
              <span>{item.title}</span>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function mapContentWork(work: WorkContent): DetailWork {
  return {
    no: String(work.homepageOrder).padStart(2, "0"),
    slug: work.slug,
    title: work.title,
    en: work.subtitle,
    category: work.category,
    summary: work.description,
    description: work.description,
    challenge: work.challenge,
    strategy: work.strategy,
    solution: work.process.join(" / "),
    result: work.result,
    services: work.services,
    industry: work.industry,
    tags: work.tags,
    meta: [
      `类型  ${work.category}`,
      `行业  ${work.industry}`,
      `视觉关键词  ${work.visualKeywords.join(" / ")}`,
    ],
    visual: work.slug,
    image: work.cover,
    cover: work.cover,
    thumbs: work.images.map((image, index) => ({
      image,
      visual: `${work.slug}-${String(index + 1).padStart(2, "0")}`,
    })),
  };
}

function StoryBlock({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <article>
      <p className="work-section-label">{label}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

function DetailNav() {
  return (
    <header className="detail-nav">
      <Link href="/" className="detail-logo" aria-label="YITO home">
        <Image
          src="/yito-logo-white-v2.png"
          alt="YITO visual logo"
          width={42}
          height={42}
        />
      </Link>
      <Link href="/#work" className="back-link">
        <ArrowLeft size={16} />
        返回作品
      </Link>
    </header>
  );
}

function MediaStage({ work }: { work: CaseStudy }) {
  if (work.videoUrl && isDirectVideoUrl(work.videoUrl)) {
    return (
      <div className="work-media-stage">
        <video src={work.videoUrl} controls playsInline poster={work.image} />
      </div>
    );
  }

  return (
    <div
      className={`work-media-stage ${work.visual} ${work.image ? "has-image" : ""}`}
    >
      <VisualImage block={work} priority />
      <span className="media-badge">
        <Film size={15} />
        {work.videoUrl ? "Video Link" : "Visual Preview"}
      </span>
      {work.videoUrl ? (
        <a
          className="work-video-link"
          href={work.videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          打开视频链接 <ArrowUpRight size={14} />
        </a>
      ) : null}
    </div>
  );
}

function VisualTile({
  block,
  index,
  compact,
}: {
  block: VisualBlock;
  index?: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`${compact ? "visual-tile is-compact" : "visual-tile"} ${block.visual} ${block.image ? "has-image" : ""}`}
    >
      <VisualImage block={block} />
      {index ? (
        <span>
          <ImageIcon size={14} />
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
    </div>
  );
}

function VisualImage({
  block,
  priority,
}: {
  block: VisualBlock;
  priority?: boolean;
}) {
  if (!block.image) return null;

  return (
    <ImageWithFallback
      src={block.image}
      alt=""
      className="visual-media"
      priority={priority}
      sizes="(max-width: 820px) 100vw, 50vw"
    />
  );
}

function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

function publicMeta(items: string[]) {
  return items.filter((item) => !isAdminHint(item));
}

function isAdminHint(value: string) {
  return /(推荐|尺寸|比例|上传|主图|缩略图|展示图|视频).*(\d+[:：]\d+|\d+×\d+|MP4|WebM|H\.264)/i.test(
    value,
  );
}
