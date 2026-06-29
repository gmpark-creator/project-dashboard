/* Paralex set · biz-001 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   토익 Part6/7 비즈니스 장르 모사. 백지 신규 창작. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-001"] = {
  id: "biz-001",
  setKind: "set",
  track: "business",
  genre: "memo",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["purpose", "inference", "scanning"],
  trapFocus: ["wrong_referent", "not_mentioned", "opposite"],
  vocabBand: "TSL",
  targetTimeSec: 210,
  title: "Internal Memo: Relocation of the Marketing Team",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 152,
  passage: {
    documents: [
      { id: "d1", label: "Internal Memo", paragraphs: [
        { id: "d1p1", functionLabel: "수신/목적", chunks: [
          { en: "TO: All Marketing Staff / FROM: Facilities Office / RE: Workspace Transition.", ko: "수신: 전 마케팅 직원 / 발신: 시설관리실 / 제목: 업무공간 이전.", note: "메모 헤더" },
          { en: "This memo is to inform you", ko: "이 메모는 알려드리기 위한 것입니다", note: "be to inform: 알리고자 함(목적)" },
          { en: "that the Marketing team will be relocated", ko: "마케팅 팀이 이전될 것임을", note: "수동태 will be relocated" },
          { en: "from the third floor to the newly renovated west wing,", ko: "3층에서 / 새로 단장한 서관으로,", note: "from A to B" },
          { en: "effective Monday, July 14.", ko: "7월 14일 월요일부로.", note: "effective+날짜: ~부 시행" },
          { en: "The move is intended to consolidate the department", ko: "이 이전은 그 부서를 통합하려는 것입니다", note: "be intended to: ~하려는 의도" },
          { en: "closer to the design studio.", ko: "디자인 스튜디오에 더 가깝게.", note: "" }
        ]},
        { id: "d1p2", functionLabel: "지시사항", chunks: [
          { en: "Please ensure that all personal belongings", ko: "모든 개인 소지품이", note: "ensure that: ~을 확실히 하다" },
          { en: "are packed and labeled", ko: "포장되고 라벨이 붙도록 하십시오", note: "수동태" },
          { en: "by the close of business on Friday, July 11.", ko: "7월 11일 금요일 업무 종료 시각까지.", note: "by the close of business(COB)" },
          { en: "Boxes left unlabeled", ko: "라벨이 안 붙은 채 둔 박스는", note: "left unlabeled: 과거분사 후치수식" },
          { en: "may not be transported.", ko: "운반되지 않을 수 있습니다.", note: "" },
          { en: "The IT department will relocate workstations over the weekend,", ko: "IT 부서가 / 주말 동안 워크스테이션을 이전할 것이므로,", note: "" },
          { en: "so employees are asked not to disconnect any equipment themselves.", ko: "그러니 직원들은 / 어떤 장비도 직접 분리하지 않도록 요청받습니다.", note: "be asked not to" }
        ]},
        { id: "d1p3", functionLabel: "추가안내/예외", chunks: [
          { en: "Parking assignments will remain unchanged", ko: "주차 배정은 변경되지 않은 채로 유지됩니다", note: "remain+형용사" },
          { en: "for the time being.", ko: "당분간은.", note: "for the time being: 당분간" },
          { en: "Should you require accommodations during the transition,", ko: "이전 기간 중 편의 제공이 필요하시면,", note: "If you should require의 도치(가정법)" },
          { en: "contact the Facilities Office no later than July 9.", ko: "7월 9일까지 시설관리실에 연락하십시오.", note: "no later than: 늦어도 ~까지" },
          { en: "We appreciate your cooperation", ko: "협조에 감사드립니다", note: "" },
          { en: "in making this move as smooth as possible.", ko: "이 이전을 가능한 한 매끄럽게 만드는 데에.", note: "as A as possible" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "effective Monday, July 14", note: "effective + 날짜 = (날짜)부로 시행되는. 토익 공지문 빈출" },
    { span: "Boxes left unlabeled may not be transported", note: "left unlabeled = 라벨 안 붙은 채로(과거분사 후치수식)" },
    { span: "Should you require accommodations", note: "If you should require...의 도치(가정법). '혹시 ~가 필요하면'" }
  ],
  vocabulary: [
    { lemma: "relocate", pos: "v.", glossKo: "이전하다, 자리를 옮기다", collocation: "relocate the team to the west wing", listTag: "TSL" },
    { lemma: "consolidate", pos: "v.", glossKo: "통합하다, 한데 모으다", collocation: "consolidate the department", listTag: "BSL" },
    { lemma: "by the close of business", pos: "phr.", glossKo: "업무 종료 시각까지(= by COB)", collocation: "by the close of business on Friday", listTag: "TSL" },
    { lemma: "accommodation", pos: "n.", glossKo: "편의 제공, 배려", collocation: "require accommodations", listTag: "NAWL" },
    { lemma: "for the time being", pos: "phr.", glossKo: "당분간은", collocation: "remain unchanged for the time being", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "The move is intended to consolidate the department closer to the design studio",
      paraphrase: "The relocation aims to bring the team nearer to the design studio" },
    { sourceSpanId: "d1p2", original: "employees are asked not to disconnect any equipment themselves",
      paraphrase: "staff should not unplug their devices on their own" },
    { sourceSpanId: "d1p3", original: "Parking assignments will remain unchanged for the time being",
      paraphrase: "For now, where employees park will stay the same" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the memo?",
      choices: [
        { label: "A", text: "To announce an office relocation and related instructions." },
        { label: "B", text: "To introduce a new parking policy." },
        { label: "C", text: "To recruit new members for the design studio." },
        { label: "D", text: "To report the results of a customer survey." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "partial_truth", note: "주차가 d1p3에 언급되긴 하나 '변경 없음(unchanged)'일 뿐 — '새 정책 도입'은 일부 사실에 기댄 과장이며 메모의 목적도 아님." },
        { label: "C", type: "not_mentioned", note: "채용 언급 없음. design studio는 이전 목적의 맥락." },
        { label: "D", type: "not_mentioned", note: "고객 설문 결과는 지문에 없음." }
      ],
      explanation: "d1p1의 RE와 'inform you that ... will be relocated'가 목적을 명시. A가 정답." },
    { no: 2, stem: "What are employees asked to do by July 11?",
      choices: [
        { label: "A", text: "Disconnect their own workstations." },
        { label: "B", text: "Pack and label their personal belongings." },
        { label: "C", text: "Move boxes to the west wing themselves." },
        { label: "D", text: "Submit a new parking request." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["opposite", "not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "opposite", note: "d1p2는 장비를 직접 분리하지 '말라'고 함 — 정반대." },
        { label: "C", type: "not_mentioned", note: "직원이 직접 박스를 옮긴다는 지시 없음(IT가 주말에 이전)." },
        { label: "D", type: "wrong_referent", note: "주차 요청 마감(7/9 accommodations)은 7/11과 무관." }
      ],
      explanation: "d1p2: 'packed and labeled by the close of business on Friday, July 11'. B가 정답." },
    { no: 3, stem: "What is implied about the IT department?",
      choices: [
        { label: "A", text: "It will handle the moving of workstations." },
        { label: "B", text: "It opposes the relocation plan." },
        { label: "C", text: "It is also moving to the west wing." },
        { label: "D", text: "It will assign new parking spaces." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["inference"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "IT의 반대 의견 근거 없음." },
        { label: "C", type: "not_mentioned", note: "IT가 함께 이전한다는 언급 없음." },
        { label: "D", type: "wrong_referent", note: "주차 배정은 Facilities 소관이며 변경 없음." }
      ],
      explanation: "d1p2: 'The IT department will relocate workstations over the weekend' — IT가 이전 담당. A가 정답." }
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
    "목적 문항(1번)에서 주차·채용 같은 '부분적 사실' 오답에 끌리지 않았는가?",
    "2번처럼 날짜가 여러 개일 때 어느 마감이 어느 행동에 걸리는지 분리했는가?"
  ],
  version: "2026-06-29"
};
