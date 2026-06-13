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
    "calendar": "멀티에이전트 웹리서치 6트랙 + 적대적 검증(독립 재확인) 후 중복 병합. 총 71건 (confirmed 64·date-corrected 3·downgraded 4). dropped(환각) 제외, 각 항목 1차 출처 링크 표기."
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
    },
    {
      "date": "2026-06-05",
      "region": "US",
      "category": "고용",
      "title": "5월 비농업고용(NFP)·실업률",
      "detail": "5월 NFP +17.2만(예상 +8.8만 대폭 상회). 실업률 4.3% 유지. 시간당임금 MoM +0.3%·YoY +3.4%. 3·4월 합계 9.3만 상향(3월 +2.9만, 4월 +6.4만). 레저·접객, 지방정부, 헬스케어 증가. 그날 증시 핵심 변수.",
      "importance": "최우선",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.bls.gov/news.release/empsit.nr0.htm",
        "https://www.bloomberg.com/news/articles/2026-06-05/us-adds-172-000-jobs-in-may-beating-all-economists-estimates",
        "https://www.cnbc.com/2026/06/05/jobs-report-may-2026.html"
      ],
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
    },
    {
      "date": "2026-06-05",
      "region": "US",
      "category": "고용",
      "title": "5월 비농업고용 +17.2만(컨센 ~8만 대폭 상회)·실업률 4.3%",
      "detail": "5월 비농업 신규고용 +172,000으로 컨센서스(약 80천) 대폭 상회, 4월은 +179천으로 상향 수정. 실업률 4.3% 유지, 시간당임금 +0.3%(MoM)·+3.4%(YoY). 강한 고용에 금리인하 기대 후퇴·인상 베팅까지 나오며 금리 민감주 투매 증폭. [검증/일부정정] +17.2만·실업률 4.3% 확인. 단 원문의 '3·4월 합계 +93천 상향 수정'은 미확인 — 출처는 4월 +179천(상향)만 명시.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/05/jobs-report-may-2026.html",
        "https://www.bls.gov/news.release/empsit.nr0.htm"
      ],
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "date-corrected"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "downgraded"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
        "https://www.bls.gov/news.release/cpi.nr0.htm"
      ],
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
    },
    {
      "date": "2026-06-10",
      "region": "US",
      "category": "물가",
      "title": "5월 CPI 전년比 +4.2%(3년 만에 최고)·근원 +2.9%",
      "detail": "5월 CPI 전년比 +4.2%로 약 3년 만 최고(컨센 부합), 전월比 +0.5%. 에너지 급등(미·이란發 유가)이 견인. 근원 CPI +0.2%(MoM)·+2.9%(YoY). [검증] BLS·CNBC로 +4.2%·근원 +2.9% 확인. 발표일 6/10 정확.",
      "importance": "높음",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://www.cnbc.com/2026/06/10/cpi-inflation-report-may-2026.html",
        "https://www.bls.gov/news.release/archives/cpi_06102026.htm"
      ],
      "verdict": "confirmed"
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
      "verdict": "downgraded"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "downgraded"
    },
    {
      "date": "2026-06-12",
      "region": "US",
      "category": "물가",
      "title": "6월 미시간대 소비자심리지수(잠정)",
      "detail": "6월 잠정 48.9(전월 44.8)로 약 +9%(4개월 만 첫 반등, 예상 46.0 상회). 휘발유 가격 하락이 견인. 1년 기대인플레 4.6%(전월 4.8%), 장기 3.4%(3.9%). 여전히 역사적 저점권(1970년대 이후 둘째로 낮음).",
      "importance": "보통",
      "status": "발생",
      "confidence": "high",
      "sources": [
        "https://seekingalpha.com/news/4602987-consumer-sentiment-jumps-past-consensus-in-june",
        "https://www.bloomberg.com/news/articles/2026-06-12/us-consumer-sentiment-picks-up-on-easing-gasoline-prices"
      ],
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "date-corrected"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "date-corrected"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "downgraded"
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
      "verdict": "confirmed"
    },
    {
      "date": "2026-06-26",
      "region": "US",
      "category": "물가",
      "title": "6월 미시간대 소비자심리지수(확정)",
      "detail": "6월 미시간대 소비자심리지수 확정치 발표 예정(6/26). 잠정치는 48.9. 실제 확정 수치 미발표.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.sca.isr.umich.edu/",
        "https://seekingalpha.com/news/4602987-consumer-sentiment-jumps-past-consensus-in-june"
      ],
      "verdict": "confirmed"
    },
    {
      "date": "2026-06-30",
      "region": "US",
      "category": "물가",
      "title": "6월 컨퍼런스보드 소비자신뢰지수",
      "detail": "컨퍼런스보드 6월 소비자신뢰지수 발표 예정(6/30 화, 10:00 ET). 5월치는 93.1(4월 상향 93.8에서 -0.7p, 중동전 인플레 영향). 6월 수치 미발표.",
      "importance": "보통",
      "status": "예정",
      "confidence": "high",
      "sources": [
        "https://www.prnewswire.com/news-releases/us-consumer-confidence-edged-downward-in-may-302781849.html",
        "https://www.conference-board.org/topics/consumer-confidence/"
      ],
      "verdict": "confirmed"
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
      "verdict": "confirmed"
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
      "verdict": "confirmed"
    }
  ]
};
