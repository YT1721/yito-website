#!/usr/bin/env node
// 从 B 站视频抽取关键帧，生成作品封面与精彩镜头。
// 用法: node scripts/fetch-bilibili-frames.mjs <BV号> <输出目录> [帧数]

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const REFERER = "https://www.bilibili.com/";

const [bvidArg, outDirArg, countArg] = process.argv.slice(2);
const bvid = bvidArg || "BV1ifP7z6Ez8";
const outDir = outDirArg || "public/images/works/ai-car";
const count = Math.max(1, Number(countArg || 4));

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: REFERER },
  });
  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(`${url} -> code=${json.code} ${json.message}`);
  }
  return json.data;
}

const view = await getJson(
  `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
);
const cid = view.cid;
const duration = Number(view.duration) || 60;
console.log(`标题: ${view.title}`);
console.log(`时长: ${duration}s, cid=${cid}`);

let stream = null;
for (const qn of [64, 32, 16]) {
  const play = await getJson(
    `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=${qn}&fnval=0&fourk=0`,
  );
  stream = play.durl?.[0]?.url;
  if (stream) break;
}
if (!stream) throw new Error("未取到可用视频流（可能需要登录态）");

const tmp = `/tmp/${bvid}.mp4`;
execFileSync(
  "curl",
  ["-sL", "-A", UA, "-e", REFERER, "-o", tmp, stream],
  { stdio: "inherit" },
);

mkdirSync(outDir, { recursive: true });

function grab(seconds, outFile) {
  execFileSync("ffmpeg", [
    "-y",
    "-ss",
    String(seconds),
    "-i",
    tmp,
    "-frames:v",
    "1",
    "-vf",
    "scale=1600:-2",
    "-q:v",
    "3",
    outFile,
  ]);
  console.log(`写出 ${outFile} @ ${seconds.toFixed(1)}s`);
}

grab(Math.max(1, Math.min(duration - 1, duration * 0.15)), path.join(outDir, "cover.jpg"));

for (let i = 0; i < count; i += 1) {
  const fraction = (i + 1) / (count + 1);
  const t = Math.max(1, Math.min(duration - 1, duration * fraction));
  grab(t, path.join(outDir, `shot-0${i + 1}.jpg`));
}

console.log("完成");
