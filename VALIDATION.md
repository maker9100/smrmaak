# v0.7.0-g2 검증
+
+2026-10-26. 서버 전체 검사는 169개 통과. 기본 실행에서 비활성인 브라우저 검사는 별도 선택 실행했다. Starlette deprecation 경고 1개가 있다.
+
+새 서버 검사: 보직별 점프 최고 높이 비율과 누르고 있기 반복 방지, 웅크리기 및 클라이언트 높이 위조 거부, AR/권총 헤드샷 2배와 산탄총 제외, 도끼 명중 반환·바닥 회수·빈 슬롯 차단·무한 탄창 복제 거부. 기존 무기·팀·라운드·실드·AI·기믹 검사도 실행했다. AI의 수류탄 투척 의도를 유지하여 장전/무기 전환 대기 중 계획이 유실되지 않게 했다.
+
+```bash
+python -m pytest -q
+CHEAT_FPS_BROWSER_TESTS=1 CHEAT_FPS_BROWSER=/absolute/path/to/chromium python -m pytest tests/test_actions_browser.py tests/test_art_revision_browser.py::test_shield_depletion_does_not_blacken_world -q
+```
+
+실제 Chromium/SwiftShader 브라우저 검사 2개: Space 점프·Ctrl 웅크리기와 실제 시점 변경, 투척 도끼 모델·바닥 낙하·빨간 슬롯 선택 불가·이동 회수, 세 총성 버퍼 구분, 390px 모바일 점프/웅크리기 터치 버튼, 기존 실드 소진/회복/관전 전환. iPadOS Safari 실기기 검사나 총성의 실총 녹음 비교 청취 검증은 아니다. 총성은 합성 음향이다.
+
+배포 번들·JS 구문·Python 컴파일·ZIP 무결성 및 소스 바이트 일치를 확인한다. 전체 소스와 설정, 글꼴 데이터와 라이선스를 포함한다. GitHub/Render 원격 배포는 수행하지 않았다. 기존 그래픽은 공통 Three.js 절차 생성 마감이며 Source 엔진급 자산 품질을 달성했다는 의미는 아니다.
+