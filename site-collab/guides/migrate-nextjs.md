# Next.js로 옮기기

기존 사이트가 Next.js가 아닐 때만. 설치된 Next.js 버전의 문서(`node_modules/next/dist/docs/`)를 먼저 읽는다. Next.js 16부터 설정·규칙이 학습 데이터와 다를 수 있다.

## 방법 고르기

| | A. 그대로 넣기 (기본) | B. React로 다시 짜기 |
|---|---|---|
| 맞는 경우 | 정적 HTML·바닐라 JS 사이트, 3D·캔버스 앱, 큰 단일 스크립트 | Vite·CRA 같은 React 사이트, 작은 순수 HTML 소개 사이트 |
| 방법 | 파일을 `public/`에 그대로 두고 주소만 연결 | 섹션별 컴포넌트로 새로 작성 |
| 화면 차이 | 없음 | 미세하게 생길 수 있음 |
| 작업량 | 몇 분 | 몇 시간 |
| 협업 | 기능이 한 파일에 몰려 있으면 겹침·충돌이 잦다 | 파일이 화면 영역과 맞아 겹침 알림이 정확하다 |

React 사이트는 B, 그 외는 A를 제안한다. 동의를 받는다.
> 이 사이트를 같이 작업할 수 있는 형식(Next.js)에 담을게요. <A: 파일은 그대로 두고 감싸기만 해서 화면은 똑같아요 / B: 화면을 영역별로 나눠 새로 짜서 미세하게 달라질 수 있어요>. 원본은 그대로 두고 복사본으로 작업할게요. 진행할까요?

A를 고른 뒤 나중에 "영역별로 나눠줘"라는 요청이 오면 그때 B로 옮긴다.

## A. 그대로 넣기

현재 폴더(사이트 루트, `modes/open.md` 0단계) 안 임시 폴더에 만들고 옮긴다.
```
npx create-next-app@latest _new --ts --app --eslint --no-tailwind --no-src-dir --use-npm --disable-git --yes
# Mac: rsync -a _new/ ./ && rm -rf _new   · Windows: Get-ChildItem _new -Force | Move-Item -Destination .; Remove-Item _new
rm app/page.tsx app/page.module.css public/*.svg          # Windows: Remove-Item
```
`package.json`의 `"name"`을 사이트 이름으로 바꾼다.
받은 사이트 파일을 전부 `public/`에 복사한다. 그다음 `next.config.ts`에 원래 주소를 연결한다(생성된 다른 설정은 그대로 둔다).
```ts
async rewrites() {
  return {
    beforeFiles: [
      { source: "/", destination: "/index.html" },
      { source: "/editor", destination: "/editor.html" },   // 원래 사이트의 주소마다 한 줄
    ],
  };
},
```
`beforeFiles`는 `public/` 파일보다 먼저 검사되므로 `/`도 정적 HTML로 보낼 수 있다. `app/layout.tsx`는 남겨둔다(404 페이지용).

확인: `npm run build`가 통과하고, `npm run dev`에서 원래 주소들이 모두 200이고 스크립트·이미지가 불러와지는지 본다. 그다음 아래 "비교 확인".

## B. React로 다시 짜기

목표: 화면을 최대한 그대로 유지하면서, **섹션마다 파일 하나**인 구조로 만든다. 이유: 파일이 화면 영역과 일치해야 겹침 알림과 충돌 처리가 정확해진다.

### B-1. 새 프로젝트

A와 같은 방식(현재 폴더 안 `_new`에 만들고 옮기기)으로, 옵션만 다르게:
```
npx create-next-app@latest _new --ts --app --eslint --no-src-dir --use-npm --disable-git --yes
```
원본이 Tailwind를 쓰면 `--tailwind`를 붙이고 원본 설정(`tailwind.config.*`, 테마 확장)을 옮긴다.

### B-2. 스택별 옮기는 법

#### Vite / CRA (React)

| 원본 | Next.js |
|---|---|
| `src/main.tsx`, `index.html`의 `<head>` | `app/layout.tsx` (메타·폰트는 `metadata`, `next/font`) |
| `App.tsx`의 최상위 화면 | `app/page.tsx` |
| react-router의 `<Route path="/about">` | `app/about/page.tsx` |
| `useState`·`useEffect`·이벤트 핸들러가 있는 컴포넌트 | 파일 맨 위 `'use client'` |
| `window`, `document`, `localStorage` 직접 접근 | `useEffect` 안으로 |
| `public/`, `src/assets/` 이미지 | `public/` (경로를 `/파일명`으로) |
| `import.meta.env.VITE_*`, `process.env.REACT_APP_*` | `process.env.NEXT_PUBLIC_*` |
| 전역 CSS | `app/globals.css`에서 import |
| CSS Modules | 그대로 (`*.module.css`) |

#### 순수 HTML

- `<head>` → `app/layout.tsx`, `<body>` 안 → `app/page.tsx`.
- HTML을 JSX로: `class` → `className`, `for` → `htmlFor`, `style="a:b"` → `style={{ a: 'b' }}`, 닫는 태그 없는 요소는 `<img />`처럼.
- `<script>`의 동작은 해당 섹션 컴포넌트(`'use client'`)의 이벤트·`useEffect`로 옮긴다.
- 여러 HTML 페이지는 `app/<경로>/page.tsx`로.
- 페이지마다 복사돼 있던 헤더·푸터는 `components/sections/Header.tsx`처럼 하나로 합쳐 `layout.tsx`에서 쓴다.

### B-3. 섹션 나누기

`page.tsx`를 화면 영역 단위로 쪼갠다.
```
components/
  sections/   Hero.tsx  About.tsx  Works.tsx  Contact.tsx  Footer.tsx ...
  ui/         Button.tsx  Card.tsx ...   (여러 섹션이 같이 쓰는 것)
app/page.tsx  → 섹션을 순서대로 나열만 한다
```
섹션 이름은 사용자가 화면을 부를 법한 이름으로 짓는다.

## 비교 확인 (A·B 공통)

```
npm run build && npm run dev
```
원본도 띄워서 나란히 보여준다.
> 나란히 띄워둘게요. 원본 localhost:<원본 포트> · 옮긴 것 localhost:3000. 달라 보이는 곳 있으면 말해주세요.

사용자가 다른 곳을 짚으면 고친다. "똑같다"는 답을 받기 전에는 열기 모드의 다음 단계로 가지 않는다.
