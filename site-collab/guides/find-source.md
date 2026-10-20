# 기존 사이트 원본 찾기

사용자는 "localhost:5173에 띄워놨어", "ChatGPT로 만든 거", "다른 창에서 작업했어", "이 주소에 올려놨어"처럼 단서만 준다. 단서에서 시작해 아래 순서로 찾고, 어디를 찾아봤는지 한 줄씩 알린다. 찾으면 경로와 함께 확인받는다: "이 폴더가 맞나요? <경로>"

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
  - Codex: `~/.codex/sessions/` 아래 세션 파일의 `cwd` 값
  - Claude: `~/.claude/projects/` 아래 폴더 이름 (작업 경로를 `-`로 이어 붙인 형태)
- 흔한 위치: 바탕화면, 문서, 다운로드, `~/Projects`, `~/dev`, `~/sites`, Windows는 `%USERPROFILE%\source\repos`.

후보 폴더는 `package.json`이나 `index.html`이 있는 곳으로 좁힌다.

## 3. 배포된 주소만 있을 때

1. 페이지를 받아 단서를 모은다: `<title>`, 눈에 띄는 문구, `generator` 메타 태그, 응답 헤더(`x-vercel-id` → Vercel, `server: Netlify` 등).
2. 그 고유 문구로 2의 후보 위치들을 검색한다.
   - Mac: `grep -rIl --exclude-dir=node_modules "<문구>" <위치>`
   - Windows: `Get-ChildItem <위치> -Recurse -File -Include *.html,*.tsx,*.jsx,*.ts,*.js -ErrorAction SilentlyContinue | Where-Object FullName -notmatch 'node_modules' | Select-String -SimpleMatch "<문구>" -List`
3. 배포처 계정에 연결된 Git 저장소가 있는지 사용자에게 묻는다("이 사이트 올릴 때 GitHub에 연결하셨어요?"). 있으면 clone한다.

## 4. 못 찾았을 때

검색한 위치를 알려주고 동의를 구한다.
> <위치들>에서 찾아봤는데 원본 파일이 없어요. 지금 사이트 화면을 보고 똑같이 다시 만들 수 있는데, 완전히 똑같지는 않을 수 있어요. 다시 만들까요?

동의하면 배포 주소의 HTML·CSS·이미지를 기준으로 Next.js 사이트를 새로 만든다(`migrate-nextjs.md`의 "순수 HTML" 경로). 결과를 원본 주소와 나란히 보여주고 다른 곳을 고친다.

## 찾은 뒤

- 원본 폴더는 수정하지 않는다. `~/sites/<이름>`(Windows `문서\sites\<이름>`)으로 복사해서 쓴다. `node_modules`, `.next`, `dist`는 복사하지 않는다.
- 스택 판별: `package.json`의 의존성에 `next`가 있으면 Next.js, `vite`면 Vite, `react-scripts`면 CRA, `package.json` 없이 `index.html`만 있으면 순수 HTML.
- Next.js가 아니면 `migrate-nextjs.md`(동의 필요).
