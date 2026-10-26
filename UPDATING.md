# v0.6.0 전체 업데이트

ZIP의 backend와 frontend 폴더 구조를 그대로 유지한다. 루트에 파일을 전부 펼쳐 넣으면 실행되지 않는다. 이전 Render/GitHub 서비스가 자동으로 수정된 것은 아니다.

1. GitHub의 backend 폴더 안에 ZIP의 backend 파일 **7개**를 모두 업로드한다. 새 파일 `weapons.py`도 포함한다.
2. frontend 폴더 안에 frontend 파일 **13개**를 모두 업로드한다. 새 파일 `environment.js`, `combat-effects.js`, `operators.js`, `firearms.js`, `map-details.js`와 실행 번들 `renderer3d.js`를 포함한다.
3. 루트의 requirements.txt, render.yaml, 문서·테스트 등도 같은 경로로 반영한다. 폴더 안에 같은 폴더를 다시 넣어 backend/backend 또는 frontend/frontend가 되지 않도록 한다.
4. 연결된 브랜치에 커밋한다. Render Auto-Deploy가 On Commit이면 자동 배포된다. 꺼져 있다면 Manual Deploy → Deploy latest commit을 누른다.
5. 게임 메뉴/설정과 서버 `/health`의 버전이 모두 **0.6.0**인지 확인한다. 파일 버전이 섞이면 접속 시 업데이트 안내가 표시된다.

Runtime은 Python, Root Directory는 requirements.txt가 저장소 루트에 있으면 빈칸이다. Build Command:

```bash
pip install -r requirements.txt
```

Start Command는 기존 내용을 지우고 아래 **한 줄을 한 번만** 넣는다.

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
```

Node 설치 없이 동봉된 번들로 실행한다. 편집 후 렌더러를 다시 빌드할 때만 npm ci와 npm run build:renderer를 사용한다. 로컬 설치/실행 명령은 README.md에 있다.

게임의 무기 ↻ 버튼 또는 F(2P O)를 누르면 상단 슬롯 HUD가 열린다. 슬롯을 탭하거나 1/2/3(2P 7/8/9)으로 선택한다. 순서는 AR → 권총 → 산탄총이다. 치트 키는 Z/X/C로 바뀌었으며 양쪽 화면의 치트 버튼도 사용할 수 있다.
