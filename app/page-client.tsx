"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Clapperboard,
  DraftingCompass,
  Film,
  Gauge,
  Image as ImageIcon,
  Layers3,
  Mail,
  MessageCircle,
  PenTool,
  ScanFace,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";
import type { SiteContentData } from "../content/site";
import type { IconName } from "../lib/content-types";
import type { WorkContent } from "../content/works";
import ImageWithFallback from "../components/ImageWithFallback";

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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const aiStudioIcons = [
  Sparkles,
  Clapperboard,
  ImageIcon,
  Video,
  ScanFace,
  PenTool,
  Layers3,
  Wand2,
];

export default function HomeClient({ content }: { content: SiteContentData }) {
  const featuredWorks = content.works
    .filter((work) => work.featured)
    .sort((a, b) => a.homepageOrder - b.homepageOrder)
    .slice(0, 6);

  return (
    <main className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: content.navigation.brand,
            description: content.hero.subtitle,
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://yito-visual.com",
            areaServed: "China",
            serviceType: content.services.items.map((service) => service.title),
            email: content.contact.email,
          }),
        }}
      />
      <FloatingNav content={content} />

      <Chapter id="hero" no={sectionNo(1)} className="hero-chapter">
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
          <motion.p variants={fadeUp} className="hero-positioning">
            {content.hero.positioning}
          </motion.p>
          <motion.p variants={fadeUp} className="hero-description">
            {content.hero.statement}
          </motion.p>
          <motion.p variants={fadeUp} className="hero-note">
            {content.hero.description}
          </motion.p>
          <motion.div variants={fadeUp} className="hero-tags">
            {content.hero.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="green-rule" />
          <motion.div variants={fadeUp} className="hero-actions">
            <a href="#work">{content.hero.primaryCta}</a>
            <a href="#contact">{content.hero.secondaryCta}</a>
          </motion.div>
        </motion.div>
        <CinematicVisual image={content.hero.cover} priority />
      </Chapter>

      <Chapter
        id="about"
        no={sectionNo(2)}
        title={content.about.title}
        subtitle={content.about.subtitle}
        className="about-chapter"
      >
        <div className="chapter-text">
          {content.about.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <div className="capability-row">
            {content.about.capabilities.map((item) => (
              <span key={item.title}>
                <Sparkles size={15} />
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            ))}
          </div>
          <p className="statement">{content.about.statement}</p>
        </div>
        <CinematicVisual image={content.about.cover} />
      </Chapter>

      <Chapter
        id="services"
        no={sectionNo(3)}
        title={content.services.title}
        subtitle={content.services.subtitle}
        className="services-chapter"
      >
        <div className="service-strip">
          {content.services.items.map((service) => {
            const Icon = iconMap[service.icon] ?? Sparkles;
            return (
              <motion.article
                key={service.id}
                whileHover={{ y: -7, scale: 1.012 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="service-card"
              >
                <VisualSurface image={service.cover} className="card-visual" />
                <div className="card-body">
                  <Icon size={18} />
                  <h3>{service.title}</h3>
                  <p>{service.subtitle}</p>
                  <p className="service-description">{service.description}</p>
                  <div className="service-scenes">
                    {service.scenes.map((scene) => (
                      <span key={scene}>{scene}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        <p className="micro-copy">{content.services.description}</p>
      </Chapter>

      <Chapter
        id="work"
        no={sectionNo(4)}
        title={content.selectedWorks.title}
        subtitle={content.selectedWorks.subtitle}
        className="works-chapter"
      >
        <div className="works-intro">
          <p>{content.selectedWorks.description}</p>
          <a href="#work" className="text-link">
            {content.selectedWorks.linkLabel} <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="selected-strip">
          {featuredWorks.map((work, index) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>
      </Chapter>

      <Chapter
        id="ai-studio"
        no={sectionNo(5)}
        title={content.aiStudio.title}
        subtitle={content.aiStudio.subtitle}
        className="ai-studio-chapter"
      >
        <div className="ai-studio-layout">
          <div className="ai-studio-copy">
            <div className="ai-studio-body">
              {content.aiStudio.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <strong>{content.aiStudio.statement}</strong>
          </div>
          <div className="ai-studio-panel">
            <VisualImage image={content.aiStudio.cover} />
            <div className="ai-capability-grid">
              {content.aiStudio.capabilities.map((item, index) => (
                <span key={item}>
                  <em>{sectionNo(index + 1)}</em>
                  {(() => {
                    const Icon = aiStudioIcons[index] ?? DraftingCompass;
                    return <Icon size={30} strokeWidth={1.4} />;
                  })()}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="workflow"
        no={sectionNo(6)}
        title={content.workflow.title}
        subtitle={content.workflow.subtitle}
        className="process-chapter"
      >
        <p className="section-intro">{content.workflow.description}</p>
        <div className="process-map">
          {content.workflow.steps.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="process-step"
            >
              <span className="process-dot">{sectionNo(index + 1)}</span>
              <strong>{item.title}</strong>
              <em>{item.subtitle}</em>
              <small>{item.description}</small>
            </motion.div>
          ))}
        </div>
      </Chapter>

      <Chapter
        no={sectionNo(7)}
        title={content.whyChoose.title}
        subtitle={content.whyChoose.subtitle}
        className="why-chapter"
      >
        <p className="section-intro">{content.whyChoose.description}</p>
        <div className="why-grid">
          {content.whyChoose.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <article key={item.id} className="why-card">
                <Icon size={20} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </Chapter>

      <Chapter
        no={sectionNo(8)}
        title={content.clients.title}
        subtitle={content.clients.subtitle}
        className="clients-chapter"
      >
        <p className="section-intro">{content.clients.description}</p>
        <div className="client-groups">
          {content.clients.groups.map((group) => (
            <article key={group.title} className="client-group">
              <p>{group.title}</p>
              <h3>{group.subtitle}</h3>
              <div>
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Chapter>

      <Chapter
        id="contact"
        no={sectionNo(9)}
        title={content.contact.title}
        subtitle={content.contact.subtitle}
        className="contact-chapter"
      >
        <div className="contact-list">
          <p>{content.contact.description}</p>
          <small>{content.contact.note}</small>
          <a href="#contact">
            <MessageCircle size={15} />
            {content.contact.wechat}
          </a>
          <a href={`mailto:${content.contact.email}`}>
            <Mail size={15} />
            {content.contact.email}
          </a>
          <a href="#work">
            <ArrowUpRight size={15} />
            {content.selectedWorks.linkLabel}
          </a>
          <span>{content.contact.xiaohongshu}</span>
          <span>{content.contact.location}</span>
        </div>
        <CinematicVisual image={content.contact.cover} />
      </Chapter>
    </main>
  );
}

function FloatingNav({ content }: { content: SiteContentData }) {
  return (
    <header className="floating-nav">
      <a href="#hero" aria-label={content.navigation.brand}>
        <Image
          src="/yito-logo-white-v2.png"
          alt="YITO visual logo"
          width={34}
          height={34}
        />
      </a>
      <nav>
        {content.navigation.items.map((item) => (
          <HoverNavLink
            key={item.href}
            href={item.href}
            en={item.label}
            zh={item.zhLabel}
          />
        ))}
        <a href={content.navigation.cta.href} className="nav-cta">
          {content.navigation.cta.label}
        </a>
      </nav>
    </header>
  );
}

function WorkCard({ work, index }: { work: WorkContent; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="selected-card"
    >
      <Link href={`/works/${work.slug}`} className="work-card-link">
        <VisualSurface image={work.cover} className="selected-visual" />
        <div className="selected-card-body">
          <span className="work-category">{work.category}</span>
          <h3>{work.title}</h3>
          <p className="work-subtitle">{work.subtitle}</p>
          <p className="work-description">{work.description}</p>
          <div className="work-tag-row">
            {work.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <span className="open-work-link">
          {sectionNo(work.homepageOrder)} <ArrowUpRight size={13} />
        </span>
      </Link>
    </motion.article>
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
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.68, ease: "easeOut" }}
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

function CinematicVisual({
  image,
  priority,
}: {
  image: string;
  priority?: boolean;
}) {
  return (
    <div className="cinematic-visual has-image">
      <VisualImage image={image} priority={priority} />
    </div>
  );
}

function VisualSurface({
  image,
  className,
}: {
  image: string;
  className: string;
}) {
  return (
    <div className={`${className} has-image`}>
      <VisualImage image={image} />
    </div>
  );
}

function VisualImage({
  image,
  priority,
}: {
  image: string;
  priority?: boolean;
}) {
  return (
    <ImageWithFallback
      src={image}
      alt=""
      className="visual-media"
      priority={priority}
      sizes="(max-width: 820px) 100vw, 50vw"
    />
  );
}

function sectionNo(value: number) {
  return String(value).padStart(2, "0");
}
