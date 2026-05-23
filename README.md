# Project Dashboard

공개 프로젝트 운영 리포트 저장소.

## 주요 URL

- 메인 인덱스: https://gmpark-creator.github.io/project-dashboard/
- Codex 운영 리포트: https://gmpark-creator.github.io/project-dashboard/codex/
- Solar Project - Codex: https://gmpark-creator.github.io/project-dashboard/solar-project-codex/
- Solar Project - Claude: https://gmpark-creator.github.io/project-dashboard/solar-project-claude/
- INST EXTRACTOR 브리핑: https://gmpark-creator.github.io/project-dashboard/codex/inst-extractor/
- 2D Match Tracker: https://gmpark-creator.github.io/project-dashboard/match-tracker/

## 현재 포함 프로젝트

1. AIS Ship Tracker
2. Sports Highlight Generator
3. Solar System Simulator
4. INST EXTRACTOR

## 최신 반영

- 태양계 Claude 버전 — 고해상 행성 텍스처(7행성 NASA 출처, jsDelivr/threex.planets) + 주요 위성 11개 추가 (포보스·데이모스·갈릴레오 4 · 타이탄·레아·티타니아·오베론·트리톤). 가시성 이중 로직: 행성 포커스 자동 표시 + 「🌙 위성」 전역 토글, opacity 페이드 트윈
- 태양계 Claude 버전 — NASA/Gaia DR3 팩트체크 정밀화: 40 에리다니 A 16.45 → 16.340 광년, α Cen 4.37 → 4.344 광년, 카이퍼 영역에 산란 원반(Scattered Disk, 50~1,000 AU) 입자·윤곽 추가. 정확도 97% → ~99.5%
- Claude 보고서 — 「G.M.PARK 프로젝트 대시보드」 메인 페이지 신설 (사이드바 로고 클릭 → 알록달록 그라데이션 HERO + 프로젝트 컬러풀 카드 + 추가 영역 placeholder)
- Claude 보고서 — Solar 프로젝트 상세에 2026-05-23~24 작업 4건(외태양계 영역·외계 항성계·부산 달 위젯·조석 부산 기본값) issues/milestones 추가
- Codex 공유용 핸드오프 마크다운 `claude/HANDOFF_FROM_CLAUDE.md` 작성 — 코드 위치·알고리즘 의도·피드백 요청 포인트 정리
- 태양계 Claude 버전 — 달 위젯에 실제 NASA 달 텍스처(moon_1024.jpg) 적용, Canvas 2D clip + multiply 합성으로 사실적 표면(크레이터·바다·고지) 표현
- 태양계 Claude 버전 — 달 위젯 색감 보정: 부산 조석예보표 톤(황금빛 노란 + 어두운 회색)으로 통일 (이전 단계)
- 태양계 Claude 버전 — 부산 기준 실시간 달 모양 위젯 추가 (조석 패널 위, Canvas 2D 위상 시각화 + 한국어 8단계 위상명 + 조명률·달 나이)
- 태양계 Claude 버전 — 조석표 기본 지점을 인천 → 부산으로 변경
- 태양계 Claude 버전 — 카이퍼 벨트(30~50 AU) 반투명 평면 띠 + 오르트 구름(2,000~100,000 AU) 반투명 sphere shell 추가로 영역 시각화 강화
- 태양계 Claude 버전 — 외계 항성계 추가: 「프로젝트 헤일메리」의 40 에리다니 A(16.45 광년), 「삼체」의 알파 센타우리(4.37 광년) 실제 거리 반영
- 태양계 Claude 버전 — 카이퍼 벨트·오르트 구름·외계 항성계 모두 「초점」 메뉴에서만 영역 윤곽 표시 (시야 깔끔하게 유지)
- 태양계 Codex / Claude 공개 비교 경로 분리
- 태양계 1년 전후 이동을 시간 흐름형 재생 방식으로 변경
- 태양계 Codex 버전 행성 텍스처 품질 개선
- INST EXTRACTOR 집 데스크탑 실행 인수인계 문서와 스크립트 반영
