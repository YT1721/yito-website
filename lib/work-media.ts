import type { CaseStudy } from "./content-types";

export type WorkMediaKind =
  | "bilibili"
  | "local-video"
  | "external-video"
  | "image";

export type WorkMediaInput = Pick<CaseStudy, "video" | "videoUrl">;

export type ResolvedWorkVideo = {
  kind: WorkMediaKind;
  embedUrl?: string;
  pageUrl?: string;
  directUrl?: string;
};

const LOCAL_VIDEO_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;
const BILIBILI_HOST = /(^|\.)bilibili\.com$|(^|\.)b23\.tv$/i;
const BV_PATTERN = /BV[a-zA-Z0-9]+/;

export function detectWorkMediaKind(work: WorkMediaInput): WorkMediaKind {
  const declaredType = work.video?.type;
  if (declaredType === "bilibili") return "bilibili";
  if (declaredType === "local") return "local-video";
  if (declaredType === "external") return "external-video";

  const url = work.video?.url || work.videoUrl || "";
  if (!url) return "image";
  if (LOCAL_VIDEO_EXT.test(url)) return "local-video";

  try {
    const host = new URL(url).hostname;
    if (BILIBILI_HOST.test(host)) return "bilibili";
  } catch {
    if (BILIBILI_HOST.test(url) || BV_PATTERN.test(url)) return "bilibili";
  }
  return "external-video";
}

export function extractBilibiliBvid(raw?: string | null): string | null {
  if (!raw) return null;
  const match = raw.match(BV_PATTERN);
  return match ? match[0] : null;
}

export function toBilibiliEmbedUrl(raw?: string | null): string | null {
  const bvid = extractBilibiliBvid(raw);
  if (!bvid) return null;
  return `https://player.bilibili.com/player.html?bvid=${bvid}&p=1&high_quality=1&danmaku=0&autoplay=0`;
}

export function toBilibiliPageUrl(raw?: string | null): string | null {
  const bvid = extractBilibiliBvid(raw);
  if (!bvid) return null;
  return `https://www.bilibili.com/video/${bvid}`;
}

export function workMediaLabel(kind: WorkMediaKind): string {
  switch (kind) {
    case "bilibili":
      return "B 站视频";
    case "local-video":
      return "本地视频";
    case "external-video":
      return "外链视频";
    default:
      return "图片作品";
  }
}

export function isVideoWork(work: WorkMediaInput): boolean {
  return detectWorkMediaKind(work) !== "image";
}

export function resolveWorkVideo(work: WorkMediaInput): ResolvedWorkVideo {
  const kind = detectWorkMediaKind(work);
  const rawUrl = work.video?.url || work.videoUrl || "";

  if (kind === "bilibili") {
    return {
      kind,
      embedUrl: work.video?.embedUrl || toBilibiliEmbedUrl(rawUrl) || undefined,
      pageUrl: toBilibiliPageUrl(rawUrl) || undefined,
    };
  }

  if (kind === "local-video") {
    return { kind, directUrl: rawUrl || undefined };
  }

  if (kind === "external-video") {
    return {
      kind,
      directUrl: LOCAL_VIDEO_EXT.test(rawUrl) ? rawUrl : undefined,
      pageUrl: rawUrl || undefined,
    };
  }

  return { kind };
}
