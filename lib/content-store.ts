import { readFile } from "fs/promises";
import path from "path";
import type { SiteContent } from "./content-types";

const contentPath = path.join(process.cwd(), "content", "site.json");

export async function readSiteContent(): Promise<SiteContent> {
  const file = await readFile(contentPath, "utf8");
  return JSON.parse(file) as SiteContent;
}

export function getUploadDirectory() {
  return (
    process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")
  );
}
