// 보세사 1과목(수출입통관) — '숫자' 집중 정리 데이터
// 박사 지시(2026-06-30): 4과목에 이어 1과목도 숫자 선지·정답·오답을 한 카테고리로 모음.
//   ① 숫자 개념 정리(올바른 수치 + 자주 바꿔 출제하는 변형 패턴)  ② 기출에서 숫자 바꿔 낸 문항.
// 출처: 1과목 2019~2025 7개년 기출(BOSESA_DATA_1_*)에서 숫자 변별 문항 전수 추출.
// ⚠️ 학습 보조용. 법령·고시는 개정되므로 시험 직전 최신 원문 확인 필수.
window.BOSESA_NUM1 = {
  subject: 1,
  subjectName: "수출입통관",
  updated: "2026-06-30",

  concepts: [
    {
      topic: "신고서류 보관기간 (5년 / 3년 / 2년 체계)",
      icon: "fa-folder-open",
      items: [
        { label: "수입신고필증 / 수입물품 가격결정 자료 / 지식재산권 거래 계약서", correct: "5년", variants: ["3년"], note: "보관기간이 가장 긴 5년 그룹.", basis: "관세법 제12조·시행령 제3조", years: [2019, 2020, 2022, 2025] },
        { label: "수출신고필증 / 반송신고필증", correct: "3년", variants: ["2년"], basis: "관세법 제12조·시행령 제3조", years: [2020, 2022, 2025] },
        { label: "보세화물 반출입 자료 / 적재화물목록(적하목록) / 보세운송 자료", correct: "2년", variants: ["3년", "1년"], note: "5년(수입)·3년(수출)과 헷갈리게 출제. 보세화물·적하목록·보세운송은 2년.", basis: "관세법 제12조·시행령 제3조", years: [2020, 2022, 2025] },
        { label: "수입물품 유통이력 신고자료", correct: "5년(거래일부터)", variants: ["2년", "1년"], note: "⚠️ 2021 #11은 5년, 2022 #13은 유통이력 1년으로 출제 — 발문·근거 고시 확인 필요.", basis: "관세법 제240조의2", years: [2021, 2022] }
      ]
    },
    {
      topic: "경정청구 · 세액보정 · 제척기간",
      icon: "fa-calculator",
      items: [
        { label: "경정청구 기간(최초 납세신고일부터)", correct: "5년", variants: ["3년"], basis: "관세법 제38조의3", years: [2021, 2024] },
        { label: "세관장의 경정·경정거부 통지기간(경정청구 받은 날부터)", correct: "2개월", variants: ["3개월", "1개월"], basis: "관세법 제38조의3", years: [2021, 2023, 2024] },
        { label: "경정처분 통지받은 날부터 불복 기산", correct: "3개월", variants: ["2개월", "6개월"], basis: "관세법 제38조의3", years: [2021] },
        { label: "세액 보정 신청기간(신고납부일부터)", correct: "6개월", variants: ["3개월"], note: "세액 '보정'은 6개월. 세액 '경정청구'(5년)와 구분.", basis: "관세법 제38조의2", years: [2025] },
        { label: "세액 보정 시 부족세액 납부기한", correct: "보정신청을 한 날의 다음날까지", variants: ["보정한 날부터 15일까지"], basis: "관세법 시행령 제56조", years: [2022] },
        { label: "관세부과 제척기간(원칙)", correct: "5년", variants: ["10년"], basis: "관세법 제21조·시행령 제6조", years: [2025] },
        { label: "관세부과 제척기간(부정한 방법으로 포탈·환급·감면)", correct: "10년", variants: ["5년"], basis: "관세법 제21조", years: [2024, 2025] },
        { label: "심판·소송 결정 확정일부터 경정·부과 가능 기간", correct: "1년", variants: ["2년"], note: "행정소송 판결·감사원 심사청구 결정·압수물품 반환결정 확정일부터 1년.", basis: "관세법 제21조·시행령 제6조", years: [2023, 2024, 2025] }
      ]
    },
    {
      topic: "송달 · 보세구역 반입명령",
      icon: "fa-envelope-open-text",
      items: [
        { label: "공시송달 효력 발생", correct: "공시일부터 14일 경과 시 송달 간주", variants: ["7일"], basis: "관세법 제11조", years: [2019] },
        { label: "보세구역 반입명령 제한(신고수리 후 경과기간)", correct: "신고수리 후 3개월 경과 시 반입명령 불가", variants: ["6개월", "1개월(1월)"], note: "⚠️ 2021 #18 원문은 '6개월'로 출제됐으나 다수 기출(2019·2024)·시행령은 3개월 — 원본 오기 가능성. 원산지 상이표시 반입명령도 3개월(2022 #13).", basis: "관세법 제238조·시행령 제245조", years: [2019, 2021, 2022, 2024] }
      ]
    },
    {
      topic: "관세 납부 · 징수 · 분할납부",
      icon: "fa-won-sign",
      items: [
        { label: "관세감면 신청기한 — 사후징수 시(납부고지일부터)", correct: "5일 이내", variants: ["3일", "7일"], basis: "관세법 시행령 제112조", years: [2019] },
        { label: "관세감면 신청기한 — 수입신고수리 후(보세구역 미반출 한정)", correct: "15일 이내", variants: ["10일"], basis: "관세법 시행령 제112조", years: [2019] },
        { label: "징수금액 최저한(이 금액 미만은 징수 제외)", correct: "1만원 미만", variants: ["3천원 이하", "8천원 미만", "1만원 이하"], note: "수입신고수리일을 납부일로 봄.", basis: "관세법 제40조·시행령 제37조", years: [2019] },
        { label: "분할납부 — 천재지변 등 사유", correct: "1년", variants: ["2년"], basis: "관세법 제107조", years: [2022] },
        { label: "분할납부 — 정부·지방자치단체 수입물품", correct: "5년", variants: ["10년"], basis: "관세법 제107조", years: [2022] },
        { label: "분할납부 미납 시 세관장 지정 납부기한", correct: "15일 이내", variants: [], basis: "관세법 제107조", years: [2022] }
      ]
    },
    {
      topic: "원산지",
      icon: "fa-globe",
      items: [
        { label: "원산지증명서 소급 발행 유효기간(제출일부터)", correct: "1년", variants: ["6개월", "2년", "3년", "4년"], basis: "관세법 시행령 제236조", years: [2019] },
        { label: "실질적 변형(세번변경기준) 품목번호 단위", correct: "6단위(소호, CTSH)", variants: ["2단위", "4단위", "8단위", "10단위"], basis: "관세법 제229조·시행규칙 제74조", years: [2019, 2023] },
        { label: "원산지증명서 제출 면제 과세가격 기준", correct: "15만원 이하", variants: ["20만원 이하"], basis: "관세법 제232조·시행령", years: [2022] }
      ]
    },
    {
      topic: "수출 · 반송 적재 · 신고기간",
      icon: "fa-ship",
      items: [
        { label: "수출신고수리물품 적재기한(수리일부터)", correct: "30일", variants: ["60일"], note: "미적재 시 신고수리 취소 가능.", basis: "관세법 제251조", years: [2019, 2021, 2023, 2025] },
        { label: "수출 적재기간 연장 승인 범위", correct: "1년", variants: ["2년", "6개월", "3개월"], basis: "관세법 제251조", years: [2019, 2021, 2023, 2025] },
        { label: "적재 취소예정통보 후 원인규명 기간", correct: "14일", variants: [], basis: "수출통관 사무처리에 관한 고시", years: [2021] },
        { label: "반송물품 보세운송기간", correct: "7일", variants: ["10일"], basis: "반송절차에 관한 고시", years: [2023] },
        { label: "신고 취하 승인 여부 통지기간", correct: "10일", variants: ["20일"], basis: "관세법 제250조", years: [2025] }
      ]
    },
    {
      topic: "불복 · 심사청구 · 과세전적부심사",
      icon: "fa-scale-balanced",
      items: [
        { label: "심사청구 청구기간(처분을 안 날/있은 날부터)", correct: "90일", variants: ["120일", "60일", "30일"], basis: "관세법 제121조", years: [2020, 2023] },
        { label: "과세전적부심사 청구기간(과세전 통지 받은 날부터)", correct: "30일", variants: ["20일"], basis: "관세법 제118조", years: [2023] },
        { label: "세관장이 의견서 첨부해 관세청장에게 송부", correct: "7일", variants: [], basis: "관세법 제122조", years: [2020] }
      ]
    },
    {
      topic: "체납 · 고액상습체납자 명단공개",
      icon: "fa-user-xmark",
      items: [
        { label: "명단공개 요건 — 체납발생일부터 경과기간", correct: "1년", variants: ["6월", "3년"], basis: "관세법 제116조의2", years: [2020] },
        { label: "명단공개 요건 — 관세 및 내국세등 체납액", correct: "2억원 이상", variants: ["1억원", "3억원"], basis: "관세법 제116조의2", years: [2020] }
      ]
    },
    {
      topic: "과세가격 · 잠정가격",
      icon: "fa-tags",
      items: [
        { label: "잠정가격 신고 시 확정가격 신고기한 범위", correct: "2년", variants: ["3년"], basis: "관세법 시행령 제30조", years: [2022] },
        { label: "가산율 산정 사전요청 기한", correct: "30일", variants: ["60일", "15일"], basis: "관세법 시행령 제30조", years: [2022] },
        { label: "과세가격(거래가격) = 송품장가 + 가산요소(포장·상표권·간접지급 등)", correct: "예: 890+포장20+상표권40+채무변제300+운임50+보험20 = 1,320$", variants: ["1,500$", "1,340$", "1,020$", "1,000$"], note: "가산·공제 요소를 빠뜨리거나 잘못 더해 오답 유도.", basis: "관세법 제30조", years: [2021] }
      ]
    },
    {
      topic: "지식재산권 보호 — 통관보류 담보",
      icon: "fa-shield-halved",
      items: [
        { label: "통관보류·유치 요청 담보(과세가격 대비)", correct: "100분의 120 (120%)", variants: ["100분의 125 (125%)"], basis: "관세법 제235조·시행령", years: [2021] },
        { label: "중소기업 담보(과세가격 대비)", correct: "100분의 40 (40%)", variants: ["100분의 50 (50%)"], basis: "관세법 제235조·시행령", years: [2021] }
      ]
    },
    {
      topic: "수입신고전 즉시반출",
      icon: "fa-truck-fast",
      items: [
        { label: "즉시반출 대상자 수출입실적 보유기간", correct: "최근 3년", variants: ["최근 2년"], basis: "관세법 제253조", years: [2022] },
        { label: "즉시반출신고 후 수입신고 기한", correct: "10일 이내", variants: [], basis: "관세법 제253조", years: [2022] },
        { label: "기한 내 미신고 시 가산세율", correct: "관세의 100분의 20", variants: [], basis: "관세법 제253조", years: [2022] }
      ]
    },
    {
      topic: "조정관세 · 할당관세 한도율",
      icon: "fa-percent",
      items: [
        { label: "조정관세 최대 가산율", correct: "100분의 100", variants: ["100분의 40", "100분의 60"], basis: "관세법 제69조", years: [2022] },
        { label: "할당관세 최대 인하율", correct: "100분의 40", variants: ["100분의 100", "100분의 60"], basis: "관세법 제71조", years: [2022] }
      ]
    },
    {
      topic: "신고지연 가산세",
      icon: "fa-clock",
      items: [
        { label: "신고지연 가산세액 한도", correct: "500만원", variants: [], basis: "관세법 제241조·시행령 제247조", years: [2022] },
        { label: "신고지연 가산세율(경과일수 구간별 차등)", correct: "1천분의 5 ~ 1천분의 20 (0.5%~2%, 20·50·80일 구간)", variants: ["관세의 100분의 20 일률"], note: "구간 예: 31~40일 1천분의 10 등. 일률 20%로 단정한 오답.", basis: "관세법 제241조·시행령 제247조", years: [2022, 2025] },
        { label: "지정장치장·보세창고 반입물품 수입·반송 신고기한", correct: "30일 이내", variants: ["60일 이내"], basis: "관세법 제241조", years: [2022] }
      ]
    },
    {
      topic: "간이신고 · 소액면세 기준",
      icon: "fa-receipt",
      items: [
        { label: "국내거주자 자가사용물품 간이신고·면세 기준", correct: "미화 150달러", variants: ["미화 200달러"], basis: "수입통관 사무처리에 관한 고시", years: [2025] },
        { label: "상업용 견본품 면세·신고생략 기준", correct: "미화 250달러(250불) 이하", variants: ["미화 200달러", "미화 300달러"], basis: "수입통관 사무처리에 관한 고시", years: [2023, 2025] },
        { label: "정식 수입신고 대상 우편물 금액 기준", correct: "미화 1,500불 초과", variants: [], basis: "수입통관 사무처리에 관한 고시", years: [2023] },
        { label: "B/L 분할신고 제한(분할 후 납부세액)", correct: "1만원 미만이면 분할신고 제한", variants: [], basis: "수입통관 사무처리에 관한 고시", years: [2023] }
      ]
    },
    {
      topic: "이사물품 관세면제",
      icon: "fa-box-archive",
      items: [
        { label: "외국 주거 거주기간", correct: "1년 이상", variants: ["2년"], basis: "관세법 제96조·시행규칙 제48조", years: [2022] },
        { label: "입국 전 사용기간", correct: "3개월 이상", variants: ["6개월", "1개월"], basis: "관세법 제96조·시행규칙 제48조", years: [2022] }
      ]
    },
    {
      topic: "수입신고수리전 세액심사 · 물품검사 손실보상",
      icon: "fa-magnifying-glass-dollar",
      items: [
        { label: "세액심사 제외 — 체납자 신고물품 체납액 기준", correct: "10만원 미만", variants: ["15만원 미만"], note: "또는 체납기간 7일 이내면 제외.", basis: "수입신고수리전 세액심사 대상물품 규정", years: [2022] },
        { label: "물품검사 손실보상(수리 가능 물품)", correct: "수리비 상당액 보상 (별도 '200만원 한도' 규정 없음)", variants: ["200만원 초과 불가(틀린 함정)"], note: "수리 가능 물품에 200만원 한도가 있는 것처럼 단정한 오답(2024 #6).", basis: "관세법 제246조의2·시행령", years: [2024] }
      ]
    }
  ],

  questions: [
    // ── 2019 ──
    { year: 2019, no: 3, concept: "공시송달 효력발생 + 신고서류 보관기간", correct: [{item:"공시송달 효력발생", value:"14일"}, {item:"신고서류 보관기간", value:"5년"}], distractors: [{item:"공시송달 효력발생", wrongValue:"7일"}], basis: "관세법 제11조·제12조", type: "틀린것고르기" },
    { year: 2019, no: 5, concept: "보세구역 반입명령 제한 — 신고수리 후 경과기간", correct: [{item:"반입명령 불가 경과기간", value:"3개월"}], distractors: [{item:"경과기간", wrongValue:"6개월"}], basis: "관세법 제238조·시행령 제245조", type: "틀린것고르기" },
    { year: 2019, no: 10, concept: "관세감면 신청서 제출기한(사후징수 / 수리 후)", correct: [{item:"사후징수 시(납부고지일부터)", value:"5일 이내"}, {item:"수입신고수리일부터", value:"15일 이내"}], distractors: [{item:"사후징수 시", wrongValue:"3일 이내"}, {item:"사후징수 시", wrongValue:"7일 이내"}, {item:"수입신고수리 후", wrongValue:"10일 이내"}], basis: "관세법 시행령 제112조", type: "빈칸채우기" },
    { year: 2019, no: 12, concept: "징수금액 최저한", correct: [{item:"징수 제외 기준 세액", value:"1만원 미만"}], distractors: [{item:"기준 세액", wrongValue:"3천원 이하"}, {item:"기준 세액", wrongValue:"8천원 미만"}, {item:"기준 세액", wrongValue:"1만원 이하"}], basis: "관세법 제40조·시행령 제37조", type: "빈칸채우기" },
    { year: 2019, no: 14, concept: "세관장 제출 원산지증명서 소급 발행 유효기간", correct: [{item:"소급 발행 유효기간", value:"1년"}], distractors: [{item:"유효기간", wrongValue:"6개월"}, {item:"유효기간", wrongValue:"2년"}, {item:"유효기간", wrongValue:"3년"}, {item:"유효기간", wrongValue:"4년"}], basis: "관세법 시행령 제236조", type: "빈칸채우기" },
    { year: 2019, no: 17, concept: "실질적 변형(세번변경) 품목번호 단위", correct: [{item:"세번변경기준 단위", value:"6단위"}], distractors: [{item:"단위", wrongValue:"4단위"}], basis: "관세법 제229조", type: "틀린것고르기" },
    { year: 2019, no: 21, concept: "수출신고수리물품 적재기간", correct: [{item:"적재기한(수리일부터)", value:"30일"}, {item:"적재기간 연장 범위", value:"1년"}], distractors: [{item:"적재기한", wrongValue:"60일"}], basis: "관세법 제251조", type: "빈칸채우기" },

    // ── 2020 ──
    { year: 2020, no: 2, concept: "신고서류별 보관기간(5/3/2년)", correct: [{item:"수입신고필증", value:"5년"}, {item:"수출신고필증", value:"3년"}, {item:"보세화물 반출입 자료", value:"2년"}, {item:"과세가격 결정 자료", value:"5년"}, {item:"보세운송 자료", value:"2년"}], distractors: [{item:"보세화물 반출입 자료", wrongValue:"3년"}], basis: "관세법 제12조·시행령 제3조", type: "틀린것고르기" },
    { year: 2020, no: 7, concept: "심사청구 청구기간 + 세관장 의견서 송부기간", correct: [{item:"심사청구(처분 안 날부터)", value:"90일"}, {item:"이의신청 결정 통지 후 심사청구", value:"90일"}, {item:"세관장 의견서 송부", value:"7일"}], distractors: [{item:"심사청구 기간", wrongValue:"120일"}], basis: "관세법 제121조·제122조", type: "틀린것고르기" },
    { year: 2020, no: 8, concept: "고액·상습체납자 명단공개 요건", correct: [{item:"체납발생일부터 경과", value:"1년"}, {item:"체납액 기준", value:"2억원"}], distractors: [{item:"경과기간", wrongValue:"6월"}, {item:"경과기간", wrongValue:"3년"}, {item:"체납액", wrongValue:"1억원"}, {item:"체납액", wrongValue:"3억원"}], basis: "관세법 제116조의2", type: "빈칸채우기" },

    // ── 2021 ──
    { year: 2021, no: 4, concept: "경정청구 기간(기본 / 소송판결 후 / 경정처분 통지 후)", correct: [{item:"기본 경정청구(최초 납세신고일부터)", value:"5년"}, {item:"소송 판결 결과 안 날부터", value:"2개월"}, {item:"경정처분 통지받은 날부터", value:"3개월"}], distractors: [{item:"기본 경정청구", wrongValue:"3년"}, {item:"소송 판결 후", wrongValue:"3개월"}, {item:"소송 판결 후", wrongValue:"6개월"}, {item:"경정처분 통지 후", wrongValue:"2개월"}, {item:"경정처분 통지 후", wrongValue:"6개월"}], basis: "관세법 제38조의3", type: "빈칸채우기" },
    { year: 2021, no: 10, concept: "과세가격(거래가격) 산출 — 가산·공제 합계", correct: [{item:"과세가격 합계", value:"1,320$ (890+포장20+상표권40+채무변제300+운임50+보험20)"}], distractors: [{item:"과대계상", wrongValue:"1,500$"}, {item:"일부 오처리", wrongValue:"1,340$"}, {item:"채무변제 누락 과소", wrongValue:"1,020$"}, {item:"가산·공제 미반영", wrongValue:"1,000$"}], basis: "관세법 제30조", type: "기타" },
    { year: 2021, no: 11, concept: "수입물품 유통이력 신고자료 보관기간", correct: [{item:"유통이력 자료 보관(거래일부터)", value:"5년"}], distractors: [{item:"보관기간", wrongValue:"2년"}], basis: "관세법 제240조의2", type: "틀린것고르기" },
    { year: 2021, no: 18, concept: "보세구역 반입명령 가능 기간(원본 내부 불일치)", correct: [{item:"반입명령 가능 기간(해설 기준)", value:"6개월"}], distractors: [{item:"선지 표기 수치", wrongValue:"3월"}], basis: "관세법 제238조. ※원문 내부 불일치: 선지 '나'는 3월, 해설은 6개월(오기 추정). 다수 기출·시행령은 3개월", type: "옳은것고르기" },
    { year: 2021, no: 23, concept: "지식재산권 통관보류 담보 비율(일반/중소기업)", correct: [{item:"통관보류·유치 담보(과세가격 대비)", value:"100분의 120 (120%)"}, {item:"중소기업 담보", value:"100분의 40 (40%)"}], distractors: [{item:"통관보류 담보", wrongValue:"100분의 125"}, {item:"중소기업 담보", wrongValue:"100분의 50"}, {item:"법원 제소사실 입증 기간", wrongValue:"15일"}], basis: "관세법 제235조", type: "옳은것고르기" },
    { year: 2021, no: 25, concept: "수출신고수리물품 적재기간 및 연장 승인", correct: [{item:"적재기간(수리일부터)", value:"30일"}, {item:"적재기간 연장 범위", value:"1년"}, {item:"취소예정통보 후 원인규명", value:"14일"}], distractors: [{item:"적재기간 연장 범위", wrongValue:"2년"}], basis: "수출통관 사무처리에 관한 고시", type: "틀린것고르기" },

    // ── 2022 ──
    { year: 2022, no: 8, concept: "수입신고수리전 세액심사 제외 기준(체납액/기간)", correct: [{item:"체납자 신고물품 제외 체납액", value:"10만원 미만"}, {item:"제외 체납기간", value:"7일 이내"}], distractors: [{item:"체납액 기준", wrongValue:"15만원 미만"}], basis: "수입신고수리전 세액심사 대상물품 규정", type: "틀린것고르기" },
    { year: 2022, no: 9, concept: "신고서류별 보관기간(연수)", correct: [{item:"지식재산권 거래 계약서", value:"5년"}, {item:"가격결정 자료", value:"5년"}, {item:"수출신고필증", value:"3년"}, {item:"보세화물 반출입 자료", value:"2년"}, {item:"적재화물목록 자료", value:"2년"}], distractors: [{item:"가격결정 자료", wrongValue:"3년"}, {item:"보세화물 반출입", wrongValue:"1년"}, {item:"적재화물목록", wrongValue:"1년"}, {item:"수출신고필증", wrongValue:"2년"}], basis: "관세법 제12조·시행령 제3조", type: "옳은것고르기" },
    { year: 2022, no: 11, concept: "관세 분할납부 승인 기간 및 미납 징수 납부기한", correct: [{item:"천재지변 등 사유", value:"1년"}, {item:"정부·지자체 수입물품", value:"5년"}, {item:"미납 시 세관장 지정 납부기한", value:"15일 이내"}], distractors: [{item:"천재지변 등", wrongValue:"2년"}, {item:"정부·지자체", wrongValue:"10년"}], basis: "관세법 제107조", type: "옳은것고르기" },
    { year: 2022, no: 13, concept: "원산지 상이표시 반입명령 + 유통이력 보관기간", correct: [{item:"원산지 상이표시 반입명령", value:"3개월 이내"}, {item:"유통이력 자료 보관", value:"1년"}], distractors: [{item:"반입명령 기간", wrongValue:"6개월 이내"}], basis: "관세법령·수입통관 사무처리에 관한 고시", type: "옳은것고르기" },
    { year: 2022, no: 14, concept: "원산지증명서 제출 면제 과세가격 기준", correct: [{item:"제출면제 기준", value:"15만원 이하"}], distractors: [{item:"기준", wrongValue:"20만원 이하"}], basis: "관세법 제232조·시행령", type: "기타" },
    { year: 2022, no: 15, concept: "잠정가격 신고 시 확정가격 신고기한 + 가산율 요청 기한", correct: [{item:"확정가격 신고기한 범위", value:"2년"}, {item:"가산율 산정 사전요청", value:"30일"}], distractors: [{item:"확정가격 신고기한", wrongValue:"3년"}, {item:"가산율 요청", wrongValue:"60일"}, {item:"가산율 요청", wrongValue:"15일"}], basis: "관세법 시행령 제30조", type: "빈칸채우기" },
    { year: 2022, no: 16, concept: "세액보정 신청 시 부족세액 납부기한", correct: [{item:"납부기한", value:"보정신청을 한 날의 다음날까지"}], distractors: [{item:"납부기한(오답 선지)", wrongValue:"보정한 날부터 15일까지"}], basis: "관세법 시행령 제56조", type: "옳은것고르기" },
    { year: 2022, no: 19, concept: "수입신고전 즉시반출 — 실적기간·신고기한·가산세", correct: [{item:"대상자 수출입실적 보유기간", value:"최근 3년"}, {item:"즉시반출 후 수입신고 기한", value:"10일 이내"}, {item:"기한 내 미신고 가산세율", value:"관세의 100분의 20"}], distractors: [{item:"실적 보유기간", wrongValue:"최근 2년"}], basis: "관세법 제253조", type: "틀린것고르기" },
    { year: 2022, no: 20, concept: "조정관세·할당관세 부과 한도율", correct: [{item:"조정관세 최대 가산율", value:"100분의 100"}, {item:"할당관세 최대 인하율", value:"100분의 40"}], distractors: [{item:"조정관세 가산", wrongValue:"100분의 40"}, {item:"조정관세 가산", wrongValue:"100분의 60"}, {item:"할당관세 인하", wrongValue:"100분의 100"}, {item:"할당관세 인하", wrongValue:"100분의 60"}], basis: "관세법 제69조·제71조", type: "빈칸채우기" },
    { year: 2022, no: 23, concept: "신고지연 가산세 한도·차등율 + 수입·반송 신고기한", correct: [{item:"신고지연 가산세액 한도", value:"500만원"}, {item:"가산세 차등율(20·50·80일 구간)", value:"1천분의 5~1천분의 20 (0.5%~2%)"}, {item:"수입·반송 신고기한", value:"30일"}], distractors: [{item:"신고기한", wrongValue:"60일 이내"}, {item:"가산세율", wrongValue:"관세의 100분의 20 일률"}], basis: "관세법 제241조·시행령 제247조", type: "옳은것고르기" },
    { year: 2022, no: 25, concept: "이사물품 관세면제 요건(거주기간/사용기간)", correct: [{item:"외국 주거 거주기간", value:"1년 이상"}, {item:"입국 전 사용기간", value:"3개월 이상"}], distractors: [{item:"거주기간", wrongValue:"2년"}, {item:"사용기간", wrongValue:"6개월"}, {item:"사용기간", wrongValue:"1개월"}], basis: "관세법 제96조·시행규칙 제48조", type: "빈칸채우기" },

    // ── 2023 ──
    { year: 2023, no: 4, concept: "감면 사후관리 제척기간 + 경정·소송 후 처분기한", correct: [{item:"감면관세 징수 제척기간", value:"5년"}, {item:"경정청구에 대한 세관장 경정기한", value:"2개월"}, {item:"행정소송 판결 확정 후 경정·처분", value:"1년"}], distractors: [{item:"경정기한", wrongValue:"3개월"}, {item:"소송 판결 후", wrongValue:"2년"}, {item:"부정환급 제척기간", wrongValue:"5년"}], basis: "관세법 제21조·제38조의3", type: "옳은것고르기" },
    { year: 2023, no: 11, concept: "과세전적부심사·심사청구 청구기간", correct: [{item:"과세전적부심사(통지 받은 날부터)", value:"30일"}, {item:"심사청구(처분 있은 날부터)", value:"90일"}], distractors: [{item:"과세전적부심사", wrongValue:"20일"}, {item:"심사청구", wrongValue:"60일"}, {item:"심사청구", wrongValue:"30일"}], basis: "관세법 제118조·제121조", type: "빈칸채우기" },
    { year: 2023, no: 15, concept: "소액 신고생략·간이신고 기준 금액", correct: [{item:"면세 상용견품 신고생략·간이신고 기준", value:"미화 250불 이하"}, {item:"정식 수입신고 대상 우편물 금액", value:"미화 1,500불 초과"}], distractors: [], basis: "수입통관 사무처리에 관한 고시", type: "기타" },
    { year: 2023, no: 16, concept: "B/L 분할신고 제한 — 분할 후 납부세액 기준", correct: [{item:"B/L 분할신고 제한 기준", value:"1만원 미만"}], distractors: [], basis: "수입통관 사무처리에 관한 고시", type: "틀린것고르기" },
    { year: 2023, no: 17, concept: "반송물품 보세운송기간 + 적재여부 확인 경과일", correct: [{item:"반송물품 보세운송기간", value:"7일"}, {item:"반송신고수리물품 적재 확인 경과일(수리일부터)", value:"30일"}], distractors: [{item:"보세운송기간", wrongValue:"10일"}], basis: "반송절차에 관한 고시", type: "틀린것고르기" },
    { year: 2023, no: 18, concept: "원산지 세번변경기준(CTSH) 품목번호 단위", correct: [{item:"세번변경기준 단위(소호)", value:"6단위"}], distractors: [{item:"단위", wrongValue:"2단위"}, {item:"단위", wrongValue:"4단위"}, {item:"단위", wrongValue:"8단위"}, {item:"단위", wrongValue:"10단위"}], basis: "관세법 제229조·시행규칙 제74조", type: "빈칸채우기" },
    { year: 2023, no: 23, concept: "수출신고수리물품 적재기한 및 연장승인 범위", correct: [{item:"적재기한(수리일부터)", value:"30일"}, {item:"적재기간 연장승인 범위", value:"1년"}], distractors: [{item:"적재기한", wrongValue:"60일"}, {item:"연장승인 범위", wrongValue:"3개월"}, {item:"연장승인 범위", wrongValue:"6개월"}], basis: "관세법 제251조", type: "빈칸채우기" },

    // ── 2024 ──
    { year: 2024, no: 6, concept: "물품검사 손실보상 — 수리 가능 물품 보상금액 한도(실제 무한도)", correct: [], distractors: [{item:"수리 가능 물품 손실보상 한도(틀린 선지)", wrongValue:"200만원 초과 불가"}], basis: "관세법 제246조의2·시행령 (수리비 상당액 한도 200만원 규정 없음)", type: "옳은것고르기" },
    { year: 2024, no: 16, concept: "관세 경정청구 기간 및 세관장 통지기간", correct: [{item:"경정청구(최초 납세신고일부터)", value:"5년"}, {item:"세관장 경정·거부 통지기간", value:"2개월"}], distractors: [{item:"경정청구 기간", wrongValue:"3년"}, {item:"통지·기준기간", wrongValue:"1개월"}], basis: "관세법 제38조의3", type: "빈칸채우기" },
    { year: 2024, no: 21, concept: "관세부과 제척기간(부정포탈 / 심판결정 후 특례)", correct: [{item:"부정한 방법 포탈·환급·감면", value:"10년"}, {item:"심판청구 결정 후 특례 부과기간", value:"1년"}], distractors: [{item:"부정포탈 제척기간", wrongValue:"5년"}, {item:"심판결정 후 특례", wrongValue:"2년"}], basis: "관세법 제21조·시행령 제6조", type: "옳은것고르기" },
    { year: 2024, no: 24, concept: "보세구역 반입명령 대상 제외 — 신고수리 후 경과기간", correct: [{item:"반입명령 제외 경과기간(신고수리 후)", value:"3개월"}], distractors: [{item:"경과기간", wrongValue:"1월(1개월)"}], basis: "관세법 제238조·시행령", type: "옳은것고르기" },

    // ── 2025 ──
    { year: 2025, no: 3, concept: "신고 취하 승인 여부 통지기간", correct: [{item:"취하 승인 여부 통지기간", value:"10일"}], distractors: [{item:"통지기간(오답 선지)", wrongValue:"20일"}], basis: "관세법 제250조", type: "옳은것고르기" },
    { year: 2025, no: 4, concept: "신고·통관 관련 서류 보관기간", correct: [{item:"수입신고필증", value:"5년"}, {item:"수출신고필증", value:"3년"}, {item:"반송신고필증", value:"3년"}, {item:"보세화물 반출입 자료", value:"2년"}, {item:"적재화물목록 자료", value:"2년"}], distractors: [], basis: "관세법 제12조·시행령 제3조", type: "기타" },
    { year: 2025, no: 9, concept: "세액 보정 신청기간(신고납부일 기산)", correct: [{item:"세액 보정 신청기간", value:"6개월"}], distractors: [{item:"신청기간(오답 선지)", wrongValue:"3개월"}], basis: "관세법 제38조의2", type: "빈칸채우기" },
    { year: 2025, no: 18, concept: "수출신고수리물품 적재기간 및 연장범위", correct: [{item:"적재기간", value:"30일"}, {item:"적재기간 연장범위", value:"1년"}], distractors: [{item:"적재기간(오답 선지)", wrongValue:"1년"}, {item:"연장범위(오답 선지)", wrongValue:"6개월"}], basis: "관세법 제241조", type: "빈칸채우기" },
    { year: 2025, no: 20, concept: "수입·반송 신고기한 경과일수 구간별 가산세율", correct: [{item:"경과 31~40일 구간 가산세율", value:"1천분의 10"}], distractors: [{item:"경과 19~20일 구간(오답)", wrongValue:"1천분의 10"}, {item:"경과 21~30일 구간(오답)", wrongValue:"1천분의 15"}, {item:"경과 41~50일 구간(오답)", wrongValue:"1천분의 15"}, {item:"경과 51~60일 구간(오답)", wrongValue:"1천분의 20"}], basis: "관세법 제241조", type: "옳은것고르기" },
    { year: 2025, no: 22, concept: "관세부과 제척기간(원칙/부정포탈/결정확정 후)", correct: [{item:"원칙적 제척기간", value:"5년"}, {item:"부정한 방법 포탈·환급·감면", value:"10년"}, {item:"감사원 심사청구 결정 확정일부터", value:"1년"}, {item:"압수물품 반환결정 확정일부터", value:"1년"}], distractors: [{item:"부정포탈(오답)", wrongValue:"5년"}, {item:"감사원 결정 후(오답)", wrongValue:"2년"}, {item:"원칙(오답)", wrongValue:"10년"}, {item:"압수물품 반환 후(오답)", wrongValue:"2년"}], basis: "관세법 제21조·시행령 제6조", type: "옳은것고르기" },
    { year: 2025, no: 24, concept: "간이신고 대상물품 면세 금액기준(자가사용/견본품)", correct: [{item:"자가사용물품 면세기준(물품가격)", value:"미화 150달러"}, {item:"상업용 견본품 면세기준", value:"미화 250달러"}], distractors: [{item:"자가사용물품(오답)", wrongValue:"미화 200달러"}, {item:"견본품(오답)", wrongValue:"미화 200달러"}, {item:"견본품(오답)", wrongValue:"미화 300달러"}], basis: "수입통관 사무처리에 관한 고시", type: "빈칸채우기" }
  ]
};
