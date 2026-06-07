# 37 · Claude R29 — 프로덕션 준비 체크리스트

> 2026-06-08 · Claude(Opus 4.8) · 야간 자율 슬라이스 #7 · [[36]] 후속
> 영역: 프론트 UX (Claude-owned). 후보 목록의 "Production readiness operator checklist".

## 목표

운영 콘솔의 런타임 점검 패널이 라벨+상태만 보여줘, 운영자가 "프로덕션으로 가려면 무엇이 필요한지"를 알 수 없었다. readiness 응답은 항목별 필요 설정·진척도 정보를 담고 있으나 미활용. 이를 **행동 가능한 프로덕션 준비 체크리스트**로 강화.

## 한 일 — `ReadinessConsolePanel` 강화

1. **준비 진척도**: 헤더에 `점검 {passCount}/{total} 정상` 표시. 목업 모드에서 미충족 항목이 있으면 "아래 항목은 프로덕션 전환 시 필요합니다" 안내를 덧붙여, 목업의 warn이 현재 오류가 아니라 **프로덕션 전제조건**임을 분명히 함.
2. **항목별 액션 힌트**: `readinessHints` 맵으로 각 점검 항목(persistence·provider_credentials·object_storage·queue_worker·admin_access 등)에 "무엇을 설정하면 정상이 되는지" 한국어 한 줄을 비-정상 항목 아래에 표시. provider/model 실명 없이 개념(프로바이더 키·오브젝트 스토리지 등)으로만 설명.
3. **invalidEnv 노출**: 기존엔 `missingEnv`만 칩으로 보여줬으나, `invalidEnv`(형식 오류 환경변수)도 별도 칩 그룹으로 추가. env "이름"만 노출(값 비노출).
4. **모드별 라벨**: 목업 모드 미충족은 "설정 필요 N건"(전제조건), 운영 모드는 "준비됨/점검 필요"로 구분.

## 안전성

- 노출은 점검 항목 한국어 라벨·상태·한국어 힌트 + env **이름** 칩뿐. provider/model 실명·env 값·raw id 없음.
- 공유 컴포넌트가 아니라 콘솔 전용 `ReadinessConsolePanel`만 수정 — 상단 배지(RuntimeReadinessBadge)는 무변경(기존 동작 유지).
- CSS: `.readiness-item`에 `flex-wrap` + `.readiness-item-hint`(들여쓴 dim 보조줄) 추가. 배지 드롭다운엔 힌트가 없어 영향 없음.

## 검증

| 게이트 | 결과 |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run validate:contracts` | ✅ |
| `npm run test:mock` | ✅ |
| `npm run build` | ✅ Compiled successfully |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| 운영 콘솔 QA 1366/390 | ✅ 누출 0·오버플로 0·체크리스트 힌트 렌더 확인 |

목업 모드 현재 상태: 점검 1/10 정상(mock_persistence만 pass), 나머지는 프로덕션 전환 시 필요 항목으로 힌트와 함께 표시. 운영 모드에서 env가 채워지면 N/10이 올라가며 "준비됨"으로 전환.

## 다음

운영 콘솔 + 프로덕션 준비 표면이 후보 목록의 운영자 항목을 전부 커버. 남은 건 보류한 a11y 폴리시(시맨틱 table 등, 재사용 컴포넌트 광범위 리팩터)뿐. 최종 핸드오프 작성 예정.
