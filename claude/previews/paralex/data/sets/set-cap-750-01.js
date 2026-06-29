/* Paralex Ladder Capsule · cap-750-01 · 자체작성(original) · documents[]/라우팅 계약 준수.
   토익 750-800 band · notice 장르 · 짧고 평이한 사내 공지. 백지 신규 창작, 기출 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["cap-750-01"] = {
  id: "cap-750-01",
  setKind: "ladder_capsule",
  track: "business",
  genre: "notice",
  scoreBandTarget: "750-800",
  difficultyRank: 2,
  partFocus: ["Part5", "Part7"],
  skillFocus: ["collocation", "scanning"],
  trapFocus: ["same_word"],
  vocabBand: "TSL",
  targetTimeSec: 180,
  title: "Notice: Updated Cafeteria Hours at Brightleaf Foods",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 118,
  passage: {
    documents: [
      { id: "d1", label: "Notice", paragraphs: [
        { id: "d1p1", functionLabel: "공지/변경", chunks: [
          { en: "NOTICE: Employee Cafeteria Hours.", ko: "공지: 직원 카페테리아 운영시간.", note: "공지문 헤더" },
          { en: "Beginning Monday, August 4,", ko: "8월 4일 월요일부터,", note: "beginning+날짜: ~부터 시작" },
          { en: "the staff cafeteria will open one hour earlier,", ko: "직원 카페테리아가 한 시간 일찍 문을 엽니다,", note: "open earlier: 더 일찍 열다" },
          { en: "at 7:00 a.m. instead of 8:00 a.m.", ko: "오전 8시 대신 오전 7시에.", note: "instead of: ~ 대신" },
          { en: "This change is being made", ko: "이 변경은 이루어지고 있습니다", note: "수동태 진행형 is being made" },
          { en: "to better serve employees", ko: "직원들을 더 잘 응대하기 위해", note: "to better serve: 더 잘 응대하려고" },
          { en: "who begin their shifts early.", ko: "이른 교대 근무를 시작하는.", note: "who 관계대명사: 앞 employees 수식" }
        ]},
        { id: "d1p2", functionLabel: "안내/연락처", chunks: [
          { en: "Closing time will remain the same,", ko: "마감 시간은 동일하게 유지됩니다,", note: "remain the same: 그대로 유지되다" },
          { en: "at 3:00 p.m. on weekdays.", ko: "평일 오후 3시에.", note: "on weekdays: 평일에" },
          { en: "The breakfast menu has been expanded", ko: "조식 메뉴가 확대되었습니다", note: "현재완료 수동 has been expanded" },
          { en: "to include fresh fruit and hot beverages.", ko: "신선한 과일과 따뜻한 음료를 포함하도록.", note: "to include: ~을 포함하도록" },
          { en: "If you have any questions,", ko: "문의 사항이 있으시면,", note: "if you have questions: 콜로케이션" },
          { en: "please contact the Dining Services Office", ko: "식음료 서비스실로 연락하십시오", note: "contact + 부서: ~에 연락하다" },
          { en: "at extension 220.", ko: "내선 220번으로.", note: "at extension: 내선 ~번으로" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "the staff cafeteria will open one hour earlier", note: "open ... earlier = 더 일찍 열다. one hour earlier가 비교의 정도를 표현" },
    { span: "This change is being made to better serve employees", note: "be being made(진행 수동) + to부정사(목적). '~하기 위해 변경이 이루어지는 중'" },
    { span: "The breakfast menu has been expanded to include ...", note: "has been expanded(현재완료 수동) + to include = ~을 포함하도록 확대되었다" }
  ],
  vocabulary: [
    { lemma: "cafeteria", pos: "n.", glossKo: "구내식당, 카페테리아", collocation: "the staff cafeteria opens at 7 a.m.", listTag: "TSL" },
    { lemma: "shift", pos: "n.", glossKo: "교대 근무(시간)", collocation: "begin an early shift", listTag: "TSL" },
    { lemma: "expand", pos: "v.", glossKo: "확대하다, 늘리다", collocation: "expand the breakfast menu", listTag: "TSL" },
    { lemma: "beverage", pos: "n.", glossKo: "음료", collocation: "hot beverages", listTag: "TSL" },
    { lemma: "extension", pos: "n.", glossKo: "(전화) 내선 번호", collocation: "contact the office at extension 220", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "the staff cafeteria will open one hour earlier, at 7:00 a.m. instead of 8:00 a.m.",
      paraphrase: "the cafeteria's opening time will move up from 8 a.m. to 7 a.m." },
    { sourceSpanId: "d1p2", original: "The breakfast menu has been expanded to include fresh fruit and hot beverages",
      paraphrase: "More items, such as fruit and warm drinks, have been added to the breakfast options" }
  ],
  questions: [
    { no: 1, stem: "What change is announced in the notice?",
      choices: [
        { label: "A", text: "The cafeteria will start opening one hour earlier." },
        { label: "B", text: "The cafeteria will close one hour earlier." },
        { label: "C", text: "The cafeteria will be closed on weekdays." },
        { label: "D", text: "The cafeteria will move to a new location." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "지문은 '한 시간 일찍 연다'이지 '닫는다'가 아님 — 정반대." },
        { label: "C", type: "not_mentioned", note: "'weekdays'와 'closing'이라는 지문 단어를 그대로 끌어 쓴 same_word 함정. 평일 휴무 언급 없음(마감은 동일 유지)." },
        { label: "D", type: "not_mentioned", note: "위치 이전 언급 없음." }
      ],
      explanation: "d1p1: 'will open one hour earlier, at 7:00 a.m. instead of 8:00 a.m.' — 개점이 한 시간 앞당겨짐. A가 정답." },
    { no: 2, stem: "What is indicated about the closing time of the cafeteria?",
      choices: [
        { label: "A", text: "It will stay the same at 3:00 p.m. on weekdays." },
        { label: "B", text: "It will be moved up to 7:00 a.m." },
        { label: "C", text: "It will be extended by one hour." },
        { label: "D", text: "It will change on weekends only." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'7:00 a.m.'은 개점 시각(d1p1)인데 마감 시각에 갖다 붙인 same_word 함정." },
        { label: "C", type: "not_mentioned", note: "마감 연장 언급 없음 — 'remain the same'." },
        { label: "D", type: "not_mentioned", note: "주말 변경 언급 없음." }
      ],
      explanation: "d1p2: 'Closing time will remain the same, at 3:00 p.m. on weekdays.' — 마감은 그대로. A가 정답." },
    { no: 3, stem: "How can employees ask questions about the change?",
      choices: [
        { label: "A", text: "By contacting the Dining Services Office at extension 220." },
        { label: "B", text: "By visiting the cafeteria before 7:00 a.m." },
        { label: "C", text: "By emailing the breakfast menu committee." },
        { label: "D", text: "By speaking with their shift supervisor." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'7:00 a.m.'·'cafeteria' 같은 지문 단어를 재활용한 same_word 함정 — 문의 방법과 무관." },
        { label: "C", type: "not_mentioned", note: "이메일·위원회 언급 없음('breakfast menu'만 차용)." },
        { label: "D", type: "not_mentioned", note: "교대 관리자 언급 없음('shift'만 차용)." }
      ],
      explanation: "d1p2: 'please contact the Dining Services Office at extension 220.' — 내선 220번 연락. A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음, 가공 회사명(Brightleaf Foods)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 사내 공지" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재(d1p1/d1p2)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, 각 문항 same_word 매력 오답 1+개 배치(type=not_mentioned/wrong_referent)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 notice — 변경 세부/유지 세부/연락 방법(scanning·collocation), 750-800 평이 어휘" },
    human: { pass: false, reviewer: null, note: "박사 검수 전 — practice" }
  },
  reflectionPrompts: [
    "1·2번에서 지문에 그대로 나온 단어(weekdays, 7:00 a.m.)가 들어간 오답에 반사적으로 끌리지 않았는가?",
    "3번처럼 'shift', 'breakfast menu' 같은 익숙한 단어가 보일 때, 그 단어가 문의 방법과 실제로 연결되는지 근거 문장을 다시 확인했는가?"
  ],
  version: "2026-06-29"
};
