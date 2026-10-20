#!/usr/bin/env node
// site-collab: `vercel login`으로 저장된 CLI 로그인 정보를 써서
// GitHub Actions 배포용 Vercel 토큰을 새로 만든다.
//
// 사용: node mint-vercel-token.mjs <토큰 이름>
// 성공: 새 토큰 값만 stdout에 출력, 종료 코드 0
// 실패: 이유를 stderr에 출력, 종료 코드 1(로그인 정보 없음) / 2(API 거절) / 3(기타)
//
// 토큰 값은 stdout 외에는 어디에도 쓰지 않는다. 호출하는 쪽은 변수로 받아
// 곧바로 `gh secret set VERCEL_TOKEN`에 넘겨야 한다. 화면에 출력하지 않는다.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("usage: node mint-vercel-token.mjs <token-name>");
  process.exit(3);
}

// Vercel CLI가 로그인 정보를 두는 위치는 OS와 버전마다 다르다.
const home = homedir();
const roots = [
  join(home, "Library", "Application Support", "com.vercel.cli"),
  join(home, ".local", "share", "com.vercel.cli"),
  join(home, ".config", "com.vercel.cli"),
  process.env.APPDATA && join(process.env.APPDATA, "com.vercel.cli"),
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "com.vercel.cli"),
  process.env.XDG_DATA_HOME && join(process.env.XDG_DATA_HOME, "com.vercel.cli"),
].filter(Boolean);

function findAuthFile(dir, depth = 0) {
  if (!existsSync(dir) || depth > 3) return null;
  const direct = join(dir, "auth.json");
  if (existsSync(direct)) return direct;
  for (const entry of readdirSync(dir)) {
    const sub = join(dir, entry);
    if (statSync(sub).isDirectory()) {
      const hit = findAuthFile(sub, depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

const authFile = roots.map((r) => findAuthFile(r)).find(Boolean);
if (!authFile) {
  console.error("no Vercel CLI auth.json found. Run `npx vercel login` first.");
  process.exit(1);
}

let auth;
try {
  auth = JSON.parse(readFileSync(authFile, "utf8"));
} catch {
  console.error(`could not parse ${authFile}`);
  process.exit(1);
}
const cliToken = auth.token ?? auth.accessToken ?? auth.access_token;
if (!cliToken) {
  console.error(`no token field in ${authFile}. Run \`npx vercel login\` again.`);
  process.exit(1);
}

let res;
try {
  res = await fetch("https://api.vercel.com/v3/user/tokens", {
    method: "POST",
    headers: { Authorization: `Bearer ${cliToken}`, "Content-Type": "application/json" },
    // expiresAt을 생략하면 만료 없는 토큰이 된다 (null은 400으로 거절됨)
    body: JSON.stringify({ name }),
  });
} catch (err) {
  console.error(`network error: ${err.message}`);
  process.exit(3);
}

const body = await res.json().catch(() => ({}));
if (!res.ok || !body.bearerToken) {
  const msg = body?.error?.message ?? body?.error?.code ?? "";
  console.error(`Vercel API refused token creation: HTTP ${res.status} ${msg}`.trim());
  process.exit(2);
}

process.stdout.write(body.bearerToken);
