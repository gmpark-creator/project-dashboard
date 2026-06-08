# 39 · Claude R30 — 크리에이터 플로우 재감사 + 실패 복구 한국어화

> 2026-06-08 · Claude(Opus 4.8, 1M) · 디렉터 지시 "크리에이터 플로우 제품 UX 재감사 → 최고가치 1건 구현"
> [[38]](야간 핸드오프) 후속. 운영 콘솔(운영자)은 종료, 이번엔 **실제 제품인 크리에이터 흐름(아이디어→MP4)** 차례.

## 1. 재감사 방법 (5렌즈 병렬)

다중 에이전트로 크리에이터 플로우를 5개 렌즈로 병렬 감사하고, 6대 원칙(P1~P6) **약속 vs 실제 구현** 갭을 코드 근거와 함께 수집(34건) → Claude단독·비게이트·누출안전·게이트통과 조건으로 필터링해 최고가치 슬라이스 1건을 선정.

- 렌즈: ①온보딩·첫결과(P3) ②티어·생성(P1/P2/P6) ③편집·다듬기(P4/P5) ④내보내기·완성(논지) ⑤횡단(모바일/상태/카피/a11y)
- 기준: 영향 × 확신 ÷ 노력, 논지·원칙 기여. 게이트 깨지 않고 프론트(StudioApp.tsx/api.ts/globals.css)만 변경 가능한 것.

### 선정: 실패 경로의 영어 raw 누출 + 비복구 토스트 (전 mutating 액션 공통)

코드로 검증한 사실:
- `api.ts` `apiErrorMessage`(구 36~40): `payload.userMessage`(서버 **영어**) 패스스루 + INSUFFICIENT_CREDITS 시 `(needed X, available Y, shortfall Z)` **영어 raw 숫자** 추가.
- `StudioApp.tsx` `run()`(구 catch): `notify(error.message)` → 위 영어 문자열을 한국어 앱 토스트에 그대로 노출. 2.6초 후 사라져 **다음 행동 안내 없음**.
- 대조 증거: 바로 아래 `cancelJob`은 친절한 한국어 안내로 처리됨 → `run()`만 일관성 깨짐.
- 14개 호출부(이미지/스토리보드/비교/편집/내보내기)가 전부 이 한 `run()`을 경유 → **한 곳 수정으로 전 영역 치유**.

위반 원칙: UX-9.1(한국어), P6(비용 명확성), P5(상태별 복구), 누출 위생.

## 2. 구현 (프론트 3파일)

| 파일 | 변경 |
|---|---|
| `studio-app/src/features/studio/api.ts` | `apiErrorMessage` 한국어화. 서버 영어 userMessage 패스스루 제거, code 기준 한국어 생성. 크레딧 부족은 추상 단위 `shortfallCredits⚡`만 노출(raw id/url/provider명 무포함). |
| `studio-app/src/features/studio/StudioApp.tsx` | ① `describeFailure(error)` — ApiError `code`/`retryable`/`fallbackSuggested`/`estimate`만 보고 한국어 복구 안내(크레딧부족 / 일시적·대체가능 / 일반) + "이전 작업은 보존" 안심 문구. raw error·영어·식별자 미노출. ② `failureNotice` 상태 = 닫거나 다음 성공까지 남는 영구 배너(`role="alert" aria-live="assertive"`). ③ `run()` 재정비: 재진입 가드(`runningRef`)로 **중복 제출·이중 과금** 차단 + 실패 시 `failureNotice`. ④ 성공/`goToView` 시 자동 해제. import에 `isApiError` 추가. |
| `studio-app/app/globals.css` | `.failure-notice` 붉은 톤(amber `.notice` 경고와 시각 구분), 390px 줄바꿈·가로 무넘침, `.failure-dismiss` 닫기 버튼. |

### 누출 안전 보장
표면에 닿는 값은 가공된 한국어 문자열과 `shortfallCredits`(추상화된 크레딧 정수)뿐. raw error 문자열, 영어 needed/available/shortfall 숫자, jobId/url/provider/model은 렌더되지 않음. 이 변경은 **기존 영어 raw 숫자 누출을 제거**한다. `code`는 내부 분기값으로만 사용.

### 범위 절제 (후속 후보)
- 버튼별 spinner/disable(자식 컴포넌트 광범위 prop plumbing)은 미적용 — 이번엔 `run()` 레벨 재진입 가드로 이중 과금만 막음. 가시적 pending 상태는 별도 슬라이스.
- 크레딧 부족 시 "더 낮은 품질로/충전" 같은 **맥락별 복구 액션 버튼**은 호출부별 컨텍스트 주입이 필요 → 후속.

## 3. 검증 (게이트 GREEN)

`studio-app`에서 `npm run verify` 통과:
- `typecheck` ✅ (isApiError import·describeFailure 타입 정합) · `validate:contracts` ✅ · `test:mock` ✅ (30개 전부; `api-credit-error.test`는 **서버** 라우트 `body.userMessage`를 검증해 프론트 변경과 무관) · `npm audit --omit=dev` ✅ 0 vuln · `build` ✅ (Compiled successfully, 19/19 static, `/` 정적 프리렌더 = StudioApp SSR 무에러).

## 4. 다음 후보 (이번 감사 차순위, 미착수)

- **Express 자동 경로**(P3 완성본 먼저): NewProject 단일 CTA가 스토리보드로 점프 → "알아서 만들어줘" 2차 CTA로 `createProject`+`generateAll(fast)`+compare 진입해 첫 결과를 완성 컷부터.
- **내보내기 버튼 비용 = 실제 3잡 합 + 잔액 부족 사전 경고**(P6): 현재 단일 컷 preview.estimate만 표시, 실제는 6/15/30s 3잡. `affordable`(이미 프론트) 미사용.
- 버튼별 가시 pending/disable(위 절제 항목).

(비용 라벨 정합·티어 컨트롤 신설 등 다수는 Codex 백엔드 또는 디렉터 결정 게이트라 이번 후보에서 제외.)
