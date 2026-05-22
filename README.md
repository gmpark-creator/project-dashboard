# 프로젝트 대시보드

AI(GPT · Claude) 협업으로 진행한 **3대 주요 프로젝트**의 진행 기록 · 타임라인 · 상태를
한눈에 볼 수 있는 웹 기반 인터랙션 대시보드(보고서).

## 웹에서 바로 보기

🔗 **https://gmpark-creator.github.io/project-dashboard/**

## 구성

- 단일 HTML 파일 — Tailwind CSS + Lucide 아이콘(CDN)
- 좌측 프로젝트 탭 / 우측 상세(타임라인·카드)로 부드럽게 전환
- 상태 태그(완성·진행 중·보류), 가로/세로 타임라인, 기술 스택·이슈 카드

## 데이터 수정 방법

`index.html` 상단 `<script>` 안의 **`PROJECTS` 객체**만 고치면 화면이 자동으로 갱신된다.
(날짜는 `YYYY-MM-DD`, status는 `completed` / `in-progress` / `paused`)

## 수록 프로젝트

1. **AIS Ship Tracker** — 실시간 선박 추적·모니터링 시스템
2. **Sports Highlight Generator** — AI 기반 스포츠 하이라이트 생성 엔진
3. **Solar System Simulator** — 3D 실시간 태양계 시뮬레이터 ([라이브](https://gmpark-creator.github.io/solar-system/))
