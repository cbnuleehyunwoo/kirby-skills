# Vercel 셋업 (개설자, 열기 모드 6단계)

개설자는 GitHub 계정만 있으면 된다. Vercel 계정은 이 절차 안에서 GitHub로 가입한다. 개설자가 직접 하는 일은 브라우저 승인 버튼뿐이다.

끝나면 GitHub 레포 시크릿에 `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DEPLOY_NAME`, `DEPLOY_EMAIL`이 등록돼 있다.

**토큰 규칙**: 토큰 값은 화면·대화·파일·로그 어디에도 출력하지 않는다. 셸 변수로 받아 곧바로 `gh secret set`에 넘기고 변수를 지운다.

## 0. 이미 로그인돼 있나

```
npx vercel whoami
```
사용자 이름이 나오면 3단계로 간다.

## 1. 가입 (개설자: 버튼 2번)

묻는다: "Vercel 계정 있어요? 없으면 지금 GitHub 계정으로 1분 만에 만들 수 있어요."

없으면 `https://vercel.com/signup`을 열고 안내한다.
> 열린 페이지에서 **Continue with GitHub**를 누르고, GitHub 화면이 나오면 **Authorize**를 눌러주세요. 요금제를 물으면 **Hobby**(무료)를 고르고 이름은 아무거나 넣으면 돼요. 끝나면 알려주세요.

확인한다: "가입할 때 GitHub <gh 로그인 계정> 계정으로 하셨죠?" 다른 GitHub 계정이었다면 지금 계정으로 다시 가입하거나 로그인을 바꾸게 한다. 이유: 배포 직전 커밋 작성자를 이 GitHub 계정으로 덮어써서 무료 플랜의 협업 차단을 피하는데, Vercel에 연결된 GitHub 계정과 다르면 차단된다.

## 2. 로그인 (개설자: 버튼 1번)

```
npx vercel login
```
브라우저가 열리면 안내한다: "열린 페이지에서 **Confirm**을 눌러주세요." 완료 후 `npx vercel whoami`로 확인한다.

## 3. 배포용 토큰 만들기 (개설자: 할 일 없음)

CLI 로그인 정보는 10일 동안 안 쓰면 만료되므로 배포에 그대로 쓰지 않는다. 배포 전용 토큰을 새로 만든다. 이름은 `site-collab-<레포이름>`으로 해서 나중에 이 사이트용만 골라 지울 수 있게 한다.

아래 순서로 시도하고, 성공한 방법에서 멈춘다.

### 3-1. CLI 명령

```
npx vercel tokens --help
```
토큰을 새로 만들어 값을 출력하는 하위 명령이 있으면 그걸 쓴다. 출력에서 토큰 값만 변수로 받는다. 없으면 3-2.

### 3-2. 스크립트 (Mac·Windows 공통)

이 스킬 폴더의 `scripts/mint-vercel-token.mjs`를 쓴다.

**Mac**
```
T=$(node <스킬 폴더>/scripts/mint-vercel-token.mjs site-collab-<레포이름>) && printf %s "$T" | gh secret set VERCEL_TOKEN; unset T
```

**Windows (PowerShell)**
```
$t = node <스킬 폴더>\scripts\mint-vercel-token.mjs site-collab-<레포이름>
if ($LASTEXITCODE -eq 0) { $t | gh secret set VERCEL_TOKEN }
Remove-Variable t
```

종료 코드 1이면 2단계로 돌아가 다시 로그인한다. 2(API 거절)나 3이면 3-3으로 간다. 스크립트가 실패하면 `gh secret set`을 실행하지 않는다. 이유: 빈 값이 시크릿으로 등록된다.

### 3-3. 직접 만들기 (개설자: 버튼 몇 번 + 붙여넣기)

`https://vercel.com/account/settings/tokens`를 열고 안내한다.
> **Create Token**을 눌러주세요. 이름은 `site-collab-<레포이름>`, 범위(Scope)는 본인 계정, 만료(Expiration)는 **No Expiration**으로 하고 만든 뒤 나온 값을 여기에 붙여넣어 주세요. 이 값은 계정 열쇠라서 다른 곳에는 붙여넣지 마세요.

받은 값은 바로 `gh secret set VERCEL_TOKEN`에 넘긴다. 이 경우만 토큰이 대화를 거쳤다는 사실을 개설자에게 알린다.

### 확인

```
gh secret list
```
`VERCEL_TOKEN`이 목록에 있으면 된다. 값은 확인하지 않는다.

## 4. 프로젝트 연결

```
npx vercel link --yes --project <레포이름>
npx vercel git disconnect --yes
```
- `link`가 GitHub 레포를 자동으로 연결했을 수 있으므로 `git disconnect`로 끊는다. 연결된 적이 없어서 나는 오류는 무시한다.
- 이유: 연결된 채로 두면 Vercel이 푸시마다 직접 배포를 시도해서 무료 플랜 협업 차단에 걸리고 배포 한도도 쓴다. `vercel.json`의 `git.deploymentEnabled: false`는 이중 안전장치다.
- `.vercel/`은 `.gitignore`에 있어야 한다.

## 5. 나머지 시크릿

`.vercel/project.json`에서 `orgId`, `projectId`를 읽는다.
```
gh secret set VERCEL_ORG_ID     --body "<orgId>"
gh secret set VERCEL_PROJECT_ID --body "<projectId>"
```
개설자 GitHub 신원:
```
gh api user -q '.id,.login'
gh secret set DEPLOY_NAME  --body "<login>"
gh secret set DEPLOY_EMAIL --body "<id>+<login>@users.noreply.github.com"
```

## 6. 고지

개설자에게 알린다.
- 배포용 토큰은 개설자 Vercel 계정 전체에 접근할 수 있다.
- 레포에 쓰기 권한이 있는 사람은 설정 파일을 고쳐 이 토큰을 쓸 수 있다. 믿을 수 있는 사람만 초대한다.
- 토큰을 끊고 싶으면 Vercel 설정의 Tokens에서 `site-collab-<레포이름>`을 지우면 된다. 그러면 실제 사이트 반영이 멈춘다.

열기 모드 7단계로 돌아간다.
