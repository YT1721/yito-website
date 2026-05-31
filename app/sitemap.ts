import type { MetadataRoute } from "next";
import content from "../content/site.json";
import type { SiteContent } from "../lib/content-types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yito.visual";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteContent = content as SiteContent;
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...siteContent.caseStudies.map((work) => ({
      url: `${siteUrl}/works/${work.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
