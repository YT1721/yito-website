import HomeClient from "./page-client";
import { readSiteContent } from "../lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readSiteContent();

  return <HomeClient initialContent={content} />;
}
