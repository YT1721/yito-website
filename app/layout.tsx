import type { Metadata } from "next";
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
    "YITO 是一家 AI 原生商业视觉工作室，用 AI 技术、电影级视觉语言与品牌策略，为企业制作高质感商业视觉内容。",
  keywords: [
    "YITO",
    "AI商业视觉",
    "AI广告片",
    "AI短片",
    "品牌视觉",
    "商业视觉工作室",
  ],
  authors: [{ name: "YITO" }],
  creator: "YITO",
  publisher: "YITO",
  openGraph: {
    title: "YITO | AI-Native Commercial Visual Studio",
    description: "用 AI 技术，为品牌低成本制作电影级商业视觉内容。",
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
      <body>{children}</body>
    </html>
  );
}
