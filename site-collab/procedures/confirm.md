# 시안 확정

사용자가 "확정할까요?"에 동의했을 때만 실행한다. 목표: 내 시안을 실제 사이트에 올리되, **사용자가 본 적 없는 화면이 올라가지 않게** 한다.

## 1. 최신 내용 합치기

```
git fetch --prune
git status                              # 커밋 안 된 변경이 있으면 먼저 커밋·푸시
BASE=$(git merge-base HEAD origin/main) # merge 전에 기록: 내가 마지막으로 본 실제 사이트 기준
git merge origin/main
```
Windows PowerShell은 `$BASE = git merge-base HEAD origin/main` 형태로 쓴다.
충돌 → `conflicts.md`. 해결 후 이어서.

## 2. 그사이 바뀐 것이 내 화면에 닿는지 판단

`BASE`가 `origin/main`과 같으면(그사이 아무도 확정 안 함) 3으로 간다.
```
git diff --name-only $BASE origin/main             # 남이 그사이 확정한 파일
git diff --name-only origin/main...HEAD            # 내가 바꾼 파일
```

아래 중 하나라도 맞으면 **합친 결과를 보여주고 승인**을 받는다. 아니면 3으로 간다.
- 두 목록이 겹친다.
- 남이 바꾼 파일이 공통 파일(`components/ui/*`, `app/globals.css`, `app/layout.tsx`, `tailwind.config.*`)이다.
- 남이 바꾼 파일을 내가 바꾼 섹션이 import한다.

보여주는 말:
> 확정하기 전에 보여드릴 게 있어요. <언제> <이름>님이 <화면 이름>을 바꿔서 실제 사이트에 올렸어요. 합치면 이렇게 보여요 → localhost:3000
> 이대로 올릴까요?

dev 서버를 재시작해 합친 결과가 화면에 반영된 상태에서 묻는다. 거절하면 원하는 수정을 받고, 수정이 끝나면 확정을 다시 제안한다.

이유: 파일이 겹치지 않으면 git은 조용히 합친다. 그 결과 화면은 누구도 본 적이 없을 수 있다.

## 3. 빌드 확인

```
npm run build
```
실패하면 고치고(사용자에게는 "올리기 전에 오류가 있어서 고쳤어요" 한 줄), 고친 내용을 커밋한 뒤 다시 빌드한다. 빌드가 통과하기 전에는 다음 단계로 가지 않는다.

## 4. main에 하나로 합쳐 올리기

```
BR=$(git branch --show-current)
git push                                  # 내 브랜치 최종본 백업
git switch main
git pull --ff-only
git merge --squash $BR
git commit -m "<type>: <이번 시안 전체를 한 줄로 요약한 한글>"
git push
```
- push가 거절되면(그사이 다른 사람이 확정함): `git reset --hard origin/main`으로 **로컬 main만** 되돌리고, 내 브랜치로 돌아가 1단계부터 다시 한다. 내 브랜치는 이미 푸시돼 있어서 작업은 안전하다.
- squash 이유: 실제 사이트 기록이 확정 1회 = 커밋 1개가 되어, "올린 거 취소해줘"를 한 번에 되돌릴 수 있다.

## 5. 정리

```
git push origin --delete $BR
git branch -D $BR
```
다음 수정 요청부터는 체크리스트 2단계에서 새 브랜치가 생긴다.

## 6. 반영 확인

```
git rev-parse HEAD           # 기대 SHA
```
`<실제 사이트>/version.txt`를 15초 간격으로 확인한다(최대 5분). 기대 SHA와 같아지면:
> 올라갔어요 → <실제 사이트>

5분이 지나도 안 바뀌면 `gh run list --workflow deploy.yml -L 1`로 상태를 보고 `recover.md`의 "실제 사이트 반영 실패"를 따른다. 기다리는 동안 "올리는 중이에요. 1~2분 걸려요"라고 한 번만 알린다.
