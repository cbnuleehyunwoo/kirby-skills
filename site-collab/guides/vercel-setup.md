# Vercel 셋업 (개설자, 열기 모드 6단계)

개설자는 GitHub 계정만 있으면 된다. Vercel 계정은 이 절차 안에서 GitHub로 가입한다. 개설자가 직접 하는 일은 브라우저 버튼 몇 번과 토큰 복사·붙여넣기 한 번이다. 터미널은 쓰지 않는다.

끝나면 GitHub 레포 시크릿에 `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DEPLOY_NAME`, `DEPLOY_EMAIL`이 등록돼 있다.

**토큰 규칙**: 토큰 값은 화면·대화·파일·로그 어디에도 출력하지 않는다. 사용자가 실수로 대화에 붙여넣으면 그 값을 등록하되, 대화 기록에 남았으니 4단계를 다시 해서 새 토큰으로 바꾸자고 권하고 옛 토큰은 `npx vercel tokens revoke <id> --yes`로 폐기한다.

**화면 안내 규칙**: 버튼·메뉴 이름은 화면에 보이는 그대로 쓴다. 내부 ID·slug·CLI 출력값을 화면 이름처럼 쓰지 않는다. 사용자가 "안 보여요"라고 하면 스크린샷을 받아 그 화면 기준으로 다시 안내한다.

## 0. 이미 로그인돼 있나

```
npx vercel whoami
```
사용자 이름이 나오면 묻는다: "Vercel에 GitHub <gh 로그인 계정> 계정으로 가입하셨죠?" 맞으면 3단계로 간다. 다르면 1단계부터 맞는 계정으로 한다.

이유: 배포 직전 커밋 작성자를 개설자 GitHub 계정으로 덮어써서 무료 플랜의 협업 차단을 피하는데, Vercel에 연결된 GitHub 계정과 다르면 차단된다.

## 1. 가입 (개설자: 버튼 2번)

묻는다: "Vercel 계정 있어요? 없으면 지금 GitHub 계정으로 1분 만에 만들 수 있어요."

없으면 `https://vercel.com/signup`을 열고 안내한다.
> 열린 페이지에서 **Continue with GitHub**를 누르고, GitHub 화면이 나오면 **Authorize**를 눌러주세요. 요금제를 물으면 **Hobby**(무료)를 고르고 이름은 아무거나 넣으면 돼요. 끝나면 알려주세요.

페이지를 열기 전에: "GitHub 화면 오른쪽 위 프로필이 <gh 로그인 계정>인지 확인해 주세요. 다르면 프로필 사진 → Switch account로 바꿔주세요."

## 2. 로그인 (개설자: 버튼 1번)

```
npx vercel login
```
브라우저가 열리면: "열린 페이지에서 **Confirm**을 눌러주세요." 완료 후 `npx vercel whoami`로 확인한다.

## 3. 프로젝트 연결

```
npx vercel link --yes --project <레포이름>
npx vercel git disconnect --yes
```
- `link --yes`는 GitHub 레포를 자동으로 연결하려고 한다(계정에 Vercel GitHub 앱이 설치돼 있으면 연결된다). 그래서 바로 `git disconnect`로 끊는다. "No Git repository connected" 오류는 정상이다.
- 이유: 연결된 채로 두면 Vercel이 푸시마다 직접 배포를 시도해서 무료 플랜 협업 차단에 걸리고 배포 한도도 쓴다. `vercel.json`의 `git.deploymentEnabled: false`는 이중 안전장치다.
- `link`는 비밀값이 든 `.env.local`과 `.vercel/`을 만든다. 둘 다 `.gitignore`에 막혀 있는지 `git status --short`로 확인한다.

## 4. 배포용 토큰 (개설자: 버튼 몇 번 + 복사·붙여넣기)

토큰은 사람이 만들어야 한다. CLI 로그인 권한으로는 토큰 생성이 막혀 있다(`vercel tokens create`와 REST API 모두 403 "Cannot create tokens for this app", 2026-10 확인).

준비:
```
npx vercel teams ls        # "Team name" 열의 표시 이름 (예: Kim's projects)
gh secret list             # VERCEL_TOKEN이 이미 있는지
```

두 페이지를 연다.
- Vercel 토큰: `https://vercel.com/account/settings/tokens`
- GitHub 시크릿: 처음이면 `https://github.com/<owner>/<repo>/settings/secrets/actions/new`, 이미 `VERCEL_TOKEN`이 있으면 `https://github.com/<owner>/<repo>/settings/secrets/actions/VERCEL_TOKEN`

페이지를 열기 전에: "두 페이지 모두 오른쪽 위 계정이 <개설자 계정>인지 확인해 주세요. GitHub에서 '초대' 화면이 뜨면 다른 계정으로 로그인돼 있는 거예요."

안내한다:
> **① Vercel 탭**
> 1. **Create Token**을 눌러주세요.
> 2. 이름에 `site-collab-<레포이름>`을 입력하세요.
> 3. **Scope**를 누르고 **<팀 표시 이름>**을 고르세요. 오른쪽 `>`를 눌러 그 안에 `<레포이름>`이 보이면 그걸 고르세요(더 안전해요). **Full Account는 고르지 마세요.**
> 4. **Expiration**은 **No Expiration**(없으면 가장 긴 기간).
> 5. **Create**를 누르고, 나온 값 옆 **복사** 버튼을 누르세요. 이 값은 한 번만 보여요.
>
> **② GitHub 탭**
> 1. **Name** 칸에 `VERCEL_TOKEN` (이미 있는 경우 이 칸은 없어요)
> 2. **Secret** 칸에 붙여넣기
> 3. **Add secret**(이미 있는 경우 **Update secret**)
>
> 토큰 값은 이 대화에 붙여넣지 말고, 끝나면 "했어"라고만 알려주세요.

### "했어"를 들으면 확인한다

말만 믿지 않는다. 두 가지를 확인한다.
```
npx vercel tokens list --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);const t=(o.tokens??o).find(t=>t.name===process.argv[1]);console.log(t?"created "+new Date(t.createdAt).toISOString():"missing")})' site-collab-<레포이름>
gh secret list | grep VERCEL_TOKEN          # 갱신 시각
```
| 결과 | 판단 | 안내 |
|---|---|---|
| 토큰 `missing` | ①이 안 끝남 | "Vercel에서 토큰 만들기가 끝나지 않은 것 같아요. Create까지 눌렀는지 봐주세요." |
| 시크릿 갱신 시각이 토큰 생성 시각보다 이름 | ②가 저장 안 됨, 또는 옛 값을 붙여넣음 | "GitHub에 붙여넣은 게 저장되지 않은 것 같아요. 방금 복사한 값으로 다시 해주세요." |
| 토큰 생성 후 몇 분 안에 시크릿 갱신 | 정상 | 5단계로 |

값이 맞는지는 8단계 첫 배포에서 확인된다. 첫 배포가 "token … is not valid"로 실패하면 대개 클립보드에 남아 있던 옛 토큰을 붙여넣은 경우다. 이 4단계를 다시 한다.

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
- 배포용 토큰 `site-collab-<레포이름>`은 고른 범위(<팀 표시 이름> 또는 이 프로젝트)에 접근할 수 있다.
- 레포에 쓰기 권한이 있는 사람은 설정 파일을 고쳐 이 토큰을 쓸 수 있다. 믿을 수 있는 사람만 초대한다.
- 토큰을 끊고 싶으면 Vercel 설정의 Tokens에서 지우면 된다. 그러면 실제 사이트 반영이 멈춘다.

열기 모드 7단계로 돌아간다.
