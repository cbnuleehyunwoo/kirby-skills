#!/usr/bin/env node
// site-collab: 배포된 정적 사이트의 같은 호스트 파일을 참조를 따라가며 내려받는다.
// 받은 파일은 실행하지 않는다. 원본 코드를 찾지 못했을 때, 재구성하기 전에 쓴다.
//
// 사용: node fetch-static-site.mjs <페이지 URL> <저장 폴더(빈 폴더)>
// 결과: 저장 폴더에 파일, 그 옆에 fetch-report.txt (상태코드 · 경로 · 크기)
//
// 호스팅이 끼워 넣는 경로(/cdn-cgi/ 등)는 받지 않는다.

import { mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const [start, outArg] = process.argv.slice(2);
if (!start || !outArg) {
  console.error("usage: node fetch-static-site.mjs <page-url> <empty-out-dir>");
  process.exit(3);
}
const outDir = resolve(outArg);
if (existsSync(outDir) && readdirSync(outDir).length) {
  console.error(`out dir is not empty: ${outDir}`);
  process.exit(3);
}
mkdirSync(outDir, { recursive: true });

const origin = new URL(start).origin;
const SKIP = [/^\/cdn-cgi\//, /^\/_vercel\//, /^\/\.well-known\//];
const queue = [new URL(start).pathname, "/", "/index.html", "/llms.txt", "/robots.txt", "/sitemap.xml", "/favicon.ico", "/manifest.json"];
const seen = new Set();
const report = [];
const EXT = "js|mjs|css|json|png|jpe?g|gif|webp|svg|avif|ico|glb|gltf|bin|hdr|obj|mtl|ktx2|wasm|txt|xml|mp3|wav|ogg|mp4|webm|woff2?|ttf|otf|html";
const refRe = [
  /(?:src|href)\s*=\s*["']([^"'#]+)["']/gi,
  /\bfrom\s*["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  /\bimport\s*["']([^"']+)["']/g,
  /\bfetch\s*\(\s*["']([^"']+)["']/g,
  /new URL\(\s*["']([^"']+)["']/g,
  /url\(\s*["']?([^"')]+)["']?\s*\)/g,
  new RegExp(`["'\`]((?:\\.{0,2}/)?[\\w\\-./]+\\.(?:${EXT}))(?:\\?[^"'\`]*)?["'\`]`, "gi"),
];

while (queue.length && seen.size < 800) {
  const p = queue.shift();
  if (seen.has(p) || SKIP.some((re) => re.test(p))) continue;
  seen.add(p);
  let res;
  try {
    res = await fetch(origin + p, { headers: { "User-Agent": "Mozilla/5.0 site-collab" } });
  } catch (e) {
    report.push(`ERR ${p} ${e.message}`);
    continue;
  }
  if (!res.ok) { report.push(`${res.status} ${p}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get("content-type") || "";
  let file = p.endsWith("/") ? p + "index.html" : p;
  if (!/\.[a-z0-9]+$/i.test(file) && type.includes("text/html")) file += ".html";
  const dest = join(outDir, decodeURIComponent(file));
  if (!dest.startsWith(outDir)) { report.push(`SKIP ${p} (path escapes out dir)`); continue; }
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
  report.push(`200 ${p} -> ${file} (${buf.length}B, ${type.split(";")[0]})`);
  if (/text|javascript|json|svg|xml/.test(type)) {
    const text = buf.toString("utf8");
    for (const re of refRe) for (const m of text.matchAll(re)) {
      const ref = m[1].trim();
      if (!ref || /^(data:|blob:|mailto:|javascript:|#)/i.test(ref)) continue;
      let u;
      try { u = new URL(ref, origin + p); } catch { continue; }
      if (u.origin === origin && !seen.has(u.pathname)) queue.push(u.pathname);
    }
  }
}

writeFileSync(join(outDir, "..", "fetch-report.txt"), report.join("\n") + "\n");
console.log(report.join("\n"));
