# Next.js로 옮기기

기존 사이트가 Next.js가 아닐 때만. **먼저 동의를 받는다.**
> 이 사이트는 같이 작업하기 좋은 형식(Next.js)이 아니라서 옮겨야 해요. 화면은 그대로 두려고 하지만 미세하게 달라질 수 있어요. 원본은 그대로 두고 복사본으로 작업할게요. 옮길까요?

목표: 화면을 최대한 그대로 유지하면서, **섹션마다 파일 하나**인 구조로 만든다. 이유: 파일이 화면 영역과 일치해야 겹침 알림과 충돌 처리가 정확해진다.

## 1. 새 프로젝트

```
npx create-next-app@latest <이름> --ts --app --eslint --no-src-dir --use-npm --yes
```
원본이 Tailwind를 쓰면 `--tailwind`를 붙이고 원본 설정(`tailwind.config.*`, 테마 확장)을 옮긴다.

## 2. 스택별 옮기는 법

### Vite / CRA (React)

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

### 순수 HTML

- `<head>` → `app/layout.tsx`, `<body>` 안 → `app/page.tsx`.
- HTML을 JSX로: `class` → `className`, `for` → `htmlFor`, `style="a:b"` → `style={{ a: 'b' }}`, 닫는 태그 없는 요소는 `<img />`처럼.
- `<script>`의 동작은 해당 섹션 컴포넌트(`'use client'`)의 이벤트·`useEffect`로 옮긴다.
- 여러 HTML 페이지는 `app/<경로>/page.tsx`로.
- 페이지마다 복사돼 있던 헤더·푸터는 `components/sections/Header.tsx`처럼 하나로 합쳐 `layout.tsx`에서 쓴다.

## 3. 섹션 나누기

`page.tsx`를 화면 영역 단위로 쪼갠다.
```
components/
  sections/   Hero.tsx  About.tsx  Works.tsx  Contact.tsx  Footer.tsx ...
  ui/         Button.tsx  Card.tsx ...   (여러 섹션이 같이 쓰는 것)
app/page.tsx  → 섹션을 순서대로 나열만 한다
```
섹션 이름은 사용자가 화면을 부를 법한 이름으로 짓는다.

## 4. 비교 확인

```
npm run build && npm run dev
```
원본도 띄워서 나란히 보여준다.
> 나란히 띄워둘게요. 원본 localhost:<원본 포트> · 옮긴 것 localhost:3000. 달라 보이는 곳 있으면 말해주세요.

사용자가 다른 곳을 짚으면 고친다. "똑같다"는 답을 받기 전에는 열기 모드의 다음 단계로 가지 않는다.
