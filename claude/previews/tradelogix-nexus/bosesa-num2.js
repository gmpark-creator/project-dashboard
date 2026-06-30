// 보세사 2과목(보세구역관리) — '숫자' 집중 정리 데이터
// 박사 지시(2026-06-30): 4·1과목에 이어 2과목 숫자 선지·정답·오답을 한 카테고리로 모음.
// 출처: 2과목 2019~2025 7개년 기출(BOSESA_DATA_2_*)에서 숫자 변별 문항 전수 추출.
// ⚠️ 학습 보조용. 법령·고시는 개정되므로 시험 직전 최신 원문 확인 필수.
window.BOSESA_NUM2 = {
  subject: 2,
  subjectName: "보세구역관리",
  updated: "2026-06-30",

  concepts: [
    {
      topic: "특허보세구역 특허기간 · 갱신",
      icon: "fa-certificate",
      items: [
        { label: "특허기간 — 보세창고·보세공장 등", correct: "10년 이내", variants: ["7년", "5년"], note: "보세전시장·보세건설장은 행사·공사 기간을 고려해 세관장이 정함.", basis: "관세법 제176조", years: [2019, 2022, 2024] },
        { label: "특허기간 — 보세판매장", correct: "5년 이내", variants: ["10년(다른 보세구역과 묶어 출제)"], basis: "관세법 제176조의2", years: [2019, 2024] },
        { label: "보세판매장 특허 갱신 횟수", correct: "두 차례(2회)에 한정", variants: ["3회"], basis: "관세법 제176조의2 제6항", years: [2019] },
        { label: "특허 갱신신청 기한", correct: "특허기간 만료 30일 전까지", variants: ["만료 3개월 전까지"], basis: "특허보세구역 운영에 관한 고시", years: [2024] }
      ]
    },
    {
      topic: "특허 효력상실 · 의제 · 승계",
      icon: "fa-clock-rotate-left",
      items: [
        { label: "특허 효력상실 후 특허보세구역 의제기간", correct: "6개월 범위(세관장 지정)", variants: ["3개월", "1개월"], note: "외국물품 종류·수량 등을 고려해 6개월 범위에서 세관장이 지정.", basis: "관세법 제182조", years: [2022, 2024] },
        { label: "특허 승계신고 결과 통보기한", correct: "신고일부터 5일 이내", variants: [], basis: "관세법·특허보세구역 운영에 관한 고시", years: [2024] }
      ]
    },
    {
      topic: "보세창고 · 특수보세구역 면적 요건",
      icon: "fa-ruler-combined",
      items: [
        { label: "영업용 보세창고 고내면적", correct: "1,000㎡ 이상", variants: ["500㎡"], basis: "특허보세구역 운영에 관한 고시", years: [2020] },
        { label: "컨테이너전용 보세창고 부지면적", correct: "15,000㎡ 이상", variants: [], basis: "특허보세구역 운영에 관한 고시", years: [2019] },
        { label: "야적전용 보세창고 대지(부속 야적장 제외)", correct: "4,500㎡ 이상", variants: [], basis: "특허보세구역 운영에 관한 고시", years: [2019] },
        { label: "액체화물전용 보세창고 기준", correct: "저장용적(㎥) 기준 — 면적(㎡)이 아님", variants: ["고내면적 500㎡로 단정(오답 함정)"], basis: "특허보세구역 운영에 관한 고시", years: [2019] }
      ]
    },
    {
      topic: "보세판매장 구매 · 판매 한도",
      icon: "fa-bag-shopping",
      items: [
        { label: "출국 내국인 구매한도", correct: "(과거) 미화 5,000달러", variants: ["2,000", "3,000", "4,000", "6,000달러"], note: "⚠️ 출국 내국인 구매한도는 이후 폐지됨(2024 기출 반영) — 현행은 한도 없음. 2020·2021 기출은 5,000달러로 출제.", basis: "관세법 시행규칙(구 제69조의3)", years: [2020, 2021] },
        { label: "입국장 보세판매장 판매한도", correct: "미화 800달러", variants: ["600달러"], note: "⚠️ 2022년경 개정으로 600 → 800달러. 술·담배·향수는 이 한도와 별도 면세범위.", basis: "관세법 제196조의2·시행규칙", years: [2020, 2022, 2025] },
        { label: "입국인(여행자) 구매한도", correct: "미화 600달러", variants: ["400달러"], basis: "관세법 시행규칙 제69조의4", years: [2021] },
        { label: "입국장 별도 면세품목 한도", correct: "술 2리터(ℓ)·미화 400달러 / 담배 궐련 200개비 / 향수 100밀리리터(㎖)", variants: [], note: "보세판매장 800달러 한도와 별도로 산정.", basis: "관세법 시행규칙", years: [2025] }
      ]
    },
    {
      topic: "지정장치장 · 종합보세구역 · 화물관리인",
      icon: "fa-boxes-stacked",
      items: [
        { label: "지정장치장 물품 장치기간", correct: "6개월", variants: [], note: "세관장이 연장 가능(연장범위는 출제 상이: 2023 기출 3개월 범위 / 2025 기출 6개월).", basis: "관세법 제170조", years: [2023, 2025] },
        { label: "지정장치장 화물관리인 지정 유효기간", correct: "5년 이내", variants: ["3년"], basis: "관세법 제172조", years: [2021, 2025] },
        { label: "종합보세구역 반입물품 장치기간", correct: "제한 없음(무제한)", variants: ["2년의 범위에서 관세청장이 정함"], basis: "관세법 제197조 이하·종합보세구역 운영에 관한 고시", years: [2021] }
      ]
    },
    {
      topic: "보세공장 원료과세 · 혼용 · 외 작업",
      icon: "fa-industry",
      items: [
        { label: "원료과세 (일괄/포괄)적용 수출물품 가격비율", correct: "최근 1~2년 100분의 50 이상", variants: ["100분의 60 이상", "100분의 50 미만(부등호 변형)"], basis: "관세법 제189조·보세공장 운영에 관한 고시", years: [2020, 2021] },
        { label: "원료과세 포괄적용 신청 범위", correct: "1년의 범위", variants: [], basis: "보세공장 운영에 관한 고시", years: [2021] },
        { label: "혼용물품 관세 = 외국원자재 가격비율만큼 과세", correct: "예: 제품 1,000만·관세율 10%·외국원자재 300만/총원자재 500만 → 60만원", variants: ["100만", "80만", "40만", "30만원"], note: "관세 = 제품가격×관세율×(외국원자재가격÷전체원자재가격).", basis: "관세법 — 보세공장 혼용물품 과세", years: [2024] },
        { label: "보세공장 외 작업 허가기간(1단위 장기소요)", correct: "2년의 범위", variants: ["5년의 범위"], note: "허가여부 통지 10일 이내, 작업완료 결과 통보 5일 이내.", basis: "관세법 — 보세공장 외 작업 허가", years: [2024] },
        { label: "수입신고전 반출 잉여물품 수입신고 기한", correct: "반출신고서 제출일부터 10일 이내", variants: ["30일 이내"], note: "부설 연구소 사용 시설·원재료 수입·반송신고는 반입일부터 30일 이내.", basis: "보세공장 운영에 관한 고시", years: [2023] }
      ]
    },
    {
      topic: "보세전시장 · 보세건설장",
      icon: "fa-display",
      items: [
        { label: "보세전시장 관람자 무상증여 소액물품 면세 기준", correct: "관람자 1인당 미화 5달러 상당액 이하", variants: ["미화 10달러"], basis: "보세전시장 운영에 관한 고시", years: [2019] },
        { label: "보세전시장 폐회 후 미처리 외국물품 반출", correct: "특허기간 만료 시(별도 유예기간 없음)", variants: ["특허기간 만료 후 30일 이내"], basis: "보세전시장 운영에 관한 고시", years: [2023] },
        { label: "보세건설장 건설완료보고 기한", correct: "건설 완료 후 지체없이(별도 기한 규정 없음)", variants: ["완료일부터 1개월 이내"], basis: "보세건설장 운영에 관한 고시", years: [2023] }
      ]
    },
    {
      topic: "종합보세사업장 신고기한",
      icon: "fa-file-signature",
      items: [
        { label: "설치·운영기간 연장 변경신고", correct: "기간 만료 30일 전까지", variants: [], basis: "종합보세구역 운영에 관한 고시", years: [2023] },
        { label: "휴업신고 대상 기준", correct: "30일 이상 계속 휴업", variants: ["15일 이상"], basis: "종합보세구역 운영에 관한 고시", years: [2023] },
        { label: "임차 시 연장 임대차계약서 제출기한", correct: "임대차계약 만료 15일 전까지", variants: ["10일 전까지"], basis: "종합보세구역 운영에 관한 고시", years: [2023] }
      ]
    },
    {
      topic: "작업 허가 · 활어장치장",
      icon: "fa-fish",
      items: [
        { label: "해체·절단 등 작업 허가여부 통지기간", correct: "10일 이내", variants: ["7일 이내"], basis: "관세법 제159조", years: [2020] },
        { label: "활어장치장 CCTV 녹화영상 보관기간", correct: "30일 이상", variants: ["15일 이상"], basis: "수입활어 관리에 관한 특례고시", years: [2024] },
        { label: "수입활어 검역 불합격품 반송·폐기 명령기한", correct: "불합격 통보받은 날부터 15일 이내", variants: [], basis: "수입활어 관리에 관한 특례고시", years: [2023] }
      ]
    },
    {
      topic: "운영인 결격 · 보세사 · 과징금",
      icon: "fa-gavel",
      items: [
        { label: "운영인 결격 — 징역형 실형 집행종료·면제 후 경과", correct: "2년", variants: ["1년"], basis: "관세법 제175조", years: [2025] },
        { label: "보세사 결원 시 다른 보세사 채용기간", correct: "2개월 이내", variants: ["3개월 이내"], basis: "특허보세구역 운영에 관한 고시", years: [2025] },
        { label: "운영인 과징금 — 1일당(연간 매출액 대비)", correct: "6천분의 1", variants: ["3천분의 1"], basis: "관세법 제178조·시행령", years: [2025] },
        { label: "운영인 과징금 — 가중·감경 범위", correct: "4분의 1", variants: ["2분의 1"], basis: "관세법 제178조·시행령", years: [2025] },
        { label: "운영인 과징금 — 총액 상한(연간 매출액 대비)", correct: "100분의 3", variants: ["100분의 1"], basis: "관세법 제178조·시행령", years: [2025] }
      ]
    },
    {
      topic: "보세구역 기간 종합 정리 (합산 암기)",
      icon: "fa-list-ol",
      items: [
        { label: "기간 4종 합산(2021 기출)", correct: "화물관리인 5년 + 지정장치장 장치 6개월 + 특허보세구역 10년 + 보세판매장 5년", variants: ["합계 18 / 21 / 23 / 33 (정답 합 26)"], note: "각 기간을 정확히 알아야 합산형 문항 대응 가능.", basis: "관세법 제154조 이하", years: [2021] }
      ]
    }
  ],

  questions: [
    // ── 2019 ──
    { year: 2019, no: 2, concept: "보세판매장 특허 갱신횟수 + 특허기간", correct: [{item:"보세판매장 특허 갱신 횟수", value:"두 차례(2회)"}, {item:"보세창고 특허기간", value:"10년 범위"}, {item:"보세판매장 특허기간", value:"5년 이내"}], distractors: [{item:"갱신 횟수", wrongValue:"3회"}], basis: "관세법 제176조의2", type: "틀린것고르기" },
    { year: 2019, no: 7, concept: "특수보세구역 면적·부지 요건", correct: [{item:"컨테이너전용 부지면적", value:"15,000㎡ 이상"}, {item:"야적전용 대지", value:"4,500㎡ 이상"}], distractors: [{item:"액체화물전용 고내면적(실제 ㎥ 기준)", wrongValue:"500㎡ 이상"}], basis: "특허보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2019, no: 10, concept: "보세전시장 관람자 증여품 면세 기준금액", correct: [{item:"관람자 1인당 증여품 면세 기준", value:"미화 5달러 이하"}], distractors: [{item:"기준금액", wrongValue:"미화 10달러"}], basis: "보세전시장 운영에 관한 고시", type: "옳은것고르기" },

    // ── 2020 ──
    { year: 2020, no: 8, concept: "영업용 보세창고 고내면적 최소 기준", correct: [{item:"영업용 보세창고 고내면적", value:"1,000㎡ 이상"}], distractors: [{item:"고내면적", wrongValue:"500㎡ 이상"}], basis: "특허보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2020, no: 18, concept: "입국장 보세판매장 1인 판매한도(개정 전)", correct: [{item:"입국자 판매한도", value:"미화 600달러"}], distractors: [{item:"판매한도", wrongValue:"미화 1,000달러"}], basis: "관세법 시행규칙 (※2022 개정으로 800달러)", type: "빈칸채우기" },
    { year: 2020, no: 19, concept: "해체·절단 등 작업 허가여부 통지기간", correct: [{item:"통지기간", value:"10일 이내"}], distractors: [{item:"통지기간", wrongValue:"7일 이내"}], basis: "관세법 제159조", type: "옳은것고르기" },
    { year: 2020, no: 20, concept: "출국 내국인 보세판매장 판매한도(2020 기준)", correct: [{item:"출국 내국인 판매한도", value:"미화 5,000달러"}], distractors: [{item:"판매한도", wrongValue:"미화 2,000달러"}, {item:"판매한도", wrongValue:"미화 3,000달러"}, {item:"판매한도", wrongValue:"미화 4,000달러"}, {item:"판매한도", wrongValue:"미화 6,000달러"}], basis: "보세판매장 운영에 관한 고시 (※이후 한도 폐지)", type: "옳은것고르기" },
    { year: 2020, no: 25, concept: "보세공장 원료과세 일괄적용 수출물품 가격비율", correct: [{item:"수출물품 가격비율(최근 2년)", value:"100분의 50 이상"}], distractors: [{item:"가격비율", wrongValue:"100분의 50 미만"}], basis: "관세법 제189조", type: "틀린것고르기" },

    // ── 2021 ──
    { year: 2021, no: 1, concept: "보세공장 원료과세 포괄적용 수출비율 요건", correct: [{item:"수출비율(최근 1년)", value:"100분의 50 이상"}, {item:"포괄적용 신청 범위", value:"1년의 범위"}], distractors: [{item:"수출비율", wrongValue:"100분의 60 이상"}], basis: "관세법 제189조·보세공장 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2021, no: 6, concept: "출국 내국인 구매한도 + 판매내역 전송시한", correct: [{item:"출국 내국인 구매한도", value:"미화 5,000달러 이하"}], distractors: [{item:"구매한도", wrongValue:"미화 6,000달러 이하"}, {item:"판매내역 세관 전송시한", wrongValue:"24시간 내"}], basis: "보세판매장 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2021, no: 7, concept: "출국 내국인 / 입국인 구매한도 조합", correct: [{item:"출국 내국인 구매한도", value:"미화 5,000달러 이하"}, {item:"입국인 구매한도", value:"미화 600달러 이하"}], distractors: [{item:"출국/입국 조합", wrongValue:"3,000 / 400"}, {item:"조합", wrongValue:"3,000 / 600"}, {item:"조합", wrongValue:"4,000 / 400"}, {item:"조합", wrongValue:"6,000 / 400"}], basis: "관세법 시행규칙 제69조의3·제69조의4", type: "빈칸채우기" },
    { year: 2021, no: 8, concept: "보세판매장 특허상실 시 재고처리 + 이고 후 양도·반출 기간", correct: [{item:"특허상실 후 재고처리", value:"6개월 이내"}, {item:"이고일부터 양도·반출", value:"6개월 이내"}], distractors: [{item:"처리/이고 조합", wrongValue:"2개월 / 3개월"}, {item:"조합", wrongValue:"3개월 / 3개월"}, {item:"조합", wrongValue:"3개월 / 6개월"}, {item:"조합", wrongValue:"6개월 / 3개월"}], basis: "보세판매장 운영에 관한 고시", type: "빈칸채우기" },
    { year: 2021, no: 12, concept: "종합보세구역 반입물품 장치기간", correct: [{item:"장치기간", value:"제한 없음(무제한)"}], distractors: [{item:"장치기간", wrongValue:"2년의 범위에서 관세청장이 정함"}], basis: "관세법 제197조 이하", type: "틀린것고르기" },
    { year: 2021, no: 16, concept: "보세구역 기간 4종 합산", correct: [{item:"화물관리인 지정 유효기간", value:"5년"}, {item:"지정장치장 장치기간", value:"6개월"}, {item:"특허보세구역 특허기간", value:"10년"}, {item:"보세판매장 특허기간", value:"5년"}, {item:"합계", value:"26"}], distractors: [{item:"합계", wrongValue:"18"}, {item:"합계", wrongValue:"21"}, {item:"합계", wrongValue:"23"}, {item:"합계", wrongValue:"33"}], basis: "관세법 제154조 이하", type: "빈칸채우기" },

    // ── 2022 ──
    { year: 2022, no: 9, concept: "입국장면세점 면세 한도(개정 후, 술·담배·향수 별도)", correct: [{item:"입국장면세점 면세 한도", value:"미화 800달러"}], distractors: [{item:"한도(술·담배·향수 포함으로 오출제)", wrongValue:"미화 600달러"}], basis: "관세법 제196조의2 (개정 전 600달러)", type: "틀린것고르기" },
    { year: 2022, no: 17, concept: "특허보세구역 특허기간(원칙 10년)", correct: [{item:"보세창고 특허기간", value:"10년 이내"}, {item:"보세공장 특허기간", value:"10년 이내"}], distractors: [{item:"보세공장", wrongValue:"7년 이내"}, {item:"보세전시장", wrongValue:"5년 이내"}, {item:"보세건설장", wrongValue:"5년 이내"}], basis: "관세법 제176조", type: "옳은것고르기" },
    { year: 2022, no: 21, concept: "특허 효력상실 시 특허보세구역 의제기간", correct: [{item:"의제기간", value:"6개월"}], distractors: [{item:"의제기간", wrongValue:"3개월"}, {item:"의제기간", wrongValue:"1개월"}], basis: "관세법 제182조", type: "빈칸채우기" },

    // ── 2023 ──
    { year: 2023, no: 1, concept: "보세전시장 폐회 후 미처리 외국물품 반출 시점", correct: [{item:"반출 시점", value:"특허기간 만료 시(별도 유예 없음)"}], distractors: [{item:"유예기간", wrongValue:"특허기간 만료 후 30일 이내"}], basis: "보세전시장 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2023, no: 3, concept: "보세건설장 건설완료보고 기한", correct: [{item:"건설완료보고", value:"건설 완료 후 지체없이(별도 기한 없음)"}], distractors: [{item:"보고 기한", wrongValue:"완료일부터 1개월 이내"}], basis: "보세건설장 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2023, no: 11, concept: "종합보세사업장 변경신고·휴업·임대차 기한", correct: [{item:"설치·운영기간 연장 변경신고", value:"기간 만료 30일 전까지"}, {item:"휴업신고 대상", value:"30일 이상 계속 휴업"}, {item:"임대차 연장서류 제출", value:"임대차 만료 15일 전까지"}], distractors: [{item:"휴업신고 대상", wrongValue:"15일 이상"}, {item:"설치·운영기간 한도", wrongValue:"30년의 범위 내"}, {item:"임대차 제출", wrongValue:"임대차 만료 10일 전까지"}], basis: "종합보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2023, no: 13, concept: "수입활어 검역 불합격품 반송·폐기 명령기한", correct: [{item:"반송·폐기 명령기한", value:"불합격 통보받은 날부터 15일 이내"}], distractors: [], basis: "수입활어 관리에 관한 특례고시", type: "옳은것고르기" },
    { year: 2023, no: 14, concept: "지정장치장 장치기간 + 세관장 연장기간", correct: [{item:"장치기간", value:"6개월"}, {item:"세관장 연장 범위", value:"3개월의 범위"}], distractors: [{item:"연장 범위", wrongValue:"6개월의 범위"}], basis: "관세법 제170조·제172조", type: "옳은것고르기" },
    { year: 2023, no: 20, concept: "보세공장 잉여물품·부설연구소 물품 수입신고 기한", correct: [{item:"잉여물품 수입신고(반출신고서 제출일부터)", value:"10일 이내"}, {item:"부설 연구소 물품 수입·반송신고(반입일부터)", value:"30일 이내"}], distractors: [{item:"잉여물품 수입신고", wrongValue:"30일 이내"}], basis: "보세공장 운영에 관한 고시", type: "틀린것고르기" },

    // ── 2024 ──
    { year: 2024, no: 11, concept: "활어장치장 CCTV 녹화영상 보관기간", correct: [{item:"CCTV 녹화영상 보관기간", value:"30일 이상"}], distractors: [{item:"보관기간", wrongValue:"15일 이상"}, {item:"보세구역외 장치장 거리", wrongValue:"세관으로부터 최대 40km 범위"}], basis: "수입활어 관리에 관한 특례고시", type: "옳은것고르기" },
    { year: 2024, no: 13, concept: "특허보세구역 물품반입 정지기간·과징금·취소 요건", correct: [{item:"원자재소요량 관리 부적정 반입정지", value:"6개월의 범위"}], distractors: [{item:"반입정지 요건 기간", wrongValue:"최근 2년 이내"}, {item:"과징금 산정비율", wrongValue:"매출액의 6천분의 1 이하"}, {item:"과징금 감경 비율", wrongValue:"100분의 3의 범위"}, {item:"특허취소 반입정지 횟수", wrongValue:"1년 이내 3회 이상"}], basis: "관세법 — 물품반입 정지·특허취소", type: "옳은것고르기" },
    { year: 2024, no: 14, concept: "특허 갱신신청 기한 + 특허기간", correct: [{item:"갱신신청 기한", value:"특허기간 만료 30일 전까지"}, {item:"특허기간", value:"보세판매장 5년·그 밖의 특허보세구역 10년 이내"}], distractors: [{item:"갱신신청 기한", wrongValue:"만료 3개월 전까지"}, {item:"특허기간", wrongValue:"보세창고·보세판매장 모두 5년 이내"}], basis: "특허보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2024, no: 16, concept: "특허 효력상실 후 의제기간 + 승계신고 통보", correct: [{item:"효력상실 후 의제기간", value:"6개월 범위(세관장 지정)"}, {item:"승계신고 결과 통보기한", value:"신고일부터 5일 이내"}], distractors: [{item:"양수인 승계신고 기한", wrongValue:"양수일부터 30일 이내"}], basis: "관세법 — 특허 효력상실·승계", type: "틀린것고르기" },
    { year: 2024, no: 18, concept: "운영인 장부·서류 보관기간·초과장치 한도(오답 수치)", correct: [], distractors: [{item:"장치화물 장부·서류 보관기간", wrongValue:"5년"}, {item:"수용능력 임의 초과 장치 한도", wrongValue:"100분의 10의 범위"}], basis: "특허보세구역 운영에 관한 고시 (정답 수치 원문 미명시)", type: "옳은것고르기" },
    { year: 2024, no: 23, concept: "보세공장 혼용물품 관세 계산(외국원자재 비율 과세)", correct: [{item:"부과 관세(정답)", value:"600,000원 (제품 1,000만×관세율 10%×외국원자재 300만/총원자재 500만)"}], distractors: [{item:"부과 관세", wrongValue:"1,000,000원"}, {item:"부과 관세", wrongValue:"800,000원"}, {item:"부과 관세", wrongValue:"400,000원"}, {item:"부과 관세", wrongValue:"300,000원"}], basis: "관세법 — 보세공장 혼용물품 과세", type: "기타" },
    { year: 2024, no: 24, concept: "보세공장 외 작업 허가기간(1단위 장기소요)", correct: [{item:"외 작업 허가기간", value:"2년의 범위"}, {item:"허가여부 통지기한", value:"신청받은 날부터 10일 이내"}, {item:"작업완료 결과 통보기한", value:"허가기간 종료일부터 5일 이내"}], distractors: [{item:"외 작업 허가기간", wrongValue:"5년의 범위"}], basis: "관세법 — 보세공장 외 작업 허가", type: "틀린것고르기" },

    // ── 2025 ──
    { year: 2025, no: 1, concept: "화물관리인 지정 유효기간 + 지정장치장 장치·연장기간", correct: [{item:"화물관리인 지정 유효기간", value:"5년 이내"}, {item:"지정장치장 장치기간(원칙)", value:"6개월"}, {item:"세관장 연장 범위", value:"6개월"}], distractors: [{item:"화물관리인 지정 유효기간", wrongValue:"3년 이하"}], basis: "관세법 제170조·제172조", type: "옳은것고르기" },
    { year: 2025, no: 4, concept: "입국장·출국장 보세판매장 판매한도 + 별도 면세품목", correct: [{item:"입국장 보세판매장 판매한도", value:"미화 800달러"}, {item:"술", value:"2리터(ℓ)·미화 400달러 이하"}, {item:"담배 궐련", value:"200개비"}, {item:"향수", value:"100밀리리터(㎖)"}], distractors: [{item:"출국장 내국인 판매한도", wrongValue:"미화 5천달러"}, {item:"입국장 판매한도", wrongValue:"미화 600달러"}, {item:"입국장 인도장 판매한도", wrongValue:"미화 600달러"}, {item:"입국장 보세판매장·인도장 각각", wrongValue:"각각 미화 800달러"}], basis: "관세법 제196조의2·보세판매장 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 15, concept: "보세사 결원 시 재채용 기간 + 직원 채용·면직 보고", correct: [{item:"보세사 결원 시 다른 보세사 채용", value:"2개월 이내"}, {item:"직원 채용·면직 보고", value:"지체 없이"}], distractors: [{item:"보세사 채용기간", wrongValue:"3개월 이내"}, {item:"채용·면직 보고", wrongValue:"1개월 이내"}], basis: "특허보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 18, concept: "특허보세구역 운영인 과징금 산정기준", correct: [{item:"1일당 과징금(연간 매출액 대비)", value:"6천분의 1"}, {item:"가중·감경 범위", value:"4분의 1"}, {item:"가중 시 총액 상한(연간 매출액 대비)", value:"100분의 3"}], distractors: [{item:"1일당 과징금", wrongValue:"3천분의 1"}, {item:"가중·감경 범위", wrongValue:"2분의 1"}, {item:"총액 상한", wrongValue:"100분의 1"}], basis: "관세법 제178조·시행령", type: "빈칸채우기" },
    { year: 2025, no: 22, concept: "운영인 결격 — 징역형 실형 집행종료·면제 후 경과기간", correct: [{item:"결격 경과기간", value:"2년"}], distractors: [{item:"경과기간", wrongValue:"1년"}, {item:"보세창고 특허 자본금/토지·건물 기준", wrongValue:"2억원 이상"}, {item:"법규수행능력평가 점수", wrongValue:"80점 이상"}], basis: "관세법 제175조", type: "옳은것고르기" }
  ]
};
