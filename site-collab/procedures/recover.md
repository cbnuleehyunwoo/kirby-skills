# 복구

증상별로 원인을 좁혀 고친다. 사용자에게는 원인을 한 줄로, 결과는 주소로 알린다. 고치는 과정의 명령은 보여주지 않는다.

## "사이트가 안 열려" / 시안 화면이 이상해

순서대로 확인한다.

1. **dev 서버가 꺼짐** → `npm run dev`로 다시 켠다.
2. **포트가 다른 프로그램에 잡힘**
   - Mac: `lsof -nP -iTCP:3000 -sTCP:LISTEN`
   - Windows: `Get-NetTCPConnection -LocalPort 3000 -State Listen`
   - 그 프로세스가 이전 dev 서버면 끄고 재시작. 다른 프로그램이면 `npx next dev -p 3005`처럼 포트를 바꾼다.
3. **다른 사람이 부품(패키지)을 추가함**: 최근 merge에 `package.json`/`package-lock.json` 변경이 있음 → `npm install` 후 재시작.
   > <이름>님 작업에 필요한 부품이 추가됐는데 아직 설치가 안 돼 있었어요. 설치하고 다시 띄웠어요 → localhost:3000
4. **코드 오류**: dev 서버 출력이나 `npm run build`의 에러를 읽고 고친다. 내 최근 수정이 원인이면 고친 뒤 커밋·푸시. main에서 온 변경이 원인이면 고치고 "다른 분 작업과 합치면서 생긴 오류를 고쳤어요"라고 알린다.
5. **캐시 꼬임** (위가 다 정상인데 화면이 이상함): dev 서버를 끄고 `.next` 폴더를 지운 뒤 재시작.

## Git 상태가 꼬였을 때

| 상태 | 확인 | 처리 |
|---|---|---|
| merge 진행 중으로 멈춤 | `git status`에 "You have unmerged paths" | `conflicts.md` |
| 브랜치가 아닌 곳에 있음 (detached) | `git branch --show-current`가 비어 있음 | 변경이 있으면 `git switch -c <핸들>/<slug>`로 살리고, 없으면 내 브랜치로 `git switch` |
| main에 커밋해버림 | `git log origin/main..main`에 커밋이 있음 | `git switch -c <핸들>/<slug>`로 그 커밋을 옮기고 `git branch -f main origin/main` |
| push 거절 (내 브랜치) | "rejected … fetch first" | `git pull --no-rebase` 후 다시 push. 내 브랜치에 남이 쓸 일은 없으니 대개 다른 컴퓨터에서 작업한 경우다 |
| 로그인 만료 | push/fetch가 403·401 | `gh auth login --web` → `gh auth setup-git` |
| 레포 접근 권한 없음 | clone/fetch가 404 | 초대 수락 여부(`modes/join.md` 3단계) 확인, 그래도 안 되면 개설자에게 초대를 다시 요청하라고 안내 |

## 실제 사이트 반영 실패

증상: 확정 후 5분이 지나도 `version.txt`가 안 바뀜.

```
gh run list --workflow deploy.yml -L 3
gh run view <run-id> --log-failed
```

먼저 알린다:
> 실제 사이트에 올리는 중에 문제가 생겼어요. 지금은 이전 버전이 그대로 보이고 있어서 방문자에게는 문제없어요. 원인을 확인할게요.

Vercel은 빌드가 성공해야 실제 사이트를 교체하므로, 실패해도 기존 사이트는 그대로다.

| 로그에 보이는 것 | 원인 | 처리 |
|---|---|---|
| 빌드 에러 | 로컬 빌드는 통과했는데 서버에서 실패 (Node 버전, 대소문자 다른 파일 경로 등) | 고침 브랜치 `<핸들>/fix-deploy`에서 수정 → `confirm.md` 3단계부터 |
| `api-deployments-free-per-day`, "Resource is limited" | Vercel 무료 플랜 하루 배포 한도(100회) 초과 | "오늘 실제 사이트에 올릴 수 있는 횟수를 다 썼어요. 확정한 내용은 저장돼 있어서 내일 다시 올리면 돼요."라고 알리고, 다음 날 `gh run rerun <run-id>` |
| "commit author did not have contributing access", "does not support collaboration" | 작성자 덮어쓰기 실패 | 시크릿 `DEPLOY_NAME`/`DEPLOY_EMAIL`이 Vercel 계정에 연결된 GitHub 계정과 같은지 개설자에게 확인 요청 |
| 401·403, token | 개설자 토큰 만료·삭제 | 개설자의 세션에서 `guides/vercel-setup.md`의 2~3단계(로그인, 배포용 토큰)만 다시 한다. 합류자에게는 "개설자님이 다시 연결해야 해요. 이 메시지를 전달해 주세요"라고 안내한다. 합류자는 직접 고칠 수 없다 |
| Actions 실행 자체가 없음 / 사용 시간 초과 메시지 | GitHub Actions 월 사용 시간 소진 (비공개 레포 2,000분) | 다음 달 초기화까지 기다리거나 개설자가 레포 설정에서 확인. 확정 내용은 main에 저장돼 있다 |

고친 뒤 다시 반영되면 "올라갔어요 → <실제 사이트>".
