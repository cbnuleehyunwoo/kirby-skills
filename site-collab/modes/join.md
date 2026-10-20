# 합류 (합류자, 1회)

합류자는 초대 메시지대로 **Codex(또는 Claude)에서 빈 폴더로 프로젝트를 먼저 만들고**, 그 프로젝트의 새 채팅에 붙여넣기 문장을 넣어 시작한다. 그래서 지금 작업 폴더가 곧 사이트 폴더가 된다. 붙여넣기 문장이 이 파일의 앞 단계를 이미 시켰을 수 있다. 각 단계는 **확인 후 필요할 때만** 한다.

순서를 지킨다: 도구 → 로그인 → 계정 확인 → 초대 수락 → 받기 → 신원. 이유: 로그인 전에 받으면 이 컴퓨터에 저장된 다른 계정으로 받아질 수 있다(1차 테스트에서 실제로 개설자 계정으로 받아졌다).

## 1. 작업 폴더 확인

현재 폴더가 비어 있는지 본다.
- 비어 있음 → 여기에 받는다.
- 이미 이 사이트 레포임(`AGENTS.md`에 `<!-- site-collab:v1 -->`) → 받기는 건너뛰고 6단계부터.
- 다른 파일이 있음 → 안내한다:
  > 사이트를 받을 빈 폴더가 필요해요. (그다음 `guides/make-project-folder.md`의 안내 문구를 OS에 맞게 전한다. 폴더 이름은 `<레포이름>`.) 새 채팅을 열었으면 초대 문장을 다시 붙여넣어 주세요.

현재 폴더가 Windows의 문서·바탕 화면·OneDrive 아래면 `make-project-folder.md`의 마지막 절대로 알린다.

## 2. 도구 확인

`git --version`, `node -v`(18.18 이상), `gh --version`. 없으면 `guides/install.md`.

## 3. GitHub 로그인

```
gh auth status
gh auth login --web --git-protocol https      # 로그인 안 돼 있으면
```
브라우저를 열기 전에: "열린 GitHub 페이지 오른쪽 위 프로필이 초대받은 계정인지 확인해 주세요. 다르면 프로필 사진 → Switch account로 바꿔주세요." 브라우저 코드를 사용자에게 보여준다.

`gh auth setup-git`은 실행하지 않는다(전역 설정이라 다른 레포에도 영향). 받을 때는 `gh repo clone`을, 받은 뒤에는 이 레포 전용 설정(6단계)을 쓴다.

## 4. 계정 확인

```
gh api user -q .login
```
묻는다: "초대받은 GitHub 아이디가 <login> 맞죠?" 아니면 `gh auth login`으로 맞는 계정을 추가하고 `gh auth switch -u <아이디>`.

이 컴퓨터 Git에 다른 계정이 저장돼 있는지도 본다(Windows: `git credential-manager github list`, Mac: `security find-internet-password -s github.com 2>/dev/null | grep acct`). 다르면 알린다: "이 컴퓨터에는 다른 GitHub 계정(<계정>)도 저장돼 있어요. 이 사이트에서는 <login>으로만 작업하게 설정할게요." 그 저장 정보는 지우지 않는다.

## 5. 초대 수락 · 받기

```
gh api user/repository_invitations -q '.[] | "\(.id) \(.repository.full_name)"'
```
대상 레포가 있으면 아직 수락 전이다. 묻는다: "<owner>님의 <repo> 초대를 제가 대신 수락할까요?" 동의하면:
```
gh api -X PATCH user/repository_invitations/<id>
```
목록에 없고 아래 clone이 404면 초대가 없는 것이다 → "개설자님께 초대를 다시 요청해 주세요."

받기 (1단계의 빈 폴더 안으로):
```
gh repo clone <owner>/<repo> .
```

## 6. 이 레포 전용 신원

묻는다: "다른 분들께 보일 이름을 알려주세요(한글 가능)."
```
gh api user -q '.id,.login'
git config user.name  "<이름>"
git config user.email "<id>+<login>@users.noreply.github.com"
git config site-collab.handle <login>
git config credential.helper ""
git config --add credential.helper "!gh auth git-credential"
```
- noreply 메일 이유: 레포 기록에 개인 메일이 남지 않는다. 이 컴퓨터의 기본 Git 신원(`git config --global`)은 바꾸지 않는다.
- credential 두 줄 이유: 저장된 다른 계정 대신 `gh` 로그인 계정으로만 올린다.

확인: `git config user.email`이 noreply이고 `gh api user -q .login`이 초대받은 계정인지 본다.

## 7. 내 화면에 띄우기

```
npm install
npm run dev
```
알린다: "사이트를 띄웠어요 → localhost:3000". Codex는 채팅에 뜨는 **웹 미리보기** 카드에서 바로 볼 수 있다고 덧붙인다.

## 8. 브리핑

아래 내용을 그대로(이름만 바꿔) 전한다.

> 준비 끝이에요. 세 가지만 기억해 주세요.
> 1. 평소처럼 디자인 얘기만 하세요. 고친 건 제가 알아서 저장하고 다른 분들께도 공유돼요.
> 2. 아직 확정 안 된 작업은 **시안**이에요. 내 컴퓨터에서만 보여요. "OO님 시안 보여줘"라고 하면 다른 분 작업도 띄워드려요.
> 3. 마음에 들면 **확정**하세요. 그러면 실제 사이트에 올라가요. 올리기 전엔 꼭 여쭤볼게요.
>
> 마지막으로, 지금 이 채팅은 협업 규칙이 생기기 전에 시작해서 규칙이 꺼져 있어요. 왼쪽 **<프로젝트 이름>** 프로젝트에서 **새 채팅**을 열고 **"협업 확인"**이라고 입력해 보세요. "협업 규칙이 켜져 있어요"라고 답하면 준비 완료예요. 앞으로도 늘 이 프로젝트의 새 채팅에서 말하면 돼요.

이유: 규칙(`AGENTS.md`)은 그 폴더에서 **시작한** 채팅에서만 자동으로 읽힌다.
