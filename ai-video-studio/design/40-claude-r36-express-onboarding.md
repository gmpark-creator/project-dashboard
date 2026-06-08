# 40 · Claude R36 — Express 온보딩 (P3 "완성본 먼저")

> 2026-06-08 · Claude(Opus 4.8, 1M) · 영역: UX/제품 + 프론트엔드(Claude 트랙) · [[39-claude-r30-creator-flow-failure-recovery]] 후속
> 디렉터 지시: 비용 모델(Codex 영역)을 떠나 Claude 트랙(UX/프론트) 사안을 이어간다.

## 배경 — P3 위반

제품 6대 원칙 P3 = **"첫 결과는 완성본부터, 빈 캔버스 금지."** 그런데 신규 프로젝트 진입(NewProject)은 단일 CTA "스토리보드 만들기" 하나뿐이고, 누르면 `createProject → goToView("storyboard")`로 **빈(미생성) 스토리보드**에 떨어진다. 사용자는 거기서 "전체 생성"을 **다시 눌러야** 비로소 영상이 만들어진다. 즉 첫 결과가 "완성본"이 아니라 "할 일 목록"이다(InVideo가 AI로 500+ 결정을 대신해 초안을 완성해 주는 패턴과 반대).

## 변경 — 2지선다 진입

NewProject에 진입 경로 두 개를 둔다.

| CTA | 동작 | 대상 |
|---|---|---|
| **초안까지 한 번에 만들기**(primary) | `createProject` → `generateAll("fast")` → `goToView("compare")` | 대부분의 사용자 — 완성될 초안부터 보고 싶다 |
| 스토리보드부터 직접(secondary) | `createProject` → `goToView("storyboard")` | 컷 구성을 먼저 검토하고 생성하고 싶다 |

- Express 경로는 **빠른 미리보기(fast) 티어**로 전체 컷을 자동 생성하고 **비교 화면**으로 보내, 사용자가 빈 스토리보드 대신 *채워지는 초안*을 바로 본다(P3 + P2 드래프트 우선).
- 두 버튼 모두 동일하게 아이디어 입력만 검증한다(`submit(handler)`로 분기).
- 강제 자동 생성이 아니라 **사용자가 고르는 선택지**다. 버튼 아래 안내문에 "초안까지 = 빠른 미리보기로 자동 생성(크레딧 사용)", "직접 = 스토리보드 먼저 검토"를 명시해 P6(비용 의도를 그 버튼에서 알린다)와 정합.

## 누출/안전

- 프론트 단독(`studio-app/src/features/studio/StudioApp.tsx`)만 수정. 백엔드/스키마/계약 무변경.
- mock 크레딧 차감(실결제 아님). generateAll 실패 시 R30 `failureNotice`(한국어 복구 안내)가 그대로 동작하고, 프로젝트는 생성돼 있어 대시보드에서 이어갈 수 있다.
- 모델명/내부 식별자 노출 없음.

## 검증

`npm run verify` GREEN(typecheck/validate:contracts/test:mock(32)/audit/build). UI 컴포넌트 변경이라 기존 테스트는 영향 없음.

## 다음 후보 (Claude 트랙)

1. 액션 버튼 **가시적 진행/잠금 상태**(double-submit 시각 가드) — R30의 run() 재진입 가드를 버튼 disabled+"처리 중"으로 노출.
2. `StudioApp.tsx`(3600줄) **책임 분리 리팩터 순서 제안**(리뷰 요청 6번) — 비파괴 설계문서 우선.
3. 크리에이터 플로우 잔여 UX 폴리시(빈/오류/로딩 상태 일관, 마이크로카피).
