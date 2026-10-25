import { NextResponse } from "next/server";
import { readRuntimeSiteContent } from "../../../lib/runtime-content";

export const dynamic = "force-dynamic";

// 手机号不随页面下发，点击「显示」时才返回，避免被爬虫抓取
export async function GET() {
  const content = await readRuntimeSiteContent();
  const phone = content.contact.phone;

  if (!phone) {
    return NextResponse.json({ phone: null }, { status: 404 });
  }

  return NextResponse.json(
    { phone },
    { headers: { "Cache-Control": "no-store" } },
  );
}
