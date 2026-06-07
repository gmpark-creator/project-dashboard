# 36 · Claude R28 — 적대적 리뷰 대응 (key 안정화 + a11y)

> 2026-06-08 · Claude(Opus 4.8) · 야간 자율 슬라이스 #6 · [[34]] 후속
> 영역: 프론트 UX (Claude-owned).

## 배경

R23~R27 운영 콘솔 작업을 **3-에이전트 적대적 리뷰**(정확성·누출안전·완결성, 워크플로)로 검증.

### 리뷰 결과 요약
- **누출안전: 완전 클린** — 독립 에이전트가 13패널 전부 점검, 금지 필드(jobId/projectId/leaseId/token/storageKey/url/provider·model 실명/raw error) 렌더 0. ProviderHealth는 이름 없이 집계만, StorageCleanup은 storageKey/reason 제외, WorkerCompletion은 receipt.error 제외 확인. env 이름 노출은 허용 범위로 확인. ✅
- **완결성: 갭 없음** — 모든 read-only `/api/system/*` 엔드포인트가 콘솔에 노출됨을 재확인. ✅
- **정확성**: 실제 버그 없음(필드 접근·인터벌 정리·정렬·null 처리 모두 정상). React key 안정성 지적만.

## 적용한 수정

### 1) React key를 안정 고유 id로 (8개 운영 패널)
타임스탬프+index 조합 key를 각 항목의 고유 id로 교체. **React key는 DOM에 렌더되지 않으므로 raw id를 key로 써도 누출이 아니며**, 4초마다 갱신되는 스냅샷에서 재정렬 시 안정적 재조정을 보장한다.

| 패널 | 변경 key |
|---|---|
| 워커 디스패치 | `item.dispatchKey` |
| 워커 리스 | `lease.id` |
| 워커 완료 | `receipt.completionKey` |
| 재시도 계획 | `item.receipt.completionKey` |
| 재시도 실행 | `item.record.id` |
| 스토리지 정리 계획 | `item.artifact.id` |
| 스토리지 정리 실행 | `record.id` |
| 운영 요약 | `tile.label` |
사용하지 않게 된 `index` 콜백 파라미터도 함께 제거.

### 2) 토스트 접근성 (앱 전역)
`<div className="toast">` → `role="status" aria-live="polite" aria-atomic="true"` 추가. 잡 취소·오류 등 상태 토스트를 스크린리더가 자동 안내하도록. 운영 콘솔뿐 아니라 전체 앱 토스트에 적용되는 개선.

## 보류(문서화) — 한계/범위 고려

리뷰가 제안했으나 이번엔 미적용(마진 또는 재사용 컴포넌트 광범위 침범):
- 로딩 스켈레톤: 현재 "실패 시 패널 숨김 + 빈 상태"가 기존 metrics/queue와 일관된 의도된 패턴. 빠른 로드라 체감 작음.
- 요약 타일 클릭 후 대상 섹션 헤더 포커스 이동: h2에 tabindex 부여 등 재사용 컴포넌트 다수 수정 필요 → 마진 대비 비용 큼.
- metric grid의 시맨틱 table화: 재사용 패널 광범위 리팩터 → 별도 슬라이스로 검토.
- 빈 상태의 auth/network/no-data 구분: 현재 일반 안내로 충분.

## 검증

| 게이트 | 결과 |
|---|---|
| `npm run typecheck` | ✅ 에러 0 (dangling index 없음) |
| `npm run validate:contracts` | ✅ |
| `npm run test:mock` | ✅ 전 테스트 OK |
| `npm run build` | ✅ Compiled successfully (19/19) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| 운영 콘솔 QA 1366×900 / 390×900 | ✅ 13섹션 렌더·오버플로 0·**누출 0**·favicon 404만 |

## 다음

운영 콘솔 작업 안정화 완료. 남은 후보는 보류 항목(시맨틱 table·로딩 스켈레톤)뿐이며 가치 대비 비용을 고려해 디렉터 판단 영역으로 남김. 최종 핸드오프 작성 예정.
