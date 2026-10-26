# Cheat FPS v0.6.5 — 보직 업데이트

FastAPI + WebSocket 서버 판정, Three.js 3D 클라이언트. v0.6.0을 기반으로 보직 시스템을 추가한 전체 실행 프로젝트다. 이번 릴리스의 범위는 보직·기본 체력·그에 따른 HUD/기믹 보정이다.

## 보직

기본 체력 기준은 200이며 아래 보직별 수치로 적용한다. 클래스 능력은 서버에서 판정한다. AI도 보직 능력을 갖지만 AIM/ESP/무반동 치트는 사용하지 않는다.

| 보직 | 체력 | 이동속도 | 특징 |
|---|---:|---:|---|
| Scout | 150 | 기준 대비 +20% / 9.6m/s | 슬림한 체형, 경량 정찰 장비와 차양 |
| Guard | 300 | 기준 대비 −25% / 6m/s | 넓은 체형, 중장갑·어깨 보호대·안면 바이저 |
| Glowsquid | 200 | 기준 대비 +15% / 9.2m/s | 사람 형태의 청록색 방열 장비. 제련소 피해 장판 화상 면역 |

조준 시에도 기준 5.7m/s에 같은 비율을 적용한다. AI의 기본 이동속도에도 같은 보직 배율을 적용한다.

- Glowsquid 화면에만 제련소 피해 장판이 파란색이다. 같은 기기 2인 분할 화면에서도 각 보직에 맞는 색을 따로 그린다.
- 상대가 ESP를 켜면 Glowsquid의 위치 상자·이름·레이더 표식이 청록색/형광 노랑으로 점멸한다.
- Glowsquid도 총알·시침·열차·컨테이너 압사 피해는 받는다. 화상 면역은 제련소 피해 장판에 한정된다.
- 각 보직은 얼굴색·장비·실루엣이 다른 인간 캐릭터이며 보행·조준·장전 애니메이션을 공유한다.
- AI전은 시작 화면에서 보직을 골라 바로 시작한다. 빈 AI 자리는 각 팀에 빠진 보직부터 채운다.
- 로컬전은 각 참가자가 대기실에서 보직을 고른다. 변경하면 해당 참가자의 준비 상태가 해제된다.
- 경기 도중 보직·최대 체력·이동 배율을 클라이언트가 변경할 수 없다. 다음 라운드에는 보직별 최대 체력으로 회복한다.
- HUD 체력바는 보직별 최대 체력을 기준으로 표시한다. HP 300에서도 바가 넘치지 않는다.
- 높은 체력의 보직도 컨테이너 압사·열차 충돌에서 즉사하도록 기존 기믹을 보정했다.

## 기본 게임 규칙

3vs3, 최대 5라운드 중 3승 선취. 한 팀 전원이 HP 0이면 라운드 종료, 탈락자는 생존 아군 관전. 시간 종료 시 생존자 수/남은 체력으로 판정하고 완전 동률이면 연장한다. 라운드별 승패와 킬/데스, 최종 스코어를 표시한다.

AI전: 1인 또는 프로토콜상 2인의 인간 + 아군 AI로 3명, 상대 AI 3명. 메뉴의 AI전은 1인 바로 시작이다. 로컬전: 양 팀 최소 1명, 팀당 최대 3명, 전원 준비하면 시작. 같은 기기의 2인 분할 화면도 각각 준비해야 한다.

## 맵

모든 맵은 60×35m. AI전은 무작위, 로컬전은 방장이 선택한다.

| 맵 | 랜드마크 / 기믹 |
|---|---|
| 컨테이너 항만 | 크레인이 컨테이너를 옮긴다. 내려오는 컨테이너 아래에 깔리면 즉사 |
| 제련소 | 용광로와 주변 용융 철. 무작위 3개 장판이 2초 예고 후 4초 활성, 0.5초마다 25 피해 |
| 시계 광장 | 시계탑과 주변 12개 엄폐물. 회전 시침에 접촉 시 35 피해, 재피격 간격 1초 |
| 천문관측소 | 산악 배경, 회전하는 돔과 망원경 |
| 철도 기지 | 24초 주기로 기관차 통과. 3초 예고, 초당 5.6m. 모든 보직에 충돌 즉사 |

## 무기 / 치트

| 슬롯 | 총기 | 탄창 / 예비탄 | 발사 간격 | 장전 |
|---|---|---|---|---|
| 1 | AR | 30 / 300 | 0.115초 | 1.5초 |
| 2 | 권총 | 12 / 120 | 0.27초 | 1.25초 |
| 3 | 산탄총 | 6 / 36 | 1초 | 단일 슬러그 1발당 0.7초 |

산탄총은 1발 이상 남아 있고 발사 대기가 끝났으면 장전을 중단하고 쏠 수 있다. 총구 불꽃·탄피·장전·무기 교체 모션과 상단 무기 선택 HUD를 포함한다.

이 버전의 공식 치트는 AIM / ESP / NO RECOIL 세 종류다. 쿨타임 없는 토글이며 사람만 사용한다. AIM은 조준 또는 발사 시 시야 안의 적에게 고정된다. ESP는 벽 너머 적과 체력을 표시한다.

## 로컬 실행

Python 3.11 이상 권장. ZIP을 풀 때 backend/와 frontend/ 폴더 구조를 유지한다. requirements.txt가 있는 폴더에서 실행한다.

```bash
python -m venv .venv
```

macOS / Linux:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

```bash
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 1
```

같은 기기: http://localhost:8000 . 같은 Wi-Fi의 다른 기기: http://서버PC의LAN주소:8000 . 방화벽에서 8000 포트를 허용한다. 로컬 방 코드를 공유해 참가한다.

## Render

저장소 루트에 requirements.txt, render.yaml, backend/, frontend/가 있어야 한다. ZIP 자체를 올리거나 내부 파일을 한 폴더로 평탄화하면 실행되지 않는다.

- Runtime: Python
- Root Directory: 비워 둠
- Build Command: `pip install -r requirements.txt`
- Start Command: 아래 내용을 한 번만 입력

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
```

render.yaml을 통한 Blueprint 배포도 가능하다. 서버 상태와 버전은 /health에서 확인한다. 방 상태는 서버 메모리에 있으므로 workers는 1개로 유지한다. 서버 재시작 시 기존 방은 초기화된다. 연결된 브랜치에 자동 배포가 활성화돼 있으면 커밋 후 재배포가 시작된다.

## 조작

- 1P: WASD 이동, 마우스/Q/E 회전, 좌클릭/Space 발사, 우클릭/Shift 조준, R 장전.
- 1/2/3 무기, F 무기 HUD, Z/X/C 치트, V 관전 대상 변경.
- 2P: 방향키, J/L 회전, Enter 발사, 오른쪽 Shift 조준, P 장전, 7/8/9 무기, O 무기 HUD. 치트는 각 화면 버튼.
- 모바일: 왼쪽 조이스틱 이동, 빈 화면 탭 발사, 드래그 회전. 발사 버튼 길게 누르면 연사한다. 화면 회전 드래그는 총을 쏘지 않는다.
- 설정: 감도·음량·그래픽 품질. WebGL2 사용 불가 시 Canvas 호환 모드로 실행한다.

## 코드 구조 / 개발

- backend/main.py: HTTP/WebSocket, /health, /roles, /arenas
- backend/roles.py: 세 보직의 이름·체력·이속·화상 면역
- backend/game.py: 서버 이동·피해·라운드·클래스 적용
- backend/ai.py: AI 이동과 전투, 보직 패시브 적용
- frontend/game.js: 보직 선택·입력 예측·HUD·ESP·Canvas 호환
- frontend/operators.js: 보직별 인간 모델과 애니메이션
- frontend/scene3d.js: 3D 장면, 화면별 장판 색상
- frontend/renderer3d.js: 배포용 번들, 실행 시 Node가 필요 없다

SOURCE-CODE.md에 코드와 설정 파일을 경로별 전체 내용으로 수록했다.

렌더러 소스를 바꿨다면 번들을 다시 빌드한다.

```bash
npm ci
npm run build:renderer
pip install -r requirements-dev.txt
python -m pytest -q
```

브라우저 검사(선택):

```bash
python -m playwright install chromium
CHEAT_FPS_BROWSER_TESTS=1 python -m pytest tests/test_roles_browser.py tests/test_graphics_browser.py tests/test_weapons_browser.py -q
```

실제 iPad/Safari나 특정 기기의 프레임률은 별도 실기기 확인이 필요하다. 절차 생성 Three.js 모델이며 Source 엔진으로 바꾼 버전은 아니다.
