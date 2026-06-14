# R3 — Claude 최종 합성·설계 락 (변증법 3라운드 완료)

R1(Thesis+Antithesis)·R2(Synthesis+구체사양)을 거쳐 빌드 완료. R3는 빌드 결과 확정 + R2 대비 합성 개선점 기록 + Codex R3 검수(실제 산출물 read-only) 대상 정의.

## 빌드 산출물 (전부 us-kr-premarket/ 하위, 기존 자산 무수정)
- **data/** : build-derived.mjs(+quantiles) · derived-stats.generated.js · core-data.js(measured 4·referenceOnly 45·playbook 5·risk 5·glossary 10) · rules.json(투명 규칙·실측 분위수) · schema-validate.mjs(✅통과) · index.html+data-hub.js(지식 브라우저)
- **desk/** (C1) : 오버나잇 릴레이(lag1)·KOSPI 피벗/ATR·리스크 계산기(가정입력만)·섹터 히트맵·상관 스냅샷·라이브 차트(외부 표기)·flip-replay 링크
- **signal-engine/** (C2a, Claude) : LEDGER 리플레이 기본 + 수동(워터마크)·요인 분해(rules.json)·이벤트 게이트·SOXL/SOXS sanity·유사날짜(사실만)·사후복기(룩어헤드 차단)
- **flip-replay/** (C2b, Codex) : 전환 타임라인·휩쏘 지수·실행난이도 라벨·계획 스트레스·미·한 릴레이 비교
- **index.html(랜딩)** : 2섹션(실시간·기록 / 신규 도구·데이터), "LIVE FEED CONNECTED" 과장 → "RESEARCH ONLY · 외부 위젯" 정정

## R2 대비 합성 개선(클로드 판단)
1. **이벤트 게이트 정제(중요)**: Codex R2의 "최우선 OR 높음+core"는 6월(최우선16·높음28)에 전일 발화 → 무의미. 게다가 게이트 대상 다수가 `지수/수급` status=발생(그날 시장 움직임 *사후 묘사*)이라 pre-open 게이트에 쓰면 **그 자체가 룩어헤드**. → 게이트를 **예정 촉매(통화정책·물가·고용·실적) + 최우선**으로 좁히고 사후 묘사 카테고리 제외. 결과: 이벤트일(FOMC/CPI/NFP/AVGO/ORCL/MU) 방어 + 비이벤트일(6/9·6/12 등) 정상 요인 점수. 룩어헤드 결함 동시 제거.
2. **분위수 실측화**: Codex 제시 임계값(SOX p75=4.588 등)을 추정 신뢰하지 않고 build-derived.mjs로 **직접 계산해 교차검증**(거의 일치 확인) 후 rules.json에 computedFrom·sampleSize와 함께 박음.

## 검증 현황
- `node data/schema-validate.mjs` ✅ (룩어헤드·금지표현·게이트·weight 0~2·measured/referenceOnly 분리 전부 통과)
- `node _lab/_verify-logic.mjs` ✅ (NaN/크래시 0, 첫날 prior-US 없음 edge 처리, 라벨·점수 타당)

## Codex R3 검수 대상(read-only)
실제 산출물: data/rules.json, signal-engine/engine.js, flip-replay/replay.js, desk/desk.js, data/data-hub.js, index.html.
요청: (a) 가드레일/룩어헤드 잔존 결함, (b) 라벨·점수 알고리즘이 R2 사양과 불일치하는 곳, (c) 런타임/렌더 버그 가능성, (d) 영역분리(기존 자산 무수정) 위반.

## 검수 결과 반영(Codex R3 + 7에이전트 적대적 QA 워크플로 종합 → 수정 적용)
high 4·med 6·low 3 = 13건 처리:
- [high] **룩어헤드**: 헤드라인 점수를 **preOpen 요인 전용**으로, openKnown(시가갭) 요인은 **「개장 후 확인」 별도 패널**로 분리(engine.js decide(pre)+decOpen).
- [high] **랜딩 문구**: '승률·수익·의사결정 지원' → '시장 기록·조건 복기(연구·교육용)'.
- [high] **플레이북**: 명령형(손절/추종/관망/추격/사이즈축소) → 관찰 서술형 + data-hub 면책 배너.
- [med] **rules 외부화**: 6개 요인 임계값 전부 rules.json(factorById)에서 읽도록(하드코딩 제거, 단일 출처). levered_etf SOXS 임계 명시 필드 추가.
- [med] **이벤트 게이트**: 카테고리 화이트리스트∩블록리스트 유지(게이트는 점수 억제만·수치 미读 → 누출 0). status 하드조건은 과거데이터=발생이라 정당한 촉매까지 막아 **근거 있게 반려**. '통화/금리' dead 제거·'지표' 추가.
- [med] **flip 라벨 재정렬**: total===0만 즉시 Clean, 1회 개장반전을 Opening reversal로 포착(우선순위 chop→late→opening→clean) + flipClusterCount·종가정합 표시.
- [med] **flip 범례**: 후반 회복(sky)/후반 페이드(violet) 분리.
- [high] **flip 타임라인**: overflow-x-auto 래퍼(모바일 가로 잘림 해소).
- [med] **상관 색**: 등락색(rose/sky)과 충돌 않게 정상관 teal·역상관 violet + 캡션(desk·data-hub 통일).
- [med] **desk 리스크 계산기**: 방향 라벨·목표가 환산 제거(1R·위험금액·가정수량만, 매매지시성 차단).
- [med] **referenceOnly**: role을 title 툴팁→가시 텍스트(모바일 접근성).
- [low] sanity failValue 0.985→2.0(정상 고변동일 6/5 |SOXL+SOXS|=1.03 오판 방지, 부호역전만 fail). SOXL note '-3배'→'+3배'. 레버리지 위험 고지 랜딩+도구 4푸터 추가.
- 재검증: schema-validate ✅ · _verify-logic ✅(NaN/크래시 0, 헤드라인 preOpen 분리·라벨 재정렬 정상) · 전 JS node --check ✅ · rules.json parse ✅ · 가드레일 grep 0건.
