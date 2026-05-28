# HANDOFF TO CODEX — project-dashboard 전면 검토 요청

**Date:** 2026-05-28 KST (session end)
**From:** Claude (Opus 4.7) — dashboard 영역 솔로 트랙
**To:** Codex (GPT) — 박사 한 마디 발화로 cross-review 진입
**Director:** G.M.PARK (matt.4lab@gmail.com / GitHub gmpark-creator)
**Repo:** https://github.com/gmpark-creator/project-dashboard (public Pages 호스팅)
**Latest commit on master:** `6f3c82e` — dashboard #5: korea-gov-sim 새 dist + iframe URL cache-bust (?v=kgs2)
**Live URL:** https://gmpark-creator.github.io/project-dashboard/claude/

박사 발화: "지금까지 결과물 코덱스가 전면 싹 검토할 수 있게 준비해줘"

---

## 1. 이번 세션 한 줄 요약

박사 dashboard를 **v2 (Tailwind+Lucide 라이트 코퍼레이트)** 에서
**v3.1 canonical (Plus X 톤 + Midnight Violet default + sidebar+routing + 9 컬러 모드 + 7 프로젝트 + 26 도시 월드클락)** 으로 전면 재구성. 4개 보존 트랙(`light-tone/`, `v3-stack/`, `tone-a~d/`, `tone-compare.html`)이 비교용으로 같이 살아있음.

---

## 2. 이번 세션 commit 인덱스 (23건, 2026-05-28)

```
6f3c82e  dashboard #5: korea-gov-sim 새 dist + iframe URL cache-bust (?v=kgs2)
8af5631  fix #5 preview: korea-gov-sim dist JS 절대경로 fetch → 상대경로 (sed 임시방편)
29f9afb  TIME ZONES open 시 sidebar 확장 + 도시 풍부(26개) + 정렬 변경 + 런던 추가
ba758c9  footer Links 삭제 + Quick Nav 갱신 + 시차 패널 재배열
83d839b  tz 토글 버그 fix + UTC 0 + 마침표/슬래시/Solo 제거
43c7739  대문자 / #6 컨셉 재정의(Atelier) / 시차 collapsible / proj-name 축소
ae6a2ec  #5 korea-gov-sim live preview 활성화 — preview type images → embed
0ef71b8  7 프로젝트 카운트 + 7 도시 월드클락 + JP GLOBAL 띄어쓰기 + role 트리오
1bf9c26  #4 inst & #7 premarket preview 활성화 + 우상 View Live 버튼 추가
f4eac61  자원 URL에 ?v=…emb 버전 string 추가 (브라우저 캐시 강제 갱신)
93bc05b  앰블럼 3종 재작도 (ship 컨테이너선 / orbit ring 행성 / building 빌딩)
92c836b  solar 앰블럼 재작도 — 사람 눈 → 항성+행성 (박사 첫 지적)
e6fd18f  FINAL: 미드나잇 바이올렛 default 픽스 (박사 결정)
3d6f2ad  #7 progress 30% + 9 color themes + 우상 Color 스위처 + Gemini Nano Banana 6 톤
4a470b6  #7 신설(US-KR Premarket, Codex 트랙) + 프로젝트별 앰블럼 7종 복구
970b866  v3.1 canonical: C 톤 (#202738) 픽스 (박사 결정)
c57c31f  tone 미세 시안 4종 + compare 랜딩 (박사 비교 의뢰)
b5c8786  v3.1 색감 lift v2 — 슬레이트-네이비로 한 단계 더
4b81c15  v3.1 색감 미세 lift + lead 문구 영어 교체
720e1e5  light-tone 시범본 신설 (박사 비교 의뢰)
482f6d1  v3.1 버그 수정(grid → block) + v3-stack 별도 보존
eb9ef39  v3.1 — sidebar + hash routing 복귀 (박사 피드백)
b2a05f4  v3 — Plus X 톤 인터프리테이션 (jpglobal-web/v3 디자인 언어 이식)
```

git tag 인덱스:
- `dashboard-v2-pre` — v2(Tailwind) 마지막 상태, 롤백 baseline
- `dashboard-v3.1-final` — v3.1 sidebar 진입 직후
- `dashboard-v3.1-tone-c-final` — tone C (#202738) canonical 픽
- `dashboard-v3.1-violet-final` — 박사 픽 violet default

---

## 3. 현재 디렉토리 / 자원 구조

```
project-dashboard/
├── claude/
│   ├── index.html                    v3.1 canonical shell (cache-bust ?v=20260528-kgs2)
│   ├── css/dashboard.css             v3.1 — vanilla + 9 컬러 모드 (html[data-color])
│   ├── js/projects-data.js           7 프로젝트 데이터 (PROJECTS 배열)
│   ├── js/dashboard.js               하나의 SPA 라우터 + render 함수들 + 시계
│   ├── previews/
│   │   ├── jpglobal-web/             #6 Atelier (jpglobal v3 정적 사이트)
│   │   ├── inst-extractor/           #4 INST UI shell (정적 데모 모드)
│   │   ├── us-kr-premarket/          #7 Codex Phase 1 React/Vite dist
│   │   └── korea-gov-sim/            #5 React+Three.js dist (영구 fix 후)
│   ├── light-tone/                   비교용 보존 (화이트+인디고 톤)
│   ├── v3-stack/                     비교용 보존 (이전 한 페이지 stack)
│   ├── tone-a/ tone-b/ tone-c/ tone-d/   tone 미세 시안 4종 보존
│   └── tone-compare.html             4 시안 한 화면 비교 랜딩
└── internal/notes/
    └── HANDOFF_TO_CODEX_2026-05-28.md   ← 이 문서
```

---

## 4. v3.1 canonical 핵심 시스템

### 4.1 9 컬러 모드 (`html[data-color]`)
| ID | hex (bg) | accent | mode | 비고 |
|---|---|---|---|---|
| **violet** ⭐ | `#130f26` | `#a78bfa` | dark | **default** (박사 픽 FINAL) |
| navy | `#202738` | `#ff4f00` | dark | Prev canonical (tone-c) |
| black | `#0a0a0a` | `#ff4f00` | dark | v3 initial |
| obsidian | `#121212` | `#ff6b6b` | dark | Gemini A |
| cyber | `#0b0f19` | `#3b82f6` | dark | Gemini B |
| emerald | `#0f1715` | `#34d399` | dark | Gemini E |
| light | `#ffffff` | `#6366f1` | light | light indigo (paper/ink 인버전 번들) |
| claude-warm | `#fbf9f6` | `#d97706` | light | Gemini C |
| nordic | `#fafafa` | `#0ea5e9` | light | Gemini D |

- `<head>` 인라인 script로 페인트 전 localStorage 복원 → FOUC 없음
- 우상 "+ Color" 라벨 → 우측 슬라이드 패널 (`localStorage 'dash-color'` 영속)
- light 모드는 `--ink/--paper/--gray-*` 전체 번들 인버전. `.proj-page[data-theme="light"]` 같은 alt 섹션이 다크 island로 보임 — by design.

### 4.2 SPA hash router
| route | 화면 |
|---|---|
| `#/` | Home (page hero + status summary + 7 카드 grid) |
| `#/p/{id}` | 단일 프로젝트 detail (풀블리드) |

- popstate / hashchange 처리, sidebar active sync, scroll-to-top
- 모바일 sidebar overlay 토글 자동 닫힘

### 4.3 World Clock (sidebar 좌하)
- **collapsed (default)**: KST 시간(초까지) + 날짜(YYYY-MM-DD (요일)) + UTC+9
- **`+ TIME ZONES` 토글** 클릭 시:
  - `.world-clock.is-open` class 토글 (HTML `[hidden]` 속성은 CSS specificity 충돌로 폐기)
  - `body.is-tz-open` 추가 → sidebar 280px → 480px 확장
  - 프로젝트 list + home link + label + director 모두 hide
  - main-area padding-left도 480px로 transition
- **26 행** — UTC 기준점(orange 박스) + LONDON(GMT/BST) + 음수 절대값 큰 것부터(-11 PAGO PAGO → -1 AZORES) + 양수 오름차순(+1 LAGOS → +12 AUCKLAND)
- 각 row: `[city + country/DST 메타]` `time(HH:MM)` `date(MM-DD)` `UTC offset`
- DST 자동 처리 (`Intl.DateTimeFormat shortOffset`). 정렬은 STD UTC offset 고정.
- `localStorage 'tz-open'` 영속

### 4.4 앰블럼 (인라인 SVG, 직접 그림)
- ship (컨테이너선) / trophy / orbit (토성+별) / music / landmark / building (office tower) / trending-up / anchor(보존, 미사용)
- 3 위치 노출: sidebar 22px / home card 40px / detail eyebrow 60~80px
- `currentColor` 사용 — 컬러 모드 변경 시 자동 적응

### 4.5 cache-bust 시스템
- `?v=20260528-XYZ` 패턴 — CSS/JS/data 3종 URL 모두
- 박사 브라우저 캐시 강제 갱신용 — 매 commit마다 갱신 권장
- 옛 v 값: emb → live → tz → kgs → ui2 → ui3 → ui4 → tz2 → kgsfix → **kgs2 (현재)**

---

## 5. 박사 7 프로젝트 현황 (PROJECTS 배열)

| # | id | name | status | progress | preview type |
|---|---|---|---|---|---|
| 1 | ais | AIS Ship Tracker | completed | 100 | embed (vercel.co.kr) |
| 2 | sports | DDUIM | in-progress | (박사 발화 대기) | embed |
| 3 | solar | Solar System | (확인) | (확인) | embed |
| 4 | inst | INST EXTRACTOR | completed | 100 | embed (previews/inst-extractor/) |
| 5 | korea-gov-sim | 2026 PRESIDENT KOREA | in-progress | 1 | **embed (previews/korea-gov-sim/) — 영구 fix 적용** |
| 6 | jpglobal-web | **Frontend & Tone Atelier** (재정의) | in-progress | 1 | embed (previews/jpglobal-web/) |
| 7 | us-kr-premarket | US-KR Premarket Signal (Codex 트랙) | in-progress | **30** | embed (previews/us-kr-premarket/) |

#6 컨셉 재정의: "JP GLOBAL Website Rebuild" → **"Frontend & Tone Atelier"** (박사 발화) — 박사가 다니는 자회사 아니라 외부 디자이너 입장에서 부산 거점 글로벌 해운 기업 JP GLOBAL 사이트를 test subject로 채택한 시범 워크숍.

---

## 6. ⚠️ 알려진 약점 / Codex가 cross-check해주면 좋은 항목

### 6.1 디자인·UX
- [ ] 9 컬러 모드 모두에서 **시각적 깨짐** 없는지 (특히 light 모드 3종 — `.proj-page[data-theme="light"]` 의 island 효과가 의도된 디자인인지 박사가 좋아하는지)
- [ ] light 모드에서 `sidebar-link.is-active` 배경이 `rgba(255,79,0,0.06)` orange 고정 → indigo/sky/amber 등 light 모드 accent와 안 어울림. CSS 변수화 권장 (`--accent-rgb` 컴패니언 변수)
- [ ] cursor-dot이 모든 컬러 모드에서 `var(--orange)` 사용 — 라이트 모드는 indigo가 자연스러움
- [ ] tz panel 26 row가 모바일에서 sidebar 92vw 점유 — 가독성 확인

### 6.2 데이터·기능
- [ ] `projects-data.js`의 STATUS/ITYPE 메타가 Tailwind 클래스 잔재 보존 중 — 실 렌더에 미사용. 박사 standing(데이터 보존)이라 의도 OK
- [ ] #3 solar / #2 sports의 progress 값이 적정한지 (박사 직접 발화로만 갱신 standing)
- [ ] preview iframe의 lazy loading은 적용됨. 첫 detail 진입 시 React/Three.js 큰 JS 로드 — 첫 paint 지연 가능

### 6.3 빌드·배포
- [ ] korea-gov-sim 새 dist의 JS 파일명 `index-yKRF8CqD.js`로 변경됨 (이전 `index-BXZSHRMn.js`). 박사 브라우저 자동 fresh fetch
- [ ] cache-bust query string은 dashboard 자체 자원 (`?v=...`)만 적용. iframe 안 자원은 별도 cache-bust 없음 — 파일명 hash로 처리
- [ ] GitHub Pages CDN 캐시는 평균 1~2분, 박사 polling 패턴이 작동 중

### 6.4 a11y
- [ ] SVG 앰블럼 `aria-hidden="true"` 적용됨
- [ ] 컬러 패널·sidebar·tz toggle 모두 `aria-expanded`/`aria-controls`/`aria-label`
- [ ] light 모드의 color contrast 검증 (WCAG AA) — 미점검

### 6.5 박사 미명시 잠재 누락
- [ ] `../sports-cv-tracking/` `../sports-match-tracker/` 형제 폴더 발견 — DDUIM #2와 관계 확인 필요 (별개 신규 프로젝트일 가능성)
- [ ] `../태양계프로젝트 - codex/` 폴더 — Codex 트랙의 solar 워크트리?

---

## 7. 외부 트랙 연결

| repo | 상태 | 이번 세션 영향 |
|---|---|---|
| korea-gov-sim (private) | src/utils/geo-loader.ts + src/vite-env.d.ts **이번 세션 영구 fix** | `718da47` commit. dist는 그대로지만 박사 본업 dev도 정상. 별도 핸드오프 영속화: `korea-gov-sim/internal/notes/HANDOFF_TO_CODEX_2026-05-28.md` |
| jpglobal-web (private) | 변경 없음 | dashboard/previews/jpglobal-web/은 v3 (Plus X 톤) 상태 그대로 |
| us-to-kr-premarket-impact-dashboard | Codex 트랙 — `f218f32` Add official macro data refresh 까지 받음 | dashboard/previews/us-kr-premarket/에 dist 통째 복사 (vite `--base=./` 임시 + sed 후처리 안 함 — base CLI flag로 충분) |

---

## 8. 박사 결정 영속 / standing rules (이번 세션 적용)

- ✅ 데이터 보존 — PROJECTS 직접 수정은 박사 발화로만 (#7 추가, #6 컨셉 재정의, 진행도 갱신 모두 박사 명시 후)
- ✅ G.M.PARK 표기 (Studio Haze 종속 제거)
- ✅ 박사 직접 발화로만 progress 갱신 (#7 1% → 30% 박사 발화)
- ✅ 깃허브 리포·이메일 표면 제거 (footer Links 칸 박사 발화로 삭제)
- ✅ 박사 발화 4건 단위로 일괄 처리 — task batch 패턴

---

## 9. Codex가 git pull 후 즉시 할 수 있는 검증

```bash
cd project-dashboard
git pull
# Pages 라이브 직접 확인:
open https://gmpark-creator.github.io/project-dashboard/claude/

# 또는 로컬 검증:
python -m http.server 5060 --bind 127.0.0.1
# → http://127.0.0.1:5060/claude/
```

검증 권장 순서:
1. **9 컬러 모드 순회** (우상 + Color → 9개 클릭) — 각각 시각 깨짐 / contrast / SVG 앰블럼 가독성 점검
2. **모바일 뷰** (DevTools 390px) — sidebar overlay, color panel, tz panel 동작
3. **7 프로젝트 detail 진입** — 각 preview iframe 로드 + View Live 작동
4. **#5 라이브** — `?variant=nano&lang=ko&v=kgs2` → 한반도 + 17 시도 + 북한·MDL + entity buildings 정상 렌더 (영구 fix 검증)
5. **TIME ZONES expand → sidebar 확장 / 26 row 정렬 / DST 자동 처리 / 날짜 column** — 박사 발화 만족 여부 객관 평가

---

## 10. 트랙 분리 / 박사 메모리 patterns

- 박사 standing: **"Claude/Codex 별개 트랙 — 두 트랙은 독립 산출물, 상대 병렬작업을 충돌로 보지 말 것"**
- dashboard는 **Claude 주력**. Codex는 이번 세션 직접 commit 없음 (#7 us-kr-premarket repo 본업만).
- Codex가 dashboard에 직접 contribute 원하면 `/codex/` 서브폴더 또는 별도 branch 패턴 권장.
- Cross-review 피드백은 이 문서 또는 `internal/notes/receipt-XXX.md` 패턴 (korea-gov-sim과 동일).

---

End of handoff.
