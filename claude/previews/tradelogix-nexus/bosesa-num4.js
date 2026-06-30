// 보세사 4과목(수출입안전관리) — '숫자' 집중 정리 데이터
// 박사 지시(2026-06-30): 4과목에 유독 많은 '숫자' 선지·정답·오답을 한 카테고리로 모음.
//   ① 숫자 개념 정리(올바른 수치 + 자주 바꿔 출제하는 변형 패턴)  ② 기출에서 숫자 바꿔 낸 문항.
// 출처: 4과목 2019~2025 7개년 기출(BOSESA_DATA_4_*)에서 숫자 변별 문항을 전수 추출.
// ⚠️ 학습 보조용. 법령·고시는 개정되므로 시험 직전 최신 원문 확인 필수.
//   특히 2019년 형벌(형량·벌금)·국제항 여객수 기준은 출제 후 개정된 부분이 있어 연도 주석을 달았다.
window.BOSESA_NUM4 = {
  subject: 4,
  subjectName: "수출입안전관리",
  updated: "2026-06-30",

  // ① 숫자 개념 정리 — 토픽별. 각 item: label / correct(정답 수치) / variants(자주 출제되는 오답 변형) / note / basis / years
  concepts: [
    {
      topic: "AEO 공인등급 · 유효기간 · 등급별 혜택",
      icon: "fa-layer-group",
      items: [
        { label: "공인 유효기간", correct: "5년", variants: ["3년"], note: "공인증서를 발급한 날부터 기산.", basis: "AEO 공인 및 운영에 관한 고시", years: [2023] },
        { label: "공인등급 상향조정 요건(연속 충족 분기)", correct: "4개 분기 연속 공인등급별 기준 충족", variants: ["3개 분기", "5개 분기"], note: "갱신이 아닌 때에 등급조정을 신청하려면 공인 유효기간이 '1년 이상' 남아 있어야 함(오답으로 '2년' 출제).", basis: "AEO 고시 — 공인등급 조정", years: [2025] },
        { label: "공인등급 부여 기준점수(법규준수도)", correct: "A: 80점 이상~90점 미만 / AA: 90점 이상~95점 미만 / AAA: 95점 이상(+우수사례 등 추가요건)", variants: ["등급 경계 점수를 5점씩 올리거나 내려 출제"], note: "AAA는 점수 외에 우수사례·세관신뢰 등 추가요건 필요.", basis: "AEO 고시 — 공인등급 부여기준", years: [2024] },
        { label: "등급별 혜택 — 과태료 경감률", correct: "A 20% · AA 30% · AAA 50%", variants: ["A 15%", "A 10%"], note: "등급이 올라갈수록 경감률 상승.", basis: "AEO 고시 — 통관절차 등 혜택", years: [2023] },
        { label: "등급별 혜택 — 통고처분금액 경감률", correct: "A 15% · AA 30% · AAA 50%", variants: ["AA 20%"], note: "과태료 경감률(A 20%)과 통고처분 경감률(A 15%)을 서로 바꿔 함정 출제.", basis: "AEO 고시 — 통관절차 등 혜택", years: [2023] },
        { label: "등급별 혜택 — 특허 갱신기간 연장", correct: "A 6년 · AA 8년 · AAA 10년", variants: ["A 5년"], note: "보세구역운영인 부문 특허 갱신기간을 등급별로 연장.", basis: "AEO 고시 — 통관절차 등 혜택", years: [2023] },
        { label: "공인표지 디자인 개수", correct: "2개의 디자인", variants: ["1개의 디자인"], basis: "AEO 고시", years: [2020] }
      ]
    },
    {
      topic: "AEO 공인기준 점수 · 재무건전성 · 결격",
      icon: "fa-gauge-high",
      items: [
        { label: "법규준수도 기준점수", correct: "80점 이상", variants: ["70점"], note: "중소 수출기업은 직전 2개 분기 연속 80점 이상도 인정.", basis: "AEO 고시 — 공인기준", years: [2022, 2024] },
        { label: "내부통제시스템 평가점수", correct: "80점 이상", variants: ["70점"], basis: "AEO 고시 — 공인기준", years: [2022, 2024] },
        { label: "안전관리 권고기준 평가점수", correct: "70점 이상", variants: ["80점", "60점"], note: "법규준수·내부통제(80점)와 안전관리 권고(70점)의 기준점수를 서로 바꿔 출제.", basis: "AEO 고시 — 공인기준", years: [2022, 2024] },
        { label: "재무건전성 — 부채비율 한도", correct: "동종업종 평균 부채비율의 200% 이하", variants: ["300%", "150%"], note: "또는 투자적격 신용등급 보유 시 충족.", basis: "AEO 고시 — 재무건전성 기준", years: [2020, 2021, 2022, 2023] },
        { label: "결격 — 벌금형·통고처분 이행 후 경과기간", correct: "2년", variants: ["6개월", "1년"], note: "관세법 제268조의2·제276조 등 위반으로 벌금형 선고·통고처분 이행 후 2년 경과해야 공인 가능.", basis: "AEO 고시 — 공인기준(결격)", years: [2021, 2022, 2023] },
        { label: "결격 — 징역형 실형 집행종료·면제 후 경과기간", correct: "2년", variants: ["1년"], note: "집행이 끝나거나 면제된 후 2년 경과 시 공인 가능.", basis: "AEO 고시 — 공인기준(결격)", years: [2022] }
      ]
    },
    {
      topic: "AEO 심사 처리기간",
      icon: "fa-clipboard-check",
      items: [
        { label: "예비심사 완료기한", correct: "40일", variants: ["20일", "30일", "60일"], note: "신청서 접수일부터 기산.", basis: "AEO 고시 — 심사 처리기간", years: [2024, 2025] },
        { label: "서류심사 완료기한", correct: "60일", variants: ["40일", "90일", "120일"], note: "신청서 접수일부터 기산. 예비심사(40일)와 서류심사(60일)를 서로 바꿔 출제.", basis: "AEO 고시 — 심사 처리기간", years: [2023, 2024, 2025] },
        { label: "서류심사 보완요구 기간", correct: "30일", variants: ["60일"], basis: "AEO 고시 — 심사 처리기간", years: [2024] },
        { label: "현장심사 완료기한", correct: "60일", variants: ["30일"], basis: "AEO 고시 — 심사 처리기간", years: [2024] },
        { label: "통관적법성 검증 사업장 직접방문 기간", correct: "15일 이내", variants: ["30일"], note: "현장심사 중 사업장 방문을 시작한 날부터 기산.", basis: "AEO 고시 — 종합심사 현장심사", years: [2020, 2024] }
      ]
    },
    {
      topic: "AEO 종합심사(갱신) 신청",
      icon: "fa-rotate",
      items: [
        { label: "종합심사(갱신) 신청기한", correct: "유효기간 만료 6개월 전까지", variants: ["3개월 전", "만료 4.5개월 전(사례 함정)"], basis: "AEO 고시 — 종합심사", years: [2021, 2023] },
        { label: "조기 종합심사 신청 가능 시점", correct: "유효기간 만료 1년 전부터", variants: ["18개월", "2년"], note: "관세청장이 만료 1년 전부터 신청하게 할 수 있음.", basis: "AEO 고시 — 종합심사", years: [2021] },
        { label: "정기 자체평가서 제출 기준", correct: "매년 공인일자가 속하는 달", variants: ["매년 12월 15일(사례 함정)"], basis: "AEO 고시 — 정기 자체평가", years: [2023] }
      ]
    },
    {
      topic: "AEO 관리책임자 교육 · 자격",
      icon: "fa-user-graduate",
      items: [
        { label: "공인 전 교육시간(수출입관리책임자)", correct: "16시간 이상", variants: ["8시간"], basis: "AEO 고시 — 관리책임자 교육", years: [2023, 2025] },
        { label: "공인 전 교육 유효기간", correct: "5년", variants: ["3년"], basis: "AEO 고시 — 관리책임자 교육", years: [2023, 2025] },
        { label: "공인 후 교육 주기", correct: "매 2년", variants: ["매년", "1년"], basis: "AEO 고시 — 관리책임자 교육", years: [2022, 2023] },
        { label: "공인 후 교육시간", correct: "총괄책임자 4시간 · 수출입관리책임자 8시간", variants: ["8시간", "16시간"], basis: "AEO 고시 — 관리책임자 교육", years: [2022] },
        { label: "공인 후 최초 교육 기한", correct: "공인일부터 1년 이내", variants: ["2년"], basis: "AEO 고시 — 관리책임자 교육", years: [2023] },
        { label: "관리책임자 변경 시 교육 이수기한", correct: "180일 이내", variants: ["1년", "150일"], note: "변경된 날부터 180일(약 6개월) 이내.", basis: "AEO 고시 — 관리책임자 교육", years: [2020, 2022, 2023] },
        { label: "관리책임자 변경 보고기한", correct: "변경된 날부터 30일 이내", variants: ["약 45일(사례 함정)"], note: "관세청장에게 보고.", basis: "AEO 고시 — 관리책임자 변경", years: [2021] },
        { label: "AEO 제도 교육과정 이수시간(자율평가서 확인 보세사)", correct: "35시간 이상", variants: ["8시간", "16시간"], note: "최근 5년 이내 이수 + 공인 전 교육 16시간 이상 요건과 함께 출제.", basis: "AEO 고시 — 정기 자율평가서 확인 보세사 자격", years: [2025] },
        { label: "관리책임자 근무경력", correct: "중소 수출기업 수출관리책임자 1년 이상 · 관세사 통관업무 담당 3년 이상", variants: ["보세운송 부문 2년 이상으로 단정(틀린 함정)"], basis: "AEO 고시 — 관리책임자 자격요건", years: [2025] }
      ]
    },
    {
      topic: "AEO 정기 자율평가 주기 · 기한",
      icon: "fa-list-check",
      items: [
        { label: "경영방침 세부목표 검토 주기", correct: "6개월", variants: ["3개월"], basis: "AEO 고시 제18조 — 정기 자율평가", years: [2024] },
        { label: "전산시스템 백업 주기", correct: "30일", variants: ["60일", "90일"], basis: "AEO 고시 제18조 — 정기 자율평가", years: [2024] },
        { label: "암호 변경 주기", correct: "90일", variants: ["30일", "60일", "120일", "150일"], basis: "AEO 고시 제18조 — 정기 자율평가", years: [2024] },
        { label: "특이사항(화재·침수·도난·불법유출 등) 발생 신고기한", correct: "30일 이내", variants: ["15일", "20일", "60일"], basis: "AEO 고시 제18조 — 정기 자율평가", years: [2024] }
      ]
    },
    {
      topic: "AEO 공인 유보 · 개선 절차",
      icon: "fa-screwdriver-wrench",
      items: [
        { label: "개선계획서 제출기한", correct: "30일", variants: ["20일", "50일"], note: "공인 유보 결정일부터 기산.", basis: "AEO 고시 — 공인 유보 개선절차", years: [2025] },
        { label: "개선 완료보고서 제출기한(유보 업체)", correct: "180일", variants: ["90일"], note: "개선계획서 제출일부터 기산.", basis: "AEO 고시 — 공인 유보 개선절차", years: [2025] },
        { label: "개선 완료보고서 제출기한(갱신 등급하락 예상)", correct: "90일 (경미사항은 요구일부터 30일)", variants: ["60일"], basis: "AEO 고시 — 갱신심사 결과 처리", years: [2025] },
        { label: "재무건전성 사유 제출기한 연장", correct: "1년 이내", variants: ["2년"], basis: "AEO 고시 — 공인 유보 개선절차", years: [2025] }
      ]
    },
    {
      topic: "관세법 형벌 · 과태료 · 제척기간  ⚠️2019 출제 당시 기준(이후 개정분 있음)",
      icon: "fa-gavel",
      items: [
        { label: "과태료 최고금액(제277조)", correct: "1억원 (2019 출제 당시)", variants: ["2억원"], note: "⚠️ 과태료 상한은 이후 개정되었으므로 시험 직전 최신 조문 확인.", basis: "관세법 제277조", years: [2019] },
        { label: "과태료 처분 이의제기 기간", correct: "60일", variants: ["90일"], note: "질서위반행위규제법 제20조.", basis: "질서위반행위규제법", years: [2019] },
        { label: "과태료 부과 제척기간", correct: "5년", variants: ["3년"], note: "위반행위가 종료된 날부터 기산.", basis: "질서위반행위규제법 제19조", years: [2019] },
        { label: "명의대여죄(제275조의3) 형량", correct: "1년 이하 징역 또는 1천만원 이하 벌금 (2019 당시)", variants: ["2년", "5백만원"], note: "⚠️ 2020.12.22. 개정 전 기준. 현행 형량은 최신 조문 확인.", basis: "관세법 제275조의3", years: [2019] },
        { label: "부정환급죄(제270조 제5항) 형량", correct: "3년 이하 징역 또는 환급세액의 5배 이하 벌금", variants: ["징역 2년", "징역 5년", "벌금 3배"], note: "부정환급세액은 즉시 징수.", basis: "관세법 제270조 제5항", years: [2019] },
        { label: "밀수입죄(제269조 제2항) 벌금 배수", correct: "관세액의 10배와 물품원가 중 높은 금액 이하", variants: ["관세액의 5배"], note: "5년 이하 징역 또는 위 벌금.", basis: "관세법 제269조 제2항", years: [2019] }
      ]
    },
    {
      topic: "특허보세구역 · 자율관리 · 보세운송업자",
      icon: "fa-warehouse",
      items: [
        { label: "특허보세구역 특허취소(장기 미반입)", correct: "2년 이상 물품반입 실적이 없을 때", variants: ["1년 이상"], basis: "특허보세구역 운영에 관한 고시", years: [2019] },
        { label: "자율관리보세구역 보세사 결원 시 채용기간", correct: "2개월", variants: ["1개월"], note: "결원이 생긴 날부터 2개월 내 다른 보세사 채용.", basis: "자율관리 보세구역 운영에 관한 고시", years: [2019] },
        { label: "보세운송업자 등록 유효기간", correct: "3년", variants: ["2년"], basis: "관세법 제222조", years: [2023] },
        { label: "보세운송업자 등록 갱신신청 기한", correct: "기간만료 1개월 전까지", variants: ["2개월 전"], basis: "관세법 제222조", years: [2023] }
      ]
    },
    {
      topic: "자유무역지역(FTZ)",
      icon: "fa-industry",
      items: [
        { label: "장기보관화물 매각요청 요건", correct: "반입일부터 6개월 경과 + 반출통고 후 30일 경과", variants: ["보관 3개월", "반출통고 후 15일", "반출통고 후 45일"], basis: "자유무역지역 반출입물품 관리에 관한 고시", years: [2019] },
        { label: "역외작업 반출기간", correct: "시설재 3년 · 원자재 1년 이내", variants: ["시설재 1년 초과 불가(틀린 함정)"], note: "시설재는 계약기간 범위로 하되 3년 초과 불가.", basis: "자유무역지역 반출입물품 관리에 관한 고시", years: [2019] },
        { label: "역외작업 범위", correct: "전년도 수출금액의 100분의 60 이내", variants: [], basis: "자유무역지역 반출입물품 관리에 관한 고시", years: [2019] },
        { label: "내국물품 반입증명서류 미제출 반출 과태료", correct: "200만원 이하", variants: ["100만원 이하"], note: "반입증명서류 보관기간은 2년.", basis: "자유무역지역법 제70조", years: [2019] },
        { label: "입주기업 재고조사 보고서 제출시기", correct: "회계연도 종료 후 3개월 경과 + 15일 이내", variants: ["종료 후 2개월", "종료 후 6개월", "종료 후 1개월", "10일 이내"], basis: "자유무역지역 반출입물품 관리에 관한 고시", years: [2019] }
      ]
    },
    {
      topic: "국제항 지정요건 · 수수료",
      icon: "fa-anchor",
      items: [
        { label: "항구 국제항 지정요건", correct: "5천톤급 이상 선박이 연간 50회 이상 입항", variants: ["3천톤급", "연 60회", "주 6회(공항 기준 혼동)"], basis: "관세법 시행령 — 국제항 지정요건", years: [2022, 2024] },
        { label: "공항 국제항 지정요건(여객수)", correct: "⚠️ 연도별 상이: 2022 출제=연 4만명 이상 / 2024 출제=연 6만명 이상 (개정)", variants: ["주 5회", "연 5만명", "연 50회"], note: "정기여객기 운항 + 여객수 기준. 여객수 기준이 개정되었으니 최신 시행령 확인 필수.", basis: "관세법 시행령 — 국제항 지정요건", years: [2022, 2024] },
        { label: "출입허가수수료 총액 상한(비국제항)", correct: "50만원", variants: ["1만원 미달 시 면제로 단정(함정)"], basis: "관세법 시행규칙 제62조", years: [2024] },
        { label: "비국제항 출입허가 통지기한", correct: "10일", variants: ["7일"], basis: "관세법 — 국제무역선·기 입출항", years: [2024] }
      ]
    },
    {
      topic: "국제무역선 · 기 입출항",
      icon: "fa-ship",
      items: [
        { label: "간이 입출항 절차(적재화물목록 등 제출 생략)", correct: "하역하지 않고 입항한 때부터 24시간 이내 출항", variants: ["48시간"], basis: "관세법령 — 간이 입출항 절차", years: [2022] },
        { label: "승객예약자료 제출시한", correct: "출항편: 출항 후 3시간 이내 / 입항편: 입항 1시간 전까지(운항예정 3시간 이내면 출항 30분 전까지)", variants: ["입항 2시간 전", "입항 30분 전"], note: "승객자료 구분관리: 입·출항일부터 1월 경과 후.", basis: "관세법 시행규칙 제62조의3", years: [2021] },
        { label: "상시승선(신고)증 유효기간", correct: "발급일부터 3년", variants: ["2년"], basis: "국제무역선 승선신고 처리절차", years: [2021] }
      ]
    },
    {
      topic: "선박 · 항공기용품 관리",
      icon: "fa-box-open",
      items: [
        { label: "적재허가 후 적재완료 기한", correct: "허가일부터 7일 이내", variants: ["10일", "15일"], note: "선박용품·항공기용품 공통으로 자주 출제되는 '7일'.", basis: "선박용품 등 관리에 관한 고시", years: [2021, 2022, 2025] },
        { label: "적재완료 보고시한", correct: "적재 다음날 12시까지", variants: [], basis: "선박용품 등 관리에 관한 고시", years: [2025] },
        { label: "보세운송기간 · 연장", correct: "15일 이내 + 15일 이내 1회 연장", variants: ["10일"], basis: "선박용품 등 관리에 관한 고시", years: [2022] },
        { label: "조건부 하역 외국선박용품 재적재·완료보고", correct: "1개월 이내", variants: ["최대 1년", "60일", "10일"], basis: "선박용품 등 관리에 관한 고시", years: [2021, 2022, 2025] },
        { label: "외국용품 용도외 처분보고서 제출기한", correct: "처분일부터 7일 이내", variants: ["10일"], basis: "항공기용품 등 관리에 관한 고시", years: [2023, 2025] },
        { label: "양도양수보고서 제출기한", correct: "보세운송 신고일부터 7일 이내", variants: [], basis: "항공기용품 등 관리에 관한 고시", years: [2023] },
        { label: "하선허가 후 보세구역 반입기한", correct: "7일", variants: ["10일"], basis: "선박용품 등 관리에 관한 고시", years: [2025] },
        { label: "단기 항행 특례 기준 항행일수", correct: "1회 항행 7일", variants: ["10일"], basis: "선박용품 등 관리에 관한 고시", years: [2025] },
        { label: "공급자 대행업체 지정 가능 금액기준", correct: "미화 5천달러(원화 500만원) 이하", variants: [], basis: "선박용품 등 관리에 관한 고시", years: [2021] }
      ]
    },
    {
      topic: "포상금",
      icon: "fa-award",
      items: [
        { label: "관세행정 개선·발전 공로 포상금 한도", correct: "200만원의 범위", variants: [], basis: "밀수 등 신고자 포상에 관한 훈령", years: [2024] },
        { label: "마약류관리법 위반 사범 신고 포상금 최고액", correct: "3억원", variants: [], basis: "밀수 등 신고자 포상에 관한 훈령", years: [2024] }
      ]
    }
  ],

  // ② 기출 숫자변형 문항 — 2019~2025 7개년 전수
  questions: [
    // ── 2019 (자율관리 및 관세벌칙 편성) ──
    { year: 2019, no: 2, concept: "관세법상 과태료 최고금액과 이의제기(불복) 기간", correct: [{item:"과태료 최고금액(제277조)", value:"1억원(2019 당시)"}, {item:"이의제기 기간", value:"60일"}], distractors: [{item:"과태료 최고금액", wrongValue:"2억원"}, {item:"이의제기 기간", wrongValue:"90일"}], basis: "질서위반행위규제법 제20조 · 관세법 제277조", type: "옳은것고르기" },
    { year: 2019, no: 8, concept: "명의대여죄(제275조의3) 형량 — 2019 당시", correct: [{item:"징역", value:"1년 이하"}, {item:"벌금", value:"1천만원 이하"}], distractors: [{item:"징역", wrongValue:"2년"}, {item:"벌금", wrongValue:"5백만원"}], basis: "관세법 제275조의3 (2020.12.22. 개정 전)", type: "빈칸채우기" },
    { year: 2019, no: 9, concept: "부정환급죄(제270조 제5항) 형량과 부정환급세액 처리", correct: [{item:"징역", value:"3년 이하"}, {item:"벌금", value:"환급세액의 5배 이하"}], distractors: [{item:"징역", wrongValue:"2년"}, {item:"징역", wrongValue:"5년"}, {item:"벌금 배수", wrongValue:"3배"}], basis: "관세법 제270조 제5항 (즉시 징수)", type: "빈칸채우기" },
    { year: 2019, no: 10, concept: "밀수입죄(제269조 제2항) 벌금 배수", correct: [{item:"밀수입죄 벌금", value:"관세액의 10배와 물품원가 중 높은 금액 이하"}], distractors: [{item:"밀수입죄 벌금", wrongValue:"관세액의 5배"}], basis: "관세법 제269조 제2항 (5년 이하 징역)", type: "틀린것고르기" },
    { year: 2019, no: 11, concept: "과태료 부과의 제척기간(위반행위 종료일 기준)", correct: [{item:"과태료 부과 제척기간", value:"5년"}], distractors: [{item:"제척기간", wrongValue:"3년"}], basis: "질서위반행위규제법 제19조", type: "틀린것고르기" },
    { year: 2019, no: 17, concept: "특허보세구역 장기 미반입에 따른 특허취소 기준기간", correct: [{item:"반입실적 없는 기간", value:"2년 이상"}], distractors: [{item:"미반입 지속기간", wrongValue:"1년 이상"}], basis: "특허보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2019, no: 18, concept: "자율관리보세구역 보세사 결원 시 다른 보세사 채용기간", correct: [{item:"채용기간", value:"2개월"}], distractors: [{item:"채용기간", wrongValue:"1개월"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2019, no: 19, concept: "자유무역지역 장기보관화물 매각요청 요건(보관경과·반출통고 후 경과)", correct: [{item:"반입일부터 보관경과", value:"6개월"}, {item:"반출통고 후 경과", value:"30일"}], distractors: [{item:"반출통고 후 경과", wrongValue:"15일"}, {item:"보관경과", wrongValue:"3개월"}, {item:"반출통고 후 경과", wrongValue:"45일"}], basis: "자유무역지역 반출입물품 관리에 관한 고시", type: "빈칸채우기" },
    { year: 2019, no: 20, concept: "자유무역지역 역외작업 시설재·원자재 반출기간 및 작업범위", correct: [{item:"시설재 반출기간 상한", value:"3년"}, {item:"원자재 반출기간", value:"1년 이내"}, {item:"역외작업 범위", value:"전년도 수출금액의 100분의 60 이내"}], distractors: [{item:"시설재 반출기간", wrongValue:"1년 초과 불가"}], basis: "자유무역지역 반출입물품 관리에 관한 고시", type: "틀린것고르기" },
    { year: 2019, no: 21, concept: "내국물품 반입증명서류 미제출 반출 시 과태료 및 서류 보관기간", correct: [{item:"과태료", value:"200만원 이하"}, {item:"반입증명서류 보관기간", value:"2년"}], distractors: [{item:"과태료", wrongValue:"100만원 이하"}], basis: "자유무역지역법 제70조", type: "틀린것고르기" },
    { year: 2019, no: 22, concept: "자유무역지역 입주기업 재고조사 보고서 제출시기", correct: [{item:"회계연도 종료 후 경과", value:"3개월"}, {item:"제출기한", value:"15일 이내"}], distractors: [{item:"경과기간", wrongValue:"2개월"}, {item:"경과기간", wrongValue:"6개월"}, {item:"경과기간", wrongValue:"1개월"}, {item:"제출기한", wrongValue:"10일"}], basis: "자유무역지역 반출입물품 관리에 관한 고시", type: "빈칸채우기" },

    // ── 2020 ──
    { year: 2020, no: 1, concept: "AEO 관리책임자 변경 시 공인 후 교육 이수기한", correct: [{item:"교육 이수기한", value:"변경된 날부터 180일 이내"}], distractors: [{item:"교육 이수기한", wrongValue:"1년 이내"}], basis: "AEO 고시 — 관리책임자 교육", type: "틀린것고르기" },
    { year: 2020, no: 3, concept: "보세구역운영인 재무건전성 공인기준 — 부채비율 상한", correct: [{item:"부채비율 상한(동종업종 평균 대비)", value:"200% 이하"}], distractors: [{item:"부채비율 상한", wrongValue:"300% 이하"}], basis: "AEO 고시 — 재무건전성 기준", type: "틀린것고르기" },
    { year: 2020, no: 12, concept: "AEO 공인표지 디자인 개수", correct: [{item:"공인표지 디자인 개수", value:"2개의 디자인"}], distractors: [{item:"공인표지 디자인 개수", wrongValue:"1개의 디자인"}], basis: "AEO 고시", type: "틀린것고르기" },
    { year: 2020, no: 19, concept: "종합심사 현장심사 중 통관적법성 검증 사업장 직접 방문기간", correct: [{item:"직접 방문기간", value:"방문 시작일부터 15일 이내"}], distractors: [{item:"직접 방문기간", wrongValue:"30일 이내"}], basis: "AEO 고시 — 종합심사 현장심사", type: "틀린것고르기" },

    // ── 2021 ──
    { year: 2021, no: 8, concept: "수출입관리책임자 변경 시 관세청장 보고기한", correct: [{item:"변경 보고기한", value:"변경된 날부터 30일 이내"}], distractors: [{item:"사례 보기 변경일~보고일 간격", wrongValue:"약 45일(30일 초과)"}], basis: "AEO 고시 — 관리책임자 변경", type: "틀린것고르기" },
    { year: 2021, no: 12, concept: "AEO 종합심사(갱신) 신청기한 및 조기신청 가능시점", correct: [{item:"종합심사 신청기한", value:"유효기간 만료 6개월 전까지"}, {item:"조기 신청 가능시점", value:"만료 1년 전부터"}], distractors: [{item:"신청기한", wrongValue:"3개월"}, {item:"조기 신청시점", wrongValue:"18개월"}, {item:"조기 신청시점", wrongValue:"2년"}], basis: "AEO 고시 — 종합심사", type: "빈칸채우기" },
    { year: 2021, no: 15, concept: "보세구역운영인 부문 공인기준(벌금형 후 경과기간·부채비율)", correct: [{item:"제276조 벌금형 후 경과기간", value:"2년"}, {item:"부채비율(동종업종 평균 대비)", value:"200% 이하"}], distractors: [{item:"벌금형 후 경과기간", wrongValue:"6개월"}, {item:"벌금형 후 경과기간", wrongValue:"1년"}, {item:"부채비율", wrongValue:"300%"}], basis: "AEO 고시 — 보세구역운영인 부문 공인기준", type: "빈칸채우기" },
    { year: 2021, no: 18, concept: "상시승선(신고)증의 유효기간", correct: [{item:"상시승선증 유효기간", value:"발급일부터 3년"}], distractors: [{item:"유효기간", wrongValue:"2년"}], basis: "국제무역선 승선신고 처리절차", type: "틀린것고르기" },
    { year: 2021, no: 21, concept: "선박용품 적재·처분 관련 기한·금액 기준", correct: [{item:"적재허가 후 적재완료 기한", value:"허가일부터 7일 이내"}], distractors: [{item:"공급자 대행업체 지정 금액기준", wrongValue:"미화 5천달러(원화 500만원) 이하"}, {item:"조건부 하역 재적재 기한", wrongValue:"60일 이내"}, {item:"용도외 처분보고 기한", wrongValue:"10일 이내"}], basis: "선박용품 등 관리에 관한 고시", type: "옳은것고르기" },
    { year: 2021, no: 22, concept: "승객예약자료 제출시한", correct: [{item:"출항편 제출시한", value:"출항 후 3시간 이내"}, {item:"입항편 제출시한", value:"입항 1시간 전까지"}, {item:"입항편 예외(운항 3시간 이내)", value:"출항 30분 전까지"}, {item:"구분관리 기준", value:"입·출항일부터 1월 경과"}], distractors: [{item:"입항편 제출시한", wrongValue:"입항 2시간 전까지"}, {item:"입항편 예외", wrongValue:"입항 30분 전까지"}], basis: "관세법 시행규칙 제62조의3", type: "틀린것고르기" },

    // ── 2022 ──
    { year: 2022, no: 1, concept: "하역 없이 입항 후 출항 시 간이 입출항 절차 적용 기준시간", correct: [{item:"간이 입출항 기준시간", value:"24시간 이내 출항"}], distractors: [{item:"기준시간", wrongValue:"48시간"}], basis: "관세법령 — 간이 입출항 절차", type: "틀린것고르기" },
    { year: 2022, no: 2, concept: "조건부 하역한 외국선박용품의 재적재·적재완료 보고기한", correct: [{item:"재적재·완료보고 기한", value:"1개월 이내"}], distractors: [{item:"기한", wrongValue:"최대 1년 이내"}], basis: "선박용품 등 관리에 관한 고시", type: "틀린것고르기" },
    { year: 2022, no: 5, concept: "선박용품 보세운송기간·연장기간 및 적재완료 기한", correct: [{item:"보세운송기간", value:"15일"}, {item:"연장승인 기간", value:"15일"}, {item:"적재완료 기한", value:"7일"}], distractors: [{item:"보세운송기간", wrongValue:"10일"}, {item:"연장승인 기간", wrongValue:"10일"}, {item:"적재완료 기한", wrongValue:"10일"}], basis: "선박용품 등 관리에 관한 고시", type: "빈칸채우기" },
    { year: 2022, no: 6, concept: "국제항 지정요건(항구 입항횟수·공항 정기여객기·여객수)", correct: [{item:"항구 5천톤급 이상 연간 입항", value:"50회"}, {item:"공항 정기여객기 주", value:"6회"}, {item:"공항 여객수 연간", value:"4만명"}], distractors: [{item:"항구 연간 입항", wrongValue:"60회"}, {item:"공항 정기여객기 주", wrongValue:"5회"}, {item:"공항 여객수 연간", wrongValue:"5만명"}], basis: "관세법 시행령 — 국제항 지정요건", type: "빈칸채우기" },
    { year: 2022, no: 12, concept: "AEO 재무건전성 기준 부채비율 상한", correct: [{item:"부채비율 상한(동종업종 평균 대비)", value:"200%"}], distractors: [{item:"부채비율 상한", wrongValue:"300%"}], basis: "AEO 고시 제4조·별표1", type: "빈칸채우기" },
    { year: 2022, no: 14, concept: "AEO 관리책임자 교육 주기·시간 및 변경 시 이수기한", correct: [{item:"교육 주기", value:"2년"}, {item:"총괄책임자 교육시간", value:"4시간"}, {item:"수출입관리책임자 교육시간", value:"8시간"}, {item:"변경 시 이수기한", value:"180일"}], distractors: [{item:"교육 주기", wrongValue:"1년"}, {item:"총괄책임자 교육시간", wrongValue:"8시간"}, {item:"수출입관리책임자 교육시간", wrongValue:"16시간"}, {item:"변경 시 이수기한", wrongValue:"1년"}, {item:"변경 시 이수기한", wrongValue:"150일"}], basis: "AEO 고시 — 관리책임자 교육", type: "빈칸채우기" },
    { year: 2022, no: 15, concept: "AEO 공인 충족요건 점수(법규준수도·내부통제·안전관리 권고)", correct: [{item:"법규준수도", value:"80점"}, {item:"내부통제시스템", value:"80점"}, {item:"안전관리 권고기준", value:"70점"}], distractors: [{item:"법규준수도", wrongValue:"70점"}, {item:"내부통제시스템", wrongValue:"70점"}, {item:"안전관리 권고기준", wrongValue:"80점"}], basis: "AEO 고시 — 공인기준 충족요건", type: "빈칸채우기" },
    { year: 2022, no: 20, concept: "보세구역운영인 부문 공인 가능·결격 수치기준", correct: [{item:"징역형 실형 집행종료·면제 후 경과", value:"2년 경과"}], distractors: [{item:"벌금형 후 경과기간", wrongValue:"1년 경과"}, {item:"통합법규준수도", wrongValue:"70점"}, {item:"안전관리 권고기준", wrongValue:"60점"}, {item:"부채비율", wrongValue:"300%"}], basis: "AEO 고시 — 공인기준·결격사유", type: "옳은것고르기" },

    // ── 2023 ──
    { year: 2023, no: 2, concept: "AEO 공인심사 서류심사 처리기한", correct: [{item:"서류심사 기한(접수일 기산)", value:"60일 이내"}], distractors: [{item:"서류심사 기한", wrongValue:"120일 이내"}], basis: "AEO 고시 — 서류심사", type: "틀린것고르기" },
    { year: 2023, no: 3, concept: "보세구역운영인 부문 공인기준(벌금형 후 경과·부채비율)", correct: [{item:"제268조의2 위반 벌금형·통고처분 이행 후 경과", value:"2년"}, {item:"부채비율(동종업종 평균 대비)", value:"200% 이하"}], distractors: [{item:"경과기간", wrongValue:"1년"}, {item:"부채비율", wrongValue:"150%"}], basis: "AEO 고시 — 공인기준 1.1.2·3.2.1", type: "빈칸채우기" },
    { year: 2023, no: 5, concept: "AEO 공인의 유효기간", correct: [{item:"공인 유효기간(증서 발급일 기산)", value:"5년"}], distractors: [{item:"유효기간", wrongValue:"3년"}], basis: "AEO 고시", type: "옳은것고르기" },
    { year: 2023, no: 6, concept: "보세구역운영인 통관절차 혜택(등급별 경감률·특허 갱신 연장)", correct: [{item:"과태료 경감 A등급", value:"20%"}, {item:"통고처분 경감 AA등급", value:"30%"}, {item:"특허 갱신 연장 A등급", value:"6년"}], distractors: [{item:"과태료 경감 A등급", wrongValue:"15%"}, {item:"과태료 경감 A등급", wrongValue:"10%"}, {item:"통고처분 경감 AA등급", wrongValue:"20%"}, {item:"특허 갱신 연장 A등급", wrongValue:"5년"}], basis: "AEO 고시 — 통관절차 등 혜택", type: "빈칸채우기" },
    { year: 2023, no: 7, concept: "AEO 관리책임자 공인 전·후 교육(시간·유효기간·주기·최초기한)", correct: [{item:"공인 전 교육시간(수출입관리)", value:"16시간 이상"}, {item:"공인 전 교육 유효기간", value:"5년"}, {item:"공인 후 교육 주기", value:"매 2년"}, {item:"공인 후 최초 교육기한", value:"1년 이내"}, {item:"변경 시 교육기한", value:"180일 이내"}], distractors: [{item:"공인 전 교육 유효기간", wrongValue:"3년"}, {item:"공인 후 교육 주기", wrongValue:"매년"}, {item:"최초 교육기한", wrongValue:"2년"}], basis: "AEO 고시 — 관리책임자 교육", type: "빈칸채우기" },
    { year: 2023, no: 8, concept: "AEO 종합심사(갱신) 신청기한 및 정기 자체평가 제출기준", correct: [{item:"종합심사 신청기한", value:"유효기간 만료 6개월 전까지"}, {item:"정기 자체평가서 제출기준월", value:"매년 공인일자가 속하는 달"}], distractors: [{item:"사례 신청시점", wrongValue:"만료 약 4.5개월 전"}, {item:"사례 자체평가 제출일", wrongValue:"매년 12월 15일"}], basis: "AEO 고시 — 종합심사·정기 자체평가", type: "기타" },
    { year: 2023, no: 16, concept: "보세운송업자등 등록 갱신신청기한 및 등록 유효기간", correct: [{item:"등록갱신 신청기한", value:"기간만료 1개월 전까지"}, {item:"등록 유효기간", value:"3년"}], distractors: [{item:"등록갱신 신청기한", wrongValue:"기간만료 2개월 전"}, {item:"등록 유효기간", wrongValue:"2년"}], basis: "관세법 제222조", type: "옳은것고르기" },
    { year: 2023, no: 19, concept: "항공기용품 양도양수보고서 제출기한", correct: [{item:"양도양수보고서 제출기한(보세운송 신고일 기산)", value:"7일 이내"}], distractors: [{item:"용도외 처분보고서 제출기한", wrongValue:"10일 이내"}], basis: "항공기용품 등 관리에 관한 고시", type: "옳은것고르기" },
    { year: 2023, no: 25, concept: "국제항이 아닌 지역 출입허가수수료 산정단가", correct: [], distractors: [{item:"국제무역선 출입허가수수료(선지)", wrongValue:"총톤수 1톤당 100원"}, {item:"국제무역기 출입허가수수료(선지)", wrongValue:"자체무게 1톤당 1천원"}], basis: "관세법 제134·135조·시행규칙(별표 단가). ※원본 데이터에 정답 단가 미명시 — 박사 검수 필요", type: "옳은것고르기" },

    // ── 2024 ──
    { year: 2024, no: 1, concept: "국제항 지정요건(공항·항구)과 비국제항 출입허가수수료 한도", correct: [{item:"공항 정기여객기 수송인원", value:"연간 6만명 이상"}, {item:"항구 국제무역선 톤급", value:"5천톤급 이상"}, {item:"항구 입항 횟수", value:"연간 50회 이상"}, {item:"출입허가수수료 총액 상한", value:"50만원"}], distractors: [{item:"공항 입항 횟수", wrongValue:"연간 50회 이상"}, {item:"항구 톤급", wrongValue:"3천톤급 이상"}, {item:"항구 입항 횟수", wrongValue:"주 6회 이상"}, {item:"수수료 면제 기준", wrongValue:"1만원 미달 시 면제"}], basis: "관세법 제133·134조·시행령 제155조의2·시행규칙 제62조", type: "옳은것고르기" },
    { year: 2024, no: 2, concept: "국제무역선(기) 입출항절차의 통지·보고 기간기준", correct: [{item:"비국제항 출입허가 통지기한", value:"10일"}], distractors: [{item:"통지기한", wrongValue:"7일"}, {item:"입항보고 시기", wrongValue:"입항 후 4시간 이내"}, {item:"출항허가 시기", wrongValue:"출항하기 4시간 전"}], basis: "관세법 제134~136조·시행령", type: "빈칸채우기" },
    { year: 2024, no: 9, concept: "밀수 등 신고자 포상 한도액", correct: [{item:"관세행정 개선·발전 공로 포상", value:"200만원의 범위"}], distractors: [{item:"마약류 관리법 위반 사범 포상 최고액", wrongValue:"3억원"}], basis: "밀수 등 신고자 포상에 관한 훈령", type: "옳은것고르기" },
    { year: 2024, no: 12, concept: "AEO 공인기준 충족 판정 기준점수·부채비율 한도", correct: [{item:"법규준수도 충족 기준", value:"80점 이상(85점=충족)"}, {item:"내부통제시스템 충족 기준", value:"80점 이상(75점=미충족)"}, {item:"부채비율 충족 한도", value:"동종업종 평균(70%)의 200%(=140%) 이내(120%=충족)"}], distractors: [], basis: "AEO 고시 — 공인기준 충족 판정", type: "빈칸채우기" },
    { year: 2024, no: 13, concept: "AEO 공인등급(A·AA·AAA) 부여 기준점수", correct: [{item:"A등급 법규준수도", value:"80점 이상~90점 미만"}, {item:"AA등급 법규준수도", value:"90점 이상~95점 미만"}, {item:"AAA등급 법규준수도", value:"95점 이상(+추가요건)"}], distractors: [], basis: "AEO 고시 — 공인등급 부여기준", type: "틀린것고르기" },
    { year: 2024, no: 16, concept: "AEO 정기 자율평가 체크리스트(보세구역운영인) 주기·기한", correct: [{item:"경영방침 세부목표 검토주기", value:"6개월"}, {item:"전산시스템 백업 주기", value:"30일"}, {item:"암호 변경주기", value:"90일"}, {item:"특이사항 발생 신고기한", value:"30일 이내"}], distractors: [{item:"세부목표 검토주기", wrongValue:"3개월"}, {item:"전산백업 주기", wrongValue:"60일"}, {item:"전산백업 주기", wrongValue:"90일"}, {item:"암호 변경주기", wrongValue:"30일"}, {item:"암호 변경주기", wrongValue:"60일"}, {item:"암호 변경주기", wrongValue:"120일"}, {item:"암호 변경주기", wrongValue:"150일"}, {item:"특이사항 신고기한", wrongValue:"15일"}, {item:"특이사항 신고기한", wrongValue:"20일"}, {item:"특이사항 신고기한", wrongValue:"60일"}], basis: "AEO 고시 제18조 — 정기 자율평가", type: "빈칸채우기" },
    { year: 2024, no: 18, concept: "AEO 공인절차(예비심사·서류보완·현장심사·직접방문) 처리기간", correct: [{item:"예비심사 완료기한", value:"40일"}, {item:"서류심사 보완요구 범위", value:"30일"}, {item:"현장심사 완료기한", value:"60일"}, {item:"사업장 직접방문 기간", value:"15일 이내"}], distractors: [{item:"예비심사 완료기한", wrongValue:"30일"}, {item:"서류심사 보완요구 범위", wrongValue:"60일"}, {item:"현장심사 완료기한", wrongValue:"30일"}, {item:"사업장 직접방문 기간", wrongValue:"30일"}], basis: "AEO 고시 — 공인절차 처리기간", type: "빈칸채우기" },

    // ── 2025 ──
    { year: 2025, no: 1, concept: "AEO 공인등급 상향조정 요건(연속 분기·잔여 유효기간)", correct: [{item:"상향조정 연속 충족 분기", value:"4개 분기"}, {item:"등급조정 신청 시 잔여 유효기간", value:"1년 이상"}], distractors: [{item:"연속 충족 분기", wrongValue:"3개 분기"}, {item:"연속 충족 분기", wrongValue:"5개 분기"}, {item:"잔여 유효기간", wrongValue:"2년"}], basis: "AEO 고시 — 공인등급 조정", type: "빈칸채우기" },
    { year: 2025, no: 4, concept: "AEO 심사 처리기한(예비심사·서류심사 완료기한)", correct: [{item:"예비심사 완료기한(접수일부터)", value:"40일"}, {item:"서류심사 완료기한(접수일부터)", value:"60일"}], distractors: [{item:"예비심사 완료기한", wrongValue:"20일"}, {item:"예비심사 완료기한", wrongValue:"60일"}, {item:"서류심사 완료기한", wrongValue:"40일"}, {item:"서류심사 완료기한", wrongValue:"90일"}], basis: "AEO 고시 — 심사 처리기한", type: "빈칸채우기" },
    { year: 2025, no: 6, concept: "정기 자율평가서 확인 보세사 자격 — 교육 이수기간·시간", correct: [{item:"교육 이수기준 기간", value:"최근 5년 이내"}, {item:"공인 전 교육 이수시간", value:"16시간 이상"}, {item:"AEO 제도 교육과정 이수시간", value:"35시간 이상"}], distractors: [{item:"교육 이수기준 기간", wrongValue:"2년"}, {item:"교육 이수기준 기간", wrongValue:"3년"}, {item:"제도 교육과정 이수시간", wrongValue:"8시간"}, {item:"제도 교육과정 이수시간", wrongValue:"16시간"}], basis: "AEO 고시 — 정기 자율평가서 확인 보세사 자격", type: "빈칸채우기" },
    { year: 2025, no: 9, concept: "공인 유보 업체의 개선계획서·완료보고서 제출기한 및 연장기간", correct: [{item:"개선계획서 제출기한(유보 결정일부터)", value:"30일"}, {item:"개선 완료보고서 제출기한(계획서 제출일부터)", value:"180일"}, {item:"재무건전성 사유 연장 한도", value:"1년 이내"}], distractors: [{item:"개선계획서 제출기한", wrongValue:"20일"}, {item:"개선계획서 제출기한", wrongValue:"50일"}, {item:"개선 완료보고서 제출기한", wrongValue:"90일"}, {item:"연장 한도", wrongValue:"2년"}], basis: "AEO 고시 — 공인 유보 개선절차", type: "빈칸채우기" },
    { year: 2025, no: 11, concept: "AEO 수출입관리책임자 부문별 근무경력 자격요건", correct: [{item:"중소 수출기업 수출관리책임자 경력", value:"1년 이상"}, {item:"관세사 통관업무 담당경력", value:"3년 이상"}], distractors: [{item:"보세운송 부문 관리책임자 경력(틀린 단정)", wrongValue:"2년 이상"}], basis: "AEO 고시 — 관리책임자 자격요건", type: "틀린것고르기" },
    { year: 2025, no: 13, concept: "AEO 갱신심사 등급하락 예상 시 개선계획·완료보고서 제출기한", correct: [{item:"개선계획 제출기한(개선요구일부터)", value:"30일"}, {item:"개선 완료보고서 제출기한(계획 제출일부터)", value:"90일"}, {item:"경미사항 완료보고서 제출기한(요구일부터)", value:"30일"}], distractors: [{item:"개선계획 제출기한", wrongValue:"20일"}, {item:"개선 완료보고서 제출기한", wrongValue:"60일"}, {item:"경미사항 완료보고서 제출기한", wrongValue:"60일"}], basis: "AEO 고시 — 갱신심사 결과 처리", type: "빈칸채우기" },
    { year: 2025, no: 14, concept: "선박용품 적재 관리 — 적재완료 보고시한 및 적재완료 기한", correct: [{item:"적재완료 후 완료보고 시한", value:"다음날 12시까지"}, {item:"적재허가 후 적재완료 기한", value:"7일 이내"}], distractors: [{item:"적재완료 기한(틀린 단정)", wrongValue:"15일 이내"}, {item:"조건부 하역 재적재 기한", wrongValue:"10일 이내"}, {item:"조건부 하역 적재기간 연장", wrongValue:"5월"}], basis: "선박용품 등 관리에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 21, concept: "항공기용품 외국용품 용도외 처분보고서 제출기한", correct: [{item:"용도외 처분보고서 제출기한(처분일부터)", value:"7일 이내"}], distractors: [{item:"제출기한(틀린 단정)", wrongValue:"10일 이내"}], basis: "항공기용품 등 관리에 관한 고시", type: "틀린것고르기" },
    { year: 2025, no: 22, concept: "선박용품 적재·환적·하선 절차의 기간요건(일수)", correct: [{item:"적재·환적 허가 후 적재완료 기한", value:"7일"}, {item:"단기 항행 특례 1회 항행일수", value:"7일"}, {item:"하선허가 후 보세구역 반입기한", value:"7일"}], distractors: [{item:"적재완료 기한", wrongValue:"10일"}, {item:"적재완료 기한", wrongValue:"15일"}, {item:"단기 항행 기준일수", wrongValue:"10일"}, {item:"하선 반입기한", wrongValue:"10일"}], basis: "선박용품 등 관리에 관한 고시", type: "빈칸채우기" }
  ]
};
