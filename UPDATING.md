# v0.2.6 업데이트

이 ZIP은 전체 프로젝트다. 압축을 푼 뒤 **backend와 frontend 폴더 경로를 그대로 유지**한다. 이번 버전에는 새 필수 파일 **backend/ai.py**가 포함된다.

## iPad에서 업로드

1. 파일 앱에서 ZIP을 눌러 압축을 푼다.
2. GitHub 저장소의 **backend 폴더 안**으로 들어간다. Add file → Upload files에서 ZIP의 backend 안 파일 6개를 선택해 업로드하고 Commit changes를 누른다.
3. GitHub 저장소의 **frontend 폴더 안**으로 들어간다. 같은 방법으로 ZIP의 frontend 안 파일 6개를 모두 업로드하고 커밋한다.
4. README, 테스트, 배포 설정 등 루트의 나머지 파일도 같은 경로에 반영하면 전체 프로젝트가 일치한다. 기존 버전의 설치/시작 명령은 그대로 사용한다.
5. Render 서비스에서 Manual Deploy → Deploy latest commit을 선택한다. 자동 배포를 쓰더라도 마지막 파일까지 반영된 커밋이 배포되었는지 확인한다.
6. 배포 완료 후 게임 페이지를 새로고침한다. 메인 메뉴에 **v0.2.6**이 보여야 한다. 서버 주소 뒤에 `/health`를 붙이면 `version` 값도 `0.2.6`이다.

파일 업로드 목록에 경로가 중복되지 않아야 한다. 예를 들어 GitHub의 frontend 폴더 안에서 이미 frontend 폴더 자체를 다시 넣으면 `frontend/frontend/game.js`가 되어 잘못된다. **폴더 안에서는 그 안의 파일들만** 업로드한다.

## 교체/추가 파일 확인

| 폴더 | 파일 |
|---|---|
| backend | `__init__.py`, `main.py`, `game.py`, `arenas.py`, `hazards.py`, **`ai.py`** |
| frontend | `index.html`, `style.css`, `game.js`, **`renderer3d.js`**, `scene3d.js`, `THREE-LICENSE.txt` |

`renderer3d.js`를 빼면 3D 모델이 표시되지 않는다. `scene3d.js`는 사람이 편집하는 원본이며, 실행에는 번들인 `renderer3d.js`가 사용된다. **backend와 frontend를 함께 업데이트**해야 새 탭 사격과 이동 동기화가 동작한다. 서로 다른 버전이면 메인 메뉴에서 업데이트 안내가 표시된다.

업로드 메뉴가 보이지 않으면 해당 폴더에서 기존 파일을 열어 연필(Edit)을 누르고 내용을 교체할 수 있다. 새 파일은 Add file → Create new file에서 만든다. 저장소 루트에서 파일을 만들 때는 `frontend/renderer3d.js`처럼 폴더와 파일명을 함께 적는다. `backend`라는 이름의 파일을 만들면 폴더가 되지 않는다.

## Render 설정

- Runtime: Python 3
- Root Directory: requirements.txt가 저장소 루트에 있으면 비워 둔다.
- Build Command: `pip install -r requirements.txt`
- Start Command: 아래 한 줄. 기존 내용을 전부 지운 뒤 한 번만 붙여 넣는다.

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
```

설정 창에서 `그래픽: 3D · v0.2.6`을 확인할 수 있다. WebGL2를 사용할 수 없는 브라우저에서는 2D 호환 모드가 표시된다. 코드 전달만으로 기존 Render 서비스가 바뀌지는 않으므로, 위 파일 교체와 배포가 필요하다.

## 이번 변경과 유지되는 기능

다섯 맵 모두 60×35m로 확장하고 엄폐 구역을 17~18개 배치했다. 서버/클라이언트 좌표가 1m 단위로 통일되므로 backend 파일 6개와 frontend 파일 6개를 모두 반영한다. AI에는 서로 다른 진입 동선, 측면 이동, 엄폐, 후퇴, 마지막 목격 지점 탐색, 점사, 선로 회피가 있다. AI는 치트를 사용하지 않는다.

기차는 폭 4m·길이 12m·속도 5.6m/s를 유지하며 넓어진 맵을 24초 주기로 통과한다. 충돌은 사람/AI 모두 100 피해다. 메인 메뉴에는 모드·게임 시작·설정·종료만 있고 실제 다섯 맵을 배경으로 순환한다. AI전은 무작위 맵에서 바로 시작하고 로컬 대전은 접속 창에서 맵을 고른다.

기존 로컬 시작 조건도 유지한다. BLUE/RED에 각각 1명 이상 있고 참가자 전원이 준비 완료하면 자동 시작한다. 1대1·2대1도 가능하며 빈자리를 AI로 채우지 않는다. 같은 기기의 2인도 준비 버튼을 따로 누르고, 팀당 최대 3명이다.

치트는 AIM / ESP / NO RECOIL 세 개다. AIM은 일반 사격·모바일 탭에도 적용한다. 무한 탄약은 없으며 모든 사격에 탄약이 소모된다. 1P 치트 단축키는 1·2·3, 2P는 7·8·9다. 기존 `arenas.py`와 `hazards.py`도 포함한 전체 backend를 빠짐없이 올린다.
