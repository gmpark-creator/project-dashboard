/* Paralex set · set-biz-013 · 자체작성(original) · documents[]/라우팅 계약 미러링.
   토익 Part7 비즈니스 이메일(email) 장르 모사. 백지 신규 창작. 주제: 사무용품 공급업체 변경·주문 절차 안내.
   ★ functionLabel 미사용(디렉터 지시: 구조 힌트 제거, 단일 지문처럼 읽히게). */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-013"] = {
  id: "biz-013",
  setKind: "set",
  track: "business",
  genre: "email",
  scoreBandTarget: "750-800",
  difficultyRank: 2,
  partFocus: ["Part7"],
  skillFocus: ["purpose", "scanning", "paraphrase"],
  trapFocus: ["not_mentioned", "opposite", "wrong_referent"],
  vocabBand: "TSL",
  targetTimeSec: 180,
  title: "Email: New Office-Supplies Supplier and Ordering Procedure",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 159,
  passage: {
    documents: [
      { id: "d1", label: "Email", paragraphs: [
        { id: "d1p1", chunks: [
          { en: "Dear colleagues,", ko: "동료 여러분께,", note: "이메일 호칭" },
          { en: "Beginning Monday, October 6, our office will order all stationery and supplies", ko: "10월 6일 월요일부터 우리 사무실은 모든 문구류와 비품을 주문할 것입니다", note: "beginning + 날짜: ~일부터 시작하여" },
          { en: "from Cedarline Office Products", ko: "시더라인 오피스 프로덕츠로부터", note: "신규 공급업체명(가공)" },
          { en: "rather than from our previous vendor, Penrose Stationery.", ko: "기존 공급업체인 펜로즈 스테이셔너리 대신.", note: "rather than: ~ 대신에 / previous vendor: 기존 공급업체" },
          { en: "The change was made to secure lower prices and quicker delivery for every department.", ko: "이번 변경은 전 부서에 더 낮은 가격과 더 빠른 배송을 확보하기 위해 이루어졌습니다.", note: "secure lower prices: 더 낮은 가격을 확보하다" }
        ]},
        { id: "d1p2", chunks: [
          { en: "Under the new system, staff must place orders through the Cedarline portal", ko: "새 시스템에서는 직원들이 시더라인 포털을 통해 주문해야 합니다", note: "place an order: 주문하다 / through the portal: 포털을 통해" },
          { en: "linked on the Office Services page of the intranet.", ko: "인트라넷의 사무지원팀 페이지에 연결된.", note: "linked on: ~에 연결된" },
          { en: "Each request must first be approved by your team manager", ko: "각 요청은 먼저 팀 매니저의 승인을 받아야 합니다", note: "be approved by: ~의 승인을 받다" },
          { en: "before it is sent to the supplier.", ko: "공급업체로 전송되기 전에.", note: "before + 절: ~하기 전에" },
          { en: "Orders submitted by noon on a weekday will arrive within two business days.", ko: "평일 정오까지 제출된 주문은 영업일 기준 이틀 이내에 도착합니다.", note: "by noon: 정오까지 / within two business days: 영업일 이틀 이내" }
        ]},
        { id: "d1p3", chunks: [
          { en: "Our account with Penrose Stationery will be closed on Friday, October 3,", ko: "펜로즈 스테이셔너리와의 거래 계정은 10월 3일 금요일에 닫힙니다,", note: "account will be closed: 계정이 폐쇄되다" },
          { en: "so any items still needed from Penrose should be requested before that date.", ko: "따라서 펜로즈에서 여전히 필요한 품목은 그 날짜 전에 요청해야 합니다.", note: "before that date: 그 날짜 이전에" },
          { en: "Please note that personal purchases cannot be charged to the company account.", ko: "개인 구매는 회사 계정으로 청구될 수 없음을 유의해 주십시오.", note: "be charged to: ~로 청구되다" },
          { en: "If you have trouble accessing the new portal, please contact Mr. Tomas Halvey at extension 318.", ko: "새 포털 접속에 문제가 있으면 내선 318번 토마스 핼비 씨에게 연락 바랍니다.", note: "have trouble -ing: ~하는 데 어려움을 겪다 / extension: 내선번호" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "rather than from our previous vendor, Penrose Stationery", note: "rather than: 두 대상을 대조. 'A from X rather than from Y' = Y가 아니라 X에서" },
    { span: "Each request must first be approved by your team manager before it is sent", note: "수동태 must be approved + before절: 주문 처리의 선후 절차를 명시" },
    { span: "any items still needed from Penrose should be requested before that date", note: "so 결과절 + should: 계정 폐쇄일이라는 원인에서 도출된 행동 요구" }
  ],
  vocabulary: [
    { lemma: "supplier", pos: "n.", glossKo: "공급업체", collocation: "switch to a new supplier", listTag: "TSL" },
    { lemma: "vendor", pos: "n.", glossKo: "판매처, 공급업체", collocation: "previous vendor", listTag: "TSL" },
    { lemma: "place an order", pos: "phr.", glossKo: "주문하다", collocation: "place orders through a portal", listTag: "TSL" },
    { lemma: "approve", pos: "v.", glossKo: "승인하다", collocation: "be approved by a manager", listTag: "NGSL2k" },
    { lemma: "charge to", pos: "phr.", glossKo: "~ 앞으로 청구하다", collocation: "charged to the company account", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p2", original: "Each request must first be approved by your team manager before it is sent to the supplier",
      paraphrase: "a team manager has to sign off on every order before it reaches the supplier" },
    { sourceSpanId: "d1p1", original: "The change was made to secure lower prices and quicker delivery",
      paraphrase: "the new supplier was chosen because it costs less and ships faster" },
    { sourceSpanId: "d1p3", original: "any items still needed from Penrose should be requested before that date",
      paraphrase: "staff must order anything remaining from Penrose before the account closes" }
  ],
  questions: [
    { no: 1, stem: "Why was the email sent?",
      choices: [
        { label: "A", text: "To inform staff about a new supplier and ordering procedure." },
        { label: "B", text: "To collect employee feedback on the current stationery vendor." },
        { label: "C", text: "To warn departments about an upcoming rise in supply costs." },
        { label: "D", text: "To introduce a newly hired Office Services manager." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1", "d1p2"],
      skillFocus: ["purpose"], trapFocus: ["not_mentioned", "opposite"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "공급업체에 대한 의견 수집·설문은 지문에 전혀 없음 — 통보만 함." },
        { label: "C", type: "opposite", note: "d1p1은 'lower prices'(더 낮은 가격) 확보가 목적이라 명시 — 비용 인상 경고는 정반대." },
        { label: "D", type: "wrong_referent", note: "토마스 핼비 씨는 포털 접속 문의 담당으로만 등장 — 신규 매니저 소개가 아님." }
      ],
      explanation: "d1p1의 공급업체 변경 통보와 d1p2의 새 주문 절차 안내가 결합해 '신규 공급업체·주문 절차 안내'가 목적임을 명시. A가 정답." },
    { no: 2, stem: "According to the email, what must happen before an order is sent to the supplier?",
      choices: [
        { label: "A", text: "It must be approved by the employee's team manager." },
        { label: "B", text: "It must be paid for using a personal account." },
        { label: "C", text: "It must be delivered to the Office Services page in person." },
        { label: "D", text: "It must be confirmed by Mr. Tomas Halvey." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "d1p3은 '개인 구매는 회사 계정으로 청구 불가'라고만 함 — 주문을 개인 계정으로 결제하라는 절차가 아님." },
        { label: "C", type: "not_mentioned", note: "직접 방문·서류 전달 절차는 지문에 없음 — 인트라넷 포털 주문만 안내." },
        { label: "D", type: "wrong_referent", note: "핼비 씨는 포털 '접속 문제' 연락처일 뿐 주문 승인자가 아님." }
      ],
      explanation: "d1p2: 'Each request must first be approved by your team manager before it is sent to the supplier'. A가 정답." },
    { no: 3, stem: "What is indicated about Penrose Stationery?",
      choices: [
        { label: "A", text: "It offers lower prices than Cedarline Office Products." },
        { label: "B", text: "It will operate the company's new ordering portal." },
        { label: "C", text: "Items must be requested from it before October 3." },
        { label: "D", text: "It will keep delivering supplies until October 6." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["paraphrase"], trapFocus: ["opposite", "chronology"],
      distractorRationales: [
        { label: "A", type: "opposite", note: "d1p1은 변경 이유가 '더 낮은 가격' 확보라고 함 — 펜로즈가 더 싸다는 진술과 반대." },
        { label: "B", type: "wrong_referent", note: "새 포털은 시더라인 포털 — 펜로즈가 아니라 신규 업체가 운영." },
        { label: "D", type: "chronology", note: "펜로즈 계정은 10월 3일 폐쇄 — 10월 6일까지 배송 지속은 날짜를 뒤섞은 오답." }
      ],
      explanation: "d1p3: 'Our account with Penrose ... closed on October 3, so any items still needed from Penrose should be requested before that date'를 'requested ... before October 3'으로 패러프레이즈. C가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 이메일" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 근거로 유일 정답 도출" },
    distractor: { pass: true, reviewer: "Claude", note: "모든 오답 라벨에 타입태그·근거 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 email — 목적/세부(scanning)/패러프레이즈, 공급업체 변경 안내 상황 모사" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "목적 문항(1번)에서 'lower prices' 같은 지문 단어를 뒤집은 반대(opposite) 오답에 끌리지 않았는가?",
    "3번처럼 두 날짜(10/3 계정폐쇄·10/6 신규시작)가 섞일 때 각 날짜가 어느 업체·사건에 걸리는지 분리했는가?"
  ],
  version: "2026-06-30"
};
