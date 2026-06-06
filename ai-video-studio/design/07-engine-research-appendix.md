# 07 · 엔진 리서치 부록 (Engine Research Appendix)

라우팅·티어·품질기준의 **근거**. 2026-06 기준 웹 리서치(5 에이전트 병렬, 출처 하단). ⚠ **엔진은 빠르게 바뀐다 — Codex는 출시 직전 재검증할 것.**

> **Codex R1 보정(2026-06-06):** 이 부록은 Claude Thesis의 리서치 원문이다. 실제 구현 기준은 `codex/config/provider-capabilities.json`과 `codex/config/routing.config.json`이다. Codex 공식문서 재확인 기준으로 `Runway gen4_turbo`는 image-to-video 후보로 필터링하고, Vertex Veo 3.1의 4K는 제품 보장 기능이 아니라 export/upscale 옵션으로 분리한다.

## 비교 표 (의사결정 관련 특성만)
| 항목 | Runway **Gen-4.5** | Luma **Ray 2** | Google **Veo 3.1** |
|---|---|---|---|
| 위치 | 플래그십(’25-12 출시, 리더보드 1위) | 고/밸런스(현재 상위는 Ray 3) | 플래그십(’25-10) |
| Text→Video | ✅ | ✅ | ✅ (따옴표로 대사 지시→립싱크) |
| Image→Video | ✅(’26초 추가) | ✅ **강점**(키프레임) | ✅ (+ 최대 3 레퍼런스) |
| **네이티브 오디오** | ✅ 대사·SFX·앰비언트(’25-12-11 추가). 음악 미확정 | ❌ **무음**(오디오는 후처리 별도) | ✅ **최강**: 대사 립싱크+SFX+앰비언트, 48kHz 스테레오 |
| 단일 클립 최대 | 10s (5/8/10) → 체이닝 ~60s | 9s (5/9) → 체이닝 ~30s | 8s (4/6/8) → 체이닝 |
| 해상도 | 1080p(네이티브~1280×768, 4K 업스케일) | 540/720/1080p(4K 업스케일) | 720/1080/**4K**(Veo 3.1/Fast) |
| fps | 24(25 옵션) | 24 | 24 |
| 속도 | medium | medium | **slow** |
| 비용 | **high**($0.25/s). Turbo는 $0.05/s | medium. Flash는 ~1/3 | **high**(오디오 켜면 ~2배) |
| 빠른/저가 변형 | **Gen-4 Turbo**(무음·저가·빠름) | **Ray 2 Flash**(540/720p·3배 빠름·1/3 가격) | **Veo 3.1 Fast / Lite**(Lite=무음) |
| API | 공식(Turbo 확정, 4.5 롤아웃). Replicate 일부. **fal 미확정** | 공식+**fal**+Replicate+Bedrock(넓음) | Gemini API/Vertex/Flow + fal + Replicate |
| 최적 용도 | 시네마틱·캐릭터 일관 멀티샷·광고·물리 | 이미지→영상·제품·자연 물리모션·대량(Flash) | 대사/토킹헤드·세로소셜+사운드·4K |
| 주의 | 텍스트 렌더 약함, 손 아티팩트, 4.5 API 제한적 | **무음**, 텍스트/로고 약함, 다중인물 불안정 | 8s 캡, 비싸고 느림, 얼굴생성 EU/UK/CH/MENA 제한 |

## 티어/라우팅에 주는 결론
| 사용자 의도 | → 엔진 | 근거 |
|---|---|---|
| 빠른 드래프트(무음) | Gen-4 Turbo / Ray 2 Flash / Veo 3.1 Lite | 초당 비용 최저·속도 |
| 고품질 시네마틱·캐릭터 일관 | **Gen-4.5** | 리더보드 1위·멀티샷 일관 |
| 대사 립싱크·네이티브 사운드 | **Veo 3.1** | 유일한 단일패스 대사 립싱크 |
| 이미지→영상·제품·물·천·머릿결 | **Luma Ray 2** | 모션 코히런스 최상·API 넓음 |
| 4K | **Veo 3.1** | 유일 네이티브 4K |
| 세로 소셜 + 사운드 | **Veo 3.1**(9:16 오디오) | 네이티브 세로+오디오 |

## 핵심 함의(UX 설계 반영)
1. **오디오 = 엔진 분기점.** 대사·립싱크 필요하면 Veo 3.1, 무음 드래프트는 무엇이든. Luma는 오디오 후처리 별도 → 화면5의 보이스/BGM은 *엔진 비의존 후처리 레이어*로 설계(이미 그렇게 함).
2. **모두 8~10초 캡** → 한 편은 반드시 **컷 체이닝 + 일관성 유지**가 핵심. 그래서 Shot/Take 추상화와 캐릭터 레퍼런스를 일급으로 둠.
3. **fast 변형 존재** → "1차 드래프트→승급" 티어 모델이 현실적으로 비용 최적(P2).
4. **공통 약점**(텍스트 렌더·손) → 앱 UI/로고는 *생성 대신 합성*(앱소개 템플릿에 반영), 손 클로즈업 회피 권고.
5. **지역 제한·API 가용성 상이** → 라우팅에 region/availability 필터 필수(계약 §4).

## 출처 (대표)
- Runway: runwayml.com/research/introducing-runway-gen-4.5 · techcrunch(’25-12-11 네이티브오디오) · docs.dev.runwayml.com/guides/pricing · replicate.com/runwayml/gen4-turbo
- Luma: lumalabs.ai/changelog/introducing-ray2 · lumalabs.ai/learning-hub/dream-machine-guide-ray2 · fal.ai/models/fal-ai/luma-dream-machine/ray-2(-flash)
- Veo: deepmind.google/models/veo · developers.googleblog.com/introducing-veo-3-1 · ai.google.dev/gemini-api/docs/video · fal.ai/models/fal-ai/veo3
- 경쟁사 UX·프롬프트 기법: Pika/Kling/Flow/InVideo/Higgsfield/Krea/LTX/Captions 공식·리뷰(다수)

> 전체 원시 결과(엔진별 강·약점 전량, 경쟁사 10종 UX 분해, SAEC·일관성 기법 11종)는 리서치 워크플로 산출물에 보존. 필요 시 갱신 리서치 재실행.
