# 설치 (Mac / Windows)

필요한 것: **Git**, **Node.js 18.18 이상**(LTS 권장), **GitHub CLI(gh)**. 이미 있는 것은 건너뛴다.

```
git --version
node -v
gh --version
```

설치 창·권한 창이 뜰 때마다 미리 알린다. 예: "설치 창이 뜨면 '계속'(Windows는 '예')을 눌러주세요." 비밀번호 입력이 필요하면 "컴퓨터 로그인 비밀번호를 입력해 주세요. 입력해도 화면에 글자가 안 보이는 게 정상이에요."

## Windows

`winget`이 있으면(`winget --version`) 이걸로 설치한다.
```
winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
winget install -e --id GitHub.cli --accept-source-agreements --accept-package-agreements
```
설치 후 현재 창은 PATH를 모른다. 새 터미널을 열거나 다음으로 갱신:
```
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
```

`winget`이 없으면 설치 페이지를 열고 어떤 버튼을 누를지 알려준다.
- Git: https://git-scm.com/download/win → "Click here to download". 설치 중 선택지는 모두 기본값.
- Node.js: https://nodejs.org/ko/download → LTS의 Windows 설치 프로그램(.msi).
- GitHub CLI: https://cli.github.com → Download for Windows.

PowerShell이 스크립트 실행을 막으면(`npm.ps1 cannot be loaded`):
```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
사용자에게 "명령 실행을 허용하는 설정을 이 계정에만 켰어요"라고 알린다.

## Mac

**Homebrew가 있으면**(`brew --version`):
```
brew install git node gh
```

**없으면** Homebrew를 새로 깔지 않는다(관리자 비밀번호와 긴 설치가 필요하다). 대신:
- Git: `xcode-select --install` → 뜨는 창에서 "설치". 5~10분 걸린다고 알린다.
- Node.js: https://nodejs.org/ko/download 를 열고 LTS의 macOS 설치 프로그램(.pkg)을 받아 더블클릭하라고 안내.
- GitHub CLI: https://github.com/cli/cli/releases/latest 를 열고 `macOS_universal.pkg`로 끝나는 파일을 받아 더블클릭하라고 안내.

설치 후 새 터미널에서 버전 확인을 다시 한다.

## 확인

세 명령이 모두 버전을 출력하고 `node -v`가 18.18 이상이면 끝. 낮으면 위 방법으로 LTS를 다시 설치한다.
