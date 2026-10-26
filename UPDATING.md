# v0.6.5 보직 업데이트 설치

1. ZIP을 풀고 backend/와 frontend/ 폴더를 모두 교체한다. 루트의 requirements.txt, render.yaml 등도 함께 반영한다.
2. backend/main.py와 frontend/index.html의 폴더 구조를 유지한다. 내부 파일을 모두 루트에 펼치지 않는다.
3. Render가 연결된 GitHub 브랜치에 커밋한다. 자동 배포가 켜져 있으면 배포가 시작되고, 꺼져 있으면 Manual Deploy를 실행한다.
4. 탭을 새로고침한 후 메뉴/설정과 서버 /health의 버전이 모두 0.6.5인지 확인한다.
5. AI전은 보직을 고른 뒤 게임 시작. 로컬전은 참가자가 보직을 고르고 각자 준비한다.

보직: Scout HP 150/+20%, Guard HP 300/−25%, Glowsquid HP 200/+15%/제련소 화상 면역. 기본 체력 기준은 200이다. 같은 기기 2인도 보직을 각각 고를 수 있다.

이번 파일은 v0.6.0 기반 보직 릴리스다. 서버 재시작 시 진행 중 경기는 초기화된다. 이 다운로드 제공 과정에서 GitHub/Render를 직접 변경하지 않았다.
