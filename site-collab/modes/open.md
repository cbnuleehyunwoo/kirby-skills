# 열기 (개설자, 1회)

개설자가 협업 공간을 만든다. 끝나면 사이트 레포, 실제 사이트 URL, 초대 메시지가 생긴다. 단계마다 무엇을 했는지 한 줄로 알려준다.

준비물: GitHub 계정, Vercel 계정(GitHub으로 가입). 없으면 가입 페이지를 열어주고 기다린다.

## 1. 출발점 확인

묻는다: "이미 만들어둔 사이트가 있어요, 아니면 새로 시작할까요?"

- **있다** → `guides/find-source.md`로 원본 폴더를 찾는다.
  - 찾은 사이트가 Next.js가 아니면 → 동의를 받고 `guides/migrate-nextjs.md`.
  - Next.js면 → 원본을 복사해 `~/sites/<사이트이름>`(Windows: `%USERPROFILE%\Documents\sites\<사이트이름>`)에 두고 그 복사본으로 진행한다. 원본 폴더는 건드리지 않는다.
- **없다** → 새로 만든다.
  ```
  npx create-next-app@latest <사이트이름> --ts --app --tailwind --eslint --no-src-dir --use-npm --yes
  ```
  위치는 위와 같은 `sites` 폴더.

어느 경우든 화면을 섹션 단위 파일로 나눈다: `components/sections/Hero.tsx`, `components/sections/About.tsx` 처럼. 공통 UI는 `components/ui/`. 이유: 파일 하나가 화면의 한 영역과 일치해야 겹침 알림이 정확해지고 충돌이 줄어든다.

`npm run build`가 통과해야 다음으로 넘어간다.

## 2. 용도 확인

묻는다: "이 사이트는 개인 포트폴리오나 수익 없는 용도인가요? 무료로 운영하려면 그래야 해요."

- 아니라면(클라이언트·회사 사이트) → Vercel 무료 플랜은 비상업 용도만 허용한다는 점을 알리고, 그래도 진행할지 묻는다.

## 3. 도구 준비

`git --version`, `node -v`(18.18 이상), `gh --version`을 확인한다. 없으면 `guides/install.md`.

```
gh auth login --web --git-protocol https
gh auth setup-git
```
브라우저에 표시되는 코드를 사용자에게 그대로 보여준다.

## 4. GitHub 레포 만들기

```
git init -b main            # 이미 git이면 생략
git add -A && git commit -m "feat: 사이트 초기 구성"
gh repo create <사이트이름> --private --source . --push
```
개인 메일이 기록에 남지 않게 커밋 신원을 noreply로 설정한다:
```
gh api user -q '.id,.login'   # → <id>, <login>
git config user.email "<id>+<login>@users.noreply.github.com"
git config site-collab.handle <login>
```

## 5. 협업자 초대

묻는다: "같이 하실 분들의 GitHub 아이디를 알려주세요."
```
gh api -X PUT repos/<owner>/<repo>/collaborators/<아이디> -f permission=push
```
초대가 메일로 간다고 알린다.

## 6. Vercel 연결

```
npx vercel login
npx vercel link --yes
```
- Vercel 대시보드에서 이 프로젝트에 Git 저장소를 **연결하지 않는다**. 이유: Hobby 플랜은 비공개 레포에서 소유자가 아닌 사람의 커밋 배포를 막는다. 배포는 GitHub Actions가 개설자 토큰으로 한다.
- 토큰: `https://vercel.com/account/tokens`를 열고 안내한다. "Create Token을 눌러 이름은 아무거나, 범위는 이 계정으로 만든 뒤 나온 값을 여기에 붙여넣어 주세요. 계정 열쇠라서 다른 사람에게 보여주지 마세요."

시크릿 등록 (`.vercel/project.json`에서 값을 읽는다):
```
gh secret set VERCEL_TOKEN          # 붙여넣은 토큰 (stdin)
gh secret set VERCEL_ORG_ID      --body "<orgId>"
gh secret set VERCEL_PROJECT_ID  --body "<projectId>"
gh secret set DEPLOY_NAME        --body "<개설자 GitHub login>"
gh secret set DEPLOY_EMAIL       --body "<개설자 noreply 메일>"
```
`DEPLOY_*`는 배포 직전 커밋 작성자를 개설자로 덮어쓰는 데 쓴다. Vercel 계정에 연결된 GitHub 계정과 같아야 한다.

## 7. 협업 파일 설치

`templates/`의 파일을 사이트 레포에 복사하고 `{{...}}` 자리를 채운다. 템플릿 이름에 `.template`이 붙은 이유: `AGENTS.md`·`CLAUDE.md`라는 이름 그대로 두면 이 폴더 안에서 작업하는 AI가 채워지지 않은 템플릿을 실제 규칙으로 읽는다.

| 템플릿 | 설치 위치 |
|---|---|
| `templates/AGENTS.template.md` | `AGENTS.md` |
| `templates/CLAUDE.template.md` | `CLAUDE.md` |
| `templates/claude-skill-pointer.md` | `.claude/skills/site-collab/SKILL.md` |
| `templates/deploy.yml` | `.github/workflows/deploy.yml` |
| `templates/vercel.json` | `vercel.json` (이미 있으면 `git.deploymentEnabled: false`만 병합) |
| `templates/gitattributes` | `.gitattributes` |

그리고 **이 스킬 폴더 전체**(이 `SKILL.md`가 있는 폴더)를 사이트 레포의 `.agents/skills/site-collab/`에 복사한다. 이유: 합류자는 스킬을 따로 설치하지 않고, 레포를 받으면 스킬도 같이 받는다.

`.gitignore`에 다음이 없으면 추가: `.vercel`, `.env*.local`.

`AGENTS.md`의 `{{SECTIONS}}`에는 `components/sections/*` 파일과 화면 이름의 대응표를 적는다 (예: `Hero.tsx` → 히어로 섹션).

## 8. 첫 배포 확인

```
git add -A && git commit -m "chore: 협업 환경 구성" && git push
gh run watch                       # deploy 워크플로 완료 대기
```
실패하면 `gh run view --log-failed`로 원인을 고친다(`procedures/recover.md`). 성공하면 production URL을 확인한다(`npx vercel ls --prod` 또는 대시보드). `https://<URL>/version.txt`가 방금 커밋 SHA인지 확인하고, 그 URL을 `AGENTS.md`의 `{{PROD_URL}}`에 채워 다시 커밋·푸시한다.

알린다: "실제 사이트가 올라갔어요 → <URL>"

## 9. 초대 메시지와 고지

`templates/invite-message.md`를 채워 그대로 보여주고 "이 메시지를 같이 하실 분들께 보내주세요"라고 한다.

함께 고지한다:
- 이 사이트는 개설자 계정에 연결돼 있어서, 개설자 계정을 지우거나 토큰을 지우면 실제 사이트 반영이 멈춘다.
- 레포에 쓰기 권한이 있는 사람은 설정 파일을 고쳐 개설자 토큰을 쓸 수 있다. 믿을 수 있는 사람만 초대한다.
- 개설자도 앞으로는 이 사이트 폴더를 연 상태로 AI와 대화하면 된다. 평소 작업 규칙은 `AGENTS.md`가 자동으로 켠다.
