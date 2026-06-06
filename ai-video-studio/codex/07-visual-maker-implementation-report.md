# Codex R5 - Visual Maker implementation report

## Scope

Visual Maker를 `Image Maker`와 `Video Maker`로 나누는 제품 방향에 맞춰, Next `studio-app`에 이미지 생성/등록/레퍼런스 연결의 1차 동작 골격을 구현했다. Claude의 설계 문서 영역은 건드리지 않았고, 구현 표면은 앱 코드와 Codex 보고서로만 제한했다.

## Implemented

- `ImageAsset`, `ImageJob`, `ReferenceBoard`, `DirectionSpec` 도메인 타입 추가
- 프로젝트 번들에 `imageAssets`, `imageJobs`, `referenceBoard` 포함
- 기존 `Shot`에 `referenceImageIds`와 컷별 연출 지시 `directionSpec` 추가
- 목업 서버에 이미지 잡 생성, 외부 이미지 등록, 컷 레퍼런스 연결, 연출 업데이트 로직 추가
- 기존 dev 세션의 구형 목업 상태를 새 필드로 보정하는 `normalizeState` 마이그레이션 추가
- API 추가
  - `GET/POST /api/projects/[projectId]/assets`
  - `POST /api/projects/[projectId]/image-jobs`
  - `POST /api/shots/[shotId]/references`
  - `PATCH /api/shots/[shotId]/direction`
- UI 추가
  - 대시보드에서 `Video Maker`와 `Image Maker` 진입 분리
  - `Image Maker` 화면에서 이미지 후보 생성 잡 실행
  - `Asset Library` 화면에서 외부 이미지 등록 및 컷 레퍼런스 연결
  - 컷 비교 화면에서 연결된 이미지와 상세 연출 지시 편집

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke on `http://127.0.0.1:3020`
  - project create
  - image job create
  - external image register
  - shot reference attach
  - shot direction update
  - project asset list

## Current behavior

이 단계의 앱은 실제 이미지/영상 모델을 호출하지 않는다. 대신 Image Maker와 Asset Library의 데이터 계약, 상태 전이, 사용자 흐름, API 표면을 먼저 고정한다. 다음 단계에서 Nano Banana, GPT Image, Ideogram, Midjourney 계열 이미지 생성 어댑터나 Runway/Veo/Luma 영상 어댑터를 동일한 계약 뒤에 붙이면 된다.

## Next integration points

- 이미지 생성 라우팅 테이블: 목적별 모델 선택, 비용, 사이즈, 권리 정책
- 업로드 파이프라인: 파일 저장소, 썸네일 생성, 안전성/권리 체크
- 이미지 잡 완료 후 사람이 선택한 이미지를 첫 프레임/캐릭터/제품/스타일 레퍼런스로 승격
- 영상 생성 어댑터가 `Shot.referenceImageIds`와 `Shot.directionSpec`를 프롬프트 패키지에 반영
- Claude 설계 산출물과 UI 문구/화면 구조를 맞춘 2차 프론트 패스
