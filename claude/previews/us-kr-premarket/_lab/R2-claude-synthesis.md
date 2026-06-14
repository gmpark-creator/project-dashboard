# R2 — Claude Synthesis (正→反 수용): 설계 확정안

Codex R1(Antithesis + C2b 아이디어)을 정독하고 대부분 수용. 실측 베이크 결과를 반영해 설계를 확정한다.

## 실측 베이크 결과(data/build-derived.mjs 실행, 결정론·재현가능)
- **상관행렬(Pearson r)**: SOX↔SOXL 0.998 · SOXL↔SOXS −1.000(완전역) · SAMSUNG↔HYNIX 0.793 · IXIC↔GSPC 0.976 · **SOX↔SAMSUNG(같은날) 0.146 · SOX↔HYNIX(같은날) 0.249** (같은 날짜 기준 동행성 낮음).
- **미국→한국 전이(핵심 발견)**: 미국세션 D → 한국 **다음 거래일** 시가갭(lag1): SOX→삼성 r=0.836·slope 0.893·부호일치 0.778 / SOX→하이닉스 r=0.834·slope 0.906·0.778 / SOXL→삼성 r=0.822 / SOXL→하이닉스 r=0.824. **같은날(lag0)은 r≈0.02~0.06으로 무의미.** → "미국 반도체 세션의 영향은 *당일이 아니라 다음 한국 개장 시가*에 나타난다"는 관측. **단 n=9 소표본 — 예측 아님, 관측 기록.**
- **종목별 실현치**: 삼성 평균일중폭 6.9%/최대 10.0%, 하이닉스 7.4%/11.4% (6월 폭락기라 이례적 고변동). SOXL 평균|일변동| 12.0%, SOXS 12.2%. SOXL 시간외 vs 본장종가 평균 −1.6%(야간 페이드 경향), SOXS +1.4%.

## Codex R1 비평 처리(수용/수정/반려)
### C1 desk/
1. (수용) 미국 SOXL/SOXS는 H/L 부재 → **피벗/ATR은 KOSPI(삼성·하이닉스)만 활성**, 미국 ETF는 "고가/저가 미수록 → 피벗 비활성" 명시 + 본장 시/종가·실현변동성 프록시만.
2. (수용) 모든 상관·전이 카드에 **n·표본기간·"탐색용(exploratory)" 배지**, n<20이면 예측·순위화 금지.
3. (수용·수정) 포지션 사이저 → **"리스크 계산기"**로 개명. 진입가·손절가 **기본값 제공 금지**(전부 사용자 가정 입력). 입력값 기준 손실액·R배수·리스크기반 수량만 계산. "매매 지시 아님" 라벨.
4. (수용) TradingView 위젯은 **"외부 참고 차트, 계산 미사용"**으로 분리. 랜딩의 `LIVE FEED CONNECTED` 과장 문구 → 실제 범위에 맞게 수정.
5. (수용) C1에 **실행 품질 요약 + flip-replay 링크**만 두고 과밀화 금지.

### C2a signal-engine/ (Claude 아이디어)
1. (수용) 출력명 변경: **`상승형 조건 일치` / `하락형 조건 일치` / `혼합` / `데이터 부족`**. 진입·청산·매수매도 표현 전면 금지.
2. (수용) 기본 = **LEDGER 리플레이 모드**(과거 날짜 선택 → 그날 요인분해). 수동 입력 모드는 **"사용자 입력·검증 안 됨" 워터마크 강제**.
3. (수용) 유사 셋업 패널 = **유사 날짜와 그날 실제 결과(사실)만** 표시. 승률·확률·예상수익 표시 금지.
4. (수용·핵심) 점수 규칙을 **`data/rules.json`으로 외부화**. 각 요인의 수식·임계값·사용필드를 화면 노출. 임계값 = LEDGER 분위수 또는 명시적 고정값만.
5. (수용) **이벤트 게이트**(캘린더 기반 FOMC·MU실적 등 당일 촉매 → 점수 대신 "변동성 경고/근거 부족" 우선) + **SOXL/SOXS 역방향 sanity check**.

### C3 data/
1. (수용·핵심) 유니버스 **`measured`(LEDGER 실측 OHLC 보유: 삼성·하이닉스·SOXL·SOXS) vs `referenceOnly`(메타데이터만)** 분리. referenceOnly엔 ATR·상관·베타 **절대 부여 금지**(메타: 티커·역할·테마·tvSymbol만).
2. (수용) 캘린더 usImpact는 **`realized`(실측) / `marketImplied`(시장내재확률) / `modelScenario`(Opus·GPT 추정)** 3계층 분리, modelScenario 기본 접힘.
3. (수용) 상관·전이는 **n 강제 표시**, n<20이면 색강도↓ + "관측 표본 내 동행성"으로만 표기.
4. (수용) 각 이벤트에 **`asOf`·`status`·`staleAfter`**, 만료 예정이벤트 회색.
5. (수용) 플레이북 패턴은 **LEDGER 실제 날짜 예시와 연결**, 성과·승률 표현 금지.
6. (수용·핵심) **JSON 스키마 + bake script + 검증 테스트** 먼저. `source·asOf·computedFrom·sampleSize` 없는 항목은 **빌드 실패** 처리(`data/schema-validate.mjs`).

### C2b flip-replay/ (Codex 아이디어 — 채택)
- 슬러그 `flip-replay/`. 0%선 양전/음전 전환 리플레이로 **체결 난이도/휩쏘 복기**.
- 패널: 전환 타임라인 / 휩쏘 지수(총flip·본장·시간외·첫·마지막 전환·endState) / 실행난이도 라벨(`Clean trend`·`Opening reversal`·`Zero-line chop`·`Late reclaim/fade`) / 계획 스트레스 테스트(롱·숏 계획 입력 → 불리 전환 횟수·첫 불리 전환 시각) / 미·한 릴레이 비교(SOXL·SOXS 시간외 전환 ↔ 다음 한국장 삼성·하이닉스 전환).
- 데이터: `flips.crossings`(이미 LEDGER에 실측). 파생: gapPct·totalFlip·regFlip·extFlip·firstFlipDir·lastFlipDir·endState·closeDirectionMatch.
- 표현: "매수/매도" 금지 → "이 과거 장은 체결 난이도가 높/낮았다"로만.

## 확정 산출물 트리 (us-kr-premarket/ 하위)
```
data/
  build-derived.mjs            (작성·실행 완료)
  derived-stats.generated.js   (생성 완료, 실측 파생통계)
  core-data.js                 window.POLARIS_CORE — 유니버스(measured/referenceOnly)·플레이북·리스크규칙·용어집·반도체 촉매 레퍼런스
  rules.json                   시그널 엔진 규칙(외부화·투명)
  schema-validate.mjs          스키마·필수필드 검증(누락 시 실패)
  index.html                   데이터·지식 브라우저(레퍼런스 페이지)
desk/index.html  + desk.js     C1 단타 트레이딩 데스크
signal-engine/index.html + engine.js   C2a 시그널 엔진(rules.json 소비)
flip-replay/index.html + replay.js     C2b 전환 리플레이어
index.html(랜딩)               2섹션 그리드로 확장(실시간·기록 / 트레이딩 도구·데이터) + LIVE 문구 정정
```
공통 데이터 계약: 각 페이지가 `../market-ledger/data.js`(LEDGER) + `../data/core-data.js`(POLARIS_CORE) + `../data/derived-stats.generated.js`(POLARIS_DERIVED) [+ signal은 `../data/rules.json`] 로드. 시각 톤 = 기존 다크(#0B1120, Tailwind CDN, Pretendard, sky/violet/amber/emerald) 통일.

## Codex에게 R2 요청
위 확정안에 대해: (a) 남은 결함·과잉, (b) rules.json 요인/임계값 구체안(어떤 요인을 어떤 LEDGER 분위수/고정값으로), (c) flip-replay 난이도 라벨의 결정론적 분류규칙(어떤 flip 수/타이밍이면 어떤 라벨인지) 구체 제안, (d) 빌드 검증(schema-validate)이 반드시 잡아야 할 항목 목록.
