import HomeClient from "./page-client";
import { readRuntimeSiteContent } from "../lib/runtime-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readRuntimeSiteContent();

  return <HomeClient content={content} />;
}
