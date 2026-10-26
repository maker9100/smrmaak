# v0.6.5 검증

## 서버 / 게임 규칙

2026-10-26: 아래 검사 146개 통과. Starlette 의존성의 deprecation 경고 1개가 있었고 실행 오류는 없었다.

```bash
python -m pytest tests/test_roles.py tests/test_game.py tests/test_aim.py tests/test_train.py tests/test_wide_ai.py tests/test_local_start.py tests/test_arenas.py tests/test_weapons.py tests/test_update.py tests/test_update06.py -q
```

- 세 보직별 최대 체력, 걷기/조준 이속과 대각선 정규화, 마찰, 라운드 초기화
- 인간/AI의 Glowsquid 화상 면역, 총알·압사·열차 피해 유지
- AI팀 보직 채움, AI 치트 미사용, 모든 맵 AI 전투/이동과 라운드 처리
- 클라이언트의 체력·속도·경기 중 보직 변경 요청 무시, 잘못된 보직 입력 안전 처리
- WebSocket 보직 선택과 최대 체력 동기화, 로컬 팀/준비 조건
- 기존 에임, 무기/탄약/장전, 열차, 크레인, 시침, 화상 장판 회귀 검사

보직과 관계없는 피해 단위 검사는 명시적인 100 HP 표적을 사용하고, 새 보직 검사에서는 실제 클래스 최대 체력을 사용한다. 기존 이동 검사와 생존 체력 기대값을 새 규칙에 맞췄다.

## 브라우저

실제 Headless Chromium + SwiftShader WebGL에서 8개 통과.

```bash
CHEAT_FPS_BROWSER_TESTS=1 CHEAT_FPS_BROWSER=/absolute/path/to/chromium python -m pytest tests/test_roles_browser.py tests/test_graphics_browser.py tests/test_weapons_browser.py tests/test_update06_browser.py -q
```

- 모바일 크기에서 보직 선택, AI 즉시 시작, 선택 보관, HP/속도 동기화
- 로컬 2인에서 보직을 각각 고르고 각각 준비한 뒤 시작
- 서로 다른 세 인간 모델·두 팔/두 다리·기존 조준/보행 애니메이션
- 각 뷰포트의 Glowsquid 파란 장판/다른 보직 빨간 장판, 상대 ESP 두 형광색 점멸
- 5개 맵 반복 전환 시 재질/자원 수 안정, 품질 변경
- 무기 변경·발사·장전·분할 소유권, 적 헬멧 빨간 띠, 장전 보간

JS 구문 검사, 렌더러 번들 생성, Python 컴파일, ZIP 내부 전체 파일 일치 검사도 완료했다.

## 한계

실제 iPadOS Safari나 개별 기기의 FPS를 측정한 결과가 아니다. 브라우저 GPU가 WebGL2를 제공하지 않으면 Canvas 호환 모드가 사용된다. GitHub/Render 원격 배포는 수행하지 않았으며 배포 방법은 README.md와 UPDATING.md에 있다.
