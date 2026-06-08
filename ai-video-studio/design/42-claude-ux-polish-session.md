# 42 · Claude 트랙 UX 폴리시 세션 기록 (무인 연속)

> 2026-06-08 · Claude(Opus 4.8, 1M) · 영역: UX/프론트(Claude 트랙) · [[40-claude-r36-express-onboarding]] / [[41-claude-r38-studioapp-split-proposal]] 후속
> 맥락: 비용 모델(Codex 영역, 별도 codex/214 인계) 이후 박사 지시로 Claude 본연 트랙으로 복귀해 우선순위 A~F를 무인 자율 수행한 기록.

## 한 일 (커밋, 전부 frontend 단독·게이트 GREEN·push)

### 온보딩·실패·피드백
- **R30** run() 실패 복구 한국어화(영어 raw 누출 제거) — [[39]]
- **R36** Express 온보딩(P3): "초안까지 한 번에" CTA = create+generateAll(fast)+compare — [[40]]
- **R37** 작업 중 가시 피드백: 상단바 "처리 중" 펄스 + Express CTA 잠금
- **R41/R45** busy 잠금을 모든 크레딧 소비 버튼으로(Storyboard·Compare·ImageMaker)

### 상태/체감 (B)
- **R40** 빈 상태 안내형(NoProject) + **R43** 대시보드 초기 로딩(false-empty flash 제거)
- **R46** 생성 중 체감: Compare "만드는 중" 안내 + TakeCard 진행바 indeterminate 애니메이션(멈춤 오인 제거)
- **R47** 입력 검증 가드(ImageMaker 프롬프트·AssetLibrary url/label) + reduced-motion a11y

### a11y (C)
- **R40** 뷰 전환 시 화면 제목(h1, tabIndex=-1)으로 포커스 이동(스크린리더)
- **R46/R47** progressbar role + prefers-reduced-motion 존중

### 내보내기 (E)
- **R42** 렌더 버튼 지점에 "6·15·30초 세 길이" 안내(P6)

### 분리 (A) — [[41]]
- **R39** `format.ts` 추출(순수 헬퍼 ~20개) — StudioApp −225줄
- **R44** `CancelJobButton.tsx` 분리(ops·creator 공유 컴포넌트, 운영콘솔 추출의 공유 의존 해소)

## A(분리)의 남은 부분 — 왜 무인 실행 안 했나

운영 콘솔 ~1210줄(RuntimeReadinessBadge~OperationsConsole)은 **단일 대량 이동**이 필요한데, 편집 도구가 "라인 범위 삭제"가 없고 exact-match 제거는 그 크기에선 **파일 손상 위험**이 크다(format.ts ≤137줄이 안전 한계였음). 공유 의존(CancelJobButton)은 R44로 미리 풀어뒀으니, **refactor IDE/스크립트로는 바로 추출 가능**하다. design/41의 순서·경계를 그대로 따르면 된다.

## 내 트랙에서 더 안 한 것 (차단/저가치)

- **P4 편집 실제 실행**(명령→실제 변형), **내보내기 컷 구성 선택**: 백엔드/제품 결정(Codex) — 프론트는 입력 UI까지만 가능.
- **자산/참조 DELETE UX**: 파괴적 write → 디렉터 승인 영역.
- **프로토타입/목앱 동기화(F)**: 정적 proof surface라 3700줄 React 앱 UX 복제는 노력 대비 가치 낮음.

## 상태

매 슬라이스 typecheck/build(프론트) GREEN → commit → push. master 최신. Codex 영역(`src/server`·`app/api`·`domain`·`codex`)은 안 건드림(비용 모델 인계는 codex/214가 11월까지 대기).
