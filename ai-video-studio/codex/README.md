# AI Video Studio - Codex Antithesis R1

Codex 영역 산출물입니다. Claude의 UX/제품 설계는 채택하되, 실제 구현에서 깨지기 쉬운 지점을 백엔드 계약, 라우팅 데이터, 검증 게이트로 고정합니다.

## 산출물

| 파일 | 역할 |
|---|---|
| [01-antithesis-architecture.md](01-antithesis-architecture.md) | Claude 설계에 대한 Codex 반박/보강, 시스템 아키텍처 |
| [02-decisions-and-open-questions.md](02-decisions-and-open-questions.md) | 계약 문서 §9의 열린 질문 10개에 대한 Codex 1차 결정 |
| [03-implementation-plan.md](03-implementation-plan.md) | MVP부터 실제 SaaS까지 구현 단계와 검증 게이트 |
| [api/openapi.json](api/openapi.json) | 프론트/백엔드 의미 API를 OpenAPI 3.1 형태로 고정 |
| [schemas/domain.schema.json](schemas/domain.schema.json) | Project/Scene/Shot/Take/Job 공통 JSON Schema |
| [config/provider-capabilities.json](config/provider-capabilities.json) | 공식 문서 기준 엔진/모델 capability snapshot |
| [config/routing.config.json](config/routing.config.json) | 엔진 라우팅을 코드가 아닌 데이터로 분리 |
| [config/templates/](config/templates/) | Claude 템플릿을 앱이 읽을 수 있는 JSON 데이터로 변환 |

## Codex 원칙

- 사용자 화면에는 모델명을 노출하지 않는다. `engineUsed`는 디버그/관측 로그 전용이다.
- 특정 벤더 기능을 제품 약속으로 박지 않는다. 지원 여부는 `provider-capabilities.json`과 라우터 필터가 결정한다.
- `subclip regenerate`, `high quality upgrade`, `native audio`는 엔진별 지원 편차가 크므로 공통 UX 라벨과 내부 실행 전략을 분리한다.
- 모든 생성/렌더 작업은 컷 단위 독립 잡으로 만든다. 한 컷 실패가 전체 프로젝트를 막지 않아야 한다.
- 품질 자동 평가는 MVP에서 보조 신호로만 쓴다. 최종 선택권은 사용자에게 있고, 고비용 ML 검사는 단계적으로 켠다.

## 공식 문서 확인일

2026-06-06 기준으로 아래 공식 문서를 우선 근거로 삼았습니다.

- Runway API models: https://docs.dev.runwayml.com/guides/models/
- Luma video generation: https://docs.lumalabs.ai/docs/video-generation
- Google Vertex AI Veo 3.1: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-1-generate
- Adobe Firefly API: https://developer.adobe.com/firefly-services/docs/firefly-api/api/
- OpenAI Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs
