<!-- site-collab:v1 -->
# {{SITE_NAME}} 협업 규칙

이 레포는 비개발자 디자이너 여러 명이 각자 AI 세션에서 동시에 작업하는 웹사이트다. 사용자는 디자인 얘기만 한다. Git과 배포는 네가 아래 규칙대로 대신한다.

## 프로젝트 정보

- 실제 사이트: {{PROD_URL}}
- 시안 실행: `npm run dev` (기본 localhost:3000)
- 빌드 확인: `npm run build`
- 화면 이름 → 파일 · 요소 (사용자가 화면을 부르는 이름으로 찾는다. 표에 없으면 화면을 보고 짐작하지 말고 "어느 부분 말씀이세요?"라고 묻는다):
{{SECTIONS}}

## "협업 확인"

사용자가 "협업 확인"이라고 하면 `git fetch` 후 이렇게 답한다: "협업 규칙이 켜져 있어요. {{SITE_NAME}}에서 작업할 준비가 됐어요. (나: <git config user.name>, 실제 사이트: {{PROD_URL}})" 그리고 지금 다른 분이 작업 중인 시안이 있으면 한 줄로 알린다.

## 말하는 법

- 한국어, 쉬운 말. 브랜치·커밋·머지·푸시·배포라고 말하지 않는다.
- 확정 안 된 작업 = **시안**, 방문자가 보는 사이트 = **실제 사이트**, 시안을 실제 사이트에 올리기 = **확정**.
- 파일 이름 대신 화면 이름으로 말한다 (`Hero.tsx` → "히어로 섹션").
- 결과는 항상 주소로 준다: 시안 `localhost:포트`, 실제 사이트 {{PROD_URL}}.

## 매 요청 체크리스트

사이트를 바꾸는 요청을 받으면, 수정 전후로 아래를 순서대로 한다. 질문·설명만 하는 요청이면 1만 한다.

1. **대화의 첫 요청이면**: `git fetch --prune`. 내 핸들(`git config site-collab.handle`)로 시작하는 미머지 브랜치가 있으면 그 브랜치로 전환하고, "지난번 <작업 요약>이 아직 확정 안 됐어요"라고 알린다.
2. **작업 브랜치 확보**: 현재 `main`이면 `git switch -c <핸들>/<영어-slug> origin/main` → `git push -u origin HEAD`. slug는 요청 내용을 영어 2~4단어로 줄인다 (예: `minji-design/button-radius`). 이유: 한글 브랜치 이름은 도구에서 깨지기 쉽다.
3. **최신화**: `git fetch`. `origin/main`이 내 브랜치에 없는 커밋을 가지면 `git merge origin/main`. 충돌하면 `.agents/skills/site-collab/procedures/conflicts.md`. merge로 `package-lock.json`이 바뀌었으면 `npm install` 후 dev 서버를 재시작한다.
4. **겹침 확인**: 다른 사람의 미머지 브랜치마다 `git diff --name-only origin/main...origin/<브랜치>`. 내가 고칠 파일과 겹치면 알린다: "참고로 <이름>님도 지금 <화면 이름>을 고치는 중이에요(<그 브랜치 최근 커밋 요약>)." `app/globals.css`, `app/layout.tsx`, `tailwind.config.*` 같은 공통 파일만 겹치면 "공통 스타일이 겹쳐요" 정도로 짧게. 겹쳐도 작업은 진행한다.
5. **수정**: 요청대로 고친다. {{STRUCTURE_RULE}}
6. **저장·공유**: `git add -A && git commit -m "<type>: <한글 요약>" && git push`. type은 `feat` `fix` `style` `refactor` `chore` `docs` 중 하나. 수정 하나당 커밋 하나. 이유: "아까 게 나았어"를 단계별로 되돌릴 수 있고, 다른 사람이 겹침을 볼 수 있다.
7. **보여주기**: dev 서버가 꺼져 있으면 켜고 "바꿨어요 → localhost:3000"처럼 주소를 준다.
8. **확정 제안**: 사용자가 만족을 드러내면("좋다", "이걸로 가자", "됐다", "올려줘", "완성") 매번 "이 시안 확정할까요? 확정하면 실제 사이트에 올라가요."라고 묻는다. 거절하면 새 수정이 생길 때까지 다시 묻지 않는다.

## 꼭 먼저 물어볼 일

아래는 의도가 분명해 보여도 예/아니오를 받은 뒤에만 한다. 이유: 다른 사람이나 실제 사이트에 영향이 가고 되돌리기 번거롭다.

- 확정 (main 반영)
- 실제 사이트 되돌리기
- 브랜치 삭제 (확정 직후 자기 브랜치 정리는 확정 동의에 포함)
- 화면의 같은 요소를 두 사람이 다르게 바꾼 충돌의 해결 방향
- 외부 서비스(Supabase, Blob, API 키) 연결: 이 협업 방식에서 아직 지원하지 않음을 알리고 진행 여부를 묻는다

## 하지 말 것

- `main`에 직접 커밋 (확정·되돌리기 절차 안에서만 예외)
- `git push --force`, `git reset --hard`로 푸시된 기록 지우기
- 다른 사람 브랜치에 커밋하거나 삭제하기
- 토큰·API 키·`.env*.local`·`.vercel/` 커밋
- 빌드가 실패한 상태로 확정

## 상황별 절차

해당 상황이 되면 그 파일을 읽고 따른다.

| 상황 | 파일 |
|---|---|
| 확정 동의를 받음 | `.agents/skills/site-collab/procedures/confirm.md` |
| "아까 게 나았어", "원래대로", "올린 거 취소해줘" | `.agents/skills/site-collab/procedures/undo.md` |
| "OO님 시안 보여줘", "폰으로 보고 싶어" | `.agents/skills/site-collab/procedures/view-other.md` |
| merge 충돌 | `.agents/skills/site-collab/procedures/conflicts.md` |
| "사이트가 안 열려", 오류, 실제 사이트 반영 실패 | `.agents/skills/site-collab/procedures/recover.md` |
| 새 사람 합류, 초대 | `.agents/skills/site-collab/modes/join.md` |
