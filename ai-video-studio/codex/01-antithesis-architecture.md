# 01 - Codex Antithesis Architecture R1

## 결론

Claude의 제품 논지는 채택한다. `아이디어 -> 스토리보드 -> 컷별 후보 생성 -> 선택 -> 자막/BGM/보이스 -> 렌더` 흐름, 모델명 비노출, 드래프트 후 고품질 승급, 실패 컷만 재생성하는 UX는 제품 차별점으로 유효하다.

다만 구현 계약은 더 보수적으로 잡아야 한다. 영상 모델 API는 입력 타입, 길이, 해상도, 오디오, 지역, 가격, 쿼터가 빠르게 바뀐다. 따라서 제품은 "Runway/Veo/Luma를 직접 고르는 앱"이 아니라 "요구 플래그를 받아 현재 가능한 엔진을 선택하는 오케스트레이터"여야 한다.

## Claude 설계에 대한 Codex 보강

| 항목 | Codex 판단 | 구현 방침 |
|---|---|---|
| 모델명 비노출 | 채택 | 사용자 UI는 `tier`, `intent`, `quality hint`만 표시. `engineUsed`는 관리자/로그 전용 |
| Runway 중심 전략 | 일부 채택 | Runway는 주요 provider지만, `gen4_turbo`처럼 입력이 이미지 중심인 모델이 있어 Text-to-Video fast 기본값으로 고정하면 안 됨 |
| Veo 3.1 4K 약속 | 보류 | Vertex 공식 Veo 3.1 문서는 720/1080과 4/6/8초 제한을 명시한다. 4K는 제품 계약에서 제외하고 렌더/업스케일 옵션으로 분리 |
| Luma Image-to-Video 강점 | 채택 | 이미지 첨부, 제품/공간/자연 모션 컷의 1순위 후보로 둠 |
| 서브클립 2~16초 재생성 | UX는 채택, 기능 약속은 보류 | 엔진이 지원하면 segment retake, 아니면 shot regenerate + 기존 take 보존 + 편집 스티치 |
| 고품질 승급 | 라벨은 채택 | 내부 실행은 `final_regenerate`, `enhance`, `render_upscale` 세 모드로 분리 |
| 자동 품질 평가 | 단계적 채택 | MVP는 미디어 무결성/길이/해상도/오디오/사용자평점 중심. CLIP/VMAF/비전검사는 Phase 2 |
| BGM/TTS | 별도 레이어 | 영상 생성 엔진에 묶지 않고 audio provider adapter + 라이선스 ledger로 분리 |

## 시스템 경계

```text
Frontend
  -> API Gateway
     -> App DB
     -> Object Storage
     -> Job Queue
        -> Decompose Worker
        -> Generation Worker
           -> Provider Adapters
              -> Runway
              -> Luma
              -> Google Vertex
              -> Adobe Firefly optional
        -> Media Ingest Worker
        -> Quality Worker
        -> Render Worker
           -> Remotion
           -> FFmpeg
        -> Billing Ledger
     -> Job Events
        -> Polling first, SSE later
```

## 핵심 모듈

| 모듈 | 책임 |
|---|---|
| `StoryDecomposer` | 아이디어/대본/첨부를 `Scene[]`, `Shot[]`로 구조화. JSON Schema strict validation 필수 |
| `RoutingEngine` | `intent + tier + requirements + userContext + budget`을 provider 후보 목록으로 변환 |
| `ProviderAdapter` | 벤더별 요청/응답/폴링/취소/에러를 공통 `GenerationJob`으로 정규화 |
| `MediaIngestor` | provider 결과 URL을 우리 storage로 복사, poster/metadata 생성 |
| `QualityEvaluator` | 품질 신호 산출. MVP는 저비용 검사, Phase 2부터 비전 모델/CLIP/VMAF |
| `RenderCompiler` | 선택 Take + captions + voiceover + bgm + EDL을 Remotion/FFmpeg 렌더 스펙으로 컴파일 |
| `CreditLedger` | estimate, reserve, capture, refund를 분리. provider 비용과 사용자 크레딧을 별도 기록 |
| `AssetSigner` | 미디어 URL 서명/만료/갱신. 프론트는 항상 우리 URL만 본다 |

## Provider adapter 인터페이스

```ts
type GenerateVideoInput = {
  shotId: string;
  prompt: string;
  negativePrompt?: string;
  aspect: "9:16" | "16:9" | "1:1" | "4:5";
  durationSec: number;
  tier: "fast" | "economy" | "final";
  imageRefs?: Array<{ url: string; role: "firstFrame" | "lastFrame" | "reference" | "character" }>;
  audioIntent?: { lipsync: boolean; dialogue?: string; sfx?: string };
  region: string;
  seed?: number;
};

type ProviderJob = {
  providerJobId: string;
  provider: string;
  model: string;
  status: "queued" | "running" | "done" | "failed" | "cancelled";
  result?: { videoUrl: string; posterUrl?: string; durationSec?: number };
  error?: { code: string; retryable: boolean; raw?: unknown };
};
```

어댑터 밖으로는 provider 원본 응답을 흘리지 않는다. 모든 결과는 `Take`, `GenerationJob`, `Asset`으로 정규화한다.

## 라우팅 원칙

1. `requirements`를 먼저 본다. 예: `needsLipsyncAudio=true`는 일반 시네마틱 모델보다 오디오/립싱크 가능 후보가 우선이다.
2. 입력 타입 필터를 반드시 적용한다. 예: 이미지 입력이 필요한 모델은 text-only 요청에서 제외한다.
3. 길이/비율/해상도 필터를 적용한다. 지원하지 않는 모델에 요청을 보내지 않는다.
4. 지역/정책 필터를 적용한다. 제한이 확실하지 않은 기능은 기본 비활성화한다.
5. 비용/쿼터/장애 상태를 마지막에 반영한다. 라우팅 테이블의 첫 후보라도 현재 장애면 다음 후보로 간다.
6. 비교용 Take 분산은 예산 정책에 묶는다. 무조건 다른 엔진 3개를 호출하면 비용 제어가 어렵다.

## 상태 저장 모델

`Project`, `Shot`, `Take`, `GenerationJob`, `RenderJob`, `CreditTransaction`, `Asset`은 별도 테이블로 분리한다. `Take`는 항상 immutable에 가깝게 취급한다. 재생성은 기존 Take를 수정하지 않고 새 Take를 추가한다.

```text
Project
  Scene
    Shot
      Take
        GenerationJob
        Asset(video/poster)
  RenderJob
  CreditTransaction
```

## 품질 평가 현실성

MVP에서 자동 품질 평가는 "추천/경고" 수준이다. 아래 순서로 간다.

| 단계 | 검사 | 비용 | 비고 |
|---|---|---|---|
| MVP | 파일 존재, duration, resolution, fps, black-frame, silent audio, loudness | 낮음 | FFmpeg/ffprobe 중심 |
| MVP | 사용자 선택/재생성/승급 로그 | 낮음 | 실제 선호 데이터 수집 |
| Phase 2 | prompt-image similarity, OCR 금칙어, 얼굴/제품 consistency heuristic | 중간 | 비전 모델 호출 |
| Phase 3 | VMAF/temporal artifact, CLIPScore, learned ranker | 높음 | 대량 샘플과 비용 최적화 필요 |

## 렌더링 경계

영상 생성 provider는 "짧은 클립"을 만든다. 한 편의 최종 MP4 품질은 Render Worker가 책임진다.

- Remotion: 자막, 엔드카드, UI overlay, 모션 그래픽, 컷 assembly
- FFmpeg: concat, trim, audio mix, loudness normalization, transcode, poster, waveform, SRT burn-in
- Upscale: provider upscale 또는 별도 upscaler가 있을 때만. 기본 계약은 720p/1080p MP4

## 보안/운영

- provider API key는 worker 환경 변수 또는 secret manager에만 둔다.
- provider 결과 URL은 즉시 우리 storage로 복사한다. 만료 URL을 프론트에 장기 노출하지 않는다.
- 사용자에게 `engineUsed`를 표시하지 않는다. admin 로그에는 provider/model/requestId/cost/latency를 남긴다.
- 비용은 `estimate -> reserve -> capture/refund` 순서로 처리한다.
- provider raw payload는 PII/저작권 위험이 있어 retention 정책을 둔다.

## Codex 반박 요약

Claude UX는 좋은 제품 방향이다. Codex 구현에서는 벤더 기능을 직접 약속하지 않고, capability snapshot과 routing config를 통해 "가능한 때만 실행"하는 구조로 바꿔야 한다. 특히 `gen4_turbo` text-only 사용, Veo 4K, 서브클립 retake, 네이티브 오디오, 자동 품질점수는 모두 제품 약속이 아니라 라우터/폴백/phase gate 뒤에 둔다.
