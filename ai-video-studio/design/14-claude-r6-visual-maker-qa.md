# 14 · Claude R6 — Visual Maker 구현 합동 QA + 수정 로그

Codex R5(`0c50272 ai-video-studio visual maker implementation foundation`)가 Next `studio-app`에 올린 **Visual Maker 1차 구현**(Image Maker / Asset Library / Video Maker)을 설계 문서 [11](11-visual-maker-expansion.md)/[12](12-image-maker-screens.md)/[13](13-asset-library-reference-board.md) 의도와 대조한 합동 QA. **라이브 헤드리스 실측**(Edge, dev :3020, 1366px/390px, 8뷰 전수) + 소스 정독 + 4종 검증 게이트.

> **영역 분리 준수:** 이번 라운드 수정은 **프론트 UI/카피/CSS만 좁게**(박사 R6 지시). 편집 파일 = `studio-app/app/globals.css`, `studio-app/src/features/studio/StudioApp.tsx`, 본 문서뿐. **API 계약·도메인 타입(`types.ts`)·mock 서버(`mock-service.ts`)·contracts는 미수정**(Codex 소유).

---

## 1. 검증 게이트 결과 (전 PASS)

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | **green**(0건). `StudioApp.tsx` 0 오류 — 내 편집 clean |
| `npm run test:mock` | **OK** `{ shots:10, failed:2, takes:33, imageAssets:6, renderJobs:3 }` |
| `npm run validate:contracts` | **OK** `{ providers:4, routingRules:7, templates:6, visualMakerOps:6 }` |
| `npm run build` | **성공** — 전 라우트 빌드(`/api/projects/[projectId]/assets`·`/image-jobs`·`/shots/[shotId]/references`·`/direction` 포함) |

> QA 진행 중 작업 트리에 **Codex의 새 라운드 WIP**(generation-reference-contract — `mock-service.ts`의 `buildGenerationPromptPackage` 신규 +84행, `types.ts`·contracts·신규 `codex/08-…report.md`)가 동시 진행되어, 편집 중간 스냅샷에서 typecheck가 일시 적색(`mock-service.ts:528 promptPackage 누락`)으로 흔들렸음. QA 종료 시점엔 Codex가 정리하여 통합 트리 완전 green 확인. **내 3파일은 0c50272 기준 단독으로도 green**(아래 §4).

---

## 2. 목표별 QA 판정

### 목표 1 — R5 구현이 설계(11/12/13) 의도와 정합하는가
- **IA 정합 ✓** — nav 8종(프로젝트 / Image Maker / Asset Library / Video Maker / 스토리보드 / 비교 선택 / 다듬기 / 내보내기). Image/Video 화면 분리, Asset Library가 연결 허브, Video Maker는 이미지를 **참조**(`Shot.referenceImageIds` + `AssetUsage`)만 — 소유X. 설계 [11 §IA] 일치.
- **Image Maker ✓(부분)** — 좌: "이미지 만들기"(지시·용도·보관분류·스타일·모델명비노출 안내·`이미지 후보 만들기 24⚡`). 우: "이미지 후보와 저장된 재료"에 후보 **A~D안 카드**(출처 `Image Maker` 배지·권리 상태·`첫 프레임`/`참조로 사용`). → 설계 [12 §1] 흐름 성립. **갭**: §5(아래) 참조.
- **Asset Library ✓** — 외부 이미지 등록(이름·URL·분류·권리 체크·등록) + Reference Board 요약(`제품 N · 인물 N · 스타일 N · 첫 프레임 N`) + 자산 그리드. 설계 [13 §2] 일치.

### 목표 2 — 모델명/엔진명 UI 노출
- **누출 1건 발견 → 수정 완료.** Asset Library 안내문에 **"나노바나나"**(Nano Banana) 노출(`StudioApp.tsx:523`). 자동 스캔이 영문 토큰만 봐서 한글 음차를 놓칠 뻔 → 한·영 전수 재스캔으로 포착.
- 수정 후 **8뷰 전수 라이브 재스캔: 한글(나노/바나나/런웨이/루마/베오/미드저니/이데오그램/소라/클링/플럭스) 0건, 영문(runway/luma/veo/gen-4/nano banana/ideogram/midjourney/dall/sora/kling/flux/gpt image) 0건.** 모델명 비노출 원칙 충족.
- Image Maker 안내문 "모델명은 노출하지 않습니다. 이 화면은 목적과 지시만 받고, 실제 이미지 엔진 선택은 백엔드 라우팅이 담당합니다." — 원칙 명문화 ✓.

### 목표 3 — Image/Asset/Video 참조 연결 흐름의 카피·구조 이해도
- 연결 동선 명료: 자산 카드 → `첫 프레임`(first_frame) / `참조로 사용`(역할별 mode) → 컷에 참조 추가. Reference Board 요약이 카테고리별 카운트로 현황 제공.
- **카피 정합 수정**: `참조로 사용`의 역할→mode 매핑이 `background`/`location` 역할을 `style_reference`로 잘못 보내고 있었음 → `background_reference`로 교정(§3 R6-FIX-3).
- **개선 권고(미수정, §5)**: Image Maker의 `용도(purpose)` + `보관 분류(role)` 2개 셀렉트가 비전문가에겐 중복 인지부담.

### 목표 4 — 권리 확인 · 비용 ⚡ · 모바일/데스크탑 오버플로
- **권리 확인 ✓** — Asset Library 등록에 체크박스("이 이미지의 사용 권리와 인물 동의를 확인했습니다") + 안내("사람 사진·브랜드 로고·외부 생성 이미지는 사용 권리와 동의 확인 후 사용"). 자산 카드에 `권리 확인 필요`/`사용 가능` 상태 표시. 설계 [13 §2.1·AL-AC-7] 일치.
- **비용 ⚡ ✓** — 8뷰 전수에서 ⚡ 노출(dashboard1·images2·assets1·new1·storyboard2·compare2·edit1·export3). 생성 버튼 `이미지 후보 만들기 24⚡` 등 버튼 위 ⚡ 원칙 유지.
- **모바일 390px 오버플로: 554px 발견 → 0 수정 완료.** 8뷰 전부 가로 오버플로(`scrollWidth 944 vs innerWidth 390`). 원인 = 가로 nav 8버튼(919px)이 `.shell` 단일 `1fr` 트랙 min-content를 밀어 전체 944px로 확장. → §3 R6-FIX-1. **데스크탑 1366px 오버플로 0**(정상).

---

## 3. 수정 로그 (R6, 3건 — 전부 프론트 좁은 범위)

| ID | 파일 | 변경 | 근거 |
|---|---|---|---|
| **R6-FIX-1** | `app/globals.css` | `@media(max-width:980px)` `.shell` `grid-template-columns: 1fr → minmax(0,1fr)`; `.rail`·`.nav`에 `min-width:0` 추가 | 390px 전 8뷰 가로 오버플로 **554→0**. R4-01([10]) 미해소 이월분 종결. 트랙 min을 0으로 풀어 `.nav{overflow-x:auto}`가 스크롤 컨테이너로 격리 |
| **R6-FIX-2** | `StudioApp.tsx:523` | "나노바나나, 다른 이미지 툴, 직접 촬영 사진을…" → "다른 툴에서 만든 이미지나 직접 촬영한 사진을…" | 목표 2 모델명 누출 제거. 의미 동일·중립 카피 |
| **R6-FIX-3** | `StudioApp.tsx` (AssetGrid) | `참조로 사용` 역할→mode 매핑을 `referenceModeForRole()` 헬퍼로: character→character_reference, product→product_reference, **background/location→background_reference**, 그 외→style_reference | 기존 nested ternary가 background/location을 style로 오라우팅. `background_reference`는 `0c50272` `AssetUsageMode`(types.ts:206)에 이미 존재하는 **유효 enum** → 타입 안전. 서버 `attachImageToShot`이 mode를 passthrough 기록 → 무해. Codex 진행 중 `buildGenerationPromptPackage`의 `idsByMode("background_reference")` 버킷과 forward-compatible |

> **계약/타입 무파괴 확인**: R6-FIX-3은 `types.ts`에 이미 정의된 mode 값만 사용(신규 enum X). API 시그니처·도메인 타입 변경 없음.

---

## 4. 커밋·핸드오프

- **Claude 커밋 = 3파일만 pathspec**: `studio-app/app/globals.css`, `studio-app/src/features/studio/StudioApp.tsx`, `design/14-…md`. base=`0c50272`이며 이 base는 R5 시점 green + 내 3파일은 `0c50272` 단독에서도 타입-clean(`background_reference` 존재 확인) → **커밋 단독으로도 green**.
- **Codex WIP 미커밋 유지**: `types.ts`·`mock-service.ts`·`mock-flow.test.ts`·`validate-contracts.ts`·`codex/api/openapi.json`·`codex/schemas/domain.schema.json`·신규 `codex/08-…report.md`는 손대지 않고 작업 트리에 그대로 둠(Codex가 자기 라운드로 커밋).

---

## 5. 다음 라운드 권고 (미수정 — 좁은 범위 밖 / Codex 도메인 / 제품 결정)

- **P1 후보 비교 라벨**: 후보 A~D 카드에 `ImageVariant.scoreLabel`(추천/안정적/확인 필요) 미표시. 데이터는 존재 → 카드에 체감 라벨 노출 권고([12 §3] 정합).
- **P2 Image Maker 셀렉트 중복**: `용도`(purpose, 생성 방향) + `보관 분류`(role, 라이브러리 분류) 2종 동시 선택. 비전문가 인지부담 → "보관 분류"를 purpose에서 자동 파생 + 고급 토글로 숨기거나 보조 문구로 관계 설명(제품 결정 필요, [12 §2] IM-AC-2 "category=목적 매핑" 정신).
- **R4 이월(미해소, 재생기 구현 라운드 대기)**: 실제 `<video>` 플레이어 부재(텍스트 placeholder)·다듬기 화면 명령 미연결/자막·BGM·보이스 토글 부재·렌더 미리보기 토스트뿐·버전 비교 부재·스토리보드 컷 편집 부재. → [10 §3~5] AC 기준 Codex 플레이어 구현 후 합동 QA.
- **참고(콘솔)**: dev에서 404 1건(자산/파비콘 추정) — 기능 영향 없음, 정리 권고.

---

## 6. 통과 요약
- 모델명 누출 **0**(한·영 8뷰), 비용 ⚡ **전 뷰 존재**, 권리 확인 **존재**, 모바일 390px 오버플로 **0**(8뷰), 데스크탑 1366px 오버플로 **0**, 4종 검증 게이트 **전 PASS**, IA·연결 흐름 **설계 정합**.
