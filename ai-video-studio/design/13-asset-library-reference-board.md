# 13 · Asset Library / Reference Board (보조)

[11-visual-maker-expansion.md](11-visual-maker-expansion.md)의 Asset Library·Reference Board 상세. **연결의 핵심** — Image Maker 산출·업로드·외부 이미지를 한곳에 모아 Video Maker가 참조. 구현 미수정·제안만. 모델명 비노출.

> **정합(types.ts 실제):** `ReferenceBoard`는 **프로젝트당 1개**(`StudioState.referenceBoards: Record<projectId, ReferenceBoard>`), category별 ImageAsset **id 배열**(`productImages`·`characterImages`·`locationImages`·`styleImages`·`keyframes`·`thumbnails`·`logos`·`backgrounds`) + `usages: AssetUsage[]`. 보드의 "역할 미리지정"은 **`board.usages`의 AssetUsage(mode)** 로 저장(별도 필드 아님). `ImageAsset.rights.status` = `user_confirmed`(업로드 확인)·`generated`(생성)·`needs_review`(확인 필요). Asset Library 그리드는 전 프로젝트 `imageAssets`를 category로 필터링한 전역 뷰.

## 1. 역할
- **Asset Library** = 모든 이미지(생성/업로드/외부)의 단일 저장소. 분류·검색·재사용·권리관리.
- **Reference Board** = 라이브러리의 부분집합을 프로젝트/테마별로 묶은 큐레이션 보드(무드보드). 역할 미리지정.
- Video Maker는 라이브러리/보드의 이미지를 **참조**만(소유X, drift 0).

## 2. Asset Library 화면
```
┌ 🗂 Asset Library ───────────────────────────── [⬆ 업로드] [🖼 Image Maker] ─┐
│ 분류: [전체][제품][인물][배경][스타일][키프레임][썸네일][로고]   출처:[전체][생성][업로드][외부]   검색▢ │
│ ┌img┐ ┌img┐ ┌img┐ ┌img┐ ┌img┐ ┌img┐                        │
│ │제품│ │인물│ │배경│ │로고│ │스타일│ │키프레임│  ← category 배지 + 권리상태(🔒미확인)│
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘                        │
│ 이미지 클릭 → 상세(미리보기·category·tags·권리·"N개 영상에서 사용 중"·[영상에 사용▾][보드에 추가][편집][삭제])│
└──────────────────────────────────────────────────────────────┘
```
| 컴포넌트 | UX 규칙 |
|---|---|
| **분류 필터** | product/character/location(배경)/style/keyframe/thumbnail/logo/background — 다중 선택 |
| 출처 필터 | generated/upload/external |
| 검색 | 라벨·tags |
| 자산 카드 | 썸네일·category 배지·출처 배지·**권리 상태**(확인/미확인🔒) |
| 자산 상세 | 미리보기·메타·**AssetUsage("N개 영상에서 사용 중")**·액션(영상에 사용/보드 추가/편집/삭제) |
| 업로드 | 드래그&드롭/파일 → category 선택 + 권리 확인(§[11 §7]) → ImageAsset(source:upload) |
| 삭제 가드 | 사용 중(AssetUsage>0)이면 "N개 영상에서 사용 중 — 삭제 시 참조가 끊깁니다" 경고 |

### 2.1 업로드 + 분류 플로우
```
[⬆ 업로드] → 파일 선택 → 미리보기
 → category: ○제품 ○인물 ○배경 ○스타일 ○로고 ○키프레임 ○썸네일
 → (인물 선택 시) "당사자 동의가 있는 사진인가요?" 체크
 → (로고 선택 시) "사용 권한이 있는 브랜드/로고인가요?" 체크
 → "본인이 권리를 가진 이미지입니다" 1회 확인
 → [라이브러리에 추가]  (ImageAsset.rights 기록)
```

## 3. Reference Board 화면
```
┌ Reference Board · 봄 캠페인 ─────────────── [+ 이미지 추가] ─┐
│ 제품: [딸기라떼컷] [컵 디테일]                              │
│ 인물: [바리스타A🔒제품 동의]                                │
│ 배경: [카페 외경] [창가]                                    │
│ 스타일: [산뜻 파스텔 톤]                                    │
│ 로고: [브랜드 로고]                                         │
│ → [이 보드로 새 영상 만들기]  /  보드 자산은 Video Maker 참조 피커에 우선 노출 │
└──────────────────────────────────────────────────────────────┘
```
| 규칙 | 내용 |
|---|---|
| 구성 | 프로젝트/테마별 보드. category별 그룹 표시 |
| 역할 미리지정 | 보드 자산에 기본 역할(제품 유지·배경 유지 등) 지정 가능 → Video Maker 연결 시 자동 제안 |
| 보드→영상 | "이 보드로 새 영상" → Video Maker 새 프로젝트에 보드 자산이 참조 후보로 프리셋 |
| 우선 노출 | Video Maker 참조 피커에서 현재 프로젝트 보드 자산을 상단 우선 표시 |

## 4. Video Maker 재사용 (연결)
- 참조 피커([11 §3.2])에서 라이브러리/보드 자산을 **다중 선택 + 역할 지정** → Shot.referenceImageIds + directionSpec.references.
- 같은 ImageAsset을 여러 Shot/Project가 참조(F4) → 각각 AssetUsage. 자산 1개 수정/교체 시 사용처에 반영(참조이므로).
- 역할→백엔드 라우팅 매핑은 [11 §6].

## 5. Acceptance Criteria (Asset Library / Reference Board)
- AL-AC-1 업로드 이미지는 `ImageAsset(source:"upload")`로 등록되고 category·rights가 저장된다.
- AL-AC-2 Image Maker 선택 후보는 `ImageAsset(source:"generated")`로 라이브러리에 나타난다.
- AL-AC-3 분류·출처 필터·검색으로 자산을 거를 수 있다(category 7종).
- AL-AC-4 자산 상세에 사용처(AssetUsage 기반 "N개 영상에서 사용 중")가 표시된다.
- AL-AC-5 사용 중(AssetUsage>0) 자산 삭제 시 경고가 뜬다.
- AL-AC-6 ReferenceBoard에 자산을 모으고 역할을 미리 지정할 수 있으며, "이 보드로 새 영상"이 Video Maker에 보드 자산을 참조 후보로 전달한다.
- AL-AC-7 권리 미확인(`ownership:"unknown"`) 자산은 카드/상세에 🔒 경고가 표시되고, 영상 참조 연결 시 확인 모달이 뜬다([11 §7]).
- AL-AC-8 라이브러리/보드/피커 어디에도 모델명·엔진명 0. 업로드/생성 처리 비용은 ⚡로 표시(해당 시).
- AL-AC-9 모바일 390px 그리드 가로 오버플로 0(minmax(0,1fr)).

> 이미지 생성→Asset 저장→Video Maker 참조→컷 생성 전체 흐름은 [11 §8 AC-8] 기준으로 mock 검증.
