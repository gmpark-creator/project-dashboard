// 보세사 5과목(자율관리 및 관세벌칙) — '숫자' 집중 정리 데이터
// 박사 지시(2026-06-30): 4·1·2·3과목에 이어 5과목 숫자 선지·정답·오답을 한 카테고리로 모음.
// 출처: 5과목 2019~2025 7개년 기출(BOSESA_DATA_5_*)에서 숫자 변별 문항 전수 추출.
// ⚠️ 과목 편성 교차: 2019년 시험은 5과목=수출입안전관리(AEO)였고, 2020년부터 5과목=자율관리 및 관세벌칙.
//    파일(과목번호) 기준으로 일관 수록 → 2019 문항은 AEO 토픽(별도)으로 분리 표기.
// ⚠️ 학습 보조용. 법령·고시 개정분 있으니 시험 직전 최신 원문 확인 필수.
window.BOSESA_NUM5 = {
  subject: 5,
  subjectName: "자율관리 및 관세벌칙",
  updated: "2026-06-30",

  concepts: [
    {
      topic: "자율관리보세구역 — 자율점검표 · 장부",
      icon: "fa-clipboard-list",
      items: [
        { label: "자율점검표 작성·제출 — 회계연도 종료 후 경과", correct: "3개월", variants: ["1개월", "2개월"], basis: "자율관리 보세구역 운영에 관한 고시", years: [2021, 2023, 2024] },
        { label: "자율점검표 자체점검 후 제출기한", correct: "15일 이내", variants: ["7일", "10일", "20일"], note: "운영상황·재고조사 결과와 함께 제출 시 다음 해 2월말까지.", basis: "자율관리 보세구역 운영에 관한 고시", years: [2020, 2021, 2023, 2024] },
        { label: "반출입 화물 장부 보관기간", correct: "2년", variants: ["3년"], basis: "자율관리 보세구역 운영에 관한 고시", years: [2023, 2024, 2025] }
      ]
    },
    {
      topic: "자율관리보세구역 — 지정 · 갱신 · 정기감사",
      icon: "fa-arrows-rotate",
      items: [
        { label: "지정기간 갱신 신청·절차 안내 시기", correct: "⚠️ 연도별 상이: 만료 2개월 전 안내(2020) / 갱신신청 만료 1개월 전(2024)", variants: ["만료 3개월 전", "지정기간 1년·5년으로 단정"], note: "지정기간은 특허기간과 연계. 갱신신청은 만료 1개월 전.", basis: "자율관리 보세구역 운영에 관한 고시", years: [2020, 2024, 2025] },
        { label: "세관장 정기감사 횟수", correct: "연 1회(원칙)", variants: ["연 2회"], basis: "자율관리 보세구역 운영에 관한 고시", years: [2024] }
      ]
    },
    {
      topic: "보세사 — 결원·채용·등록취소·징계",
      icon: "fa-user-tie",
      items: [
        { label: "보세사 결원 시 다른 보세사 채용기한", correct: "⚠️ 연도별 상이: 2021 기출 1개월 / 2023 기출 2개월", variants: ["1개월", "2개월"], note: "원본 기출 표기가 연도별로 달라(2021#1은 원본 내부 불일치도 있음) — 최신 고시 확인 필요. 특허보세구역(2과목)은 2개월.", basis: "자율관리 보세구역·보세사제도 운영 고시", years: [2021, 2023] },
        { label: "보세사 채용·해고 시 세관장 신고기한", correct: "7일 이내", variants: [], basis: "자율관리 보세구역 운영에 관한 고시", years: [2021] },
        { label: "보세사 등록취소 후 재등록 제한기간", correct: "2년", variants: ["3년"], basis: "관세법·보세사제도 운영에 관한 고시", years: [2023, 2024, 2025] },
        { label: "보세사 징계 종류", correct: "3종(견책 / 6개월 이내 업무정지 / 등록취소)", variants: ["4종(견책·감봉·업무정지·등록취소)"], note: "'감봉'은 보세사 징계 종류가 아님.", basis: "보세사제도 운영에 관한 고시", years: [2025] },
        { label: "보세사징계위원회 의결기한", correct: "30일 이내(필요시 30일 연장)", variants: ["요구 1개월", "의결 2개월"], basis: "관세법 시행령", years: [2022] }
      ]
    },
    {
      topic: "경고처분 · 절차생략 정지",
      icon: "fa-triangle-exclamation",
      items: [
        { label: "절차생략 등 정지 발동 경고처분 누적 기준", correct: "1년에 3회 이상", variants: ["1년에 2회 이상", "최근 3년간 3회 이상"], basis: "자율관리 보세구역 운영에 관한 고시", years: [2022, 2025] },
        { label: "절차생략 등 정지기간", correct: "(원본 정답 수치 확인 필요)", variants: ["2개월", "3개월", "6개월 이내"], note: "오답 선지로 다양한 기간이 출제됨 — 정확한 정지기간은 최신 고시 확인.", basis: "자율관리 보세구역 운영에 관한 고시", years: [2022, 2025] }
      ]
    },
    {
      topic: "자유무역지역 — 통제시설 · 반입증명",
      icon: "fa-shield-halved",
      items: [
        { label: "검사대 동시 접속·검사 가능 차량", correct: "2대 이상", variants: ["1대 이상"], basis: "자유무역지역 반출입물품 관리 고시", years: [2020] },
        { label: "통제시설 출입기록 관리기간", correct: "90일", variants: ["60일"], note: "관리권자가 관세청장과 협의하여 통제시설 설치, 세관장 요청 시 기록 제공.", basis: "자유무역지역법", years: [2020] },
        { label: "내국물품 반입증명서류 보관기간", correct: "5년의 범위(대통령령으로 정하는 기간)", variants: ["3년"], basis: "자유무역지역법·시행령", years: [2021, 2022] }
      ]
    },
    {
      topic: "자유무역지역 — 보세운송 · 국외반출 · 과징금",
      icon: "fa-truck-arrow-right",
      items: [
        { label: "국외반출물품 보세운송기간·선(기)적 기한", correct: "각 30일 이내", variants: ["15일 이내", "20일 이내"], note: "부득이한 사유 시 6개월 범위 연장.", basis: "자유무역지역 반출입물품 관리 고시", years: [2023, 2024, 2025] },
        { label: "국외반출 선(기)적 기간연장 한도", correct: "6개월", variants: ["1개월", "3개월", "1년"], basis: "자유무역지역 반출입물품 관리 고시", years: [2023, 2024] },
        { label: "제조·가공물품의 타 자유무역지역 보세운송기간", correct: "7일(7일 범위 연장)", variants: ["14일·10일 연장"], basis: "자유무역지역 반출입물품 관리 고시", years: [2024, 2025] },
        { label: "반입정지 갈음 과징금 — 매출액 대비 한도 / 1일당", correct: "100분의 3 이하 / 1일당 6천분의 1", variants: ["100분의 2", "100분의 1", "4천분의 1", "3천분의 1", "5천분의 1"], basis: "자유무역지역법 제40조의2", years: [2024] }
      ]
    },
    {
      topic: "법규수행능력 평가",
      icon: "fa-chart-line",
      items: [
        { label: "수출입물류업체 법규수행능력 평가주기", correct: "연 1회(원칙)", variants: ["연 2회"], basis: "법규수행능력측정 및 평가관리 훈령", years: [2023, 2024] },
        { label: "신규업체 평가요청 — 보세구역·자유무역지역 설립 후 경과", correct: "6개월", variants: ["3개월", "12개월"], basis: "법규수행능력측정 및 평가관리 훈령", years: [2023, 2024] },
        { label: "신규업체 평가요청 — 운송사·선사·항공사·포워더 세관신고 건수", correct: "250건", variants: ["100건", "150건", "1,000건"], basis: "법규수행능력측정 및 평가관리 훈령", years: [2023, 2024] }
      ]
    },
    {
      topic: "통고처분",
      icon: "fa-stamp",
      items: [
        { label: "통고처분 면제 가능 벌금상당액 기준", correct: "30만원 이하", variants: ["50만원 미만"], note: "관세범칙조사심의위원회 심의. 벌금상당액 30만원 이하 시 통고처분 면제.", basis: "관세법 제311조", years: [2020] },
        { label: "통고처분 벌금상당액 기본 비율", correct: "벌금 최고액의 100분의 30", variants: ["100분의 20", "100분의 50"], basis: "관세법 시행령", years: [2022, 2023] },
        { label: "통고처분 벌금상당액 가감 한도", correct: "100분의 50", variants: ["100분의 30", "100분의 40"], basis: "관세법 시행령", years: [2022, 2023] },
        { label: "통고서 송달일부터 이행기한", correct: "15일", variants: ["20일"], basis: "관세법", years: [2023] }
      ]
    },
    {
      topic: "관세 벌칙 — 형량 · 벌금",
      icon: "fa-scale-balanced",
      items: [
        { label: "밀수입죄(제269조②)", correct: "5년 이하 징역 또는 관세액의 10배와 물품원가 중 높은 금액 이하 벌금", variants: ["징역 3년"], basis: "관세법 제269조", years: [2021, 2024] },
        { label: "밀수출·반송죄(제269조③)", correct: "3년 이하 징역", variants: ["1년 이하"], basis: "관세법 제269조", years: [2021] },
        { label: "관세포탈죄(제270조①)", correct: "3년 이하 징역 또는 포탈관세액의 5배와 물품원가 중 높은 금액 이하 벌금", variants: ["징역 5년", "징역 1년", "벌금 10배", "벌금 3배"], basis: "관세법 제270조", years: [2024, 2025] },
        { label: "가격조작죄(제270조의2)", correct: "2년 이하 징역 또는 5천만원 이하 벌금", variants: ["징역 3년", "벌금 3천만원"], basis: "관세법 제270조의2", years: [2022, 2025] },
        { label: "보세사 명의대여행위죄", correct: "1년 이하 징역 또는 1천만원 이하 벌금", variants: ["벌금 2천만·3천만원", "징역 2년·3년", "1천만원 이하 과태료"], basis: "관세법 제275조의3", years: [2021, 2024] },
        { label: "전자문서 위조·변조죄(제268조의2①)", correct: "1년 이상 10년 이하 징역 또는 1억원 이하 벌금", variants: [], basis: "관세법 제268조의2", years: [2022, 2024] },
        { label: "금지품 수출입죄(제269조①)", correct: "7년 이하 징역", variants: [], basis: "관세법 제269조 제1항", years: [2024] },
        { label: "유가증권 위조품 등 수출입죄 벌금 상한", correct: "7천만원 이하", variants: ["5천만원", "3천만원"], basis: "관세법", years: [2022, 2024] },
        { label: "예비·미수·방조(종범) 처벌", correct: "예비범=본죄의 2분의 1 감경 / 미수범·방조범=본죄(정범)에 준하여 처벌", variants: ["방조 2분의1 감경", "예비 본죄 준함", "미수 2분의1 감경"], basis: "관세법 제271조", years: [2025] }
      ]
    },
    {
      topic: "과태료",
      icon: "fa-receipt",
      items: [
        { label: "거짓 반입신고(물품 미반입, 제157조①) 과태료", correct: "200만원 이하", variants: ["500만원", "1천만원", "5천만원", "1억원"], basis: "관세법 제277조", years: [2024] },
        { label: "과태료 소멸시효", correct: "5년", variants: ["3년"], basis: "질서위반행위규제법", years: [2023] }
      ]
    },
    {
      topic: "⚠️ 2019 — 수출입안전관리(AEO) 편성",
      icon: "fa-clock-rotate-left",
      items: [
        { label: "공인유보업체 개선계획 / 완료보고서 제출", correct: "개선계획 지정일부터 30일 / 완료보고서 계획 제출일부터 180일", variants: ["재심사 3개월", "형사절차 6개월"], basis: "AEO 고시 (2019 5과목=AEO 편성)", years: [2019] },
        { label: "AEO 공인 서류심사 완료기한", correct: "신청서 접수일부터 60일 이내", variants: ["90일"], basis: "AEO 고시", years: [2019] },
        { label: "AEO 통관절차 특례(우대비율·적용기간)", correct: "50% / 50% / 8년 / 50%", variants: ["40%", "45%", "7년", "9년", "30%"], basis: "AEO 고시 별표", years: [2019] },
        { label: "AEO 재무건전성 부채비율 한도", correct: "동종업종 평균의 200% 이내", variants: ["300%", "150%"], basis: "AEO 고시", years: [2019] },
        { label: "AEO 관리책임자 변경보고·유효기간·종합심사", correct: "변경보고 30일 / 공인 유효기간 5년 / 종합심사 만료 6개월 전", variants: ["변경보고 약 47일(기한 초과)"], basis: "AEO 고시", years: [2019] }
      ]
    }
  ],

  questions: [
    // ── 2019 (수출입안전관리 AEO 편성) ──
    { year: 2019, no: 7, concept: "[AEO] 공인유보업체 개선계획·완료보고서 제출기한", correct: [{item:"개선계획 제출(지정일부터)", value:"30일 이내"}, {item:"완료보고서 제출(계획 제출일부터)", value:"180일 이내"}], distractors: [{item:"개선이행 후 재심사", wrongValue:"신청일부터 3개월 이내"}, {item:"형사절차 진행 시 심의상정", wrongValue:"현장심사 종료 후 6개월 초과"}], basis: "AEO 고시 (2019 5과목=AEO 편성)", type: "옳은것고르기" },
    { year: 2019, no: 12, concept: "[AEO] 공인 서류심사 완료기한", correct: [{item:"서류심사 완료(접수일부터)", value:"60일 이내"}], distractors: [{item:"완료기한", wrongValue:"90일 이내"}], basis: "AEO 고시", type: "틀린것고르기" },
    { year: 2019, no: 13, concept: "[AEO] 관리책임자 교육 주기·수출입관리책임자 자격", correct: [{item:"수출입관리책임자 자격", value:"수출입업무 3년 이상(중소 1년) 또는 보세사"}, {item:"공인 후 교육", value:"공인 후 1년 이내"}], distractors: [{item:"공인 후 교육 주기", wrongValue:"매년"}], basis: "AEO 고시", type: "틀린것고르기" },
    { year: 2019, no: 23, concept: "[AEO] 통관절차 특례(우대비율·적용기간)", correct: [{item:"①", value:"50%"}, {item:"②", value:"50%"}, {item:"③", value:"8년"}, {item:"④", value:"50%"}], distractors: [{item:"①", wrongValue:"40%"}, {item:"②", wrongValue:"45%"}, {item:"②", wrongValue:"40%"}, {item:"③", wrongValue:"7년"}, {item:"③", wrongValue:"9년"}, {item:"④", wrongValue:"40%"}, {item:"④", wrongValue:"30%"}], basis: "AEO 고시 별표", type: "빈칸채우기" },
    { year: 2019, no: 24, concept: "[AEO] 보세구역운영인 재무건전성 부채비율 한도", correct: [{item:"부채비율 한도", value:"동종업종 평균의 200% 이내"}], distractors: [{item:"부채비율", wrongValue:"300%"}, {item:"부채비율", wrongValue:"150%"}], basis: "AEO 고시", type: "빈칸채우기" },
    { year: 2019, no: 25, concept: "[AEO] 관리책임자 변경보고·유효기간·종합심사(사례)", correct: [{item:"수출입관리책임자 변경보고", value:"변경일부터 30일 이내"}, {item:"공인 유효기간", value:"5년"}, {item:"종합심사 신청", value:"만료 6개월 전까지"}], distractors: [{item:"사례 변경보고(교체 후)", wrongValue:"약 47일 후 보고(30일 초과)"}], basis: "AEO 고시", type: "틀린것고르기" },

    // ── 2020 (자율관리 및 관세벌칙) ──
    { year: 2020, no: 1, concept: "자율점검표 제출기한(회계연도 종료 3개월 후)", correct: [{item:"제출기한", value:"15일 이내"}], distractors: [{item:"제출기한", wrongValue:"20일 이내"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2020, no: 5, concept: "자율관리보세구역 갱신 안내 통지 시기", correct: [{item:"갱신 안내 통지", value:"지정기간 만료 2개월 전"}], distractors: [{item:"안내 통지", wrongValue:"1개월 전"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2020, no: 11, concept: "자유무역지역 시설통제 — 검사대 동시 접속·검사 차량", correct: [{item:"검사대 동시 차량", value:"2대 이상"}], distractors: [{item:"차량", wrongValue:"1대 이상"}], basis: "자유무역지역 반출입물품 관리 고시", type: "틀린것고르기" },
    { year: 2020, no: 13, concept: "자유무역지역 통제시설 출입기록 관리기간", correct: [{item:"출입기록 관리기간", value:"90일"}], distractors: [{item:"관리기간", wrongValue:"60일"}], basis: "자유무역지역법", type: "빈칸채우기" },
    { year: 2020, no: 17, concept: "통고처분 면제 가능 벌금상당액 기준", correct: [{item:"통고처분 면제 기준", value:"30만원 이하"}], distractors: [{item:"기준", wrongValue:"50만원 미만"}, {item:"벌금상당액 비율", wrongValue:"벌금 최고액의 100분의 10"}], basis: "관세법 제311조", type: "옳은것고르기" },

    // ── 2021 ──
    { year: 2021, no: 1, concept: "보세사 결원 시 채용기한·신고기한", correct: [{item:"다른 보세사 채용기한", value:"1개월 이내(2021 기출)"}, {item:"채용·해고 신고기한", value:"7일 이내"}], distractors: [{item:"채용기한", wrongValue:"2개월 이내"}], basis: "자율관리 보세구역 운영에 관한 고시 (※2023 기출은 2개월·원본 불일치)", type: "틀린것고르기" },
    { year: 2021, no: 4, concept: "자율점검표 작성·제출 기한", correct: [{item:"회계연도 종료 후 경과", value:"3개월"}, {item:"자체점검 후 제출", value:"15일 이내"}, {item:"함께 제출 시", value:"다음 해 2월말"}], distractors: [{item:"경과기간", wrongValue:"1개월"}, {item:"제출기한", wrongValue:"7일"}, {item:"제출기한", wrongValue:"10일"}, {item:"함께 제출", wrongValue:"다음 해 1월말"}, {item:"함께 제출", wrongValue:"다음 해 3월말"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "빈칸채우기" },
    { year: 2021, no: 10, concept: "자유무역지역 내국물품 반입증명서류 보관기간", correct: [{item:"반입증명서류 보관기간", value:"5년의 범위(대통령령)"}], distractors: [{item:"보관기간", wrongValue:"3년 이내의 범위"}], basis: "자유무역지역법·시행령", type: "틀린것고르기" },
    { year: 2021, no: 16, concept: "보세사 명의대여죄 법정형", correct: [{item:"징역", value:"1년 이하"}, {item:"벌금", value:"1천만원 이하"}], distractors: [{item:"벌금", wrongValue:"2천만원 이하"}, {item:"징역", wrongValue:"2년 이하"}, {item:"징역", wrongValue:"3년 이하"}, {item:"벌금", wrongValue:"3천만원 이하"}], basis: "관세법 제275조의3", type: "옳은것고르기" },
    { year: 2021, no: 22, concept: "밀수출입죄(제269조) 법정형", correct: [{item:"무신고 수입 징역", value:"5년 이하"}, {item:"무신고 수입 벌금", value:"관세액의 10배와 물품원가 중 높은 금액"}, {item:"무신고 수출 징역", value:"3년 이하"}, {item:"무신고 반송 징역", value:"3년 이하"}], distractors: [{item:"무신고 반송 징역", wrongValue:"1년 이하"}], basis: "관세법 제269조", type: "틀린것고르기" },

    // ── 2022 ──
    { year: 2022, no: 3, concept: "경고처분 누적에 따른 절차생략 정지 발동기준", correct: [{item:"절차생략 정지 경고처분 누적", value:"1년에 3회 이상"}], distractors: [{item:"경고처분 누적", wrongValue:"1년에 2회 이상"}, {item:"정지기간 상한", wrongValue:"2개월"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2022, no: 5, concept: "자율관리보세구역 지정기간·보세사 부재 시 정지(오답 수치)", correct: [], distractors: [{item:"지정기간", wrongValue:"지정일로부터 5년"}, {item:"보세사 부재 시 정지", wrongValue:"3개월 이내"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2022, no: 6, concept: "보세사징계위원회 의결기한·등록취소 기준", correct: [{item:"징계위원회 의결기한", value:"30일 이내(30일 연장)"}], distractors: [{item:"징계의결 요구", wrongValue:"1개월 이내"}, {item:"의결기한", wrongValue:"2개월 내"}, {item:"등록취소 기준", wrongValue:"연간 6월 범위 업무정지 3회"}], basis: "관세법 시행령", type: "옳은것고르기" },
    { year: 2022, no: 15, concept: "자유무역지역 내국물품 반입증명서류 보관기간", correct: [{item:"반입증명서류 보관기간", value:"5년"}], distractors: [{item:"보관기간", wrongValue:"3년"}], basis: "자유무역지역법·반출입물품 관리 고시", type: "옳은것고르기" },
    { year: 2022, no: 24, concept: "관세법 벌칙 법정형(형량·벌금)", correct: [{item:"위조품 등 밀수입죄 벌금 상한", value:"7천만원 이하"}, {item:"부정수출죄 징역", value:"1년 이하"}, {item:"가격조작죄 징역", value:"2년 이하"}, {item:"전자문서 위조·변조죄", value:"1년 이상 10년 이하 징역 또는 1억원 이하 벌금"}], distractors: [{item:"위조품 밀수입죄 벌금", wrongValue:"5천만원 이하"}, {item:"부정수출죄 징역", wrongValue:"2년 이하"}, {item:"부정 적하목록 작성·제출죄 벌금", wrongValue:"3천만원 이하"}, {item:"가격조작죄 징역", wrongValue:"3년 이하"}], basis: "관세법 제268조의2·제269조·제270조의2", type: "옳은것고르기" },
    { year: 2022, no: 25, concept: "통고처분 벌금상당액 기본 비율·가산 한도", correct: [{item:"기본 비율(벌금 최고액의)", value:"100분의 30"}, {item:"가산 한도", value:"100분의 50"}], distractors: [{item:"기본 비율", wrongValue:"100분의 20"}, {item:"기본 비율", wrongValue:"100분의 50"}, {item:"가산 한도", wrongValue:"100분의 30"}, {item:"가산 한도", wrongValue:"100분의 40"}], basis: "관세법 시행령·제311조", type: "빈칸채우기" },

    // ── 2023 ──
    { year: 2023, no: 2, concept: "자율관리보세구역 운영인 의무 관련 기간", correct: [{item:"보세사 재채용 기한", value:"2개월 이내"}, {item:"자율점검표 제출(종료 3개월 후)", value:"15일 이내"}, {item:"반출입 화물 장부 보관", value:"2년"}, {item:"함께 제출 시", value:"다음 해 2월말"}], distractors: [{item:"보세사 채용기한", wrongValue:"1개월 이내"}, {item:"자체점검 시기", wrongValue:"종료 2개월 후 15일 이내"}, {item:"장부 보관", wrongValue:"3년"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2023, no: 3, concept: "자율관리보세구역 지정취소 의견청취 통지기한", correct: [{item:"의견청취 통지", value:"예정일 10일 전까지"}], distractors: [{item:"통지기한", wrongValue:"예정일 5일 전까지"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "틀린것고르기" },
    { year: 2023, no: 4, concept: "보세사 등록취소 후 재등록 제한기간", correct: [{item:"재등록 제한기간", value:"2년"}], distractors: [{item:"제한기간", wrongValue:"3년"}], basis: "보세사제도 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2023, no: 7, concept: "법규수행능력 평가주기·신규업체 평가요청 기준", correct: [{item:"평가주기", value:"연 1회"}, {item:"보세구역·FTZ 설립 후 경과", value:"6개월"}, {item:"세관신고 건수(운송사·선사 등)", value:"250건"}], distractors: [{item:"평가주기", wrongValue:"연 2회"}, {item:"설립 후 경과", wrongValue:"3개월"}, {item:"설립 후 경과", wrongValue:"12개월"}, {item:"세관신고 건수", wrongValue:"1,000건"}], basis: "법규수행능력측정 및 평가관리 훈령", type: "빈칸채우기" },
    { year: 2023, no: 10, concept: "국외반출물품 보세운송기간·선기적 기한·연장한도", correct: [{item:"보세운송기간(신고수리일부터)", value:"30일 이내"}, {item:"선(기)적 기한(국외반출신고 수리일부터)", value:"30일 이내"}, {item:"부득이한 사유 연장 한도", value:"6개월"}], distractors: [{item:"보세운송기간", wrongValue:"15일 이내"}, {item:"선기적 기한", wrongValue:"15일 이내"}, {item:"연장 한도", wrongValue:"1개월"}, {item:"연장 한도", wrongValue:"3개월"}], basis: "자유무역지역 반출입물품 관리 고시", type: "빈칸채우기" },
    { year: 2023, no: 17, concept: "질서위반행위규제법상 과태료 소멸시효", correct: [{item:"과태료 소멸시효", value:"5년"}], distractors: [{item:"소멸시효", wrongValue:"3년"}], basis: "질서위반행위규제법", type: "틀린것고르기" },
    { year: 2023, no: 20, concept: "통고처분 벌금상당액 비율·이행기한", correct: [{item:"벌금 상당 금액(벌금 최고액의)", value:"100분의 30"}, {item:"가감 범위", value:"100분의 50"}, {item:"통고서 송달일부터 이행기한", value:"15일"}], distractors: [{item:"이행기한", wrongValue:"20일"}], basis: "관세법 시행령·제311조", type: "옳은것고르기" },

    // ── 2024 ──
    { year: 2024, no: 2, concept: "자율점검표 제출시기·장부 보관기간", correct: [{item:"회계연도 종료 후 경과", value:"3개월"}, {item:"세관장 제출기한", value:"15일 이내"}, {item:"반출입화물 장부 보관", value:"2년"}], distractors: [{item:"경과기간", wrongValue:"2개월"}, {item:"제출기한", wrongValue:"10일"}, {item:"장부 보관", wrongValue:"3년"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "빈칸채우기" },
    { year: 2024, no: 4, concept: "자율관리보세구역 갱신 신청기한·정기감사 횟수", correct: [{item:"지정기간 갱신 신청", value:"만료 1개월 전"}, {item:"정기감사 횟수", value:"연 1회(원칙)"}], distractors: [{item:"갱신 신청", wrongValue:"만료 2개월 전"}, {item:"정기감사", wrongValue:"연 2회"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2024, no: 6, concept: "보세사 등록취소 후 재등록 제한기간", correct: [{item:"재등록 제한기간", value:"2년"}], distractors: [{item:"제한기간", wrongValue:"3년"}], basis: "보세사제도 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2024, no: 8, concept: "신규 수출입물류업체 법규수행능력 평가요청 기준", correct: [{item:"설립 후 경과", value:"6개월"}, {item:"세관신고 건수", value:"250건 이상"}, {item:"평가 주기", value:"연 1회"}], distractors: [{item:"설립 후 경과", wrongValue:"3개월"}, {item:"세관신고 건수", wrongValue:"100건"}, {item:"세관신고 건수", wrongValue:"150건"}], basis: "법규수행능력측정 및 평가관리 훈령", type: "빈칸채우기" },
    { year: 2024, no: 9, concept: "자유무역지역 국외반출 선기적 기간·연장한도", correct: [{item:"국외반출 선(기)적 기간", value:"30일 이내"}, {item:"기간연장 한도", value:"6개월 범위"}], distractors: [{item:"기간연장 한도", wrongValue:"1년"}], basis: "자유무역지역 반출입물품 관리 고시", type: "옳은것고르기" },
    { year: 2024, no: 10, concept: "자유무역지역 반입정지 갈음 과징금(매출액 한도·1일당)", correct: [{item:"매출액 대비 과징금 한도", value:"100분의 3 이하"}, {item:"1일당 과징금(연간 매출액 기준)", value:"6천분의 1"}], distractors: [{item:"매출액 한도", wrongValue:"100분의 2"}, {item:"매출액 한도", wrongValue:"100분의 1"}, {item:"1일당", wrongValue:"4천분의 1"}, {item:"1일당", wrongValue:"3천분의 1"}, {item:"1일당", wrongValue:"5천분의 1"}], basis: "자유무역지역법 제40조의2", type: "빈칸채우기" },
    { year: 2024, no: 15, concept: "자유무역지역 제조·가공물품 타FTZ 보세운송·국외반출 기간", correct: [{item:"제조·가공물품 타 FTZ 보세운송", value:"7일(7일 범위 연장)"}, {item:"국외반출 수리물품 보세운송·선기적", value:"30일 이내"}], distractors: [{item:"국외반출 보세운송·선기적", wrongValue:"20일 이내"}], basis: "자유무역지역 반출입물품 관리 고시", type: "옳은것고르기" },
    { year: 2024, no: 16, concept: "관세법 벌칙 법정형(위조품 벌금·밀수입 징역·관세포탈 배수)", correct: [{item:"유가증권 위조품등 수출입죄 벌금", value:"7천만원 이하"}, {item:"밀수입죄 징역", value:"5년 이하"}, {item:"관세포탈죄 벌금 배수", value:"포탈관세액의 5배"}], distractors: [{item:"위조품 벌금", wrongValue:"5천만원"}, {item:"위조품 벌금", wrongValue:"3천만원"}, {item:"밀수입 징역", wrongValue:"3년"}, {item:"관세포탈 배수", wrongValue:"3배"}], basis: "관세법 제269조·제270조", type: "빈칸채우기" },
    { year: 2024, no: 19, concept: "보세사 명의대여행위죄 법정형", correct: [{item:"징역", value:"1년 이하"}, {item:"벌금", value:"1천만원 이하"}], distractors: [{item:"벌금", wrongValue:"3천만원 이하"}, {item:"징역", wrongValue:"3년 이하"}, {item:"처벌", wrongValue:"1천만원 이하 과태료"}], basis: "관세법 제275조의3", type: "기타" },
    { year: 2024, no: 23, concept: "통고처분 면제 기준액(오답 수치)", correct: [], distractors: [{item:"벌금 상당 금액 기준", wrongValue:"50만원 이하"}, {item:"몰수물품 가액+추징금 합산", wrongValue:"150만원 이하"}], basis: "관세법 제311조 제8항", type: "옳은것고르기" },
    { year: 2024, no: 24, concept: "관세법 범죄별 징역형 상한 비교(최고형 판별)", correct: [{item:"전자문서 위조·변조죄", value:"1년 이상 10년 이하"}, {item:"금지품수출입죄", value:"7년 이하"}, {item:"밀수입죄", value:"5년 이하"}, {item:"강제징수면탈죄 등", value:"3년 이하"}, {item:"밀수품 취득죄 등", value:"3년 이하"}], distractors: [], basis: "관세법 제268조의2·제269조·제275조의2·제274조", type: "기타" },
    { year: 2024, no: 25, concept: "거짓 반입신고(제157조①) 과태료", correct: [{item:"과태료 상한", value:"200만원 이하"}], distractors: [{item:"과태료", wrongValue:"500만원 이하"}, {item:"과태료", wrongValue:"1천만원 이하"}, {item:"과태료", wrongValue:"5천만원 이하"}, {item:"과태료", wrongValue:"1억원 이하"}], basis: "관세법 제277조", type: "기타" },

    // ── 2025 ──
    { year: 2025, no: 2, concept: "자율관리보세구역 반출입 화물 장부 보관기간", correct: [{item:"장부 보관기간", value:"2년"}], distractors: [{item:"보관기간", wrongValue:"3년"}, {item:"자율점검표 제출시기", wrongValue:"매년 2월말"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 3, concept: "자율관리보세구역 지정기간·갱신신청·안내 시기(오답 수치)", correct: [], distractors: [{item:"지정기간", wrongValue:"1년"}, {item:"갱신신청 시기", wrongValue:"기간만료 3개월 전"}, {item:"갱신절차 안내", wrongValue:"만료 1개월 전"}], basis: "자율관리 보세구역 운영에 관한 고시 (지정기간=특허기간 연계)", type: "옳은것고르기" },
    { year: 2025, no: 5, concept: "자율점검표 제출시기·정기감사 운영(오답 수치)", correct: [], distractors: [{item:"재고조사 결과와 함께 제출", wrongValue:"종료 3개월 후 15일 이내"}, {item:"정기감사 설정기간·횟수", wrongValue:"10일 이내·연 1회"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 6, concept: "경고처분 누적 절차생략 정지(오답 수치)", correct: [], distractors: [{item:"누적 경고처분 기준", wrongValue:"최근 3년간 3회 이상"}, {item:"절차생략 정지기간", wrongValue:"6개월 이내"}], basis: "자율관리 보세구역 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 8, concept: "보세사 등록취소 후 재등록 제한기간·징계 종류", correct: [{item:"재등록 제한기간", value:"2년"}, {item:"보세사 징계 종류", value:"3종(견책·6개월 이내 업무정지·등록취소)"}], distractors: [{item:"재등록 제한", wrongValue:"3년"}, {item:"징계 종류", wrongValue:"4종(견책·감봉·업무정지·등록취소)"}], basis: "관세법·보세사제도 운영에 관한 고시", type: "옳은것고르기" },
    { year: 2025, no: 14, concept: "자유무역지역 제조·가공물품 보세운송·장치·반출기한(오답 수치)", correct: [], distractors: [{item:"보세운송 기간·연장", wrongValue:"14일·10일 이내 연장"}, {item:"외국물품 장치기간·반출기한", wrongValue:"2개월·30일 이내"}], basis: "자유무역지역법·관련 고시", type: "옳은것고르기" },
    { year: 2025, no: 21, concept: "밀수입죄 예비·미수·방조 처벌 수준", correct: [{item:"예비범", value:"본죄의 2분의 1 감경"}, {item:"미수범·방조범(종범)", value:"본죄(정범)에 준하여 처벌"}], distractors: [{item:"방조범", wrongValue:"본죄의 2분의 1 감경"}, {item:"예비범", wrongValue:"본죄에 준하여 처벌"}, {item:"미수범", wrongValue:"본죄의 2분의 1 감경"}], basis: "관세법 제269조·제271조", type: "옳은것고르기" },
    { year: 2025, no: 22, concept: "가격조작죄(제270조의2) 벌금 기준금액", correct: [{item:"벌금 기준금액", value:"5천만원"}], distractors: [{item:"벌금 기준금액", wrongValue:"3천만원"}], basis: "관세법 제270조의2", type: "빈칸채우기" },
    { year: 2025, no: 24, concept: "관세포탈죄(제270조①) 법정형", correct: [{item:"징역 상한", value:"3년 이하"}, {item:"벌금", value:"포탈관세액의 5배와 물품원가 중 높은 금액"}], distractors: [{item:"징역", wrongValue:"5년 이하"}, {item:"징역", wrongValue:"1년 이하"}, {item:"벌금 배수", wrongValue:"10배"}], basis: "관세법 제270조 제1항", type: "기타" }
  ]
};
