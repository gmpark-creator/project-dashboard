/* Paralex set · set-biz-009 · 자체작성(original) · documents[]/라우팅 계약 미러링.
   토익 Part7 비즈니스 이메일 장르 모사. 백지 신규 창작. 주제: 신규 경비 정산 절차 안내. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-009"] = {
  id: "biz-009",
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
  title: "Email: New Expense Reimbursement Procedure",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 148,
  passage: {
    documents: [
      { id: "d1", label: "Email", paragraphs: [
        { id: "d1p1", functionLabel: "수신/목적", chunks: [
          { en: "To: All Staff / From: Finance Department / Subject: Updated Expense Reimbursement Process.", ko: "수신: 전 직원 / 발신: 재무부 / 제목: 변경된 경비 정산 절차.", note: "이메일 헤더" },
          { en: "We are writing to let you know", ko: "알려드리고자 이 글을 씁니다", note: "be writing to: ~하려고 씁니다(목적)" },
          { en: "that the company will introduce a new way", ko: "회사가 새로운 방식을 도입할 것임을", note: "introduce a new way: 새 방식 도입" },
          { en: "to claim work-related expenses,", ko: "업무 관련 경비를 청구하는,", note: "claim expenses: 경비를 청구하다" },
          { en: "starting on Monday, August 4.", ko: "8월 4일 월요일부터.", note: "starting on + 날짜: ~부터 시작" }
        ]},
        { id: "d1p2", functionLabel: "절차안내", chunks: [
          { en: "From that date, all receipts must be uploaded", ko: "그 날짜부터, 모든 영수증은 업로드되어야 합니다", note: "must be uploaded: 수동태 의무" },
          { en: "to the online portal at expenses.company.com.", ko: "온라인 포털 expenses.company.com에.", note: "to the portal: 포털로" },
          { en: "Paper forms will no longer be accepted.", ko: "종이 양식은 더 이상 접수되지 않습니다.", note: "no longer: 더 이상 ~않다" },
          { en: "Each request should include the date, amount, and a short reason", ko: "각 요청에는 날짜, 금액, 그리고 짧은 사유가 포함되어야 합니다", note: "should include: 포함해야 한다" },
          { en: "so that the finance team can approve it quickly.", ko: "그래야 재무팀이 빠르게 승인할 수 있도록.", note: "so that: ~하도록(목적)" }
        ]},
        { id: "d1p3", functionLabel: "마감/문의/맺음", chunks: [
          { en: "Approved payments will be added to your monthly salary,", ko: "승인된 지급액은 당신의 월급에 더해집니다,", note: "be added to: ~에 더해지다" },
          { en: "usually within two weeks.", ko: "보통 2주 이내에.", note: "within: ~이내에" },
          { en: "If you have any questions about the new steps,", ko: "새 절차에 대해 궁금한 점이 있으시면,", note: "if 조건절" },
          { en: "please email the Finance Department before July 31.", ko: "7월 31일 전에 재무부로 이메일을 보내 주십시오.", note: "before + 날짜: ~전에" },
          { en: "Thank you for helping us make this change smooth.", ko: "이 변화를 매끄럽게 만드는 데 도움 주셔서 감사합니다.", note: "make + 목적어 + 형용사" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "all receipts must be uploaded to the online portal", note: "must be + 과거분사 = 수동태 의무. '~되어야 한다'" },
    { span: "Paper forms will no longer be accepted", note: "no longer = 더 이상 ~않다. 옛 방식 폐지를 알리는 빈출 표현" },
    { span: "so that the finance team can approve it quickly", note: "so that + 주어 + can: 목적('~할 수 있도록')" }
  ],
  vocabulary: [
    { lemma: "reimbursement", pos: "n.", glossKo: "(경비) 정산, 환급", collocation: "expense reimbursement process", listTag: "BSL" },
    { lemma: "claim", pos: "v.", glossKo: "(비용을) 청구하다", collocation: "claim work-related expenses", listTag: "TSL" },
    { lemma: "receipt", pos: "n.", glossKo: "영수증", collocation: "upload the receipt", listTag: "NGSL2k" },
    { lemma: "approve", pos: "v.", glossKo: "승인하다", collocation: "approve the request", listTag: "TSL" },
    { lemma: "no longer", pos: "phr.", glossKo: "더 이상 ~않다", collocation: "no longer be accepted", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p2", original: "all receipts must be uploaded to the online portal",
      paraphrase: "every receipt has to be submitted through the website" },
    { sourceSpanId: "d1p2", original: "Paper forms will no longer be accepted",
      paraphrase: "the company will stop taking printed forms" },
    { sourceSpanId: "d1p3", original: "Approved payments will be added to your monthly salary",
      paraphrase: "money that is approved will be paid with your regular wages" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the email?",
      choices: [
        { label: "A", text: "To announce a change in how expenses are claimed." },
        { label: "B", text: "To explain a new salary pay scale." },
        { label: "C", text: "To invite staff to a finance training class." },
        { label: "D", text: "To report a problem with the online portal." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "B", type: "partial_truth", note: "월급(salary)이 d1p3에 언급되지만 지급 방식일 뿐, '새 급여 체계'는 지문에 없는 과장." },
        { label: "C", type: "not_mentioned", note: "교육·연수 초대 언급 없음." },
        { label: "D", type: "not_mentioned", note: "포털 오류 보고는 지문에 없음 — 포털은 새 제출 수단으로만 등장." }
      ],
      explanation: "d1p1: 'introduce a new way to claim work-related expenses'가 목적을 명시. A가 정답." },
    { no: 2, stem: "According to the email, what must employees do starting August 4?",
      choices: [
        { label: "A", text: "Submit paper expense forms to Finance." },
        { label: "B", text: "Upload their receipts to the online portal." },
        { label: "C", text: "Pick up their salary in person." },
        { label: "D", text: "Visit the Finance Department in person." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "opposite", note: "d1p2는 종이 양식이 '더 이상 접수되지 않는다'고 함 — 정반대." },
        { label: "C", type: "not_mentioned", note: "급여를 직접 수령한다는 언급 없음 — 월급에 더해 지급." },
        { label: "D", type: "wrong_referent", note: "직접 방문이 아니라 이메일/포털을 쓰라고 안내." }
      ],
      explanation: "d1p2: 'all receipts must be uploaded to the online portal'. B가 정답." },
    { no: 3, stem: "When are approved expenses usually paid?",
      choices: [
        { label: "A", text: "On August 4." },
        { label: "B", text: "Before July 31." },
        { label: "C", text: "Within about two weeks, with the monthly salary." },
        { label: "D", text: "Immediately after the receipt is uploaded." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["paraphrase"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "8월 4일은 새 절차 '시작일'이지 지급일이 아님." },
        { label: "B", type: "wrong_referent", note: "7월 31일은 '문의 마감'일이지 지급 시점이 아님." },
        { label: "D", type: "not_mentioned", note: "업로드 즉시 지급된다는 내용 없음 — 보통 2주 이내." }
      ],
      explanation: "d1p3: 'added to your monthly salary, usually within two weeks'. C가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 이메일" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거로 유일 정답 도출" },
    distractor: { pass: true, reviewer: "Claude", note: "모든 오답 라벨에 타입태그·근거 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 email — 목적/세부(scanning)/패러프레이즈" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "목적 문항(1번)에서 salary·portal 같은 '부분 등장' 단어 오답에 끌리지 않았는가?",
    "3번처럼 날짜(8/4 시작·7/31 문의마감·2주 지급)가 여러 개일 때 각 날짜가 무엇에 걸리는지 분리했는가?"
  ],
  version: "2026-06-29"
};
