import type { Metadata } from "next";
import { readSiteContent } from "../../../lib/content-store";
import WorkDetailClient from "./work-detail-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yito.visual";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteContent = await readSiteContent();
  const work = siteContent.caseStudies.find((item) => item.slug === slug);

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
    description: work.summary,
    keywords: [work.title, work.en, work.industry, ...work.tags],
    alternates: {
      canonical: `${siteUrl}/works/${work.slug}`,
    },
    openGraph: {
      title: `${work.title} | YITO`,
      description: work.summary,
      url: `${siteUrl}/works/${work.slug}`,
      siteName: "YITO",
      type: "article",
      locale: "zh_CN",
      images: [
        {
          url: work.image || "/yito-logo-white-v2.png",
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.title} | YITO`,
      description: work.summary,
      images: [work.image || "/yito-logo-white-v2.png"],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteContent = await readSiteContent();

  return <WorkDetailClient slug={slug} initialContent={siteContent} />;
}
