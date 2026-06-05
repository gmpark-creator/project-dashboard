/* Future Stack Demos — 구조화 데이터 (워크플로 생성, ID 정합성 검증/정정 완료).
   실제 시장/AI/인프라 아님 — 전부 교육용 가상 데이터. */
window.FUTURE_STACK_DEMOS = {
  "premarket": {
    "stacks": [
      {
        "tech": "Go",
        "where": "시장 데이터 수집 데몬 (백엔드 인제스천 계층)",
        "whatChanges": "여러 거래소·뉴스 소스를 동시에 수백 개 연결로 받아도 가볍게 버티고, 수집한 틱을 수 밀리초 안에 다음 단계로 흘려보냅니다.",
        "whyChosen": "고루틴 기반 동시성으로 다수 소켓을 적은 메모리로 관리할 수 있고, 단일 바이너리로 배포가 단순하기 때문입니다.",
        "simulated": "이 정적 프리뷰에는 실제 Go 데몬이 돌지 않습니다. 수집된 척하는 미리 만든 timeline·heatmap 숫자를 화면에서 재생할 뿐입니다."
      },
      {
        "tech": "Redis",
        "where": "실시간 캐시 및 Pub/Sub 메시지 버스 (수집과 배포 사이 중간 계층)",
        "whatChanges": "최신 지표 한 장면을 메모리에 두어 즉시 응답하고, 새 값이 들어오면 구독 중인 모든 화면에 동시에 흘려보냅니다.",
        "whyChosen": "읽기·쓰기가 매우 빠르고 Pub/Sub이 내장되어 있어, 캐시와 실시간 알림을 한 컴포넌트로 해결할 수 있기 때문입니다.",
        "simulated": "실제 Redis 인스턴스는 없습니다. 캐시 적중이나 채널 발행은 일어나지 않고, 정적 JSON이 메모리 캐시인 척 그려집니다."
      },
      {
        "tech": "DuckDB",
        "where": "분석 집계 엔진 (시간대별 압력 지표 계산 계층)",
        "whatChanges": "원시 틱을 분 단위·시간대별로 묶어 가격 압력·매크로 압력 같은 파생 지표를 즉석에서 계산해 냅니다.",
        "whyChosen": "별도 서버 없이 파일 위에서 컬럼형 분석 쿼리를 빠르게 돌릴 수 있어, 가벼운 분석 파이프라인에 적합하기 때문입니다.",
        "simulated": "이 데모에는 DuckDB 쿼리가 실행되지 않습니다. 집계 결과는 사람이 손으로 채워 둔 가상 수치이며 실제 SQL 산출물이 아닙니다."
      },
      {
        "tech": "WebSocket",
        "where": "서버에서 브라우저로의 실시간 푸시 채널 (전송 계층)",
        "whatChanges": "브라우저가 반복해서 요청하지 않아도 새 값이 생길 때마다 서버가 먼저 밀어 주어 화면이 살아 움직이게 합니다.",
        "whyChosen": "양방향 지속 연결로 지연이 낮고, 시세처럼 끊임없이 갱신되는 데이터에 폴링보다 효율적이기 때문입니다.",
        "simulated": "실제 소켓 연결은 열리지 않습니다. 정적 데이터를 타이머로 한 칸씩 보여 주며 실시간 푸시를 흉내만 냅니다."
      },
      {
        "tech": "TanStack Query",
        "where": "프런트엔드 데이터 동기화·캐싱 계층 (React 상태 관리)",
        "whatChanges": "서버 데이터의 로딩·갱신·재시도·캐시 무효화를 자동으로 관리해, 화면이 항상 최신이면서도 깜빡임이 적게 유지됩니다.",
        "whyChosen": "서버 상태 동기화의 번거로운 로직을 표준화해 주고, WebSocket 갱신과 캐시를 깔끔하게 이어 붙일 수 있기 때문입니다.",
        "simulated": "실제 네트워크 쿼리는 없습니다. 데이터는 번들에 박혀 있어, 캐시 무효화나 재요청은 동작을 흉내 내는 연출일 뿐입니다."
      },
      {
        "tech": "ECharts",
        "where": "대시보드 시각화 계층 (타임라인·히트맵·게이지 차트)",
        "whatChanges": "세 레인 타임라인과 지표 히트맵을 부드러운 애니메이션과 함께 그려, 입문자도 압력의 흐름을 직관적으로 읽게 합니다.",
        "whyChosen": "대용량 시계열과 다양한 차트 유형을 한 라이브러리로 안정적으로 그릴 수 있고 한국어 환경에서도 잘 동작하기 때문입니다.",
        "simulated": "차트는 실제로 그려지지만, 그 안에 들어가는 수치는 모두 가상입니다. 시장과 연결된 실시간 갱신은 없습니다."
      },
      {
        "tech": "Hugging Face Transformers",
        "where": "뉴스 텍스트 신호 처리 계층 (헤드라인 감성·요인 추출)",
        "whatChanges": "쏟아지는 매크로·반도체 헤드라인을 감성 점수와 영향 요인으로 분류해, 텍스트를 숫자 신호로 바꿔 줍니다.",
        "whyChosen": "사전 학습 언어 모델을 손쉽게 불러와 감성 분류·토큰 추출 같은 작업을 빠르게 구성할 수 있기 때문입니다.",
        "simulated": "실제 모델 추론은 일어나지 않습니다. 헤드라인 감성·토큰·요인은 미리 라벨링한 가상 값으로, 실시간 자연어 처리 결과가 아닙니다."
      },
      {
        "tech": "React",
        "where": "대시보드 UI 컴포넌트 계층 (콕핏 화면 전체)",
        "whatChanges": "패널·시나리오 토글·히트맵 셀을 재사용 가능한 컴포넌트로 구성해, 상태 변화가 즉시 화면에 반영됩니다.",
        "whyChosen": "컴포넌트 단위 구성과 풍부한 생태계로 인터랙티브 대시보드를 빠르고 일관되게 만들 수 있기 때문입니다.",
        "simulated": "UI 컴포넌트는 실제로 렌더링되지만, 표시되는 모든 데이터는 가상이며 백엔드와 연결되어 있지 않습니다."
      },
      {
        "tech": "TypeScript",
        "where": "프런트엔드 전 계층의 타입 안전 코드베이스",
        "whatChanges": "지표·시나리오·헤드라인 데이터 구조에 타입을 부여해, 잘못된 필드나 누락을 컴파일 단계에서 잡아냅니다.",
        "whyChosen": "데이터 형태가 복잡한 대시보드에서 런타임 오류를 줄이고 협업 시 계약을 명확히 하기 때문입니다.",
        "simulated": "타입 검사는 빌드 시점에만 작용합니다. 프리뷰 화면에서는 타입이 보장하는 데이터 자체가 가상이라는 점은 변하지 않습니다."
      },
      {
        "tech": "Vite",
        "where": "프런트엔드 빌드·개발 서버 도구",
        "whatChanges": "빠른 개발 서버와 번들링으로 화면 수정이 즉시 반영되고, 최종 정적 산출물을 가볍게 묶어 줍니다.",
        "whyChosen": "시작이 빠르고 설정이 단순하며 React·TypeScript와 매끄럽게 맞물려, 데모를 빠르게 반복 개발할 수 있기 때문입니다.",
        "simulated": "Vite는 이 정적 데모를 빌드하는 도구일 뿐, 화면 안의 시장 데이터와는 무관합니다. 실시간 요소는 모두 흉내입니다."
      },
      {
        "tech": "Python",
        "where": "백엔드 분석·모델 연동 스크립트 계층 (DuckDB·Transformers 오케스트레이션)",
        "whatChanges": "수집 데이터를 분석 단계로 넘기고 텍스트 모델을 호출하는 접착제 역할을 해, 여러 처리 단계를 하나의 흐름으로 엮습니다.",
        "whyChosen": "데이터 분석·머신러닝 라이브러리 생태계가 풍부해, 집계와 텍스트 신호 처리를 빠르게 시제품화할 수 있기 때문입니다.",
        "simulated": "이 프리뷰에는 Python 프로세스가 실행되지 않습니다. 분석·모델 결과로 보이는 모든 값은 사전에 작성된 가상 데이터입니다."
      },
      {
        "tech": "D3.js",
        "where": "히트맵·플로우 다이어그램의 정밀 커스텀 시각화 계층",
        "whatChanges": "표준 차트로 표현하기 어려운 지표 연결선이나 파이프라인 흐름도를 픽셀 단위로 세밀하게 그려 냅니다.",
        "whyChosen": "데이터에서 화면 요소로의 매핑을 자유롭게 제어할 수 있어, 교육용 도해처럼 의도된 시각 설명에 적합하기 때문입니다.",
        "simulated": "D3로 그린 도해는 보이지만, 그 안의 수치와 연결은 학습용으로 꾸민 가상 시나리오입니다. 실제 데이터 흐름이 아닙니다."
      }
    ],
    "scenarios": [
      {
        "id": "s1",
        "name": "반도체 강세",
        "biases": [
          {
            "category": "미국 지수",
            "bias": 18
          },
          {
            "category": "한국 지수",
            "bias": 28
          },
          {
            "category": "금리",
            "bias": -6
          },
          {
            "category": "환율",
            "bias": -10
          },
          {
            "category": "원자재",
            "bias": 4
          },
          {
            "category": "반도체 테마",
            "bias": 36
          }
        ],
        "priceShift": 22,
        "macroShift": 8,
        "newsShift": 24,
        "sentimentShift": 40,
        "summary": "미국 빅테크의 AI 투자 확대 소식에 반도체 수요 기대가 커지는 가상 국면입니다. HBM·메모리 관련 지표가 가장 강하게 오르고, 한국 지수 프록시도 동반 상승합니다. 위험 선호가 살아나며 환율 압력은 다소 누그러집니다."
      },
      {
        "id": "s2",
        "name": "달러 강세",
        "biases": [
          {
            "category": "미국 지수",
            "bias": -8
          },
          {
            "category": "한국 지수",
            "bias": -16
          },
          {
            "category": "금리",
            "bias": 12
          },
          {
            "category": "환율",
            "bias": 34
          },
          {
            "category": "원자재",
            "bias": -14
          },
          {
            "category": "반도체 테마",
            "bias": -12
          }
        ],
        "priceShift": -14,
        "macroShift": 18,
        "newsShift": -6,
        "sentimentShift": -18,
        "summary": "미국 경기 호조로 달러가 전방위 강세를 보이는 가상 국면입니다. USD/KRW 프록시가 크게 뛰며 환율 카테고리가 과열로 치닫고, 원자재와 신흥국 성격의 한국 지수에는 부담이 커집니다. 매크로 압력이 전반적으로 높아집니다."
      },
      {
        "id": "s3",
        "name": "금리 급등",
        "biases": [
          {
            "category": "미국 지수",
            "bias": -22
          },
          {
            "category": "한국 지수",
            "bias": -20
          },
          {
            "category": "금리",
            "bias": 38
          },
          {
            "category": "환율",
            "bias": 16
          },
          {
            "category": "원자재",
            "bias": -6
          },
          {
            "category": "반도체 테마",
            "bias": -24
          }
        ],
        "priceShift": -26,
        "macroShift": 26,
        "newsShift": -14,
        "sentimentShift": -30,
        "summary": "예상보다 뜨거운 물가 지표로 미 국채 금리가 급등하는 가상 국면입니다. 금리 카테고리가 극단으로 치솟으며 성장주 성격이 강한 반도체 테마와 양대 지수가 동반 약세를 보입니다. 위험 회피 심리가 뉴스 감성을 끌어내립니다."
      },
      {
        "id": "s4",
        "name": "뉴스 충격",
        "biases": [
          {
            "category": "미국 지수",
            "bias": -18
          },
          {
            "category": "한국 지수",
            "bias": -22
          },
          {
            "category": "금리",
            "bias": -4
          },
          {
            "category": "환율",
            "bias": 20
          },
          {
            "category": "원자재",
            "bias": 24
          },
          {
            "category": "반도체 테마",
            "bias": -16
          }
        ],
        "priceShift": -20,
        "macroShift": 10,
        "newsShift": -28,
        "sentimentShift": -46,
        "summary": "장 시작 직전 돌발 지정학 헤드라인이 터지는 가상 국면입니다. 뉴스 감성 레인이 급락하고 안전자산·원자재로 자금이 쏠리며 환율과 원자재 카테고리가 튀어 오릅니다. 위험자산인 지수와 반도체 테마는 변동성 속에 밀립니다."
      }
    ],
    "heatmap": [
      {
        "id": "h01",
        "category": "미국 지수",
        "label": "S&P500 선물",
        "base": 54
      },
      {
        "id": "h02",
        "category": "미국 지수",
        "label": "나스닥100 선물",
        "base": 58
      },
      {
        "id": "h03",
        "category": "미국 지수",
        "label": "다우 선물",
        "base": 49
      },
      {
        "id": "h04",
        "category": "미국 지수",
        "label": "러셀2000 선물",
        "base": 46
      },
      {
        "id": "h05",
        "category": "한국 지수",
        "label": "KOSPI 야간 프록시",
        "base": 52
      },
      {
        "id": "h06",
        "category": "한국 지수",
        "label": "KOSDAQ 야간 프록시",
        "base": 55
      },
      {
        "id": "h07",
        "category": "한국 지수",
        "label": "코스피200 선물 프록시",
        "base": 51
      },
      {
        "id": "h08",
        "category": "한국 지수",
        "label": "MSCI 한국 ETF 프록시",
        "base": 48
      },
      {
        "id": "h09",
        "category": "금리",
        "label": "미 10년물 국채금리",
        "base": 56
      },
      {
        "id": "h10",
        "category": "금리",
        "label": "미 2년물 국채금리",
        "base": 59
      },
      {
        "id": "h11",
        "category": "금리",
        "label": "한·미 금리차 프록시",
        "base": 53
      },
      {
        "id": "h12",
        "category": "금리",
        "label": "미 국채 변동성 프록시",
        "base": 47
      },
      {
        "id": "h13",
        "category": "환율",
        "label": "USD/KRW",
        "base": 57
      },
      {
        "id": "h14",
        "category": "환율",
        "label": "달러 인덱스(DXY)",
        "base": 55
      },
      {
        "id": "h15",
        "category": "환율",
        "label": "USD/JPY",
        "base": 52
      },
      {
        "id": "h16",
        "category": "원자재",
        "label": "WTI 원유",
        "base": 50
      },
      {
        "id": "h17",
        "category": "원자재",
        "label": "금 현물",
        "base": 53
      },
      {
        "id": "h18",
        "category": "원자재",
        "label": "구리 현물",
        "base": 48
      },
      {
        "id": "h19",
        "category": "반도체 테마",
        "label": "HBM 공급",
        "base": 62
      },
      {
        "id": "h20",
        "category": "반도체 테마",
        "label": "필라델피아 반도체 지수 프록시",
        "base": 60
      },
      {
        "id": "h21",
        "category": "반도체 테마",
        "label": "D램 현물가 프록시",
        "base": 57
      },
      {
        "id": "h22",
        "category": "반도체 테마",
        "label": "AI 가속기 수요 지표",
        "base": 64
      }
    ],
    "timeline": [
      {
        "t": "21:30",
        "price": 50,
        "macro": 50,
        "news": 50
      },
      {
        "t": "22:00",
        "price": 52,
        "macro": 51,
        "news": 53
      },
      {
        "t": "22:30",
        "price": 48,
        "macro": 49,
        "news": 47
      },
      {
        "t": "23:00",
        "price": 46,
        "macro": 53,
        "news": 45
      },
      {
        "t": "23:30",
        "price": 51,
        "macro": 55,
        "news": 52
      },
      {
        "t": "00:00",
        "price": 55,
        "macro": 54,
        "news": 58
      },
      {
        "t": "00:30",
        "price": 58,
        "macro": 52,
        "news": 60
      },
      {
        "t": "01:00",
        "price": 54,
        "macro": 50,
        "news": 56
      },
      {
        "t": "01:30",
        "price": 49,
        "macro": 56,
        "news": 48
      },
      {
        "t": "02:00",
        "price": 44,
        "macro": 61,
        "news": 42
      },
      {
        "t": "02:30",
        "price": 47,
        "macro": 58,
        "news": 46
      },
      {
        "t": "03:00",
        "price": 53,
        "macro": 54,
        "news": 54
      },
      {
        "t": "03:30",
        "price": 57,
        "macro": 51,
        "news": 59
      },
      {
        "t": "04:00",
        "price": 60,
        "macro": 49,
        "news": 62
      },
      {
        "t": "05:00",
        "price": 56,
        "macro": 50,
        "news": 57
      },
      {
        "t": "06:00",
        "price": 53,
        "macro": 51,
        "news": 54
      },
      {
        "t": "08:00",
        "price": 51,
        "macro": 52,
        "news": 50
      },
      {
        "t": "08:30",
        "price": 49,
        "macro": 54,
        "news": 48
      },
      {
        "t": "08:50",
        "price": 47,
        "macro": 56,
        "news": 45
      },
      {
        "t": "09:00",
        "price": 52,
        "macro": 53,
        "news": 51
      },
      {
        "t": "09:10",
        "price": 55,
        "macro": 52,
        "news": 55
      },
      {
        "t": "09:30",
        "price": 53,
        "macro": 51,
        "news": 53
      }
    ],
    "headlines": [
      {
        "id": "n01",
        "text": "미 빅테크 AI 데이터센터 투자 확대 발표에 HBM 수요 기대 고조",
        "sentiment": 72,
        "tokens": [
          "빅테크",
          "AI 투자",
          "HBM"
        ],
        "factor": "반도체 테마"
      },
      {
        "id": "n02",
        "text": "예상 웃돈 미 소비자물가에 10년물 국채금리 장중 급등",
        "sentiment": -64,
        "tokens": [
          "소비자물가",
          "10년물",
          "금리 급등"
        ],
        "factor": "금리"
      },
      {
        "id": "n03",
        "text": "달러 인덱스 연중 고점 근접, 원·달러 환율 상승 압력 확대",
        "sentiment": -48,
        "tokens": [
          "달러 인덱스",
          "원·달러",
          "환율"
        ],
        "factor": "환율"
      },
      {
        "id": "n04",
        "text": "국내 메모리 기업 차세대 D램 양산 일정 앞당겨 공개",
        "sentiment": 58,
        "tokens": [
          "메모리",
          "D램",
          "양산"
        ],
        "factor": "반도체 테마"
      },
      {
        "id": "n05",
        "text": "중동 지정학 리스크 부각에 안전자산 금·국채로 자금 이동",
        "sentiment": -52,
        "tokens": [
          "지정학",
          "안전자산",
          "금"
        ],
        "factor": "원자재"
      },
      {
        "id": "n06",
        "text": "미 연준 위원 매파 발언에 금리 인하 기대 후퇴",
        "sentiment": -40,
        "tokens": [
          "연준",
          "매파",
          "금리 인하"
        ],
        "factor": "금리"
      },
      {
        "id": "n07",
        "text": "필라델피아 반도체 지수 사상 최고치 경신하며 위험 선호 회복",
        "sentiment": 66,
        "tokens": [
          "반도체 지수",
          "최고치",
          "위험 선호"
        ],
        "factor": "반도체 테마"
      },
      {
        "id": "n08",
        "text": "WTI 유가 공급 차질 우려에 배럴당 급등, 인플레 부담 재점화",
        "sentiment": -34,
        "tokens": [
          "WTI",
          "유가",
          "인플레"
        ],
        "factor": "원자재"
      },
      {
        "id": "n09",
        "text": "외국인 자금 야간 선물 시장서 순매수 전환, KOSPI 반등 기대",
        "sentiment": 50,
        "tokens": [
          "외국인",
          "순매수",
          "KOSPI"
        ],
        "factor": "한국 지수"
      },
      {
        "id": "n10",
        "text": "미 고용지표 호조로 경기 연착륙 기대, 증시 선물 강보합",
        "sentiment": 44,
        "tokens": [
          "고용지표",
          "연착륙",
          "선물"
        ],
        "factor": "미국 지수"
      }
    ],
    "pipeline": [
      {
        "id": "e01",
        "label": "Go 수집 데몬",
        "detail": "여러 거래소·뉴스 소스에 동시에 접속해 들어오는 원시 시세와 헤드라인을 끊김 없이 받아 다음 단계로 흘려보냅니다. 다수 연결을 가볍게 다루는 첫 관문입니다."
      },
      {
        "id": "e02",
        "label": "Redis 캐시·Pub/Sub",
        "detail": "가장 최신 지표 한 장면을 메모리에 보관해 즉시 응답하고, 새 값이 들어올 때마다 구독 중인 모든 처리기와 화면에 동시에 알립니다."
      },
      {
        "id": "e03",
        "label": "DuckDB 분석 집계",
        "detail": "원시 틱을 분 단위·시간대별로 묶어 가격 압력과 매크로 압력 같은 파생 지표를 계산합니다. 콕핏 타임라인의 숫자가 여기서 만들어집니다."
      },
      {
        "id": "e04",
        "label": "Transformers 텍스트 신호",
        "detail": "쏟아지는 매크로·반도체 헤드라인을 감성 점수와 영향 요인으로 분류하고 핵심 토큰을 뽑아, 텍스트를 숫자 신호로 바꿉니다."
      },
      {
        "id": "e05",
        "label": "WebSocket 실시간 푸시",
        "detail": "집계된 지표와 텍스트 신호를 브라우저가 요청하기 전에 서버가 먼저 밀어 줍니다. 화면이 스스로 살아 움직이게 하는 전송 단계입니다."
      },
      {
        "id": "e06",
        "label": "TanStack Query 동기화",
        "detail": "푸시받은 데이터의 캐싱·갱신·재시도를 자동으로 관리해, 대시보드가 깜빡임 없이 항상 최신 상태를 유지하도록 합니다."
      },
      {
        "id": "e07",
        "label": "ECharts 대시보드",
        "detail": "세 레인 타임라인, 지표 히트맵, 시나리오 게이지를 부드러운 애니메이션으로 그려, 입문자도 시장 압력의 흐름을 한눈에 읽게 합니다."
      }
    ]
  },
  "knowledge": {
    "stacks": [
      {
        "tech": "Rust",
        "where": "WASM 레이아웃 엔진 — 브라우저에서 그래프 좌표를 계산하는 force-directed 레이아웃 모듈",
        "whatChanges": "수천 개 노드의 좌표 계산을 JavaScript 대신 Rust로 처리해 매 프레임 위치 갱신이 끊김 없이 돌아간다",
        "whyChosen": "노드·엣지가 많아질수록 자바스크립트 단독 계산은 버벅이는데, Rust를 WASM으로 컴파일하면 네이티브에 가까운 속도로 물리 시뮬레이션을 돌릴 수 있다",
        "simulated": "이 데모는 미리 계산된 정적 좌표를 사용한다 — 실제 Rust WASM 연산은 흉내만 내며 실행되지 않는다"
      },
      {
        "tech": "WGSL",
        "where": "WebGPU 셰이더 언어로 노드·엣지 대량 렌더링 파이프라인의 정점/프래그먼트 셰이더를 기술",
        "whatChanges": "GPU에 보낼 셰이더를 WGSL로 작성해 수만 개 점과 선을 한 번의 draw call에 가깝게 그린다",
        "whyChosen": "WebGPU의 공식 셰이더 언어가 WGSL이라, 지식 우주의 대량 그래프를 GPU 가속으로 렌더하려면 필수적이다",
        "simulated": "포함된 WGSL은 참고용 의사 코드다 — 실제 GPU 파이프라인에 바인딩되지 않는다"
      },
      {
        "tech": "WebGPU",
        "where": "메인 3D 지식 우주 캔버스 — 노드를 빛나는 점, 엣지를 선으로 그리는 가속 렌더러",
        "whatChanges": "기존 Canvas 2D나 WebGL보다 최신 GPU 기능을 활용해 대규모 그래프를 부드럽게 그리고 카메라 이동도 매끄럽게 만든다",
        "whyChosen": "브라우저에서 쓸 수 있는 가장 현대적인 그래픽 API라, 점·선 수만 개 규모의 인터랙티브 우주를 그리는 데 적합하다",
        "simulated": "데모에서는 WebGPU 미지원 환경을 가정해 정적 이미지/대체 렌더로 폴백한다 — 실제 GPU 인프라를 요구하지 않는다"
      },
      {
        "tech": "D3.js",
        "where": "2D 평면 그래프 패널 — 선택된 부분 그래프를 노드-링크 다이어그램으로 보여주는 보조 뷰",
        "whatChanges": "3D 우주에서 한 영역을 집으면, 그 이웃 관계를 깔끔한 평면 force 그래프로 펼쳐 관계를 또렷이 읽게 한다",
        "whyChosen": "D3.js는 데이터 기반 SVG 조작과 force 레이아웃의 표준이라, 정밀한 2D 관계 시각화에 검증된 도구다",
        "simulated": "표시되는 관계는 정적 데모 데이터에 기반한다 — 실시간 데이터 스트림은 없다"
      },
      {
        "tech": "LangChain / Vercel AI SDK",
        "where": "자연어 질문을 그래프 검색 쿼리로 바꾸는 오케스트레이션 계층 개념도",
        "whatChanges": "사용자의 한국어 질문을 받아 어떤 노드·경로를 강조할지 결정하는 흐름을 표현한다",
        "whyChosen": "LangChain과 Vercel AI SDK는 LLM 기반 검색·도구 호출 파이프라인을 구성하는 대표 프레임워크라, 자연어→그래프 탐색 개념을 보여주기에 적합하다",
        "simulated": "이 데모는 실제 LLM을 호출하지 않는다 — 미리 정의된 질문-답변-경로 매핑을 재생할 뿐이다"
      },
      {
        "tech": "Cesium / CesiumJS",
        "where": "공급망 지구본 뷰 — 국가 간 자재·장비 흐름을 3D 지구 위 아크로 그리는 패널",
        "whatChanges": "반도체 공급망의 국가 간 이동을 실제 지구본 위 곡선 아크로 시각화해 지리적 맥락을 부여한다",
        "whyChosen": "CesiumJS는 정밀한 3D 지구·지리 시각화의 표준이라, 글로벌 공급망의 위치 기반 흐름을 표현하기에 알맞다",
        "simulated": "아크와 위치는 데모용 정적 좌표다 — 실제 위성·물류 추적 데이터를 연동하지 않는다"
      },
      {
        "tech": "Three.js",
        "where": "WebGPU 미지원 브라우저를 위한 WebGL 폴백 3D 렌더러",
        "whatChanges": "WebGPU가 없는 환경에서도 지식 우주를 비슷하게 보여주도록 WebGL 기반 3D 씬으로 대체 렌더한다",
        "whyChosen": "Three.js는 WebGL 3D의 사실상 표준이라, 폭넓은 브라우저 호환을 위한 폴백 경로로 안정적이다",
        "simulated": "폴백 씬도 정적 데모 데이터로 구동된다 — 두 렌더 경로 모두 실제 백엔드를 호출하지 않는다"
      },
      {
        "tech": "React",
        "where": "전체 UI 셸 — 패널 레이아웃, 질문 입력창, 결과 카드, 뷰 전환을 구성하는 컴포넌트 계층",
        "whatChanges": "3D 우주·2D 그래프·지구본·답변 카드를 하나의 화면에 조립하고 상태에 따라 갱신한다",
        "whyChosen": "React는 복합적인 인터랙티브 대시보드 UI를 컴포넌트 단위로 관리하기에 검증된 라이브러리다",
        "simulated": "UI는 정적 데모 데이터에 바인딩된다 — 서버 상태나 실시간 갱신은 없다"
      },
      {
        "tech": "TypeScript",
        "where": "전체 코드베이스의 타입 계층 — 노드/엣지/질문/아크 데이터 모델의 스키마 정의",
        "whatChanges": "그래프 데이터 구조에 타입을 부여해 잘못된 id 참조나 빠진 필드를 컴파일 단계에서 잡아낸다",
        "whyChosen": "지식 그래프처럼 참조 무결성이 중요한 데이터에서는 정적 타입이 실수를 크게 줄여준다",
        "simulated": "타입은 데모 데이터 형태를 기술할 뿐 — 외부 API 응답을 검증하지는 않는다"
      }
    ],
    "nodes": [
      {
        "id": "n01",
        "label": "EUV 노광",
        "category": "공정"
      },
      {
        "id": "n02",
        "label": "포토리소그래피",
        "category": "공정"
      },
      {
        "id": "n03",
        "label": "식각(에칭)",
        "category": "공정"
      },
      {
        "id": "n04",
        "label": "증착(CVD/ALD)",
        "category": "공정"
      },
      {
        "id": "n05",
        "label": "패키징(첨단)",
        "category": "공정"
      },
      {
        "id": "n06",
        "label": "TSV 본딩",
        "category": "공정"
      },
      {
        "id": "n07",
        "label": "포토레지스트",
        "category": "소재"
      },
      {
        "id": "n08",
        "label": "고순도 불화수소(HF)",
        "category": "소재"
      },
      {
        "id": "n09",
        "label": "실리콘 웨이퍼",
        "category": "소재"
      },
      {
        "id": "n10",
        "label": "네온 가스",
        "category": "소재"
      },
      {
        "id": "n11",
        "label": "ABF 기판",
        "category": "소재"
      },
      {
        "id": "n12",
        "label": "EUV 노광장비",
        "category": "장비"
      },
      {
        "id": "n13",
        "label": "식각장비",
        "category": "장비"
      },
      {
        "id": "n14",
        "label": "증착장비",
        "category": "장비"
      },
      {
        "id": "n15",
        "label": "본더(하이브리드)",
        "category": "장비"
      },
      {
        "id": "n16",
        "label": "ASML",
        "category": "기업"
      },
      {
        "id": "n17",
        "label": "TSMC",
        "category": "기업"
      },
      {
        "id": "n18",
        "label": "삼성전자",
        "category": "기업"
      },
      {
        "id": "n19",
        "label": "SK하이닉스",
        "category": "기업"
      },
      {
        "id": "n20",
        "label": "Tokyo Electron",
        "category": "기업"
      },
      {
        "id": "n21",
        "label": "NVIDIA",
        "category": "기업"
      },
      {
        "id": "n22",
        "label": "HBM",
        "category": "소재"
      },
      {
        "id": "n23",
        "label": "부산항",
        "category": "항만·물류"
      },
      {
        "id": "n24",
        "label": "가오슝항",
        "category": "항만·물류"
      },
      {
        "id": "n25",
        "label": "싱가포르항",
        "category": "항만·물류"
      },
      {
        "id": "n26",
        "label": "항공 화물(반도체 특송)",
        "category": "항만·물류"
      },
      {
        "id": "n27",
        "label": "관세 리스크",
        "category": "리스크"
      },
      {
        "id": "n28",
        "label": "지정학 리스크(수출규제)",
        "category": "리스크"
      },
      {
        "id": "n29",
        "label": "단일 공급원 리스크",
        "category": "리스크"
      },
      {
        "id": "n30",
        "label": "물류 병목 리스크",
        "category": "리스크"
      },
      {
        "id": "n31",
        "label": "AI 서버 수요",
        "category": "수요"
      },
      {
        "id": "n32",
        "label": "데이터센터 증설 수요",
        "category": "수요"
      },
      {
        "id": "n33",
        "label": "스마트폰 AP 수요",
        "category": "수요"
      },
      {
        "id": "n34",
        "label": "전장 반도체 수요",
        "category": "수요"
      }
    ],
    "edges": [
      {
        "source": "n12",
        "target": "n01",
        "label": "장비 투입"
      },
      {
        "source": "n16",
        "target": "n12",
        "label": "독점 공급"
      },
      {
        "source": "n07",
        "target": "n02",
        "label": "소재 공급"
      },
      {
        "source": "n01",
        "target": "n02",
        "label": "핵심 공정"
      },
      {
        "source": "n08",
        "target": "n03",
        "label": "소재 공급"
      },
      {
        "source": "n13",
        "target": "n03",
        "label": "장비 투입"
      },
      {
        "source": "n20",
        "target": "n13",
        "label": "장비 공급"
      },
      {
        "source": "n14",
        "target": "n04",
        "label": "장비 투입"
      },
      {
        "source": "n20",
        "target": "n14",
        "label": "장비 공급"
      },
      {
        "source": "n09",
        "target": "n02",
        "label": "기판 공급"
      },
      {
        "source": "n10",
        "target": "n01",
        "label": "광원 가스 공급"
      },
      {
        "source": "n12",
        "target": "n17",
        "label": "장비 도입"
      },
      {
        "source": "n12",
        "target": "n18",
        "label": "장비 도입"
      },
      {
        "source": "n17",
        "target": "n01",
        "label": "공정 운용"
      },
      {
        "source": "n18",
        "target": "n22",
        "label": "HBM 양산"
      },
      {
        "source": "n19",
        "target": "n22",
        "label": "HBM 양산"
      },
      {
        "source": "n22",
        "target": "n05",
        "label": "첨단 패키징 결합"
      },
      {
        "source": "n06",
        "target": "n22",
        "label": "적층 본딩"
      },
      {
        "source": "n15",
        "target": "n06",
        "label": "장비 투입"
      },
      {
        "source": "n11",
        "target": "n05",
        "label": "기판 공급"
      },
      {
        "source": "n22",
        "target": "n21",
        "label": "부품 공급"
      },
      {
        "source": "n31",
        "target": "n22",
        "label": "수요 견인"
      },
      {
        "source": "n31",
        "target": "n21",
        "label": "수요 견인"
      },
      {
        "source": "n32",
        "target": "n31",
        "label": "수요 확대"
      },
      {
        "source": "n21",
        "target": "n17",
        "label": "위탁 생산"
      },
      {
        "source": "n33",
        "target": "n18",
        "label": "수요 견인"
      },
      {
        "source": "n34",
        "target": "n18",
        "label": "수요 견인"
      },
      {
        "source": "n17",
        "target": "n24",
        "label": "수출 물류"
      },
      {
        "source": "n18",
        "target": "n23",
        "label": "수출입 물류"
      },
      {
        "source": "n19",
        "target": "n23",
        "label": "수출입 물류"
      },
      {
        "source": "n22",
        "target": "n26",
        "label": "고가 특송"
      },
      {
        "source": "n25",
        "target": "n23",
        "label": "환적 연계"
      },
      {
        "source": "n27",
        "target": "n17",
        "label": "리스크 전이"
      },
      {
        "source": "n27",
        "target": "n23",
        "label": "통관 비용 전가"
      },
      {
        "source": "n28",
        "target": "n12",
        "label": "수출규제 영향"
      },
      {
        "source": "n28",
        "target": "n08",
        "label": "수출규제 영향"
      },
      {
        "source": "n29",
        "target": "n16",
        "label": "단일 공급원 노출"
      },
      {
        "source": "n29",
        "target": "n07",
        "label": "단일 공급원 노출"
      },
      {
        "source": "n30",
        "target": "n23",
        "label": "병목 발생"
      },
      {
        "source": "n30",
        "target": "n26",
        "label": "운임 급등"
      },
      {
        "source": "n31",
        "target": "n32",
        "label": "동반 증가"
      },
      {
        "source": "n27",
        "target": "n21",
        "label": "비용 압박"
      }
    ],
    "questions": [
      {
        "id": "q1",
        "q": "HBM 병목과 관련된 장비를 찾아줘",
        "answer": "HBM은 여러 D램을 수직으로 쌓는 메모리로, 적층을 위한 TSV 본딩 공정과 하이브리드 본더 장비가 핵심 병목 지점입니다. SK하이닉스와 삼성전자가 HBM을 양산하며, 본더의 생산능력이 곧 HBM 공급량을 좌우합니다. 따라서 HBM 증산을 보려면 본더(하이브리드) 장비와 TSV 본딩 공정을 함께 살펴야 합니다.",
        "highlightedNodeIds": [
          "n22",
          "n06",
          "n15",
          "n19",
          "n18"
        ],
        "pathSteps": [
          "HBM",
          "TSV 본딩",
          "본더(하이브리드)",
          "SK하이닉스",
          "삼성전자"
        ]
      },
      {
        "id": "q2",
        "q": "부산항 물류 리스크와 연결된 노드를 보여줘",
        "answer": "부산항은 삼성전자·SK하이닉스의 수출입 관문이자 싱가포르항 환적과 연결된 핵심 물류 거점입니다. 물류 병목 리스크가 부산항에서 발생하면 통관 지연과 운임 급등으로 이어지고, 관세 리스크까지 통관 비용으로 전가될 수 있습니다. 즉 부산항은 물류 병목과 관세 리스크가 동시에 모이는 지점입니다.",
        "highlightedNodeIds": [
          "n23",
          "n30",
          "n27",
          "n25",
          "n19"
        ],
        "pathSteps": [
          "부산항",
          "물류 병목 리스크",
          "관세 리스크",
          "싱가포르항",
          "SK하이닉스"
        ]
      },
      {
        "id": "q3",
        "q": "EUV 공정과 소재 공급망을 연결해줘",
        "answer": "EUV 노광은 ASML이 독점 공급하는 EUV 노광장비로 수행되며, 빛을 감광시키는 포토레지스트와 광원용 네온 가스 같은 소재에 의존합니다. 노광 후 패턴은 포토리소그래피 공정으로 이어지고 실리콘 웨이퍼 위에 새겨집니다. 따라서 EUV 공정의 소재 공급망은 포토레지스트·네온 가스·실리콘 웨이퍼로 뻗어 있습니다.",
        "highlightedNodeIds": [
          "n01",
          "n12",
          "n07",
          "n10",
          "n09"
        ],
        "pathSteps": [
          "EUV 노광",
          "EUV 노광장비",
          "포토레지스트",
          "네온 가스",
          "실리콘 웨이퍼"
        ]
      },
      {
        "id": "q4",
        "q": "관세 리스크가 반도체 밸류체인에 미치는 경로는?",
        "answer": "관세 리스크는 우선 위탁 생산을 맡은 TSMC와 통관 거점인 부산항에 비용으로 전가되고, 이는 NVIDIA 같은 최종 고객의 비용 압박으로 번집니다. 통관 비용이 오르면 부산항 물류 흐름 전반의 부담이 커집니다. 결국 관세 리스크는 제조→물류→최종 수요 기업으로 차례로 전이되는 구조입니다.",
        "highlightedNodeIds": [
          "n27",
          "n17",
          "n23",
          "n21",
          "n30"
        ],
        "pathSteps": [
          "관세 리스크",
          "TSMC",
          "부산항",
          "NVIDIA",
          "물류 병목 리스크"
        ]
      },
      {
        "id": "q5",
        "q": "AI 서버 수요가 어떤 노드로 번지는지 보여줘",
        "answer": "AI 서버 수요는 데이터센터 증설 수요와 맞물려 늘어나며 HBM과 NVIDIA의 가속기 수요를 직접 견인합니다. 늘어난 HBM 수요는 다시 첨단 패키징과 TSMC의 위탁 생산 물량으로 번집니다. 즉 AI 서버 수요는 HBM→NVIDIA→TSMC로 이어지는 경로를 따라 확산됩니다.",
        "highlightedNodeIds": [
          "n31",
          "n22",
          "n21",
          "n17",
          "n32"
        ],
        "pathSteps": [
          "AI 서버 수요",
          "HBM",
          "NVIDIA",
          "TSMC",
          "데이터센터 증설 수요"
        ]
      }
    ],
    "supplyChainArcs": [
      {
        "id": "arc1",
        "from": "네덜란드",
        "to": "대만",
        "label": "EUV 장비",
        "detail": "ASML이 만든 EUV 노광장비가 TSMC로 인도됩니다. (참고: 네덜란드는 6개국 분포 밖이지만 EUV 흐름의 출발점을 보여주기 위한 보조 표기입니다.)"
      },
      {
        "id": "arc2",
        "from": "일본",
        "to": "한국",
        "label": "포토레지스트·고순도 소재",
        "detail": "일본이 강점을 가진 포토레지스트와 고순도 불화수소 같은 핵심 소재가 한국 반도체 공장으로 공급됩니다."
      },
      {
        "id": "arc3",
        "from": "한국",
        "to": "미국",
        "label": "HBM",
        "detail": "한국에서 양산한 HBM이 미국의 AI 가속기 업체로 공급되어 AI 서버에 탑재됩니다."
      },
      {
        "id": "arc4",
        "from": "대만",
        "to": "미국",
        "label": "가속기 칩(위탁생산)",
        "detail": "대만 TSMC가 위탁 생산한 AI 가속기 칩이 미국 고객사로 출하됩니다."
      },
      {
        "id": "arc5",
        "from": "중국",
        "to": "한국",
        "label": "네온 가스·원자재",
        "detail": "EUV 광원과 식각에 쓰이는 네온 가스 등 원자재 일부가 중국에서 한국으로 들어옵니다."
      },
      {
        "id": "arc6",
        "from": "싱가포르",
        "to": "한국",
        "label": "환적 물류",
        "detail": "싱가포르항이 동남아·중동 화물을 환적해 부산항으로 연결하는 물류 허브 역할을 합니다."
      },
      {
        "id": "arc7",
        "from": "미국",
        "to": "대만",
        "label": "설계 IP·EDA",
        "detail": "미국의 팹리스 설계와 EDA 도구가 대만 파운드리의 칩 제조로 흘러갑니다."
      },
      {
        "id": "arc8",
        "from": "한국",
        "to": "중국",
        "label": "메모리·시스템 반도체",
        "detail": "한국에서 생산한 메모리와 시스템 반도체가 중국의 완제품 조립 공장으로 수출됩니다."
      }
    ],
    "pipeline": [
      {
        "id": "p1",
        "label": "질문 입력",
        "detail": "사용자가 '부산항 물류 리스크와 연결된 노드를 보여줘' 같은 한국어 질문을 자연어로 입력합니다."
      },
      {
        "id": "p2",
        "label": "LangChain / Vercel AI SDK",
        "detail": "질문을 받아 어떤 노드와 경로를 강조할지 결정하는 오케스트레이션 단계입니다. 이 데모에서는 미리 정의된 질문-경로 매핑을 재생합니다."
      },
      {
        "id": "p3",
        "label": "그래프 검색",
        "detail": "결정된 의도에 따라 지식 그래프에서 관련 노드와 엣지를 골라 하이라이트 대상과 추론 경로를 추립니다."
      },
      {
        "id": "p4",
        "label": "Rust WASM 레이아웃",
        "detail": "선택된 노드들의 좌표를 force-directed 방식으로 배치합니다. 데모는 미리 계산된 정적 좌표를 사용합니다."
      },
      {
        "id": "p5",
        "label": "WebGPU/WGSL 렌더",
        "detail": "노드와 엣지를 GPU 가속으로 그려 3D 지식 우주를 표시합니다. 미지원 환경에서는 Three.js 폴백으로 대체됩니다."
      },
      {
        "id": "p6",
        "label": "D3 평면 그래프",
        "detail": "선택된 부분 그래프를 D3.js 노드-링크 다이어그램으로 펼쳐 관계를 또렷이 보여줍니다."
      },
      {
        "id": "p7",
        "label": "Cesium 공급망 지구",
        "detail": "관련된 국가 간 자재·장비 흐름을 CesiumJS 지구본 위 아크로 시각화합니다."
      }
    ],
    "wgsl": "// 참고용 의사 셰이더 (실제 GPU 파이프라인에 바인딩되지 않음)\n// 지식 그래프 노드를 인스턴싱으로 대량 렌더하기 위한 정점 셰이더 예시\n\nstruct Node { pos: vec2<f32>, size: f32, category: u32 };\n\n@group(0) @binding(0) var<storage, read> nodes: array<Node>;\n@group(0) @binding(1) var<uniform> camera: mat4x4<f32>;\n\n@vertex\nfn vs_main(@builtin(instance_index) i: u32,\n           @location(0) corner: vec2<f32>) -> @builtin(position) vec4<f32> {\n    let n = nodes[i];                 // 노드 한 개를 인스턴스로 가져온다\n    let world = n.pos + corner * n.size; // 코너 오프셋으로 점 크기를 만든다\n    return camera * vec4<f32>(world, 0.0, 1.0);\n}\n\n@fragment\nfn fs_main() -> @location(0) vec4<f32> {\n    return vec4<f32>(0.45, 0.78, 1.0, 1.0); // 노드 기본 색(참고용)\n}"
  },
  "stackMap": [
    {
      "row": "데이터 수집",
      "premarket": "Go 수집 데몬 (FRED·ECOS·시세 멀티소스를 단일 바이너리 상주 데몬으로 동시 수집). Python 보조 ETL",
      "knowledge": "지식 그래프 노드·관계 데이터를 단일 소스로 읽어들이는 정적 데이터셋 로딩 (별도 수집 데몬 없음)",
      "explain": "프리마켓은 금리·환율·시세 같은 '움직이는 외부 숫자'를 계속 끌어와야 해서 24시간 도는 Go 수집 데몬이 핵심입니다. 반면 지식 그래프는 미리 정리된 지식 노드 묶음을 한 번 읽어 보여주는 구조라 상시 수집기가 필요 없습니다.",
      "status": "제품화 필요"
    },
    {
      "row": "캐시·동기화",
      "premarket": "Redis (시세 캐시·pub/sub fan-out·레이트리밋) + TanStack Query (React Query: 패칭 캐시·재시도·폴링·stale 자동화)",
      "knowledge": "Rust(wasm) 레이아웃 결과와 RAG 인덱스가 같은 노드 데이터를 공유하는 인메모리 공유 구조 (별도 캐시 서버 없음)",
      "explain": "프리마켓은 외부 API를 자주 부르므로 Redis로 같은 값을 재사용하고 호출 횟수를 줄이며, TanStack Query가 화면-서버 데이터를 자동으로 맞춰줍니다. 지식 그래프는 외부 호출이 적어 무거운 캐시 서버 대신 메모리 안에서 데이터를 함께 쓰는 가벼운 방식을 택합니다.",
      "status": "제품화 필요"
    },
    {
      "row": "분석 엔진",
      "premarket": "DuckDB (대량 시세·매크로를 인메모리 OLAP로 조인·집계해 매크로·테마 상관 분석)",
      "knowledge": "Rust (wasm-bindgen으로 분리한 force-directed 그래프 레이아웃 연산 코어)",
      "explain": "프리마켓의 '분석'은 수많은 숫자를 빠르게 묶어 표·상관을 뽑는 일이라 OLAP 데이터베이스인 DuckDB가 맞습니다. 지식 그래프의 '분석'은 수백 개 노드의 위치를 계산해 그림으로 배치하는 일이라, 무거운 계산을 메인 화면 흐름에서 떼어내는 Rust 연산 코어가 핵심입니다.",
      "status": "제품화 필요"
    },
    {
      "row": "텍스트/AI 처리",
      "premarket": "Hugging Face Transformers (뉴스·공시 감성분석·요약으로 매크로 시그널에 텍스트 신호 결합)",
      "knowledge": "LangChain / Vercel AI SDK (자연어 질문을 그래프 검색·하이라이트로 해석하는 RAG 비서)",
      "explain": "프리마켓은 뉴스 문장의 긍정·부정 점수를 매겨 숫자 지표 옆에 '심리'를 더하는 모델을 씁니다. 지식 그래프는 사용자의 한국어 질문을 알아듣고 관련 노드를 찾아 답하는 검색형 AI(RAG)를 씁니다. 둘 다 AI지만 전자는 '문장 채점', 후자는 '질문 응답'으로 목적이 다릅니다.",
      "status": "제품화 필요"
    },
    {
      "row": "고밀도 시각화",
      "premarket": "ECharts (매크로·테마 히트맵, 캔들, 시그널 타임라인 등 고밀도 차트)",
      "knowledge": "WebGPU(WebGPURenderer) + WGSL 셰이더로 대량 노드·엣지 인스턴싱 렌더, D3.js로 2D force 그래프, Three.js 3D 우주",
      "explain": "프리마켓은 '많은 숫자를 표와 그래프로' 보여주는 일이라 차트 전용 라이브러리 ECharts가 적합합니다. 지식 그래프는 '수많은 점과 선을 끊김 없이' 그려야 해서 GPU를 직접 쓰는 WebGPU/WGSL과 그래프 전용 D3.js를 조합합니다. 데이터가 숫자냐 관계망이냐에 따라 시각화 도구가 갈립니다.",
      "status": "제품화 필요"
    },
    {
      "row": "실시간성",
      "premarket": "WebSocket (프리마켓 실시간 틱·매크로 업데이트를 클라이언트로 푸시해 폴링 지연 제거)",
      "knowledge": "사용자 상호작용 중심(질문·노드 클릭)으로 갱신, 상시 실시간 스트림은 부차적",
      "explain": "프리마켓은 시세가 시시각각 바뀌므로 서버가 새 값을 즉시 밀어주는 WebSocket이 본질적으로 중요합니다. 지식 그래프는 지식이 초 단위로 변하지 않으므로, 사용자가 질문하거나 클릭할 때 반응하면 충분해 상시 실시간 연결의 비중이 낮습니다.",
      "status": "제품화 필요"
    },
    {
      "row": "저장 계층",
      "premarket": "DuckDB 영속 저장(시계열 누적) + Redis 캐시 (시계열을 쌓아 과거 추세 분석)",
      "knowledge": "지식 그래프 노드·관계를 단일 소스로 두고 레이아웃·RAG 인덱스가 공유 (그래프 데이터 스토어)",
      "explain": "프리마켓은 지나간 시세를 쌓아둬야 추세를 비교할 수 있어 시계열 저장(DuckDB)이 필요합니다. 지식 그래프는 '점과 점의 연결'이 핵심이라 관계 중심 데이터 저장이 맞습니다. 즉 한쪽은 '시간순 숫자', 다른 쪽은 '연결 구조'를 저장합니다.",
      "status": "제품화 필요"
    },
    {
      "row": "운영 난이도",
      "premarket": "높음 — Go 상시 데몬·WebSocket 장기연결 서버·Redis·DuckDB·모델 추론을 클라우드에 상주 운영. 금융 데이터 약관·지연·정확성 부담",
      "knowledge": "중간 — Rust(wasm)·WebGPU는 클라이언트(브라우저)에서 돌아 서버 부담이 낮지만, RAG 비서용 LLM 백엔드와 Cesium 자산 운영이 필요",
      "explain": "프리마켓은 24시간 도는 서버 여러 개와 실시간 연결을 직접 굴려야 해 운영이 가장 무겁고, 금융 데이터의 정확성·약관 책임까지 집니다. 지식 그래프는 무거운 계산을 사용자 브라우저로 떠넘길 수 있어 상대적으로 가볍지만, 자연어 답변용 AI 서버는 여전히 필요합니다.",
      "status": "제품화 필요"
    },
    {
      "row": "GitHub Pages 프리뷰에서 실제 구현된 부분",
      "premarket": "정적 런타임으로 동작: HTML5 + Tailwind CSS Play CDN + Vanilla JavaScript + ECharts CDN 차트 + 1.5~2.5초 가짜 틱 루프(WebSocket 푸시 시뮬레이션) + 시나리오 버튼·인스펙터 상호작용",
      "knowledge": "정적 런타임으로 동작: HTML5 + Tailwind + Vanilla JavaScript + D3.js CDN force 그래프 + Canvas 입자 폴백(WebGPU 미지원 환경 대비) + 질문 칩·노드/호(arc) 클릭 상호작용",
      "explain": "이 프리뷰는 빌드·API 키·백엔드 없이 GitHub Pages에서 바로 도는 정적 화면입니다. 차트(ECharts)와 그래프(D3.js), 클릭 반응 같은 '화면 동작'은 실제로 작동하지만, 그 뒤의 서버·DB·AI는 흉내(시뮬레이션)일 뿐임을 분명히 구분해 보여줍니다.",
      "status": "실제 동작"
    },
    {
      "row": "실제 제품화 때 필요한 추가 인프라",
      "premarket": "Go 수집 데몬, WebSocket 서버, Redis, DuckDB, Hugging Face Transformers 추론 서버, 클라우드 상주 호스팅, 합법 금융 데이터 소스 계약",
      "knowledge": "Rust(wasm) 빌드 파이프라인, WebGPU 지원 브라우저, LangChain/Vercel AI SDK 기반 LLM 백엔드, Cesium 3D 지구본 자산·타일 서버",
      "explain": "지금 프리뷰의 가짜 데이터·시뮬레이션을 실제 제품으로 만들려면 두 데모 모두 별도 백엔드가 필요합니다. 프리마켓은 수집·캐시·분석·실시간 서버 묶음과 합법 데이터 계약이, 지식 그래프는 GPU 렌더 파이프라인과 자연어 답변용 AI 서버가 추가로 들어가야 합니다.",
      "status": "제품화 필요"
    }
  ]
};
