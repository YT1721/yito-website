#!/usr/bin/env node
// 把 content/imports 里审好的草稿合并进 content/site.json。
// 已存在同 BV 的案例会跳过，可重复执行。
// 用法: node scripts/merge-imports.mjs

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sitePath = "content/site.json";
const site = JSON.parse(readFileSync(sitePath, "utf8"));

const known = new Set();
for (const item of site.caseStudies ?? []) {
  const match = (item.video?.url || item.videoUrl || "").match(/BV[0-9A-Za-z]+/);
  if (match) known.add(match[0]);
}

const dir = "content/imports";
const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
let nextNo = (site.caseStudies?.length ?? 0) + 1;
let nextOrder = Math.max(0, ...(site.caseStudies ?? []).map((c) => Number(c.homepageOrder) || 0)) + 1;
const added = [];

for (const file of files) {
  const draft = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  const bvid = draft._source?.bvid;
  if (!bvid || known.has(bvid)) {
    console.log(`跳过 ${file}（已收录或缺少 BV）`);
    continue;
  }
  if (!draft.summary || !draft.en) {
    console.log(`跳过 ${file}（文案未完成）`);
    continue;
  }

  const no = String(nextNo).padStart(2, "0");
  nextNo += 1;
  const { _source, ...rest } = draft;
  site.caseStudies.push({
    ...rest,
    no,
    homepageOrder: nextOrder,
    featured: false,
  });
  nextOrder += 1;
  known.add(bvid);
  added.push(`${no} ${draft.title}`);
}

writeFileSync(sitePath, `${JSON.stringify(site, null, 2)}\n`);
console.log(added.length ? `已合并:\n${added.join("\n")}` : "没有新增内容");
console.log(`当前案例总数: ${site.caseStudies.length}`);
