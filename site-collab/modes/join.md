# 합류 (합류자, 1회)

합류자는 보통 초대 메시지의 문장을 붙여넣어 시작한다. 그 문장이 설치·로그인·레포 받기까지 지시하므로, 이 파일을 읽는 시점에는 그 일부가 이미 끝났을 수 있다. 각 단계는 **확인 후 필요할 때만** 한다.

## 1. 도구 확인

`git --version`, `node -v`(18.18 이상), `gh --version`. 없으면 `guides/install.md`.

## 2. GitHub 로그인

```
gh auth status                    # 로그인 안 돼 있으면 아래
gh auth login --web --git-protocol https
gh auth setup-git
```
브라우저 코드를 사용자에게 보여준다.

## 3. 초대 수락 확인

```
gh api user/repository_invitations -q '.[].repository.full_name'
```
대상 레포가 목록에 있으면 아직 수락 전이다 → "GitHub에서 온 초대 메일을 열고 Accept를 눌러주세요." 수락할 때까지 clone하지 않는다. 이유: 수락 전 clone은 권한 오류로 실패한다.

## 4. 레포 받기

위치: Mac `~/sites/<레포이름>`, Windows `%USERPROFILE%\Documents\sites\<레포이름>`.
```
git clone https://github.com/<owner>/<repo> <위치>
```

커밋 신원과 브랜치 이름용 핸들을 설정한다:
```
gh api user -q '.id,.login'
git config user.name "<사용자 이름, 한글 가능>"
git config user.email "<id>+<login>@users.noreply.github.com"
git config site-collab.handle <login>
```

## 5. 내 화면에 띄우기

```
npm install
npm run dev
```
알린다: "사이트를 띄웠어요 → localhost:3000"

## 6. 브리핑

아래 내용을 그대로(필요하면 이름만 바꿔) 전한다.

> 준비 끝이에요. 세 가지만 기억해 주세요.
> 1. 평소처럼 디자인 얘기만 하세요. 고친 건 제가 알아서 저장하고 다른 분들께도 공유돼요.
> 2. 아직 확정 안 된 작업은 **시안**이에요. 내 컴퓨터에서만 보여요. "OO님 시안 보여줘"라고 하면 다른 분 작업도 띄워드려요.
> 3. 마음에 들면 **확정**하세요. 그러면 실제 사이트에 올라가요. 올리기 전엔 꼭 여쭤볼게요.
>
> 다음부터는 Codex(또는 Claude)에서 **<레포 위치> 폴더를 열고** 말하면 돼요. 이 폴더를 열어야 협업 규칙이 켜져요.

마지막 문단이 가장 중요하다. 이유: 협업 규칙(`AGENTS.md`)은 그 폴더를 연 세션에서만 자동으로 읽힌다.

## 7. 연습 제안 (선택)

"바로 하나 바꿔볼까요? 예를 들어 '푸터 글자 색 바꿔줘'처럼요." 사용자가 응하면 `AGENTS.md`의 매 요청 체크리스트대로 진행한다.
