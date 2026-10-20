# kirby-skills

Codex · Claude에서 쓰는 개인 스킬 모음. 각 폴더가 스킬 하나이고, 폴더 안 `SKILL.md`가 입구다.

| 스킬 | 설명 |
|---|---|
| [`site-collab`](site-collab/SKILL.md) | 비개발자 디자이너 여러 명이 각자 로컬 AI 세션에서 웹사이트 하나를 동시에 작업하는 협업 환경을 깔고 합류시킨다. Next.js + GitHub 비공개 레포 + GitHub Actions + Vercel 무료 플랜. |

## 설치

스킬을 쓰는 도구의 개인 스킬 폴더에 복사한다.

**Mac**
```sh
git clone https://github.com/cbnuLeehyunwoo/kirby-skills ~/kirby-skills
mkdir -p ~/.agents/skills ~/.claude/skills
cp -R ~/kirby-skills/site-collab ~/.agents/skills/   # Codex
cp -R ~/kirby-skills/site-collab ~/.claude/skills/   # Claude
```

**Windows (PowerShell)**
```powershell
git clone https://github.com/cbnuLeehyunwoo/kirby-skills "$HOME\kirby-skills"
New-Item -ItemType Directory -Force "$HOME\.agents\skills", "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse -Force "$HOME\kirby-skills\site-collab" "$HOME\.agents\skills\"   # Codex
Copy-Item -Recurse -Force "$HOME\kirby-skills\site-collab" "$HOME\.claude\skills\"   # Claude
```

업데이트는 `git pull` 후 같은 복사 명령을 다시 실행한다.

## site-collab 사용

- 필요한 계정은 GitHub 하나뿐이다. 개설자의 Vercel 계정은 진행 중에 GitHub로 가입한다. 개설자가 직접 하는 일은 브라우저 승인 버튼과 배포용 토큰 복사·붙여넣기 한 번이다(터미널 불필요).
- 합류자는 Codex(또는 Claude)에서 빈 폴더로 프로젝트를 만들고, 초대 메시지의 문장을 붙여넣으면 된다.
- **개설자**(처음 여는 사람)만 위처럼 설치하고 호출한다: Codex `$site-collab`, Claude `/site-collab`.
- **합류자**는 설치하지 않는다. 개설자가 받은 초대 메시지의 문장을 AI에게 붙여넣으면, 사이트 레포 안에 함께 들어 있는 스킬 사본(`.agents/skills/site-collab/`)으로 진행된다.
- 평소 작업 규칙은 사이트 레포의 `AGENTS.md`가 매 세션 자동으로 켠다. 스킬을 다시 부를 필요가 없다.

현재 보류: 외부 서비스(Supabase, Vercel Blob, API 키) 연결, 공통 디자인 규칙.
