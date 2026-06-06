# 03 - Implementation Plan

## MVP 목표

실제 영상 생성 provider를 붙이기 전, mock provider만으로 전체 제품 경로를 끝까지 통과한다.

```text
아이디어 입력
-> 구조화 스토리보드
-> 컷별 mock Take 생성
-> Take 선택
-> 자막/BGM/보이스 편집 상태 저장
-> Remotion/FFmpeg 렌더 job 생성
-> MP4 또는 placeholder output URL
```

## 권장 기술 스택

| 영역 | 선택 |
|---|---|
| App | Next.js + TypeScript |
| API | Route handlers 또는 Hono/Fastify API service |
| DB | Postgres + Prisma/Drizzle |
| Queue | Redis + BullMQ |
| Storage | S3/R2 compatible object storage |
| Render | Remotion + FFmpeg |
| Provider SDK | Adapter interface + REST clients |
| Auth/Billing | Clerk/Auth.js + Stripe later, MVP는 local session |
| Observability | structured logs + provider request id + job metrics |

## Repo 구조 제안

```text
apps/web
  app/
  components/
  features/video-studio/
apps/api
  routes/
  workers/
packages/domain
  schemas/
  types/
  routing/
packages/providers
  runway/
  luma/
  vertex-veo/
  adobe-firefly/
  mock/
packages/render
  remotion/
  ffmpeg/
packages/config
  routing.config.json
  provider-capabilities.json
  templates/
```

현재 `project-dashboard/ai-video-studio`는 설계/계약 저장소다. 실제 제품은 별도 app repo 또는 이 repo의 독립 하위 앱으로 분리하는 편이 낫다.

## Phase 0 - Contract Freeze

**상태:** 이번 Codex R1에서 완료.

- OpenAPI 초안
- Domain JSON Schema
- Provider capability snapshot
- Routing config
- Templates JSON
- 열린 질문 1차 결정

## Phase 1 - Mock Backend Vertical Slice

**목표:** 외부 API 없이 UX 전체 경로를 검증한다.

- DB schema: Project, Scene, Shot, Take, Job, Asset, CreditTransaction
- `decomposeIdea` mock + structured-output LLM adapter skeleton
- `generateShot` mock provider: sample MP4/poster 반환
- `getJob` polling
- `selectTake`, `regenerate`, `upgradeTake`
- `startRender` mock render job
- frontend prototype를 실제 API 호출로 교체

**검증:**

- JSON Schema validation
- API contract tests
- 10-shot project에서 2-shot failure를 넣어도 나머지 진행 유지
- 모델명 UI 누출 스캔

## Phase 2 - First Real Provider

**권장:** Luma 또는 Runway 중 하나만 먼저 붙인다.

**선택 기준:**

- API access 확보
- 비용/쿼터/지역 제한 확인
- webhook 또는 polling 안정성
- 결과 URL ingest 가능 여부

**구현:**

- provider secret 관리
- request normalization
- provider job polling
- result ingest to storage
- provider error mapping
- cost estimate config

**검증:**

- 20개 sample shot 생성
- 실패율/평균 대기시간/평균 비용 기록
- output metadata ffprobe 검사
- 3회 이상 반복 생성에서 job leak 없음

## Phase 3 - Multi-provider Routing

**목표:** Runway/Luma/Vertex 후보를 라우팅 config로 선택한다.

- capability filter: input type, aspect, duration, resolution, region, audio
- fallback policy
- split take policy
- provider health status
- admin-only engine trace

**검증:**

- text-only 요청에 image-only 모델이 선택되지 않음
- `needsLipsyncAudio` 요청은 audio-capable 후보로 라우팅
- region 제한 mock에서 제한 provider 제외
- provider outage mock에서 fallback 발생

## Phase 4 - Render Pipeline

**목표:** 선택된 Take들을 한 편의 MP4로 굽는다.

- EDL model
- captions burn-in and SRT export
- BGM/voiceover mix
- loudness normalization
- aspect derivative renders
- poster generation

**검증:**

- 6s/15s/30s parallel render
- audio peak/loudness 검사
- subtitle timing 검사
- mobile/desktop playback

## Phase 5 - Billing and Credits

**목표:** 비용이 실제로 통제되는 SaaS가 된다.

- estimate -> reserve -> capture/refund
- provider cost ledger
- per-plan concurrency
- insufficient credits recovery
- admin cost dashboard

**검증:**

- 실패 job refund
- fallback provider cost delta
- concurrency cap
- race condition test

## Phase 6 - Quality Loop

**목표:** 사용자 피드백과 자동 신호를 라우팅에 반영한다.

- take rating and rejection reasons
- quality flag collection
- prompt/tier/provider outcome metrics
- model recommendation tuning
- ML quality evaluator optional

## Claude 병렬 작업 요청

Claude가 다음 라운드에서 맡으면 좋은 작업입니다.

1. Codex 피드백 반영: Veo 4K/Runway Turbo/부분재생성 문구를 UX 문서에서 완화.
2. "고품질 승급" 버튼의 내부 모드 차이를 사용자가 몰라도 이해되는 마이크로카피 작성.
3. 실패/폴백 상태 문구 10종 작성. 예: "이 컷은 다른 방식으로 다시 시도할게요".
4. 자막/BGM/보이스 라이선스 안내를 사용자에게 과하지 않게 보여주는 화면 설계.
5. mock backend가 생긴 뒤 실제 API 연결 화면 QA.
