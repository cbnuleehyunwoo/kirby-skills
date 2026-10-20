# 다른 사람 시안 보기 · 폰으로 보기

## 다른 사람 시안 띄우기

내 작업 폴더는 건드리지 않는다. 별도 폴더(worktree)에 받아서 다른 포트로 띄운다.

1. 누구의 어떤 시안인지 찾는다.
   ```
   git fetch --prune
   git for-each-ref --format='%(refname:short) %(authorname) %(committerdate:relative) %(contents:subject)' refs/remotes/origin --sort=-committerdate
   ```
   `origin/main`과 내 핸들 브랜치를 뺀 나머지가 다른 사람 시안이다. 사람 이름과 브랜치가 여러 개면 화면 말로 목록을 보여주고 고르게 한다.
2. 띄우기 (폴더 이름은 브랜치의 `/`를 `-`로 바꾼다):
   ```
   git worktree add ../.site-collab-view/<폴더> origin/<브랜치>
   cd ../.site-collab-view/<폴더>
   npm install
   npx next dev -p 3001
   ```
   3001이 쓰이고 있으면 3002, 3003… 순서로.
3. 알린다: "<이름>님 시안 띄웠어요 → localhost:3001. 내 작업은 그대로예요."

이 폴더에서는 수정·커밋하지 않는다. 사용자가 거기서 고치려 하면: "이건 <이름>님 시안이라 제가 고칠 수는 없어요. 비슷하게 내 시안에 적용해 드릴까요?"

### 정리

사용자가 다 봤다고 하거나 대화가 끝날 때 해당 dev 서버를 끄고:
```
git worktree remove ../.site-collab-view/<폴더> --force
```
최신 시안을 다시 보려면 같은 폴더에서 `git fetch && git checkout --detach origin/<브랜치>` 후 재시작.

## 폰으로 보기 (같은 와이파이)

1. dev 서버를 외부 접속 허용으로 재시작한다.
   ```
   npx next dev -H 0.0.0.0 -p <포트>
   ```
2. 내 컴퓨터 주소:
   - Mac: `ipconfig getifaddr en0` (비어 있으면 `en1`)
   - Windows: `Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet' } | Select-Object -First 1 -ExpandProperty IPAddress`
3. 알린다:
   > 폰이 같은 와이파이에 있으면 이 주소를 열어보세요 → http://<IP>:<포트>
   > 처음에 "방화벽 허용" 창이 뜨면 허용을 눌러주세요.
4. 안 열리면: 같은 와이파이인지, 회사·카페처럼 기기끼리 접속을 막는 네트워크인지 확인한다. 막혀 있으면 "이 와이파이는 기기끼리 연결을 막고 있어서 폰으로는 볼 수 없어요. 확정 후 실제 사이트로 확인할 수 있어요."

시안을 외부 사람에게 링크로 보내는 기능은 없다. 외부 공유는 확정 후 실제 사이트 주소로 한다.
