# 충돌 처리

`git merge` 또는 `git revert`가 충돌했을 때. 기준은 git 충돌 여부가 아니라 **두 사람의 의도가 부딪히는지**다.

## 1. 충돌 파일 확인

```
git diff --name-only --diff-filter=U
```
각 파일마다 양쪽이 무엇을 바꿨는지 본다.
```
git log --oneline --no-merges HEAD...MERGE_HEAD -- <파일>     # merge 중일 때
git diff MERGE_HEAD...HEAD -- <파일>                          # 내 쪽 변경
git diff HEAD...MERGE_HEAD -- <파일>                          # 상대 쪽 변경
```

## 2. 분류

| 분류 | 기준 | 처리 |
|---|---|---|
| **UI/UX 충돌** | 화면의 같은 요소의 같은 속성(글자 크기, 색, 간격, 배치, 문구, 동작)을 양쪽이 서로 다른 값으로 바꿈 | 묻는다 (3) |
| **사소한 충돌** | 그 외 전부: 같은 줄이지만 다른 속성(한쪽은 문구, 한쪽은 크기), 다른 요소, 공백·포맷 차이, import 순서, 같은 값으로 바꿈 | 양쪽을 모두 살려 자동으로 합치고 알린다 (4) |
| **잠금 파일** | `package-lock.json` | `git checkout --theirs package-lock.json && npm install` 후 `git add package-lock.json`. 알리지 않는다 |

## 3. UI/UX 충돌 묻기

화면 말과 구체적인 값으로 묻는다. 선택지는 3개 이하.
> <이름>님은 <요소>를 <값A>로, <사용자 이름>님은 <값B>로 바꿨어요. 같은 곳을 다르게 바꿔서 제가 정할 수 없어요. 어떻게 할까요?
> 1. 내 것 (<값B>)
> 2. <이름>님 것 (<값A>, 지금 실제 사이트)
> 3. 둘 다 띄워서 비교하기

3을 고르면: 1안을 적용한 상태로 내 화면(localhost:3000)에, 2안을 `view-other.md` 방식으로 별도 포트에 띄운다. 고르면 그 값으로 해결한다.

## 4. 사소한 충돌 알리기

자동으로 해결한 뒤 한 줄로:
> <이름>님이 바꾼 <A>와 제가 바꾼 <B>를 둘 다 살려서 합쳤어요.

## 5. 마무리

```
git add <파일들>
git commit --no-edit          # merge 중일 때. revert 중이면 git revert --continue
npm run build                 # 합친 결과가 빌드되는지
git push
```
dev 서버를 재시작하고 합친 화면 주소를 준다. 확정 절차 도중이었다면 `confirm.md`의 2단계로 돌아간다.

## 하지 말 것

- 한쪽 변경을 말없이 버리기 (`-X ours`, `-X theirs`로 일괄 처리)
- 충돌 표식(`<<<<<<<`)이 남은 채로 커밋
- 해결이 막히면 `git merge --abort`로 merge 전 상태로 돌린 뒤 사용자에게 상황을 설명한다
