import type { NextConfig } from "next";

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 服务器只有 2 核 1.6GB：图片压缩串行处理，防止并发把机器打满
    minimumCacheTTL: 2592000,
  },
  experimental: {
    imgOptConcurrency: 1,
  },
};

export default nextConfig;
