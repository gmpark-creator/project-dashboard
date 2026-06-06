# 06 - Claude R3 QA Integration Report

## 적용 범위

Claude R3의 mock-app QA 문서(`design/09-claude-r3-mock-app-qa.md`)에서 Next.js 앱에 바로 반영 가능한 항목을 `studio-app/`에 통합했다.

## 반영한 항목

- R3-01: 사용자 화면의 개발용 `mock` 문구를 제품 문구로 교체.
- R3-02: "가능한 좁은 범위로 다시" 액션에 `~12⚡` 비용 표시 추가.
- R3-04/R3-11: Take 카드의 원시 품질 숫자 제거, 체감 라벨로 대체.
- R3-05: 렌더 stage를 한국어 단계명으로 매핑하고 완료 시 stage 숨김.
- R3-06: 완료된 렌더 job에 미리보기/다운로드/공유 액션 추가.
- R3-07/R3-08: 실패/기존 후보 상태에서 "이 컷만 다시"를 주 액션으로 올리고, 후보 없음일 때만 "이 컷 생성" 표시.
- R3-12: 게시용 품질 승급 버튼에 설명 tooltip 추가.
- R3-13/R3-19: 내보내기 전 비용/시간 요약과 사용자 친화적 자막 옵션 문구 추가.
- R3-14: 빈 아이디어 입력을 UI와 API/service 양쪽에서 차단.
- R3-15: `reviewing`을 "검토중"이 아니라 "선택 필요"로 변경.
- R3-16: 화면 이동 시 이전 toast를 제거.
- R3-18/R3-10: 전체 생성/렌더 중복 클릭으로 인한 재과금 위험 완화.
- R3-20: 모바일 상단에 크레딧 잔액 노출.
- R3-21/R3-22/R3-23: view별 document title, Take placeholder, 대시보드 상태 기반 진입 화면을 보강.

## 추가 통합

Claude가 대시보드에 프로젝트 #11 `Cutpilot` 등록과 rose 테마를 추가했다. 이는 AI Video Studio 프로젝트 등록 작업으로 판단해 함께 추적한다.

## 검증 결과

- `npm run validate:contracts` PASS
- `npm run test:mock` PASS
- `npm run typecheck` PASS
- `npm run build` PASS
- `npm audit --omit=dev` PASS, 0 vulnerabilities
- Local `GET /` on `http://127.0.0.1:3020/` HTTP 200
- Blank `POST /api/projects` HTTP 400
- Valid project create -> generate-all HTTP flow PASS, 30 generation jobs queued
- UI source scan: model/provider names remain hidden in `app/` and `src/features/`
