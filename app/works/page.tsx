import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { siteContent } from "../../content/site";
import type { WorkContent, WorkGroup } from "../../content/works";
import { workGroups, worksPageContent } from "../../content/works";
import ImageWithFallback from "../../components/ImageWithFallback";
import { readRuntimeWorks } from "../../lib/runtime-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${worksPageContent.title} / ${worksPageContent.subtitle}`,
  description: worksPageContent.description,
  openGraph: {
    title: `${worksPageContent.title} / ${worksPageContent.subtitle} | YITO`,
    description: worksPageContent.description,
    siteName: siteContent.meta.openGraph.siteName,
    locale: siteContent.meta.openGraph.locale,
    type: "website",
  },
};

export default async function WorksPage() {
  const orderedWorks = (await readRuntimeWorks()).sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.homepageOrder - b.homepageOrder;
  });

  return (
    <main className="works-page-shell">
      <header className="works-page-nav">
        <Link href="/" aria-label="返回首页">
          <ArrowLeft size={16} />
          YITO
        </Link>
        <Link href="/#contact">
          联系合作 <ArrowUpRight size={15} />
        </Link>
      </header>

      <section className="works-page-hero">
        <span>{worksPageContent.title}</span>
        <h1>
          {worksPageContent.title} / {worksPageContent.subtitle}
        </h1>
        <p>{worksPageContent.description}</p>
      </section>

      <section className="works-page-content" aria-label="精选案例列表">
        {workGroups.map((group) => {
          const items = getWorksByGroup(orderedWorks, group.id);
          if (!items.length) return null;

          return (
            <section className="works-group" key={group.id}>
              <div className="works-group-heading">
                <span>{group.title}</span>
                <h2>{group.subtitle}</h2>
              </div>
              <div className="works-list-grid">
                {items.map((work) => (
                  <WorkListCard key={work.slug} work={work} />
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}

function getWorksByGroup(works: WorkContent[], group: WorkGroup) {
  return works.filter((work) => work.group === group);
}

function WorkListCard({ work }: { work: WorkContent }) {
  return (
    <Link href={`/works/${work.slug}`} className="works-list-card">
      <div className="works-list-media">
        <span>{work.category}</span>
        <ImageWithFallback
          src={work.cover}
          alt={work.title}
          className="works-list-image"
          sizes="(max-width: 1120px) 100vw, 38vw"
        />
      </div>
      <div className="works-list-body">
        <div>
          <span className="works-list-index">
            {String(work.homepageOrder).padStart(2, "0")}
          </span>
          <span className="works-list-category">{work.category}</span>
        </div>
        <h3>{work.title}</h3>
        <p className="works-list-subtitle">{work.subtitle}</p>
        <p className="works-list-description">{work.description}</p>
        <div className="works-list-tags">
          {work.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
