/* Polaris Core — 파생 통계 (자동생성, 수정 금지)
   생성: data/build-derived.mjs · 입력: market-ledger/data.js(실측)
   표본=2026-06 8~10 거래일. 소표본 — 통계적 일반화/예측 보장 아님. 관측 기록 + 교육용. 투자자문 아님. */
window.POLARIS_DERIVED = {
  "asOf": "2026-06-13",
  "pricePeriod": "2026-06-01 ~ 2026-06-12",
  "generatedFrom": "market-ledger/data.js (window.LEDGER) — 실측·이중검증",
  "formula": {
    "correlation": "Pearson r, 겹치는 거래일 일간수익률. SOX/IXIC/GSPC=지수 chgPct, SOXL/SOXS=regChgPct(본장), 삼성/하이닉스=chgPct.",
    "transmission": "krOpenGap%=(open-전일close)/전일close*100. 미국세션 vs 한국 시가갭의 Pearson r·회귀기울기·부호일치율.",
    "rangePct": "KOSPI 일중폭%=(high-low)/close*100 (ATR 근사). 미국 rows엔 일중 H/L 부재 → meanAbsRegChgPct를 변동성 프록시로."
  },
  "caveat": "표본=2026-06 8~10 거래일. 소표본 — 통계적 일반화/예측 보장 아님. 관측 기록 + 교육용. 투자자문 아님.",
  "dates": [
    "2026-06-01",
    "2026-06-02",
    "2026-06-03",
    "2026-06-04",
    "2026-06-05",
    "2026-06-08",
    "2026-06-09",
    "2026-06-10",
    "2026-06-11",
    "2026-06-12"
  ],
  "correlationMatrix": {
    "SOX": {
      "SOX": {
        "r": 1,
        "n": 10
      },
      "SOXL": {
        "r": 0.998,
        "n": 10
      },
      "SAMSUNG": {
        "r": 0.146,
        "n": 9
      },
      "HYNIX": {
        "r": 0.249,
        "n": 9
      },
      "IXIC": {
        "r": 0.913,
        "n": 10
      },
      "GSPC": {
        "r": 0.846,
        "n": 10
      },
      "SOXS": {
        "r": -0.998,
        "n": 10
      }
    },
    "SOXL": {
      "SOX": {
        "r": 0.998,
        "n": 10
      },
      "SOXL": {
        "r": 1,
        "n": 10
      },
      "SAMSUNG": {
        "r": 0.147,
        "n": 9
      },
      "HYNIX": {
        "r": 0.272,
        "n": 9
      },
      "IXIC": {
        "r": 0.907,
        "n": 10
      },
      "GSPC": {
        "r": 0.843,
        "n": 10
      },
      "SOXS": {
        "r": -1,
        "n": 10
      }
    },
    "SAMSUNG": {
      "SOX": {
        "r": 0.146,
        "n": 9
      },
      "SOXL": {
        "r": 0.147,
        "n": 9
      },
      "SAMSUNG": {
        "r": 1,
        "n": 9
      },
      "HYNIX": {
        "r": 0.793,
        "n": 9
      },
      "IXIC": {
        "r": 0.237,
        "n": 9
      },
      "GSPC": {
        "r": 0.338,
        "n": 9
      },
      "SOXS": {
        "r": -0.145,
        "n": 9
      }
    },
    "HYNIX": {
      "SOX": {
        "r": 0.249,
        "n": 9
      },
      "SOXL": {
        "r": 0.272,
        "n": 9
      },
      "SAMSUNG": {
        "r": 0.793,
        "n": 9
      },
      "HYNIX": {
        "r": 1,
        "n": 9
      },
      "IXIC": {
        "r": 0.343,
        "n": 9
      },
      "GSPC": {
        "r": 0.453,
        "n": 9
      },
      "SOXS": {
        "r": -0.277,
        "n": 9
      }
    },
    "IXIC": {
      "SOX": {
        "r": 0.913,
        "n": 10
      },
      "SOXL": {
        "r": 0.907,
        "n": 10
      },
      "SAMSUNG": {
        "r": 0.237,
        "n": 9
      },
      "HYNIX": {
        "r": 0.343,
        "n": 9
      },
      "IXIC": {
        "r": 1,
        "n": 10
      },
      "GSPC": {
        "r": 0.976,
        "n": 10
      },
      "SOXS": {
        "r": -0.912,
        "n": 10
      }
    },
    "GSPC": {
      "SOX": {
        "r": 0.846,
        "n": 10
      },
      "SOXL": {
        "r": 0.843,
        "n": 10
      },
      "SAMSUNG": {
        "r": 0.338,
        "n": 9
      },
      "HYNIX": {
        "r": 0.453,
        "n": 9
      },
      "IXIC": {
        "r": 0.976,
        "n": 10
      },
      "GSPC": {
        "r": 1,
        "n": 10
      },
      "SOXS": {
        "r": -0.849,
        "n": 10
      }
    },
    "SOXS": {
      "SOX": {
        "r": -0.998,
        "n": 10
      },
      "SOXL": {
        "r": -1,
        "n": 10
      },
      "SAMSUNG": {
        "r": -0.145,
        "n": 9
      },
      "HYNIX": {
        "r": -0.277,
        "n": 9
      },
      "IXIC": {
        "r": -0.912,
        "n": 10
      },
      "GSPC": {
        "r": -0.849,
        "n": 10
      },
      "SOXS": {
        "r": 1,
        "n": 10
      }
    }
  },
  "transmission": {
    "note": "lag0=미국 date D vs 한국 같은날 시가갭(전야 영향 근사), lag1=미국 date D 세션 vs 한국 다음 거래일 시가갭. 소표본 주의.",
    "SOX_to_SAMSUNG": {
      "lag0": {
        "r": 0.022,
        "n": 8,
        "slope": 0.023,
        "signHitRate": 0.625
      },
      "lag1": {
        "r": 0.836,
        "n": 9,
        "slope": 0.893,
        "signHitRate": 0.778
      }
    },
    "SOX_to_HYNIX": {
      "lag0": {
        "r": 0.034,
        "n": 8,
        "slope": 0.036,
        "signHitRate": 0.625
      },
      "lag1": {
        "r": 0.834,
        "n": 9,
        "slope": 0.906,
        "signHitRate": 0.778
      }
    },
    "SOXL_to_SAMSUNG": {
      "lag0": {
        "r": 0.041,
        "n": 8,
        "slope": 0.015,
        "signHitRate": 0.625
      },
      "lag1": {
        "r": 0.822,
        "n": 9,
        "slope": 0.297,
        "signHitRate": 0.778
      }
    },
    "SOXL_to_HYNIX": {
      "lag0": {
        "r": 0.056,
        "n": 8,
        "slope": 0.02,
        "signHitRate": 0.625
      },
      "lag1": {
        "r": 0.824,
        "n": 9,
        "slope": 0.303,
        "signHitRate": 0.778
      }
    }
  },
  "perSymbol": {
    "SAMSUNG": {
      "days": 9,
      "meanChgPct": 0.436,
      "stdChgPct": 7.434,
      "upDays": 4,
      "downDays": 5,
      "maxUpPct": 10.09,
      "maxDownPct": -10.18,
      "avgRangePct": 6.915,
      "maxRangePct": 10.029,
      "avgGapPct": -1.176,
      "maxAbsGapPct": 10.942,
      "avgVolume": 35168362
    },
    "HYNIX": {
      "days": 9,
      "meanChgPct": -0.642,
      "stdChgPct": 7.781,
      "upDays": 4,
      "downDays": 5,
      "maxUpPct": 15.91,
      "maxDownPct": -9.92,
      "avgRangePct": 7.419,
      "maxRangePct": 11.355,
      "avgGapPct": -1.38,
      "maxAbsGapPct": 10.338,
      "avgVolume": 5563051
    },
    "SOXL": {
      "days": 10,
      "meanRegChgPct": 1.652,
      "stdRegChgPct": 15.821,
      "meanAbsRegChgPct": 12.036,
      "upDays": 6,
      "downDays": 4,
      "maxUpPct": 23.99,
      "maxDownPct": -30.51,
      "avgExtVsRegPct": -1.596,
      "avgVolume": 70782190
    },
    "SOXS": {
      "days": 10,
      "meanRegChgPct": -1.728,
      "stdRegChgPct": 16.209,
      "meanAbsRegChgPct": 12.22,
      "upDays": 4,
      "downDays": 6,
      "maxUpPct": 31.54,
      "maxDownPct": -24.35,
      "avgExtVsRegPct": 1.377,
      "avgVolume": 802869730
    }
  },
  "quantiles": {
    "note": "임계값 산출용 실측 분위수. 각 항목 computedFrom·n 표기. 소표본(n<20) — exploratory.",
    "SOX_chgPct": {
      "p25": -2.095,
      "p50": 1.225,
      "p75": 4.588,
      "n": 10,
      "computedFrom": "LEDGER.indices.rows.SOX[].chgPct"
    },
    "SOX_absChgPct": {
      "p50": 2.86,
      "p75": 5.805,
      "n": 10,
      "computedFrom": "|LEDGER.indices.rows.SOX[].chgPct|"
    },
    "SOXL_regChgPct": {
      "p25": -5.925,
      "p75": 13.208,
      "n": 10,
      "computedFrom": "LEDGER.us.soxl[].regChgPct"
    },
    "SOXS_regChgPct": {
      "p25": -13.865,
      "p75": 5.488,
      "n": 10,
      "computedFrom": "LEDGER.us.soxs[].regChgPct"
    },
    "inverseError": {
      "p75": 0.438,
      "p90": 0.985,
      "n": 10,
      "computedFrom": "|SOXL.regChgPct + SOXS.regChgPct|"
    },
    "extVsRegAbs": {
      "p50": 2.055,
      "p75": 4.04,
      "n": 20,
      "computedFrom": "|SOXL/SOXS extVsRegPct| 풀"
    },
    "KR_gapAbs": {
      "p50": 4.437,
      "p75": 7.597,
      "n": 16,
      "computedFrom": "|(open-prevClose)/prevClose| 삼성·하이닉스 풀"
    },
    "lead_SOX_minus_IXIC": {
      "p25": -1.432,
      "p75": 4.133,
      "n": 10,
      "computedFrom": "SOX.chgPct − IXIC.chgPct"
    },
    "flipTotal_US": {
      "p90": 8.3,
      "n": 20,
      "computedFrom": "soxl+soxs flips.totalUp+totalDown"
    },
    "flipTotal_KR": {
      "p90": 4,
      "n": 18,
      "computedFrom": "samsung+hynix flips.totalUp+totalDown"
    },
    "crossAbsPct_US": {
      "p50": 0.405,
      "n": 62,
      "computedFrom": "|crossings.pct| soxl+soxs"
    },
    "crossAbsPct_KR": {
      "p50": 0.43,
      "n": 19,
      "computedFrom": "|crossings.pct| samsung+hynix"
    }
  }
};
