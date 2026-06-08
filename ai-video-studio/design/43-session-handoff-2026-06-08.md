# 43 · Cutpilot 세션 종료 핸드오프 (2026-06-08) — 다음 작업 재개점

> 작성: Claude(Opus 4.8, 1M) · **이 문서가 다음 작업의 단일 재개점**이다. 새 세션은 여기부터 읽어라.
> 상태: `master` HEAD `edc10fa` · 작업트리 클린 · `npm run verify` 전체 GREEN · 전부 push 완료.

## 0. 한 줄

미리 가능한 작업 전부 완료·저장. **Codex(11월 토큰리셋 후) 합류 전까지 대기.** 충돌 위험 없음.

## 1. 이번 세션 한 일 (커밋 25개, `880196c`→`edc10fa`)

### 트랙 A · 비용 모델 (R31~R35) — ⚠️원래 Codex 소유
`design/35`·`38`에서 "Codex 소유 blocker"였던 비용 모델을 **박사 지시로 Claude가 구현**(Codex 영역 침범).
- `cost-policy.ts` 단일화 · `credit-errors.ts` 분리 · 프로덕션 estimate fail-closed · OpenAPI · invariant/라우트 테스트.
- **estimate==reservation 불일치(design/35) 해소.** 과금 fail-open 버그 2건 수정.
- 📨 **Codex 검토 인계 = `codex/214`** (Codex가 읽고 자기 설계대로 재정렬). 리포트 `codex/212`·`213`.

### 트랙 B · Claude 본연 트랙 (UX/프론트) — R30, R36~R51
박사가 분담대로 복귀 지시 후 수행.
- **온보딩/실패/피드백:** Express 경로(P3) · run() 실패 복구 한국어화 · 작업중 잠금(전역 표시 + 모든 크레딧 소비 버튼).
- **상태/체감:** 대시보드 초기로딩(false-empty flash 제거) · 생성중 안내 · TakeCard indeterminate 진행바 · 빈상태 안내형.
- **a11y:** 뷰전환 포커스 이동 · aria-current · 폼 에러 aria-describedby/role=alert · prefers-reduced-motion.
- **검증/내보내기:** 빈 프롬프트·url 입력 가드 · 렌더 "3가지 길이" 안내.
- **분리(A):** `format.ts`(순수 헬퍼) · `CancelJobButton.tsx`(공유 컴포넌트) 추출.
- 리포트 `design/40`(Express)·`42`(UX 세션) · 분리 제안 `design/41`.

## 2. 머지/충돌 안전 (중요)

- ai-video-studio는 `master` 단일(worktree 격리 없음) + **영역 분리**로 운영 → 영역 침범이 유일한 충돌원.
- **Claude-트랙(트랙 B)**: 내 레인(`design/`·`src/features/studio/`·`globals.css`)만 수정 → Codex와 충돌 없음.
- **비용 모델(트랙 A, Codex 영역)**: master에 있고 GREEN. **Codex 합류 시 `codex/214` 먼저 읽고**, Codex가 병렬로 비용 모델을 미push 작업해둔 게 있으면 reconcile 후 진행(같은 파일이라 중복/충돌 위험).
- `cost-policy.ts`는 `domain/`(Codex 영역)이지만 **프론트가 `creditCostForAction` 등 export를 직접 import**(R34/R47) → Codex가 export 표면 바꾸면 프론트 깨짐. `codex/214 §5` 참조.

## 3. 다음 작업 (재개점)

### Codex (11월 복귀 후) — `codex/214` 순서대로
1. `git pull` + Codex 병렬 미push 비용작업 확인.
2. §3 높음 2건: `live-render-preview.test` 단언(8→26) 확인 · live preview available 변경 확인.
3. `cost-policy` 데이터화(config JSON) 여부 · fail-closed/네이밍을 Codex 스타일로.
4. §4 불변식(단일출처·fail-closed·누출안전) + §5 프론트 export 표면 유지.

### Claude 트랙 또는 proper tool
- **운영콘솔 3-way 분리** (`design/41` 정정판 §경계원칙): `panels.tsx`(공유: Metric·SystemMetrics·JobQueue·MediaArtifact 패널 — Dashboard/AssetLibrary와 공유) / `OperationsConsole.tsx`(ops 전용) / 셸. **공유 패널이 ops전용과 교차배치**라 함수별 추출 필요 → **refactor IDE/AST 도구 권장**(무인 string-편집은 `format.ts`·`CancelJobButton`까지가 안전 한계).
- 백엔드 게이트 풀린 뒤(Codex): P4 편집 실제 실행 UI · 내보내기 컷 구성 선택 · 자산/참조 DELETE UX.

## 4. 검증

`npm run verify` GREEN: `typecheck` · `validate:contracts`(providers 4·routing 7·templates 6·ops 44·routes 40) · `test:mock`(32, cost-policy-invariants·api-cost-estimate 포함) · `audit`(0 vuln) · `build`(19/19 static).
로컬 실행: `cd studio-app && npm install && npm run dev -- -p 3020` (mock 모드).

## 5. 안 한 것 (의도적)

운영콘솔 분리 실행(proper tool 필요) · 프로토타입/목앱 동기화(저가치) · 백엔드 변경(Codex 영역, 11월 대기) · 추가 micro-polish(이미 접근성/검증 충족, padding 회피).

## 6. 완성도 스냅샷 (2026-06-08 실측, 정적 코드 근거)

> ⚠️ 공식 진행도(대시보드)는 박사 발화로만 갱신. 아래는 **재개 시 위치 파악용 실측 추정치**(앱 실행 검증 아님, 핵심 판정은 코드로 확인).

| 잣대 (무엇을 100으로) | % |
|---|---|
| 백엔드 **토대**(계약·mock 상태머신·Postgres 영속성·R2·라우팅·비용·인증) | **≈ 70~80%** |
| **클릭형 데모**(아이디어→스토리보드→생성(mock)→비교→편집→내보내기 end-to-end가 mock으로 흐름) | **≈ 60%** |
| **실 출시 제품**(진짜 AI가 진짜 이미지/영상/MP4 생성) | **≈ 23%** |
| 영역 내부 완성도 | 백엔드(Codex) **≈40%** · 프론트(Claude) **≈62%** |
| 지금까지 투입 작업량 비율 | **Codex ≈65 / Claude ≈35** |

**23%인 이유 = 실 생성엔진층 0%**: provider HTTP 호출 0건(백엔드 outbound는 R2 하나뿐), 영상=하드코딩 `flower.mp4`, 이미지=`mock://`, MP4 인코딩 0, LLM 분해 0(고정 템플릿), 큐 워커 0. `readiness.ts`가 `live*Implemented=false`로 정직하게 fail-closed. → 토대는 거의 됐고, **빠진 건 외부 연동층 하나**.

## 7. 재개 절차 — 어느 PC(노트북/데스크탑)·어느 에이전트든 여기서

**공통:** 진실의 원천 = **GitHub master**(로컬 .claude 메모리 아님). 새 세션은 ① repo 루트에서 `git fetch && git pull`('없다' 단정 전 fetch 필수, 다른 PC 작업분 수령) ② **이 문서(design/43) 먼저** ③ `studio-app`에서 `npm install`(각 PC node_modules 없으면) → `npm run verify` GREEN 확인.

- **Codex 재개(11월 토큰 복귀):** `codex/214`(Claude가 건드린 Codex 영역 검토 인계) 먼저 → 비용모델 재정렬 → 그다음 신규 백엔드(§3, **실 provider 실행 어댑터부터** = 영상 0의 원인). 끝나면 push + 새 codex 리포트(>214)로 핸드오프.
- **Claude 재개(Codex 핸드오프 후 이어받기):** `git pull` → **codex 최신 리포트(>214) + commit log**로 Codex가 뭘 했는지 파악 → 이 문서 갱신 → 프론트를 새 백엔드에 맞춰 보강(콘텐츠 placeholder→실 결과, provider 상태/진행 표시, 컷 구성/충전 UI 등). cost-policy export 표면을 Codex가 바꿨으면 프론트 맞춤(codex/214 §5).

## 8. 박사(외부) 셋업 체크리스트 — Codex 코드만으론 실동작 안 됨

실 생성이 켜지려면 박사가 외부 계정으로 발급/설정(env)해야 하는 것:
- **생성 provider API 키**(영상·이미지 엔진) + **LLM 키**(스토리 분해)
- `DATABASE_URL`(Postgres) · `R2_*` 4종 · `CUTPILOT_QUEUE_URL` · `CUTPILOT_ADMIN_TOKEN`
- 결제/인증/조직 경계(제품 결정)

→ Codex가 fail-closed 골격은 깔아놨으니, **실 provider 실행 어댑터(Codex §3-1)** 구현 + 박사가 위 env 꽂고 `CUTPILOT_ENABLE_LIVE_READS/WRITES=1`·`CUTPILOT_RUNTIME_MODE=production` 켜면 live 경로가 열린다. 그 순간 완성도 23%→60~70% 급등.

## 참조 문서

비용: `codex/212`·`213`·`214`, `design/35`. UX: `design/39`·`40`·`42`. 분리: `design/41`. 직전 야간: `design/38`.
