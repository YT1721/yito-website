"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Film, ImageIcon, Tag } from "lucide-react";
import type {
  CaseStudy,
  SiteContent,
  VisualBlock,
} from "../../../lib/content-types";

export default function WorkDetailClient({
  slug,
  initialContent,
}: {
  slug: string;
  initialContent: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((nextContent: SiteContent | null) => {
        if (nextContent) setContent(nextContent);
      })
      .catch(() => undefined);
  }, []);

  const work = useMemo(
    () => content.caseStudies.find((item) => item.slug === slug),
    [content.caseStudies, slug],
  );
  const nextWorks = useMemo(
    () => content.caseStudies.filter((item) => item.slug !== slug).slice(0, 3),
    [content.caseStudies, slug],
  );

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
          <p className="work-kicker">{work.en}</p>
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
          {work.meta.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
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
  if (work.videoUrl) {
    return (
      <div className="work-media-stage">
        <video src={work.videoUrl} controls playsInline poster={work.image} />
      </div>
    );
  }

  return (
    <div
      className={`work-media-stage ${work.visual} ${work.image ? "has-image" : ""}`}
      style={visualStyle(work.image)}
    >
      <span className="media-badge">
        <Film size={15} />
        Visual Preview
      </span>
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
      style={visualStyle(block.image)}
    >
      {index ? (
        <span>
          <ImageIcon size={14} />
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
    </div>
  );
}

function visualStyle(image?: string): CSSProperties | undefined {
  return image
    ? ({ "--visual-image": `url("${image}")` } as CSSProperties)
    : undefined;
}
