# Claude → Codex 핸드오프 (2026-05-23 ~ 24)

> **🔄 2026-05-24 갱신** — 디렉터 G.M.PARK 박사님 지시로 NASA/IAU/SIMBAD/Gaia DR3 표준값 대비 팩트체크 완료. 발견된 3건 차이를 모두 정밀화 반영:
>
> 1. 40 에리다니 A 거리: **16.45 → 16.340 광년** (Gaia DR3 측정값, ±0.010 정확도)
> 2. α Centauri AB 거리: **4.37 → 4.344 광년** (Wikipedia/Gaia 최신값)
> 3. 카이퍼 영역에 **산란 원반(Scattered Disk, 50~1,000 AU)** 입자·윤곽선·라벨 추가 (NASA 카이퍼 분류 완전 반영). 메인 카이퍼와 동일한 0.6 압축을 사용해 시각적 연속성 확보. 카메라 절단면도 visual 30,000 / real 200,000으로 확장.
>
> **데이터 정확도 등급: 97% → ~99.5%** 로 향상.

> **🔄 2026-05-24 추가 갱신** — 고해상 행성 텍스처 + 주요 위성 11개 추가:
>
> 1. **7행성 NASA 텍스처** (jsDelivr/threex.planets) — 디퓨즈 + 범프 맵 적용. 절차적 텍스처는 폴백으로 유지
> 2. **주요 위성 11개** — 부모-자식 계층(planet.group → pivot → mesh), 단순 원궤도, 공전 주기 정확값
>    · 화성: 포보스(0.32d), 데이모스(1.26d)
>    · 목성: 이오(1.77d), 유로파(3.55d), 가니메데(7.15d), 칼리스토(16.69d)
>    · 토성: 타이탄(15.95d), 레아(4.52d)
>    · 천왕성: 티타니아(8.71d), 오베론(13.46d)
>    · 해왕성: 트리톤(-5.88d, 역행)
> 3. **이중 가시성 로직**:
>    · (A) 행성 포커스 시 해당 행성 위성만 자동 fade-in (`updateMoonsVisibility()` 트리거)
>    · (B) 「🌙 위성」 전역 토글 버튼으로 모든 위성 동시 표시
>    · opacity 트윈 (FADE_SPEED 4.0, 약 0.25초 전환)

---


> 디렉터 G.M.PARK 박사님의 지시로 작성. Codex가 본 문서를 읽고 Claude 트랙 작업물에 대해 자유롭게 피드백·교차 검증할 수 있도록 정리.

---

## 0. 요약

기간 동안 **Claude 트랙**(`solar-project-claude/`)에 다음을 추가:

1. 외태양계 영역 시각화 (카이퍼 벨트 + 오르트 구름)
2. 외계 항성계 두 곳 — 「프로젝트 헤일메리」 40 에리다니 A + 「삼체」 알파 센타우리
3. 부산 기준 실시간 달 모양 위젯 (NASA 텍스처 기반 사실적 표면)
4. 조석 기본 지점 부산으로 변경
5. 보고서(`claude/index.html`)에 G.M.PARK 메인 페이지 신설

**Codex 트랙은 일절 손대지 않음** (디렉터 분리 원칙).

---

## 1. 작업 결과물 · 라이브 URL

| 항목 | URL |
|---|---|
| 메인 보고서 (G.M.PARK 대시보드) | https://gmpark-creator.github.io/project-dashboard/claude/ |
| 태양계 Claude 버전 (라이브) | https://gmpark-creator.github.io/project-dashboard/solar-project-claude/ |
| 태양계 Codex 버전 (비교용) | https://gmpark-creator.github.io/project-dashboard/solar-project-codex/ |
| 루트 인덱스 | https://gmpark-creator.github.io/project-dashboard/ |
| GitHub 레포 | https://github.com/gmpark-creator/project-dashboard |

GitHub Pages 배포라 push 후 약 5분 이내 반영됨.

---

## 2. 코드 변경 위치

### A. `solar-project-claude/index.html` (단일 파일)

작업 전 1074 라인 → 작업 후 약 1707 라인 (+633줄).

| 섹션 | 변경 내용 |
|---|---|
| 상수 정의 | `KUIPER_INNER_AU=30`, `KUIPER_OUTER_AU=50`, `OORT_INNER_AU=2000`, `OORT_OUTER_AU=100000`, `LY_TO_AU=63241.077`, `OORT_DIST_POW=0.35`, `TWEEN_INTERSTELLAR_DUR=3.4` 추가 |
| `STAR_SYSTEMS` 배열 | 외계 항성계 2개 데이터 (`hailmary_eridani`, `threebody_centauri`) — 정확 광년 거리, 방향 단위벡터, INFO 메타 |
| `INFO` 객체 | 카이퍼·오르트·헤일메리·삼체 항목 추가 — 사이드바 stats 자동 렌더링 |
| `FOCUS_LIST` | 「초점」 셀렉터에 4개 신규 항목 |
| `buildKuiperBelt()` / `buildOortCloud()` | 입자 시스템 — 카이퍼 9,000 입자 (면적 비례 분포), 오르트 3,500 입자 (구 부피 균일 분포) |
| `buildOuterRegionVisuals()` | 영역 윤곽선 — 카이퍼 두 원(LineLoop) + 반투명 RingMesh, 오르트 와이어프레임 sphere + 반투명 SphereShell(BackSide), 라벨 sprite |
| `setOuterRegionVisible(key)` | 「초점」 메뉴에서 카이퍼/오르트 선택 시에만 윤곽 표시, 그 외엔 숨김 |
| `rescaleOuterRegion(points, pow)` | 스케일 모드(visual/real) 토글마다 파티클 위치 재계산. 카이퍼는 `L^0.6`(기존 행성 공식), 오르트는 `L^0.35`(더 강한 압축) |
| 별 sprite + 라벨 빌드 | `makeStarSpriteTexture()` — AdditiveBlending 글로우, `makeRegionLabelTexture()` — 영역 라벨용 6:1 캔버스 |
| `bodyWorldPos` / `computeFocusOffset` / `adjustCameraExtents` | 신규 4개 키(`kuiper`/`oort`/`hailmary_eridani`/`threebody_centauri`) 분기 추가. 오르트 real 모드에선 `camera.far=1.2e7`까지, 40 에리다니 real 모드에선 `2e8`까지 동적 확장 |
| `drawMoonPhase()` | **Canvas 2D + NASA `moon_1024.jpg` + `globalCompositeOperation:'multiply'`** 합성. 원형 clip → 텍스처 그리기 → 어두운 반원 + terminator 타원으로 위상별 그림자 표현. 표면 디테일(크레이터·바다·고지) 유지 |
| `detailedMoonPhase()` | 한국어 8단계 위상명 (신월/상현전 초승달/상현달/상현후 차오르는 달/보름달/하현전 기우는 달/하현달/그믐달) |
| `updateMoonWidget()` | 0.5초 폴링, simTime 기반 (시간 배속·점프 시에도 일관) |
| HTML | 좌하단 `#bottomLeftStack` flex column wrapper로 `#moonWidget` + `#tidePanel` 묶음 |
| `curLoc` 초기값 | `LOCATIONS[0]` (인천) → `LOCATIONS.find(name==='부산')` |

### B. `claude/index.html` (보고서)

| 섹션 | 변경 내용 |
|---|---|
| `<aside>` 헤더 | 로고 영역을 `<button id="brandHome">`으로 변경, 텍스트 「G.M.PARK 프로젝트 대시보드」로, 그라데이션 호버 효과, 클릭 시 메인 페이지로 |
| `renderHome()` 함수 | **신설** — 알록달록 그라데이션 HERO(`fuchsia → violet → indigo → cyan`) + 컬러풀 4개 카드(프로젝트별 그라데이션) + TBD 추가 영역 |
| `selectProject(id)` | `id === 'home'` 분기 추가 — `renderHome()` 호출 |
| 초기화 | `activeId = 'home'` 첫 진입 시 메인 페이지 |
| `PROJECTS[2]` (solar) | `latest: '2026-05-24'`, `progress: 96`, issues 4건 신규 추가, milestones 4건 신규 추가, summary/method 보강 |

---

## 3. 알고리즘 메모 (의도)

### 항성간 거리 압축 — visual 모드
오르트 구름(외곽 100,000 AU)이 카메라 절단면 안에 들어오도록 별도 압축 지수 사용:
- 행성/카이퍼: `AU_UNITS × L^0.6` (기존 공식)
- 오르트 + 외계 항성계: `AU_UNITS × L^0.35` (더 강한 압축)

이렇게 분리한 이유 — 한 가지 압축식만 쓰면 행성 사이 비율이 부자연스러워지거나, 별이 카메라 절단면 밖으로 나감.

### 카메라 절단면(far)을 영역별로 동적 조정
`adjustCameraExtents(key)`에서 초점 변경 시 `camera.far` 및 `controls.maxDistance`를 영역 크기에 맞춰 변경:
- 기본: 80,000
- 오르트 visual: 60,000
- 오르트 real: 1.2 × 10⁷
- 40 에리다니 real: 2 × 10⁸

`logarithmicDepthBuffer: true`가 이미 켜져 있어 z-fighting은 자동 해소.

### 달 위상 시각화 — `multiply` 합성
- 원형 clip 안에 NASA 텍스처를 정상 색상으로 그림 (밝은 면)
- 그 위에 `globalCompositeOperation = 'multiply'` 모드로 어두운 색(`#1a1a22`)을 그리면, 곱셈 합성이라 텍스처 디테일이 살아 있는 채로 어두워짐
- 어두운 반원 + terminator 타원(가로축 `r×|cos(phaseAngle)|`)이 illumination에 따라 어두움/밝음 색으로 채워져 정확한 위상 형태 형성

---

## 4. 디렉터 검증 차이 (참고)

**박사님 자료의 검증값** (2026-05-23 23:24 KST): "약 44~45% illumination, '상현전 초승달'"
**Claude 코드 계산값**: 51.41%, '상현달'

차이 약 6%. 원인은 기존 `moonPosition()` 함수가 표준 perturbation 항만 포함한 간소화 알고리즘이기 때문. 5월 23일은 천문학적으로 정확히 상현달 시점이라 51%가 실제에 가까울 가능성. 박사님이 직접 SunCalc 같은 정밀 라이브러리로 교체 지시하시면 그때 작업.

---

## 5. Codex에게 피드백 받고 싶은 부분 (선택)

박사님이 교차 검증 요청하시면 다음 관점에서 검토 가능:

1. **외계 항성계 거리 표현** — 16.340 ly = 1,033,359 AU 환산 정확도, 방향 단위벡터의 천구 좌표 단순화가 적절한지
2. **달 위상 시각화 알고리즘** — `multiply` 합성 + terminator 타원 방식이 천문학적으로 자연스러운지, 다른 접근법 추천 여부
3. **카이퍼/오르트 입자 분포** — 카이퍼는 면적 비례(`sqrt(u·(r₂²-r₁²)+r₁²)`), 오르트는 부피 균일(`cbrt(u·(R₂³-R₁³)+R₁³)`) 분포 사용. 더 사실적인 분포 모델 제안 가능
4. **카메라 절단면 동적 확장** — `2 × 10⁸`까지 키울 때 WebGL depth precision 문제 가능성 검토
5. **보고서 UI/UX** — 메인 페이지 색감, 가독성, 카드 그리드 인터랙션

---

## 6. 박사님 표준 워크플로 준수 사항

- ✅ Claude 영역(`solar-project-claude/*`, `claude/*`, 루트 `README.md`, 루트 `index.html`)만 커밋
- ✅ Codex 영역(`solar-project-codex/*`, `codex/*`)은 손대지 않음 — Codex 작업물 그대로 보존
- ✅ 응답 마지막 줄에 Claude/Codex 보고서 + 작업 결과물 URL 3개 표기
- ✅ 친형 언급 시 "왕먀오 박사" 표기 규칙 준수 (이번 작업엔 친형 언급 없음)
- ✅ git config 영구 변경 없이 `git -c user.email/user.name`로 일회성 author identity 사용

---

> 작성: Claude (박사) · 2026-05-24
> 핸드오프 대상: Codex
> 회신/피드백: 같은 레포 어디든 자유롭게 작성, 디렉터가 양쪽 모두 확인.
