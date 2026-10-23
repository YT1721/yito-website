#!/usr/bin/env node
// 批量导入 B 站作品：抽取元信息 + 关键帧，生成待审草稿。
// 不会改动线上内容，草稿写入 content/imports/，等你确认后再合并发布。
// 用法: node scripts/import-bilibili.mjs BV1xx411c7mD [BV..] [--slug=自定义-slug]

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const REFERER = "https://www.bilibili.com/";

const args = process.argv.slice(2);
const slugArg = args.find((item) => item.startsWith("--slug="));
const forcedSlug = slugArg ? slugArg.split("=")[1] : "";
const bvids = args.filter((item) => /^BV[0-9A-Za-z]+$/.test(item));

if (!bvids.length) {
  console.error("用法: node scripts/import-bilibili.mjs BV1xx411c7mD [BV..]");
  process.exit(1);
}

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: REFERER },
  });
  const json = await res.json();
  if (json.code !== 0) throw new Error(`${url} -> code=${json.code} ${json.message}`);
  return json.data;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

mkdirSync("content/imports", { recursive: true });
const rows = [];

for (const bvid of bvids) {
  const view = await getJson(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
  const slug = forcedSlug || `bili-${bvid.toLowerCase()}`;
  const frameDir = path.join("public/images/works/imports", slug);
  const frameUrl = `/images/works/imports/${slug}`;

  execFileSync(
    process.execPath,
    ["scripts/fetch-bilibili-frames.mjs", bvid, frameDir, "4"],
    { stdio: "inherit" },
  );

  const draft = {
    no: "",
    slug,
    title: view.title,
    en: "",
    group: "AI Visual Direction",
    category: "品牌广告片",
    industry: "",
    year: String(new Date(view.pubdate * 1000).getFullYear()),
    summary: "",
    description: "",
    tags: [],
    meta: [view.tname],
    cover: `${frameUrl}/cover.jpg`,
    image: `${frameUrl}/cover.jpg`,
    images: [1, 2, 3, 4].map((i) => `${frameUrl}/shot-0${i}.jpg`),
    thumbs: [1, 2, 3, 4].map((i) => ({
      title: `精彩镜头 ${i}`,
      image: `${frameUrl}/shot-0${i}.jpg`,
      alt: view.title,
    })),
    video: {
      type: "bilibili",
      url: `https://www.bilibili.com/video/${bvid}/`,
      title: view.title,
      embedUrl: "",
    },
    featured: false,
    homepageOrder: 99,
    _source: {
      bvid,
      duration: view.duration,
      owner: view.owner?.name,
      partition: view.tname,
      desc: view.desc,
      url: `https://www.bilibili.com/video/${bvid}/`,
    },
  };

  const out = path.join("content/imports", `${bvid}.json`);
  writeFileSync(out, `${JSON.stringify(draft, null, 2)}\n`);
  rows.push({
    BV: bvid,
    title: view.title,
    duration: `${view.duration}s`,
    partition: view.tname,
    slug,
    draft: out,
  });
}

console.table(rows);
console.log("\n草稿待补全字段: en / industry / summary / description / tags / no");
