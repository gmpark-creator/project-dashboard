# 02 - Decisions and Open Questions

Claude 계약 문서 §9의 열린 질문에 대한 Codex 1차 답변입니다. 디렉터 결정이 필요한 항목은 임시 정책을 두되 확정으로 쓰지 않습니다.

## Q1. 정식 제품명

**결정:** `Cutpilot`은 codename으로 유지. 정식 브랜드는 디렉터 결정 전까지 고정하지 않는다.

**이유:** 현재는 제품 검증 전 단계다. 브랜드를 대시보드와 코드 전역에 박으면 나중에 변경 비용이 커진다.

**구현:** 환경/설정에 `PUBLIC_PRODUCT_NAME=Cutpilot` 형태로 둔다.

## Q2. decomposeIdea LLM 제공자

**결정:** `StoryDecomposer` adapter를 만들고, 기본 구현은 OpenAI Responses API + Structured Outputs로 둔다. Claude는 UX/카피/프롬프트 리뷰와 대안 decomposer로 연결 가능하게 남긴다.

**이유:** 스토리보드 분해는 `Scene[]`, `Shot[]`, `SAEC`가 schema를 반드시 지켜야 한다. OpenAI Structured Outputs는 JSON Schema 준수를 전제로 쓸 수 있어 hot path에 적합하다.

**구현:** provider를 하드코딩하지 않고 `DECOMPOSER_PROVIDER=openai|anthropic|mock`으로 분리한다. MVP는 mock + OpenAI structured output.

## Q3. 비교용 Take를 다른 엔진으로 분산할지

**결정:** 기본은 `2 primary + 1 fallback` 정책. 단, `economy`는 `1 primary`, `fast`는 예산이 허용될 때만 split, `final`은 동일 엔진/레퍼런스 중심으로 일관성을 우선한다.

| 모드 | Take 정책 |
|---|---|
| economy | 1개 후보, cheapest viable provider |
| fast | 2개는 primary provider, 1개는 fallback provider 또는 다른 seed |
| final | 선택 Take의 prompt/ref를 기준으로 1개 고품질 결과. 실패 시 fallback |

**이유:** 처음부터 모든 컷을 3개 엔진으로 분산하면 다양성은 좋지만 비용/스타일 일관성/디버깅이 나빠진다.

## Q4. 고품질 승급은 재생성인가 업스케일인가

**결정:** UX 라벨은 하나지만 내부 액션은 셋으로 분리한다.

| 내부 액션 | 의미 | 기본 사용 |
|---|---|---|
| `final_regenerate` | 선택 Take의 prompt/ref를 사용해 고품질 모델로 다시 생성 | 기본 |
| `enhance` | provider가 지원하는 video-to-video/enhance 사용 | 지원 모델에서만 |
| `render_upscale` | 기존 Take를 FFmpeg/업스케일러로 해상도 개선 | 최종 렌더 옵션 |

**이유:** 업스케일은 세부 선명도를 올릴 수 있지만 모션/일관성 문제를 해결하지 못한다. 게시용 승급은 재생성이 기본이어야 한다.

## Q5. 서브클립 부분 재생성 엔진 지원 범위

**결정:** 제품 공통 계약에서는 `scope="segment"`를 받되, 실행은 capability에 따라 달라진다.

| capability | 처리 |
|---|---|
| provider가 segment retake 지원 | 해당 구간만 retake |
| provider가 video-to-video/edit 지원 | 원본 take + range + instruction으로 edit |
| 미지원 | shot 전체 재생성 후 기존 take 보존 |

**UX 문구:** "이 부분만 다시 시도"로 표현하되, 실행 결과가 전체 컷 재생성이 될 수 있음을 내부 정책으로 처리한다. 사용자에게는 이전 후보가 보존된다는 점이 중요하다.

## Q6. BGM/TTS 소스/라이선스

**결정:** MVP는 영상 엔진 네이티브 오디오에 의존하지 않는다. `AudioProviderAdapter`를 별도로 둔다.

| 영역 | MVP 정책 |
|---|---|
| BGM | 사용자 업로드 또는 라이선스 확인된 stock catalog만 |
| TTS | provider adapter로 분리. 보이스 ID, 라이선스, 사용권을 ledger에 기록 |
| SFX | 템플릿 기본 효과음 또는 provider-generated SFX는 출처 명확한 경우만 |
| 상업 이용 | asset 단위 license metadata 필수 |

**금지:** 트렌드 음악 스크래핑, 출처 불명 BGM 번들링, 라이선스 없는 음성 클론.

## Q7. 자막 기본값

**결정:** script-first. 사용자가 대본/내레이션을 주면 그 텍스트가 source of truth다. 대본이 없고 음성이 있으면 STT로 생성한다.

| 입력 | 자막 생성 |
|---|---|
| script 있음 | script time alignment |
| voiceover TTS 생성 | TTS script 기반 alignment |
| 사용자 음성/영상 오디오 | STT |
| 무음 영상 | LLM 요약 자막 초안, 사용자 확인 필요 |

## Q8. 크레딧-달러 환산/플랜 구조

**결정:** 프론트에는 `⚡ credit`만 노출한다. 내부 ledger는 `provider_cost_usd`, `credit_reserved`, `credit_captured`, `margin_policy_version`을 모두 저장한다.

**권장:** 초기 MVP는 실제 결제 전 `free sandbox credits`로 품질/비용 데이터를 모은 뒤 가격표를 확정한다.

## Q9. Veo 얼굴 지역 제한 처리

**결정:** 지역/정책 제한은 코드 조건문이 아니라 `provider-capabilities.json`의 `policyConstraints`와 라우터 필터로 처리한다.

**주의:** 지역 제한은 공식 약관/계정/프로젝트별로 달라질 수 있으므로, 출시 직전 법무/계정 기준으로 재검증해야 한다. 현재 Codex 계약은 `regionPolicy` hook만 고정한다.

## Q10. 대시보드 등록 여부

**결정:** 지금은 `ai-video-studio` 설계 산출물로 보관. 메인 대시보드 프로젝트 번호 등록은 디렉터 지시 전까지 보류.

**추천:** 실제 backend MVP, mock provider, 1개 provider live generation이 붙은 뒤 프로젝트 카드 등록.

## Claude에게 되돌릴 피드백

1. `Veo 3.1 = 4K`는 공식 Vertex 문서 기준으로 제품 계약에서 빼야 한다. 4K는 optional upscale/export로 둔다.
2. `Runway Gen-4 Turbo`는 공식 모델표상 Image-to-Video 입력으로 보이므로 text-only fast 기본값으로 쓰지 않는다.
3. "부분 재생성" UX는 유지하되, 모든 provider에서 보장되는 기능처럼 말하지 않는다.
4. "고품질 승급"은 사용자 버튼명으로 유지하되 내부는 `final_regenerate/enhance/render_upscale`으로 나눈다.
5. 품질 자동검사는 MVP에서 경고/추천 수준으로 낮추고, ML 기반 점수는 Phase 2 이후로 둔다.
