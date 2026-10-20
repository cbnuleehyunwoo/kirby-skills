# 기존 사이트 원본 찾기

사용자는 "localhost:5173에 띄워놨어", "ChatGPT로 만든 거", "다른 창에서 작업했어", "이 주소에 올려놨어"처럼 단서만 준다. 단서에서 시작해 아래 순서로 찾고, 어디를 찾아봤는지 한 줄씩 알린다. 찾으면 경로와 함께 확인받는다: "이 폴더가 맞나요? <경로>"

배포 주소만 받았으면 먼저 묻는다: "이 사이트는 직접 만드신 거 맞죠?" 남이 만든 사이트를 받아 다시 올리면 문제가 될 수 있다.

## 1. localhost 주소

포트를 쓰는 프로세스의 작업 폴더를 찾는다.

**Mac**
```
lsof -nP -iTCP:<포트> -sTCP:LISTEN          # → PID
lsof -a -p <PID> -d cwd -Fn                 # → n<작업 폴더>
```

**Windows**
```
Get-NetTCPConnection -LocalPort <포트> -State Listen | Select-Object -ExpandProperty OwningProcess
(Get-CimInstance Win32_Process -Filter "ProcessId=<PID>").CommandLine
```
Windows는 작업 폴더를 바로 주지 않는다. 명령줄에 들어 있는 `...\<프로젝트>\node_modules\...` 경로에서 `node_modules` 앞까지가 프로젝트 폴더다.

서버가 꺼져 있다고 하면 2로 간다.

## 2. 다른 세션 · 워크트리

- 사용자가 경로나 프로젝트 이름을 말했으면 그 위치부터.
- Git 워크트리: 후보 레포에서 `git worktree list`.
- AI 세션 기록에서 작업 폴더만 읽는다(대화 내용은 읽지 않는다).
  - Codex: `~/.codex/sessions/` 아래 세션 파일의 `cwd` 값 (URL 인코딩된 경로는 디코딩)
  - Claude: `~/.claude/projects/` 아래 폴더 이름. 작업 경로의 `/`와 영문 외 문자를 `-`로 바꾼 형태라 **한글 경로는 복원할 수 없다.** 영문 경로일 때만 쓴다.
- 흔한 위치: 바탕화면, 문서, 다운로드, `~/Projects`, `~/dev`, `~/sites`, Windows는 `%USERPROFILE%\source\repos`.

후보 폴더는 `package.json`이나 `index.html`이 있는 곳으로 좁힌다.

## 3. 배포된 주소만 있을 때

1. 페이지를 받아 단서를 모은다: `<title>`, 눈에 띄는 문구, `generator` 메타 태그, 불러오는 스크립트 파일 이름, 응답 헤더(`x-vercel-id` → Vercel, `server: Netlify` 등).
2. 그 고유 문구·파일 이름으로 2의 후보 위치들을 검색한다.
   - Mac: `grep -rIl --exclude-dir=node_modules --exclude-dir=.git -e "<문구>" <위치>`
   - Windows: `Get-ChildItem <위치> -Recurse -File -Include *.html,*.tsx,*.jsx,*.ts,*.js -ErrorAction SilentlyContinue | Where-Object FullName -notmatch 'node_modules' | Select-String -SimpleMatch "<문구>" -List`
3. 배포처 계정에 연결된 Git 저장소가 있는지 묻는다("이 사이트 올릴 때 GitHub에 연결하셨어요?"). 있으면 clone한다.

**ChatGPT가 호스팅한 사이트**(`*.chatgpt.site`, `server: cloudflare`): 원본은 ChatGPT 안에 있고 이 컴퓨터에는 보통 없다. 먼저 묻는다: "ChatGPT에서 이 사이트 코드를 내려받을 수 있으면 받아서 알려주세요." 못 받으면 4로 간다.

## 4. 배포된 파일 그대로 받기 (재구성보다 먼저)

페이지가 압축·번들되지 않은 파일을 그대로 불러오면(HTML이 `studio.js`, `app.css`처럼 읽을 수 있는 파일을 직접 참조, 파일 안이 사람이 쓴 코드 그대로), **배포된 파일이 곧 원본**이다. 재구성 없이 받는다.

```
node <스킬 폴더>/scripts/fetch-static-site.mjs <페이지 URL> <빈 임시 폴더>/files
```
- 받는 폴더는 비어 있는 새 폴더여야 하고, 받은 파일은 실행하지 않는다.
- `fetch-report.txt`에서 404인 경로는 대개 사이트가 사용자에게 만들어주는 내보내기 파일 이름이다. 코드에서 그 이름이 어디에 쓰이는지 보고, 필수 파일이 빠졌는지만 확인한다.
- 받은 파일 안에 플랫폼 전용 기능 의존이 있는지 본다(`window.openai`, 특정 호스트로의 `fetch`, `postMessage`). 있으면 다른 곳에 올렸을 때 그 기능은 동작하지 않는다고 알린다.

정리:
- **호스팅이 끼워 넣은 코드 제거**: Cloudflare의 `__CF$cv$params` 스크립트 블록, `/cdn-cgi/` 참조 등. 다른 곳에서는 오류만 낸다.
- **같은 내용의 HTML 정리**: 예를 들어 `/`와 `/editor`가 주입 코드만 다르고 같은 파일이면 하나만 남기고 두 주소를 그 파일로 연결한다. 이유: 디자이너가 한쪽만 고쳐 두 주소가 서로 달라진다.

받은 결과를 로컬 정적 서버로 띄워 원본 주소와 나란히 보여주고 확인받는다.
```
python3 -m http.server 5500 --bind 127.0.0.1      # 받은 폴더에서. Windows는 python
```
> 원본 <주소> · 받은 것 localhost:5500/<경로>. 달라 보이는 곳 있으면 말해주세요.

## 5. 그래도 안 될 때 (번들된 사이트 등)

검색한 위치를 알려주고 동의를 구한다.
> <위치들>에서 찾아봤는데 원본 파일이 없어요. 지금 사이트 화면을 보고 똑같이 다시 만들 수 있는데, 완전히 똑같지는 않을 수 있어요. 다시 만들까요?

동의하면 배포 주소의 HTML·CSS·이미지를 기준으로 Next.js 사이트를 새로 만든다(`migrate-nextjs.md` B의 "순수 HTML" 경로). 결과를 원본 주소와 나란히 보여주고 다른 곳을 고친다.

## 찾은 뒤

- 원본 폴더는 수정하지 않는다. `sites` 폴더(`modes/open.md` 1단계)로 복사해서 쓴다. `node_modules`, `.next`, `dist`는 복사하지 않는다.
- 스택 판별: `package.json`에 `next`가 있으면 Next.js, `vite`면 Vite, `react-scripts`면 CRA, `package.json` 없이 HTML·JS만 있으면 정적 사이트.
- Next.js가 아니면 `migrate-nextjs.md`.
