#!/usr/bin/env node
// 同步某个 B 站 UP 主的全部投稿，标出官网里还没有的作品。
// 用法: node scripts/sync-bilibili-space.mjs 572542040
// 只读，不改线上内容。

import crypto from "node:crypto";
import { readFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const HEADERS = { "User-Agent": UA, Referer: "https://space.bilibili.com/" };
let COOKIE = "";

async function initCookie() {
  const res = await fetch("https://api.bilibili.com/x/frontend/finger/spi", {
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.data?.b_3) {
    COOKIE = `buvid3=${json.data.b_3}; buvid4=${json.data.b_4}`;
  }
}

function headers() {
  return COOKIE ? { ...HEADERS, Cookie: COOKIE } : HEADERS;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: headers() });
  const text = await res.text();
  if (text.trimStart().startsWith("<")) {
    throw new Error("B 站返回了验证页面（请求过于频繁），请稍后再试");
  }
  return JSON.parse(text);
}
const MIXIN_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52,
];

const mid = process.argv[2];
if (!mid) {
  console.error("用法: node scripts/sync-bilibili-space.mjs <B站UID>");
  process.exit(1);
}

async function getJson(url) {
  const json = await fetchJson(url);
  if (json.code !== 0) throw new Error(`${url} -> code=${json.code} ${json.message}`);
  return json.data;
}

async function wbiKeys() {
  const nav = await fetchJson("https://api.bilibili.com/x/web-interface/nav");
  const wbi = nav.data?.wbi_img;
  if (!wbi) throw new Error("未取到 WBI 签名密钥");
  const img = wbi.img_url.split("/").pop().split(".")[0];
  const sub = wbi.sub_url.split("/").pop().split(".")[0];
  const raw = img + sub;
  return MIXIN_TAB.map((i) => raw[i]).join("").slice(0, 32);
}

async function listVideosOld() {
  const all = [];
  let count = Infinity;
  for (let pn = 1; pn <= 30 && all.length < count; pn += 1) {
    const json = await fetchJson(
      `https://api.bilibili.com/x/space/arc/search?mid=${mid}&ps=10&pn=${pn}`,
    );
    if (json.code !== 0) throw new Error(`旧版投稿接口 code=${json.code} ${json.message}`);
    const list = json.data?.list?.vlist ?? [];
    all.push(...list);
    count = json.data?.page?.count ?? all.length;
    if (!list.length) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return all;
}

async function listVideos(mixin) {
  const all = [];
  let count = Infinity;
  for (let pn = 1; pn <= 30 && all.length < count; pn += 1) {
    const params = {
      mid,
      ps: 10,
      pn,
      order: "pubdate",
      wts: Math.floor(Date.now() / 1000),
    };
    const query = Object.keys(params)
      .sort()
      .map((k) => `${k}=${encodeURIComponent(String(params[k]).replace(/[!'()*]/g, ""))}`)
      .join("&");
    const w_rid = crypto.createHash("md5").update(query + mixin).digest("hex");

    let data = null;
    for (let attempt = 0; attempt < 3 && !data; attempt += 1) {
      const json = await fetchJson(
        `https://api.bilibili.com/x/space/wbi/arc/search?${query}&w_rid=${w_rid}`,
      );
      if (json.code === 0) {
        data = json.data;
      } else if (json.code === -352) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
      } else {
        throw new Error(`投稿列表接口 code=${json.code} ${json.message}`);
      }
    }
    if (!data) throw new Error("B 站风控拦截，请稍后重试");

    const list = data?.list?.vlist ?? [];
    all.push(...list);
    count = data?.page?.count ?? all.length;
    if (!list.length) break;
    await new Promise((resolve) => setTimeout(resolve, 600));
  }
  return all;
}

await initCookie();
const mixin = await wbiKeys().catch(() => "");
const videos = mixin ? await listVideos(mixin).catch(() => listVideosOld()) : await listVideosOld();

let site = { caseStudies: [] };
try {
  site = JSON.parse(readFileSync("content/site.json", "utf8"));
} catch {
  console.warn("未读到 content/site.json，按全部新作品处理");
}

const known = new Set();
for (const item of site.caseStudies ?? []) {
  const url = item.video?.url || item.videoUrl || "";
  const match = url.match(/BV[0-9A-Za-z]+/);
  if (match) known.add(match[0]);
}

const rows = videos.map((v) => ({
  BV: v.bvid,
  title: v.title,
  duration: `${Math.floor(v.length / 60)}m${v.length % 60}s`,
  created: new Date(v.created * 1000).toISOString().slice(0, 10),
  onSite: known.has(v.bvid) ? "已上线" : "未收录",
}));

console.table(rows);
const missing = videos.filter((v) => !known.has(v.bvid));
console.log(`\n共 ${videos.length} 个投稿，官网已收录 ${videos.length - missing.length} 个，待处理 ${missing.length} 个。`);
if (missing.length) {
  console.log("导入命令：");
  console.log(`node scripts/import-bilibili.mjs ${missing.map((v) => v.bvid).join(" ")}`);
}
