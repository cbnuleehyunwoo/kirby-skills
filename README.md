# kirby-skills

Codex · Claude에서 쓰는 개인 스킬 모음. 각 폴더가 스킬 하나이고, 폴더 안 `SKILL.md`가 입구다.

| 스킬 | 설명 |
|---|---|
| [`site-collab`](site-collab/SKILL.md) | 비개발자 디자이너 여러 명이 각자 로컬 AI 세션에서 웹사이트 하나를 동시에 작업하는 협업 환경을 깔고 합류시킨다. Next.js + GitHub 비공개 레포 + GitHub Actions + Vercel 무료 플랜. |

## site-collab 시작하기 (개설자)

설치는 필요 없다. 터미널도 쓰지 않는다. 필요한 계정은 GitHub 하나뿐이다(Vercel은 진행 중에 GitHub로 가입한다).

1. **Codex에서 사이트 폴더 만들기**
   - 왼쪽 **프로젝트** 옆 **+** → **로컬 폴더 선택**
   - **Windows**: 창 맨 위 주소창에 `%USERPROFILE%` 입력 후 Enter → **새 폴더** `sites` 만들고 들어가기 → 다시 **새 폴더**를 사이트 이름(영어 소문자, 예: `my-portfolio`)으로 만들어 선택. 문서·바탕 화면은 OneDrive 동기화 문제로 쓰지 않는다.
   - **Mac**: Command+Shift+H(홈) → **새로운 폴더** `sites` → 그 안에 사이트 이름 폴더를 만들어 선택.
   - 자세한 안내: [`site-collab/guides/make-project-folder.md`](site-collab/guides/make-project-folder.md)
   - 왼쪽에 생긴 그 프로젝트에서 **새 채팅**을 연다.
   - Claude 앱을 쓰면 새 대화를 시작할 때 작업 폴더로 같은 폴더를 고른다.
2. 그 새 채팅에 아래 문장을 **그대로** 붙여넣는다.

```
https://github.com/cbnuleehyunwoo/kirby-skills 의 site-collab 스킬로 사이트 협업 공간을 열고 싶어.
1) 이 폴더 안에 _site-collab 폴더를 만들고 거기에 이 레포를 받아줘. git이 있으면 clone, 없으면 https://github.com/cbnuleehyunwoo/kirby-skills/archive/refs/heads/main.zip 을 받아 풀어줘. 이 폴더 밖에는 아무것도 쓰지 마.
2) _site-collab 안의 site-collab/SKILL.md 를 읽고, 그 스킬의 '열기' 모드대로 진행해줘.
3) 컴퓨터 전체 설정(git config --global 등)은 바꾸지 마.
```

진행 중 AI가 묻는 것에 답하고, 브라우저가 열리면 안내대로 버튼을 누르면 된다. 끝나면 같이 할 사람에게 보낼 **초대 메시지**를 만들어 준다.

## 합류하기 (같이 하는 사람)

개설자가 보낸 초대 메시지대로 하면 된다. 설치는 필요 없다. 사이트 레포를 받으면 스킬도 같이 받는다.

평소 작업 규칙은 사이트 레포의 `AGENTS.md`가 매 채팅 자동으로 켠다. 사이트 프로젝트에서 새 채팅을 열고 **"협업 확인"**이라고 하면 켜졌는지 알 수 있다.

## (선택) 개인 스킬 폴더에 설치

어느 폴더에서든 `$site-collab`(Codex) · `/site-collab`(Claude)으로 부르고 싶을 때만. Codex는 프로젝트 폴더 밖 쓰기를 정책으로 막을 수 있어서, 직접 터미널에서 실행해야 할 수 있다.

**Mac**
```sh
git clone https://github.com/cbnuleehyunwoo/kirby-skills ~/kirby-skills
mkdir -p ~/.agents/skills ~/.claude/skills
cp -R ~/kirby-skills/site-collab ~/.agents/skills/   # Codex
cp -R ~/kirby-skills/site-collab ~/.claude/skills/   # Claude
```

**Windows (PowerShell)**
```powershell
git clone https://github.com/cbnuleehyunwoo/kirby-skills "$HOME\kirby-skills"
New-Item -ItemType Directory -Force "$HOME\.agents\skills", "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse -Force "$HOME\kirby-skills\site-collab" "$HOME\.agents\skills\"   # Codex
Copy-Item -Recurse -Force "$HOME\kirby-skills\site-collab" "$HOME\.claude\skills\"   # Claude
```

이렇게 설치해도 열기는 사이트용 빈 폴더 프로젝트에서 시작해야 한다(위 1단계).

현재 보류: 외부 서비스(Supabase, Vercel Blob, API 키) 연결, 공통 디자인 규칙.
