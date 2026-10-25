import HomeClient from "./page-client";
import { readRuntimeSiteContent } from "../lib/runtime-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readRuntimeSiteContent();
  const hasPhone = Boolean(content.contact.phone);

  // 手机号不下发到前端，点击时才通过 /api/contact-phone 获取
  const safeContent = {
    ...content,
    contact: { ...content.contact, phone: "" },
  };

  return <HomeClient content={safeContent} hasPhone={hasPhone} />;
}
