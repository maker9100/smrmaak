# 0.8.1 업데이트 설치

1. ZIP을 풀어 backend/와 frontend/ 전체를 교체하고 루트 설정 파일도 반영한다. 내부 파일을 루트에 펼치지 않는다.
2. 새 backend/projectiles.py, frontend/throw-physics.js·trajectory.js·world-batching.js와 갱신된 renderer3d.js를 포함한다. 배포 번들이 있으므로 보통 실행에는 npm이 필요 없다.
3. Render 연결 GitHub 브랜치에 커밋한다. 자동 배포가 켜져 있으면 기다리고 꺼져 있으면 Manual Deploy를 실행한다. 이 ZIP 제공 과정에서 원격 저장소나 Render를 직접 변경하지 않았다.
4. Python Web Service, 빈 Root Directory, Build Command `pip install -r requirements.txt`를 확인한다. Start Command는 다음 한 줄만 입력한다.

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1
```

명령을 두 번 붙이지 않는다. 방은 메모리에 있으므로 workers는 1이다.

5. .python-version과 render.yaml은 Python 3.11.11이다. 기존 서비스에 PYTHON_VERSION 환경 변수가 있으면 그 값도 확인한다.
6. 배포 완료 후 새로고침한다. 메뉴·설정·/health의 version과 build는 모두 0.8.1이다. 재배포하면 기존 방은 초기화된다.
7. AI전은 보직 선택 후 바로 시작한다. 로컬전은 양 팀 1명 이상·전원 준비가 필요하며 같은 기기 2명도 각각 준비한다.

수류탄은 5번 슬롯이다. 발사 버튼을 누르면 안전핀을 뽑고 놓으면 던진다. 핀을 뽑은 때부터 총 3초 뒤 폭발한다. 무기 전환·사망·연결 종료로 신관을 초기화할 수 없다. 짧은 화면 탭은 바로 던진다. 도끼와 수류탄에는 예상 궤적과 비행 잔상이 표시된다.

자세한 규칙과 로컬 설치 명령은 README.md, 검증 결과는 VALIDATION.md, 전체 코드와 파일 경로는 SOURCE-CODE.md에 있다.

5번을 누르면 선택 수류탄, 다시 누르면 선택 투척무기다. 칼은 1번이다. 새 필수 파일 frontend/utility-effects.js까지 포함하여 frontend/와 backend/ 전체를 교체한다. 선택은 메인 메뉴 또는 각 로컬 참가자의 대기실에서 한다.
