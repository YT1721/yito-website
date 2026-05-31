import { NextResponse } from "next/server";
import { copyFile, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import type { SiteContent } from "../../../lib/content-types";

const contentPath = path.join(process.cwd(), "content", "site.json");
const backupPath = path.join(process.cwd(), "content", "site.backup.json");
const tempPath = path.join(process.cwd(), "content", "site.tmp.json");

export async function GET() {
  const file = await readFile(contentPath, "utf8");
  return NextResponse.json(JSON.parse(file));
}

export async function POST(request: Request) {
  const content = (await request.json()) as SiteContent;

  const validationError = validateContent(content);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  await copyFile(contentPath, backupPath).catch(() => undefined);
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);

  return NextResponse.json({
    ok: true,
    updatedAt: new Date().toISOString(),
  });
}

function validateContent(content: SiteContent) {
  if (!content.hero?.title) return "Hero title is required";
  if (!content.contact?.email) return "Contact email is required";
  if (!Array.isArray(content.caseStudies))
    return "Case studies must be an array";

  const slugs = new Set<string>();

  for (const work of content.caseStudies) {
    if (!work.slug) return "Every case study requires a slug";
    if (slugs.has(work.slug)) return `Duplicate case study slug: ${work.slug}`;
    slugs.add(work.slug);
  }

  return "";
}
