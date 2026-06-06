# 06 · 프론트 ↔ 백엔드 계약 (요구사항, NOT 구현)

이 문서는 **프론트엔드가 백엔드에 기대하는 형태**만 정의한다. 실제 구현(DB 스키마·큐·어댑터·렌더·인증·스토리지)은 **Codex 영역**이며, 아래는 그가 자유롭게 구현하되 *프론트가 의존하는 계약*이다. 변경은 변증법 라운드에서 합의.

> 표기: 🟦 = 프론트가 **읽는** 데이터, 🟧 = 프론트가 **보내는** 요청, ❓ = Codex/디렉터 결정 필요.

## 1. 핵심 추상화 4계층
```
Project ── has many ──▶ Scene ── has many ──▶ Shot ── has many ──▶ Take
  (한 편)               (장소/시간)            (한 컷)              (후보 결과)
                                                 │ selectedTakeId ─▶ 1 Take 확정
RenderJob = 확정 Take들 + 자막/BGM/보이스 → MP4   GenerationJob = 1 Take 생성(엔진 호출)
```

## 2. 데이터 모델 (프론트가 기대하는 형태)
> 필드명·타입은 제안. Codex가 내부 저장 방식은 자유, **응답 JSON 형태만** 맞추면 됨.

### 🟦 Project
```jsonc
{
  "id": "prj_01H...", "title": "봄 신상 광고",
  "intent": "product_ad",                 // 템플릿 키
  "status": "reviewing",                  // draft|storyboarded|generating|reviewing|edited|rendering|done|failed
  "aspect": "9:16", "targetDurationSec": 30,
  "progress": { "shotsDone": 7, "shotsTotal": 9 },
  "characters": [ { "id":"chr_1","label":"바리스타","refImageUrls":[...] } ],
  "thumbUrl": "...", "createdAt": "...", "updatedAt": "...",
  "credits": { "spent": 84, "estimateRemaining": 60 }
}
```
### 🟦 Scene / Shot / Take
```jsonc
// Scene
{ "id":"scn_1","projectId":"prj_01H...","order":0,"title":"카페 외경(낮)","setting":"카페 입구","timeOfDay":"day" }

// Shot
{ "id":"sht_1_1","sceneId":"scn_1","order":0,"durationSec":3,
  "saec": { "subject":"...","action":"...","environment":"...","camera":"...","framing":"...","lighting":"...","style":"...","negative":"..." },
  "requirements": { "tier":"fast","aspect":"9:16","imageToVideo":false,"needsLipsyncAudio":false,"motionHeavy":false,"characterLock":false,"characterId":null },
  "status": "reviewing",                  // pending|generating|reviewing|selected|failed
  "selectedTakeId": "tak_...|null",
  "qualityFlags": [ { "axis":"motion","score":2,"hint":"모션 흔들림 의심" } ]
}

// Take (한 Shot의 후보)
{ "id":"tak_ab12","shotId":"sht_1_1","label":"A안",
  "status":"done",                        // queued|running|done|failed
  "videoUrl":"...","posterUrl":"...","durationSec":3,
  "tier":"fast",
  "engineUsed":"<internal-only>",         // ⚠ 디버그/관측 전용 — 사용자 화면 비노출(UX-1.1)
  "metrics": { "fidelity":4,"consistency":5,"motion":2,"overall":3.6 },
  "createdAt":"..." }
```
### 🟦 RenderJob
```jsonc
{ "id":"rnd_...","projectId":"prj_01H...",
  "spec": { "resolution":"1080p","cut":"30s","aspect":"9:16","caption":"burn-in" },
  "stage":"audio_mix",                    // assemble|audio_mix|caption_burn|encode|upscale|done
  "progress":0.82, "status":"running",    // queued|running|done|failed
  "outputUrl":null, "shareUrl":null, "etaSec":40 }
```

## 3. 주요 API 표면 (프론트가 기대하는 "요구사항")
> REST/RPC/GraphQL 무엇이든 가능. 아래는 *의미적 엔드포인트*. 비동기는 **잡 생성 후 폴링/스트림** 가정.

| 🟧 요청(의미) | 입력 | 🟦 응답/효과 | 비고 |
|---|---|---|---|
| `decomposeIdea` | `{idea, intent, attachments?, script?}` | `Scene[] + Shot[]`(SAEC 초안) | **LLM 분해**(제공자=Codex). 구조화 출력 필수 |
| `createProject` | `{title?, intent, idea, advanced?}` | `Project` | 자동저장 시작 |
| `updateStoryboard` | `{shots[] 추가/삭제/정렬/SAEC수정}` | 갱신 `Scene/Shot` | 가벼운 편집 |
| `generateShot` | `{shotId, tier, takeCount=2~3}` | `Take[]`(queued) → 폴링 | **컷별 독립 잡**(부분 진행) |
| `generateAll` | `{projectId, tier="fast"}` | 다수 `GenerationJob` | 비용 추정 동반 |
| `selectTake` | `{shotId, takeId}` | `Shot.selectedTakeId` | 즉시 |
| `regenerate` | `{shotId, scope:"shot"\|"segment", range?, tweaks?}` | 새 `Take[]` | **실패/불만 컷만**(P5), 이전 Take 보존 |
| `upgradeTake` | `{takeId}` → tier=`final` | 새 고품질 `Take` | 비용 표시(P2) |
| `applyEdit` | `{projectId, command(자연어) \| ops[]}` | 갱신 편집상태 | Magic Box(P4) |
| `setAudio` | `{projectId, captions?, bgm?, voiceover?}` | 갱신 | 자동 초안 후 조정 |
| `estimateCost` | `{action, params}` | `{credits, etaSec}` | 모든 비용 액션 전(P6·UX-7.2) |
| `startRender` | `{projectId, ExportSpec[]}` | `RenderJob[]` | 다중 길이컷 병렬 |
| `getJob` / stream | `{jobId}` | 상태·진행률 | 폴링 또는 SSE/WS |

## 4. 티어→엔진 라우팅 (요구사항 — 데이터로 분리)
프론트는 엔진을 모른다. 백엔드가 아래 **선언적 라우팅 테이블**(코드 아닌 데이터)로 결정. 엔진 스펙 변동 시 테이블만 교체.

```jsonc
// routing.config.json (Codex 소유, 데이터로 관리)
{
  "rules": [
    { "when": { "needsLipsyncAudio": true },               "use": ["veo-3.1","runway-gen-4.5"] },
    { "when": { "imageToVideo": true },                     "use": ["luma-ray-2","runway-gen-4.5"] },
    { "when": { "motionHeavy": true },                      "use": ["luma-ray-2","runway-gen-4.5"] },
    { "when": { "tier": "fast" },                           "use": ["runway-gen-4-turbo","luma-ray-2-flash","veo-3.1-lite"] },
    { "when": { "tier": "economy" },                        "use": ["luma-ray-2-flash","runway-gen-4-turbo"] },
    { "when": { "tier": "final" },                          "use": ["runway-gen-4.5","veo-3.1","luma-ray-2"] }
  ],
  "filters": { "byAspect": true, "byDuration": true, "byResolution": true, "byRegion": true },
  "fallbackOnError": true,            // 실패 시 다음 후보로 (UX-5.4)
  "defaultTakeEngineSplit": true      // 비교용 Take를 서로 다른 엔진으로 뽑아 다양성↑(❓ 정책)
}
```
| 요구 | 정책 |
|---|---|
| 우선순위 | 위에서부터 첫 매칭 규칙, 배열은 가용성/비용 순 후보 |
| 필터 | aspect·duration·resolution·region 미지원 엔진 제외 |
| 폴백 | 엔진 오류/점검 시 다음 후보 자동(큐 유지) |
| 관측 | 응답에 `engineUsed` 포함(디버그) — **UI 비표시** |
| 갱신 | 엔진 추가/스펙 변경 = config 교체(배포 무관) |

## 5. 비동기·부분진행 요구사항
- 컷별 `GenerationJob`은 **독립** — 1컷 실패가 타 컷 차단 금지(화면4 부분 진행).
- 잡 상태는 폴링 또는 스트림(SSE/WS) 중 하나 이상 제공. 프론트는 진행률·ETA·취소를 노출(UX-9.4).
- 자동저장: 모든 편집/선택은 서버 영속 → 새로고침/기기변경 후 복귀.

## 6. 미디어·스토리지 요구사항 (프론트 관점)
| 요구 | 내용 |
|---|---|
| 스트리밍 재생 | Take/미리보기는 즉시 재생 가능한 URL(HLS 또는 MP4 progressive) |
| 썸네일/포스터 | 각 Take·Project 포스터 이미지 URL |
| 만료/서명 | URL 서명·만료 정책(❓ 보안) — 프론트는 갱신 훅 필요 |
| 다운로드/공유 | 최종 MP4 다운로드 + 공유 링크(권한 ❓) |

## 7. 인증·과금 요구사항 (프론트 관점)
- 사용자/세션·크레딧 잔액 조회, 비용 추정·차감은 백엔드. 프론트는 ⚡ 단위만 표시(UX-7.4).
- 잔액 부족 시 작업 보존 + 충전/티어 다운 동선(UX-7.3).

## 8. 비기능 요구 (프론트가 의존)
| 항목 | 기대치(제안, ❓ 협의) |
|---|---|
| fast Take 생성 체감 | 가능하면 빠른 미리보기/저해상 프리뷰 우선(Krea식 대기불안 완화) |
| 잡 상태 지연 | 폴링 간격·스트림 권장값 협의 |
| 동시 생성 | Project당 병렬 컷 수 상한(플랜별) |
| 에러 포맷 | `{code, userMessage(한국어), retryable, fallbackSuggested}` 표준 |

## 9. 열린 질문 — **Codex R1에서 1차 해소됨** ([codex/02-decisions-and-open-questions.md](../codex/02-decisions-and-open-questions.md))
> 권위 계약은 이제 `codex/` 산출물(OpenAPI·domain.schema·routing.config·provider-capabilities). 아래는 Codex 1차 결정 요약. 디렉터 확정 필요 항목은 ❓ 유지.

| Q | Codex 1차 결정 |
|---|---|
| Q1 정식명 | ❓ `Cutpilot`은 codename, `PUBLIC_PRODUCT_NAME` 설정값으로. 브랜드 미고정 |
| Q2 분해 LLM | `StoryDecomposer` 어댑터, 기본 OpenAI Structured Outputs, `DECOMPOSER_PROVIDER`로 분리(mock/anthropic 가능) |
| Q3 Take 분산 | economy=1 / fast=2primary+1fallback / final=동일ref 1 |
| Q4 승급 | UX 1버튼, 내부 `final_regenerate`(기본)·`enhance`·`render_upscale` → **R2 카피 "게시용 품질로 다듬기"** |
| Q5 부분재생성 | `scope=segment` 수신, capability 따라 segment retake / video-to-video / shot 폴백 + 이전 Take 보존 → **R2 UX-5.2 반영** |
| Q6 BGM/TTS | `AudioProviderAdapter` 별도, asset 단위 license metadata, 스크래핑·클론 금지 → **R2 §12·08§6 반영** |
| Q7 자막 | script-first, 없으면 STT, 무음은 LLM 초안+사용자 확인 |
| Q8 크레딧 | 프론트 ⚡만, 내부 ledger(usd·reserve·capture). MVP free sandbox credits |
| Q9 지역제한 | `provider-capabilities.json.policyConstraints` + 라우터 필터(코드 조건문 아님), 출시 직전 재검증 |
| Q10 대시보드 등록 | ❓ 보류 — backend MVP+1 provider live 후 카드 등록 권장(번호는 디렉터) |

## 10. 변증법 핸드오프 (Codex Antithesis 요청 사항)
Codex가 반박/보강해 주길 바라는 지점:
1. 위 **데이터 모델·API 표면**의 실현성/누락(특히 비동기·부분진행·재생성 범위).
2. **라우팅 테이블**을 데이터로 분리하는 구조와 엔진 어댑터 경계.
3. 품질 자동신호(05 문서) **산출 파이프라인**의 비용/지연 현실성.
4. 서브클립 재생성·고품질 승급의 **엔진 한계** 대비 폴백 설계.
5. 자동저장·미디어 URL·과금의 **비기능 요구** 합의.
