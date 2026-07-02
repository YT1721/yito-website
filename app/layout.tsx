import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { siteContent } from "../content/site";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yito-visual.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteContent.meta.title,
    template: "%s | YITO",
  },
  description: siteContent.meta.description,
  keywords: siteContent.meta.keywords,
  authors: [{ name: "YITO" }],
  creator: "YITO",
  publisher: "YITO",
  openGraph: {
    title: siteContent.meta.openGraph.title,
    description: siteContent.meta.openGraph.description,
    url: siteUrl,
    siteName: siteContent.meta.openGraph.siteName,
    locale: siteContent.meta.openGraph.locale,
    type: siteContent.meta.openGraph.type,
    images: [
      {
        url: siteContent.meta.openGraph.image,
        width: 1200,
        height: 630,
        alt: "YITO AI-Native Commercial Visual Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.meta.openGraph.title,
    description: siteContent.meta.openGraph.description,
    images: [siteContent.meta.openGraph.image],
  },
  icons: {
    icon: "/yito-logo-white-v2.png",
    apple: "/yito-logo-white-v2.png",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const footer = siteContent.footer;

  return (
    <html lang="zh-CN">
      <body>
        {children}
        <footer className="site-footer">
          <div className="footer-brand">
            <strong>{footer.brand}</strong>
            <span>{footer.subtitle}</span>
            <span>{footer.services}</span>
          </div>
          <div className="footer-meta">
            <span>{footer.copyright}</span>
            <span>{footer.credit}</span>
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
          </div>
        </footer>
      </body>
    </html>
  );
}
