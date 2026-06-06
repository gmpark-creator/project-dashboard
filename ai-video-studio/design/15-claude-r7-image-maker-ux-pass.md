# 15 · Claude R7 — Image Maker UX 정밀화 패스

[14-claude-r6-visual-maker-qa.md](14-claude-r6-visual-maker-qa.md) §5 권고(후보 scoreLabel 미표시 P1, 용도+보관분류 셀렉트 중복 P2)와 참조 연결 카피를 후속 처리한 라운드. base = `fa14c84`(Claude R6) 위, Codex `d6f4d0d`(generation reference contract) 반영 상태.

> **영역 분리:** 프론트 UI/카피/CSS만 좁게. 편집 = `studio-app/src/features/studio/StudioApp.tsx`, `studio-app/app/globals.css`, 본 문서뿐. **`types.ts`·`mock-service.ts`·OpenAPI/schema(Codex 소유) 미수정.** Codex의 동시 진행 WIP(자산/참조 삭제 엔드포인트 등)는 손대지 않고 작업 트리에 그대로 둠.

> **검증 방식:** 소스 정독 + 라이브 헤드리스 실측(Edge, dev :3020, 1366/390px 8뷰) + 4종 게이트 + **적대적 4-렌즈 워크플로 리뷰**(계약/디자인/카피/회귀). 리뷰가 찾은 P1 1건을 즉시 수정 후 재검증.

---

## 1. 검증 게이트 (전 PASS)

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | **green**(0건). StudioApp.tsx 0 오류 |
| `npm run test:mock` | **OK** `{ shots:10, failed:2, takes:33, imageAssets, renderJobs:3 }` |
| `npm run validate:contracts` | **OK** `{ providers:4, routingRules:7, templates:6, visualMakerOps:8 }` |
| `npm run build` | **성공** — 전 라우트 |

라이브 실측: 후보 카드 scoreLabel 배지 4종(추천×1·안정적×1·확인 필요×2, 서버 부여 로직 일치) · 용도 변경 시 보관분류 자동 추종 · [직접 지정] 토글 동작 · tooltip 노출 · **모델명/기술용어(image-to-video·i2v 포함) 누출 0(8뷰)** · **가로 오버플로 0(390/1366, 8뷰)**.

---

## 2. 변경 로그

| ID | 목표 | 파일 | 변경 |
|---|---|---|---|
| **R7-1** | 1 (scoreLabel) | StudioApp.tsx | 후보 ImageAsset 카드에 원본 `ImageVariant.scoreLabel`(추천/안정적/확인 필요)을 `variant.assetId` 역참조(`scoreByAssetId`)로 배지 표시. 색=`scoreBadgeClass`(추천→ok 녹·안정적→fast 청·확인 필요→warn 적, 기존 `.badge` 재사용). **14 §5 P1 해소** |
| **R7-2** | 2 (셀렉트 중복) | StudioApp.tsx | `purposeToRole` 맵으로 보관 분류(role)를 용도(purpose)에서 자동 파생. `roleOverride` 상태 + [직접 지정]/[자동으로] 토글로 강등. `role = roleOverride ?? purposeToRole[purpose]`로 **항상 유효 role 제출**(createImageJob 계약 유지). **14 §5 P2 해소** |
| **R7-3** | 3 (참조 카피) | StudioApp.tsx | DirectionPanel hint의 `image-to-video`(영문 기술용어) → "이 이미지를 바탕으로 영상 컷을 만듭니다". 카드 액션에 사용처 tooltip(`첫 프레임`/`참조로 사용`) |
| **R7-4** | 적대적 리뷰 P1 | StudioApp.tsx | `참조로 사용` tooltip이 `roleLabels[role]`(역할)로 읽히나 실제 전송 mode는 logo/thumbnail/style/keyframe→`style_reference` 폴백 → **불일치**(특히 keyframe이 옆 `첫 프레임` 버튼과 충돌). `referenceModeLabel`(6 mode 완전 매핑) 도입해 **실제 전송 mode 기준**으로 tooltip 산출 → 폴백도 정확히 "스타일 참조" |
| — | 2 | globals.css | `.role-auto`(자동 표시 행, flex-wrap·min-width:0) + `.linklike`(토글 링크) 추가 |

> **계약 무파괴:** purposeToRole는 `Record<ImageMakerPurpose, ImageAssetRole>`로 8 purpose 전부 valid role에 매핑(컴파일러 완전성 강제). `referenceModeLabel`은 6 `AssetUsageMode` 전부 커버. `types.ts`/서버 미수정.

---

## 3. 적대적 4-렌즈 리뷰 결과

| 렌즈 | 판정 | 비고 |
|---|---|---|
| 계약/타입 안전성 | **pass** | purposeToRole 완전성·role 항상 유효·onGenerate↔createImageJob 정합·ScoreLabel 유니온 일치·타입 무수정 확인 |
| 디자인 정합(12 §3·14 §5) | **pass** | scoreLabel 3종/숫자없음·역참조 정확·엣지(미승격 assetId=null/실패 variant/중복 매핑) 안전·외부 자산 무배지 정합 |
| 카피/UX | **pass-with-notes** | P1 1건(즉시 수정=R7-4) + P2 2건(§4 기록) |
| 회귀/마크업/반응형 | **pass** | label 내 button 클릭 격리·390px `.role-auto`/`.meta` 배지 무오버플로·map block-return key 유지·SSR 부작용 없음 |

---

## 4. 미수정 노트 (P2 — 의도적/제품 결정/이월)

- **자동 매핑 의미 보조설명 부재(P2)**: poster→로고, transparent/photoreal→제품 매핑이 "용도에 맞춰 자동"만으론 의아할 수 있음. 서버 `ImageAssetRole`에 poster 역할이 없어 logo가 최근접이라 의도적. 제품 결정 시 roleLabels 라벨 보강("로고/포스터") 또는 자동 분류 사유 한 줄 노출 검토. **사용자는 [직접 지정]으로 언제든 변경 가능**하므로 차단 요소 아님.
- **모바일 tooltip 한계(P2)**: 카드 액션 설명을 `title`(호버)로 제공 → 터치 환경 미노출. 버튼 라벨(`첫 프레임`/`참조로 사용`) + DirectionPanel 빈 상태 안내로 개념 보완 중. 향후 비호버 인라인 힌트 검토(390px 컴팩트 레이아웃 보존 우선이라 이번엔 카드당 텍스트 추가 보류).
- **이월(다음 라운드)**: 후보 확대 비교(🔍 1:1)·실패 variant 재시도 UI·R4 재생기 3종(real `<video>`·다듬기 토글·렌더 미리보기).

---

## 5. 커밋·핸드오프
- **Claude 커밋 = 3파일만**: `studio-app/app/globals.css`, `studio-app/src/features/studio/StudioApp.tsx`, `design/15-…md`. 이 2개 코드 파일엔 R7 변경만 존재(Codex 미접촉) → 커밋 정합.
- **Codex WIP 미커밋 유지**: `types.ts`·`mock-service.ts`·contracts·신규 삭제 라우트(`assets/[assetId]`·`references/[assetId]`)는 Codex가 자기 라운드로 커밋.

## 6. 통과 요약
scoreLabel 후보 라벨 노출 ✓ · 용도→보관분류 자동화로 입력 단순화 ✓ · 참조 카피 사용처 중심 + tooltip-동작 정합 ✓ · 모델명/기술용어 0(8뷰) ✓ · 390/1366 오버플로 0(8뷰) ✓ · 4종 게이트 + 적대적 리뷰 PASS.
