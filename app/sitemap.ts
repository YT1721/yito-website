import type { MetadataRoute } from "next";
import { readRuntimeWorks } from "../lib/runtime-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yito-visual.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const works = await readRuntimeWorks();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/works`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...works.map((work) => ({
      url: `${siteUrl}/works/${work.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: work.featured ? 0.85 : 0.7,
    })),
  ];
}
