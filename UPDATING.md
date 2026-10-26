# v0.7.0 업데이트 설치

1. ZIP을 풀고 backend/와 frontend/ 전체를 교체한다. 루트 requirements.txt, render.yaml, .python-version도 반영한다. 새 frontend/audio.js, world-effects.js, renderer3d.js와 backend/combat.py를 빠뜨리지 않는다.
2. backend/main.py와 frontend/index.html의 폴더 구조를 유지한다. 내부 파일을 모두 루트에 펼치면 backend.main을 찾지 못한다. GitHub의 backend라는 일반 파일과 폴더를 혼동하지 않는다.
3. Render 연결 브랜치에 커밋한다. 자동 배포가 켜져 있으면 기다리고, 꺼져 있으면 Manual Deploy를 실행한다. 이 ZIP 제공 과정에서 GitHub/Render를 직접 변경하지 않았다.
4. Python 런타임, 빈 Root Directory, Build Command `pip install -r requirements.txt`를 확인한다. Start Command는 아래 한 줄만 입력한다. uvicorn 명령을 두 번 붙이면 unexpected extra arguments 오류가 난다.

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
```

5. Blueprint와 .python-version은 Python 3.11.11이다. 기존 서비스 Environment에 PYTHON_VERSION이 있다면 그 값도 3.11.11로 맞춘다. 파일 변경만으로 기존 환경 변수는 바뀌지 않는다.
6. 배포 완료 후 새로고침한다. /health의 version, 메뉴/설정 모두 0.7.0이어야 한다. 재시작하면 기존 방은 사라진다. 다시 시작하고 맵 미리보기가 나타나는지 확인한다.
7. 슬롯은 1 도끼 / 2 권총 / 3 AR / 4 산탄총 / 5 수류탄이다. 수류탄 1/3은 준비 1+예비 3개, 무한 탄창은 B 또는 ∞ AMMO 버튼이다.

AI전은 보직 선택 후 바로 시작한다. 로컬전은 양 팀 1명 이상·전원 준비 시 시작하며 같은 기기 2명도 각각 준비한다. 영광의 동상은 천문관측소를 대체한다. 시체는 다음 라운드까지, 탄흔은 방당 최근 128개를 다음 라운드까지 유지한다.

실제 검증은 VALIDATION.md, 모든 코드·설정의 전체 내용은 SOURCE-CODE.md에 있다.
