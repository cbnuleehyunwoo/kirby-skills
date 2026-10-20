<!-- 열기 모드 9단계에서 {{...}}를 채워 사용자에게 보여준다. 아래 구분선 안쪽이 보낼 메시지다. -->

---

**{{SITE_NAME}} 같이 작업해요**

1. GitHub에서 온 초대 메일을 열고 **Accept**를 눌러주세요.
   (GitHub 계정이 없으면 github.com 에서 먼저 가입하고, 아이디를 {{OWNER_NAME}}에게 알려주세요.)
2. Codex나 Claude를 열고, 아래 문장을 **그대로** 붙여넣어 주세요.

```
https://github.com/{{OWNER}}/{{REPO}} 사이트 협업에 합류할게.
1) 내 컴퓨터에 Git, Node.js(18.18 이상), GitHub CLI(gh)가 없으면 내 OS에 맞게 설치를 도와줘.
2) gh auth login --web 으로 GitHub 로그인을 도와주고 gh auth setup-git 까지 해줘.
3) 초대를 아직 수락하지 않았으면 수락하라고 알려줘.
4) Mac이면 ~/sites, Windows면 문서\sites 폴더에 이 레포를 받아줘.
5) 받은 뒤에는 레포 안의 .agents/skills/site-collab/modes/join.md 를 읽고 그대로 진행해줘.
```

실제 사이트: {{PROD_URL}}

---
