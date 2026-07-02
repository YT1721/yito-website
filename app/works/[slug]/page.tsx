import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Film, Play, Tag } from "lucide-react";
import type { WorkContent } from "../../../content/works";
import ImageWithFallback from "../../../components/ImageWithFallback";
import { readRuntimeWorks } from "../../../lib/runtime-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yito-visual.com";

type WorkPageParams = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const works = await readRuntimeWorks();

  return works.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkPageParams): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) {
    return {
      title: "作品未找到",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: work.title,
    description: work.description,
    keywords: [
      work.title,
      work.subtitle,
      work.category,
      work.industry,
      ...work.tags,
    ],
    alternates: {
      canonical: `${siteUrl}/works/${work.slug}`,
    },
    openGraph: {
      title: `${work.title} | YITO`,
      description: work.description,
      url: `${siteUrl}/works/${work.slug}`,
      siteName: "YITO Visual",
      type: "article",
      locale: "zh_CN",
      images: [
        {
          url: work.cover,
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: work.title,
      description: work.description,
      images: [work.cover],
    },
  };
}

export default async function WorkDetailPage({ params }: WorkPageParams) {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) notFound();

  const videoUrl = work.video ?? work.videoUrl;

  return (
    <main className="case-detail-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: work.title,
            alternateName: work.subtitle,
            description: work.description,
            genre: work.category,
            industry: work.industry,
            image: work.cover,
            creator: {
              "@type": "Organization",
              name: "YITO",
            },
          }),
        }}
      />

      <header className="case-detail-nav">
        <Link href="/works">
          <ArrowLeft size={16} />
          Selected Works
        </Link>
        <Link href="/#contact">
          联系合作
          <ArrowUpRight size={15} />
        </Link>
      </header>

      <section className="case-detail-hero">
        <div className="case-detail-hero-media">
          <CinematicImage src={work.cover} label={work.title} priority />
        </div>
        <div className="case-detail-hero-copy">
          <span className="case-detail-no">
            {String(work.homepageOrder).padStart(2, "0")}
          </span>
          <p>{work.category}</p>
          <h1>{work.title}</h1>
          <h2>{work.subtitle}</h2>
          <div className="case-detail-meta">
            <span>
              <Tag size={14} />
              {work.industry}
            </span>
            {work.tags.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {videoUrl ? (
        <section className="case-video-section">
          <SectionHeading
            index="00"
            title="Video Preview"
            subtitle="视频预览"
          />
          {isDirectVideoUrl(videoUrl) ? (
            <video
              src={videoUrl}
              poster={work.cover}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <Link href={videoUrl} target="_blank" rel="noreferrer">
              <Play size={18} />
              打开视频链接
              <ArrowUpRight size={16} />
            </Link>
          )}
        </section>
      ) : null}

      <section className="case-overview-section">
        <SectionHeading
          index="01"
          title="Project Overview"
          subtitle="项目简介"
        />
        <p>{work.description}</p>
      </section>

      <section className="case-narrative-grid">
        <NarrativeBlock
          index="02"
          title="Challenge"
          subtitle="项目目标"
          body={work.challenge}
        />
        <NarrativeBlock
          index="03"
          title="Creative Strategy"
          subtitle="创意策略"
          body={work.strategy}
        />
      </section>

      <section className="case-direction-section">
        <SectionHeading
          index="04"
          title="Visual Direction"
          subtitle="视觉关键词"
        />
        <div className="case-keyword-grid">
          {work.visualKeywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
      </section>

      <section className="case-process-section">
        <SectionHeading
          index="05"
          title="Production Process"
          subtitle="制作流程"
        />
        <ol>
          {work.process.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="case-gallery-section">
        <SectionHeading index="06" title="Gallery" subtitle="图片展示" />
        <div className="case-gallery-grid">
          {work.images.map((image, index) => (
            <figure key={image} className={index === 0 ? "is-featured" : ""}>
              <CinematicImage
                src={image}
                label={`${work.title} ${index + 1}`}
              />
              <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="case-result-section">
        <SectionHeading index="07" title="Result" subtitle="成果说明" />
        <p>{work.result}</p>
      </section>

      <section className="case-services-section">
        <SectionHeading
          index="08"
          title="Related Services"
          subtitle="相关服务"
        />
        <div>
          {work.services.map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      </section>

      <section className="case-contact-section">
        <p>Contact YITO</p>
        <h2>想为你的品牌制作类似的商业视觉内容？</h2>
        <span>联系 YITO 讨论项目。</span>
        <div>
          <Link href="/#contact">
            联系合作
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/works">
            查看更多案例
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

async function getWork(slug: string): Promise<WorkContent | undefined> {
  const works = await readRuntimeWorks();

  return works.find((work) => work.slug === slug);
}

function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="case-section-heading">
      <span>{index}</span>
      <p>{title}</p>
      <h2>{subtitle}</h2>
    </div>
  );
}

function NarrativeBlock({
  index,
  title,
  subtitle,
  body,
}: {
  index: string;
  title: string;
  subtitle: string;
  body: string;
}) {
  return (
    <article>
      <SectionHeading index={index} title={title} subtitle={subtitle} />
      <p>{body}</p>
    </article>
  );
}

function CinematicImage({
  src,
  label,
  priority,
}: {
  src: string;
  label: string;
  priority?: boolean;
}) {
  return (
    <div
      className="case-cinematic-image"
      data-priority={priority ? "true" : undefined}
    >
      <ImageWithFallback
        src={src}
        alt={label}
        className="case-cinematic-media"
        priority={priority}
        sizes="(max-width: 1120px) 100vw, 58vw"
      />
      <Film size={18} />
    </div>
  );
}

function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}
