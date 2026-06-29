/* Paralex set · biz-007 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   토익 Part7 비즈니스 letter(채용 합격 통지서) 모사. 백지 신규 창작. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-007"] = {
  id: "biz-007",
  setKind: "set",
  track: "business",
  genre: "letter",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["scanning", "purpose", "inference"],
  trapFocus: ["wrong_referent", "not_mentioned"],
  vocabBand: "BSL",
  targetTimeSec: 230,
  title: "Offer Letter: Quality Control Analyst Position",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 156,
  passage: {
    documents: [
      { id: "d1", label: "Offer Letter", paragraphs: [
        { id: "d1p1", functionLabel: "인사/제안 목적", chunks: [
          { en: "Dear Applicant,", ko: "지원자께,", note: "공식 서신 호칭" },
          { en: "we are pleased to extend an offer of employment", ko: "저희는 기쁘게 채용 제안을 드립니다", note: "extend an offer: 제안을 내밀다" },
          { en: "for the position of Quality Control Analyst", ko: "품질관리 분석가 직책으로", note: "for the position of: ~직책으로" },
          { en: "at Northbrook Foods Processing.", ko: "노스브룩 식품가공사의.", note: "가공 회사명(원작)" },
          { en: "Thank you for taking the time to meet with our team last week.", ko: "지난주 저희 팀과 만나 주셔서 감사합니다.", note: "면접이 이미 끝났음(시제 단서)" },
          { en: "Following your recent interviews,", ko: "최근의 면접에 이어,", note: "following: ~에 뒤이어" },
          { en: "the hiring committee was impressed by your experience in food safety inspection.", ko: "채용 위원회는 / 식품 안전 검사에 대한 귀하의 경력에 감명받았습니다.", note: "be impressed by" },
          { en: "This letter sets out the terms of your prospective employment.", ko: "이 서신은 / 귀하의 장래 고용 조건을 제시합니다.", note: "set out: 제시하다 / prospective: 장래의" }
        ]},
        { id: "d1p2", functionLabel: "고용 조건(직책/연봉/시작일)", chunks: [
          { en: "The position carries an annual salary of 52,000 dollars,", ko: "이 직책은 / 연봉 52,000달러를 수반하며,", note: "carry a salary: 연봉이 책정되다" },
          { en: "paid in twelve equal monthly installments.", ko: "12회 균등 월 분할로 지급됩니다.", note: "installment: 분할 지급분" },
          { en: "Your first day of employment will be Monday, September 1.", ko: "귀하의 첫 근무일은 / 9월 1일 월요일이 될 것입니다.", note: "시작일 단서" },
          { en: "You will report to the Production Quality Manager", ko: "귀하는 생산품질 관리자에게 보고하게 되며", note: "report to: ~에게 보고/소속되다" },
          { en: "and complete a three-month probationary period.", ko: "그리고 3개월의 수습 기간을 거치게 됩니다.", note: "probationary period: 수습 기간" }
        ]},
        { id: "d1p3", functionLabel: "수락 마감/필요 서류", chunks: [
          { en: "To accept this offer,", ko: "이 제안을 수락하시려면,", note: "to부정사 목적" },
          { en: "please sign and return the enclosed agreement no later than August 15.", ko: "동봉된 계약서에 서명하여 / 늦어도 8월 15일까지 반송해 주십시오.", note: "no later than: 늦어도 ~까지 / enclosed: 동봉된" },
          { en: "Along with the signed form,", ko: "서명한 양식과 함께,", note: "along with: ~와 함께" },
          { en: "submit a copy of your food handler's certificate and two professional references.", ko: "식품 취급자 자격증 사본 1부와 / 직무 추천인 2명을 제출해 주십시오.", note: "필요 서류 단서" },
          { en: "Should you have any questions about the terms,", ko: "조건에 관해 궁금한 점이 있으시면,", note: "If you should...의 도치(가정법)" },
          { en: "contact the Human Resources Office before August 10.", ko: "8월 10일 전에 인사실로 연락 주십시오.", note: "before+날짜" },
          { en: "We look forward to welcoming you aboard.", ko: "귀하를 팀에 맞이하기를 고대합니다.", note: "welcome aboard: 합류를 환영하다" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "please sign and return the enclosed agreement no later than August 15", note: "no later than = 늦어도 ~까지. 마감 단서로 scanning 빈출" },
    { span: "Should you have any questions about the terms", note: "If you should have...의 도치(가정법). '혹시 ~가 있으시면'" },
    { span: "paid in twelve equal monthly installments", note: "in ... installments = ~회 분할로. 급여/결제 조건 표현" }
  ],
  vocabulary: [
    { lemma: "extend an offer", pos: "phr.", glossKo: "제안을 내밀다, 제의하다", collocation: "extend an offer of employment", listTag: "BSL" },
    { lemma: "probationary period", pos: "n.", glossKo: "수습 기간", collocation: "complete a three-month probationary period", listTag: "BSL" },
    { lemma: "installment", pos: "n.", glossKo: "분할 지급분, 할부금", collocation: "paid in monthly installments", listTag: "BSL" },
    { lemma: "enclosed", pos: "adj.", glossKo: "동봉된", collocation: "the enclosed agreement", listTag: "BSL" },
    { lemma: "prospective", pos: "adj.", glossKo: "장래의, 유망한", collocation: "prospective employment", listTag: "NAWL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "we are pleased to extend an offer of employment for the position of Quality Control Analyst",
      paraphrase: "we would like to offer you the Quality Control Analyst job" },
    { sourceSpanId: "d1p3", original: "please sign and return the enclosed agreement no later than August 15",
      paraphrase: "submit the signed contract by August 15 at the latest" },
    { sourceSpanId: "d1p2", original: "complete a three-month probationary period",
      paraphrase: "work on a trial basis for three months before being confirmed" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the letter?",
      choices: [
        { label: "A", text: "To offer employment and explain the conditions of the position." },
        { label: "B", text: "To schedule a first interview with the candidate." },
        { label: "C", text: "To request payment for a food safety certificate." },
        { label: "D", text: "To announce a company-wide salary increase." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "chronology", note: "d1p1에서 면접은 이미 끝남('Following your recent interviews') — 면접 일정 잡기가 아님." },
        { label: "C", type: "wrong_referent", note: "자격증은 지원자가 제출할 서류이지, 회사가 비용을 청구하는 대상이 아님." },
        { label: "D", type: "not_mentioned", note: "연봉은 언급되나 '전사 인상' 발표는 지문에 없음." }
      ],
      explanation: "d1p1의 'extend an offer of employment ... This letter sets out the terms'가 목적을 명시. A가 정답." },
    { no: 2, stem: "By when must the applicant return the signed agreement?",
      choices: [
        { label: "A", text: "By August 10." },
        { label: "B", text: "By August 15." },
        { label: "C", text: "By September 1." },
        { label: "D", text: "By the end of the probationary period." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "chronology"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "8월 10일은 인사실 문의 마감이지 계약서 반송 마감이 아님." },
        { label: "C", type: "wrong_referent", note: "9월 1일은 첫 근무일(d1p2)이지 계약서 반송 마감이 아님." },
        { label: "D", type: "chronology", note: "수습 기간 종료는 입사 후 시점 — 수락 마감과 무관." }
      ],
      explanation: "d1p3: 'sign and return the enclosed agreement no later than August 15'. B가 정답." },
    { no: 3, stem: "What is implied about the applicant?",
      choices: [
        { label: "A", text: "The applicant has not yet formally accepted the offer." },
        { label: "B", text: "The applicant has already begun working at the company." },
        { label: "C", text: "The applicant lacks experience in food safety." },
        { label: "D", text: "The applicant requested a higher salary." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "chronology", note: "첫 근무일이 9월 1일(미래)이므로 아직 근무 시작 전." },
        { label: "C", type: "opposite", note: "위원회가 식품 안전 검사 경력에 '감명받음'(d1p1) — 경험 부족과 정반대." },
        { label: "D", type: "not_mentioned", note: "지원자가 더 높은 연봉을 요청했다는 근거 없음." }
      ],
      explanation: "d1p3: 수락하려면 서명·반송해야 한다는 안내 → 아직 공식 수락 전임을 암시. A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 합격 통지서" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 letter — 목적/세부(scanning)/암시(inference)" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "2번처럼 날짜가 여러 개(8/10·8/15·9/1)일 때 어느 마감이 어느 행동에 걸리는지 분리했는가?",
    "3번에서 'already begun working'처럼 시제(미래 시작일)를 뒤집은 chronology 함정을 걸러냈는가?"
  ],
  version: "2026-06-29"
};
