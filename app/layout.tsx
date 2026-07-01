import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yito.visual";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YITO | AI-Native Commercial Visual Studio",
    template: "%s | YITO",
  },
  description:
    "YITO 是一家 AI 原生商业视觉工作室，专注 AI 品牌广告片、企业宣传片、商业短片、电影级视觉与品牌内容创作。",
  keywords: [
    "YITO",
    "AI商业视觉",
    "AI广告片",
    "AI品牌宣传片",
    "AI企业宣传片",
    "AI视频制作",
    "AI短片",
    "商业视觉设计",
    "AI视觉工作室",
    "品牌视觉",
    "品牌广告片",
    "电影感视觉",
    "商业视觉工作室",
  ],
  authors: [{ name: "YITO" }],
  creator: "YITO",
  publisher: "YITO",
  openGraph: {
    title: "YITO | AI-Native Commercial Visual Studio",
    description:
      "结合 AI 生成技术、电影化视觉语言与商业品牌策略，为品牌提供高效率、高质感的新一代商业视觉内容解决方案。",
    url: siteUrl,
    siteName: "YITO",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/yito-logo-white-v2.png",
        width: 136,
        height: 128,
        alt: "YITO visual logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YITO | AI-Native Commercial Visual Studio",
    description: "用 AI 技术，为品牌低成本制作电影级商业视觉内容。",
    images: ["/yito-logo-white-v2.png"],
  },
  icons: {
    icon: "/yito-logo-white-v2.png",
    apple: "/yito-logo-white-v2.png",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <footer className="site-footer">
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=11010502061257"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              src="/beian-icon.png"
              alt=""
              width={18}
              height={20}
              aria-hidden="true"
            />
            <span>京公网安备11010502061257号</span>
          </a>
        </footer>
      </body>
    </html>
  );
}
