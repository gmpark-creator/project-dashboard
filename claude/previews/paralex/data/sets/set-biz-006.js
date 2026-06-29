/* Paralex set · biz-006 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   토익 Part7 비즈니스 memo 모사. 백지 신규 창작. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-006"] = {
  id: "biz-006",
  setKind: "set",
  track: "business",
  genre: "memo",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["scanning", "purpose"],
  trapFocus: ["wrong_referent", "not_mentioned", "same_word"],
  vocabBand: "TSL",
  targetTimeSec: 225,
  title: "Internal Memo: Quarterly Staff Workshop",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 153,
  passage: {
    documents: [
      { id: "d1", label: "Internal Memo", paragraphs: [
        { id: "d1p1", functionLabel: "수신/목적", chunks: [
          { en: "TO: All Plant Staff / FROM: Training Office / RE: Quarterly Workshop.", ko: "수신: 전 공장 직원 / 발신: 교육실 / 제목: 분기 워크숍.", note: "메모 헤더" },
          { en: "This memo is to announce", ko: "이 메모는 안내하기 위한 것입니다", note: "be to announce: 알리고자 함(목적)" },
          { en: "the details of our third-quarter staff workshop,", ko: "우리 3분기 직원 워크숍의 세부 사항을,", note: "third-quarter: 3분기" },
          { en: "which all processing employees are required to attend.", ko: "전 가공 직원이 참석해야 하는.", note: "be required to: ~해야 한다(의무)" },
          { en: "The session will review updated handling procedures", ko: "이 세션은 갱신된 취급 절차를 검토하고", note: "updated: 갱신된" },
          { en: "and refresh safety practices on the line.", ko: "라인의 안전 수칙을 다시 점검할 것입니다.", note: "refresh: 다시 다지다" }
        ]},
        { id: "d1p2", functionLabel: "일정/장소", chunks: [
          { en: "The workshop will be held on Thursday, August 21,", ko: "워크숍은 8월 21일 목요일에 열립니다,", note: "be held on+날짜" },
          { en: "from 9:00 a.m. to 12:30 p.m. in Training Room B.", ko: "오전 9시부터 / 오후 12시 30분까지 / B교육실에서.", note: "from A to B: 시간 범위" },
          { en: "A make-up session for those on the morning shift", ko: "오전 교대조를 위한 보충 세션은", note: "make-up session: 보충 세션" },
          { en: "is scheduled for Friday, August 22, at 2:00 p.m.", ko: "8월 22일 금요일 오후 2시로 잡혀 있습니다.", note: "be scheduled for+날짜" },
          { en: "Note that the loading dock will close early that day.", ko: "그날 하역장이 일찍 닫힌다는 점에 유의하십시오.", note: "Note that: ~에 유의하라" }
        ]},
        { id: "d1p3", functionLabel: "준비물/신청마감", chunks: [
          { en: "Each attendee should bring a hard hat, the revised handbook, and a photo ID.", ko: "각 참석자는 안전모, 개정된 안내서, 사진이 부착된 신분증을 지참해야 합니다.", note: "병렬 목적어 나열" },
          { en: "Confirm your attendance through the staff portal", ko: "직원 포털을 통해 참석을 확정하십시오", note: "confirm attendance: 참석 확정" },
          { en: "no later than Friday, August 15.", ko: "늦어도 8월 15일 금요일까지.", note: "no later than: 늦어도 ~까지" },
          { en: "Anyone who misses the registration deadline", ko: "신청 마감을 놓친 사람은", note: "miss the deadline: 마감을 놓치다" },
          { en: "may be placed in the following quarter's group.", ko: "다음 분기 그룹에 배정될 수 있습니다.", note: "be placed in: ~에 배정되다" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "which all processing employees are required to attend", note: "which 관계절 + be required to attend = '참석해야 하는'(의무). 워크숍 = 필참 단서" },
    { span: "is scheduled for Friday, August 22, at 2:00 p.m.", note: "be scheduled for = ~로 예정. 보충 세션 날짜(8/21 본세션과 구분 주의)" },
    { span: "no later than Friday, August 15", note: "no later than = 늦어도 ~까지. 신청 마감일(행사일과 헷갈리지 말 것)" }
  ],
  vocabulary: [
    { lemma: "quarterly", pos: "adj.", glossKo: "분기별의, 분기마다의", collocation: "the quarterly staff workshop", listTag: "TSL" },
    { lemma: "attendee", pos: "n.", glossKo: "참석자", collocation: "each attendee should bring", listTag: "BSL" },
    { lemma: "make-up session", pos: "phr.", glossKo: "보충 세션, 보강 시간", collocation: "a make-up session for the morning shift", listTag: "TSL" },
    { lemma: "no later than", pos: "phr.", glossKo: "늦어도 ~까지", collocation: "confirm no later than August 15", listTag: "TSL" },
    { lemma: "registration deadline", pos: "n.", glossKo: "신청 마감(일)", collocation: "miss the registration deadline", listTag: "NAWL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "which all processing employees are required to attend",
      paraphrase: "attendance is mandatory for everyone on the processing staff" },
    { sourceSpanId: "d1p2", original: "A make-up session for those on the morning shift is scheduled for Friday, August 22",
      paraphrase: "Morning-shift workers can instead join a second session on August 22" },
    { sourceSpanId: "d1p3", original: "Confirm your attendance through the staff portal no later than Friday, August 15",
      paraphrase: "Sign up on the portal by August 15 at the latest" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the memo?",
      choices: [
        { label: "A", text: "To announce a required quarterly workshop and its arrangements." },
        { label: "B", text: "To distribute a new safety handbook to all staff." },
        { label: "C", text: "To report the early closing of the loading dock." },
        { label: "D", text: "To survey employees about their preferred shift." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["same_word", "wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "same_word", note: "'handbook'은 지참물로만 언급 — 배포가 메모의 목적은 아님." },
        { label: "C", type: "wrong_referent", note: "하역장 조기 마감은 d1p2의 부수 유의사항일 뿐, 메모의 목적이 아님." },
        { label: "D", type: "not_mentioned", note: "교대조 선호 설문은 지문에 없음." }
      ],
      explanation: "d1p1의 RE와 'announce the details of our third-quarter staff workshop ... required to attend'가 목적을 명시. A가 정답." },
    { no: 2, stem: "By when must employees confirm their attendance?",
      choices: [
        { label: "A", text: "By Friday, August 15." },
        { label: "B", text: "By Thursday, August 21." },
        { label: "C", text: "By Friday, August 22." },
        { label: "D", text: "By Monday, August 9." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "8월 21일은 워크숍 본세션 날짜 — 신청 마감과 다른 날짜." },
        { label: "C", type: "wrong_referent", note: "8월 22일은 보충 세션 날짜 — 신청 마감이 아님." },
        { label: "D", type: "not_mentioned", note: "8월 9일이라는 날짜는 지문에 등장하지 않음." }
      ],
      explanation: "d1p3: 'Confirm your attendance ... no later than Friday, August 15'. A가 정답." },
    { no: 3, stem: "What is implied about the make-up session?",
      choices: [
        { label: "A", text: "It is intended for employees who work the morning shift." },
        { label: "B", text: "It will replace the August 21 workshop for everyone." },
        { label: "C", text: "It will be held in a separate building." },
        { label: "D", text: "It lasts longer than the main session." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["inference"], trapFocus: ["extreme_word", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "extreme_word", note: "'for everyone'은 과장 — 보충 세션은 오전 교대조 대상으로 한정됨." },
        { label: "C", type: "not_mentioned", note: "별도 건물에서 열린다는 언급 없음." },
        { label: "D", type: "not_mentioned", note: "보충 세션의 길이에 대한 정보 없음." }
      ],
      explanation: "d1p2: 'A make-up session for those on the morning shift' — 오전 교대조용임을 암시. A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 메모" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 memo — 목적/세부(scanning)/암시(inference)" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "2번에서 여러 날짜(8/15·8/21·8/22) 중 어느 날짜가 '신청 마감'에 걸리는지 행동별로 분리했는가?",
    "목적 문항(1번)에서 'handbook' 같은 같은-단어 함정에 끌려 부수적 사실을 목적으로 고르지 않았는가?"
  ],
  version: "2026-06-29"
};
