"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Clapperboard,
  Film,
  Gauge,
  Mail,
  MessageCircle,
  PenTool,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { IconName, SiteContent, VisualBlock } from "../lib/content-types";

const iconMap = {
  badge: BadgeCheck,
  boxes: Boxes,
  clapperboard: Clapperboard,
  film: Film,
  gauge: Gauge,
  pen: PenTool,
  sparkles: Sparkles,
  wand: Wand2,
} satisfies Record<IconName, typeof Sparkles>;

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

export default function HomeClient({
  initialContent,
}: {
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

  return (
    <main className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "YITO",
            description: "AI-Native Commercial Visual Studio",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.yito.visual",
            areaServed: "China",
            serviceType: ["AI品牌广告片", "AI商业短片", "AI概念视觉"],
            email: content.contact.email,
          }),
        }}
      />
      <FloatingNav />

      <Chapter id="hero" no={content.hero.no} className="hero-chapter">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="hero-copy"
        >
          <motion.div variants={fadeUp} className="brand-lockup">
            <Image
              src="/yito-logo-white-v2.png"
              alt="YITO visual logo"
              width={88}
              height={88}
              priority
            />
          </motion.div>
          <motion.h1 variants={fadeUp}>{content.hero.title}</motion.h1>
          <motion.p variants={fadeUp} className="hero-subtitle">
            {content.hero.subtitle}
          </motion.p>
          <motion.div variants={fadeUp} className="green-rule" />
          <motion.div variants={fadeUp} className="hero-actions">
            <a href="#work">{content.hero.primaryCta}</a>
            <a href="#contact">{content.hero.secondaryCta}</a>
          </motion.div>
        </motion.div>
        <CinematicVisual block={content.hero} />
      </Chapter>

      <Chapter
        id="about"
        no={content.about.no}
        title={content.about.title}
        subtitle={content.about.subtitle}
        className="about-chapter"
      >
        <div className="chapter-text">
          <p>{content.about.body}</p>
          <div className="capability-row">
            {content.about.capabilities.map((item) => (
              <span key={item}>
                <Sparkles size={15} />
                {item}
              </span>
            ))}
          </div>
          <p className="statement">{content.about.statement}</p>
        </div>
        <CinematicVisual block={content.about} />
      </Chapter>

      <Chapter
        id="services"
        no={content.services.no}
        title={content.services.title}
        subtitle={content.services.subtitle}
        className="services-chapter"
      >
        <div className="service-strip">
          {content.services.items.map((service) => {
            const Icon = iconMap[service.icon] ?? Sparkles;
            return (
              <motion.article
                key={`${service.title}-${service.en}`}
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="service-card"
              >
                <VisualSurface block={service} className="card-visual" />
                <div className="card-body">
                  <Icon size={18} />
                  <h3>{service.title}</h3>
                  <p>{service.en}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
        <p className="micro-copy">{content.services.microCopy}</p>
      </Chapter>

      <Chapter
        id="work"
        no={content.selectedWorks.no}
        title={content.selectedWorks.title}
        subtitle={content.selectedWorks.subtitle}
        className="works-chapter"
      >
        <div className="works-intro">
          <p>{content.selectedWorks.intro}</p>
          <a href="#work" className="text-link">
            {content.selectedWorks.linkText} <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="selected-strip">
          {content.selectedWorks.items.map((work, index) => (
            <motion.article
              key={`${work.title}-${work.en}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.55 }}
              className="selected-card"
            >
              <Link
                href={`/works/${work.caseSlug ?? content.caseStudies[index % content.caseStudies.length]?.slug ?? ""}`}
                className="work-card-link"
              >
                <VisualSurface block={work} className="selected-visual" />
                <div>
                  <h3>{work.title}</h3>
                  <p>{work.en}</p>
                </div>
                <span className="open-work-link">
                  查看详情 <ArrowUpRight size={13} />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </Chapter>

      {content.caseStudies.map((item) => (
        <Chapter
          key={`${item.no}-${item.title}`}
          no={item.no}
          title={item.title}
          subtitle={item.en}
          className="case-chapter"
        >
          <div className="case-info">
            {item.meta.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <Link
            href={`/works/${item.slug}`}
            className="case-visual-link"
            aria-label={`查看${item.title}详情`}
          >
            <CinematicVisual block={item} />
          </Link>
          <div className="thumb-row">
            {item.thumbs.map((thumb, index) => (
              <Link
                key={`${item.no}-${index}`}
                href={`/works/${item.slug}`}
                className="thumb-link"
                aria-label={`查看${item.title}详情`}
              >
                <VisualSurface block={thumb} className="thumb" />
              </Link>
            ))}
          </div>
          <Link href={`/works/${item.slug}`} className="case-detail-link">
            查看作品详情 <ArrowUpRight size={14} />
          </Link>
        </Chapter>
      ))}

      <Chapter
        no={content.socialContent.no}
        title={content.socialContent.title}
        subtitle={content.socialContent.subtitle}
        className="social-chapter"
      >
        <div className="social-copy">
          <p>{content.socialContent.intro}</p>
          <span>{content.socialContent.platform}</span>
        </div>
        <div className="social-card-strip">
          {content.socialContent.cards.map((card, index) => (
            <motion.article
              key={`${card.title}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.55 }}
              className="social-card"
            >
              <VisualSurface block={card} className="social-visual" />
              <div className="social-card-body">
                <p>{card.platform}</p>
                <h3>{card.title}</h3>
                <span>{card.en}</span>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="social-metrics">
          {content.socialContent.metrics.map((metric) => (
            <div key={`${metric.label}-${metric.value}`}>
              <Sparkles size={15} />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="workflow"
        no={content.process.no}
        title={content.process.title}
        subtitle={content.process.subtitle}
        className="process-chapter"
      >
        <div className="process-map">
          {content.process.steps.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.55 }}
              className="process-step"
            >
              <span className="process-dot">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </motion.div>
          ))}
        </div>
      </Chapter>

      <Chapter
        no={content.why.no}
        title={content.why.title}
        subtitle={content.why.subtitle}
        className="why-chapter"
      >
        <div className="why-grid">
          {content.why.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <article key={item.title} className="why-card">
                <Icon size={20} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </Chapter>

      <Chapter
        id="contact"
        no={content.contact.no}
        title={content.contact.title}
        subtitle={content.contact.subtitle}
        className="contact-chapter"
      >
        <div className="contact-list">
          <a href="#contact">
            <MessageCircle size={15} />
            微信 {content.contact.wechat}
          </a>
          <a href={`mailto:${content.contact.email}`}>
            <Mail size={15} />
            {content.contact.email}
          </a>
          <a href="#contact">
            <ArrowUpRight size={15} />
            小红书 {content.contact.xiaohongshu}
          </a>
        </div>
        <CinematicVisual block={content.contact} />
      </Chapter>
    </main>
  );
}

function FloatingNav() {
  return (
    <header className="floating-nav">
      <a href="#hero" aria-label="YITO home">
        <Image
          src="/yito-logo-white-v2.png"
          alt="YITO visual logo"
          width={34}
          height={34}
        />
      </a>
      <nav>
        <HoverNavLink href="#about" en="ABOUT" zh="关于" />
        <HoverNavLink href="#services" en="SERVICES" zh="服务" />
        <HoverNavLink href="#work" en="WORK" zh="案例" />
        <HoverNavLink href="#workflow" en="PROCESS" zh="流程" />
        <HoverNavLink href="#contact" en="CONTACT" zh="联系" />
      </nav>
    </header>
  );
}

function HoverNavLink({
  href,
  en,
  zh,
}: {
  href: string;
  en: string;
  zh: string;
}) {
  return (
    <a href={href} className="hover-nav-link" aria-label={zh}>
      <span className="nav-en">{en}</span>
      <span className="nav-zh">{zh}</span>
    </a>
  );
}

function Chapter({
  id,
  no,
  title,
  subtitle,
  className = "",
  children,
}: {
  id?: string;
  no: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.72, ease: "easeOut" }}
      className={`chapter ${className}`}
    >
      <span className="chapter-no">{no}</span>
      {title ? (
        <div className="chapter-heading">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </motion.section>
  );
}

function CinematicVisual({ block }: { block: VisualBlock }) {
  return (
    <div
      className={`cinematic-visual ${block.image ? "has-image" : ""}`}
      style={visualStyle(block.image)}
    />
  );
}

function VisualSurface({
  block,
  className,
}: {
  block: VisualBlock;
  className: string;
}) {
  return (
    <div
      className={`${className} ${block.image ? "has-image" : ""}`}
      style={visualStyle(block.image)}
    />
  );
}

function visualStyle(image?: string): CSSProperties | undefined {
  return image
    ? {
        backgroundImage: `url("${image}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0a0c0a",
      }
    : undefined;
}
