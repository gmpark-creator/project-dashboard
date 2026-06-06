# 11 · Visual Maker 확장 — UX/제품 설계 (마스터)

> ⚠️ **번호 시프트:** 지시문은 `10-visual-maker-expansion.md`를 가리켰으나 `10`은 이미 [10-claude-r4-player-ux-qa.md](10-claude-r4-player-ux-qa.md)(R4 재생기 UX)라 덮어쓰지 않고 **11/12/13**으로 작성. 보조 문서: [12-image-maker-screens.md](12-image-maker-screens.md) · [13-asset-library-reference-board.md](13-asset-library-reference-board.md).

**방향:** `AI Video Studio`(가칭 Cutpilot)를 단순 Video Maker가 아니라 상위 개념 **Visual Maker**로 확장. 그 안에 **Image Maker · Video Maker · Asset Library** 3축. Image/Video는 화면상 분리하되 **Asset Library**로 연결한다.
**역할:** Claude=UX/제품·화면 흐름(이 문서) / Codex=구현(API·모델·라우팅·저장소). **구현 코드 미수정**. **모델명/엔진명 UI 비노출** — 사용자는 목적(사진급 실사·제품·인물·스타일·로고/포스터·썸네일·저비용 시안·고품질)으로만 선택.

기존 도메인(`studio-app/src/domain/types.ts`): Project→Scene→Shot{saec, requirements{imageToVideo, characterLock, characterId}}→Take, Project.characters[]. 본 확장은 여기에 **ImageAsset·ImageJob·ImageVariant·ReferenceBoard·AssetUsage** + **Shot.referenceImageIds·directionSpec** 를 더한다(하위호환).

---

## 1. Visual Maker 전체 IA

```
Visual Maker  (제품 루트 — 현재 워드마크 "Cutpilot")
├─ 대시보드 (Projects)        ← 진행/완료 프로젝트 + 최근 이미지 + 라이브러리 바로가기
├─ 🖼  Image Maker            ← 이미지 생성·편집·배경제거 → Asset Library 저장 (영상 비종속·독립)
├─ 🎬  Video Maker            ← 아이디어→스토리보드→컷별 후보→선택→다듬기→렌더 (Asset 이미지 "참조")
├─ 🗂  Asset Library          ← 모든 이미지(생성/업로드/외부) 분류·검색·재사용
│     └─ Reference Board      ← 프로젝트/테마별 큐레이션 보드(무드보드)
└─ ⤓  내보내기 (Exports)      ← 완성 영상(MP4 6/15/30s) + 내보낸 이미지
```

| IA 노드 | 정의 | 소유 데이터 |
|---|---|---|
| **대시보드(Projects)** | 작업 단위 목록(영상 프로젝트 + 최근 이미지 묶음). 재진입 허브 | Project[] |
| **Image Maker** | 이미지 *생성 도구*. 결과는 Asset Library에 저장(특정 영상에 묶이지 않음) | ImageJob → ImageVariant → ImageAsset |
| **Video Maker** | 영상 *제작 도구*(기존 플로우). 이미지를 **소유하지 않고 참조** | Project/Scene/Shot/Take (+ referenceImageIds) |
| **Asset Library** | 모든 이미지의 단일 저장소·분류·검색. **연결의 핵심** | ImageAsset[], AssetUsage[] |
| **Reference Board** | 라이브러리 부분집합을 목적별로 묶은 보드 | ReferenceBoard{assetIds[]} |
| **내보내기(Exports)** | 완성 산출물(영상 렌더 + 이미지 내보내기) | RenderJob outputs, image exports |

**불변식**
- **Video Maker는 이미지를 복제·소유하지 않는다.** Shot은 `referenceImageIds`로 Asset Library의 ImageAsset을 **참조**만 한다(단일 소스, drift 0).
- **Image Maker ↔ Video Maker 화면 분리**, 연결은 Asset Library + "Video Maker로 보내기" 액션으로만.
- 같은 ImageAsset을 여러 Project/Shot이 참조 가능(AssetUsage로 추적).
- 사용자는 모델/엔진을 모른다. 목적·티어만 고른다.

---

## 2. 사용자 플로우 (5종)

| # | 플로우 | 경로 | 핵심 |
|---|---|---|---|
| F1 | **이미지 먼저 만들고 영상** | Image Maker(목적·프롬프트→후보 A~D)→선택→Asset 저장→Video Maker 새 프로젝트→Library에서 참조 선택→컷 생성 | 이미지가 영상의 재료(첫프레임/스타일/캐릭터/제품) |
| F2 | **외부 이미지 업로드 후 영상** | Asset Library 업로드(나노바나나 산출·제품/인물 사진·로고)→분류(category·권리)→Video Maker가 참조 | 외부 툴/사진을 영상 재료로 |
| F3 | **기존 영상 중간에 참조 추가** | Video Maker 스토리보드/비교 화면→해당 Shot "참조 이미지 추가"→Library에서 고르거나 즉석 업로드/생성→Shot.referenceImageIds 연결 | 제작 중 재료 보강 |
| F4 | **같은 이미지로 여러 영상** | Asset Library에서 ImageAsset 1개→"영상에 사용"→여러 Project/Shot에 AssetUsage 생성 | 제품컷·로고·인물을 캠페인 전반 재사용 |
| F5 | **이미지 후보 A/B/C/D→영상 컷 참조** | Image Maker 후보 비교→1개 선택→"Video Maker로 보내기"(역할 지정)→대상 Shot의 참조로 | 후보 비교 UX가 이미지·영상 공통 패턴 |

각 플로우 상세 시퀀스는 §3 화면 + §6 연결 UX 참조. **되돌아가기 무손실·자동저장**(기존 원칙 유지).

---

## 3. 화면 설계 (7종 개요) — 상세 와이어프레임은 12·13 문서

| 화면 | 목적 | 핵심 컴포넌트 | 상세 |
|---|---|---|---|
| **Visual Maker 대시보드** | 프로젝트 + 최근 이미지 + 라이브러리 진입 | ProjectCard, 최근 ImageAsset 스트립, [Image Maker][Video Maker][Asset Library] 진입 | §3.1 |
| **Image Maker** | 이미지 생성/편집 | 프롬프트·비율·스타일·**목적**·참조 추가·[후보 생성 N⚡] | [12 §2](12-image-maker-screens.md) |
| **Image 후보 비교** | A/B/C/D 비교·선택 | ImageCompareGrid, 체감 품질 라벨, [이걸로][저장][Video Maker로 보내기] | [12 §3](12-image-maker-screens.md) |
| **Asset Library** | 모든 이미지 분류·검색 | 그리드 + category 필터(제품/인물/배경/스타일/키프레임/썸네일/로고) + 검색 + 업로드 | [13 §2](13-asset-library-reference-board.md) |
| **Reference Board** | 프로젝트/테마 무드보드 | 보드 캔버스(ImageAsset 모음), 역할 미리지정 | [13 §3](13-asset-library-reference-board.md) |
| **Video Maker 참조 선택** | Shot에 참조 이미지 붙이기 | Library 피커(필터·검색) + 업로드/즉석생성 + **역할 선택** | §3.2 |
| **Shot별 연출 지시** | 컷 단위 연출 + 참조 역할 | directionSpec 폼(참조·역할·카메라·모션·강조) | §3.3 |

### 3.1 Visual Maker 대시보드
```
┌ Cutpilot · Visual Maker ─────────────── 1,240⚡ ─┐
│ [+ 새 프로젝트] [🖼 Image Maker] [🗂 Asset Library]│
│ 이어서 작업하기                                    │
│  ┌프로젝트카드┐ ┌프로젝트카드┐ ┌+ 새로 시작┐        │
│ 최근 만든 이미지 (Asset Library →)                 │
│  [img][img][img][img][img]  …                     │
└────────────────────────────────────────────────────┘
```
좌측 글로벌 nav: 대시보드 · Image Maker · Video Maker · Asset Library · 내보내기.

### 3.2 Video Maker — 참조 이미지 선택(피커)
```
컷 N 참조 이미지                                  [Asset Library에서 고르기]
┌ 라이브러리 피커 ───────────────────────────────┐
│ 필터:[전체][제품][인물][배경][스타일][로고]  검색▢ [⬆ 업로드] [🖼 즉석 생성]│
│ [img✓][img][img][img]…   ← 다중 선택               │
│ 선택한 이미지 역할:  (○영상 참조  ○첫 프레임  ○스타일만  ○인물 유지  ○제품 유지  ○배경 유지)│
│                         [이 컷 참조로 추가]        │
└────────────────────────────────────────────────────┘
```

### 3.3 Shot별 연출 지시(directionSpec)
```
컷 N · 연출 지시
참조 이미지: [제품컷🔒제품 유지] [배경컷·배경 유지] [+ 추가]
카메라: [부드러운 푸시인 ▾]   모션: [잔잔 ▾]   강조: "라벨 클로즈업 2초"
프롬프트(SAEC): 피사체·동작·환경·조명·스타일 …(기존 폼)
※ 참조 역할은 "어떻게 쓸지"만 — 어떤 엔진이 처리할지는 자동
```

---

## 4. 데이터 / 상태 UX 요구사항

> ⚠️ **정합 노트(중요):** 이 데이터 모델은 **이미 Codex가 `studio-app/src/domain/types.ts`에 구현**했다(StudioState/ProjectBundle에 imageAssets·imageJobs·referenceBoards 포함). **types.ts가 권위 소스**이며 아래는 그 실제 타입 기준의 UX 요구다(Claude는 types.ts 미수정). 초안과 달라진 핵심: ▸**DirectionSpec=연출 필드**(참조 아님) ▸참조 역할은 **`Shot.referenceImageIds` + `AssetUsage.mode`** ▸`AssetSource="image_maker"`(generated 아님) ▸ReferenceBoard=**category별 id 배열**.

```ts
// ── 실제 enum (types.ts) ──
ImageAssetRole   = "product"|"character"|"location"|"style"|"keyframe"|"thumbnail"|"logo"|"background"
AssetSource      = "image_maker"|"upload"|"external"
ImageMakerPurpose= "photoreal"|"product"|"character"|"background"|"style"|"poster"|"thumbnail"|"transparent"
//  ↳ UI 목적 매핑: 사진급 실사=photoreal · 제품=product · 인물 참조=character · 배경=background · 스타일 참조=style · 로고/포스터=poster · 썸네일=thumbnail · 배경 제거(투명)=transparent

ImageAsset   { id, projectId, kind:"image", role:ImageAssetRole, source:AssetSource, label, prompt, url, thumbUrl,
               aspect, width, height, rights:{ status:"user_confirmed"|"generated"|"needs_review", note }, createdAt, updatedAt }
ImageJob     { id, projectId, status:JobStatus, progress, etaSec, stage:"queued"|"prompting"|"generating"|"saving"|"done"|"failed",
               prompt, purpose:ImageMakerPurpose, role:ImageAssetRole, aspect, style, count, variants:ImageVariant[], dueAt, createdAt, updatedAt, error }
ImageVariant { id, assetId|null, label, status:JobStatus, url, thumbUrl, scoreLabel:"추천"|"안정적"|"확인 필요" }   // 실패는 status="failed"로(별도 라벨 없음)
ReferenceBoard { projectId, productImages[], characterImages[], locationImages[], styleImages[], keyframes[], thumbnails[], logos[], backgrounds[], usages:AssetUsage[] }  // category별 ImageAsset id 배열, projectId 키
AssetUsage   { assetId, role:ImageAssetRole, target:"project"|"shot", targetId, mode:"first_frame"|"last_frame"|"style_reference"|"character_reference"|"product_reference"|"background_reference", createdAt }
// Shot 확장(이미 구현):
Shot.referenceImageIds: string[]            // 참조 ImageAsset id 목록(소유X)
Shot.directionSpec: DirectionSpec           // = { camera, composition, lighting, motion, style, avoid[], notes } — 연출 필드(참조 아님)
```
> **참조 "역할/모드"는 directionSpec이 아니라 `AssetUsage`에 산다:** 컷에 이미지를 붙이면 `Shot.referenceImageIds`에 id가 추가되고, "어떻게 쓸지"(첫 프레임/스타일만/인물 유지 등)는 `AssetUsage{target:"shot", targetId:shotId, mode}`로 기록. (§6 매핑)
> **제안(Codex 판단):** ImageJob에 참조기반 생성용 `referenceAssetIds`, 시안/고품질 구분용 `tier`가 아직 없음 → F1/F5(참조 기반 이미지 생성)·저비용/고품질을 타입으로 지원하려면 추가 검토. `ImageAsset.projectId`는 생성 맥락 프로젝트(라이브러리 뷰는 전역 집계, Shot은 id 참조라 소유 이전 없음).

| 모델 | UX 요구사항 |
|---|---|
| **ImageAsset** | 라이브러리에 그리드 표시(썸네일·라벨·category 배지·source 배지·권리 상태). 클릭→상세/편집/사용. category·tags로 필터·검색. |
| **ImageJob** | "후보 생성 N⚡" 시 생성. 상태(대기/만드는 중/완료/실패)·진행률·취소. tier=저비용 시안/고품질. |
| **ImageVariant** | A/B/C/D 후보. 체감 품질 라벨(숫자X). 선택 시 ImageAsset으로 승격·라이브러리 저장. 미선택 후보 보존. |
| **ReferenceBoard** | 프로젝트당 1개(projectId 키), **category별 id 배열**(productImages/characterImages/…/backgrounds) + usages[]. 무드보드 뷰는 이 버킷을 카테고리 섹션으로 표시. |
| **AssetUsage** | `{assetId, role, target, targetId, mode}` — "이 이미지가 어디서 어떤 mode로 쓰이나". "N개 영상에서 사용 중"(F4) + 권리 미확인 전파 경고. **참조 "역할/모드"의 단일 소스.** |
| **Shot.referenceImageIds** | Shot이 참조하는 ImageAsset id 목록(소유X). 비교/연출 화면에 썸네일. 제거해도 ImageAsset은 라이브러리에 남음. |
| **Shot.directionSpec** | **연출 필드**(camera·composition·lighting·motion·style·avoid[]·notes) — SAEC 보완. ※참조 이미지/역할은 여기 아님 → referenceImageIds + AssetUsage.mode(§6). |

---

## 5. Image Maker UX 세부 (8항목) — 화면 상세는 12 문서

| 항목 | UX |
|---|---|
| **프롬프트 입력** | 자유 텍스트 + 예시 칩. 모델명/파라미터 없이 "무엇을" 만 |
| **이미지 비율** | 1:1 / 9:16 / 16:9 / 4:5 (영상 Aspect와 정합) |
| **스타일** | 사진/일러스트/3D/미니멀/시네마틱 등 *체감* 스타일(엔진명 X) |
| **용도(목적)** | 사진급 실사 · 제품 이미지 · 인물 참조 · 스타일 참조 · 로고/포스터 · 썸네일 · 배경 — 목적이 category·기본 비율·라우팅 힌트 결정 |
| **참조 이미지 추가** | 기존 ImageAsset/업로드를 참조로(예: 이 제품 사진처럼·이 인물로) |
| **후보 생성** | tier 선택(저비용 시안/고품질) + "후보 N개 생성 N⚡"(버튼 위 비용) |
| **후보 비교** | A/B/C/D 나란히, 체감 품질 라벨, 확대 비교 |
| **저장** | 선택 후보→ImageAsset(category·권리 입력)→Asset Library |
| **Video Maker로 보내기** | 선택 이미지를 특정 Project/Shot의 참조로(역할 선택). §6 |

---

## 6. Video Maker와의 연결 UX (참조 역할)

사용자는 이미지를 **"어떻게 쓸지"(역할)** 만 고른다. 역할이 백엔드 라우팅 플래그로 매핑(Codex).

실제 저장: `Shot.referenceImageIds`(id 추가) + `AssetUsage{target:"shot", targetId:shotId, role:ImageAssetRole, mode}`. UI 카피 → `AssetUsage.mode` 매핑:

| 사용자 선택(UI 카피) | AssetUsage.mode | 백엔드 매핑(Codex 영역) |
|---|---|---|
| **첫 프레임으로 사용** | `first_frame` | `requirements.imageToVideo=true`(시작 프레임) |
| **마지막 프레임으로 사용** | `last_frame` | 종료 프레임(키프레임 전환) |
| **스타일만 참고** | `style_reference` | 스타일 레퍼런스 |
| **캐릭터/인물 유지** | `character_reference` | `requirements.characterLock=true`(+`characterId`) |
| **제품 유지** | `product_reference` | 제품 일관성 참조 |
| **배경 유지** | `background_reference` | 배경 레퍼런스 |
| **이 이미지를 영상 참조로 사용**(일반) | (자산 role 기반 기본 mode 자동 제안: 제품 asset→`product_reference` 등) | referenceImageIds 추가 + 추론 mode |
| **컷별 참조 지정** | 컷마다 `referenceImageIds` + 개별 `AssetUsage` | 컷별로 다른 참조/mode |

**연결 UX 규칙**
- "Video Maker로 보내기" 또는 컷의 "참조 추가"에서 **역할 선택 필수**(기본 `reference`).
- 한 컷에 여러 참조(예: 제품 유지 + 배경 유지) 가능.
- 참조 썸네일을 컷 카드·연출 화면에 표시(🔒역할 배지).
- 역할/엔진 결정은 자동 — 사용자에겐 "첫 프레임으로 쓸게요" 식 결과 언어만.
- 참조 이미지의 **권리 상태가 미확인이면** 연결 시 경고(§7).

---

## 7. 외부 이미지 / 인물 사진 사용 안내 (짧고 명확)

법률 벽이 아니라 small helper + 1회 확인. 차단이 아니라 책임 고지.

| 상황 | UX 카피(사용자) | 동작 |
|---|---|---|
| 이미지 업로드 | "직접 올린 이미지는 본인이 사용 권리를 가진 것만 올려 주세요." | 업로드 영역 helper + 1회 체크 → `rights.ownership=user_upload_confirmed` |
| 인물 사진 업로드 | "사람이 등장하는 사진은 본인 또는 당사자 동의가 있는 것만 사용해 주세요." | 인물 category 선택 시 동의 체크 → `rights.personConsent` |
| 브랜드/로고 | "브랜드·로고는 사용 권한이 있는 경우에만. 타사 상표 주의." | logo category 시 주의 helper → `rights.brandUse` |
| 권리 미확인 자산을 영상 참조 | "이 이미지는 권리 확인이 안 됐어요. 사용 권리를 확인했나요?" | 연결 전 확인 모달, 미확인 시 경고 배지 유지 |
| 상업적 내보내기 | "포함된 이미지·사운드가 모두 사용 가능 권리인지 확인하세요." | 내보내기 요약에 권리 점검 라인 |

**금지(제품·문구 모두):** 출처 불명 이미지 자동 수집, 무단 인물 합성, 타사 로고 무단 사용 권장. (영상 사운드 라이선스 원칙[10/09]과 일관.)

---

## 8. Acceptance Criteria (Codex 구현 기준 — 테스트 가능)

**Asset / 연결**
- AC-1 Image Maker에서 후보를 생성하면 `ImageJob`이 생기고 `ImageVariant`(A~D)가 상태머신(queued→running→done/failed)으로 진행된다.
- AC-2 후보를 선택하면 해당 `ImageVariant.assetId`에 새 `ImageAsset` id가 채워져 **Asset Library에 등록**되고, 미선택 후보는 보존된다.
- AC-3 **업로드된 이미지는 Asset Library에 `ImageAsset(source:"upload")`으로 등록**되고, category·rights가 기록된다.
- AC-4 **ImageAsset은 Video Maker Shot에 `referenceImageIds`로 연결될 수 있어야 한다.** Shot은 이미지를 복제하지 않고 id로 참조한다.
- AC-5 같은 `ImageAsset`을 2개 이상 Project/Shot이 참조하면 각각 `AssetUsage`가 생기고, 자산 상세에 "N개 영상에서 사용 중"이 표시된다(F4).
- AC-6 Shot의 참조를 제거해도 `ImageAsset`은 라이브러리에 남는다(소유X).
- AC-7 참조 이미지를 컷에 붙이면 id가 `Shot.referenceImageIds`에 추가되고, "어떻게 쓸지"는 `AssetUsage{target:"shot", targetId:shotId, role, mode}`로 저장된다(**directionSpec 아님**). `mode`가 백엔드 플래그로 매핑(first_frame→imageToVideo, character_reference→characterLock).

**플로우/검증(지시문 테스트 — 테스트 가능 형태)**
- AC-8 mock 흐름 단위검증(`scripts/mock-flow.test.ts` 확장): `ImageJob.status="done"` → 선택 `ImageVariant.assetId!=null`(ImageAsset 등록) → 그 id가 대상 `Shot.referenceImageIds`에 포함 → `generateShot` 요청에 해당 참조가 실림 → `Take` 생성까지 **타입 오류 0**으로 완주.
- AC-9 `AssetUsage.mode="first_frame"`로 연결된 컷은 `requirements.imageToVideo=true`가 되고, 생성 요청에 그 이미지가 시작 프레임으로 전달된다.
- AC-10 `AssetUsage.mode="character_reference"` 연결 시 `requirements.characterLock=true`(+`characterId`)로 멀티샷 일관 요청이 만들어진다.

**UX/원칙**
- AC-11 Image Maker·후보 비교·Asset Library·연결 화면 **어디에도 모델명/엔진명 0** — `app/`·`src/features/` 렌더 텍스트에 엔진·모델 고유명(Runway/Veo/Luma/Gen-4/Flux/Stable Diffusion/나노바나나 등) 0건. (`engineUsed`는 types상 존재하나 **디버그/로그 전용·UI 비노출** — 스캔으로 회귀 방지.)
- AC-12 사용자는 **목적/티어**만 선택(사진급 실사·제품·인물·스타일·로고/포스터·썸네일 / 저비용 시안·고품질). 엔진 선택 UI 없음.
- AC-13 비용 발생 액션(이미지 후보 생성·고품질·업로드 처리 등) 100%에 ⚡ 비용 인라인.
- AC-14 권리 미확인 이미지를 영상 참조로 연결 시 확인 모달이 뜬다(§7).
- AC-15 Image Maker와 Video Maker는 **별도 화면/카테고리**이며, 연결은 Asset Library + "보내기/참조 추가"로만 이뤄진다.
- AC-16 모바일 390px·데스크탑 1366px에서 가로 오버플로 0(R4-01 교훈: 그리드 `minmax(0,1fr)`).
- AC-17 상업적 내보내기(RenderJob) 직전, 사용된 컷의 `referenceImageIds`에 `rights.status="needs_review"`인 ImageAsset이 있으면 내보내기 요약에 **권리 점검 경고**가 표시된다(§7).
- AC-18 ImageAsset 저장 모달: 목적(purpose)→role 자동 매핑·미리채움(사용자 변경 가능), `rights.status`는 최소 1개 필수(upload=user_confirmed 체크, image_maker=generated 자동).

---

## 9. 남은 질문 (Codex/디렉터 결정)
| Q | 질문 | 영향 |
|---|---|---|
| Q1 | **정식 제품명**: 상위 개념 **Visual Maker** 채택 vs 워드마크 **Cutpilot** 유지(또는 "Cutpilot — Visual Maker") | 브랜딩·#11 대시보드 카드 |
| Q2 | **이미지 provider 우선순위**(목적별: 실사/제품/인물/로고/배경) | 라우팅 config(엔진명 비노출) |
| Q3 | **업로드 이미지 저장소 정책**(보관기간·용량·서명URL·삭제) | 스토리지·비용 |
| Q4 | **인물 사진/브랜드 이미지 정책**(동의 보관·합성 허용 범위·타사 상표) | 법무·UX 고지 강도 |
| Q5 | **무료/유료 크레딧 정책** — placeholder(Codex `config` 상수로 분리, 디렉터 확정 전 임시): 이미지 시안 1개 ≈ **3⚡**, 이미지 고품질 ≈ **8⚡**, 영상 컷 fast ≈ 6⚡·final ≈ 22⚡(기존), 무료 월 한도 ≈ **200⚡**. 업로드 등록은 무료(0⚡, 표시 생략). | 과금·티어 |

> 다음(Codex 준비 범위): Image Maker mock API·외부 업로드 mock·ImageAsset/ReferenceBoard/AssetUsage/ImageJob/ImageVariant 모델·Shot.referenceImageIds/directionSpec·이미지→Asset→Video 참조→컷 생성 테스트. 본 문서 §4·§6·§8을 구현 계약으로 사용. Claude는 구현 후 화면/연결 합동 QA(R6).
