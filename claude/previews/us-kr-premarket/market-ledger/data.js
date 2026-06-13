/* Polaris Market Intelligence — Market Ledger 데이터
   가격: 실측(Yahoo Finance + Naver Finance 이중 교차검증). 추정·가공 없음.
   캘린더: 멀티에이전트 리서치 + 적대적 검증(verdict·출처 표기). dropped(환각) 제외.
   생성: 2026-06-13. */
window.LEDGER = {
  "asOf": "2026-06-13",
  "pricePeriod": "2026-06-01 ~ 2026-06-12",
  "calPeriod": "2026-06-01 ~ 2026-06-30",
  "sources": {
    "kospi": "Naver Finance siseJson.naver + Yahoo Finance chart API (이중 교차검증 — OHLC 완전 일치, 거래량 Naver 채택)",
    "us": "Yahoo Finance chart API — 정규장 일봉(본장) + 30분봉 시간외(pre/post) 세션 분류",
    "calendar": "멀티에이전트 웹리서치 6트랙 + 적대적 검증(독립 재확인) 후 중복 병합. 총 69건 (confirmed 62·date-corrected 3·downgraded 4). dropped(환각) 제외, 각 항목 1차 출처 링크 표기.",
    "impact": "지수 영향 레이어 — ① 발생(6/1~12) 이벤트엔 그날 5대 지수 '실측' 등락 부착(사실). ② 금리 확률은 CME FedWatch/선물 등 시장 내재확률 실측. ③ 시나리오별 지수 영향 %는 '모델 추정·범위'(6월 실측 베타로 보정한 예측 — 실측 아님, 투자자문 아님)."
  },
  "indices": {
    "names": {
      "IXIC": "나스닥종합",
      "GSPC": "S&P500",
      "DJI": "다우",
      "SOX": "필라델피아반도체",
      "RUT": "러셀2000"
    },
    "rows": {
      "IXIC": [
        {
          "date": "2026-06-01",
          "open": 26952.58,
          "close": 27086.81,
          "chgPct": 0.42
        },
        {
          "date": "2026-06-02",
          "open": 27030.07,
          "close": 27093.9,
          "chgPct": 0.03
        },
        {
          "date": "2026-06-03",
          "open": 27092.85,
          "close": 26853.98,
          "chgPct": -0.89
        },
        {
          "date": "2026-06-04",
          "open": 26579.3,
          "close": 26830.96,
          "chgPct": -0.09
        },
        {
          "date": "2026-06-05",
          "open": 26536.59,
          "close": 25709.43,
          "chgPct": -4.18
        },
        {
          "date": "2026-06-08",
          "open": 26065.07,
          "close": 25929.66,
          "chgPct": 0.86
        },
        {
          "date": "2026-06-09",
          "open": 26110.31,
          "close": 25678.82,
          "chgPct": -0.97
        },
        {
          "date": "2026-06-10",
          "open": 25512.07,
          "close": 25169.5,
          "chgPct": -1.98
        },
        {
          "date": "2026-06-11",
          "open": 25309.78,
          "close": 25809.66,
          "chgPct": 2.54
        },
        {
          "date": "2026-06-12",
          "open": 25783.36,
          "close": 25888.84,
          "chgPct": 0.31
        }
      ],
      "GSPC": [
        {
          "date": "2026-06-01",
          "open": 7582.29,
          "close": 7599.96,
          "chgPct": 0.26
        },
        {
          "date": "2026-06-02",
          "open": 7595.4,
          "close": 7609.78,
          "chgPct": 0.13
        },
        {
          "date": "2026-06-03",
          "open": 7605.31,
          "close": 7553.68,
          "chgPct": -0.74
        },
        {
          "date": "2026-06-04",
          "open": 7516.54,
          "close": 7584.31,
          "chgPct": 0.41
        },
        {
          "date": "2026-06-05",
          "open": 7537.36,
          "close": 7383.74,
          "chgPct": -2.64
        },
        {
          "date": "2026-06-08",
          "open": 7440.57,
          "close": 7405.73,
          "chgPct": 0.3
        },
        {
          "date": "2026-06-09",
          "open": 7438.66,
          "close": 7386.65,
          "chgPct": -0.26
        },
        {
          "date": "2026-06-10",
          "open": 7350.54,
          "close": 7266.99,
          "chgPct": -1.62
        },
        {
          "date": "2026-06-11",
          "open": 7287.67,
          "close": 7394.3,
          "chgPct": 1.75
        },
        {
          "date": "2026-06-12",
          "open": 7410.85,
          "close": 7431.46,
          "chgPct": 0.5
        }
      ],
      "DJI": [
        {
          "date": "2026-06-01",
          "open": 51161.1,
          "close": 51078.88,
          "chgPct": 0.09
        },
        {
          "date": "2026-06-02",
          "open": 50912.84,
          "close": 51307.79,
          "chgPct": 0.45
        },
        {
          "date": "2026-06-03",
          "open": 51220.92,
          "close": 50687.07,
          "chgPct": -1.21
        },
        {
          "date": "2026-06-04",
          "open": 50986.1,
          "close": 51561.93,
          "chgPct": 1.73
        },
        {
          "date": "2026-06-05",
          "open": 51610.02,
          "close": 50866.78,
          "chgPct": -1.35
        },
        {
          "date": "2026-06-08",
          "open": 50997.23,
          "close": 50786.01,
          "chgPct": -0.16
        },
        {
          "date": "2026-06-09",
          "open": 50814.42,
          "close": 50872.11,
          "chgPct": 0.17
        },
        {
          "date": "2026-06-10",
          "open": 50760.12,
          "close": 49918.78,
          "chgPct": -1.87
        },
        {
          "date": "2026-06-11",
          "open": 49972.07,
          "close": 50848.75,
          "chgPct": 1.86
        },
        {
          "date": "2026-06-12",
          "open": 51148.73,
          "close": 51202.26,
          "chgPct": 0.7
        }
      ],
      "SOX": [
        {
          "date": "2026-06-01",
          "open": 12706.62,
          "close": 12965.65,
          "chgPct": 1.06
        },
        {
          "date": "2026-06-02",
          "open": 13242.7,
          "close": 13726.27,
          "chgPct": 5.87
        },
        {
          "date": "2026-06-03",
          "open": 13971.15,
          "close": 13916.96,
          "chgPct": 1.39
        },
        {
          "date": "2026-06-04",
          "open": 13243.66,
          "close": 13617.5,
          "chgPct": -2.15
        },
        {
          "date": "2026-06-05",
          "open": 13062.55,
          "close": 12220.76,
          "chgPct": -10.26
        },
        {
          "date": "2026-06-08",
          "open": 12838.88,
          "close": 12906.69,
          "chgPct": 5.61
        },
        {
          "date": "2026-06-09",
          "open": 13142.99,
          "close": 12657.81,
          "chgPct": -1.93
        },
        {
          "date": "2026-06-10",
          "open": 12501.84,
          "close": 12206.46,
          "chgPct": -3.57
        },
        {
          "date": "2026-06-11",
          "open": 12506.65,
          "close": 13171.44,
          "chgPct": 7.91
        },
        {
          "date": "2026-06-12",
          "open": 13053.93,
          "close": 13371.47,
          "chgPct": 1.52
        }
      ],
      "RUT": [
        {
          "date": "2026-06-01",
          "open": 2899.09,
          "close": 2905.76,
          "chgPct": -0.47
        },
        {
          "date": "2026-06-02",
          "open": 2900.95,
          "close": 2931.96,
          "chgPct": 0.9
        },
        {
          "date": "2026-06-03",
          "open": 2921.24,
          "close": 2893.51,
          "chgPct": -1.31
        },
        {
          "date": "2026-06-04",
          "open": 2895.0,
          "close": 2935.33,
          "chgPct": 1.45
        },
        {
          "date": "2026-06-05",
          "open": 2914.03,
          "close": 2833.5,
          "chgPct": -3.47
        },
        {
          "date": "2026-06-08",
          "open": 2862.76,
          "close": 2855.42,
          "chgPct": 0.77
        },
        {
          "date": "2026-06-09",
          "open": 2879.48,
          "close": 2867.02,
          "chgPct": 0.41
        },
        {
          "date": "2026-06-10",
          "open": 2861.93,
          "close": 2835.46,
          "chgPct": -1.1
        },
        {
          "date": "2026-06-11",
          "open": 2854.23,
          "close": 2921.03,
          "chgPct": 3.02
        },
        {
          "date": "2026-06-12",
          "open": 2930.82,
          "close": 2943.99,
          "chgPct": 0.79
        }
      ]
    }
  },
  "ratePath": {
    "june": {
      "hold": 97.1,
      "cut": 2.9,
      "hike": 0
    },
    "july": {
      "hold": 88.8,
      "cut": 2.6,
      "hike": 8.6
    },
    "sept": {
      "hold": 71.6,
      "cut": 2.1,
      "hike": 26.3
    },
    "asOf": "2026-06-13",
    "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도.",
    "cuts2026": "2026년 인하 0회 76.8%·1회 16%·2회 3.7% (Polymarket, 2026-06-13). 25bp 1회조차 base case 아님.",
    "currentRange": "3.50~3.75%",
    "fedPath": [
      {
        "meeting": "2026-06-17",
        "hold": 97.1,
        "cut": 2.9,
        "hike": 0
      },
      {
        "meeting": "2026-07-29",
        "hold": 88.8,
        "cut": 2.6,
        "hike": 8.6
      },
      {
        "meeting": "2026-09-16",
        "hold": 71.6,
        "cut": 2.1,
        "hike": 26.3
      }
    ],
    "fedStance": "신임 의장 Kevin Warsh(5/13 상원 인준 54-45, 5/22 취임)는 구조적으로는 비둘기적 성향 — AI를 '구조적 디스인플레이션 요인(structurally disinflationary)', '우리 생애 최대 생산성 향상 물결'로 보고 금리를 낮게 유지할 여지가 있다고 보며, 현재 물가급등은 이란 전쟁 종식과 함께 사라질 '일시적(temporary)'이라는 트럼프 행정부 입장에 동조. 그러나 5월 CPI +4.2%·PPI +6.5% 충격과 국채금리 급등으로 인하를 밀어붙이기 어려운 환경에 직면 — 6월 16-17일 FOMC가 그의 첫 회의이며 시장은 동결(약 86~96%) 및 점도표 상향(완화→중립/긴축 편향) 가능성을 본다(주: 이 FOMC는 6/13 현재 아직 개최 전). 지역 연준 인사들은 뚜렷한 매파: 댈러스 연준 Lorie Logan(2026 투표권)은 6/3 엘파소 연설에서 '올해 후반 더 높은 금리가 필요할 수 있다는 우려가 커진다', 인플레이션이 2% 복귀에 '너무 오래 걸린다', '현 통화정책이 경제를 제약하지 못하고 있다'며 인상 가능성을 공개 시사. 종합하면 비둘기 성향 신임 의장 vs 매파적 FOMC라는 '집안싸움(family fight)' 구도로, 시장 컨센서스는 2026년 인하 소멸·연말 인상 리스크 부각.",
    "shifts": [
      {
        "trigger": "5월 고용보고서(NFP +17.2만) — 컨센서스 약 8.5만의 두 배, 실업률 4.3% 유지, 3·4월 상향 수정(3월 +21.4만, 4월 +17.9만). 노동시장이 예상보다 견조해 '인하를 서두를 이유 없음' 인식 강화.",
        "effect": "연초 2026년에 최소 1회 인하를 가격에 반영하던 시장이 인하 기대를 후퇴시키기 시작. 강한 고용+물가 재가열 조합으로 '인하→동결, 일부는 인상' 논의로 전환의 첫 신호.",
        "date": "2026-06-05"
      },
      {
        "trigger": "5월 CPI +4.2% YoY(+0.5% MoM) — 2023년 4월 이후 최고치, 4월 +3.8%에서 가속. 에너지 +3.9% MoM(전체 상승의 60%+), 휘발유 +40.5% YoY. 단 코어 CPI는 +2.9% YoY / +0.2% MoM로 예상(0.3%)보다 소폭 둔화. 이란 전쟁발 에너지 충격이 주범.",
        "effect": "CME FedWatch 기준 2026년 전체 인하 베팅이 사실상 소멸('no rate cuts at all in 2026'). 헤드라인 충격으로 '인하 기대 증발', 오히려 인상이 가을 들어 더 유력하다는 평가 등장. 다만 코어가 예상보다 차가워 일부 9월 인하 기대는 잔존(혼조).",
        "date": "2026-06-10"
      },
      {
        "trigger": "5월 PPI +1.1% MoM(+6.5% YoY) — 예상 +0.7%를 크게 상회, 2022년 이후 최대 도매물가 급등. 최종재 상품 +2.8%(2009년 집계 이래 최대), 상품 상승의 80%가 에너지(+10.7%, 도매 휘발유 +23.4%). 단 코어 PPI +0.4%는 컨센서스 +0.5%보다 소폭 낮음.",
        "effect": "PPI 헤드라인 쇼크로 2026년 인하 베팅은 완전히 소멸, 인상 베팅 상승. 연말까지 최소 1회 인상 확률 50% 상회, 12월 0.25%p 인상 확률 약 43%로 부상. 코어 PPI가 소폭 낮게 나와 일부 위험자산 반등은 있었으나 인하 경로는 사실상 가격에서 제거.",
        "date": "2026-06-11"
      },
      {
        "trigger": "4월 PCE(연준 선호지표) — 헤드라인 +3.8% YoY(3월 3.5%에서 가속, 2023년 5월 이후 최고), 코어 +3.3% YoY(3월 3.2%에서 상승, 2023년 말 이후 최고). 월간은 코어 +0.2%로 예상(0.3%)보다 소폭 연화. 6월 지표 시즌 직전의 배경 데이터.",
        "effect": "연준 선호 물가지표가 2%에서 점점 멀어지며 '인하 명분 약화'의 토대 제공. 5월 CPI·PPI 쇼크와 결합돼 6월 16-17일 FOMC(워시 첫 회의) 동결(약 86~96% 반영) 및 '완화 편향 → 중립/긴축 편향' 전환 가능성을 시장이 선반영.",
        "date": "2026-05-30"
      }
    ],
    "consensus": [
      {
        "release": "May Retail Sales (advance, MoM headline)",
        "date": "2026-06-17",
        "expected": "+0.6% MoM (ex-autos prior +0.7% MoM)",
        "prior": "+0.5% MoM (April 2026)"
      },
      {
        "release": "May Housing Starts (SAAR)",
        "date": "2026-06-16",
        "expected": "~1.44 million units (SAAR)",
        "prior": "1.465 million units (April 2026; building permits 1.423M)"
      },
      {
        "release": "Initial Jobless Claims (week ending June 13)",
        "date": "2026-06-18",
        "expected": "226,000",
        "prior": "229,000 (prior week, 3-month high; continuing claims 1.795M)"
      },
      {
        "release": "Q1 2026 GDP (third/final estimate, annualized QoQ)",
        "date": "2026-06-25",
        "expected": "+1.6% (unrevised)",
        "prior": "+1.6% (second estimate, revised down from 2.0% advance)"
      },
      {
        "release": "May Core PCE Price Index",
        "date": "2026-06-25",
        "expected": "+0.2% MoM (YoY ~3.3%)",
        "prior": "+0.2% MoM / +3.3% YoY (April 2026)"
      },
      {
        "release": "May Headline PCE Price Index / Personal Income & Outlays",
        "date": "2026-06-25",
        "expected": "MoM consensus not yet firmly published (April was +3.8% YoY)",
        "prior": "+3.8% YoY (April 2026, released May 28)"
      },
      {
        "release": "Initial Jobless Claims (week ending June 20)",
        "date": "2026-06-25",
        "expected": "consensus not yet published as of June 13 (prior-week run-rate ~226-229k)",
        "prior": "to be set by June 18 print (prior 229,000)"
      },
      {
        "release": "June Michigan Consumer Sentiment (final)",
        "date": "2026-06-26",
        "expected": "~48.9 (in line with preliminary; final-vs-prelim consensus not separately published)",
        "prior": "48.9 (June preliminary; May final 44.8 record low)"
      }
    ],
    "semisOutlook": "2026년 6월 미국 반도체(SOX) 방향성 촉매는 \"AI capex 서사의 임계점 시험\"으로 요약된다. 6월 초 브로드컴(AVGO)이 6/3 실적에서 AI 반도체 매출 호조(Q2 약 108억달러)에도 불구하고 차기 분기 AI 칩 가이던스 160억달러가 시장 기대치(약 172억달러)를 밑돌고 연간 전망을 상향하지 않자, \"퍼펙트한 성장 영속\"을 가격에 반영해온 시장이 이를 천장(ceiling)으로 해석하며 6/5 SOX가 장중 최대 6.3% 급락(종가 약 -2%) 후 반등했고 브로드컴은 약 13% 폭락했다(2025년 초 이후 최대). 뒤이은 6/10 오라클 실적(예상 EPS 1.96달러, 매출 약 191억달러)은 데이터센터 capex·AI 인프라 수요의 지속 여부를 가늠하는 시험대로 투자심리를 좌우했다. 다음 핵심 촉매는 6/24 장 마감 후 마이크론(MU) 실적으로, 옵션 시장은 IV 랭크 100%·실적 후 약 9.6~16%의 큰 변동을 내재 반영해 메모리(HBM) 업황과 SOX 전반의 방향성을 결정할 분기점으로 평가된다. 상방 리스크는 엔비디아·하이퍼스케일러의 2026년 capex 약 6,850억~7,500억달러 약속과 AI 메모리 공급 부족에 따른 가격 급등이고, 하방 리스크는 SOX가 3월말 이후 거의 2배(12개월 +50% 이상) 오른 과매수 상태에서 \"가이던스 미상향=성장 정체 시그널\"로 읽히는 심리적 취약성과 메모리 수요의 AI 의존도 집중이다.\n\n출처 URL:\n- https://www.cnbc.com/2026/06/03/broadcom-avgo-earnings-report-q2-2026.html\n- https://finance.yahoo.com/markets/stocks/articles/chip-selloff-hits-sox-broadcoms-100511793.html\n- https://www.heygotrade.com/en/news/weekly-economic-outlook-2026-06-08/\n- https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial\n- https://www.barchart.com/stocks/quotes/MU/expected-move\n- https://unusualwhales.com/stock/MU/volatility\n- https://intellectia.ai/blog/semiconductor-stocks-selloff-june-2026\n- https://www.cnbc.com/ (Broadcom 6/3 1차 출처는 HTTP 403로 본문 직접확인 불가, 동일 내용은 Yahoo·heygotrade·Broadcom IR로 교차검증)\n\n검증 메모: 브로드컴 수치(Q2 AI 매출 ~108억달러, 차기 가이던스 160억달러 vs 추정 172억달러, 연간 미상향)와 SOX/AVGO 낙폭(-6.3%/장중, AVGO -13%)은 Yahoo·heygotrade 본문으로 직접 확인. 마이크론 6/24 AMC 실적·IV 100%·내재 변동폭은 Barchart/UnusualWhales로 확인. CNBC 6/3 1차 기사는 403으로 본문 미확인이라 보조출처로만 표기.",
    "sources": [
      "https://www.investing.com/central-banks/fed-rate-monitor",
      "https://growbeansprout.com/tools/fedwatch",
      "https://centralbank.watch/federal-reserve/",
      "https://polymarket.com/event/how-many-fed-rate-cuts-in-2026",
      "https://polymarket.com/event/fed-decision-in-june-825",
      "https://polymarket.com/event/fed-rate-hike-in-2026"
    ]
  },
  "betas": {
    "나스닥종합": 1.5,
    "S&P500": 1.0,
    "다우": 0.75,
    "필라델피아반도체": 2.8,
    "러셀2000": 1.1
  },
  "kospi": {
    "samsung": [
      {
        "date": "2026-06-01",
        "open": 319500,
        "high": 354500,
        "low": 319500,
        "close": 349000,
        "volume": 45052488,
        "chgPct": 10.09
      },
      {
        "date": "2026-06-02",
        "open": 360500,
        "high": 370000,
        "low": 342000,
        "close": 360500,
        "volume": 44720282,
        "chgPct": 3.3
      },
      {
        "date": "2026-06-04",
        "open": 349000,
        "high": 366000,
        "low": 348000,
        "close": 351500,
        "volume": 34771037,
        "chgPct": -2.5
      },
      {
        "date": "2026-06-05",
        "open": 333500,
        "high": 343000,
        "low": 325000,
        "close": 329000,
        "volume": 33725012,
        "chgPct": -6.4
      },
      {
        "date": "2026-06-08",
        "open": 293000,
        "high": 315500,
        "low": 292500,
        "close": 295500,
        "volume": 38929682,
        "chgPct": -10.18
      },
      {
        "date": "2026-06-09",
        "open": 310000,
        "high": 324000,
        "low": 300000,
        "close": 322000,
        "volume": 30124249,
        "chgPct": 8.97
      },
      {
        "date": "2026-06-10",
        "open": 311000,
        "high": 314500,
        "low": 295250,
        "close": 302500,
        "volume": 27050362,
        "chgPct": -6.06
      },
      {
        "date": "2026-06-11",
        "open": 290500,
        "high": 306500,
        "low": 287500,
        "close": 299000,
        "volume": 31420307,
        "chgPct": -1.16
      },
      {
        "date": "2026-06-12",
        "open": 326000,
        "high": 339000,
        "low": 320000,
        "close": 322500,
        "volume": 30721836,
        "chgPct": 7.86
      }
    ],
    "hynix": [
      {
        "date": "2026-06-01",
        "open": 2299000,
        "high": 2398000,
        "low": 2296000,
        "close": 2363000,
        "volume": 5602897,
        "chgPct": 1.29
      },
      {
        "date": "2026-06-02",
        "open": 2376000,
        "high": 2407000,
        "low": 2259000,
        "close": 2360000,
        "volume": 5837216,
        "chgPct": -0.13
      },
      {
        "date": "2026-06-04",
        "open": 2284000,
        "high": 2327000,
        "low": 2262000,
        "close": 2298000,
        "volume": 3941067,
        "chgPct": -2.63
      },
      {
        "date": "2026-06-05",
        "open": 2142000,
        "high": 2188000,
        "low": 2070000,
        "close": 2070000,
        "volume": 5778751,
        "chgPct": -9.92
      },
      {
        "date": "2026-06-08",
        "open": 1856000,
        "high": 2072000,
        "low": 1855000,
        "close": 1911000,
        "volume": 6610833,
        "chgPct": -7.68
      },
      {
        "date": "2026-06-09",
        "open": 2050000,
        "high": 2226000,
        "low": 1998000,
        "close": 2215000,
        "volume": 5878039,
        "chgPct": 15.91
      },
      {
        "date": "2026-06-10",
        "open": 2137000,
        "high": 2180000,
        "low": 1992000,
        "close": 2048000,
        "volume": 4928269,
        "chgPct": -7.54
      },
      {
        "date": "2026-06-11",
        "open": 1975000,
        "high": 2163000,
        "low": 1960000,
        "close": 2101000,
        "volume": 6625775,
        "chgPct": 2.59
      },
      {
        "date": "2026-06-12",
        "open": 2281000,
        "high": 2304000,
        "low": 2150000,
        "close": 2150000,
        "volume": 4864614,
        "chgPct": 2.33
      }
    ]
  },
  "us": {
    "soxl": [
      {
        "date": "2026-06-01",
        "regOpen": 217.27,
        "regClose": 227.03,
        "regChgPct": 1.2,
        "extOpen": 229.5,
        "extClose": 225.76,
        "extVsRegPct": -0.56,
        "extChgPct": null,
        "vol": 37499600
      },
      {
        "date": "2026-06-02",
        "regOpen": 243.18,
        "regClose": 266.32,
        "regChgPct": 17.31,
        "extOpen": 231.59,
        "extClose": 270.69,
        "extVsRegPct": 1.64,
        "extChgPct": 19.9,
        "vol": 42799700
      },
      {
        "date": "2026-06-03",
        "regOpen": 281.47,
        "regClose": 280.54,
        "regChgPct": 5.34,
        "extOpen": 276.0,
        "extClose": 261.55,
        "extVsRegPct": -6.77,
        "extChgPct": -3.38,
        "vol": 49817200
      },
      {
        "date": "2026-06-04",
        "regOpen": 242.04,
        "regClose": 262.7,
        "regChgPct": -6.36,
        "extOpen": 266.3,
        "extClose": 248.099,
        "extVsRegPct": -5.56,
        "extChgPct": -5.14,
        "vol": 59036000
      },
      {
        "date": "2026-06-05",
        "regOpen": 230.85,
        "regClose": 182.54,
        "regChgPct": -30.51,
        "extOpen": 242.08,
        "extClose": 176.98,
        "extVsRegPct": -3.05,
        "extChgPct": -28.67,
        "vol": 108280300
      },
      {
        "date": "2026-06-08",
        "regOpen": 210.62,
        "regClose": 211.44,
        "regChgPct": 15.83,
        "extOpen": 194.62,
        "extClose": 211.3,
        "extVsRegPct": -0.07,
        "extChgPct": 19.39,
        "vol": 68180500
      },
      {
        "date": "2026-06-09",
        "regOpen": 227.06,
        "regClose": 201.68,
        "regChgPct": -4.62,
        "extOpen": 221.9,
        "extClose": 198.81,
        "extVsRegPct": -1.42,
        "extChgPct": -5.91,
        "vol": 124754300
      },
      {
        "date": "2026-06-10",
        "regOpen": 191.54,
        "regClose": 180.65,
        "regChgPct": -10.43,
        "extOpen": 193.09,
        "extClose": 172.916,
        "extVsRegPct": -4.28,
        "extChgPct": -13.02,
        "vol": 94924200
      },
      {
        "date": "2026-06-11",
        "regOpen": 192.3,
        "regClose": 223.99,
        "regChgPct": 23.99,
        "extOpen": 191.4,
        "extClose": 228.8,
        "extVsRegPct": 2.15,
        "extChgPct": 32.32,
        "vol": 72493400
      },
      {
        "date": "2026-06-12",
        "regOpen": 222.22,
        "regClose": 234.68,
        "regChgPct": 4.77,
        "extOpen": 218.62,
        "extClose": 239.29,
        "extVsRegPct": 1.96,
        "extChgPct": 4.58,
        "vol": 50036700
      }
    ],
    "soxs": [
      {
        "date": "2026-06-01",
        "regOpen": 6.55,
        "regClose": 6.26,
        "regChgPct": -1.11,
        "extOpen": 6.19,
        "extClose": 6.28,
        "extVsRegPct": 0.32,
        "extChgPct": null,
        "vol": 330691100
      },
      {
        "date": "2026-06-02",
        "regOpen": 5.8,
        "regClose": 5.17,
        "regChgPct": -17.41,
        "extOpen": 6.13,
        "extClose": 5.099,
        "extVsRegPct": -1.37,
        "extChgPct": -18.81,
        "vol": 480500000
      },
      {
        "date": "2026-06-03",
        "regOpen": 4.88,
        "regClose": 4.91,
        "regChgPct": -5.03,
        "extOpen": 5.02,
        "extClose": 5.239,
        "extVsRegPct": 6.7,
        "extChgPct": 2.75,
        "vol": 634419400
      },
      {
        "date": "2026-06-04",
        "regOpen": 5.57,
        "regClose": 5.2,
        "regChgPct": 5.91,
        "extOpen": 5.15,
        "extClose": 5.52,
        "extVsRegPct": 6.15,
        "extChgPct": 5.36,
        "vol": 665759500
      },
      {
        "date": "2026-06-05",
        "regOpen": 5.86,
        "regClose": 6.84,
        "regChgPct": 31.54,
        "extOpen": 5.63,
        "extClose": 6.955,
        "extVsRegPct": 1.68,
        "extChgPct": 26.0,
        "vol": 972691500
      },
      {
        "date": "2026-06-08",
        "regOpen": 5.71,
        "regClose": 5.69,
        "regChgPct": -16.81,
        "extOpen": 6.31,
        "extClose": 5.67,
        "extVsRegPct": -0.35,
        "extChgPct": -18.48,
        "vol": 805658000
      },
      {
        "date": "2026-06-09",
        "regOpen": 5.25,
        "regClose": 5.93,
        "regChgPct": 4.22,
        "extOpen": 5.42,
        "extClose": 6.03,
        "extVsRegPct": 1.69,
        "extChgPct": 6.35,
        "vol": 1388857300
      },
      {
        "date": "2026-06-10",
        "regOpen": 6.24,
        "regClose": 6.57,
        "regChgPct": 10.79,
        "extOpen": 6.14,
        "extClose": 6.83,
        "extVsRegPct": 3.96,
        "extChgPct": 13.27,
        "vol": 1208896300
      },
      {
        "date": "2026-06-11",
        "regOpen": 6.1,
        "regClose": 4.97,
        "regChgPct": -24.35,
        "extOpen": 6.14,
        "extClose": 4.835,
        "extVsRegPct": -2.72,
        "extChgPct": -29.21,
        "vol": 910108000
      },
      {
        "date": "2026-06-12",
        "regOpen": 5.01,
        "regClose": 4.72,
        "regChgPct": -5.03,
        "extOpen": 5.04,
        "extClose": 4.612,
        "extVsRegPct": -2.29,
        "extChgPct": -4.61,
        "vol": 631116200
      }
    ]
  },
  "calendar": [
    {
      "date": "2026-06-01",
      "region": "GLOBAL",
      "category": "지정학",
      "title": "2026 이란전쟁 휴전 지속 + 호르무즈 해협 통항 사실상 마비 (6월 거시 최대 변수)",
      "detail": "2/28 미국·이스라엘의 對이란 공습으로 시작된 '2026 이란전쟁'은 5주여 교전 후 4/7~8 휴전(이스라엘 포함) 발효. 그러나 6월 들어서도 호르무즈 해협 통항은 사실상 마비 — 휴전 후에도 해상 교통량이 위기 전 대비 약 95% 급감한 상태 지속, 주요 선사 통항 중단·P&I 보험 취소가 배경. 전세계 원유·LNG의 약 20%가 지나는 길목 마비가 6월 초까지 유가 고공행진(공습 이후 한때 20%+ 급등)의 근본 배경. 단, 휴전은 '조건부'로 협상 타결 시까지 연장된 상태였음. (원본 휴전 발효일 4/8은 미·이란 합의 4/7~8과 정합)",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis",
        "https://www.newsonair.gov.in/maritime-traffic-through-strait-of-hormuz-remains-restricted-despite-two-week-ceasefire-between-tehran-washington",
        "https://www.britannica.com/event/2026-Iran-war"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.42,
          "S&P500": 0.26,
          "다우": 0.09,
          "필라델피아반도체": 1.06,
          "러셀2000": -0.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "지정학/유가",
          "basis": "지정학·유가 리스크 방향에 따른 위험선호 변화(모델 추정).",
          "branches": [
            {
              "name": "리스크-온 — 긴장완화·유가↓",
              "indices": {
                "나스닥종합": "+0.6~+2.1%",
                "S&P500": "+0.4~+1.4%",
                "다우": "+0.3~+1.0%",
                "필라델피아반도체": "+1.1~+3.9%",
                "러셀2000": "+0.6~+2.0%"
              },
              "occurred": false
            },
            {
              "name": "중립",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "리스크-오프 — 긴장고조·유가↑",
              "indices": {
                "나스닥종합": "-2.2~-0.8%",
                "S&P500": "-1.5~-0.5%",
                "다우": "-1.1~-0.4%",
                "필라델피아반도체": "-4.2~-1.4%",
                "러셀2000": "-1.5~-0.5%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-01",
      "region": "US",
      "category": "이벤트",
      "title": "NVIDIA GTC Taipei 2026 키노트 (젠슨 황) / Computex 직전",
      "detail": "젠슨 황 CEO가 6/1 오전 11시(타이베이) GTC Taipei 키노트. '에이전트 AI(agentic AI) 시대 도래' 선언. Vera Rubin AI 컴퓨팅 플랫폼·Vera CPU 풀생산 진입, RTX Spark AI PC 칩, Nemotron 3 Ultra 등 발표. Computex 2026(6/2~6/5) 하루 전. 발언 직후 대만 가권지수 1,000p+ 급등·45,600 돌파 사상최고.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://blogs.nvidia.com/blog/nvidia-gtc-taipei-computex-2026-news/",
        "https://siliconangle.com/2026/06/01/five-thoughts-nvidia-ceo-jensen-huangs-gtc-taipei-2026-keynote/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.42,
          "S&P500": 0.26,
          "다우": 0.09,
          "필라델피아반도체": 1.06,
          "러셀2000": -0.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-01",
      "region": "KR",
      "category": "물가",
      "title": "5월 수출입동향 (산업통상부) - 수출 877.5억달러, 역대 5월 최대",
      "detail": "5월 수출 877.5억달러로 전년比 +53.2%(3개월 연속 800억달러 상회), 수입 608억달러(+20.8%), 무역수지 +269.5억달러 흑자. 일평균 수출 사상 첫 40억달러 돌파(42.8억달러, +60.7%). 반도체 수출 +169.4% 등 반도체 호조가 견인. 역대 5월 최대 실적.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.mt.co.kr/economy/2026/06/01/2026060108534570515",
        "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156764737"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.42,
          "S&P500": 0.26,
          "다우": 0.09,
          "필라델피아반도체": 1.06,
          "러셀2000": -0.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-01",
      "region": "KR",
      "category": "지수",
      "title": "코스피 사상 첫 8,800선·시총 7,000조 돌파, 삼성전자 시총 2,000조 첫 돌파",
      "detail": "코스피가 장중 8,800선을 첫 돌파하며 사상 최고치 경신, 유가증권 시총 사상 첫 7,000조원 돌파. 삼성전자 시총이 약 2,028조원으로 국내 첫 시총 2,000조 기업 등극(원본 2,040조는 근사치). 5월 반도체 수출 전년比 +169.4% 급증, 젠슨 황 엔비디아 CEO 방한 기대가 동력. 매수 사이드카 발동.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.hankyung.com/article/2026060104716",
        "https://www.seoul.co.kr/news/economy/securities/2026/06/01/20260601500289",
        "https://imnews.imbc.com/replay/2026/nw1400/article/6826759_36974.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.42,
          "S&P500": 0.26,
          "다우": 0.09,
          "필라델피아반도체": 1.06,
          "러셀2000": -0.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-01",
      "region": "US",
      "category": "물가",
      "title": "5월 ISM 제조업 PMI",
      "detail": "5월 ISM 제조업 PMI 54.0%(4월 52.7%에서 +1.3%p), 2022년 5월(55.9%) 이후 최고. 제조업 5개월 연속 확장, 전체경제 19개월 연속 확장. 신규주문 56.8%.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.prnewswire.com/news-releases/manufacturing-pmi-at-54-may-2026-ism-manufacturing-pmi-report-302786165.html",
        "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.42,
          "S&P500": 0.26,
          "다우": 0.09,
          "필라델피아반도체": 1.06,
          "러셀2000": -0.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": true
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-01",
      "region": "US",
      "category": "지수",
      "title": "S&P500 6월 첫 거래일 사상 최고치 마감, 엔비디아 PC칩(N1X) 발표로 기술주 강세",
      "detail": "S&P500 +0.26% 7,599.96로 사상 최고 마감(3대 지수 신고가). 엔비디아가 Computex 키노트에서 첫 Arm 기반 윈도우 PC칩 N1X(Blackwell GPU+MediaTek CPU) 공개, 주가 +6%대 급등하며 기술주 랠리 견인(Arm +14.5%, 인텔 -4%대). [검증] CNBC로 7,599.96·N1X 확인. 원문은 'N1/N1X'로 표기했으나 키노트 공개칩은 N1X로 확인됨.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/05/31/stock-market-today-live-updates.html",
        "https://www.gurufocus.com/news/8896294/nvidia-nvda-enters-pc-market-with-new-chip-stock-surges-over-6"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.42,
          "S&P500": 0.26,
          "다우": 0.09,
          "필라델피아반도체": 1.06,
          "러셀2000": -0.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-02",
      "region": "KR",
      "category": "물가",
      "title": "5월 소비자물가(CPI) +3.1% (통계청) - 26개월만 최고",
      "detail": "5월 CPI 전년比 +3.1%로 2024년 3월 이후 26개월(약 2년 2개월)만 최고, 시장예상(3.0%) 상회. 4월(2.6%)보다 0.5%p 급등. 중동 긴장發 국제유가 상승이 주도, 식료품물가는 3개월來 최대폭(+1.6%). 근원·생활물가도 상승. (석유류 세부수치는 원본 출처 기준)",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://ko.tradingeconomics.com/south-korea/inflation-cpi",
        "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156764864"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.03,
          "S&P500": 0.13,
          "다우": 0.45,
          "필라델피아반도체": 5.87,
          "러셀2000": 0.9
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-02",
      "region": "GLOBAL",
      "category": "이벤트",
      "title": "Computex 2026 개막 (타이베이, 6/2~6/5)",
      "detail": "세계 최대 ICT 전시회 Computex 2026이 6/2~6/5 타이베이(난강 1·2관+TWTC 1관+TICC) 개최. NVIDIA GTC Taipei와 연계, AI/반도체 신제품 다수 공개. 공식 일정(6/2~6/5) 확인.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.computextaipei.com.tw/en/menu/A546BFC6C2E2ED34D0636733C6861689/info.html",
        "https://www.nvidia.com/en-tw/gtc/taipei/computex/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.03,
          "S&P500": 0.13,
          "다우": 0.45,
          "필라델피아반도체": 5.87,
          "러셀2000": 0.9
        },
        "realizedNA": null,
        "scenario": {
          "kind": "글로벌 이벤트",
          "noDirectional": true,
          "basis": "글로벌 정상회의·정책 이벤트 — 통상·지정학 헤드라인에 따라 위험선호가 단발성으로 움직일 수 있으나 방향은 사전 예측 곤란."
        }
      }
    },
    {
      "date": "2026-06-02",
      "region": "US",
      "category": "고용",
      "title": "4월 JOLTS 구인건수",
      "detail": "4월 구인건수 760만 건(7.618M, +73.1만), 2024년 5월 이후 최고. 시장 예상(688만) 크게 상회. 전문·기업서비스 +66.8만. 실업자 1명당 구인 1.03건(2024년 1월 이후 최고).",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/02/job-openings-april-2026.html",
        "https://www.bls.gov/news.release/jolts.nr0.htm"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.03,
          "S&P500": 0.13,
          "다우": 0.45,
          "필라델피아반도체": 5.87,
          "러셀2000": 0.9
        },
        "realizedNA": null,
        "scenario": {
          "kind": "고용→금리",
          "basis": "이 지표는 다음 FOMC(6/17) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "강한 고용 — 인하지연(매파적)",
              "indices": {
                "나스닥종합": "-2.7~-1.5%",
                "S&P500": "-1.8~-1.0%",
                "다우": "-1.4~-0.8%",
                "필라델피아반도체": "-5.0~-2.8%",
                "러셀2000": "-1.8~-1.0%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "약한 고용 — 인하기대(비둘기)",
              "indices": {
                "나스닥종합": "+0.4~+2.0%",
                "S&P500": "+0.3~+1.3%",
                "다우": "+0.2~+1.0%",
                "필라델피아반도체": "+0.8~+3.6%",
                "러셀2000": "+0.5~+2.0%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-02",
      "region": "US",
      "category": "지수",
      "title": "S&P500 첫 7,600 돌파, 9일 연속 상승",
      "detail": "S&P500 +0.13%(+9.82p) 7,609.78로 사상 첫 7,600선 위 마감, 9거래일 연속 상승(2025년 5월 이후 최장). [검증] 종가·연속상승일수 확인.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/01/stock-market-today-live-updates.html",
        "https://thetechmarketer.com/sp-500-record-high-2026-rally/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.03,
          "S&P500": 0.13,
          "다우": 0.45,
          "필라델피아반도체": 5.87,
          "러셀2000": 0.9
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-03",
      "region": "US",
      "category": "실적",
      "title": "Broadcom(AVGO) FY26 2분기 실적 발표",
      "detail": "매출 $221.87억(+48% YoY), 비GAAP 순이익 $120.74억. AI 반도체 매출 $108억(+143% YoY). 3분기 가이던스 매출 약 $294억(+84% YoY), FY26 AI반도체 매출 가이던스 $56B(약 +180%) 재확인, FY27 AI매출 $100B 초과 전망. 콘콜 6/3. · [병합] 매출 사상 최대 222억달러(+48% YoY, 정확히는 $22.19B로 컨센 $22.27B 소폭 하회), AI 반도체 매출 108억달러(+143% YoY, 전망 상회). FY26 AI 560억달러·FY27 1,000억달러+ 가이던스를 '상향 없이' 유지한 점이 '성장 정점' 우려로 sell-the-news 촉발, 6/4(목) 주가 약 -15%(원문 -12.6%와 근사). [검증/하향] 원문의 'AI 네트워킹 매출이 기대(~48억달러)를 밑돌았다'는 미확인 — 출처들은 AI 네트워킹이 Q2 AI매출의 약 40% 비중으로 견조했다고 봄. 핵심 촉매는 '가이던스 미상향'이며 네트워킹 미스 서브주장은 신뢰도 낮음.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/03/broadcom-avgo-earnings-report-q2-2026.html",
        "https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000051/avgo-05032026x8kxex99.htm",
        "https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial",
        "https://www.fool.com/earnings/call-transcripts/2026/06/03/broadcom-avgo-q2-2026-earnings-transcript/",
        "https://finance.yahoo.com/markets/stocks/articles/broadcom-stock-dropped-15-despite-130558431.html",
        "https://www.fool.com/investing/2026/06/04/why-broadcom-stock-crashed-today/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.89,
          "S&P500": -0.74,
          "다우": -1.21,
          "필라델피아반도체": 1.39,
          "러셀2000": -1.31
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-03",
      "region": "KR",
      "category": "이벤트",
      "title": "제9회 전국동시지방선거 - 임시공휴일, 증시 전면 휴장",
      "detail": "6월 3일(수) 제9회 전국동시지방선거 실시로 임시공휴일 지정. 한국거래소는 이날 증권·파생상품·일반상품시장 전면 휴장(7/17 제헌절도 휴장 예고). 다음 거래일 6/4 재개장 시 외국인 대량 순매도로 코스피 급락(아래 항목). · [병합] 6/3 한국 지방선거 실시(광역단체장 17·기초단체장 226·광역의원 824·기초의원 2,926 + 14곳 재보궐 동시). 결과 더불어민주당이 17개 광역단체장 중 12곳 승리, 국민의힘은 서울시장 등 일부 사수. [검증/추가] 원본 목록 미포함이나 프롬프트가 명시 검증 요청 — 위키피디아·코리아헤럴드로 6/3 일자 및 결과 확인. (KR 정치 이벤트, 미증시 직접 영향은 제한적)",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://en.wikipedia.org/wiki/2026_South_Korean_local_elections",
        "https://www.koreaherald.com/article/10762996",
        "https://news.nate.com/view/20260520n12457",
        "https://www.nec.go.kr/site/nec/ex/bbs/View.do?cbIdx=1104&bcIdx=289351",
        "https://ko.wikipedia.org/wiki/%EC%A0%9C9%ED%9A%8C_%EC%A0%84%EA%B5%AD%EB%8F%99%EC%8B%9C%EC%A7%80%EB%B0%A9%EC%84%A0%EA%B1%B0",
        "https://www.sisain.co.kr/news/articleView.html?idxno=58013"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.89,
          "S&P500": -0.74,
          "다우": -1.21,
          "필라델피아반도체": 1.39,
          "러셀2000": -1.31
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-03",
      "region": "US",
      "category": "지정학",
      "title": "미·이란 추가 공습·유가 급등에 9일 상승 마감, 다우 -620p",
      "detail": "S&P500 -0.74% 7,553.68로 9일 연속 상승 마감, 다우 -620.72p(-1.21%) 50,687.07, 나스닥 -0.89% 26,853.98. 미·이란 새 공습 교환으로 WTI +2.41% $96.02, 브렌트 +1.89% $97.81 급등, 인플레 우려로 국채금리·유가 동반 상승. 장 마감 후 브로드컴 실적 발표. [검증] 4개 지수·유가 수치 모두 확인.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/02/stock-market-today-live-updates.html",
        "https://www.washingtonpost.com/business/2026/06/03/wall-street-stocks-dow-nasdaq/9ab87e98-5f89-11f1-9c46-d6211372eede_story.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.89,
          "S&P500": -0.74,
          "다우": -1.21,
          "필라델피아반도체": 1.39,
          "러셀2000": -1.31
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-03",
      "region": "US",
      "category": "물가",
      "title": "5월 ISM 서비스업 PMI",
      "detail": "5월 ISM 서비스업 PMI 54.5%(4월 53.6%에서 +0.9%p), 23개월 연속 확장. 기업활동지수 57.7%, 신규주문 57.3%.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.prnewswire.com/news-releases/services-pmi-at-54-5-may-2026-ism-services-pmi-report-302789082.html",
        "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.89,
          "S&P500": -0.74,
          "다우": -1.21,
          "필라델피아반도체": 1.39,
          "러셀2000": -1.31
        },
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": true
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-04",
      "region": "KR",
      "category": "수급",
      "title": "지방선거 휴장 후 코스피 -1.84% 급락 - 외국인 단일일 7조 순매도(역대 2위)",
      "detail": "휴장(6/3) 후 재개장한 6/4 코스피 8,639.41(-162.08p, -1.84%) 마감. 외국인 단일일 6.988조원 순매도로 역대 2위(1위는 2/27 7.08조), 19거래일 연속 순매도. 원/달러 1,530원 돌파(2009년 금융위기 이후 최고)·환율 변동성이 투자심리 악화 주도. 개인·기관은 각각 5.02조·1.81조 순매수.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.newspim.com/news/view/20260604001116",
        "https://biz.heraldcorp.com/article/10763822"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.09,
          "S&P500": 0.41,
          "다우": 1.73,
          "필라델피아반도체": -2.15,
          "러셀2000": 1.45
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-04",
      "region": "KR",
      "category": "지정학",
      "title": "5월말 외환보유액 4,269.9억달러 (한국은행)",
      "detail": "5월말 외환보유액 4,269.9억달러로 전월말(4,278.8억달러)比 8.8억달러 감소(한 달 만 감소 전환). 국민연금 외환스왑 등 시장안정화 조치가 주요인. 발표일은 6/3 휴장으로 6/4(아시아투데이 '4일 발표' 명시). 일부 매체는 6/2 보도로 발표일 표기에 혼선 있음.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://biz.heraldcorp.com/article/10762743",
        "https://www.asiatoday.co.kr/kn/view.php?key=20260604010001234"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.09,
          "S&P500": 0.41,
          "다우": 1.73,
          "필라델피아반도체": -2.15,
          "러셀2000": 1.45
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-05",
      "region": "US",
      "category": "고용",
      "title": "5월 비농업고용(NFP)·실업률",
      "detail": "5월 NFP +17.2만(예상 +8.8만 대폭 상회). 실업률 4.3% 유지. 시간당임금 MoM +0.3%·YoY +3.4%. 3·4월 합계 9.3만 상향(3월 +2.9만, 4월 +6.4만). 레저·접객, 지방정부, 헬스케어 증가. 그날 증시 핵심 변수. · [병합] 5월 비농업 신규고용 +172,000으로 컨센서스(약 80천) 대폭 상회, 4월은 +179천으로 상향 수정. 실업률 4.3% 유지, 시간당임금 +0.3%(MoM)·+3.4%(YoY). 강한 고용에 금리인하 기대 후퇴·인상 베팅까지 나오며 금리 민감주 투매 증폭. [검증/일부정정] +17.2만·실업률 4.3% 확인. 단 원문의 '3·4월 합계 +93천 상향 수정'은 미확인 — 출처는 4월 +179천(상향)만 명시.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.bls.gov/news.release/empsit.nr0.htm",
        "https://www.bloomberg.com/news/articles/2026-06-05/us-adds-172-000-jobs-in-may-beating-all-economists-estimates",
        "https://www.cnbc.com/2026/06/05/jobs-report-may-2026.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "고용→금리",
          "basis": "이 지표는 다음 FOMC(6/17) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "강한 고용 — 인하지연(매파적)",
              "indices": {
                "나스닥종합": "-2.7~-1.5%",
                "S&P500": "-1.8~-1.0%",
                "다우": "-1.4~-0.8%",
                "필라델피아반도체": "-5.0~-2.8%",
                "러셀2000": "-1.8~-1.0%"
              },
              "occurred": true
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "약한 고용 — 인하기대(비둘기)",
              "indices": {
                "나스닥종합": "+0.4~+2.0%",
                "S&P500": "+0.3~+1.3%",
                "다우": "+0.2~+1.0%",
                "필라델피아반도체": "+0.8~+3.6%",
                "러셀2000": "+0.5~+2.0%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-05",
      "region": "US",
      "category": "수급",
      "title": "반도체 급락 1차: 나스닥 -4.18%(2025년 4월 이후 최악)·SOX -10%·시총 약 $1T 증발",
      "detail": "브로드컴 가이던스 실망 + 강한 고용發 금리급등 겹쳐 반도체 투매. 나스닥 -4.18% 25,709.43, S&P500 -2.64% 7,383.74, 다우 -695.15p(-1.35%) 50,866.78. SOX 약 -10%(2025년 4월 관세패닉 이후 최악), 반도체 섹터 시총 약 1조달러 증발. 브로드컴 -12~15%대, 마이크론 약 -13%(CNBC). 6/5~6/10 급락의 출발점. [검증] 나스닥 종가·하락률·SOX·$1T 모두 확인.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/04/stock-market-today-live-updates.html",
        "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-june-05-2026"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-05",
      "region": "KR",
      "category": "지수",
      "title": "코스피 -5.54%, 8,160선 — 매도 사이드카·시총 쏠림 리스크 노출",
      "detail": "브로드컴 쇼크와 간밤 미 반도체주 급락(마이크론 -13%, 인텔·AMD -11%대) 여파로 코스피 종가 8,160선(-5.54%). 삼성전자·SK하이닉스 각각 6%·9%대 급락, 매도 사이드카 발동. 두 종목 쏠림(집중) 리스크 노출. (원본의 '서킷브레이커' 표현은 6/5엔 사이드카로 확인 — 서킷브레이커는 6/8 발동)",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://imnews.imbc.com/replay/2026/nw930/article/6828439_36996.html",
        "https://www.youtube.com/watch?v=69u7OGbqRXs",
        "https://silverlab.co.kr/blog/2026-06-08-kospi-samsung-hynix-drop"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-05",
      "region": "GLOBAL",
      "category": "고용",
      "title": "美 5월 비농업고용 +17.2만명, 컨센서스 2배 상회 → 달러 급등·원화 1,560 돌파",
      "detail": "5월 비농업고용(NFP) +172,000명으로 컨센서스(약 8.8만명)를 크게 상회, 실업률 4.3% 유지. 시간당임금 전월비 +0.3%·전년비 +3.4%, 3·4월치 상향 수정(+29K·+64K)으로 2년여 만 최강 3개월 증가. 강한 고용에 달러 강세, 원/달러가 1,550·1,560 저항선 잇따라 돌파, 장중 1,561.5원까지 약세(2009년 3월 이후 최저). (원본 컨센서스 '8만~8.5만'은 BLS·시장 기준 약 8.8만으로 정합, 수치 정확)",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.bls.gov/news.release/archives/empsit_06052026.htm",
        "https://www.cnbc.com/2026/06/05/jobs-report-may-2026.html",
        "https://www.bloomberg.com/news/articles/2026-06-05/us-adds-172-000-jobs-in-may-beating-all-economists-estimates"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "고용→금리",
          "basis": "이 지표는 다음 FOMC(6/17) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "강한 고용 — 인하지연(매파적)",
              "indices": {
                "나스닥종합": "-2.7~-1.5%",
                "S&P500": "-1.8~-1.0%",
                "다우": "-1.4~-0.8%",
                "필라델피아반도체": "-5.0~-2.8%",
                "러셀2000": "-1.8~-1.0%"
              },
              "occurred": true
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "약한 고용 — 인하기대(비둘기)",
              "indices": {
                "나스닥종합": "+0.4~+2.0%",
                "S&P500": "+0.3~+1.3%",
                "다우": "+0.2~+1.0%",
                "필라델피아반도체": "+0.8~+3.6%",
                "러셀2000": "+0.5~+2.0%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-05",
      "region": "KR",
      "category": "지정학",
      "title": "4월 국제수지(잠정) 경상수지 +282.9억달러 흑자 - 역대 2위",
      "detail": "한국은행 발표, 4월 경상수지 +282.9억달러 흑자로 역대 2위(1위 3월 379.3억달러), 36개월 연속 흑자·사상 첫 3개월 연속 200억달러 돌파. 상품수지 +338.8억달러(수출 905.9억달러 +54.5%, 수입 567.0억달러 +16.1%). 반도체 호조가 견인.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.newspim.com/news/view/20260605000031",
        "https://biz.heraldcorp.com/article/10764027"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-05",
      "region": "KR",
      "category": "이벤트",
      "title": "젠슨 황 엔비디아 CEO 방한 — 삼성·SK와 HBM4E/HBM5 공급 논의",
      "detail": "젠슨 황이 6/1~4 대만 GTC 타이베이·컴퓨텍스(6/2 SK부스 HBM4E 웨이퍼 'Please Make More' 친필) 후 6/5 한국 입국. 방한 중 최태원 SK회장과 수차례 회동, 삼성 전영현 부회장과는 6/8 신라호텔에서 HBM4E·HBM5 장기공급 논의(원본의 '6/5 신라호텔 회동'은 6/8이 정확). 엔비디아 HBM 한국 양사 조달 모멘텀 재확인. 일자·세부 정황 일부 보정.",
      "importance": "높음",
      "status": "발생",
      "confidence": "medium",
      "sources": [
        "https://namu.wiki/w/2026%EB%85%84%20%EC%A0%A0%EC%8A%A8%20%ED%99%A9%20%EB%B0%A9%ED%95%9C",
        "https://segye.com/newsView/20260609507616",
        "https://www.insightkorea.co.kr/news/articleView.html?idxno=247772"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-05",
      "region": "KR",
      "category": "수급",
      "title": "원/달러 1,561.5원 17년 만 최약세(2009.3 이후) — 외국인 매도·중동발 안전자산 선호",
      "detail": "원/달러가 6/5 미 고용 호조 발표 후 야간거래에서 1,560원을 넘어 장중 1,561.5원까지 약세, 2009년 3월 이후 최저. 외국인 코스피 순매도(6/5 하루 약 3.52조원 — 원본 2.41조원은 과소, 연초 이후 기록적 약 103조원 순매도 — 원본 115조원은 과대), 유가 100달러 상회 등 중동 불안이 복합 작용. 당국 구두개입·투기거래 조사 착수했으나 효과 제한적. ★날짜 정정: 1,561.5원 장중 고점은 6/5 야간(현지 6/6 새벽)으로 보도, 원본의 6/6 기재는 시점 정합하나 핵심 사건일은 6/5",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.koreatimes.co.kr/southkorea/20260606/won-hits-17-year-low-after-breaking-1560-against-us-dollar",
        "https://www.koreaherald.com/article/10764946",
        "https://tradingeconomics.com/south-korea/currency/news/537236"
      ],
      "verdict": "date-corrected",
      "usImpact": {
        "realized": {
          "나스닥종합": -4.18,
          "S&P500": -2.64,
          "다우": -1.35,
          "필라델피아반도체": -10.26,
          "러셀2000": -3.47
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-07",
      "region": "GLOBAL",
      "category": "원자재",
      "title": "OPEC+ 7개국, 7월 산유량 18.8만b/d 증산 결정 (2개월 연속 동일 폭)",
      "detail": "사우디·러시아·이라크·쿠웨이트·카자흐스탄·알제리·오만 7개국이 6/7 화상회의에서 7월 합산 188,000b/d 증산 합의(6월분과 동일 폭, 2개월 연속). 사우디·러시아 각 62K, 이라크 26K, 쿠웨이트 16K, 카자흐 10K, 알제리 6K, 오만 5K. 초과생산 보상기간 2026년 12월말까지 연장. 다음 회의 7/5 예정. 호르무즈 공급차질 와중의 점진적 증산이라 시장 영향은 제한적. (원본의 'UAE 이탈·불참' 표현은 검색으로 직접 확인 못 함 → 해당 부분 신뢰도 낮춰 삭제, 7개국·증산폭·보상연장·차기회의는 모두 확인)",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://aninews.in/news/business/7-opec-nations-announce-second-straight-188000-bpd-output-increase-for-july20260607201528/",
        "https://www.gulf-insider.com/7-opec-nations-announce-second-straight-188000-bpd-output-increase-for-july/",
        "https://www.cnbc.com/2026/05/03/opec-announces-188000-barrels-per-day-output-increase-.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": "미 증시 비거래일(주말·휴장 등) — 당일 지수 데이터 없음",
        "scenario": {
          "kind": "지정학/유가",
          "basis": "지정학·유가 리스크 방향에 따른 위험선호 변화(모델 추정).",
          "branches": [
            {
              "name": "리스크-온 — 긴장완화·유가↓",
              "indices": {
                "나스닥종합": "+0.6~+2.1%",
                "S&P500": "+0.4~+1.4%",
                "다우": "+0.3~+1.0%",
                "필라델피아반도체": "+1.1~+3.9%",
                "러셀2000": "+0.6~+2.0%"
              },
              "occurred": false
            },
            {
              "name": "중립",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "리스크-오프 — 긴장고조·유가↑",
              "indices": {
                "나스닥종합": "-2.2~-0.8%",
                "S&P500": "-1.5~-0.5%",
                "다우": "-1.1~-0.4%",
                "필라델피아반도체": "-4.2~-1.4%",
                "러셀2000": "-1.5~-0.5%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-08",
      "region": "KR",
      "category": "지수",
      "title": "코스피 '블랙 먼데이' -8.29%, 7,484 — 서킷브레이커+매도 사이드카",
      "detail": "미 반도체주 급락 충격 확산으로 코스피가 9시3분 약 -8.37% 급락, 1단계 서킷브레이커 발동(9시3분42초부터 20분간 매매 중단·국내 도입 이래 통산 약 15번째). 종가 7,484(-8.29%). 9시34분 매도 사이드카 발동. 삼성전자·SK하이닉스 동반 급락, 코스닥도 동반 폭락.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.dt.co.kr/article/12066306",
        "https://imnews.imbc.com/replay/2026/nw930/article/6828439_36996.html",
        "https://m.dailian.co.kr/amp/news/view/1653381/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.86,
          "S&P500": 0.3,
          "다우": -0.16,
          "필라델피아반도체": 5.61,
          "러셀2000": 0.77
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-08",
      "region": "US",
      "category": "이벤트",
      "title": "Apple WWDC 2026 개막 / Siri AI·차세대 Apple Intelligence 공개",
      "detail": "6/8 키노트(쿠퍼티노). 'Siri AI'(시스템 전반 개인 컨텍스트·온스크린 인식 재구축, 신규 Siri 앱·다이내믹아일랜드 애니), 차세대 Apple Intelligence(사진편집·홈앱 알림 등), Liquid Glass 기본 룩 변경+불투명도 슬라이더 발표. 단 Siri AI는 2026 후반 베타·미국 우선, EU·中 초기 제외로 출시 타임라인 실망.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/08/apple-wwdc-2026-live-updates.html",
        "https://www.engadget.com/2189698/everything-announced-at-apples-wwdc-2026-keynote/"
      ],
      "verdict": "downgraded",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.86,
          "S&P500": 0.3,
          "다우": -0.16,
          "필라델피아반도체": 5.61,
          "러셀2000": 0.77
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-08",
      "region": "US",
      "category": "지수",
      "title": "Apple(AAPL) WWDC 후 주가 하락",
      "detail": "6/8 장중 사상최고 약 $317.40까지 올랐다 반락, 종가 $301.54(-1.89%). 6/9 추가 3%+ 하락(장중 저점 $292.40, 약 한 달 최저). Siri AI 출시 시점(후반 베타)·미국 우선·EU/中 제외가 악재. WWDC 전후 누적 약 8% 하락. 모건스탠리는 목표가 $330→$360 상향(매수 유지).",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.foreignpolicyjournal.com/2026/06/12/apple-nasdaq-aapl-stock-price-slides-8-after-wwdc-2026-despite-ai-progress-and-raised-price-target/",
        "https://www.techtimes.com/articles/318097/20260609/apple-stock-slips-after-wwdc-2026-wall-street-splits-between-400-bull-case-215-floor.htm"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.86,
          "S&P500": 0.3,
          "다우": -0.16,
          "필라델피아반도체": 5.61,
          "러셀2000": 0.77
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-08",
      "region": "US",
      "category": "지수",
      "title": "반도체 1차 반등(데드캣)·이란이 이스라엘 공습 중단",
      "detail": "S&P500 +0.30% 7,405.73, 나스닥 +0.86% 25,929.66, 다우 -80.77p(-0.16%) 50,786.01. 금요일 폭락 후 칩주 반등 — 마이크론 약 +10%(전일 -13% 후), PHLX 반도체지수 +7.9%(2025년 4월 이후 최대), 엔비디아·브로드컴 상승. 이란이 이스라엘 공습 중단 소식이 위험선호 일부 회복. [검증] 3대 지수·다우 종가까지 정확히 확인. 날짜·수치 정확.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/07/stock-market-today-live-updates.html",
        "https://finance.yahoo.com/markets/live/stock-market-today-monday-june-8-dow-sp-500-nasdaq-jump-085310403.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.86,
          "S&P500": 0.3,
          "다우": -0.16,
          "필라델피아반도체": 5.61,
          "러셀2000": 0.77
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-09",
      "region": "KR",
      "category": "지수",
      "title": "코스피 사상 최대폭 반등 +612포인트(8,096) — 매수 사이드카",
      "detail": "전일 급락분을 +612포인트(약 +8.18%) 급등으로 회복해 종가 8,096, 역대 최대 일간 상승폭. 개장 직후 매수 사이드카 발동(코스피 9시12분·코스닥 9시28분). 종가 기준 삼성전자 약 +9%, SK하이닉스 약 +16%. 배경: 메모리 업황 견조·간밤 미 증시 회복·1분기 명목 GDP 성장률 +10.5%(1976년 이후 50년 만 최고). 원/달러 1,512원(-23원).",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://imnews.imbc.com/replay/2026/nwdesk/article/6828934_37004.html",
        "https://en.sedaily.com/finance/2026/06/09/kospi-kosdaq-trigger-buy-side-sidecars-as-markets-rebound"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.97,
          "S&P500": -0.26,
          "다우": 0.17,
          "필라델피아반도체": -1.93,
          "러셀2000": 0.41
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-09",
      "region": "US",
      "category": "지정학",
      "title": "칩 반등 실패·트럼프 '이란 추가 타격' 시사에 하락",
      "detail": "S&P500 -0.26% 7,386.65, 나스닥 -0.97% 25,678.82, 다우 +86.10p(+0.17%). 전일 급반등했던 반도체 모멘텀 상실, 트럼프가 이란 추가 타격 시사하며 장중 급락 후 종가 일부 회복. 6/5~6/10 급락의 2차 국면. [검증] 종가·하락률 확인, 날짜 정확(CNBC 06/08 기사=news for June 9).",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/08/stock-market-today-live-updates.html",
        "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-june-09-2026"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.97,
          "S&P500": -0.26,
          "다우": 0.17,
          "필라델피아반도체": -1.93,
          "러셀2000": 0.41
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-09",
      "region": "KR",
      "category": "수급",
      "title": "젠슨 황 'AI주 저평가' 발언·AI 장기서사가 반도체 저점매수 유도",
      "detail": "급락 국면에서 젠슨 황 CEO의 'AI 관련주 주가 무척 싸다·SK하이닉스 구매 크게 늘 것' 발언과 AI·HBM 장기 수요 서사가 투자심리를 지지(KB는 SK하이닉스 목표가 380만원 유지·'조정은 매수 기회'). 반등 주도. (원본의 'SK하이닉스 연초比 +250%'는 근사치로 직접 재확인 못함)",
      "importance": "높음",
      "status": "발생",
      "confidence": "medium",
      "sources": [
        "https://www.sedaily.com/article/20052837",
        "https://v.daum.net/v/20260609074735646"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -0.97,
          "S&P500": -0.26,
          "다우": 0.17,
          "필라델피아반도체": -1.93,
          "러셀2000": 0.41
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-10",
      "region": "US",
      "category": "물가",
      "title": "5월 소비자물가(CPI)",
      "detail": "5월 CPI 헤드라인 MoM +0.5%·YoY +4.2%(2023년 4월 이후 최고). 근원 MoM +0.2%·YoY +2.9%. 에너지 MoM +3.9%·YoY +23.5%로 월간 상승분의 60%↑ 기여(휘발유 MoM +7%·YoY +40.5%, 중동전 에너지 충격). 그날 증시 핵심 변수.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/10/cpi-inflation-report-may-2026.html",
        "https://www.foxbusiness.com/economy/cpi-inflation-may-2026",
        "https://www.bls.gov/news.release/cpi.nr0.htm",
        "https://www.bls.gov/news.release/archives/cpi_06102026.htm"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -1.98,
          "S&P500": -1.62,
          "다우": -1.87,
          "필라델피아반도체": -3.57,
          "러셀2000": -1.1
        },
        "realizedNA": null,
        "scenario": {
          "kind": "물가→금리",
          "basis": "이 지표는 다음 FOMC(6/17) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "예상 상회 — 인플레 재가속(매파적)",
              "indices": {
                "나스닥종합": "-3.0~-1.8%",
                "S&P500": "-2.0~-1.2%",
                "다우": "-1.5~-0.9%",
                "필라델피아반도체": "-5.6~-3.4%",
                "러셀2000": "-2.2~-1.3%"
              },
              "occurred": true
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "예상 하회 — 디스인플레(비둘기)",
              "indices": {
                "나스닥종합": "+1.5~+2.7%",
                "S&P500": "+1.0~+1.8%",
                "다우": "+0.8~+1.4%",
                "필라델피아반도체": "+2.8~+5.0%",
                "러셀2000": "+1.4~+2.6%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-10",
      "region": "US",
      "category": "지수",
      "title": "반도체 급락 2차+이란 긴장: 다우 -953p, 광범위 하락(저점 형성)",
      "detail": "다우 -953.33p(-1.87%) 49,918.78, S&P500 -1.62% 7,266.99, 나스닥 -1.98% 25,169.50. 5월 CPI 4.2% + 트럼프의 '협상 지연·추가 행동' 위협 + 반도체 추가 투매 겹쳐 6/5~6/10 약세의 저점 형성. WTI +2.07% $90.03. [검증] 4개 지수·유가 모두 확인.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/09/stock-market-today-live-updates.html",
        "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-june-10-2026"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -1.98,
          "S&P500": -1.62,
          "다우": -1.87,
          "필라델피아반도체": -3.57,
          "러셀2000": -1.1
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-10",
      "region": "US",
      "category": "실적",
      "title": "Oracle(ORCL) FY26 4분기 실적 발표 (장 마감 후)",
      "detail": "분기 매출 $192억(+21%), 클라우드(IaaS+SaaS) $99억(+47%, IaaS +93%), 비GAAP EPS $2.11(컨센 $1.89, +11.6% 상회). RPO(수주잔고) $638B(+363% YoY, 전분기比 +$85B, 대형 AI계약 견인). FY26 총매출 $67.4B(+17%). 콘콜 6/10.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://investor.oracle.com/investor-news/news-details/2026/Oracle-Announces-Record-Q4-and-FY-2026-Results-Driven-by-Cloud-Infrastructure--Cloud-Applications/default.aspx",
        "https://www.cnbc.com/2026/06/10/oracle-orcl-q4-earnings-report-2026.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": -1.98,
          "S&P500": -1.62,
          "다우": -1.87,
          "필라델피아반도체": -3.57,
          "러셀2000": -1.1
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-10",
      "region": "US",
      "category": "수급",
      "title": "[종합] 6/5~6/10 반도체·기술주 급락 촉매 규명",
      "detail": "2단계 급락. 1단계(6/5): 브로드컴 6/3 실적의 FY27 AI 가이던스 '상향 없는 유지'(성장 정점 우려) + 5월 고용 서프라이즈(+17.2만)發 금리 급등 → SOX -10%, 나스닥 -4.18%. 2단계(6/9~6/10): 6/9 반등 실패 후 5월 CPI +4.2%(3년 최고) 인플레 재가속 + 미·이란 지정학·유가 급등 겹쳐 추가 급락(6/10 다우 -953p). 관세가 아닌 '실적 가이던스+금리+물가+지정학' 복합 촉매. [검증/하향] 사실관계 모두 확인되나 이는 단일 시장 사건이 아닌 6/5·6/10 항목의 종합 분석이라 중복 — importance를 최우선→높음으로 하향(실제 증시 좌우는 6/5·6/10 두 항목에 부여).",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/04/stock-market-today-live-updates.html",
        "https://www.cnbc.com/2026/06/09/stock-market-today-live-updates.html",
        "https://www.cnbc.com/2026/06/10/cpi-inflation-report-may-2026.html"
      ],
      "verdict": "downgraded",
      "usImpact": {
        "realized": {
          "나스닥종합": -1.98,
          "S&P500": -1.62,
          "다우": -1.87,
          "필라델피아반도체": -3.57,
          "러셀2000": -1.1
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-11",
      "region": "US",
      "category": "지수",
      "title": "Oracle(ORCL) 주가 약 12% 급락 — AI capex·부채·현금소진 우려",
      "detail": "강한 실적 비트에도 6/11 주가 약 12% 급락, 약 $72B 시총 증발(시총 약 $578.83B). FY26 FCF 적자 $23.7B로 확대(전년 적자 $394M), FY27 순capex 현금 $70B 계획(영업현금 $32B 대비), 부채+자금조달($20B 채권+$20B ATM 주식)이 매도 촉발. 1월 이후 최대 일일 낙폭.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/11/oracle-shares-tumble-11percent-on-increased-capital-raise-cash-concerns.html",
        "https://finance.yahoo.com/markets/stocks/articles/oracle-shares-slide-hefty-ai-152535544.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-11",
      "region": "US",
      "category": "물가",
      "title": "5월 생산자물가(PPI)",
      "detail": "5월 PPI 최종수요 MoM +1.1%·YoY +6.5%(2022년 11월 이후 최대 12개월 상승). 최종수요 재화 +2.8%(2009년 집계 이래 최대), 최종수요 에너지 +10.7%·휘발유 +23.4%. 중동전 에너지 충격 파이프라인 반영. (주: 일부 보도 근원지표 ex식품·에너지 +0.4%, 원본의 +0.8%는 ex식품·에너지·무역 기준)",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/11/producer-price-index-may-2026-.html",
        "https://www.bls.gov/news.release/ppi.nr0.htm"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "물가→금리",
          "basis": "이 지표는 다음 FOMC(6/17) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "예상 상회(매파적)",
              "indices": {
                "나스닥종합": "-1.8~-0.9%",
                "S&P500": "-1.2~-0.6%",
                "다우": "-0.9~-0.4%",
                "필라델피아반도체": "-3.4~-1.7%",
                "러셀2000": "-1.3~-0.7%"
              },
              "occurred": true
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.3~+0.4%",
                "S&P500": "-0.2~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.6~+0.8%",
                "러셀2000": "-0.2~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "예상 하회(비둘기)",
              "indices": {
                "나스닥종합": "+0.8~+1.7%",
                "S&P500": "+0.5~+1.1%",
                "다우": "+0.4~+0.8%",
                "필라델피아반도체": "+1.4~+3.1%",
                "러셀2000": "+0.7~+1.5%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-11",
      "region": "US",
      "category": "지정학",
      "title": "미·이란 '합의 임박'·트럼프 공습 취소에 강반등: 나스닥 +2.54%·다우 +930p",
      "detail": "S&P500 +1.75% 7,394.30, 나스닥 +2.54% 25,809.66, 다우 +929.97p(+1.86%) 50,848.75. 트럼프가 '예정 공습 취소' 발표 및 '이란 핵 무기 보유 불가 합의 임박' 발언으로 지정학 리스크 완화, 기술·반도체 주도 강반등. WTI -2.58% $87.71. [검증] 3대 지수·다우 종가 정확히 확인.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/10/stock-market-today-live-updates.html",
        "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-june-11-2026"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-11",
      "region": "US",
      "category": "실적",
      "title": "Adobe(ADBE) FY26 2분기 실적 발표 (장 마감 후)",
      "detail": "매출 사상 최대 $66.2억(+13% YoY), 비GAAP EPS $5.96(GAAP $4.25), AI-퍼스트 ARR 전년比 3배·$5억 초과. FY26 가이던스 상향(매출 $265~266억·비GAAP EPS $24.35~24.45). $250억 자사주 매입 진행. 콘콜 6/11.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.sec.gov/Archives/edgar/data/0000796343/000079634326000109/adbeex991q226.htm",
        "https://www.stocktitan.net/sec-filings/ADBE/8-k-adobe-inc-reports-material-event-5a6954dc3846.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "빅테크/반도체 실적",
          "sectorDirect": true,
          "basis": "AI·반도체 대표주 실적/가이던스의 SOX·나스닥 파급(모델 추정). ※섹터 직접 충격 — 일반 베타 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "서프라이즈 호재",
              "indices": {
                "나스닥종합": "+0.6~+1.8%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.1~+0.5%",
                "필라델피아반도체": "+2.0~+5.0%",
                "러셀2000": "+0.2~+0.8%"
              }
            },
            {
              "name": "기대 하회·가이던스 실망",
              "indices": {
                "나스닥종합": "-1.8~-0.6%",
                "S&P500": "-1.0~-0.3%",
                "다우": "-0.5~-0.1%",
                "필라델피아반도체": "-5.0~-2.0%",
                "러셀2000": "-0.8~-0.2%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-11",
      "region": "KR",
      "category": "수급",
      "title": "선물·옵션 동시만기일 (쿼드러플 위칭데이)",
      "detail": "6월 11일(6월 둘째 목요일) 코스피200선물·옵션 등 동시 최종거래일. 만기 청산에 따른 프로그램 매매 변동성 확대 구간. (검증: 둘째 목요일=6/11 일치)",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.junggi.co.kr/news/articleView.html?idxno=36642",
        "https://kr.investing.com/futures-expiration-calendar/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "수급(만기)",
          "noDirectional": true,
          "basis": "선물·옵션 동시만기 — 방향성보다 거래량·장중 변동성 확대. 지수 종가 영향은 중립적이나 변동성 ↑."
        }
      }
    },
    {
      "date": "2026-06-11",
      "region": "KR",
      "category": "고용",
      "title": "5월 고용동향 - 취업자 4만명 감소 (17개월만 마이너스 전환)",
      "detail": "5월 취업자 2,912만명으로 전년比 -4만명, 17개월만 첫 감소 전환(계엄 이후 약 1년5개월). 실업률 2.9%(+0.1%p). 청년층(15~29세) 고용률 43.8%(-2.4%p)·실업률 7.2%(+0.6%p) 충격, 20대 취업자 -25.1만명(5년4개월來 최대). 제조업 -14만명(7년3개월來 최대).",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://biz.heraldcorp.com/article/10769053",
        "https://www.newspim.com/news/view/20260611000050"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-11",
      "region": "US",
      "category": "고용",
      "title": "주간 신규 실업수당청구 (주말 6/6)",
      "detail": "6/6 종료 주 신규청구 22.9만(전주 22.5만에서 +4천), 2월 이후 최고. 예상(21.9만) 상회. 연속청구 179.5만(+2.4만). 4주 평균 21.9만.",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.indexbox.io/blog/weekly-jobless-claims-rise-to-229000-highest-since-february/",
        "https://tradingeconomics.com/united-states/jobless-claims"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "고용→금리",
          "basis": "이 지표는 다음 FOMC(6/17) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "강한 고용 — 인하지연(매파적)",
              "indices": {
                "나스닥종합": "-2.7~-1.5%",
                "S&P500": "-1.8~-1.0%",
                "다우": "-1.4~-0.8%",
                "필라델피아반도체": "-5.0~-2.8%",
                "러셀2000": "-1.8~-1.0%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "약한 고용 — 인하기대(비둘기)",
              "indices": {
                "나스닥종합": "+0.4~+2.0%",
                "S&P500": "+0.3~+1.3%",
                "다우": "+0.2~+1.0%",
                "필라델피아반도체": "+0.8~+3.6%",
                "러셀2000": "+0.5~+2.0%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-11",
      "region": "KR",
      "category": "물가",
      "title": "6월 1~10일 수출입 잠정치 - 수출 +85.9% 동기 역대 최대",
      "detail": "관세청 발표, 6/1~10 수출 286.35억달러로 전년동기比 +85.9%(동기 역대 최대), 수입 234억달러(+35.6%), 무역수지 +52.82억달러. 반도체 수출 110.68억달러(+205.8%, 비중 38.7%)로 동기 역대 최대. 일평균 수출 40.9억달러(+46.1%).",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.newspim.com/news/view/20260611000364",
        "https://biz.heraldcorp.com/article/10769286"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 2.54,
          "S&P500": 1.75,
          "다우": 1.86,
          "필라델피아반도체": 7.91,
          "러셀2000": 3.02
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-12",
      "region": "GLOBAL",
      "category": "지정학",
      "title": "美·이란 평화협정 '최종 합의문안' 도달(파키스탄 중재) → 유가 급락, 안전자산 선호 후퇴",
      "detail": "파키스탄 샤리프 총리가 美·이란 평화협정의 '최종 합의문안(final, agreed upon text)' 도달 발표('이슬라마바드 선언'). 트럼프는 '이르면 주말 유럽에서 서명 가능'(서명 장소는 제네바 유력, JD 밴스 부통령 참석 거론) 언급. 협정엔 이란의 핵무기 영구 미보유 약속, 호르무즈 30일 내 재개통, 단계적 제재 해제, 동결자산 해제 등 포함(이란 메흐르통신 14개항 초안 보도). 다만 이란은 일부 '예비적'이라 선 긋는 등 이견 잔존. 안전자산 수요 후퇴로 유가·달러 동반 하락. (원본 '파키스탄 중재' 정확, '유럽 서명'은 제네바로 구체화)",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cbsnews.com/live-updates/iran-war-us-trump-peace-deal-agreement/",
        "https://www.cnn.com/2026/06/12/world/live-news/iran-war-trump-israel",
        "https://time.com/article/2026/06/12/trump-us-iran-peace-deal-details-timeline-conflicting-reports/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": {
          "kind": "지정학/유가",
          "basis": "지정학·유가 리스크 방향에 따른 위험선호 변화(모델 추정).",
          "branches": [
            {
              "name": "리스크-온 — 긴장완화·유가↓",
              "indices": {
                "나스닥종합": "+0.6~+2.1%",
                "S&P500": "+0.4~+1.4%",
                "다우": "+0.3~+1.0%",
                "필라델피아반도체": "+1.1~+3.9%",
                "러셀2000": "+0.6~+2.0%"
              },
              "occurred": true
            },
            {
              "name": "중립",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "리스크-오프 — 긴장고조·유가↑",
              "indices": {
                "나스닥종합": "-2.2~-0.8%",
                "S&P500": "-1.5~-0.5%",
                "다우": "-1.1~-0.4%",
                "필라델피아반도체": "-4.2~-1.4%",
                "러셀2000": "-1.5~-0.5%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-12",
      "region": "GLOBAL",
      "category": "원자재",
      "title": "유가 3%대 급락: 브렌트 $87.33(-3.37%)·WTI $84.88(-3.23%), WTI 4/17 이후 최저",
      "detail": "美·이란 평화협상 진전 기대로 브렌트 -3.37% $87.33, WTI -3.23% $84.88로 마감. WTI는 4/17 이후 최저, 브렌트는 3월 초 이후 최저 수준. 이란 메흐르통신의 14개항 MOU(제재 해제·호르무즈 30일 내 재개통) 보도가 하락 촉발. 2/28 공습 이후로는 여전히 높은 수준. 인플레 우려 완화가 채권·환시에 파급. (원본 수치 정확, '8주 최저' → WTI는 4/17 이후 약 8주 최저로 정합·브렌트는 3월초 이후 최저로 더 길어 표현 보정)",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/12/oil-prices-wti-brent-on-hopes-of-us-iran-deal-despite-tehran-pushback.html",
        "https://www.investing.com/news/commodities-news/oil-extends-losses-as-trump-calls-off-planned-strikes-on-iran-4738771",
        "https://finance.yahoo.com/markets/article/oil-prices-fall-after-iran-state-media-says-deal-with-us-would-include-restored-hormuz-shipping-144319788.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": {
          "kind": "지정학/유가",
          "basis": "지정학·유가 리스크 방향에 따른 위험선호 변화(모델 추정).",
          "branches": [
            {
              "name": "리스크-온 — 긴장완화·유가↓",
              "indices": {
                "나스닥종합": "+0.6~+2.1%",
                "S&P500": "+0.4~+1.4%",
                "다우": "+0.3~+1.0%",
                "필라델피아반도체": "+1.1~+3.9%",
                "러셀2000": "+0.6~+2.0%"
              },
              "occurred": true
            },
            {
              "name": "중립",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "리스크-오프 — 긴장고조·유가↑",
              "indices": {
                "나스닥종합": "-2.2~-0.8%",
                "S&P500": "-1.5~-0.5%",
                "다우": "-1.1~-0.4%",
                "필라델피아반도체": "-4.2~-1.4%",
                "러셀2000": "-1.5~-0.5%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-12",
      "region": "US",
      "category": "이벤트",
      "title": "역대 최대 IPO 스페이스X(SPCX) 데뷔 +19%·미·이란 평화 기대에 상승",
      "detail": "S&P500 +0.5% 7,431.46, 나스닥 +0.31% 25,888.84, 다우 +353.51p(+0.7%) 51,202.26. 스페이스X 나스닥 SPCX 상장 — 공모가 $135, 시초 $150, 종가 +19% 약 $161(원문 $161.11과 근사, CNBC=$161·NPR=$160.95), 약 5.56억주·약 750억달러 조달로 사상 최대 IPO. 미·이란 평화 기대가 위험선호 지지. [검증] 지수·IPO 수치 모두 확인.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/12/spacex-ipo-spcx-live-updates.html",
        "https://www.npr.org/2026/06/12/nx-s1-5855004/stock-ai-spacex-ipo-elon-musk"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": null
      }
    },
    {
      "date": "2026-06-12",
      "region": "KR",
      "category": "수급",
      "title": "원/달러 1,518원대로 진정 — 당국 개입·기관 달러공급·평화 기대로 1,560서 회복",
      "detail": "원/달러는 6/12 약 1,518.3원으로 마감(전일비 +0.14%), 6/5 장중 1,561.5원 고점에서 회복. 외환당국 구두개입·은행 외환영업 합동점검(한은·금감원), 국민연금(NPS) 전략적 환헤지 확대(연말까지 연장·유연화), 美·이란 평화 기대, 반도체 수출 호조가 복합 작용. 6/12엔 외국인이 한 달여 만에 코스피 약 1.7조원 순매수 전환. (1,518.27원 tradingeconomics 확인, NPS 헤지 역할 확인)",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://tradingeconomics.com/south-korea/currency",
        "https://www.kedglobal.com/foreign-exchange/newsView/ked202512150010",
        "https://www.asiae.co.kr/en/article/2026061213395614911"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-12",
      "region": "GLOBAL",
      "category": "통화정책",
      "title": "美 10년물 국채금리 4.47%로 하락(전일 약 -10bp)",
      "detail": "유가 급락에 따른 인플레 우려·금리인상 우려 완화로 미 10년물 금리가 6/12 약 4.47%(전 거래일 대비 약 10bp 하락, 6/10 4.55%). 트럼프의 '주말 對이란 평화협정 서명 가능' 발언이 유가 급락→인플레 기대 완화→금리 하락의 경로. (10년물 4.47%·-10bp는 확인. 다만 DXY 99.80은 검색으로 직접 확인 못 함 → 해당 수치 신뢰도 낮춰 detail에서 단정 제거. 보통 등급 유지)",
      "importance": "보통",
      "status": "발생",
      "confidence": "medium",
      "sources": [
        "https://tradingeconomics.com/united-states/government-bond-yield",
        "https://www.federalreserve.gov/releases/h15/"
      ],
      "verdict": "downgraded",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": {
          "kind": "지정학/유가",
          "basis": "지정학·유가 리스크 방향에 따른 위험선호 변화(모델 추정).",
          "branches": [
            {
              "name": "리스크-온 — 긴장완화·유가↓",
              "indices": {
                "나스닥종합": "+0.6~+2.1%",
                "S&P500": "+0.4~+1.4%",
                "다우": "+0.3~+1.0%",
                "필라델피아반도체": "+1.1~+3.9%",
                "러셀2000": "+0.6~+2.0%"
              },
              "occurred": true
            },
            {
              "name": "중립",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "리스크-오프 — 긴장고조·유가↑",
              "indices": {
                "나스닥종합": "-2.2~-0.8%",
                "S&P500": "-1.5~-0.5%",
                "다우": "-1.1~-0.4%",
                "필라델피아반도체": "-4.2~-1.4%",
                "러셀2000": "-1.5~-0.5%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-12",
      "region": "US",
      "category": "심리",
      "title": "6월 미시간대 소비자심리지수(잠정)",
      "detail": "6월 잠정 48.9(전월 44.8)로 약 +9%(4개월 만 첫 반등, 예상 46.0 상회). 휘발유 가격 하락이 견인. 1년 기대인플레 4.6%(전월 4.8%), 장기 3.4%(3.9%). 여전히 역사적 저점권(1970년대 이후 둘째로 낮음).",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://seekingalpha.com/news/4602987-consumer-sentiment-jumps-past-consensus-in-june",
        "https://www.bloomberg.com/news/articles/2026-06-12/us-consumer-sentiment-picks-up-on-easing-gasoline-prices"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-12",
      "region": "KR",
      "category": "실적",
      "title": "삼성전자 반등 지속 — 종가 322,500원(+7.86%), 코스피 8,123",
      "detail": "회복 국면 지속. 삼성전자 6/12 종가 322,500원(전일 299,000원 대비 +7.86%, 장중 고가 339,000원). 코스피 종가 8,123.62. 6/5~6/8 저점에서 빠르게 복원, HBM/AI 메모리 수요 인식·외국인 저점매수가 배경. (원본 low→검증 결과 종가·등락률 출처 확인되어 신뢰도 상향)",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.topstarnews.net/news/articleView.html?idxno=16092050",
        "https://ir.gsifn.io/sample/stock.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": {
          "나스닥종합": 0.31,
          "S&P500": 0.5,
          "다우": 0.7,
          "필라델피아반도체": 1.52,
          "러셀2000": 0.79
        },
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-15",
      "region": "GLOBAL",
      "category": "이벤트",
      "title": "G7 정상회의 (프랑스 에비앙레뱅, 6/15~17) — 한국 초청국",
      "detail": "프랑스 오트사부아 에비앙레뱅에서 6/15~17 제52차 G7 정상회의 개최(의장국 프랑스). G7(美·英·獨·佛·伊·日·加)+EU 참석, 초청국은 브라질·한국·인도·케냐. 국제 평화·안보(이란 평화협정 서명 가능성), 다자주의, 세계경제 전망이 핵심 의제. 한국 참여로 통상·한반도 양자 회동 가능성. ★정정: 원본의 초청국 '시리아'는 오류 — 공식 확인된 초청국은 브라질·한국·인도·케냐 4개국뿐(시리아 미포함)",
      "importance": "높음",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://en.wikipedia.org/wiki/52nd_G7_summit",
        "https://www.consilium.europa.eu/en/meetings/international-summit/2026/06/15-17/",
        "https://www.eda.admin.ch/en/g7-summit-in-evian"
      ],
      "verdict": "date-corrected",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "글로벌 이벤트",
          "noDirectional": true,
          "basis": "글로벌 정상회의·정책 이벤트 — 통상·지정학 헤드라인에 따라 위험선호가 단발성으로 움직일 수 있으나 방향은 사전 예측 곤란."
        }
      }
    },
    {
      "date": "2026-06-16",
      "region": "US",
      "category": "통화정책",
      "title": "[예정] FOMC 6월 정례회의(6/16~17), 정책금리·점도표 결정",
      "detail": "6/16~17 양일 FOMC 개최, 6/17(수) 14:00 ET 성명·점도표(SEP), 14:30 ET 기자회견. 직전 4월 회의에서 정책금리 3.50~3.75% 동결(3회 연속, 8-4 이례적 4인 반대). 5월 고용 강세+CPI 4.2% 재가속으로 인하 기대 후퇴 상태라 점도표가 핵심 변수. [검증] 연준 공식 일정으로 6/16~17 확인, 4월 동결 금리범위·8-4 표결 확인.",
      "importance": "높음",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        "https://www.cnbc.com/2026/04/29/fed-interest-rate-decision-april-2026.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "통화정책",
          "centerpiece": true,
          "basis": "연방기금금리 결정 — 시장은 동결을 압도적으로 반영. 변수는 점도표(SEP)·기자회견 톤(신임 의장 Warsh).",
          "rateTree": {
            "title": "6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "동결(컨센서스 유지)",
              "prob": 97.1,
              "indices": {
                "나스닥종합": "-0.6~+0.9%",
                "S&P500": "-0.4~+0.6%",
                "다우": "-0.3~+0.4%",
                "필라델피아반도체": "-1.1~+1.7%",
                "러셀2000": "-0.5~+0.7%"
              },
              "note": "점도표·기자회견 톤이 변수. 동결 자체는 선반영, 변동은 가이던스에 좌우."
            },
            {
              "name": "깜짝 인하(비둘기 서프라이즈)",
              "prob": 2.9,
              "indices": {
                "나스닥종합": "+2.2~+3.9%",
                "S&P500": "+1.5~+2.6%",
                "다우": "+1.1~+2.0%",
                "필라델피아반도체": "+4.2~+7.3%",
                "러셀2000": "+2.6~+4.6%"
              },
              "note": "유동성 기대로 랠리. 금리민감 소형주(러셀)·성장주(나스닥) 강세."
            },
            {
              "name": "깜짝 인상(매파 서프라이즈)",
              "prob": 0,
              "indices": {
                "나스닥종합": "-4.5~-2.7%",
                "S&P500": "-3.0~-1.8%",
                "다우": "-2.2~-1.4%",
                "필라델피아반도체": "-8.4~-5.0%",
                "러셀2000": "-4.0~-2.4%"
              },
              "note": "긴축 충격. 고밸류 기술·반도체(SOX) 급락."
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-16",
      "region": "US",
      "category": "지표",
      "title": "5월 주택착공·건축허가",
      "detail": "5월 신규주택건설(주택착공·건축허가) 발표 예정, 오전 8:30 ET(Census). 백악관 PFEI 일정상 6/16 확정.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.whitehouse.gov/wp-content/uploads/2025/09/pfei_schedule_release_dates_cy2026.pdf",
        "https://www.census.gov/construction/nrc/current/index.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-17",
      "region": "US",
      "category": "통화정책",
      "title": "6월 FOMC 금리결정·점도표 (6/16~17)",
      "detail": "FOMC 6/16~17 개최, 결정 17일 14:00 ET·기자회견 14:30 ET. 시장은 기준금리 3.50~3.75% 동결 압도적 전망(선물 내재확률 99.4%, 3회 연속 동결). SEP·점도표 갱신. 케빈 워시 신임 의장(파월 후임, 5/13 인준·5/22 취임)의 첫 점도표 회의가 핵심 변수.",
      "importance": "최우선",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
        "https://polymarket.com/event/fed-decision-in-june-825",
        "https://www.cnbc.com/2026/05/13/kevin-warsh-wins-senate-confirmation-as-the-next-federal-reserve-chair.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "통화정책",
          "centerpiece": true,
          "basis": "연방기금금리 결정 — 시장은 동결을 압도적으로 반영. 변수는 점도표(SEP)·기자회견 톤(신임 의장 Warsh).",
          "rateTree": {
            "title": "6/17 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 97.1
              },
              {
                "label": "인하",
                "pct": 2.9
              },
              {
                "label": "인상",
                "pct": 0
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "동결(컨센서스 유지)",
              "prob": 97.1,
              "indices": {
                "나스닥종합": "-0.6~+0.9%",
                "S&P500": "-0.4~+0.6%",
                "다우": "-0.3~+0.4%",
                "필라델피아반도체": "-1.1~+1.7%",
                "러셀2000": "-0.5~+0.7%"
              },
              "note": "점도표·기자회견 톤이 변수. 동결 자체는 선반영, 변동은 가이던스에 좌우."
            },
            {
              "name": "깜짝 인하(비둘기 서프라이즈)",
              "prob": 2.9,
              "indices": {
                "나스닥종합": "+2.2~+3.9%",
                "S&P500": "+1.5~+2.6%",
                "다우": "+1.1~+2.0%",
                "필라델피아반도체": "+4.2~+7.3%",
                "러셀2000": "+2.6~+4.6%"
              },
              "note": "유동성 기대로 랠리. 금리민감 소형주(러셀)·성장주(나스닥) 강세."
            },
            {
              "name": "깜짝 인상(매파 서프라이즈)",
              "prob": 0,
              "indices": {
                "나스닥종합": "-4.5~-2.7%",
                "S&P500": "-3.0~-1.8%",
                "다우": "-2.2~-1.4%",
                "필라델피아반도체": "-8.4~-5.0%",
                "러셀2000": "-4.0~-2.4%"
              },
              "note": "긴축 충격. 고밸류 기술·반도체(SOX) 급락."
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-17",
      "region": "US",
      "category": "지표",
      "title": "5월 소매판매",
      "detail": "5월 소매판매(Census Advance Monthly Retail) 발표 예정, 오전 8:30 ET. 원본은 6/16로 기재했으나 백악관 PFEI·Census 일정상 6/17이 정확(주택착공이 6/16). 발표일만 확정.",
      "importance": "높음",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.census.gov/economic-indicators/calendar-listview.html",
        "https://www.whitehouse.gov/wp-content/uploads/2025/09/pfei_schedule_release_dates_cy2026.pdf"
      ],
      "verdict": "date-corrected",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-18",
      "region": "US",
      "category": "수급",
      "title": "트리플 위칭(선물·옵션 동시만기)",
      "detail": "통상 6월 3째 금요일(6/19)이 준틴스 휴장과 겹쳐, 트리플 위칭이 6/18(목)로 앞당겨짐. 주식옵션·지수선물·지수옵션 동시만기로 거래량·변동성 확대.",
      "importance": "높음",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://optionalpha.com/learn/triple-witching",
        "https://regimeanalysis.com/expiration-calendar/month-of/june-2026"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "수급(만기)",
          "noDirectional": true,
          "basis": "선물·옵션 동시만기 — 방향성보다 거래량·장중 변동성 확대. 지수 종가 영향은 중립적이나 변동성 ↑."
        }
      }
    },
    {
      "date": "2026-06-18",
      "region": "US",
      "category": "고용",
      "title": "주간 신규 실업수당청구 (주말 6/13)",
      "detail": "6/13 종료 주 신규 실업수당청구 발표 예정(목, 8:30 ET). 6/19 준틴스 휴장이나 통상 목요일 발표는 유지. 실제 수치 미발표.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.dol.gov/ui/data.pdf",
        "https://tradingeconomics.com/united-states/jobless-claims"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "고용→금리",
          "basis": "이 지표는 다음 FOMC(7/29) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 7/29 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 88.8
              },
              {
                "label": "인하",
                "pct": 2.6
              },
              {
                "label": "인상",
                "pct": 8.6
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "강한 고용 — 인하지연(매파적)",
              "indices": {
                "나스닥종합": "-2.7~-1.5%",
                "S&P500": "-1.8~-1.0%",
                "다우": "-1.4~-0.8%",
                "필라델피아반도체": "-5.0~-2.8%",
                "러셀2000": "-1.8~-1.0%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "약한 고용 — 인하기대(비둘기)",
              "indices": {
                "나스닥종합": "+0.4~+2.0%",
                "S&P500": "+0.3~+1.3%",
                "다우": "+0.2~+1.0%",
                "필라델피아반도체": "+0.8~+3.6%",
                "러셀2000": "+0.5~+2.0%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-18",
      "region": "US",
      "category": "실적",
      "title": "Accenture(ACN) FY26 3분기 실적 발표 (예정)",
      "detail": "6/18 오전 8시(EDT) 컨퍼런스콜 예정, 실적 보도자료는 콜 전 발표. 컨센 매출 약 $187.8억. AI 컨설팅 수요·신규 수주 동향이 관전 포인트.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://newsroom.accenture.com/news/2026/accenture-to-announce-third-quarter-fiscal-2026-results",
        "https://www.tradingview.com/news/tradingview:3cd8669a2f0ec:0-acn-q3-26-earnings-revenue-estimate-is-18-78b-usd/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "개별 종목 실적",
          "noDirectional": true,
          "basis": "개별 종목 실적(페덱스=글로벌 물동량, 액센추어=IT컨설팅 수요, 나이키=소비) — 지수 직접 영향은 제한적이나 해당 업황 신호로 섹터 심리에 파급."
        }
      }
    },
    {
      "date": "2026-06-19",
      "region": "US",
      "category": "휴장",
      "title": "[예정] 준틴스(Juneteenth) 연방공휴일 — NYSE·나스닥 휴장",
      "detail": "6/19(금) 준틴스로 NYSE·나스닥 전면 휴장, 전일 6/18(목)은 오후 1시(ET) 조기폐장. [검증/추가] 원본 목록에는 없으나 프롬프트가 명시 검증 요청한 항목 — Fidelity/AARP/Kiplinger 휴장 캘린더로 확인.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.fidelity.com/learning-center/smart-money/stock-market-holidays",
        "https://www.calendarlabs.com/nyse-market-holidays-2026/",
        "https://www.kiplinger.com/investing/stock-market-holidays"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "휴장",
          "noDirectional": true,
          "basis": "미 증시 전면 휴장 — 당일 거래 없음. 전후 세션 유동성 감소."
        }
      }
    },
    {
      "date": "2026-06-23",
      "region": "US",
      "category": "실적",
      "title": "FedEx(FDX) FY26 4분기 실적 발표 (예정, 장 마감 후)",
      "detail": "6/23(화) 장 마감 후 발표 예정. 컨센 EPS $5.80(전년比 -4.5%, 전년 $6.07). FedEx Freight 분사(6/1 완료) 후 첫 실적이라 의미. 글로벌 물동량·경기 가늠자.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://finance.yahoo.com/markets/stocks/articles/fedexs-q4-2026-earnings-expect-115605097.html",
        "https://www.barchart.com/story/news/1533352/fedex-s-q4-2026-earnings-what-to-expect"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "개별 종목 실적",
          "noDirectional": true,
          "basis": "개별 종목 실적(페덱스=글로벌 물동량, 액센추어=IT컨설팅 수요, 나이키=소비) — 지수 직접 영향은 제한적이나 해당 업황 신호로 섹터 심리에 파급."
        }
      }
    },
    {
      "date": "2026-06-24",
      "region": "US",
      "category": "실적",
      "title": "Micron(MU) FY26 3분기 실적 발표 (예정, 장 마감 후) — SOXL 직결",
      "detail": "6/24(수) 장 마감 후 발표, 콘콜 오후 2:30(MT). 회사 가이던스 매출 약 $33.5B(±$0.75B)·비GAAP EPS 약 $19.15(±$0.40)·GPM 약 81%. HBM 사이클·2027 공급 가시성이 관건. 옵션시장 약 20% 변동 반영. 반도체(SOXL) 최대 변수.",
      "importance": "최우선",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.globenewswire.com/news-release/2026/05/27/3302360/14450/en/Micron-Technology-to-Report-Fiscal-Third-Quarter-Results-on-June-24-2026.html",
        "https://www.tipranks.com/stocks/mu/earnings",
        "https://investingnews.com/micron-technology-to-report-fiscal-third-quarter-results-on-june-24-2026/",
        "https://www.marketbeat.com/earnings/reports/2026-6-24-micron-technology-inc-stock/",
        "https://www.stocktitan.net/news/MU/micron-technology-to-report-fiscal-third-quarter-results-on-june-24-22gcrbths4gp.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "반도체(SOX 직결)",
          "centerpiece": true,
          "sectorDirect": true,
          "basis": "마이크론 실적·가이던스는 필라델피아 반도체지수(SOX)의 직접 촉매(옵션 내재 변동 ~10~16%). ※반도체 직접 충격 — 일반 베타(SOX×2.8) 대신 SOX 중심 직접 추정.",
          "branches": [
            {
              "name": "호실적·가이던스 상향",
              "indices": {
                "나스닥종합": "+1.2~+2.8%",
                "S&P500": "+0.6~+1.5%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+4.0~+8.0%",
                "러셀2000": "+0.3~+1.2%"
              }
            },
            {
              "name": "대체로 부합",
              "indices": {
                "나스닥종합": "-0.6~+0.6%",
                "S&P500": "-0.4~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-1.5~+1.5%",
                "러셀2000": "-0.3~+0.3%"
              }
            },
            {
              "name": "실적·가이던스 하회",
              "indices": {
                "나스닥종합": "-2.8~-1.2%",
                "S&P500": "-1.5~-0.6%",
                "다우": "-0.8~-0.2%",
                "필라델피아반도체": "-8.0~-4.0%",
                "러셀2000": "-1.2~-0.3%"
              }
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-25",
      "region": "US",
      "category": "물가",
      "title": "5월 PCE 물가·개인소득/지출",
      "detail": "BEA 개인소득·지출(5월 PCE 물가지수 포함) 발표 예정, 6/25(목) 8:30 ET. 연준 선호 물가지표. 참고: 4월 PCE 헤드라인 MoM +0.4%·YoY +3.8%, 근원 MoM +0.2%·YoY +3.3%. 5월 수치 미발표.",
      "importance": "높음",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.bea.gov/news/2026/personal-income-and-outlays-april-2026",
        "https://www.bea.gov/news/schedule"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "물가→금리",
          "basis": "이 지표는 다음 FOMC(7/29) 금리경로 기대를 바꿔 증시에 파급.",
          "rateTree": {
            "title": "다음 7/29 FOMC 결정 확률 (CME FedWatch)",
            "probs": [
              {
                "label": "동결",
                "pct": 88.8
              },
              {
                "label": "인하",
                "pct": 2.6
              },
              {
                "label": "인상",
                "pct": 8.6
              }
            ],
            "note": "5월 CPI +4.2%·PPI +6.5% 인플레 충격으로 2026년 인하 베팅 사실상 소멸(인하 0회 76.8%), 9월 인상 내재확률 26%까지 상승. 신임 의장 Warsh(비둘기) vs 매파 FOMC '집안싸움' 구도."
          },
          "branches": [
            {
              "name": "예상 상회 — 인플레 재가속(매파적)",
              "indices": {
                "나스닥종합": "-3.0~-1.8%",
                "S&P500": "-2.0~-1.2%",
                "다우": "-1.5~-0.9%",
                "필라델피아반도체": "-5.6~-3.4%",
                "러셀2000": "-2.2~-1.3%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.6%",
                "S&P500": "-0.3~+0.4%",
                "다우": "-0.2~+0.3%",
                "필라델피아반도체": "-0.8~+1.1%",
                "러셀2000": "-0.3~+0.4%"
              },
              "occurred": false
            },
            {
              "name": "예상 하회 — 디스인플레(비둘기)",
              "indices": {
                "나스닥종합": "+1.5~+2.7%",
                "S&P500": "+1.0~+1.8%",
                "다우": "+0.8~+1.4%",
                "필라델피아반도체": "+2.8~+5.0%",
                "러셀2000": "+1.4~+2.6%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-25",
      "region": "US",
      "category": "지표",
      "title": "1분기 GDP 확정치(3차 추정)",
      "detail": "BEA 1분기 GDP 3차(확정) 추정치 발표 예정, 6/25 8:30 ET. 2차 추정(5/28)은 연율 +1.6%(속보 +2.0%에서 0.4%p 하향, 투자·소비 하향). 기업이익 동시 발표.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.bea.gov/news/2026/gdp-second-estimate-and-corporate-profits-1st-quarter-2026",
        "https://www.bea.gov/data/gdp/gross-domestic-product"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-25",
      "region": "KR",
      "category": "통화정책",
      "title": "6월 금통위는 금융안정회의 - 기준금리 결정 없음",
      "detail": "사실(기준금리 결정 없음)은 확인됨: 한은 2026년 통방결정회의는 1·2·4·5·7·8·10·11월 8회뿐, 3·6·9·12월은 금융안정회의. 따라서 6월 기준금리 결정 미실시, 다음 결정은 7월(6월 금융안정회의 의사록 7/10 공개). 단 회의 정확 일자(6/25)는 1차 출처 본문(첨부파일 한정)에서 확정 불가하여 날짜 신뢰도 낮음·중요도 과대 → 하향.",
      "importance": "낮음",
      "status": "예정",
      "confidence": "low",
      "sources": [
        "https://www.newsis.com/view/NISX20251030_0003383692",
        "https://www.bok.or.kr/portal/bbs/B0000502/view.do?menuNo=201265&nttId=10094300"
      ],
      "verdict": "downgraded",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    },
    {
      "date": "2026-06-26",
      "region": "US",
      "category": "수급",
      "title": "러셀 지수 리밸런싱(리컨스티튜션) 발효",
      "detail": "FTSE 러셀 美 지수 2026년부터 반기 리컨스티튜션 복귀: 6/26(금) 마감 후 신지수 발효, 6/29(월) 개장부터 적용. 6/26 종가에 대규모 패시브 리밸런싱 거래 집중.",
      "importance": "높음",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.lseg.com/en/media-centre/press-releases/ftse-russell/2026/ftse-russell-begins-june-2026-semi-annual-russell-us-indexes-reconstitution",
        "https://www.lseg.com/en/ftse-russell/russell-reconstitution"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "수급(패시브)",
          "noDirectional": true,
          "basis": "러셀 지수 리밸런싱 — 대규모 패시브 리밸런싱 거래가 종가에 집중. 방향성보다 거래량·변동성 확대(특히 소형주 러셀2000)."
        }
      }
    },
    {
      "date": "2026-06-26",
      "region": "US",
      "category": "심리",
      "title": "6월 미시간대 소비자심리지수(확정)",
      "detail": "6월 미시간대 소비자심리지수 확정치 발표 예정(6/26). 잠정치는 48.9. 실제 확정 수치 미발표.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.sca.isr.umich.edu/",
        "https://seekingalpha.com/news/4602987-consumer-sentiment-jumps-past-consensus-in-june"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-30",
      "region": "US",
      "category": "심리",
      "title": "6월 컨퍼런스보드 소비자신뢰지수",
      "detail": "컨퍼런스보드 6월 소비자신뢰지수 발표 예정(6/30 화, 10:00 ET). 5월치는 93.1(4월 상향 93.8에서 -0.7p, 중동전 인플레 영향). 6월 수치 미발표.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.prnewswire.com/news-releases/us-consumer-confidence-edged-downward-in-may-302781849.html",
        "https://www.conference-board.org/topics/consumer-confidence/"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "성장/소비",
          "basis": "성장·소비 지표 서프라이즈 방향에 따른 지수 영향(모델 추정).",
          "branches": [
            {
              "name": "호조(견조한 성장)",
              "indices": {
                "나스닥종합": "+0.4~+1.5%",
                "S&P500": "+0.3~+1.0%",
                "다우": "+0.2~+0.8%",
                "필라델피아반도체": "+0.8~+2.8%",
                "러셀2000": "+0.4~+1.2%"
              },
              "occurred": false
            },
            {
              "name": "예상 부합",
              "indices": {
                "나스닥종합": "-0.4~+0.4%",
                "S&P500": "-0.3~+0.3%",
                "다우": "-0.2~+0.2%",
                "필라델피아반도체": "-0.8~+0.8%",
                "러셀2000": "-0.3~+0.3%"
              },
              "occurred": false
            },
            {
              "name": "부진 — 경기둔화 우려",
              "indices": {
                "나스닥종합": "-2.0~-0.6%",
                "S&P500": "-1.3~-0.4%",
                "다우": "-1.0~-0.3%",
                "필라델피아반도체": "-3.6~-1.1%",
                "러셀2000": "-1.3~-0.4%"
              },
              "occurred": false
            }
          ]
        }
      }
    },
    {
      "date": "2026-06-30",
      "region": "US",
      "category": "실적",
      "title": "Nike(NKE) FY26 4분기 실적 발표 (예정, 장 마감 후)",
      "detail": "6/30(화) 오후 1:15(PT) 실적 발표, 2:00(PT) 콘콜 예정. 소비재 대표주로 소비심리 가늠자. 반기말·분기말 리밸런싱 시점과 겹침.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.businesswire.com/news/home/20260528240663/en/NIKE-Inc.-Announces-Fourth-Quarter-Fiscal-2026-Earnings-and-Conference-Call",
        "https://www.stocktitan.net/news/NKE/nike-inc-announces-fourth-quarter-fiscal-2026-earnings-and-iwzljao8o4by.html"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "개별 종목 실적",
          "noDirectional": true,
          "basis": "개별 종목 실적(페덱스=글로벌 물동량, 액센추어=IT컨설팅 수요, 나이키=소비) — 지수 직접 영향은 제한적이나 해당 업황 신호로 섹터 심리에 파급."
        }
      }
    },
    {
      "date": "2026-06-30",
      "region": "KR",
      "category": "이벤트",
      "title": "5월 산업활동동향 발표 예정 (통계청/국가데이터처)",
      "detail": "5월 산업생산·소매판매·설비투자 발표 예정(6/30). 익월말 공표 관행 부합. 5월 수치는 발표 시점까지 미확정(예정).",
      "importance": "보통",
      "status": "예정",
      "confidence": "medium",
      "sources": [
        "https://mods.go.kr/menu.es?mid=a10301050100",
        "https://www.bok.or.kr/portal/stats/statsPublictSchdul/listCldr.do?menuNo=200775"
      ],
      "verdict": "confirmed",
      "usImpact": {
        "realized": null,
        "realizedNA": null,
        "scenario": {
          "kind": "한국 이벤트",
          "krSide": true,
          "basis": "한국발 이벤트 — 미국 지수에 대한 직접 영향은 제한적(인과는 주로 미→한 방향). 한국 반도체(삼성·하이닉스) 통해 SOX 심리에 간접 파급 가능."
        }
      }
    }
  ]
};
