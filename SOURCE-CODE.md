# Cheat FPS v0.2.0 — 전체 소스

모든 코드·설정·설명 파일을 경로와 전체 내용으로 제공한다. 실행·배포는 README.md, 기존 게임 교체는 UPDATING.md를 따른다.

## CHANGELOG.md

````markdown
# v0.2.0 — 모바일·분할 화면 개선

1. 이동: 아날로그 입력, 가속·감속, 대각선 속도 정규화, 클라이언트 예측과 서버 위치 보정.
2. 2인 분할: 각 화면에 독립된 이동·발사·조준·장전·치트 버튼.
3. 모바일 이동: 방향 버튼을 원형 조이스틱으로 교체. 포인터별 입력을 추적해 동시 조작 가능.
4. 길게 누르기: iOS 텍스트 선택·터치 콜아웃·컨텍스트 메뉴 차단, 터치 취소/탭 비활성화 시 입력 해제.
5. 외형: 캐릭터 3종의 헬멧·방탄복·장비·소총, 8방향 외형과 걷기 동작. 총기·발사광·재장전, 벽 재질·바닥 표현 개선.
6. 시점: 입력 즉시 회전, 다른 캐릭터 위치·방향 보간, 60Hz 서버 시뮬레이션과 30Hz 전송, 렌더 캐시.
7. 터치 사격: 짧은 화면 탭 1발, 화면 드래그 회전 시 발사 차단, 발사 버튼을 누르면 연사.
8. AI전: 메인 메뉴에서 캐릭터/치트 선택 → 바로 경기. 결과에서도 대기방 없이 재경기.

3vs3 / 5판 3선승 / 즉시 녹아웃·관전 / 4종 무제한 토글 / 치트 없는 AI / 로컬 6인 / 결과·통계 / Render 구성은 유지한다.
````

## README.md

````markdown
# Cheat FPS v0.2.0

FastAPI + WebSocket + HTML5 Canvas 레이캐스팅 FPS. 외부 이미지·CDN·프론트엔드 라이브러리 없이 실행한다. 일반 인간 캐릭터 3종은 외형만 다르고 성능은 동일하다.

## 폴더 구조

```text
cheat-fps/
├── backend/
│   ├── __init__.py
│   ├── main.py             # HTTP, WebSocket, 60Hz 시뮬레이션 / 30Hz 전송
│   └── game.py             # 이동·충돌·AI·사격·치트·라운드 판정
├── frontend/
│   ├── index.html          # 메뉴·편성·HUD·결과·설정
│   ├── style.css           # 반응형 UI
│   └── game.js             # Canvas FPS, 입력, 소리, 동기화
├── tests/
│   ├── test_game.py        # 서버·경기·WebSocket 검증
│   └── test_browser.py     # 실제 Chromium 멀티터치·UI 검증
├── requirements.txt
├── requirements-dev.txt
├── CHANGELOG.md
├── UPDATING.md
├── render.yaml
└── README.md
```

## 로컬 실행

Python 3.11 이상을 설치한 뒤 ZIP을 풀고 **requirements.txt가 있는 cheat-fps 폴더**에서 실행한다.

### Windows PowerShell

```powershell
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 1
```

### macOS / Linux

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 1
```

브라우저에서 http://localhost:8000 을 연다. index.html을 직접 더블클릭하면 서버 연결이 없으므로 플레이할 수 없다. 서버는 Ctrl+C로 종료한다.

## AI전

1. 메인 메뉴에서 AI전, 캐릭터와 원하는 치트를 선택한다.
2. **AI전 바로 시작**을 누르면 대기방/방 코드/준비 완료 과정 없이 3초 카운트다운 뒤 경기로 들어간다.
3. 혼자 플레이하면 인간 1명 + 아군 AI 2명 vs 적 AI 3명이다.
4. 2인 분할 화면을 체크하면 인간 2명 + 아군 AI 1명 vs 적 AI 3명이다. 두 사람은 각각 캐릭터와 치트를 선택할 수 있다.
5. AI는 아군과 적 모두 4종 치트를 사용하지 않는다.
6. 결과 화면의 **AI전 다시 플레이**는 곧바로 새 경기를 시작한다.

## 로컬 네트워크 3vs3

1. 한 기기에서 서버를 실행하고 로컬 대전 방을 만든다.
2. 다른 참가자는 같은 와이파이/LAN에서 `http://서버PC의사설IP:8000`을 연다.
3. 방장이 알려 준 6자리 방 코드를 입력해 참가한다.
4. 각자 팀을 선택한다. 팀별 최대 3명, 방 전체 최대 6명이다.
5. 6명 전원이 준비 완료하면 방장이 시작한다. 로컬 대전 시작 시 AI로 빈자리를 채우지 않는다.
6. Windows에서는 `ipconfig`, macOS에서는 네트워크 설정에서 서버 기기의 사설 IPv4 주소를 확인한다. 방화벽은 해당 사설 네트워크에서 TCP 8000 수신을 허용한다. 공유기의 게스트 네트워크/기기 격리는 연결을 막을 수 있다.

### 같은 기기에서 두 명

메인 메뉴에서 **이 기기에서 2인 분할 화면**을 체크한다. 키보드/마우스, 게임패드 또는 각 화면의 독립된 터치 조작으로 플레이한다. 로컬 대전에서는 2인씩 3개 기기를 사용하면 6명이 된다. 이 구현의 한 브라우저 분할 화면은 최대 2인이다. 6인 한 화면 분할은 지원하지 않는다. AI전 분할 화면은 두 사람 모두 BLUE팀이다.

Render에 올린 뒤에는 같은 URL + 방 코드로 인터넷 대전도 가능하다.

## 조작

| 기능 | 1P | 2P |
|---|---|---|
| 이동 | WASD | 방향키 |
| 시점 회전 | 마우스 또는 Q/E | J/L |
| 발사 | 마우스 좌클릭 또는 Space | Enter |
| 조준 | 마우스 우클릭 또는 왼쪽 Shift | 오른쪽 Shift |
| 재장전 | R | P |
| AIM / ESP / 무반동 / 무한탄창 | 1 / 2 / 3 / 4 | 7 / 8 / 9 / 0 |
| 관전 대상 전환 | V | V |
| 설정 | ESC 또는 우상단 메뉴 | 공통 |

게임 화면을 클릭하면 해당 플레이어의 마우스를 잠근다. 분할 화면에서는 클릭한 쪽의 시점을 조작한다. 브라우저에서 마우스 잠금을 지원하지 않으면 Q/E로 회전할 수 있다. 브라우저 오른쪽 클릭 메뉴는 게임 캔버스에서 차단한다.

게임패드: 왼쪽 스틱 이동, 오른쪽 스틱 좌우 회전, RT 발사, LT 조준, A 재장전, 방향패드 상/하/좌/우로 치트 네 개를 토글한다. 브라우저에서 인식시키려면 게임패드 버튼을 한 번 누른다. 표준 Gamepad 매핑을 사용한다.

모바일:

- 각 화면 왼쪽 **아날로그 조이스틱**으로 이동한다. 가운데에서 멀리 밀수록 빠르게 움직인다.
- 빈 화면을 **짧게 탭**하면 1발 발사한다.
- 빈 화면을 **드래그**하면 시점을 회전한다. 드래그한 터치는 발사로 처리하지 않는다.
- **발사 버튼을 누르는 동안** 연사한다. 이동·회전·발사에 여러 손가락을 동시에 사용할 수 있다.
- 조준 버튼은 토글, 장전 버튼은 재장전이다. 네 치트는 각 화면 아래에서 자유롭게 전환한다.
- 2인 분할의 양쪽에 조이스틱·발사·조준·장전·치트 버튼이 각각 있다. 터치만으로 두 사람이 동시에 플레이할 수 있다.
- 버튼을 길게 눌러도 텍스트 선택·복사 팝업이 뜨지 않도록 iOS 선택/콜아웃과 기본 제스처를 차단했다.
- 손가락을 떼거나 터치가 취소되거나 탭이 비활성화되면 입력을 해제한다. 모바일에서는 가로 화면을 사용하면 시야가 넓어진다.

## 경기 규칙

- 각 팀 3명, 최대 5라운드, 먼저 3승한 팀이 최종 승리한다.
- HP 100, 인간 소총 피해 25, AI 피해 16, 아군 피해 없음.
- HP 0이면 해당 라운드에서 즉시 탈락하고 살아 있는 아군을 관전한다. 라운드 중 부활하지 않는다.
- 3초 준비 → 120초 경기 → 라운드 종료 4초 → 다음 라운드 순서로 진행한다.
- 한 팀 전원 녹아웃 시 즉시 상대 승리.
- 120초 시간 종료 시 생존자 수, 팀 총 HP 순으로 비교한다. 모두 같으면 30초씩 연장하여 무승부 없이 최대 5라운드 규칙을 유지한다.
- 결과 화면에 모든 라운드 승자/이유, 최종 점수, 킬/데스를 표시한다.
- AI전은 결과에서 즉시 재경기한다. 로컬 대전은 방장이 대기실로 돌아가 재편성한다.
- 경기 중 연결이 끊기면 해당 자리를 치트 없는 AI가 이어받는다. 이미 탈락했다면 다음 라운드부터 활동한다. 재접속 시 진행 중인 자리를 되찾는 기능은 없다.
- 대기실에서 방장이 나가면 다른 인간 참가자가 방장을 이어받는다. 인간이 모두 나가면 방이 삭제된다.
- 설정 창을 열어도 다른 참가자와 AI 경기는 계속된다. 내 입력만 정지한다.

## 4종 공식 치트

| 토글 | 효과 |
|---|---|
| AIM | 조준을 누르는 동안 정면 약 ±37도 내, 벽에 가리지 않은 적에게 서버가 조준 방향을 스냅한다. 벽 관통 사격은 아니다. |
| ESP | 벽 뒤 적의 윤곽 박스·이름·HP 표시. 레이더는 시야 밖 적도 표시한다. |
| NO RECOIL | 서버의 연사 탄퍼짐/반동 증가를 제거한다. |
| ∞ AMMO | 탄약 소모와 재장전 대기를 무시하고 발사한다. 꺼지면 남아 있던 일반 탄창 상태로 돌아간다. |

치트는 대기실과 경기 중 자유롭게 켜고 끈다. 게이지·사용 횟수·쿨타임은 없다. 총 자체의 발사 간격은 존재한다. 캐릭터 외형은 scout / warden / rogue 세 종류다.

## 서버/동기화

- 서버 시뮬레이션 약 60Hz, 상태/입력 전송 약 30Hz. 화면은 requestAnimationFrame으로 갱신한다.
- 내 시점은 입력 즉시 반영한다. 내 이동은 클라이언트에서 예측하고 서버 위치에 부드럽게 보정한다. 다른 캐릭터는 75ms 버퍼로 위치·방향을 보간한다.
- 이동에 가속/감속과 아날로그 입력을 적용했다. 대각선 속도가 더 빨라지지 않는다.
- 벽 재질·총기·캐릭터 이미지를 캐시해 반복 그리기 작업을 줄였다. 캐릭터는 8방향 외형·8단계 걷기 동작, 장비·헬멧·소총, 총기는 조준·반동·재장전·발사광을 표현한다.
- 클라이언트는 전진/좌우/시선 방향/사격 입력을 전송한다. 좌표·피해·킬·승패를 직접 정하지 않는다.
- 서버가 이동 속도, 벽 충돌, 시선, 사격 간격, 탄창, 재장전, 히트, 녹아웃을 계산한다.
- 적 위치는 ESP 구현을 위해 상태에 포함된다. 경쟁용 은닉/안티치트 제품이 아니라 공식 치트 게임이다.
- 입력이 0.4초 이상 끊기면 이동/발사를 정지한다. 큰 패킷과 과도한 메시지를 제한한다.
- 캐릭터끼리는 이동을 막지 않는다. 2.5D 평면 FPS로 상하 조준/점프는 없다.
- 방/점수는 메모리 저장이다. 서버 재시작·배포 시 초기화된다. 한 프로세스/한 인스턴스로 운영한다. 다중 worker 또는 수평 확장을 켜면 서로 다른 방 메모리로 접속할 수 있으므로 사용하지 않는다.
- 계정·랭킹·영구 저장은 이 기획 범위에 포함하지 않는다.

## Render 배포

프로젝트 **폴더 안의 내용**을 GitHub 저장소 루트에 올린다. ZIP 파일만 올리는 것이 아니라 압축을 푼 소스가 있어야 한다.

### Blueprint 사용

1. Render에서 New → Blueprint를 선택한다.
2. 소스가 있는 GitHub 저장소를 연결한다.
3. 루트의 render.yaml을 적용하고 배포한다.
4. 완료 후 생성된 HTTPS 주소를 연다.

### Web Service 수동 설정

- Runtime: Python 3
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1`
- Health Check Path: `/health`
- Python version: `3.11.11` (render.yaml의 PYTHON_VERSION)
- Static Site가 아니라 **Web Service**로 생성한다.

프론트엔드와 WebSocket을 동일한 서비스에서 제공하므로 별도 백엔드 URL이나 API 키를 설정할 필요가 없다. HTTPS 접속에서는 클라이언트가 자동으로 wss://를 사용한다. 무료 서비스의 유휴 중단 뒤 첫 접속은 시작 시간이 필요할 수 있다. 배포/인스턴스 교체 시 연결 중인 경기는 종료된다.

공식 문서:
- https://render.com/docs/deploy-fastapi
- https://render.com/docs/websocket

## 테스트

서버 검사:

```bash
python -m pip install -r requirements-dev.txt
python -m pytest tests/test_game.py -q
```

브라우저 검사 (선택):

```bash
python -m playwright install chromium
CHEAT_FPS_BROWSER_TESTS=1 python -m pytest tests/test_browser.py -q
```

Windows PowerShell에서는 환경 변수를 다음과 같이 설정한다.

```powershell
$env:CHEAT_FPS_BROWSER_TESTS="1"
python -m pytest tests/test_browser.py -q
```

서버 검사에는 AI 완주·치트·충돌·팀/라운드 판정, 실제 6개 WebSocket 접속, AI 바로 시작·재경기·2인 설정을 포함한다. 브라우저 검사는 실제 Canvas, WebSocket과 Chromium 터치 이벤트를 사용하여 동시 조이스틱, 독립 발사, 탭/드래그 구분, 길게 누르기, 취소/탭 비활성화, 화면 크기 변경, 설정, 결과/재경기와 2인씩 3개 클라이언트의 3vs3를 확인한다. 입력 검사의 재현성을 위해 **테스트 서버에서만** AI 이동/사격을 정지시킨다.

실제 iPad Safari와 게임패드 하드웨어는 제작 환경에서 직접 조작하지 못했다. 게임은 기존과 같은 2.5D 평면 FPS로, 시점 회전은 좌우이며 상하 조준/점프는 없다. Render 재배포는 저장소에 수정 파일을 반영한 뒤 진행한다.

제작 환경 확인: 서버 테스트 13개와 실제 Chromium 브라우저 테스트 4개 통과. JavaScript 구문 검사 통과. 화면을 렌더링해 분할 조작 배치와 캐릭터 외형도 확인했다.
````

## UPDATING.md

````markdown
# 기존 게임 업데이트

ZIP을 풀면 `backend/`, `frontend/`, `requirements.txt`, `render.yaml` 등이 들어 있다. 폴더 안의 파일을 모두 한곳에 옮기지 말고 경로를 유지한다.

## 반드시 바꿀 게임 파일 5개

| GitHub의 파일 경로 | ZIP에서 가져올 파일 |
|---|---|
| backend/main.py | backend/main.py |
| backend/game.py | backend/game.py |
| frontend/index.html | frontend/index.html |
| frontend/style.css | frontend/style.css |
| frontend/game.js | frontend/game.js |

테스트와 설명 파일도 함께 교체하면 전체 프로젝트가 일치한다. 설치/시작 명령어는 기존과 같다.

## 컴퓨터에서 GitHub 업로드

저장소의 루트에서 Add file → Upload files를 선택하고 압축을 푼 **backend 폴더와 frontend 폴더**를 드래그한다. 업로드 목록에 `backend/main.py`, `frontend/game.js`처럼 경로가 표시되는지 확인하고 Commit changes를 누른다. 다른 루트 파일도 같은 위치에 올린다.

## iPad에서 GitHub 편집

파일 선택 업로드가 폴더 경로를 유지하지 못하면, 기존 파일을 하나씩 편집한다.

1. GitHub 저장소에서 `backend` 폴더 → `main.py`를 연다.
2. 연필(Edit this file)을 누른다.
3. ZIP의 `backend/main.py` 전체 내용을 복사해 기존 내용을 전부 교체한다.
4. Commit changes를 누른다.
5. 위 표의 나머지 네 파일도 각각 같은 경로에서 교체한다.

처음부터 파일을 만들 때는 Add file → Create new file의 파일명에 `backend/main.py`처럼 **폴더/파일명**을 입력한다. `backend`라는 이름의 빈 파일을 만들면 폴더가 되지 않는다.

## Render

- Root Directory: `requirements.txt`가 저장소 루트에 있으면 비워 둔다.
- Build Command: `pip install -r requirements.txt`
- Start Command: 아래 **한 줄만** 입력한다. 기존 명령을 먼저 모두 지워 중복되지 않도록 한다.

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
```

GitHub에 커밋한 뒤 Render에서 Manual Deploy → Deploy latest commit을 실행한다. 자동 배포가 켜져 있으면 커밋 후 자동으로 진행된다. 완료 후 게임 탭을 새로고침한다. 메뉴의 `AI전 바로 시작`과 원형 조이스틱이 보이면 새 버전이다.

`render.yaml`, `requirements.txt`, `backend/__init__.py`를 포함한 폴더 구조를 유지한다. 새 ZIP만 GitHub에 올리면 실행 소스가 바뀌지 않는다.
````

## backend/__init__.py

````python
"""Cheat FPS server package."""
````

## backend/game.py

````python
"""Authoritative 60 Hz arena simulation. No client damage or position is trusted."""
import math
import random
import secrets
from collections import deque
from dataclasses import dataclass, field, asdict

MAP = [
 '11111111111111111111',
 '10000000000000000001',
 '10000000000000000001',
 '10001100000000110001',
 '10001100000000110001',
 '10000000011000000001',
 '10000000011000000001',
 '10001100000000110001',
 '10001100000000110001',
 '10000000000000000001',
 '10000000000000000001',
 '11111111111111111111',
]
CHEATS = ('aim', 'esp', 'recoil', 'ammo')
MOVE_SPEED = 3.6
MOVE_ACCEL = 22.0

def angle(a):
    return (a + math.pi) % (2 * math.pi) - math.pi

def wall(x, y):
    return not (0 <= x < 20 and 0 <= y < 12) or MAP[int(y)][int(x)] == '1'

def clear(x, y, xx, yy):
    d = math.hypot(xx-x, yy-y)
    n = max(1, int(d / .07))
    return all(not wall(x+(xx-x)*i/n, y+(yy-y)*i/n) for i in range(n+1))

def move(p, dx, dy):
    for axis, delta in [('x', dx), ('y', dy)]:
        x, y = p.x, p.y
        if axis == 'x': x += delta
        else: y += delta
        if all(not wall(x+a, y+b) for a in (-.22,.22) for b in (-.22,.22)):
            setattr(p, axis, getattr(p, axis)+delta)

def walk(p, f, s, dt, aiming=False):
    """Accelerate along a normalized analog input, with friction on release."""
    length = max(1, math.hypot(f, s))
    speed = 2.6 if aiming else MOVE_SPEED
    tx = (math.cos(p.yaw)*f-math.sin(p.yaw)*s)*speed/length
    ty = (math.sin(p.yaw)*f+math.cos(p.yaw)*s)*speed/length
    blend = 1-math.exp(-MOVE_ACCEL*dt)
    p.vx += (tx-p.vx)*blend
    p.vy += (ty-p.vy)*blend
    ox, oy = p.x, p.y
    move(p, p.vx*dt, p.vy*dt)
    if abs(p.x-ox) < .00001: p.vx = 0
    if abs(p.y-oy) < .00001: p.vy = 0

@dataclass
class Player:
    id: str
    name: str
    team: int
    bot: bool = False
    skin: str = 'scout'
    x: float = 2.5
    y: float = 2.5
    yaw: float = 0
    vx: float = 0
    vy: float = 0
    seq: int = 0
    hp: int = 100
    kills: int = 0
    deaths: int = 0
    ammo: int = 30
    reload: float = 0
    cooldown: float = 0
    kick: float = 0
    shots: int = 0
    hit: int = 0
    ready: bool = False
    cheats: dict = field(default_factory=lambda:dict.fromkeys(CHEATS,False))
    inp: dict = field(default_factory=dict)
    stale: float = 0
    think: float = 0
    route: list = field(default_factory=list)

class Room:
    def __init__(self, code, mode):
        self.code, self.mode = code, mode
        self.players = {}
        self.host = None
        self.state = 'LOBBY'
        self.timer = 0
        self.round = 0
        self.score = [0,0]
        self.history = []
        self.log = []
        self.message = ''
        self.quick = False

    def add(self, name, team=0, bot=False):
        if self.state != 'LOBBY': raise ValueError('진행 중인 방입니다.')
        if self.mode == 'ai' and not bot: team = 0
        if sum(p.team == team for p in self.players.values()) >= 3:
            if self.mode == 'ai': raise ValueError('플레이어 팀이 가득 찼습니다.')
            team = 1-team
        if sum(p.team == team for p in self.players.values()) >= 3:
            raise ValueError('방이 가득 찼습니다.')
        p = Player(secrets.token_hex(4), name[:16] or '치터', team, bot)
        self.players[p.id] = p
        if self.host is None and not bot: self.host = p.id
        return p

    def remove(self, pid):
        p = self.players.get(pid)
        if not p: return
        if self.state in ('PLAYING','COUNTDOWN','ROUND_END'):
            # Keep the six-player roster but never give replacement AI cheats.
            p.bot = True
            p.name = p.name[:12] + '·AI'
            p.cheats = dict.fromkeys(CHEATS,False)
            p.inp = {}
        else: del self.players[pid]
        humans = [q.id for q in self.players.values() if not q.bot]
        if self.host == pid: self.host = humans[0] if humans else None

    def start(self):
        if self.state != 'LOBBY': raise ValueError('대기실에서만 시작할 수 있습니다.')
        humans = [p for p in self.players.values() if not p.bot]
        if not all(p.ready for p in humans): raise ValueError('모든 플레이어가 준비해야 합니다.')
        if self.mode == 'local' and len(humans) != 6: raise ValueError('로컬 대전은 6명이 필요합니다. 기기당 2인 접속도 가능합니다.')
        if self.mode == 'ai':
            for team in (0,1):
                while sum(p.team == team for p in self.players.values()) < 3:
                    i = sum(p.team == team for p in self.players.values())
                    self.add('GUARD '+str(len(self.players)+1),team,True).skin = ('scout','warden','rogue')[i]
        self.score, self.history, self.round, self.log = [0,0], [], 0, []
        for p in self.players.values(): p.kills = p.deaths = 0
        self.new_round()

    def new_round(self):
        self.round += 1
        self.state, self.timer = 'COUNTDOWN', 3
        for team in (0,1):
            for i,p in enumerate(q for q in self.players.values() if q.team == team):
                p.x,p.y,p.yaw = (2.5 if team == 0 else 17.5), 2.5+i*3, (0 if team == 0 else math.pi)
                p.hp,p.ammo,p.reload,p.cooldown,p.kick = 100,30,0,0,0
                p.inp,p.route = {},[]
                p.vx,p.vy,p.stale = 0,0,0
        self.message = f'ROUND {self.round}'

    def finish(self, winner, reason):
        if self.state != 'PLAYING': return
        self.score[winner] += 1
        self.history.append({'round':self.round,'winner':winner,'reason':reason})
        self.message = ('BLUE' if winner == 0 else 'RED')+' 승리 · '+reason
        self.state, self.timer = ('MATCH_END',0) if self.score[winner] == 3 else ('ROUND_END',4)

    def command(self, p, data):
        op = data.get('type')
        if op == 'input':
            def num(key):
                v = data.get(key,0)
                return max(-1,min(1,float(v))) if isinstance(v,(int,float)) and math.isfinite(v) else 0
            p.inp = {k:num(k) for k in ('f','s','turn')}
            p.inp.update({k:data.get(k) is True for k in ('fire','aim','reload')})
            yaw = data.get('yaw')
            if isinstance(yaw,(int,float)) and math.isfinite(yaw) and not p.bot and p.hp > 0:
                p.yaw = angle(yaw)
            seq = data.get('seq')
            if isinstance(seq,int) and 0 <= seq <= 2**53: p.seq = max(p.seq,seq)
            p.stale = 0
        elif op == 'toggle' and data.get('key') in CHEATS and not p.bot:
            p.cheats[data['key']] = not p.cheats[data['key']]
        elif op == 'custom' and self.state == 'LOBBY':
            p.name = str(data.get('name',p.name))[:16] or '치터'
            if data.get('skin') in ('scout','warden','rogue'): p.skin = data['skin']
            team = data.get('team',p.team)
            if team in (0,1) and team != p.team and self.mode == 'local':
                if sum(q.team == team for q in self.players.values()) >= 3: raise ValueError('그 팀은 가득 찼습니다.')
                p.team = team
            p.ready = False
        elif op == 'ready' and self.state == 'LOBBY': p.ready = not p.ready
        elif op == 'start' and p.id == self.host: self.start()
        elif op == 'lobby' and p.id == self.host and self.state == 'MATCH_END':
            self.players = {i:q for i,q in self.players.items() if not q.bot}
            for q in self.players.values(): q.ready = False
            self.state = 'LOBBY'
        elif op == 'rematch' and p.id == self.host and self.state == 'MATCH_END' and self.quick:
            self.players = {i:q for i,q in self.players.items() if not q.bot}
            for q in self.players.values(): q.ready = True
            self.state = 'LOBBY'
            self.start()

    def path(self, p, target):
        start, end = (int(p.x),int(p.y)), (int(target.x),int(target.y))
        queue, prev = deque([start]), {start:None}
        while queue:
            v = queue.popleft()
            if v == end: break
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                w = v[0]+dx,v[1]+dy
                if w not in prev and not wall(w[0]+.5,w[1]+.5):
                    prev[w] = v
                    queue.append(w)
        route = []
        if end in prev:
            while end != start:
                route.append((end[0]+.5,end[1]+.5))
                end = prev[end]
        return route[::-1]

    def ai(self,p,dt):
        enemies = [q for q in self.players.values() if q.team != p.team and q.hp > 0]
        if not enemies: return
        visible = [q for q in enemies if clear(p.x,p.y,q.x,q.y)]
        target = min(visible or enemies,key=lambda q:math.hypot(q.x-p.x,q.y-p.y))
        p.think -= dt
        if p.think <= 0:
            p.route = self.path(p,target)
            p.think = .65
        if visible:
            desired = math.atan2(target.y-p.y,target.x-p.x)
            error = angle(desired-p.yaw)
            p.yaw += max(-1.7*dt,min(1.7*dt,error))
            p.inp = {'fire':abs(error)<.16,'aim':False}
            if math.hypot(target.x-p.x,target.y-p.y)>5:
                move(p,math.cos(p.yaw)*1.6*dt,math.sin(p.yaw)*1.6*dt)
        else:
            p.inp = {}
            if p.route:
                x,y = p.route[0]
                d = math.hypot(x-p.x,y-p.y)
                if d < .15: p.route.pop(0)
                else:
                    desired = math.atan2(y-p.y,x-p.x)
                    p.yaw = angle(p.yaw+max(-2.8*dt,min(2.8*dt,angle(desired-p.yaw))))
                    move(p,(x-p.x)/d*2.0*dt,(y-p.y)/d*2.0*dt)

    def shoot(self,p):
        if p.cooldown > 0 or (p.reload > 0 and not p.cheats['ammo']): return
        if not p.cheats['ammo'] and p.ammo <= 0:
            p.reload = 1.5
            return
        p.cooldown = .30 if p.bot else .115
        p.shots += 1
        if not p.cheats['ammo']: p.ammo -= 1
        spread = random.uniform(-.09,.09) if p.bot else (0 if p.cheats['recoil'] else random.uniform(-p.kick,p.kick))
        direction = p.yaw + spread
        candidates = []
        for q in self.players.values():
            if q.hp <= 0 or q.team == p.team: continue
            d = math.hypot(q.x-p.x,q.y-p.y)
            if abs(angle(math.atan2(q.y-p.y,q.x-p.x)-direction)) <= math.atan2(.28,d) and clear(p.x,p.y,q.x,q.y):
                candidates.append((d,q))
        if not p.cheats['recoil']: p.kick = min(.13,p.kick+.022)
        if candidates:
            q = min(candidates,key=lambda z:z[0])[1]
            q.hp = max(0,q.hp-(16 if p.bot else 25))
            p.hit += 1
            if q.hp == 0:
                p.kills += 1
                q.deaths += 1
                self.log.append({'killer':p.name,'victim':q.name,'team':p.team})
                self.log = self.log[-6:]

    def tick(self,dt):
        if self.state in ('COUNTDOWN','ROUND_END'):
            self.timer -= dt
            if self.timer <= 0:
                if self.state == 'COUNTDOWN': self.state,self.timer = 'PLAYING',120
                else: self.new_round()
            return
        if self.state != 'PLAYING': return
        self.timer -= dt
        for p in list(self.players.values()):
            if p.hp <= 0: continue
            p.cooldown = max(0,p.cooldown-dt)
            p.kick = max(0,p.kick-dt*.055)
            if p.reload > 0:
                p.reload = max(0,p.reload-dt)
                if p.reload == 0: p.ammo = 30
            if p.bot:
                ox,oy = p.x,p.y
                self.ai(p,dt)
                p.vx,p.vy = (p.x-ox)/dt,(p.y-oy)/dt
            else:
                p.stale += dt
                if p.stale > .4: p.inp = {}
                p.yaw = angle(p.yaw+p.inp.get('turn',0)*3.2*dt)
                f,s = p.inp.get('f',0),p.inp.get('s',0)
                walk(p,f,s,dt,p.inp.get('aim'))
            if p.cheats['aim'] and p.inp.get('aim'):
                targets = [q for q in self.players.values() if q.team != p.team and q.hp > 0 and clear(p.x,p.y,q.x,q.y) and abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw)) < .65]
                if targets:
                    q = min(targets,key=lambda q:abs(angle(math.atan2(q.y-p.y,q.x-p.x)-p.yaw)))
                    p.yaw = math.atan2(q.y-p.y,q.x-p.x)
            if p.inp.get('reload') and not p.cheats['ammo'] and p.ammo < 30 and p.reload == 0: p.reload = 1.5
            if p.inp.get('fire'): self.shoot(p)
        alive = [sum(p.hp>0 and p.team==t for p in self.players.values()) for t in (0,1)]
        if 0 in alive: self.finish(0 if alive[0] else 1,'전원 녹아웃')
        elif self.timer <= 0:
            values = [(alive[t],sum(p.hp for p in self.players.values() if p.team==t)) for t in (0,1)]
            if values[0] != values[1]: self.finish(0 if values[0]>values[1] else 1,'시간 종료 · 생존자/체력 우세')
            else:
                self.timer = 30
                self.message = '동률 · 30초 연장전'

    def snapshot(self):
        players = []
        for p in self.players.values():
            d = asdict(p)
            for k in ('inp','route','think','stale'): d.pop(k)
            players.append(d)
        return dict(type='state',code=self.code,mode=self.mode,quick=self.quick,host=self.host,state=self.state,timer=max(0,self.timer),round=self.round,score=self.score,history=self.history,log=self.log,message=self.message,players=players)
````

## backend/main.py

````python
import asyncio
import contextlib
import json
import secrets
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from .game import Room, MAP

rooms = {}
peers = {}
ROOT = Path(__file__).resolve().parent.parent / 'frontend'

async def simulation():
    loop = asyncio.get_running_loop()
    last = loop.time()
    accumulator = 0
    while True:
        await asyncio.sleep(1/60)
        now = loop.time()
        dt,last = min(.1,now-last),now
        for room in list(rooms.values()): room.tick(dt)
        accumulator += dt
        if accumulator >= 1/30:
            accumulator %= 1/30
            snapshots = {code:room.snapshot() for code,room in rooms.items()}
            for ws,peer in list(peers.items()):
                q = peer['queue']
                if q.full():
                    with contextlib.suppress(asyncio.QueueEmpty): q.get_nowait()
                q.put_nowait(snapshots[peer['room'].code])

@asynccontextmanager
async def lifespan(app):
    task = asyncio.create_task(simulation())
    yield
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError): await task

app = FastAPI(lifespan=lifespan)
app.mount('/static', StaticFiles(directory=ROOT), name='static')

@app.get('/')
async def index(): return FileResponse(ROOT / 'index.html',headers={'Cache-Control':'no-cache'})

@app.get('/health')
async def health(): return {'status':'ok','rooms':len(rooms)}

async def sender(ws,queue):
    while True:
        data = await queue.get()
        await asyncio.wait_for(ws.send_json(data),timeout=5)

@app.websocket('/ws')
async def socket(ws:WebSocket):
    await ws.accept()
    room = None
    owned = []
    task = None
    try:
        raw = await asyncio.wait_for(ws.receive_text(),10)
        if len(raw)>4096: return
        hello = json.loads(raw)
        code = str(hello.get('code','')).strip().upper()
        if code:
            room = rooms.get(code)
            if not room: raise ValueError('방 코드를 확인해 주세요.')
        else:
            if len(rooms)>=100: raise ValueError('서버가 가득 찼습니다.')
            code = secrets.token_hex(3).upper()
            while code in rooms: code = secrets.token_hex(3).upper()
            room = Room(code,'local' if hello.get('mode')=='local' else 'ai')
            rooms[code] = room
        count = 2 if hello.get('split') is True else 1
        free = (3 if room.mode=='ai' else 6)-len([p for p in room.players.values() if not p.bot])
        if count > free: raise ValueError('요청한 인원만큼 빈 자리가 없습니다.')
        for i in range(count):
            p = room.add(str(hello.get('name','치터'))+(f' P{i+1}' if count>1 else ''),i if count>1 else 0)
            skins = hello.get('skins',[])
            if isinstance(skins,list) and i < len(skins) and skins[i] in ('scout','warden','rogue'): p.skin = skins[i]
            loadouts = hello.get('cheats',[])
            if isinstance(loadouts,list) and i < len(loadouts) and isinstance(loadouts[i],dict):
                p.cheats = {key:loadouts[i].get(key) is True for key in p.cheats}
            owned.append(p.id)
        # AI quick play still has a private server match; there is no room UI.
        if room.mode == 'ai' and hello.get('quick') is True and not hello.get('code'):
            room.quick = True
            for pid in owned: room.players[pid].ready = True
            room.start()
        await ws.send_json({'type':'welcome','ids':owned,'map':MAP,'code':code,'quick':room.quick})
        queue = asyncio.Queue(maxsize=3)
        peers[ws] = {'room':room,'queue':queue}
        task = asyncio.create_task(sender(ws,queue))
        window,count_msg = asyncio.get_running_loop().time(),0
        while True:
            raw = await ws.receive_text()
            if len(raw)>4096: await ws.close(code=1009); break
            now = asyncio.get_running_loop().time()
            if now-window>=1: window,count_msg=now,0
            count_msg += 1
            if count_msg>150: continue
            try:
                data = json.loads(raw)
                if not isinstance(data,dict): continue
                if data.get('type') == 'ping':
                    if not queue.full(): queue.put_nowait({'type':'pong','sent':data.get('sent')})
                    continue
                pid = data.get('id',owned[0])
                if pid in owned and pid in room.players: room.command(room.players[pid],data)
            except (ValueError,TypeError) as e:
                if not queue.full(): queue.put_nowait({'type':'error','message':str(e)})
    except (WebSocketDisconnect, asyncio.TimeoutError): pass
    except (ValueError,TypeError,AttributeError) as e:
        with contextlib.suppress(Exception): await ws.send_json({'type':'error','message':str(e)})
    finally:
        peers.pop(ws,None)
        if task:
            task.cancel()
            with contextlib.suppress(asyncio.CancelledError,Exception): await task
        if room:
            for pid in owned: room.remove(pid)
            if not any(not p.bot for p in room.players.values()): rooms.pop(room.code,None)
        with contextlib.suppress(Exception): await ws.close()
````

## frontend/game.js

````javascript
'use strict';
// Cheat FPS 0.2.0: frame-rate camera, analog controls and authoritative server.
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d', {alpha:false});
const CHEATS = ['aim','esp','recoil','ammo'];
const LABELS = ['AIM','ESP','NO RECOIL','∞ AMMO'];
const keys = new Set(), local = new Map(), motion = new Map(), samples = new Map();
const effects = new Map(), padEdges = new Map(), spriteCache = new Map(), wallCache = new Map(), weaponCache = new Map();
let ws=null, state=null, ids=[], map=[], phase='', controlIds='', lobbyStamp='';
let closedByUser=false, audio=null, toastTimer, lastFrame=performance.now(), snapshotAt=0;
let rtt=60, pingAt=0, lastSend=0, seq=0, mouseSlot=0, frameMs=16;
let options={sensitivity:1,volume:.25,quality:4};
try { Object.assign(options,JSON.parse(localStorage.getItem('cheat-fps-options')||'{}')); } catch {}
options.sensitivity=Math.max(.3,Math.min(3,Number(options.sensitivity)||1));
options.quality=[2,4,6].includes(Number(options.quality))?Number(options.quality):4;
const touchDevice = matchMedia('(any-pointer:coarse)').matches || navigator.maxTouchPoints>0;
document.body.classList.toggle('touch-device',touchDevice);
const loadouts = [Object.fromEntries(CHEATS.map(k=>[k,false])),Object.fromEntries(CHEATS.map(k=>[k,false]))];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const mix=(a,b,t)=>a+(b-a)*t;
function control(i) {
    if(!local.has(i)) local.set(i,{f:0,s:0,turn:0,ads:false,fire:new Set(),fireUntil:0,reloadUntil:0,look:new Map(),stick:null,view:0,mouseFire:false,mouseAim:false,input:{f:0,s:0,turn:0,aim:false,fire:false,reload:false}});
    return local.get(i);
}
function active(){return state&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)&&!$('settings').open;}
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',3500);}
function send(data,id){if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<65536)ws.send(JSON.stringify({...data,id:id||ids[0]}));}
function sound(hit=false){
    if(!audio||options.volume<=0)return;
    const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
    o.type=hit?'sine':'sawtooth';o.frequency.setValueAtTime(hit?960:160,t);o.frequency.exponentialRampToValueAtTime(hit?600:45,t+.075);
    g.gain.setValueAtTime(options.volume*.11,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);
    o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.11);
}
function audioOn(){try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();}catch{}}
function resetInput(){
    keys.clear();
    for(const c of local.values()){
        c.f=c.s=c.turn=0;c.ads=c.mouseFire=c.mouseAim=false;c.fire.clear();c.fireUntil=c.reloadUntil=0;c.look.clear();c.stick=null;
        c.input={f:0,s:0,turn:0,aim:false,fire:false,reload:false};
    }
    document.querySelectorAll('.stick-knob').forEach(el=>el.style.transform='translate(0,0)');
    document.querySelectorAll('.pressed,.joystick.active').forEach(el=>el.classList.remove('pressed','active'));
    ids.forEach(id=>send({type:'input',f:0,s:0,turn:0,fire:false,aim:false,reload:false},id));
}
function showScreen(name){
    ['menu','lobby','playUI','result'].forEach(id=>$(id).classList.toggle('hidden',id!==name));
    document.body.classList.toggle('playing',name==='playUI');
    document.body.classList.toggle('split-play',name==='playUI'&&ids.length===2);
}
function syncMenu(){
    const ai=$('mode').value==='ai',split=$('split').checked;
    $('create').textContent=ai?'AI전 바로 시작 →':'로컬 대전 방 만들기 →';
    $('quickCustom').classList.toggle('hidden',!ai);
    $('skinSecond').classList.toggle('hidden',!split);
    $('joinRow').classList.toggle('hidden',ai);
    $('quickCheats').innerHTML=[0,...(split?[1]:[])].map(i=>`<span>P${i+1}</span>`+CHEATS.map((k,j)=>`<button data-loadout="${i}" data-cheat="${k}" class="${loadouts[i][k]?'on':''}">${LABELS[j]}</button>`).join('')).join('');
}
$('mode').onchange=$('split').onchange=syncMenu;
$('quickCheats').onclick=e=>{const b=e.target.closest('[data-loadout]');if(!b)return;loadouts[+b.dataset.loadout][b.dataset.cheat]=!loadouts[+b.dataset.loadout][b.dataset.cheat];syncMenu();};
syncMenu();
function connect(join=false){
    const old=ws;ws=null;old?.close();resetInput();closedByUser=false;audioOn();state=null;phase='';ids=[];seq=0;
    samples.clear();motion.clear();effects.clear();local.clear();controlIds='';lobbyStamp='';spriteCache.clear();
    showScreen('menu');$('create').disabled=$('join').disabled=true;toast('경기를 준비하는 중…');
    const socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);ws=socket;
    socket.onopen=()=>socket.send(JSON.stringify({mode:$('mode').value,code:join?$('code').value.trim():'',name:$('name').value,split:$('split').checked,quick:!join&&$('mode').value==='ai',skins:[$('skin0').value,$('skin1').value],cheats:loadouts}));
    socket.onmessage=e=>{
        if(ws!==socket)return;
        const d=JSON.parse(e.data);
        if(d.type==='welcome'){ids=d.ids;map=d.map;buildControls();toast(d.quick?'AI전 시작 · 화면 드래그 회전 / 탭 발사':`방 ${d.code} · 접속 완료`);}
        else if(d.type==='error')toast(d.message);
        else if(d.type==='pong'&&typeof d.sent==='number')rtt=mix(rtt,clamp(performance.now()-d.sent,0,600),.25);
        else if(d.type==='state')receive(d);
    };
    socket.onerror=()=>toast('서버 연결 실패. 잠시 후 다시 시작해 주세요.');
    socket.onclose=()=>{if(ws!==socket)return;resetInput();state=null;$('create').disabled=$('join').disabled=false;showScreen('menu');document.exitPointerLock?.();if(!closedByUser)toast('연결이 종료되었다. 다시 게임을 시작해 주세요.');};
}
$('create').onclick=()=>connect();
$('join').onclick=()=>{$('code').value.trim()?connect(true):toast('방 코드를 입력해 주세요.');};
function leave(){closedByUser=true;resetInput();const old=ws;ws=null;old?.close();state=null;document.exitPointerLock?.();$('settings').close();$('create').disabled=$('join').disabled=false;showScreen('menu');}
document.querySelectorAll('.leave').forEach(b=>b.onclick=leave);
$('exit').onclick=()=>{leave();toast('게임을 종료했다. 탭을 닫으면 된다.');};
function settings(){resetInput();document.exitPointerLock?.();['sensitivity','volume','quality'].forEach(k=>$(k).value=options[k]);$('settings').showModal();}
$('pause').onclick=$('settingsOpen').onclick=settings;
$('settingsClose').onclick=()=>{$('settings').close();};
$('settings').addEventListener('cancel',resetInput);
['sensitivity','volume','quality'].forEach(k=>$(k).oninput=()=>{options[k]=Number($(k).value);try{localStorage.setItem('cheat-fps-options',JSON.stringify(options));}catch{}});
$('start').onclick=()=>send({type:'start'});
$('again').onclick=()=>send({type:state?.quick?'rematch':'lobby'});
function toggles(p){return CHEATS.map((k,i)=>`<button class="${p.cheats[k]?'on':''}" data-toggle="${k}" data-id="${p.id}">${LABELS[i]}</button>`).join('');}
function lobby(d){
    $('roomCode').textContent=d.code;
    $('modeInfo').textContent='인간 3 vs 3 · 다른 기기에서 같은 주소와 방 코드로 참가한다.';
    const stamp=JSON.stringify(d.players.map(p=>[p.id,p.name,p.team,p.skin,p.ready,p.cheats]));
    $('start').disabled=!ids.includes(d.host);
    if(stamp===lobbyStamp)return;
    const editing=$('custom').contains(document.activeElement)&&['INPUT','SELECT'].includes(document.activeElement.tagName);
    $('roster').innerHTML=[0,1].map(t=>`<div class="card ${t?'red':'blue'}"><h3>${t?'RED':'BLUE'} / ${d.players.filter(p=>p.team===t).length} OF 3</h3>${d.players.filter(p=>p.team===t).map(p=>`<div class="member"><span>${esc(p.name)} ${p.id===d.host?'♛':''}</span><span>${p.ready?'준비 완료':'편성 중'}</span></div>`).join('')}</div>`).join('');
    if(editing)return;
    lobbyStamp=stamp;
    $('custom').innerHTML=ids.map((id,i)=>{const p=d.players.find(p=>p.id===id);if(!p)return '';return `<div class="card"><h3>PLAYER ${i+1}</h3><label>콜사인<input data-name="${id}" value="${esc(p.name)}" maxlength="16"></label><label>캐릭터<select data-skin="${id}">${['scout','warden','rogue'].map(s=>`<option ${p.skin===s?'selected':''}>${s}</option>`).join('')}</select></label><label>팀<select data-team="${id}" ${d.mode==='ai'?'disabled':''}><option value="0" ${p.team===0?'selected':''}>BLUE</option><option value="1" ${p.team===1?'selected':''}>RED</option></select></label><div class="toggles">${toggles(p)}</div><button data-ready="${id}" class="${p.ready?'on':''}">${p.ready?'준비 취소':'준비 완료'}</button></div>`;}).join('');
    $('controlsInfo').textContent='각 팀 3명, 모두 준비 완료한 뒤 방장이 경기 시작.';
}
$('custom').onchange=e=>{
    const el=e.target,id=el.dataset.name||el.dataset.skin||el.dataset.team;if(!id)return;
    const c=el.closest('.card');send({type:'custom',name:c.querySelector('input').value,skin:c.querySelector('[data-skin]').value,team:Number(c.querySelector('[data-team]').value)},id);
};
$('custom').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.ready)send({type:'ready'},b.dataset.ready);if(b.dataset.toggle)send({type:'toggle',key:b.dataset.toggle},b.dataset.id);};
function results(d){
    $('resultTitle').textContent=`${d.score[0]>d.score[1]?'BLUE':'RED'} TEAM VICTORY`;$('finalScore').textContent=d.score.join(' : ');
    $('rounds').innerHTML=d.history.map(h=>`<span>R${h.round} · ${h.winner?'RED':'BLUE'}<br><small>${esc(h.reason)}</small></span>`).join('');
    $('stats').innerHTML='<table><thead><tr><th>플레이어</th><th>팀</th><th>킬</th><th>데스</th></tr></thead><tbody>'+d.players.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.team?'RED':'BLUE'}</td><td>${p.kills}</td><td>${p.deaths}</td></tr>`).join('')+'</tbody></table>';
    $('again').disabled=!ids.includes(d.host);$('again').textContent=d.quick?'AI전 다시 플레이':'대기실로 / 재경기';
}
function receive(d){
    const now=performance.now(),oldRound=state?.round;
    const respawn=oldRound!==d.round || (state?.state==='MATCH_END'&&d.state==='COUNTDOWN');
    state=d;snapshotAt=now;
    if(phase!==d.state){phase=d.state;resetInput();showScreen(phase==='LOBBY'?'lobby':phase==='MATCH_END'?'result':'playUI');if(phase==='LOBBY'){lobbyStamp='';document.exitPointerLock?.();}if(phase==='MATCH_END'){document.exitPointerLock?.();results(d);}}
    for(const p of d.players){
        const list=samples.get(p.id)||[];if(respawn)list.length=0;list.push({...p,time:now});if(list.length>12)list.shift();samples.set(p.id,list);
        const prev=effects.get(p.id);
        if(prev){if(p.shots>prev.shots){prev.shotAt=now;if(ids.includes(p.id))sound();}if(p.hit>prev.hit){prev.hitAt=now;if(ids.includes(p.id))sound(true);}if(p.hp<prev.hp)prev.hurtAt=now;}
        effects.set(p.id,{...prev,shots:p.shots,hit:p.hit,hp:p.hp});
        const slot=ids.indexOf(p.id);
        if(slot>=0){
            let m=motion.get(p.id);
            if(!m||respawn){m={x:p.x,y:p.y,yaw:p.yaw,vx:0,vy:0,kick:p.kick||0,stride:0,fov:1.12};motion.set(p.id,m);}
            if(p.hp===0){m.vx=m.vy=0;}
            // The camera uses local yaw. Aim-lock corrections are predicted too.
            if(p.cheats.aim&&control(slot).input.aim&&p.seq>=seq-1)m.yaw=p.yaw;
        }
    }
    if(d.state==='LOBBY')lobby(d);
    syncControls();
}
function protect(e){if(e.cancelable)e.preventDefault();e.stopPropagation();}
function capture(el,e){try{el.setPointerCapture(e.pointerId);}catch{}}
function buildControls(){
    if(controlIds===ids.join(':'))return;controlIds=ids.join(':');
    $('viewControls').innerHTML=ids.map((id,i)=>`<section class="viewport-controls" data-slot="${i}" style="left:${i*100/ids.length}%;width:${100/ids.length}%"><div class="look-surface" data-look="${i}"></div><div class="control-hint">P${i+1} · ${i?'↑↓←→ / J,L 회전 / Enter 발사':'WASD / Q,E 회전 / Space 발사'}<br>터치: 조이스틱 이동 · 탭 발사 · 드래그 회전</div><div class="joystick" data-stick="${i}" aria-label="P${i+1} 이동 조이스틱"><div class="stick-knob"></div></div><div class="actions"><button data-action="aim" data-slot="${i}">조준</button><button data-action="fire" class="fire-button" data-slot="${i}">발사</button><button data-action="reload" data-slot="${i}">장전</button></div><button data-action="spectate" data-slot="${i}" class="spectate-button hidden">관전 전환</button><div class="view-cheats">${CHEATS.map((key,j)=>`<button data-game-cheat="${key}" data-slot="${i}">${LABELS[j]}</button>`).join('')}</div></section>`).join('');
    document.querySelectorAll('[data-stick]').forEach(el=>{
        const c=control(+el.dataset.stick),knob=el.querySelector('.stick-knob');
        const move=e=>{if(c.stick!==e.pointerId)return;protect(e);const r=el.getBoundingClientRect(),radius=r.width*.38;let dx=(e.clientX-r.left-r.width/2)/radius,dy=(e.clientY-r.top-r.height/2)/radius;const len=Math.max(1,Math.hypot(dx,dy));dx/=len;dy/=len;c.s=Math.abs(dx)<.07?0:dx;c.f=Math.abs(dy)<.07?0:-dy;knob.style.transform=`translate(${dx*radius}px,${dy*radius}px)`;};
        el.onpointerdown=e=>{if(!active())return;protect(e);if(c.stick!==null)return;audioOn();c.stick=e.pointerId;capture(el,e);el.classList.add('active');move(e);};
        el.onpointermove=move;
        const end=e=>{if(c.stick!==e.pointerId)return;protect(e);c.stick=null;c.f=c.s=0;knob.style.transform='translate(0,0)';el.classList.remove('active');};
        el.onpointerup=el.onpointercancel=el.onlostpointercapture=end;
    });
    document.querySelectorAll('[data-look]').forEach(el=>{
        const i=+el.dataset.look,c=control(i);
        el.onpointerdown=e=>{
            if(!active())return;protect(e);audioOn();
            if(e.pointerType==='mouse'){
                mouseSlot=i;if(e.button===2)c.mouseAim=true;else c.mouseFire=true;
                if(!touchDevice&&canvas.requestPointerLock){try{const p=canvas.requestPointerLock();p?.catch(()=>{});}catch{}}
                return;
            }
            if(c.look.size)return;
            capture(el,e);c.look.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,time:performance.now(),drag:false});
        };
        el.onpointermove=e=>{
            const g=c.look.get(e.pointerId);if(!g||!active())return;protect(e);
            const distance=Math.hypot(e.clientX-g.startX,e.clientY-g.startY);
            if(distance>9)g.drag=true;
            if(g.drag){const dx=e.clientX-g.x;rotateLocal(i,dx*.004*options.sensitivity);}
            g.x=e.clientX;g.y=e.clientY;
        };
        const end=e=>{
            const g=c.look.get(e.pointerId);if(g){protect(e);c.look.delete(e.pointerId);if(e.type==='pointerup'&&!g.drag&&performance.now()-g.time<360&&active()){c.fireUntil=performance.now()+70;transmit();}}
            if(e.pointerType==='mouse'){c.mouseFire=c.mouseAim=false;}
        };
        el.onpointerup=el.onpointercancel=el.onlostpointercapture=end;
    });
    document.querySelectorAll('[data-action]').forEach(b=>{
        const i=+b.dataset.slot,c=control(i),action=b.dataset.action;
        b.onpointerdown=e=>{protect(e);if(!active())return;audioOn();capture(b,e);if(action==='fire'){c.fire.add(e.pointerId);b.classList.add('pressed');}if(action==='reload')c.reloadUntil=performance.now()+200;if(action==='aim')c.ads=!c.ads;if(action==='spectate')c.view++;};
        const end=e=>{protect(e);if(action==='fire'){c.fire.delete(e.pointerId);if(!c.fire.size)b.classList.remove('pressed');}};
        b.onpointerup=b.onpointercancel=b.onlostpointercapture=end;
    });
    document.querySelectorAll('[data-game-cheat]').forEach(b=>b.onpointerdown=e=>{protect(e);if(state)send({type:'toggle',key:b.dataset.gameCheat},ids[+b.dataset.slot]);});
}
function syncControls(){
    ids.forEach((id,i)=>{const p=state?.players.find(p=>p.id===id);if(!p)return;const panel=document.querySelector(`.viewport-controls[data-slot="${i}"]`);if(!panel)return;
        panel.querySelectorAll('[data-game-cheat]').forEach(b=>b.classList.toggle('on',p.cheats[b.dataset.gameCheat]));
        panel.querySelector('[data-action="spectate"]').classList.toggle('hidden',p.hp>0);
        panel.querySelector('[data-action="aim"]').classList.toggle('on',control(i).ads);
    });
}
['contextmenu','selectstart','dragstart','gesturestart'].forEach(name=>document.addEventListener(name,e=>{if(e.target===canvas||e.target.closest?.('#playUI')){if(e.cancelable)e.preventDefault();}}, {passive:false}));
window.addEventListener('keydown',e=>{
    if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.code==='Escape'){if(active())settings();return;}if($('settings').open)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&state)e.preventDefault();keys.add(e.code);
    if(!e.repeat){const one=['Digit1','Digit2','Digit3','Digit4'].indexOf(e.code),two=['Digit7','Digit8','Digit9','Digit0'].indexOf(e.code);if(one>=0)send({type:'toggle',key:CHEATS[one]});if(two>=0&&ids[1])send({type:'toggle',key:CHEATS[two]},ids[1]);if(e.code==='KeyV')ids.forEach((_,i)=>control(i).view++);}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',resetInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInput();});
window.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')for(const c of local.values())c.mouseFire=c.mouseAim=false;});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement){for(const c of local.values())c.mouseFire=c.mouseAim=false;}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&active())rotateLocal(mouseSlot,e.movementX*.0025*options.sensitivity);});
function rotateLocal(i,delta){const m=motion.get(ids[i]);if(m&&active())m.yaw=wrap(m.yaw+delta);}
const down=k=>keys.has(k)?1:0;
function inputs(i,now){
    const c=control(i),has=active(),p=state?.players.find(p=>p.id===ids[i]);
    let f=c.f+(i?down('ArrowUp')-down('ArrowDown'):down('KeyW')-down('KeyS'));
    let s=c.s+(i?down('ArrowRight')-down('ArrowLeft'):down('KeyD')-down('KeyA'));
    let turn=i?down('KeyL')-down('KeyJ'):down('KeyE')-down('KeyQ');
    let fire=c.mouseFire||c.fire.size>0||now<c.fireUntil||!!down(i?'Enter':'Space');
    let aim=c.ads||c.mouseAim||!!down(i?'ShiftRight':'ShiftLeft');
    let reload=now<c.reloadUntil||!!down(i?'KeyP':'KeyR');
    const pads=navigator.getGamepads?Array.from(navigator.getGamepads()).filter(Boolean):[],pad=pads[i];
    if(pad&&has){const dz=v=>Math.abs(v||0)>.16?v:0;f-=dz(pad.axes[1]);s+=dz(pad.axes[0]);turn+=dz(pad.axes[2]);fire ||=pad.buttons[7]?.pressed;aim ||=pad.buttons[6]?.pressed;reload ||=pad.buttons[0]?.pressed;[12,13,14,15].forEach((b,j)=>{const k=`${i}:${b}`,pressed=!!pad.buttons[b]?.pressed;if(pressed&&!padEdges.get(k))send({type:'toggle',key:CHEATS[j]},ids[i]);padEdges.set(k,pressed);});}
    if(!has||p?.hp<=0){f=s=turn=0;fire=aim=reload=false;}
    const len=Math.max(1,Math.hypot(f,s));return c.input={f:f/len,s:s/len,turn:clamp(turn,-1,1),fire:!!fire,aim:!!aim,reload:!!reload};
}
function transmit(){
    if(!state||!ids.length)return;const now=performance.now();seq++;
    ids.forEach((id,i)=>{const input=inputs(i,now),m=motion.get(id);send({type:'input',...input,turn:0,yaw:m?.yaw,seq},id);});
    if(now-pingAt>1500){pingAt=now;send({type:'ping',sent:now});}
}
setInterval(transmit,1000/30);
function wall(x,y){return !map[Math.floor(y)]||map[Math.floor(y)][Math.floor(x)]!=='0';}
function moveClient(p,dx,dy){
    for(const [axis,delta] of [['x',dx],['y',dy]]){const x=p.x+(axis==='x'?delta:0),y=p.y+(axis==='y'?delta:0);if([-.22,.22].every(a=>[-.22,.22].every(b=>!wall(x+a,y+b))))p[axis]+=delta;else p[axis==='x'?'vx':'vy']=0;}
}
function ray(x,y,a){
    const dx=Math.cos(a),dy=Math.sin(a);let mx=Math.floor(x),my=Math.floor(y),side=0;
    const ddx=Math.abs(1/(dx||1e-9)),ddy=Math.abs(1/(dy||1e-9)),sx=dx<0?-1:1,sy=dy<0?-1:1;
    let tx=(dx<0?x-mx:mx+1-x)*ddx,ty=(dy<0?y-my:my+1-y)*ddy;
    for(let i=0;i<80;i++){if(tx<ty){tx+=ddx;mx+=sx;side=0;}else{ty+=ddy;my+=sy;side=1;}if(wall(mx+.5,my+.5))break;}
    return {d:Math.max(.03,side?ty-ddy:tx-ddx),side,mx,my,frac:side?(x+dx*(ty-ddy))%1:(y+dy*(tx-ddx))%1};
}
function visible(p,q){const d=Math.hypot(q.x-p.x,q.y-p.y);return ray(p.x,p.y,Math.atan2(q.y-p.y,q.x-p.x)).d>=d-.3;}
function predict(dt,now){
    ids.forEach((id,i)=>{
        const p=state.players.find(p=>p.id===id),m=motion.get(id);if(!p||!m)return;const input=inputs(i,now);m.yaw=wrap(m.yaw+input.turn*3.2*dt);
        const speed=input.aim?2.6:3.6,blend=1-Math.exp(-22*dt),tx=(Math.cos(m.yaw)*input.f-Math.sin(m.yaw)*input.s)*speed,ty=(Math.sin(m.yaw)*input.f+Math.cos(m.yaw)*input.s)*speed;
        m.vx=mix(m.vx,tx,blend);m.vy=mix(m.vy,ty,blend);
        const ox=m.x,oy=m.y;if(state.state==='PLAYING'&&p.hp>0)moveClient(m,m.vx*dt,m.vy*dt);
        m.stride+=Math.hypot(m.x-ox,m.y-oy)*4.5;
        // Extrapolate the latest authoritative sample, then gently reconcile.
        const age=clamp((now-snapshotAt+rtt*.45)/1000,0,.12);
        const target={x:p.x,y:p.y,vx:p.vx||0,vy:p.vy||0};moveClient(target,target.vx*age,target.vy*age);
        const dx=target.x-m.x,dy=target.y-m.y;
        if(Math.hypot(dx,dy)>1.5){m.x=p.x;m.y=p.y;}else moveClient(m,dx*(1-Math.exp(-9*dt)),dy*(1-Math.exp(-9*dt)));
        if(p.cheats.aim&&input.aim&&p.hp>0){const me={...p,...m},targets=state.players.filter(q=>q.hp>0&&q.team!==p.team&&Math.abs(wrap(Math.atan2(q.y-m.y,q.x-m.x)-m.yaw))<.65&&visible(me,q));targets.sort((a,b)=>Math.abs(wrap(Math.atan2(a.y-m.y,a.x-m.x)-m.yaw))-Math.abs(wrap(Math.atan2(b.y-m.y,b.x-m.x)-m.yaw)));if(targets.length)m.yaw=Math.atan2(targets[0].y-m.y,targets[0].x-m.x);}
        m.kick=mix(m.kick,p.kick||0,1-Math.exp(-20*dt));m.fov=mix(m.fov,input.aim?.88:1.12,1-Math.exp(-12*dt));
    });
}
function interpolated(now){
    return state.players.map(p=>{
        const own=motion.get(p.id);if(ids.includes(p.id)&&p.hp>0&&own)return {...p,...own};
        const list=samples.get(p.id)||[],time=now-75;let a=list[0],b=list[list.length-1];if(!a)return p;
        for(let j=1;j<list.length;j++){if(list[j].time>=time){a=list[j-1];b=list[j];break;}a=list[j];}
        const t=a===b?1:clamp((time-a.time)/(b.time-a.time),0,1),yaw=wrap(a.yaw+wrap(b.yaw-a.yaw)*t);
        return {...p,x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),yaw,vx:mix(a.vx||0,b.vx||0,t),vy:mix(a.vy||0,b.vy||0,t)};
    });
}

// Human silhouettes are built once and cached. Their limbs animate independently
// of server snapshots; eight facing directions give depth to the 2.5D arena.
function humanSprite(team,skin,direction,step){
    const key=`${team}:${skin}:${direction}:${step}`;if(spriteCache.has(key))return spriteCache.get(key);
    const image=document.createElement('canvas');image.width=128;image.height=192;
    const g=image.getContext('2d'),a=direction*Math.PI/4,front=Math.cos(a),side=Math.sin(a);
    const accent=team?'#ef735f':'#63ceef',dark=team?'#763f3a':'#305e70';
    const suit=skin==='rogue'?'#303b40':skin==='warden'?'#626e67':'#54636b';
    const phase=Math.sin(step*Math.PI/4),swing=phase*6,wide=skin==='warden'?1.14:skin==='rogue'?.91:1;
    const cx=64,bodyW=(25+Math.abs(front)*11)*wide;
    const poly=(points,color,stroke='#141f24')=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=color;g.fill();if(stroke){g.lineWidth=1.5;g.strokeStyle=stroke;g.stroke();}};
    const oval=(x,y,rx,ry,color)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=color;g.fill();};
    const capsule=(x1,y1,x2,y2,width,color)=>{g.lineCap='round';g.strokeStyle='#18232a';g.lineWidth=width+3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.strokeStyle=color;g.lineWidth=width;g.stroke();};
    const metal=g.createLinearGradient(40,0,84,0);metal.addColorStop(0,'#788b91');metal.addColorStop(.45,'#526770');metal.addColorStop(1,'#263c47');
    const limb=(sign,far)=>{
        const x=cx+sign*(8+Math.abs(front)*4),offset=sign*swing;
        capsule(x,116,x+offset,143,13,far?'#26353d':suit);
        capsule(x+offset,143,x+offset*.4,168,12,far?'#283239':'#44545b');
        oval(x+offset,142,8,7,far?'#303d43':'#687776');
        poly([[x+offset*.4-8,163],[x+offset*.4+7,163],[x+offset*.4+10+side*4,176],[x+offset*.4-10+side*4,178]],'#202c32');
        g.fillStyle='#718182';g.fillRect(x+offset*.4-8,173,17,3);
    };
    limb(side>=0?-1:1,true);
    if(front<-.25){poly([[cx-bodyW*.55,68],[cx+bodyW*.65,68],[cx+bodyW*.7,107],[cx-bodyW*.55,110]],'#2b3a3f');g.fillStyle=dark;g.fillRect(cx-bodyW*.48,75,bodyW*.9,23);}
    const arm=(sign,far)=>{
        const x=cx+sign*bodyW*.6,elbowX=x+sign*5+side*8,handX=cx+side*28+sign*8;
        capsule(x,72,elbowX,95,13,far?'#2b3a40':suit);
        capsule(elbowX,95,handX,91,10,far?'#26353b':'#5e7174');
        oval(x,73,skin==='warden'?12:10,12,far?'#263b43':'#58757b');
        g.fillStyle=far?dark:accent;g.fillRect(x-5,68,10,5);oval(handX,91,7,6,'#263c3d');
    };
    arm(side>=0?-1:1,true);
    poly([[cx-bodyW*.6,68],[cx-bodyW*.36,58],[cx+bodyW*.36,58],[cx+bodyW*.6,68],[cx+bodyW*.49,116],[cx-bodyW*.49,116]],metal);
    poly([[cx-bodyW*.43,72],[cx+bodyW*.43,72],[cx+bodyW*.38,101],[cx-bodyW*.36,101]],front>0?dark:'#344c51');
    g.fillStyle=accent;g.fillRect(cx-bodyW*.38,70,bodyW*.76,5);
    if(front>.1){
        for(let j=0;j<3;j++){g.fillStyle='#7c8d84';g.fillRect(cx-16+j*11,92,9,16);g.fillStyle='#3c5656';g.fillRect(cx-15+j*11,94,7,2);}
        g.fillStyle='#b4beb0';g.fillRect(cx-3,76,6,9);
        if(skin==='warden'){poly([[cx-16,77],[cx+16,77],[cx+13,88],[cx-13,88]],'#82968c');g.fillStyle=accent;g.fillRect(cx-10,81,20,3);}
        if(skin==='rogue'){poly([[cx-16,70],[cx-9,70],[cx+16,99],[cx+9,102]],'#8b9f8a');}
    }else{g.strokeStyle='#6c8582';g.lineWidth=2;g.strokeRect(cx-12,79,24,18);}
    g.fillStyle='#1c2d33';g.fillRect(cx-bodyW*.48,110,bodyW*.96,8);g.fillStyle='#a3b1a4';g.fillRect(cx-4,110,8,6);
    limb(side>=0?1:-1,false);
    // Neck, helmet, ears, face shield and a headset remain human proportions.
    g.fillStyle='#bb9881';g.fillRect(cx-6+side*3,52,12,13);
    const headX=cx+side*4;
    oval(headX,43,15,18,'#bda58d');
    oval(headX,36,18*wide,17,skin==='rogue'?'#263c42':metal);
    if(skin==='rogue'){poly([[headX-19,38],[headX-15,24],[headX,16],[headX+16,24],[headX+20,38]],'#263c42');}
    if(skin==='scout'){g.fillStyle='#c1d5cc';g.fillRect(headX-4,20,8,7);g.fillStyle=accent;g.fillRect(headX-2,21,4,3);}
    if(skin==='warden'){g.strokeStyle='#9ba99d';g.lineWidth=2;g.beginPath();g.moveTo(headX-18,29);g.lineTo(headX+18,29);g.stroke();}
    poly([[headX-17*wide,34],[headX+17*wide,34],[headX+16*wide,45],[headX-16*wide,45]],front>=-.1?'#152d36':'#526e72');
    if(front>=-.1){
        const visor=g.createLinearGradient(headX-14,32,headX+14,43);visor.addColorStop(0,'#b9f7ed');visor.addColorStop(.45,accent);visor.addColorStop(1,'#244b58');
        g.fillStyle=visor;g.fillRect(headX-13+side*3,35,23-Math.abs(side)*8,6);
        g.fillStyle='#4d6667';g.fillRect(headX-9+side*4,46,18-Math.abs(side)*6,9);
        g.strokeStyle='#a2b8b2';g.lineWidth=1;g.beginPath();g.moveTo(headX-6,51);g.lineTo(headX+5,51);g.stroke();
    }else{g.fillStyle=accent;g.fillRect(headX-9,35,18,4);}
    oval(headX+(side>=0?14:-14),42,4,8,'#273d45');
    g.strokeStyle='#749593';g.lineWidth=2;g.beginPath();g.moveTo(headX+(side>=0?14:-14),42);g.lineTo(headX+side*9,54);g.stroke();
    arm(side>=0?1:-1,false);
    // Rifle in both hands; side views show its barrel, front views its muzzle.
    g.save();g.translate(cx+side*17,89);g.rotate(side*.14);
    const gunWidth=22+Math.abs(side)*29;
    poly([[-gunWidth*.5,-5],[gunWidth*.5,-5],[gunWidth*.5,4],[-gunWidth*.5,6]],'#24353f');
    g.fillStyle='#819b9f';g.fillRect(-gunWidth*.42,-4,gunWidth*.67,2);
    g.fillStyle='#192b34';g.fillRect(gunWidth*.5-1,-2,8+Math.abs(side)*11,4);
    g.fillStyle=accent;g.fillRect(-4,-4,6,2);
    poly([[-5,4],[3,4],[1,18],[-6,18]],'#304752');g.restore();
    spriteCache.set(key,image);return image;
}
function line(x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function textAt(s,x,y,size=14,color='#e8f0eb',align='left'){
    ctx.font=`${size>=18?'700 ':'600 '}${size}px Arial,sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);
}
function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ground(p,w,h,horizon,proj){
    const sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#273b4a');sky.addColorStop(.7,'#738b91');sky.addColorStop(1,'#bac5b5');ctx.fillStyle=sky;ctx.fillRect(0,0,w,horizon);
    const floor=ctx.createLinearGradient(0,horizon,0,h);floor.addColorStop(0,'#586863');floor.addColorStop(.16,'#3d4e4b');floor.addColorStop(1,'#162626');ctx.fillStyle=floor;ctx.fillRect(0,horizon,w,h-horizon);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw);
    const cam=(x,y)=>({z:(x-p.x)*co+(y-p.y)*si,u:-(x-p.x)*si+(y-p.y)*co});
    const grid=(x,y,xx,yy)=>{
        let a=cam(x,y),b=cam(xx,yy);if(a.z<.08&&b.z<.08)return;
        if(a.z<.08){const t=(.08-a.z)/(b.z-a.z);a={z:.08,u:mix(a.u,b.u,t)};}if(b.z<.08){const t=(.08-b.z)/(a.z-b.z);b={z:.08,u:mix(b.u,a.u,t)};}
        line(w/2+a.u*proj/a.z,horizon+proj*.5/a.z,w/2+b.u*proj/b.z,horizon+proj*.5/b.z,'#99aaa11c');
    };
    ctx.save();ctx.beginPath();ctx.rect(0,horizon,w,h-horizon);ctx.clip();
    for(let x=1;x<20;x+=1)grid(x,1,x,11);for(let y=1;y<12;y+=1)grid(1,y,19,y);
    ctx.restore();
}
function wallMaterial(pillar,brightness){
    const level=Math.round(brightness/4),key=`${pillar}:${level}`;if(wallCache.has(key))return wallCache.get(key);
    const image=document.createElement('canvas');image.width=64;image.height=128;const g=image.getContext('2d');
    g.fillStyle=`hsl(${pillar?185:174} 10% ${level*4}%)`;g.fillRect(0,0,64,128);
    g.fillStyle=`hsl(185 13% ${clamp(level*4-16,12,60)}%)`;g.fillRect(0,83,64,45);
    g.fillStyle=pillar?'#d6ba65':'#a7c5bc';g.globalAlpha=.7;g.fillRect(0,15,64,4);g.globalAlpha=1;
    g.fillStyle='#0b202549';g.fillRect(0,0,2,128);g.fillRect(62,0,2,128);
    g.fillStyle='#d8ece12b';g.fillRect(0,0,64,2);g.fillStyle='#09202670';g.fillRect(0,81,64,2);
    g.fillStyle='#17323822';g.fillRect(10,47,44,1);g.fillRect(10,27,44,1);
    wallCache.set(key,image);return image;
}
function walls(p,w,h,horizon,proj,fov){
    const columns=Math.ceil(w/options.quality),width=w/columns,depths=new Float32Array(columns);
    const co=Math.cos(p.yaw),si=Math.sin(p.yaw),lens=Math.tan(fov/2);
    for(let i=0;i<columns;i++){
        const camera=(2*(i+.5)/columns-1)*lens,angle=p.yaw+Math.atan(camera),hit=ray(p.x,p.y,angle);
        const z=hit.d/Math.sqrt(1+camera*camera),height=proj/z,top=horizon-height*.5,x=i*width;
        depths[i]=z;
        const pillar=hit.mx>1&&hit.mx<18&&hit.my>1&&hit.my<10;
        const brightness=clamp(70-z*2.5-(hit.side?9:0),18,70),shade=pillar?brightness-3:brightness;
        const texture=wallMaterial(pillar,shade),dy=Math.max(0,top),bottom=Math.min(h,top+height),dh=bottom-dy;
        if(dh>0)ctx.drawImage(texture,Math.floor(hit.frac*63),128*(dy-top)/height,1,128*dh/height,x,dy,width+.6,dh);
    }
    return {depths,width,co,si};
}
function characters(p,roster,w,h,horizon,proj,depth,now){
    const {co,si,depths,width}=depth;
    const projected=roster.filter(q=>q.id!==p.id&&q.hp>0).map(q=>{
        const dx=q.x-p.x,dy=q.y-p.y,z=dx*co+dy*si,u=-dx*si+dy*co;
        return {q,z,x:w/2+u*proj/z,size:proj/z};
    }).filter(t=>t.z>.12).sort((a,b)=>b.z-a.z);
    for(const {q,z,x,size} of projected){
        const hh=size*.94,ww=hh*128/192,left=x-ww/2,top=horizon+size*.5-hh;
        if(left>w||left+ww<0)continue;
        const start=clamp(Math.floor(left/width),0,depths.length-1),end=clamp(Math.ceil((left+ww)/width),0,depths.length-1);
        let seen=false;ctx.save();ctx.beginPath();
        let run=-1;
        for(let j=start;j<=end+1;j++){
            const exposed=j<=end&&z<depths[j]+.025;
            if(exposed){seen=true;if(run<0)run=j;}
            else if(run>=0){ctx.rect(run*width,0,(j-run)*width,h);run=-1;}
        }
        ctx.clip();
        if(seen){
            ctx.fillStyle='#03151366';ctx.beginPath();ctx.ellipse(x,horizon+size*.45,ww*.47,Math.max(2,hh*.045),0,0,Math.PI*2);ctx.fill();
            const facing=wrap(q.yaw-Math.atan2(p.y-q.y,p.x-q.x)),direction=(Math.round(facing/(Math.PI/4))+8)%8;
            const speed=Math.hypot(q.vx||0,q.vy||0),step=speed>.25?Math.floor(now/68+q.x*.4+q.y*.3)%8:0;
            ctx.globalAlpha=clamp(1-z/60,.6,1);ctx.drawImage(humanSprite(q.team,q.skin,direction,step),left,top,ww,hh);ctx.globalAlpha=1;
            const fired=now-(effects.get(q.id)?.shotAt||0);if(fired<65){ctx.fillStyle='#ffe6a5';ctx.beginPath();ctx.arc(x+Math.sin(facing)*ww*.15,top+hh*.46,Math.max(2,hh*.045),0,Math.PI*2);ctx.fill();}
        }
        ctx.restore();
        const allied=q.team===p.team,esp=!allied&&p.cheats.esp;
        if((seen&&allied)||esp){
            const color=allied?'#7bd9ed':'#ff8e7b',font=clamp(ww*.13,9,13),labelY=clamp(top-12,100,h-140);
            if(esp){ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash(seen?[]:[4,3]);ctx.strokeRect(left+ww*.16,top+hh*.08,ww*.68,hh*.84);ctx.setLineDash([]);}
            textAt(`${q.name} · ${q.hp}`,x,labelY,font,color,'center');ctx.fillStyle='#0d1c21c9';ctx.fillRect(x-24,labelY+5,48,3);ctx.fillStyle=color;ctx.fillRect(x-24,labelY+5,48*q.hp/100,3);
        }
    }
}
function rifleModel(team){
    if(weaponCache.has(team))return weaponCache.get(team);
    const image=document.createElement('canvas');image.width=image.height=720;
    const g=image.getContext('2d');g.scale(2,2);g.translate(180,335);
    const stroke=(x1,y1,x2,y2,color,width)=>{g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();};
    const shape=(points,fill,stroke='#111e23')=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke();}};
    const steel=g.createLinearGradient(-60,0,80,0);steel.addColorStop(0,'#596e76');steel.addColorStop(.38,'#9bafb1');steel.addColorStop(.42,'#4b636e');steel.addColorStop(1,'#21333e');
    const sleeve=team?'#6b4843':'#3a5966';
    shape([[-150,25],[-106,-60],[-50,-114],[-23,-102],[-38,-53],[-69,20]],sleeve);
    shape([[122,25],[103,-69],[50,-116],[15,-83],[51,-31],[64,25]],sleeve);
    shape([[-44,-120],[-23,-141],[12,-126],[20,-103],[-2,-81],[-27,-93]],'#42584f');
    // Stock, magazine, receiver, handguard and barrel, in perspective.
    shape([[-21,12],[-62,-67],[-42,-150],[12,-138],[51,-45],[55,12]],'#273b45');
    shape([[-22,-56],[-50,-126],[-26,-187],[22,-170],[46,-107],[20,-45]],steel);
    shape([[-2,-45],[-20,-78],[-16,-114],[26,-104],[35,-58],[16,-34]],'#1d323e');
    shape([[-35,-127],[-34,-189],[-19,-229],[13,-229],[34,-187],[28,-134]],steel);
    shape([[-16,-226],[-10,-271],[8,-271],[15,-226]],'#263d47');
    g.fillStyle='#8aa3a4';g.fillRect(-10,-263,3,36);g.fillStyle='#10252e';g.fillRect(-11,-276,22,8);
    for(let y=-207;y<-141;y+=12){stroke(-26,y,24,y+2,'#18313c',4);stroke(-24,y-3,16,y-1,'#a0b9b14d',1);}
    shape([[-10,-183],[-12,-205],[13,-205],[15,-181]],'#182a32');g.fillStyle='#607e7e';g.fillRect(-7,-200,15,3);
    g.strokeStyle='#9caeaa';g.lineWidth=2;g.strokeRect(-4,-198,10,12);
    g.fillStyle=team?'#ff8a78':'#7cd9ef';g.fillRect(-28,-145,8,19);
    g.save();g.translate(-20,-87);g.rotate(-.24);g.font='600 8px Arial';g.fillStyle='#abbeb8';g.fillText('CHEAT / AR',0,0);g.restore();
    [[-20,-117],[24,-117],[-21,-158],[19,-174]].forEach(([x,y])=>{g.fillStyle='#a9b6af';g.beginPath();g.arc(x,y,2,0,Math.PI*2);g.fill();});
    shape([[36,-109],[61,-112],[79,-90],[73,-60],[48,-68],[26,-92]],'#405c51');
    weaponCache.set(team,image);return image;
}
function rifle(p,m,w,h,now){
    const fx=effects.get(p.id)||{},shot=now-(fx.shotAt||0),flash=shot>=0&&shot<55;
    const moving=Math.min(1,Math.hypot(m?.vx||0,m?.vy||0)/3.6),stride=m?.stride||0;
    const ads=m?.fov<1,scale=Math.min(w*.72,h*.72)/330;
    const bobX=Math.sin(stride)*moving*4,bobY=Math.abs(Math.cos(stride))*moving*4;
    const kick=p.cheats.recoil?0:Math.max(0,1-shot/115)*8;
    ctx.save();ctx.translate(w*(ads?.50:.61)+bobX,h+18+bobY+kick);ctx.scale(scale,scale);
    if(p.reload>0){ctx.translate(45,Math.sin(p.reload/1.5*Math.PI)*85);ctx.rotate(Math.sin(p.reload/1.5*Math.PI)*.3);}
    ctx.drawImage(rifleModel(p.team),-180,-335,360,360);
    if(flash){
        const glow=ctx.createRadialGradient(0,-278,1,0,-278,55);glow.addColorStop(0,'#fffbe8');glow.addColorStop(.3,'#ffc673d0');glow.addColorStop(1,'#ffac4300');ctx.fillStyle=glow;ctx.fillRect(-60,-338,120,120);
        ctx.beginPath();[[-4,-278],[-19,-303],[-7,-299],[0,-323],[8,-300],[25,-298],[6,-276]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='#fff1b7';ctx.fill();
    }
    ctx.restore();
}
function radar(p,roster,x,y,size){
    rounded(x,y,size,size,5,'#071c23a3');const scale=(size-14)/20;
    for(let yy=0;yy<map.length;yy++)for(let xx=0;xx<map[yy].length;xx++)if(map[yy][xx]==='1'){ctx.fillStyle='#839a9660';ctx.fillRect(x+7+xx*scale,y+7+yy*scale,scale,scale);}
    for(const q of roster){if(q.hp<=0||q.team!==p.team&&!p.cheats.esp)continue;ctx.fillStyle=q.id===p.id?'#d5ff68':q.team===p.team?'#72d5ed':'#ff8573';ctx.beginPath();ctx.arc(x+7+q.x*scale,y+7+q.y*scale,q.id===p.id?3:2.2,0,Math.PI*2);ctx.fill();}
    line(x+7+p.x*scale,y+7+p.y*scale,x+7+(p.x+Math.cos(p.yaw)*1.5)*scale,y+7+(p.y+Math.sin(p.yaw)*1.5)*scale,'#d5ff68',1.5);
}
function hud(p,owner,roster,w,h,index,horizon,now){
    const compact=w<560,alive=[0,1].map(t=>state.players.filter(q=>q.hp>0&&q.team===t).length),font=compact?Math.min(15,w/18):19;
    const scoreWidth=Math.min(w-14,compact?270:334);
    rounded(w/2-scoreWidth/2,12,scoreWidth,54,7,'#07171fbc');
    textAt(`BLUE ${alive[0]}   ${state.score[0]} : ${state.score[1]}   ${alive[1]} RED`,w/2,34,font,'#e0efea','center');
    textAt(`ROUND ${state.round}/5 · ${Math.ceil(state.timer)}s`,w/2,54,11,'#d0f773','center');
    textAt(`P${index+1} / ${owner.name}${owner.hp<=0?' · 관전':''}`,14,compact?83:88,11,owner.team?'#ffab97':'#a2dcec');
    // Health and ammunition sit above the touch controls, per viewport.
    const touch=touchDevice||ids.length===2,baseline=touch?h-(h<530?208:252):h-66;
    const cardWidth=Math.min(compact?112:138,w*.43),hudFont=w<300?15:19;
    rounded(12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(`HP ${owner.hp}`,23,baseline+22,hudFont,owner.hp<30?'#ff8c76':'#e9f1e9');
    ctx.fillStyle='#314643';ctx.fillRect(23,baseline+31,cardWidth-23,5);ctx.fillStyle=owner.hp<30?'#ef735e':'#c6ff47';ctx.fillRect(23,baseline+31,(cardWidth-23)*owner.hp/100,5);
    const ammo=p.cheats.ammo?'∞':String(p.ammo).padStart(2,'0');rounded(w-cardWidth-12,baseline,cardWidth,49,5,'#07191fc9');
    textAt(p.reload>0&&!p.cheats.ammo?'RELOADING':`${ammo} / 30`,w-24,baseline+22,p.reload>0?Math.min(13,hudFont):hudFont,'#e9f1e9','right');textAt('CHEAT AR · 5.56',w-24,baseline+39,w<300?7:9,'#8ca9a5','right');
    const gap=6+Math.min(12,p.kick*75),cross=owner.hp>0?'#d9ff75':'#c6dcd5';
    line(w/2-gap-8,horizon,w/2-gap,horizon,cross,1.5);line(w/2+gap,horizon,w/2+gap+8,horizon,cross,1.5);line(w/2,horizon-gap-8,w/2,horizon-gap,cross,1.5);line(w/2,horizon+gap,w/2,horizon+gap+8,cross,1.5);ctx.fillStyle=cross;ctx.fillRect(w/2-1,horizon-1,2,2);
    if(now-(effects.get(p.id)?.hitAt||0)<180){for(const sign of [-1,1]){line(w/2+sign*8,horizon+8,w/2+sign*14,horizon+14,'#fff5d1',2);line(w/2+sign*8,horizon-8,w/2+sign*14,horizon-14,'#fff5d1',2);}}
    if(p.cheats.esp&&w>350){radar(p,roster,14,compact?112:127,compact?85:106);textAt('ESP / LIVE',18,compact?107:121,9,'#d4f77e');}
    if(!compact){state.log.slice(-4).forEach((e,j)=>{textAt(`${e.killer}  ›  ${e.victim}`,w-14,88+j*18,10,e.team?'#ffac9b':'#96dbe8','right');});}
    if(owner.hp<=0){rounded(w/2-115,76,230,48,5,'#07191fd4');textAt('KNOCKED OUT',w/2,96,15,'#ff9a84','center');textAt(p.id!==owner.id?`관전: ${p.name}`:'남은 아군 없음',w/2,113,10,'#afc3bd','center');}
    if(state.state==='COUNTDOWN'||state.state==='ROUND_END'){
        rounded(w/2-Math.min(210,w*.42),h*.33-37,Math.min(420,w*.84),95,8,'#061921bb');
        textAt(state.state==='COUNTDOWN'?`ROUND ${state.round} · ${Math.ceil(state.timer)}`:state.message,w/2,h*.33,compact?20:27,'#edffe3','center');
        textAt(state.state==='COUNTDOWN'?'준비 · 치트 토글을 선택하세요':'다음 라운드를 준비하는 중',w/2,h*.33+26,11,'#adc5b9','center');
    }
    const hurt=now-(effects.get(owner.id)?.hurtAt||0);if(hurt>=0&&hurt<300){ctx.strokeStyle=`rgba(242,79,62,${(1-hurt/300)*.6})`;ctx.lineWidth=14;ctx.strokeRect(3,3,w-6,h-6);}
}
function view(index,roster,w,h,now){
    const owner=roster.find(p=>p.id===ids[index]);if(!owner)return;
    let p=owner;const c=control(index);
    if(owner.hp<=0){const alive=roster.filter(q=>q.team===owner.team&&q.hp>0);if(alive.length)p=alive[c.view%alive.length];}
    const m=motion.get(p.id),fov=p.id===owner.id&&m?m.fov:1.12;
    const horizon=h*.48+(owner.hp>0?Math.sin((m?.stride||0)*2)*Math.min(1,Math.hypot(m?.vx||0,m?.vy||0)/3.6)*1.2:0),proj=w/(2*Math.tan(fov/2));
    ground(p,w,h,horizon,proj);const depth=walls(p,w,h,horizon,proj,fov);
    characters(p,roster,w,h,horizon,proj,depth,now);
    if(p.hp>0)rifle(p,m,w,h,now);hud(p,owner,roster,w,h,index,horizon,now);
}
function resize(){
    // CSS coordinates stay identical for rendering and pointer hit testing.
    const ratio=Math.min(devicePixelRatio||1,1,1440/Math.max(innerWidth,innerHeight));
    const width=Math.max(1,Math.round(innerWidth*ratio)),height=Math.max(1,Math.round(innerHeight*ratio));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    ctx.setTransform(width/innerWidth,0,0,height/innerHeight,0,0);
}
window.addEventListener('resize',resize);resize();
function frame(now){
    const dt=Math.min(.05,(now-lastFrame)/1000);frameMs=mix(frameMs,now-lastFrame,.05);lastFrame=now;
    if(state&&map.length&&['COUNTDOWN','PLAYING','ROUND_END'].includes(state.state)){
        predict(dt,now);const roster=interpolated(now),w=innerWidth/ids.length,h=innerHeight;
        for(let i=0;i<ids.length;i++){ctx.save();ctx.translate(i*w,0);ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();view(i,roster,w,h,now);ctx.restore();}
        if(ids.length===2){line(innerWidth/2,0,innerWidth/2,h,'#07191f',3);}
    }else{ctx.fillStyle='#0a1013';ctx.fillRect(0,0,innerWidth,innerHeight);}
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
````

## frontend/index.html

````html
<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Cheat FPS</title><link rel="stylesheet" href="/static/style.css?v=0.2.0"></head>
<body>
<canvas id="game"></canvas>
<div id="menu" class="screen"><div class="shell"><div class="eyebrow">CONVICT ARENA / v0.2.0</div><h1>CHEAT<span>FPS</span></h1><p class="tagline">반칙은 끝났다. 이제 규칙이다.</p><p class="story">적발된 치터들의 마지막 생존 경기.<br>3 대 3 · 5판 3선승 · 네 가지 무제한 치트</p><div class="form"><label>콜사인<input id="name" maxlength="16" value="CHEATER"></label><label>모드<select id="mode"><option value="ai">AI전 · 인간만 치트 사용</option><option value="local">로컬 대전 · 인간 3 vs 3</option></select></label><label class="check"><input type="checkbox" id="split">이 기기에서 2인 분할 화면</label><div id="quickCustom"><div class="row"><label>1P 캐릭터<select id="skin0"><option value="scout">SCOUT</option><option value="warden">WARDEN</option><option value="rogue">ROGUE</option></select></label><label id="skinSecond" class="hidden">2P 캐릭터<select id="skin1"><option value="warden">WARDEN</option><option value="scout">SCOUT</option><option value="rogue">ROGUE</option></select></label></div><div id="quickCheats" class="toggles"></div><small>치트는 경기 중에도 자유롭게 켜고 끌 수 있다.</small></div><button id="create" class="primary">AI전 바로 시작 →</button><div id="joinRow" class="join hidden"><input id="code" maxlength="6" placeholder="6자리 방 코드"><button id="join">참가</button></div><div class="row"><button id="settingsOpen">설정</button><button id="exit">종료</button></div></div><small>PC · 키보드/마우스 & 게임패드 · 모바일 터치 지원</small></div><div class="poster"><b>01—04</b><h2>UNFAIR<br>BY DESIGN.</h2><div>AIM LOCK<br>EXTRA SENSORY<br>ZERO RECOIL<br>ENDLESS AMMO</div><p>NO SECOND LIFE.</p></div></div>
<div id="lobby" class="screen hidden"><div class="wide"><div class="eyebrow">PRE-MATCH / TEAM ASSEMBLY</div><h2>팀 편성 <span id="roomCode"></span></h2><p id="modeInfo"></p><div id="roster" class="teams"></div><div id="custom" class="teams"></div><p>치트 버튼은 장착과 활성화를 동시에 전환한다. 경기 중에도 제한 없이 변경할 수 있다.</p><div class="row"><button id="start" class="primary">경기 시작</button><button class="leave">메인 메뉴</button></div><p id="controlsInfo"></p></div></div>
<div id="playUI" class="hidden"><div id="viewControls"></div><button id="pause" class="floating">☰ / ESC</button></div>
<div id="result" class="screen hidden"><div class="wide"><div class="eyebrow">SENTENCE COMPLETE</div><h2 id="resultTitle"></h2><h1 id="finalScore"></h1><div id="rounds"></div><div id="stats"></div><div class="row"><button id="again" class="primary">다시 플레이</button><button class="leave">메인 메뉴</button></div></div></div>
<dialog id="settings"><h2>설정 & 조작</h2><label>마우스 감도<input id="sensitivity" type="range" min="0.3" max="3" step="0.1"></label><label>사운드<input id="volume" type="range" min="0" max="1" step="0.05"></label><label>렌더 품질<select id="quality"><option value="2">높음</option><option value="4">보통</option><option value="6">낮음</option></select></label><p>1P: WASD 이동 · 마우스 / Q,E 회전<br>좌클릭 / Space 발사 · 우클릭 / Shift 조준<br>R 장전 · 1~4 치트 · V 관전 대상 변경<br>2P: 방향키 이동 · J,L 회전 · Enter 발사<br>오른쪽 Shift 조준 · P 장전 · 7,8,9,0 치트<br>게임패드: 좌 스틱 이동 · 우 스틱 회전<br>RT 발사 · LT 조준 · A 장전 · 방향패드 치트</p><p>모바일: 각 화면 왼쪽 조이스틱으로 이동.<br>빈 화면을 짧게 탭하면 발사, 드래그하면 회전.<br>발사 버튼을 누르면 연사. 조준 버튼은 토글이다.<br>2인 화면은 양쪽에 독립된 터치 조작이 있다.</p><button id="settingsClose" class="primary">닫기 / 계속</button><button class="leave">메인 메뉴</button></dialog>
<div id="toast" role="status"></div>
<script src="/static/game.js?v=0.2.0"></script></body></html>
````

## frontend/style.css

````css
:root { color-scheme:dark; --bg:#0a1013; --ink:#e6eee9; --acid:#c6ff47; --line:#34433f; }
* { box-sizing:border-box; }
html,body { margin:0; height:100%; overscroll-behavior:none; }
body { background:var(--bg); color:var(--ink); font-family:Arial,'Malgun Gothic',sans-serif; overflow:hidden; }
button,input,select { font:inherit; }
button { background:#182222; border:1px solid var(--line); color:var(--ink); padding:13px 20px; cursor:pointer; border-radius:5px; }
button:hover { border-color:var(--acid); }
button:disabled { opacity:.4; cursor:default; }
button.primary { background:var(--acid); color:#10190c; font-weight:800; border:0; }
.screen { position:fixed; inset:0; overflow:auto; padding:5vh 7vw; background:radial-gradient(ellipse at 80% 20%,#233127,#0a1013 70%); z-index:4; }
.hidden { display:none!important; }
#menu { display:flex; justify-content:space-between; gap:5vw; }
.shell { max-width:500px; }
.eyebrow { letter-spacing:3px; color:var(--acid); font-size:11px; font-weight:bold; }
h1 { font-size:clamp(64px,9vw,128px); line-height:.85; letter-spacing:-6px; margin:35px 0 25px; }
h1 span { display:block; color:var(--acid); }
h2 { font-size:30px; letter-spacing:-1px; }
.tagline { font-size:21px; }
.story,p,small { color:#a8b8ae; line-height:1.65; }
.form { display:grid; gap:12px; margin:24px 0; }
label { display:grid; gap:7px; font-size:13px; }
input,select { background:#101b1b; color:var(--ink); border:1px solid var(--line); padding:12px; border-radius:4px; min-width:0; }
input[type=checkbox] { width:18px; height:18px; }
.check { display:flex; align-items:center; }
.join,.row { display:flex; gap:10px; flex-wrap:wrap; }
.join input { flex:1; }
.poster { border-left:1px solid var(--line); padding:8vh 0 0 5vw; flex:1; max-width:550px; background:repeating-linear-gradient(135deg,transparent,transparent 50px,#c6ff4704 51px,#c6ff4704 53px); }
.poster b { color:var(--acid); font-size:20px; }
.poster h2 { font-size:clamp(40px,6vw,85px); line-height:1; font-style:italic; }
.poster div { font:18px/2 monospace; color:#779082; }
.poster p { margin-top:70px; letter-spacing:5px; }
.wide { max-width:1050px; margin:auto; }
#roomCode { color:var(--acid); font:24px monospace; margin-left:20px; }
.teams { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0; }
.card { background:#142020; border:1px solid var(--line); padding:18px; border-radius:6px; }
.blue { border-top:3px solid #55caff; }
.red { border-top:3px solid #ff776a; }
.member { display:flex; justify-content:space-between; border-bottom:1px solid var(--line); padding:12px 0; font-size:14px; }
.toggles { display:flex; gap:6px; flex-wrap:wrap; margin:12px 0; }
.toggles button { padding:9px; font-size:11px; }
.on { background:var(--acid)!important; color:#10190c!important; }
canvas { display:block; position:fixed; inset:0; width:100%; height:100%; touch-action:none; }
/* iOS callouts and selection must be disabled on every gameplay descendant. */
#game,#playUI,#playUI * { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; -webkit-tap-highlight-color:transparent; touch-action:none; }
body.playing { touch-action:none; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
body.playing input,body.playing select { -webkit-user-select:text; user-select:text; touch-action:auto; }
#playUI { position:fixed; inset:0; z-index:2; pointer-events:none; overflow:hidden; }
#viewControls { position:absolute; inset:0; }
.viewport-controls { position:absolute; top:0; bottom:0; overflow:hidden; --stick:116px; --action:58px; }
.look-surface { position:absolute; inset:0; pointer-events:auto; cursor:crosshair; }
.control-hint { position:absolute; top:84px; left:12px; right:12px; font:10px/1.5 Arial; color:#bdccc0b0; pointer-events:none; }
.joystick { position:absolute; left:18px; bottom:64px; width:var(--stick); height:var(--stick); border:1px solid #b5dfc67a; border-radius:50%; background:radial-gradient(circle,#14252075 0 31%,#29453d55 32% 70%,#05151177 71%); pointer-events:auto; }
.joystick:before,.joystick:after { content:''; position:absolute; background:#c6ff471f; pointer-events:none; }
.joystick:before { left:49%; top:12%; width:1px; height:76%; }
.joystick:after { top:49%; left:12%; height:1px; width:76%; }
.stick-knob { position:absolute; left:50%; top:50%; width:44%; height:44%; margin-left:-22%; margin-top:-22%; border-radius:50%; background:linear-gradient(145deg,#88ad9977,#213b2df0); border:1px solid #c6ff47a0; box-shadow:0 4px 14px #0008; pointer-events:none; }
.joystick.active .stick-knob { background:#c6ff4777; }
.actions { position:absolute; right:14px; bottom:65px; display:grid; grid-template-columns:var(--action) var(--action); gap:7px; pointer-events:none; }
.actions button { pointer-events:auto; height:var(--action); padding:0; background:#0d211dd6; border:1px solid #b5dfc670; color:#e9f6ef; font-size:12px; border-radius:12px; }
.actions .fire-button { grid-column:2; grid-row:1 / span 2; height:calc(var(--action)*2 + 7px); background:#a5df2929; border-color:#c6ff47a0; font-weight:bold; }
.actions .pressed { background:#c6ff4788!important; }
.view-cheats { position:absolute; bottom:12px; left:12px; right:12px; display:flex; justify-content:center; gap:5px; pointer-events:none; }
.view-cheats button { pointer-events:auto; font-size:10px; padding:10px 9px; background:#0c1918d9; }
.spectate-button { position:absolute; right:14px; top:86px; padding:8px; pointer-events:auto; font-size:11px; }
.floating { position:fixed; right:12px; top:12px; z-index:3; padding:8px; pointer-events:auto; }
body:not(.touch-device):not(.split-play) .joystick,body:not(.touch-device):not(.split-play) .actions { display:none; }
dialog { background:#142020; color:var(--ink); border:1px solid var(--line); border-radius:8px; max-width:520px; max-height:90vh; overflow:auto; z-index:10; }
dialog::backdrop { background:#000a; }
dialog label { margin:15px 0; }
#toast { position:fixed; top:18px; left:50%; transform:translateX(-50%); padding:12px 20px; background:#c6ff47; color:#142020; z-index:20; display:none; border-radius:5px; max-width:90vw; pointer-events:none; }
table { border-collapse:collapse; width:100%; margin:20px 0; }
td,th { padding:12px; text-align:left; border-bottom:1px solid var(--line); }
#rounds { display:flex; gap:8px; flex-wrap:wrap; }
#rounds span { padding:10px; background:#172525; }
@media(max-width:700px) { .poster{display:none}.screen{padding:25px 6vw}.teams{grid-template-columns:1fr}h1{font-size:65px;margin:22px 0}.shell{width:100%}.form{margin:15px 0}.story{font-size:13px}.card{padding:12px}table{font-size:12px}td,th{padding:7px} }
@media(max-height:530px) { .viewport-controls{--stick:94px;--action:44px}.joystick{bottom:53px;left:12px}.actions{bottom:53px;right:10px;gap:5px}.actions .fire-button{height:93px}.view-cheats{bottom:8px;gap:3px}.view-cheats button{font-size:9px;padding:8px 6px}.control-hint{display:none}.spectate-button{top:62px} }
@media(max-width:650px) { body.split-play .viewport-controls{--stick:76px;--action:36px}body.split-play .joystick{left:6px}body.split-play .actions{right:6px;gap:4px}body.split-play .actions .fire-button{height:76px}body.split-play .view-cheats{left:4px;right:4px;gap:2px}body.split-play .view-cheats button{padding:8px 4px;font-size:8px}body.split-play .control-hint{font-size:8px} }
@media(max-width:650px) { body.split-play .floating{top:70px;right:6px;font-size:10px;padding:5px}body.split-play .control-hint{display:none} }
````

## render.yaml

````yaml
services:
  - type: web
    name: cheat-fps
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
    healthCheckPath: /health
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.11
````

## requirements-dev.txt

````text
-r requirements.txt
pytest==9.1.1
httpx==0.28.1
playwright==1.63.0
````

## requirements.txt

````text
fastapi==0.115.12
uvicorn[standard]==0.34.2
````

## tests/test_browser.py

````python
"""Optional real Chromium / DOM / Canvas / WebSocket / multi-touch checks.
AI is paused only in this fixture; normal AI matches are tested in test_game.py.
"""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen
import pytest

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')

@pytest.fixture(scope='module')
def server_url():
    with socket.socket() as s:
        s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    code=("import uvicorn;from backend.game import Room;from backend.main import app,rooms;"
          "Room.ai=lambda self,p,dt:None;"
          "exec(\"@app.post('/__test/finish')\\ndef finish():\\n"
          " for r in rooms.values():\\n"
          "  if r.quick and r.state=='PLAYING':\\n"
          "   r.score=[2,0];r.round=3;r.history=[{'round':1,'winner':0,'reason':'검증'},{'round':2,'winner':0,'reason':'검증'}];r.finish(0,'검증')\\n"
          " return {'ok':True}\\n\");"
          f"uvicorn.run(app,host='127.0.0.1',port={port},log_level='error')")
    proc=subprocess.Popen([sys.executable,'-c',code],cwd=Path(__file__).resolve().parents[1],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    url=f'http://127.0.0.1:{port}'
    try:
        for _ in range(100):
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read().decode())
            try:urlopen(url+'/health',timeout=.2);break
            except OSError:time.sleep(.05)
        else:raise RuntimeError('Test server startup timeout')
        yield url
    finally:proc.terminate();proc.wait(timeout=5);proc.stderr.close()

@pytest.fixture
def browser():
    playwright=pytest.importorskip('playwright.sync_api')
    with playwright.sync_playwright() as pw:
        kwargs={}
        if os.getenv('CHEAT_FPS_BROWSER'):
            kwargs=dict(executable_path=os.environ['CHEAT_FPS_BROWSER'],args=['--no-sandbox','--no-zygote','--single-process','--disable-gpu'])
        instance=pw.chromium.launch(headless=True,**kwargs)
        yield instance
        instance.close()

@pytest.fixture
def game(browser,server_url):
    context=browser.new_context(viewport={'width':1280,'height':800},has_touch=True,is_mobile=True,device_scale_factor=1)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(server_url);page.locator('#split').check()
    page.locator('#skin0').select_option('rogue');page.locator('#skin1').select_option('warden')
    page.locator('#create').click();page.wait_for_function('state?.state === "PLAYING"')
    yield page,context.new_cdp_session(page)
    context.close()
    assert not errors,errors

def touch(cdp,kind,points):
    cdp.send('Input.dispatchTouchEvent',dict(type=kind,touchPoints=[dict(id=p[0],x=p[1],y=p[2],radiusX=3,radiusY=3,force=1) for p in points]))

def center(page,selector):
    b=page.locator(selector).bounding_box();return b['x']+b['width']/2,b['y']+b['height']/2

def shots(page):return page.evaluate('ids.map(id=>state.players.find(p=>p.id===id).shots)')

def test_independent_analog_controls_and_fire(game):
    page,cdp=game;a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
    before=page.evaluate('ids.map(id=>{let p=state.players.find(p=>p.id===id);return [p.x,p.y]})')
    touch(cdp,'touchStart',[(1,*a),(2,*b)]);touch(cdp,'touchMove',[(1,a[0],a[1]-38),(2,b[0]+38,b[1])])
    page.wait_for_timeout(350);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
    after=page.evaluate('ids.map(id=>{let p=state.players.find(p=>p.id===id);return [p.x,p.y]})')
    assert after[0][0]>before[0][0]+.3 and after[1][1]>before[1][1]+.3
    assert abs(after[0][1]-before[0][1])<.05 and abs(after[1][0]-before[1][0])<.05
    before_shots=shots(page);fire=center(page,'[data-action="fire"][data-slot="1"]')
    touch(cdp,'touchStart',[(3,*fire)]);page.wait_for_timeout(380);touch(cdp,'touchEnd',[]);page.wait_for_timeout(100)
    after_shots=shots(page)
    assert after_shots[1]>=before_shots[1]+2 and after_shots[0]==before_shots[0]
    assert page.evaluate('control(0).f===0&&control(1).s===0&&control(1).fire.size===0')

def test_tap_drag_long_press_cancel_and_blur(game):
    page,cdp=game;before,yaw=shots(page),page.evaluate('motion.get(ids[0]).yaw')
    touch(cdp,'touchStart',[(4,280,280)]);touch(cdp,'touchMove',[(4,430,280)]);touch(cdp,'touchEnd',[])
    page.wait_for_timeout(150)
    assert shots(page)==before and abs(page.evaluate('motion.get(ids[0]).yaw')-yaw)>.3
    touch(cdp,'touchStart',[(5,280,280)]);touch(cdp,'touchEnd',[]);page.wait_for_timeout(150)
    assert shots(page)[0]==before[0]+1
    a=center(page,'[data-stick="0"]');touch(cdp,'touchStart',[(6,*a)]);touch(cdp,'touchMove',[(6,a[0],a[1]-30)])
    page.wait_for_timeout(1400)
    assert page.evaluate('getSelection().toString()')==''
    assert page.locator('[data-stick="0"]').evaluate('el=>getComputedStyle(el).userSelect')=='none'
    assert not page.locator('[data-stick="0"]').evaluate('el=>el.dispatchEvent(new Event("contextmenu",{bubbles:true,cancelable:true}))')
    touch(cdp,'touchCancel',[])
    assert page.evaluate('control(0).f===0&&control(0).stick===null')
    fire=center(page,'[data-action="fire"][data-slot="0"]');touch(cdp,'touchStart',[(7,*fire)])
    page.evaluate('window.dispatchEvent(new Event("blur"))')
    assert page.evaluate('control(0).fire.size===0&&!control(0).input.fire');touch(cdp,'touchCancel',[])

def test_quick_ai_settings_results_rematch_and_resize(game,server_url):
    page,cdp=game
    assert page.locator('#lobby').is_hidden() and page.locator('.joystick').count()==2
    assert page.evaluate('state.quick&&state.players.length===6')
    assert page.evaluate('state.players.filter(p=>!p.bot).map(p=>p.skin)')==['rogue','warden']
    page.locator('#pause').tap();assert page.locator('#settings').is_visible()
    assert page.locator('#quality').input_value()=='4';page.locator('#settingsClose').click()
    for size in [(844,390),(390,844),(1366,900)]:
        page.set_viewport_size({'width':size[0],'height':size[1]});page.wait_for_timeout(100)
        for i in range(2):
            pane=page.locator(f'.viewport-controls[data-slot="{i}"]').bounding_box()
            stick=page.locator(f'[data-stick="{i}"]').bounding_box();fire=page.locator(f'[data-action="fire"][data-slot="{i}"]').bounding_box()
            assert pane['x']<=stick['x']<stick['x']+stick['width']<=pane['x']+pane['width']
            assert pane['x']<=fire['x']<fire['x']+fire['width']<=pane['x']+pane['width']
            assert stick['x']+stick['width']<fire['x']
    directory=os.getenv('CHEAT_FPS_SCREENSHOT_DIR')
    if directory:
        Path(directory).mkdir(parents=True,exist_ok=True);page.screenshot(path=str(Path(directory)/'mobile-split.png'))
        page.evaluate("let image=document.createElement('canvas');image.id='gallery';image.width=1200;image.height=700;image.style.cssText='position:fixed;inset:0;z-index:100;width:1200px;height:700px';let g=image.getContext('2d');g.fillStyle='#132329';g.fillRect(0,0,1200,700);['scout','warden','rogue'].forEach((skin,i)=>{g.drawImage(humanSprite(i===2?1:0,skin,0,0),100+i*320,90,256,384);g.font='700 20px Arial';g.fillStyle='#d5eddf';g.fillText(skin.toUpperCase(),165+i*320,510)});document.body.append(image)")
        page.locator('#gallery').screenshot(path=str(Path(directory)/'character-models.png'));page.locator('#gallery').evaluate('el=>el.remove()')
    page.request.post(server_url+'/__test/finish');page.wait_for_selector('#result:not(.hidden)')
    assert page.locator('#stats tbody tr').count()==6 and page.locator('#rounds span').count()==3
    assert page.locator('#finalScore').inner_text()=='3 : 0'
    page.locator('#again').click();page.wait_for_function('state?.state==="COUNTDOWN"&&state.score[0]===0')
    assert page.locator('#lobby').is_hidden() and page.locator('#playUI').is_visible()

def test_local_three_devices_with_two_players_each(browser,server_url):
    context=browser.new_context(viewport={'width':1200,'height':800})
    try:
        pages=[context.new_page() for _ in range(3)];code=''
        for page in pages:
            page.goto(server_url);page.locator('#mode').select_option('local');page.locator('#split').check()
            if code:page.locator('#code').fill(code);page.locator('#join').click()
            else:page.locator('#create').click()
            page.wait_for_selector('#lobby:not(.hidden)');code=page.locator('#roomCode').inner_text()
        for page in pages:
            for button in page.locator('[data-ready]').all():button.click()
        host=pages[0];host.wait_for_function('state.players.length===6&&state.players.every(p=>p.ready)')
        host.locator('#start').click()
        for page in pages:
            page.wait_for_selector('#playUI:not(.hidden)')
            assert page.locator('.joystick').count()==2
            assert page.evaluate('[0,1].map(t=>state.players.filter(p=>p.team===t&&!p.bot).length)')==[3,3]
    finally:
        context.close()
````

## tests/test_game.py

````python
import math
import random
from backend.game import Room, Player, clear, walk
from fastapi.testclient import TestClient
from backend.main import app


def ai_room():
    r=Room('TEST','ai')
    p=r.add('Tester')
    p.ready=True
    r.start()
    r.tick(3.1)
    return r,p


def test_ai_roster_and_no_cheats():
    r,p=ai_room()
    assert len(r.players)==6
    assert [sum(q.team==t for q in r.players.values()) for t in (0,1)]==[3,3]
    assert all(not any(q.cheats.values()) for q in r.players.values() if q.bot)
    for q in r.players.values():
        if q.bot:
            r.command(q,{'type':'toggle','key':'aim'})
            assert not q.cheats['aim']


def test_elimination_best_of_five():
    r,p=ai_room()
    for n in range(3):
        for q in r.players.values():
            if q.team==1:q.hp=0
        r.tick(.01)
        assert r.score==[n+1,0]
        if n<2:
            assert r.state=='ROUND_END'
            r.tick(4.1)
            r.tick(3.1)
    assert r.state=='MATCH_END'
    assert len(r.history)==3


def test_cheats_ammo_recoil_aim_and_damage():
    r,p=ai_room()
    p.x,p.y,p.yaw=2.5,1.5,.2
    target=next(q for q in r.players.values() if q.team==1)
    target.x,target.y,target.hp=6.5,1.5,100
    for q in r.players.values():q.bot=False
    for key in p.cheats:r.command(p,{'type':'toggle','key':key})
    p.ammo=0
    r.command(p,{'type':'input','aim':True,'fire':True})
    r.tick(.01)
    assert abs(p.yaw)<.001
    assert target.hp==75 and p.ammo==0 and p.kick==0
    for _ in range(3):
        p.cooldown=0
        r.shoot(p)
    assert target.hp==0 and target.deaths==1 and p.kills==1


def test_walls_and_reload():
    r,p=ai_room()
    assert not clear(3.5,3.5,6.5,3.5)
    p.ammo=0
    r.shoot(p)
    assert p.reload==1.5
    for q in r.players.values():q.bot=False
    r.tick(1.6)
    assert p.ammo==30 and p.reload==0
    p.x,p.y=1.3,1.5
    p.yaw=math.pi
    for _ in range(15):
        r.command(p,{'type':'input','f':1})
        r.tick(.03)
    assert p.x>=1.22


def test_local_capacity_ready_and_teams():
    r=Room('LOCAL','local')
    for i in range(6):
        p=r.add(str(i),i%2)
        p.ready=True
    r.start()
    assert len(r.players)==6 and not any(p.bot for p in r.players.values())


def test_timeout_and_disconnect():
    r,p=ai_room()
    for q in r.players.values(): q.bot=False
    r.timer=.001
    r.tick(.01)
    assert r.state=='PLAYING' and r.timer==30
    p.hp=75
    r.timer=.001
    r.tick(.01)
    assert r.score==[0,1]
    p.cheats['aim']=True
    r.remove(p.id)
    assert p.bot and not any(p.cheats.values())


def test_ai_finishes_match():
    random.seed(10)
    r,p=ai_room()
    p.bot=True
    for _ in range(24000):
        r.tick(1/30)
        if r.state=='MATCH_END': break
    assert r.state=='MATCH_END'
    assert max(r.score)==3 and sum(r.score)<=5


def test_websocket_and_invalid_room():
    with TestClient(app) as client:
        assert client.get('/').status_code==200
        assert client.get('/health').json()['status']=='ok'
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'name':'Net','mode':'ai'})
            welcome=ws.receive_json()
            pid=welcome['ids'][0]
            ws.send_json({'type':'ready','id':pid})
            ws.send_json({'type':'start','id':pid})
            snap=ws.receive_json()
            assert snap['state']=='COUNTDOWN' and len(snap['players'])==6
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'code':'MISSING'})
            assert ws.receive_json()['type']=='error'


def test_six_real_websocket_players():
    from contextlib import ExitStack
    with TestClient(app) as client, ExitStack() as stack:
        connections=[]
        code=''
        for i in range(6):
            ws=stack.enter_context(client.websocket_connect('/ws'))
            ws.send_json({'name':str(i),'mode':'local','code':code})
            w=ws.receive_json()
            code=w['code']
            connections.append((ws,w['ids'][0]))
        for ws,pid in connections:ws.send_json({'id':pid,'type':'ready'})
        # A state snapshot acknowledges all six readiness changes before start.
        host=connections[0][0]
        for _ in range(30):
            snap=host.receive_json()
            if len(snap.get('players',[]))==6 and all(p['ready'] for p in snap['players']): break
        host.send_json({'type':'start','id':connections[0][1]})
        for _ in range(30):
            snap=host.receive_json()
            if snap.get('state')=='COUNTDOWN':break
        assert snap['state']=='COUNTDOWN'
        assert [sum(p['team']==t for p in snap['players']) for t in (0,1)]==[3,3]


def test_analog_acceleration_release_and_diagonal_speed():
    p=Player('a','Walker',0,x=2,y=1.5)
    walk(p,1,0,1/60)
    assert 0<p.vx<3.6
    for _ in range(30): walk(p,.5,0,1/60)
    assert abs(p.vx-1.8)<.001
    start=p.x
    for _ in range(30): walk(p,0,0,1/60)
    assert p.x-start<.1 and abs(p.vx)<.001
    a=Player('b','Diagonal',0,x=2,y=1.5)
    walk(a,1,1,.1)
    assert math.hypot(a.vx,a.vy)<=3.6


def test_absolute_yaw_and_malformed_input_are_safe():
    r,p=ai_room()
    r.command(p,{'type':'input','yaw':math.pi*3+.2,'seq':12,'f':float('nan'),'s':'bad'})
    assert abs(p.yaw-(-math.pi+.2))<.001 and p.seq==12
    assert p.inp['f']==p.inp['s']==0
    before=p.yaw
    r.command(p,{'type':'input','yaw':float('inf'),'seq':2})
    assert p.yaw==before and p.seq==12


def test_quick_ai_skips_lobby_for_two_humans_and_pings():
    with TestClient(app) as client:
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'name':'Quick','mode':'ai','quick':True,'split':True,
                          'skins':['rogue','warden'],'cheats':[{'ammo':True},{'esp':True}]})
            w=ws.receive_json()
            assert w['quick'] and len(w['ids'])==2
            snap=ws.receive_json()
            assert snap['quick'] and snap['state']=='COUNTDOWN'
            humans=[p for p in snap['players'] if not p['bot']]
            assert len(humans)==2 and all(p['team']==0 for p in humans)
            assert [p['skin'] for p in humans]==['rogue','warden']
            assert humans[0]['cheats']['ammo'] and humans[1]['cheats']['esp']
            assert all(not any(p['cheats'].values()) for p in snap['players'] if p['bot'])
            ws.send_json({'type':'ping','sent':123})
            for _ in range(10):
                reply=ws.receive_json()
                if reply['type']=='pong':break
            assert reply=={'type':'pong','sent':123}


def test_quick_ai_rematch_starts_without_readiness_ui():
    r,p=ai_room()
    r.quick=True
    p.skin='rogue'
    p.cheats['esp']=True
    r.state='MATCH_END'
    r.score=[3,1]
    r.command(p,{'type':'rematch'})
    assert r.state=='COUNTDOWN' and r.score==[0,0] and r.round==1
    assert len(r.players)==6 and p.skin=='rogue' and p.cheats['esp']
    assert all(not any(q.cheats.values()) for q in r.players.values() if q.bot)
````
