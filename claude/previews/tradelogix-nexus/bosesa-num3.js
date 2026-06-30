// 보세사 3과목(화물관리·보세운송) — '숫자' 집중 정리 데이터
// 박사 지시(2026-06-30): 4·1·2과목에 이어 3과목 숫자 선지·정답·오답을 한 카테고리로 모음.
// 출처: 3과목 2019~2025 7개년 기출(BOSESA_DATA_3_*)에서 숫자 변별 문항 전수 추출.
// ⚠️ 학습 보조용. 법령·고시 개정분 있으니 시험 직전 최신 원문 확인 필수.
//   특히 컨테이너 하선장소 반입기한(3일→5일 개정)·내국물품 장치신고 기준기간은 연도별 상이 주의.
window.BOSESA_NUM3 = {
  subject: 3,
  subjectName: "화물관리·보세운송",
  updated: "2026-06-30",

  concepts: [
    {
      topic: "적하목록(적재화물목록) 제출시기",
      icon: "fa-file-import",
      items: [
        { label: "항공 입항화물 적하목록 제출(일반)", correct: "입항 4시간 전까지", variants: ["24시간 전", "1시간 전"], note: "근거리는 적재항 출항 전까지.", basis: "보세화물 입출항 고시", years: [2022] },
        { label: "항공 입항 특송화물 적하목록 제출", correct: "입항 1시간 전까지", variants: ["입항 2시간 전", "24시간 전"], basis: "보세화물 입출항 고시", years: [2022, 2023] },
        { label: "해상 출항화물 적재화물목록 제출(원칙)", correct: "적재 24시간 전까지", variants: ["12시간 전"], basis: "보세화물 입출항 고시", years: [2024, 2020] },
        { label: "선상 수출신고물품 물품목록 제출", correct: "출항 다음날(익일) 자정(24시)까지", variants: ["출항 익일 12시까지", "출항 12시간 이내", "출항 24시간 이내"], note: "근거리 지역은 선박 출항 30분 전까지 최종 마감.", basis: "수출통관 사무처리에 관한 고시 제32조", years: [2020, 2024] }
      ]
    },
    {
      topic: "적하목록 정정신청 생략 — 과부족 허용범위",
      icon: "fa-scale-unbalanced",
      items: [
        { label: "포장단위 물품 수량(중량) 과부족", correct: "10% 이내", variants: ["5% 이내", "15% 이내"], note: "포장단위만 10%. 나머지는 5%.", basis: "보세화물 입출항 고시", years: [2020, 2021, 2023, 2024, 2025] },
        { label: "산물(광물·원유·곡물)·용적물품(원목)·포장파손 용이·건습 중량변동 물품", correct: "5% 이내", variants: ["10% 이내"], basis: "보세화물 입출항 고시", years: [2020, 2023, 2025] }
      ]
    },
    {
      topic: "적하목록 정정신청 기한",
      icon: "fa-pen-to-square",
      items: [
        { label: "하선(기)·반입결과 이상보고서 제출물품", correct: "보고서 제출일부터 15일 이내", variants: ["7일", "10일", "30일"], basis: "보세화물 입출항 고시", years: [2020, 2023, 2024] },
        { label: "수입화물 적하목록 정정", correct: "선박(항공기) 입항일부터 60일 이내", variants: ["30일"], basis: "보세화물 입출항 고시", years: [2020] },
        { label: "수출화물 적하목록 정정 — 해상", correct: "출항일부터 90일 이내", variants: ["60일", "120일"], basis: "보세화물 입출항 고시", years: [2020, 2021, 2023, 2025] },
        { label: "수출화물 적하목록 정정 — 항공", correct: "출항일부터 60일 이내", variants: ["90일", "30일"], basis: "보세화물 입출항 고시", years: [2020, 2021, 2023, 2025] }
      ]
    },
    {
      topic: "하선장소 물품 반입기한",
      icon: "fa-truck-ramp-box",
      items: [
        { label: "해상 컨테이너화물 하선장소 반입기한", correct: "입항일부터 5일 이내", variants: ["3일(개정 전)", "7일", "10일"], note: "⚠️ 고시 개정으로 3일 → 5일. 2022·2023 기출은 3일, 2024·2025 기출은 5일.", basis: "보세화물 입출항 고시", years: [2022, 2023, 2024, 2025] },
        { label: "해상 산물(원목·곡물·원유 등) 반입기한", correct: "입항일부터 10일 이내", variants: ["15일", "5일", "30일"], basis: "보세화물 입출항 고시", years: [2020, 2024, 2025, 2023] },
        { label: "항공화물 하기장소 반입기한", correct: "입항 다음날까지", variants: ["입항 후 12시간 이내", "24시간 이내", "48시간 이내"], basis: "보세화물 입출항 고시", years: [2022, 2024, 2025] }
      ]
    },
    {
      topic: "하기결과보고 · 항공 이상물품 특례",
      icon: "fa-plane-arrival",
      items: [
        { label: "항공 하기결과보고서 제출기한", correct: "입항 다음 날", variants: ["입항 후 12시간 이내", "24시간 이내"], basis: "보세화물 입출항 고시", years: [2025] },
        { label: "항공 이상물품 이상사유 규명·정정 기간", correct: "하기결과보고일부터 15일 이내", variants: ["10일", "30일"], basis: "보세화물 입출항 고시", years: [2024] },
        { label: "AWB 분할기적 미도착 화물 도착기간", correct: "입항일부터 15일 이내", variants: ["10일", "30일"], basis: "보세화물 입출항 고시", years: [2024] }
      ]
    },
    {
      topic: "보세구역 장치기간",
      icon: "fa-warehouse",
      items: [
        { label: "지정장치장 반입물품 장치기간", correct: "6개월 (세관장 3개월 범위 연장)", variants: ["1년", "6개월 연장"], basis: "관세법 제170조·체화관리 고시", years: [2019, 2023, 2025] },
        { label: "부산항·인천항·인천공항·김해공항 항역내 지정장치장", correct: "2개월(60일) (2개월 범위 연장)", variants: ["6개월"], basis: "체화관리 고시", years: [2019, 2025] },
        { label: "여행자·승무원 휴대품 중 유치물품·습득물", correct: "1개월", variants: [], basis: "체화관리 고시", years: [2019] },
        { label: "보세창고 반입 일반물품", correct: "6개월 (6개월 범위 연장)", variants: ["1년"], basis: "체화관리 고시", years: [2019, 2021] },
        { label: "보세판매장·보세건설장 반입물품", correct: "해당 보세구역의 특허기간", variants: ["6개월", "1년"], basis: "체화관리 고시", years: [2021, 2025] }
      ]
    },
    {
      topic: "보세구역외 장치",
      icon: "fa-dolly",
      items: [
        { label: "보세구역외 장치 허가기간", correct: "6개월 범위 내(세관장이 정함)", variants: ["1년", "3년"], basis: "보세화물관리에 관한 고시", years: [2020, 2024] },
        { label: "보세구역외 장치 담보기간", correct: "허가기간 + 1개월", variants: ["+2개월", "+3개월"], basis: "보세화물관리에 관한 고시", years: [2024] }
      ]
    },
    {
      topic: "보세창고 내국물품 장치",
      icon: "fa-boxes-packing",
      items: [
        { label: "내국물품만 계속 장치 시 장치신고 기준기간", correct: "⚠️ 연도별 상이: 1개월 이상(2023) / 3개월 이상(2024)", variants: ["5개월", "6개월"], note: "보세창고에 내국물품만 계속 장치하려는 자의 신고 의무 기준. 기출마다 표기 상이 — 최신 고시 확인.", basis: "관세법 제183조·보세화물관리 고시", years: [2023, 2024] },
        { label: "수입신고수리된 내국물품 계속 장치 가능기간", correct: "1년", variants: ["3개월"], basis: "관세법 제183조", years: [2025, 2021] }
      ]
    },
    {
      topic: "수입신고수리물품 반출 · 신고지연 가산세",
      icon: "fa-clock",
      items: [
        { label: "보세구역 반입물품 수입신고수리 후 반출기한", correct: "수리일부터 15일 이내", variants: ["30일"], note: "위반 시 과태료 100만원 이하.", basis: "관세법 제157조의2·제277조", years: [2022, 2024] },
        { label: "수입·반송 신고지연 가산세율·상한", correct: "과세가격의 1천분의 5~1천분의 20 / 상한 500만원", variants: ["최대 1천분의 15", "상한 1,000만원"], note: "보세구역 반입일부터 30일 내 미신고 시.", basis: "관세법 제241조", years: [2019, 2023] }
      ]
    },
    {
      topic: "화물운송주선업자 등록",
      icon: "fa-people-carry-box",
      items: [
        { label: "등록 유효기간", correct: "3년", variants: ["1년", "2년", "4년", "5년"], basis: "관세법", years: [2020] },
        { label: "법인 자본금 요건", correct: "3억원 이상", variants: ["2억원", "5억원"], note: "법인이 아닌 경우 자산평가액 6억원 이상.", basis: "관세법 — 화물운송주선업자 등록요건", years: [2020, 2023, 2025] },
        { label: "변동신고 기한", correct: "60일 이내", variants: ["20일", "30일"], basis: "화물운송주선업자 고시", years: [2025] },
        { label: "등록취소 후 재등록 제한 경과기간", correct: "2년", variants: ["1년"], basis: "관세법", years: [2020] }
      ]
    },
    {
      topic: "보세운송업자 등록 · 갱신",
      icon: "fa-id-card",
      items: [
        { label: "보세운송업자 등록 유효기간", correct: "3년", variants: ["5년"], basis: "보세운송에 관한 고시", years: [2024] },
        { label: "갱신신청 기한", correct: "유효기간 만료 1개월(30일) 전까지", variants: ["만료 15일 전"], basis: "보세운송에 관한 고시", years: [2024] },
        { label: "한국관세물류협회장 갱신 안내문 발송", correct: "유효기간 만료 2개월 전까지", variants: [], basis: "보세운송에 관한 고시", years: [2024] },
        { label: "갱신신청서 처리기간", correct: "10일 이내", variants: ["15일"], basis: "보세운송에 관한 고시", years: [2024] },
        { label: "등록취소 후 결격기간", correct: "2년", variants: ["3년"], note: "등록 관련 서류 보관기간도 2년.", basis: "보세운송에 관한 고시", years: [2019, 2024] }
      ]
    },
    {
      topic: "간이보세운송업자 지정요건",
      icon: "fa-truck-moving",
      items: [
        { label: "일반간이보세운송업자 — 담보·자본금·지정·갱신", correct: "담보(부동산 제외) 5천만원 이상 / 자본금 1억원 이상 / 지정 3년 / 갱신 만료 15일 전까지", variants: ["담보 5천만원과 자본금 혼동", "지정 2년", "갱신 10일 전"], basis: "보세운송에 관한 고시", years: [2020] },
        { label: "특정물품간이보세운송업자 — 자본금·보증보험·차량·관세사", correct: "법인 자본금 3억원 이상 / 보증보험 2억원 이상 / 유개화물차·트랙터 각 10대 이상 / 임원 중 관세사 1명 이상", variants: ["자본금 1억원", "자본금 2억·5억", "보증보험 1억·3억", "차량 5대·20대", "관세사 2명"], basis: "보세운송에 관한 고시", years: [2025, 2021] }
      ]
    },
    {
      topic: "보세운송 기간 · 승인대상",
      icon: "fa-route",
      items: [
        { label: "항공화물 보세운송기간", correct: "신고수리(승인)일부터 5일", variants: ["15일", "10일"], note: "해상화물은 10일.", basis: "보세운송에 관한 고시", years: [2023, 2021] },
        { label: "보세운송 승인 필요 — 최초 보세구역 반입일부터 경과", correct: "30일 경과 시 승인 대상", variants: ["20일"], basis: "보세운송에 관한 고시", years: [2023] },
        { label: "보세운송 승인신청 관련자료 보관기간", correct: "2년", variants: ["3년"], basis: "보세운송에 관한 고시", years: [2024] }
      ]
    },
    {
      topic: "공매 · 수의계약 · 매각",
      icon: "fa-gavel",
      items: [
        { label: "수의계약 가능 — 1회 공매 매각예정가격", correct: "50만원 미만", variants: ["100만원 미만"], note: "경쟁입찰 2회 이상 유찰 등 요건과 함께 출제.", basis: "체화관리 고시", years: [2019, 2020] },
        { label: "재입찰 예정가격 체감 한도", correct: "최초 예정가격의 100분의 10 이내", variants: ["100분의 20 이내"], note: "입찰 때마다 체감.", basis: "체화관리 고시", years: [2024] }
      ]
    }
  ],

  questions: [
    // ── 2019 ──
    { year: 2019, no: 4, concept: "수의계약 가능 1회 공매 매각예정가격 기준", correct: [{item:"수의계약 가능 매각예정가격", value:"50만원 미만"}], distractors: [{item:"매각예정가격", wrongValue:"100만원 미만"}], basis: "체화관리 고시", type: "옳은것고르기" },
    { year: 2019, no: 15, concept: "보세구역별 장치기간", correct: [{item:"지정장치장", value:"6개월"}, {item:"항역내 지정장치장(부산·인천 등)", value:"2개월(2개월 연장)"}, {item:"유치물품·습득물", value:"1개월"}, {item:"보세창고 일반물품", value:"6개월(6개월 연장)"}], distractors: [{item:"정부비축물품(정상=비축필요기간)", wrongValue:"6개월(6개월 연장)"}], basis: "체화관리 고시", type: "틀린것고르기" },
    { year: 2019, no: 19, concept: "보세운송업자 등록서류 보관기간 + 간이보세운송 지정취소 처분횟수", correct: [{item:"등록서류 보관기간", value:"2년"}, {item:"간이보세운송 지정취소 업무정지 횟수", value:"2회"}], distractors: [{item:"보관기간", wrongValue:"3년"}], basis: "보세운송에 관한 고시", type: "틀린것고르기" },
    { year: 2019, no: 23, concept: "보세구역 반입일부터 30일 내 미신고 시 신고지연 가산세", correct: [{item:"수입·반송 신고기한(반입일부터)", value:"30일 이내"}, {item:"가산세율 범위", value:"과세가격의 1천분의 5~20"}, {item:"최대 가산세율", value:"1천분의 20"}, {item:"가산세액 상한", value:"500만원"}], distractors: [{item:"최대 가산세율", wrongValue:"1천분의 15"}], basis: "관세법 제241조", type: "옳은것고르기" },

    // ── 2020 ──
    { year: 2020, no: 2, concept: "적하목록 정정신청 생략 과부족 한도", correct: [{item:"산물·용적·포장파손·중량변동 물품", value:"5% 이내"}], distractors: [{item:"포장단위 물품 수량(실제 10%)", wrongValue:"5% 이내로 단정"}], basis: "보세화물 입출항 고시", type: "틀린것고르기" },
    { year: 2020, no: 4, concept: "개항 외 지역 출입허가 통지기간", correct: [{item:"통지기간", value:"7일 이내"}], distractors: [{item:"통지기간", wrongValue:"14일 이내"}], basis: "관세법", type: "틀린것고르기" },
    { year: 2020, no: 6, concept: "매각물품 수의계약 요건(유찰 횟수·예정가격)", correct: [{item:"경쟁입찰 유찰 횟수", value:"2회 이상"}, {item:"1회 공매 예정가격", value:"50만원 미만"}], distractors: [{item:"유찰 횟수", wrongValue:"1회 이상"}, {item:"예정가격", wrongValue:"100만원 미만"}, {item:"부패우려 물품 매각 미이행", wrongValue:"5일 이내"}], basis: "체화관리 고시", type: "옳은것고르기" },
    { year: 2020, no: 9, concept: "산물 하선장소 반입기한", correct: [{item:"산물 하선장소 반입기한", value:"입항일부터 10일 이내"}], distractors: [{item:"반입기한", wrongValue:"입항일부터 15일 이내"}], basis: "보세화물 입출항 고시", type: "틀린것고르기" },
    { year: 2020, no: 13, concept: "화물운송주선업자 등록 유효기간", correct: [{item:"등록 유효기간", value:"3년"}], distractors: [{item:"유효기간", wrongValue:"1년"}, {item:"유효기간", wrongValue:"2년"}, {item:"유효기간", wrongValue:"4년"}, {item:"유효기간", wrongValue:"5년"}], basis: "관세법", type: "옳은것고르기" },
    { year: 2020, no: 18, concept: "적하목록 정정신청 기간(이상보고서/수입/수출)", correct: [{item:"이상보고서 제출물품", value:"제출일부터 15일 이내"}, {item:"수입화물", value:"입항일부터 60일 이내"}, {item:"수출 해상", value:"출항일부터 90일 이내"}, {item:"수출 항공", value:"출항일부터 60일 이내"}], distractors: [{item:"이상보고서", wrongValue:"7일"}, {item:"이상보고서", wrongValue:"10일"}, {item:"수입화물", wrongValue:"30일"}, {item:"수출 해상", wrongValue:"60일"}, {item:"수출 항공", wrongValue:"90일"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2020, no: 19, concept: "보세구역외 장치 허가기간", correct: [{item:"허가기간", value:"6개월 범위 내"}], distractors: [{item:"허가기간", wrongValue:"1년 범위 내"}], basis: "보세화물관리에 관한 고시", type: "틀린것고르기" },
    { year: 2020, no: 21, concept: "수출 적재신고 물품목록 제출시기", correct: [{item:"선상 수출신고물품", value:"출항 익일 24시까지"}, {item:"해상화물", value:"적재 24시간 전까지"}, {item:"근거리 최종 마감", value:"선박 출항 30분 전까지"}], distractors: [{item:"선상 수출신고물품", wrongValue:"출항 익일 12시까지"}], basis: "보세화물 입출항 고시", type: "틀린것고르기" },
    { year: 2020, no: 22, concept: "일반간이보세운송업자 지정요건", correct: [{item:"담보(부동산 제외)", value:"5천만원 이상"}, {item:"자본금", value:"1억원 이상"}, {item:"지정기간", value:"3년"}, {item:"갱신신청 기한", value:"만료 15일 전까지"}], distractors: [{item:"자본금", wrongValue:"5천만원 이상"}, {item:"담보", wrongValue:"5천만원 이상으로 혼동"}, {item:"지정기간", wrongValue:"2년"}, {item:"갱신신청", wrongValue:"만료 10일 전까지"}], basis: "보세운송에 관한 고시", type: "옳은것고르기" },
    { year: 2020, no: 24, concept: "화물운송주선업자 등록요건(취소 후 경과·자본금)", correct: [{item:"등록취소 후 재등록 제한", value:"2년"}, {item:"법인 자본금", value:"3억원 이상"}, {item:"자산평가액(법인 아닌 경우)", value:"6억원 이상"}], distractors: [{item:"재등록 제한", wrongValue:"1년"}], basis: "관세법", type: "틀린것고르기" },

    // ── 2021 ──
    { year: 2021, no: 5, concept: "보세구역별 장치기간(보세판매장=특허기간)", correct: [{item:"보세판매장 반입화물 장치기간", value:"보세판매장 특허기간"}], distractors: [{item:"보세창고 반입물품", wrongValue:"1년(6개월 연장)"}, {item:"여행자 예치물품", wrongValue:"1개월"}, {item:"보세구역외 장치허가 물품", wrongValue:"30일"}], basis: "체화관리 고시", type: "옳은것고르기" },
    { year: 2021, no: 14, concept: "적하목록 정정신청 생략 과부족 기준(포장단위 10%)", correct: [{item:"포장단위 물품 중량 과부족", value:"10% 이내"}], distractors: [{item:"산물 중량 과부족", wrongValue:"10% 이내"}, {item:"용적물품 용적 과부족", wrongValue:"10% 이내"}, {item:"포장파손 용이 물품", wrongValue:"10% 이내"}, {item:"건습 중량변동 물품", wrongValue:"10% 이내"}], basis: "보세화물 입출항 고시", type: "옳은것고르기" },
    { year: 2021, no: 17, concept: "출항 정정신청 기간 + 보세운송 도착기한 조합", correct: [{item:"출항 정정 해상", value:"90일"}, {item:"출항 정정 항공", value:"60일"}, {item:"보세운송 도착 해상", value:"10일"}, {item:"보세운송 도착 항공", value:"5일"}, {item:"입항전 신고 추가 가능", value:"5일"}], distractors: [{item:"조합①", wrongValue:"120/100/15/10/10"}, {item:"조합②", wrongValue:"120/80/15/10/5"}, {item:"조합③", wrongValue:"90/70/10/7/5"}, {item:"조합⑤", wrongValue:"60/30/5/5/5"}], basis: "보세화물·보세운송 고시", type: "빈칸채우기" },
    { year: 2021, no: 18, concept: "일괄운송 환적화물 운송기한", correct: [], distractors: [{item:"일괄운송 환적화물 운송기한(틀린 선지)", wrongValue:"하선신고일부터 10일 이내"}], basis: "환적화물 처리절차 고시", type: "틀린것고르기" },
    { year: 2021, no: 21, concept: "특정물품간이보세운송업자 자본금·지정기간", correct: [{item:"지정기간", value:"3년(보세운송업자 등록기간 범위)"}], distractors: [{item:"자본금 요건(틀린 선지)", wrongValue:"1억원 이상 법인"}], basis: "보세운송에 관한 고시", type: "틀린것고르기" },
    { year: 2021, no: 24, concept: "보세창고 내국물품 장치기간·계속장치 허가", correct: [{item:"내국물품 반입 장치기간", value:"1년"}, {item:"수입신고수리 내국물품 장치(연장)", value:"6개월(1년 범위 연장)"}, {item:"장치기간 경과 후 반출", value:"10일 내"}], distractors: [{item:"계속장치 허가 기준(틀린 선지)", wrongValue:"6개월(수입신고수리는 2개월) 이상"}], basis: "관세법 제183조", type: "틀린것고르기" },

    // ── 2022 ──
    { year: 2022, no: 1, concept: "항공입항화물 적하목록 제출시기(일반/특송)", correct: [{item:"일반 항공입항화물", value:"입항 4시간 전"}, {item:"특송화물", value:"입항 1시간 전"}], distractors: [{item:"일반", wrongValue:"24시간 전"}, {item:"일반", wrongValue:"1시간 전"}, {item:"특송화물", wrongValue:"24시간 전"}, {item:"근거리 출항", wrongValue:"출항 1시간 전"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2022, no: 2, concept: "항공 하기장소 보세구역 운영인 물품 반입기한", correct: [], distractors: [{item:"하기장소 반입기한(틀린 선지)", wrongValue:"입항 후 12시간 이내"}], basis: "보세화물 입출항 고시 (정답=입항 다음날까지)", type: "틀린것고르기" },
    { year: 2022, no: 3, concept: "해상입항화물 적하목록 정정 기한·허용비율(오답 수치)", correct: [], distractors: [{item:"이상보고서 제출 후 정정 기한", wrongValue:"10일 이내"}, {item:"포장파손 용이 물품 정정생략", wrongValue:"10% 이내"}], basis: "보세화물 입출항 고시 (정답=15일·5%)", type: "옳은것고르기" },
    { year: 2022, no: 4, concept: "해상입항 하선장소 반입기한(컨테이너/산물)", correct: [{item:"컨테이너화물 반입기한(출제 당시)", value:"3일"}, {item:"산물 반입기한", value:"10일"}], distractors: [{item:"컨테이너 반입기한", wrongValue:"5일(현행)"}, {item:"산물", wrongValue:"30일"}, {item:"산물", wrongValue:"5일"}], basis: "보세화물 입출항 고시 (컨테이너 3일→현행 5일 개정)", type: "빈칸채우기" },
    { year: 2022, no: 20, concept: "보세구역 반입물품 반출기한 + 위반 과태료", correct: [{item:"수입신고수리일부터 반출기한", value:"15일"}, {item:"위반 과태료", value:"100만원 이하"}], distractors: [{item:"반출기한", wrongValue:"30일"}], basis: "관세법 제157조의2·제277조", type: "빈칸채우기" },
    { year: 2022, no: 22, concept: "보세화물 장치기간 합산", correct: [{item:"각 장치기간 합산", value:"12개월"}], distractors: [{item:"합산", wrongValue:"10개월"}, {item:"합산", wrongValue:"11개월"}, {item:"합산", wrongValue:"13개월"}, {item:"합산", wrongValue:"14개월"}], basis: "체화관리 고시", type: "빈칸채우기" },
    { year: 2022, no: 25, concept: "반출통고 기한(지정장치장·보세창고/유치·예치) 오답 수치", correct: [], distractors: [{item:"지정장치장·보세창고 반출통고", wrongValue:"장치기간 만료 10일 전"}, {item:"유치·예치물품 반출통고", wrongValue:"장치기간 만료 30일 전"}], basis: "체화관리 고시", type: "옳은것고르기" },

    // ── 2023 ──
    { year: 2023, no: 1, concept: "항공입항 특송화물 적하목록 제출시기(오답 수치)", correct: [], distractors: [{item:"특송화물 제출시기(틀린 선지)", wrongValue:"입항 2시간 전까지"}], basis: "보세화물 입출항 고시 (정답=1시간 전)", type: "틀린것고르기" },
    { year: 2023, no: 2, concept: "정정신청 생략 과부족 허용범위", correct: [{item:"산물 중량", value:"5%"}, {item:"용적물품 용적", value:"5%"}, {item:"포장파손 용이 물품 중량", value:"5%"}, {item:"포장단위 물품 중량", value:"10%"}], distractors: [{item:"포장단위", wrongValue:"5%"}, {item:"산물", wrongValue:"10%"}, {item:"용적물품", wrongValue:"10%"}, {item:"포장파손", wrongValue:"10%"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2023, no: 3, concept: "적하목록 정정신청 기한(이상보고서/해상/항공)", correct: [{item:"이상보고서 제출일 기준", value:"15일"}, {item:"해상 출항", value:"90일"}, {item:"항공 출항", value:"60일"}], distractors: [{item:"이상보고서", wrongValue:"30일"}, {item:"해상 출항", wrongValue:"60일"}, {item:"항공 출항", wrongValue:"30일"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2023, no: 5, concept: "하선장소 반입기한(산물/컨테이너)", correct: [{item:"산물", value:"10일"}, {item:"컨테이너(2023 출제 당시)", value:"3일"}], distractors: [{item:"산물", wrongValue:"15일"}, {item:"컨테이너", wrongValue:"5일"}, {item:"공컨테이너 미반입 보고", wrongValue:"15일"}], basis: "보세화물 입출항 고시", type: "옳은것고르기" },
    { year: 2023, no: 10, concept: "화물운송주선업자 법인 자본금", correct: [{item:"법인 자본금", value:"3억원 이상"}], distractors: [{item:"자본금", wrongValue:"2억원 이상"}], basis: "관세법", type: "틀린것고르기" },
    { year: 2023, no: 14, concept: "보세창고 내국물품만 계속 장치 신고 기준기간", correct: [{item:"내국물품만 계속 장치 신고", value:"1개월 이상"}], distractors: [{item:"기준기간", wrongValue:"5개월 이상"}, {item:"수입신고수리 물품 신고없이 장치", wrongValue:"2년"}], basis: "관세법 제183조", type: "옳은것고르기" },
    { year: 2023, no: 15, concept: "보세구역 외 장치 허가수수료(오답 수치)", correct: [], distractors: [{item:"허가수수료", wrongValue:"18만원"}], basis: "보세화물관리 고시", type: "옳은것고르기" },
    { year: 2023, no: 16, concept: "수입·반송 신고지연 가산세(오답 수치)", correct: [], distractors: [{item:"부과 경과기준", wrongValue:"반입일부터 20일 경과"}, {item:"가산세 한도", wrongValue:"1,000만원"}], basis: "관세법 제241조 (정답=30일·500만원)", type: "옳은것고르기" },
    { year: 2023, no: 18, concept: "보수작업 승인여부 통지기간(오답 수치)", correct: [], distractors: [{item:"승인여부 통지기간", wrongValue:"20일 이내"}], basis: "보세화물관리 고시", type: "옳은것고르기" },
    { year: 2023, no: 19, concept: "보세구역별 장치기간·연장(오답 수치)", correct: [], distractors: [{item:"인천공항 지정장치장", wrongValue:"6개월/6개월 연장"}, {item:"정부비축물품", wrongValue:"1년/1년 연장"}, {item:"예치물품 가산", wrongValue:"2개월"}, {item:"보세전시장 가산", wrongValue:"1개월"}], basis: "체화관리 고시", type: "옳은것고르기" },
    { year: 2023, no: 20, concept: "보세화물 반출통고 시기(오답 수치)", correct: [], distractors: [{item:"매각 통고기간", wrongValue:"통고일부터 2개월 내"}, {item:"2개월 미만 물품 반출통고", wrongValue:"장치기간 만료 10일 전"}, {item:"보세건설장 반출통고", wrongValue:"특허기간 만료 30일 전"}], basis: "체화관리 고시", type: "옳은것고르기" },
    { year: 2023, no: 21, concept: "장치물품 폐기 관련 기간(오답 수치)", correct: [], distractors: [{item:"품명미상 폐기·반송 경과", wrongValue:"1년 경과"}, {item:"폐기·반송 기간설정", wrongValue:"2개월"}, {item:"대집행 비용 납기", wrongValue:"10일"}], basis: "관세법·체화관리 고시", type: "옳은것고르기" },
    { year: 2023, no: 22, concept: "최초 보세구역 반입일부터 보세운송 승인 필요 경과기간", correct: [{item:"보세운송 승인 필요 경과", value:"30일"}], distractors: [{item:"경과기간", wrongValue:"20일"}], basis: "보세운송에 관한 고시", type: "빈칸채우기" },
    { year: 2023, no: 25, concept: "항공화물 보세운송기간", correct: [{item:"항공화물 보세운송기간(신고수리일부터)", value:"5일"}], distractors: [{item:"도착기한", wrongValue:"15일"}], basis: "보세운송에 관한 고시", type: "틀린것고르기" },

    // ── 2024 ──
    { year: 2024, no: 1, concept: "항공 이상물품 규명기간·AWB 미도착 도착기간", correct: [{item:"이상사유 규명·정정", value:"15일"}, {item:"AWB 분할기적 미도착 화물 도착", value:"15일"}], distractors: [{item:"규명 기간", wrongValue:"10일"}, {item:"규명 기간", wrongValue:"30일"}, {item:"미도착 도착", wrongValue:"10일"}, {item:"미도착 도착", wrongValue:"30일"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2024, no: 2, concept: "하선(하기)장소 반입기간(컨테이너/항공)", correct: [{item:"해상 컨테이너화물", value:"입항일부터 5일 이내"}, {item:"항공화물", value:"입항 다음날까지"}, {item:"해상 벌크화물", value:"입항일부터 10일 이내"}], distractors: [{item:"컨테이너", wrongValue:"3일 이내"}, {item:"컨테이너", wrongValue:"7일 이내"}, {item:"항공", wrongValue:"24시간 이내"}, {item:"항공", wrongValue:"48시간 이내"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2024, no: 3, concept: "해상출항 적재화물목록 제출시기", correct: [{item:"원칙", value:"적재 24시간 전"}, {item:"선상수출신고물품(고시 제32조)", value:"출항 다음날 자정까지"}, {item:"근거리", value:"출항 30분 전 마감"}], distractors: [{item:"원칙", wrongValue:"12시간 전"}, {item:"선상수출신고물품", wrongValue:"출항 12시간 이내"}, {item:"선상수출신고물품", wrongValue:"출항 24시간 이내"}], basis: "보세화물 입출항·수출통관 고시", type: "빈칸채우기" },
    { year: 2024, no: 4, concept: "적재화물목록 정정 기한·중량 과부족 생략", correct: [{item:"하선결과보고서 제출물품 정정", value:"제출일부터 15일 이내"}, {item:"포장파손 용이 물품 중량 과부족 생략", value:"5% 이내"}], distractors: [{item:"포장단위 물품 중량 과부족", wrongValue:"15% 이내"}, {item:"그 밖의 사유 정정 기한", wrongValue:"60일"}], basis: "보세화물 입출항 고시 (※원문 90일/60일 상충 표기)", type: "옳은것고르기" },
    { year: 2024, no: 10, concept: "보세운송업자 등록·갱신·결격", correct: [{item:"협회장 갱신 안내문 발송", value:"만료 2개월 전까지"}, {item:"등록 유효기간", value:"3년"}, {item:"갱신신청 기한", value:"만료 1개월(30일) 전까지"}, {item:"갱신신청서 처리기간", value:"10일 이내"}, {item:"등록취소 후 결격기간", value:"2년"}], distractors: [{item:"유효기간", wrongValue:"5년"}, {item:"갱신신청", wrongValue:"만료 15일 전"}, {item:"처리기간", wrongValue:"15일 이내"}, {item:"결격기간", wrongValue:"3년"}], basis: "보세운송에 관한 고시", type: "옳은것고르기" },
    { year: 2024, no: 12, concept: "보세운송 승인신청 관련자료 보관기간", correct: [{item:"관련자료 보관기간", value:"2년"}], distractors: [{item:"보관기간", wrongValue:"3년"}], basis: "보세운송에 관한 고시", type: "옳은것고르기" },
    { year: 2024, no: 16, concept: "보세창고 내국물품만 계속 장치 신고 의무기간", correct: [{item:"장치신고 의무기간", value:"3개월 이상"}], distractors: [{item:"의무기간", wrongValue:"6개월 이상"}], basis: "관세법 제183조", type: "옳은것고르기" },
    { year: 2024, no: 17, concept: "수입신고수리물품 반출기한 + 보세구역외장치 담보 가산", correct: [{item:"수입신고수리물품 반출기한", value:"수리일부터 15일 이내"}, {item:"보세구역외장치 담보기간 가산", value:"허가기간 +1개월"}], distractors: [{item:"반출기한", wrongValue:"30일"}, {item:"담보 가산", wrongValue:"+2개월"}, {item:"담보 가산", wrongValue:"+3개월"}], basis: "관세법·보세화물관리 고시", type: "빈칸채우기" },
    { year: 2024, no: 19, concept: "보세구역외 장치 허가기간·담보액", correct: [{item:"보세구역외 장치 허가기간", value:"6개월 범위 내"}], distractors: [{item:"허가기간", wrongValue:"3년 범위 내"}, {item:"담보액", wrongValue:"관세 상당액의 120%"}], basis: "보세화물관리 고시", type: "옳은것고르기" },
    { year: 2024, no: 25, concept: "장치기간 경과물품 매각 — 재입찰 예정가격 체감 한도", correct: [{item:"재입찰 예정가격 체감 한도", value:"최초 예정가격의 100분의 10 이내"}], distractors: [{item:"체감 한도", wrongValue:"100분의 20 이내"}, {item:"재입찰 간격", wrongValue:"5일 이상"}, {item:"매각공고 기간", wrongValue:"통보일부터 30일"}], basis: "체화관리 고시", type: "옳은것고르기" },

    // ── 2025 ──
    { year: 2025, no: 2, concept: "항공 입항화물 하기결과보고서·하기장소 반입기한", correct: [{item:"하기결과보고서 제출기한", value:"입항 다음 날"}, {item:"하기장소 반입기한", value:"입항 다음 날"}], distractors: [{item:"보고서 제출", wrongValue:"입항 후 12시간 이내"}, {item:"보고서 제출", wrongValue:"24시간 이내"}, {item:"반입기한", wrongValue:"12시간 이내"}, {item:"반입기한", wrongValue:"24시간 이내"}], basis: "보세화물 입출항 고시", type: "빈칸채우기" },
    { year: 2025, no: 3, concept: "해상입항 컨테이너화물 하선장소 반입기한(현행)", correct: [{item:"컨테이너화물 반입기한", value:"입항일부터 5일 이내"}, {item:"산물 반입기한", value:"10일"}], distractors: [{item:"컨테이너 반입기한", wrongValue:"입항일부터 10일 이내"}], basis: "보세화물 입출항 고시", type: "옳은것고르기" },
    { year: 2025, no: 4, concept: "정정신청 생략 과부족 허용기준", correct: [{item:"포장단위 물품 중량", value:"10% 이내"}, {item:"벌크(산물) 중량", value:"5% 이내"}, {item:"용적물품 용적", value:"5% 이내"}, {item:"포장파손·중량변동 물품", value:"5% 이내"}], distractors: [{item:"산물 중량", wrongValue:"10% 이내"}, {item:"용적물품", wrongValue:"10% 이내"}, {item:"포장파손·중량변동", wrongValue:"10% 이내"}], basis: "보세화물 입출항 고시", type: "옳은것고르기" },
    { year: 2025, no: 5, concept: "출항화물 적재화물목록 정정신청 기간(해상/항공)", correct: [{item:"해상화물", value:"출항일부터 90일 이내"}, {item:"항공화물", value:"출항일부터 60일 이내"}], distractors: [{item:"해상화물", wrongValue:"60일"}, {item:"항공화물", wrongValue:"90일"}], basis: "보세화물 입출항 고시", type: "옳은것고르기" },
    { year: 2025, no: 9, concept: "화물운송주선업자 등록요건(자본금·등록기간·변동신고)", correct: [{item:"법인 자본금", value:"3억원 이상"}, {item:"등록기간", value:"3년"}, {item:"변동신고 기한", value:"60일 이내"}], distractors: [{item:"자본금", wrongValue:"2억원"}, {item:"자본금", wrongValue:"5억원"}, {item:"등록기간", wrongValue:"2년"}, {item:"변동신고", wrongValue:"20일"}, {item:"변동신고", wrongValue:"30일"}], basis: "화물운송주선업자 고시", type: "빈칸채우기" },
    { year: 2025, no: 13, concept: "특정물품간이보세운송업자 지정요건", correct: [{item:"법인 자본금", value:"3억원 이상"}, {item:"인·허가 보증보험", value:"2억원 이상"}, {item:"유개화물차·트랙터", value:"각 10대 이상"}, {item:"임원 중 관세사", value:"1명 이상"}], distractors: [{item:"자본금", wrongValue:"2억원"}, {item:"자본금", wrongValue:"5억원"}, {item:"보증보험", wrongValue:"1억원"}, {item:"보증보험", wrongValue:"3억원"}, {item:"유개화물차", wrongValue:"5대"}, {item:"유개화물차", wrongValue:"20대"}, {item:"관세사", wrongValue:"2명"}], basis: "보세운송에 관한 고시", type: "빈칸채우기" },
    { year: 2025, no: 16, concept: "보세창고 내국물품만 계속 장치 시 세관장 승인 요건", correct: [{item:"내국물품만 계속 장치 승인 필요 기간", value:"1년 이상"}], distractors: [{item:"승인 필요 기간", wrongValue:"3개월 이상"}], basis: "관세법 제183조", type: "옳은것고르기" },
    { year: 2025, no: 23, concept: "보세화물 장치기간(지정장치장·항역내·보세건설장)", correct: [{item:"지정장치장 장치기간", value:"6개월"}, {item:"지정장치장 연장", value:"3개월 범위"}, {item:"보세건설장 장치기간", value:"보세구역 특허기간"}, {item:"항역내 지정장치장(부산·인천 등)", value:"2개월(60일)"}], distractors: [{item:"지정장치장", wrongValue:"1년"}, {item:"방위산업용품 보세창고", wrongValue:"6개월"}, {item:"LME·BWT 보세창고", wrongValue:"1년"}, {item:"주요 항만·공항 지정장치장", wrongValue:"6개월"}], basis: "관세법 제177조·체화관리 고시", type: "옳은것고르기" },
    { year: 2025, no: 24, concept: "보세구역 장치물품 반출통고 시점(2개월 미만 물품)", correct: [{item:"단기물품 반출통고 적용 장치기간", value:"2개월 미만"}, {item:"단기물품 반출통고 시점", value:"장치기간 만료시점"}], distractors: [{item:"보세판매장·건설장·전시장 반출통고", wrongValue:"장치기간 만료 30일 전"}], basis: "체화관리 고시·관세법 제207조", type: "옳은것고르기" }
  ]
};
