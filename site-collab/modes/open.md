# 열기 (개설자, 1회)

개설자가 협업 공간을 만든다. 끝나면 사이트 레포, 실제 사이트 URL, 초대 메시지가 생긴다. 단계마다 무엇을 했는지 한 줄로 알려준다.

준비물: GitHub 계정. 없으면 가입 페이지를 열어주고 기다린다. Vercel 계정은 6단계에서 GitHub로 가입한다.

## 0. 작업 폴더 = 사이트 폴더

개설자는 README의 시작 안내대로 **Codex(또는 Claude)에서 사이트용 빈 폴더로 프로젝트를 만들고**, 그 프로젝트의 새 채팅에서 시작한다. 시작 문장이 이 스킬을 그 폴더 안 `_site-collab/`에 받아 두었을 것이다. **현재 폴더가 곧 사이트 루트다.**

- 현재 폴더에 `_site-collab/`과 숨김 파일 말고 다른 것이 있거나, 개인 스킬 폴더에 설치된 스킬을 다른 폴더에서 호출했다면 안내한다:
  > 사이트를 만들 빈 폴더가 필요해요. Codex 왼쪽 **프로젝트** 옆 **+** → **로컬 폴더 선택** → 문서(Mac은 홈) 안 `sites` 폴더에 **새 폴더**(사이트 이름, 영어 소문자)를 만들어 선택하고, 그 프로젝트에서 **새 채팅**을 열어 시작 문장을 다시 붙여넣어 주세요.

  이유: Codex는 프로젝트 폴더 밖에 파일을 쓰는 명령을 막을 수 있다. 모든 작업을 이 폴더 안에서 끝낸다.
- 사이트 이름(= 레포 이름)은 이 폴더 이름을 쓴다. 영어 소문자·숫자·`-`가 아니면 묻는다: "사이트 이름을 영어로 정해주세요(레포 이름이 돼요)."

## 1. 출발점 확인

묻는다: "이미 만들어둔 사이트가 있어요, 아니면 새로 시작할까요?"

- **있다** → `guides/find-source.md`로 원본을 찾거나 받는다. Next.js가 아니면 `guides/migrate-nextjs.md`(방법 고르기부터, 동의 필요). Next.js면 원본을 **현재 폴더로** 복사해서 쓴다(`node_modules`, `.next`, `.git` 제외). 원본 폴더는 건드리지 않는다.
- **없다** → 현재 폴더 안 임시 폴더에 만든 뒤 내용을 현재 폴더로 옮긴다. 이유: create-next-app은 `_site-collab/`이 있는 폴더에 바로 만들기를 거부한다.
  ```
  npx create-next-app@latest _new --ts --app --tailwind --eslint --no-src-dir --use-npm --disable-git --yes
  ```
  Mac: `rsync -a _new/ ./ && rm -rf _new` · Windows: `Get-ChildItem _new -Force | Move-Item -Destination .; Remove-Item _new`
  그다음 `package.json`의 `"name"`을 사이트 이름으로 바꾼다.
  `--disable-git` 이유: create-next-app은 이 컴퓨터의 기본 Git 신원(개인 메일일 수 있음)으로 첫 커밋을 미리 만든다. 신원은 4단계에서 먼저 정하고 그다음 커밋한다.

새로 만드는 사이트와 React로 다시 짠 사이트는 화면을 섹션 단위 파일로 나눈다: `components/sections/Hero.tsx` 처럼. 공통 UI는 `components/ui/`. 이유: 파일 하나가 화면의 한 영역과 일치해야 겹침 알림이 정확해지고 충돌이 줄어든다. 정적 파일을 그대로 넣은 사이트는 나누지 않는다(`migrate-nextjs.md` A).

`npm run build`가 통과해야 다음으로 넘어간다.

## 2. 용도 확인

묻는다: "이 사이트는 개인 포트폴리오나 수익 없는 용도인가요? 무료로 운영하려면 그래야 해요."

- 아니라면(클라이언트·회사 사이트) → Vercel 무료 플랜은 비상업 용도만 허용한다는 점을 알리고, 그래도 진행할지 묻는다.

## 3. 도구 준비

`git --version`, `node -v`(18.18 이상), `gh --version`을 확인한다. 없으면 `guides/install.md`.

```
gh auth status
gh auth login --web --git-protocol https      # 로그인 안 돼 있으면
```
브라우저에 표시되는 코드를 사용자에게 그대로 보여준다. 브라우저를 열기 전에 알린다: "열린 GitHub 페이지 오른쪽 위 프로필이 본인 계정인지 확인해 주세요. 다르면 프로필 사진 → Switch account로 바꿔주세요."

`gh auth setup-git`은 실행하지 않는다. 이유: 이 컴퓨터의 모든 레포에 적용되는 전역 설정이다. 대신 4단계에서 이 레포에만 설정한다.

## 4. 커밋 신원 · GitHub 레포

**첫 커밋 전에** 이 레포에서만 쓸 신원을 정한다. 묻는다: "다른 분들께 보일 이름을 알려주세요(한글 가능)."
```
git init -b main                              # 이미 .git이 있고 원격이 없으면 생략
gh api user -q '.id,.login'                   # → <id>, <login>
git config user.name  "<이름>"
git config user.email "<id>+<login>@users.noreply.github.com"
git config site-collab.handle <login>
git config credential.helper ""
git config --add credential.helper "!gh auth git-credential"
```
- noreply 메일 이유: 레포 기록에 개인 메일이 남지 않는다.
- credential 두 줄 이유: 이 컴퓨터에 다른 GitHub 계정이 저장돼 있어도(Windows 자격 증명 관리자, Mac 키체인) 이 레포는 `gh`에 로그인한 계정으로만 올린다.
- `.git`이 이미 있는데 커밋 작성자가 다른 메일이고 원격이 없다면(예: create-next-app이 만든 첫 커밋), `.git`을 지우고 다시 `git init` 한다. 원격이 있으면 지우지 말고 사용자에게 상황을 설명한다.

첫 커밋 전에 `.gitignore`에 `_site-collab/`과 `_fetch/`를 추가한다(받아 둔 스킬 원본은 레포에 올리지 않는다. 7단계에서 정해진 위치에 사본을 넣는다).
```
git add -A && git commit -m "feat: 사이트 초기 구성"
gh repo create <사이트이름> --private --source . --push
```

## 5. 협업자 초대

묻는다: "같이 하실 분들의 GitHub 아이디를 알려주세요."
```
gh api -X PUT repos/<owner>/<repo>/collaborators/<아이디> -f permission=push
```
알린다: "초대를 보냈어요. 수락은 그분들의 AI가 합류할 때 도와드려요."

## 6. Vercel 연결

`guides/vercel-setup.md`를 따른다. 가입·로그인·프로젝트 연결·배포용 토큰·시크릿 등록까지 한 번에 끝난다.

배포는 Vercel의 Git 연동이 아니라 GitHub Actions가 개설자 토큰으로 한다. 이유: Hobby 플랜은 비공개 레포에서 소유자가 아닌 사람의 커밋 배포를 막는다.

## 7. 협업 파일 설치

`templates/`의 파일을 사이트 레포에 설치하고 `{{...}}` 자리를 채운다. 템플릿 이름에 `.template`이 붙은 이유: `AGENTS.md`·`CLAUDE.md` 이름 그대로 두면 이 폴더 안에서 작업하는 AI가 채워지지 않은 템플릿을 실제 규칙으로 읽는다.

| 템플릿 | 설치 위치 |
|---|---|
| `templates/AGENTS.template.md` | `AGENTS.md` (아래 규칙대로 합침) |
| `templates/CLAUDE.template.md` | `CLAUDE.md` (이미 있으면 첫 줄에 `@AGENTS.md`가 있는지만 확인) |
| `templates/claude-skill-pointer.md` | `.claude/skills/site-collab/SKILL.md` |
| `templates/deploy.yml` | `.github/workflows/deploy.yml` |
| `templates/vercel.json` | `vercel.json` (이미 있으면 `git.deploymentEnabled: false`만 병합) |
| `templates/gitattributes` | `.gitattributes` |

**`AGENTS.md` 합치기**: Next.js(16 이상)는 `<!-- BEGIN:nextjs-agent-rules -->` … `<!-- END:nextjs-agent-rules -->` 블록이 든 `AGENTS.md`를 만들고 `next dev` 때마다 다시 채운다. 이 블록은 그대로 두고 그 **아래에** 템플릿 내용을 붙인다. 덮어쓰면 블록이 계속 다시 생겨 변경으로 잡힌다.

자리 채우기:
- `{{SITE_NAME}}`: 사이트 이름
- `{{PROD_URL}}`: 8단계에서 채운다
- `{{STRUCTURE_RULE}}`: 섹션 구조면 "새 화면 영역은 `components/sections/`에 파일 하나로 만든다." 정적 파일 구조면 "이 사이트는 `public/`의 정적 파일(HTML·JS) 구조다. 새 기능은 기존 파일에 끼워 넣기보다 `public/`에 새 `.js` 파일로 만들고 HTML에서 불러온다."
- `{{SECTIONS}}`: **사용자가 화면에서 부를 이름 → 파일 → 요소** 대응표. 파일만 적지 말고, 한 파일에 여러 영역이 있으면 영역마다 선택자나 컴포넌트 이름까지 적는다. 예: `- 왼쪽 위 제목 → public/editor.html의 #stageTitle`. 이유: 1차 테스트에서 "왼쪽 위 제목"을 AI가 다른 요소(`.brand`)로 잘못 짚었다. 수정 금지 파일(엔진·외부 라이브러리)도 표시한다.

이 스킬 폴더 전체(이 `SKILL.md`가 있는 폴더, 보통 `_site-collab/site-collab/`)를 사이트 레포의 `.agents/skills/site-collab/`에 복사한다. 이유: 합류자는 스킬을 따로 설치하지 않고, 레포를 받으면 스킬도 같이 받는다. 복사가 확인되면 `_site-collab/`은 지운다.

복사가 정책으로 차단되면(Codex가 `.agents` 같은 경로 쓰기를 막는 경우) 우회하지 말고 차단 메시지를 그대로 사용자에게 보여주고 멈춘다. 이 경우는 스킬 쪽 수정이 필요하다.

`.gitignore` 확인: `.vercel`과 `.env*`(또는 `.env*.local`)가 있어야 한다. `vercel link`가 비밀값이 든 `.env.local`을 만든다. 커밋 전에 `git status --short`에 `.env`나 `.vercel/`이 없는지 본다.

## 8. 첫 배포 확인

```
git add -A && git commit -m "chore: 협업 환경 구성" && git push
gh run watch                       # deploy 워크플로 완료 대기
```
실패하면 `gh run view --log-failed`로 원인을 고친다(`procedures/recover.md`).

**실제 사이트 주소는 로그의 `Aliased` 줄 주소**다(예: `https://<이름>.vercel.app`). `Production` 줄의 주소(`<이름>-<해시>-<팀>.vercel.app`)는 배포 보호 때문에 방문자에게 Vercel 로그인 화면이 뜬다.
```
gh run view <run-id> --log | grep -E "Aliased"
```
`https://<Aliased 주소>/version.txt`가 방금 커밋 SHA인지 확인하고, 그 주소를 `AGENTS.md`의 `{{PROD_URL}}`에 채워 커밋(`docs: 실제 사이트 주소 기록`)·푸시한다.

알린다: "실제 사이트가 올라갔어요 → <주소>". 원하는 이름이 이미 쓰이고 있어서 주소 뒤에 다른 단어가 붙었으면, Vercel 프로젝트 설정의 Domains에서 바꿀 수 있다고 덧붙인다.

## 9. 초대 메시지와 고지

`templates/invite-message.md`를 채워 그대로 보여주고 "이 메시지를 같이 하실 분들께 보내주세요"라고 한다. 자리: `{{SITE_NAME}}`, `{{OWNER}}`(개설자 GitHub 아이디), `{{REPO}}`(레포 이름), `{{OWNER_NAME}}`(4단계에서 받은 개설자 이름), `{{PROD_URL}}`.

함께 고지한다:
- 이 사이트는 개설자 Vercel 계정에 연결돼 있어서, 개설자 계정이나 배포용 토큰(`site-collab-<레포이름>`)을 지우면 실제 사이트 반영이 멈춘다.
- 레포에 쓰기 권한이 있는 사람은 설정 파일을 고쳐 배포용 토큰을 쓸 수 있다. 토큰 범위는 `vercel-setup.md`에서 고른 범위다. 믿을 수 있는 사람만 초대한다.
- 개설자도 앞으로는 이 사이트 폴더를 Codex(또는 Claude)의 프로젝트로 열고 새 채팅에서 작업한다. 새 채팅에서 "협업 확인"이라고 하면 규칙이 켜졌는지 알 수 있다.
