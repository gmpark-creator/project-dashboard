/* Paralex Ladder Capsule · cap-750-02 · 자체작성(original) · documents[]/라우팅 계약 준수.
   토익 750-800 band · notice 장르 · 짧고 평이한 사내 공지(회의실 예약 시스템 변경). 백지 신규 창작, 기출 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["cap-750-02"] = {
  id: "cap-750-02",
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
  title: "Notice: New Meeting Room Reservation System at Harborline Manufacturing",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 116,
  passage: {
    documents: [
      { id: "d1", label: "Notice", paragraphs: [
        { id: "d1p1", functionLabel: "공지/변경", chunks: [
          { en: "NOTICE: New Meeting Room Reservation System.", ko: "공지: 새로운 회의실 예약 시스템.", note: "공지문 헤더" },
          { en: "Starting Monday, September 1,", ko: "9월 1일 월요일부터,", note: "starting+날짜: ~부터 시작" },
          { en: "all meeting rooms must be booked", ko: "모든 회의실은 예약되어야 합니다", note: "수동태 의무 must be booked" },
          { en: "through the new online reservation portal", ko: "새로운 온라인 예약 포털을 통해", note: "through: ~을 통해(수단)" },
          { en: "rather than the paper sign-up sheet.", ko: "종이 신청지 대신.", note: "rather than: ~ 대신에" },
          { en: "The previous sheet posted outside each room", ko: "각 회의실 밖에 붙어 있던 기존 신청지는", note: "posted: 과거분사 후치수식(붙어 있던)" },
          { en: "will no longer be accepted.", ko: "더 이상 받아들여지지 않습니다.", note: "no longer: 더 이상 ~않다" },
          { en: "This system was introduced", ko: "이 시스템은 도입되었습니다", note: "수동태 was introduced" },
          { en: "to prevent double bookings", ko: "중복 예약을 방지하기 위해", note: "to prevent: ~을 방지하려고(목적)" },
          { en: "and to track room usage more accurately.", ko: "그리고 회의실 사용을 더 정확하게 추적하기 위해.", note: "track usage: 사용을 추적하다(콜로케이션)" }
        ]},
        { id: "d1p2", functionLabel: "이용방법/연락처", chunks: [
          { en: "To reserve a room,", ko: "회의실을 예약하려면,", note: "to reserve: 예약하기 위해(목적)" },
          { en: "log in with your employee ID", ko: "직원 ID로 로그인하십시오", note: "log in with: ~으로 로그인하다" },
          { en: "and select an available time slot.", ko: "그리고 이용 가능한 시간대를 선택하십시오.", note: "available time slot: 이용 가능한 시간대" },
          { en: "Reservations must be made", ko: "예약은 이루어져야 합니다", note: "수동태 must be made" },
          { en: "at least two hours in advance.", ko: "최소 두 시간 전에.", note: "in advance: 미리, 사전에" },
          { en: "Walk-in use is no longer permitted.", ko: "현장(예약 없는) 이용은 더 이상 허용되지 않습니다.", note: "walk-in: 예약 없이 즉석 이용" },
          { en: "Rooms not used within fifteen minutes", ko: "15분 이내에 사용되지 않은 회의실은", note: "not used: 과거분사 후치수식" },
          { en: "of the booked start time", ko: "예약된 시작 시각으로부터", note: "of: ~의(시점 기준)" },
          { en: "will be released automatically.", ko: "자동으로 해제됩니다.", note: "be released: (예약이) 해제되다" },
          { en: "For help with your account,", ko: "계정에 관한 도움이 필요하시면,", note: "for help with: ~에 관한 도움" },
          { en: "please contact the IT Help Desk", ko: "IT 헬프데스크로 연락하십시오", note: "contact + 부서: ~에 연락하다" },
          { en: "at extension 145.", ko: "내선 145번으로.", note: "at extension: 내선 ~번으로" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "all meeting rooms must be booked through the new online reservation portal", note: "must be booked(의무 수동) + through(수단). '~을 통해 예약되어야 한다'" },
    { span: "The previous sheet posted outside each room will no longer be accepted", note: "posted outside each room = 각 방 밖에 붙어 있던(과거분사 후치수식). no longer be accepted = 더 이상 받지 않는다" },
    { span: "Rooms not used within fifteen minutes ... will be released automatically", note: "not used ...(과거분사구) 주어 수식 + will be released(미래 수동). '15분 내 미사용 시 자동 해제'" }
  ],
  vocabulary: [
    { lemma: "reservation", pos: "n.", glossKo: "예약", collocation: "the online reservation portal", listTag: "TSL" },
    { lemma: "book", pos: "v.", glossKo: "예약하다", collocation: "book a meeting room", listTag: "TSL" },
    { lemma: "in advance", pos: "phr.", glossKo: "미리, 사전에", collocation: "made at least two hours in advance", listTag: "TSL" },
    { lemma: "release", pos: "v.", glossKo: "해제하다, 풀어 주다", collocation: "the booking is released automatically", listTag: "TSL" },
    { lemma: "extension", pos: "n.", glossKo: "(전화) 내선 번호", collocation: "contact the IT Help Desk at extension 145", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "all meeting rooms must be booked through the new online reservation portal rather than the paper sign-up sheet",
      paraphrase: "rooms are now reserved online instead of on the printed sign-up sheet" },
    { sourceSpanId: "d1p2", original: "Rooms not used within fifteen minutes of the booked start time will be released automatically",
      paraphrase: "if no one shows up within fifteen minutes, the reservation is canceled on its own" }
  ],
  questions: [
    { no: 1, stem: "What change does the notice announce?",
      choices: [
        { label: "A", text: "Meeting rooms must now be reserved through an online portal." },
        { label: "B", text: "The paper sign-up sheet will be posted outside each room." },
        { label: "C", text: "Meeting rooms will be closed starting September 1." },
        { label: "D", text: "The company will build additional meeting rooms." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "지문 단어 'paper sign-up sheet'·'posted outside each room'을 그대로 쓴 same_word 함정. 실제로는 종이 신청지가 '더 이상 받아들여지지 않음' — 정반대." },
        { label: "C", type: "not_mentioned", note: "'September 1'은 새 시스템 시행일이지 회의실 폐쇄일이 아님 — 폐쇄 언급 없음." },
        { label: "D", type: "not_mentioned", note: "회의실 증설 언급 없음." }
      ],
      explanation: "d1p1: 'all meeting rooms must be booked through the new online reservation portal rather than the paper sign-up sheet.' A가 정답." },
    { no: 2, stem: "What happens to a room that is not used soon after its booked start time?",
      choices: [
        { label: "A", text: "Its reservation is released automatically." },
        { label: "B", text: "It must be booked two hours in advance." },
        { label: "C", text: "It is reported to the IT Help Desk." },
        { label: "D", text: "Its start time is extended by fifteen minutes." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'two hours in advance'는 예약을 거는 조건(d1p2)이지 미사용 회의실의 처리 방식이 아님 — 지문 단어를 갖다 붙인 same_word 함정." },
        { label: "C", type: "not_mentioned", note: "'IT Help Desk'는 계정 문의처일 뿐(d1p2). 미사용 회의실 신고 언급 없음." },
        { label: "D", type: "not_mentioned", note: "'fifteen minutes'를 차용했으나 시작 시각 연장 언급 없음 — 자동 해제일 뿐." }
      ],
      explanation: "d1p2: 'Rooms not used within fifteen minutes of the booked start time will be released automatically.' A가 정답." },
    { no: 3, stem: "How can employees get help with their account?",
      choices: [
        { label: "A", text: "By contacting the IT Help Desk at extension 145." },
        { label: "B", text: "By logging in with their employee ID before September 1." },
        { label: "C", text: "By signing the paper sheet outside each room." },
        { label: "D", text: "By selecting an available time slot on the portal." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'employee ID'·'September 1'은 로그인·시행일 관련 지문 단어를 재활용한 same_word 함정 — 계정 도움 방법과 무관." },
        { label: "C", type: "not_mentioned", note: "'paper sheet'·'outside each room'을 차용했으나, 종이 신청지는 폐지됨 — 도움 요청 경로 아님." },
        { label: "D", type: "wrong_referent", note: "'available time slot'은 예약 절차(d1p2)이지 계정 문제 해결 방법이 아님." }
      ],
      explanation: "d1p2: 'For help with your account, please contact the IT Help Desk at extension 145.' A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음, 가공 회사명(Harborline Manufacturing)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 사내 공지. cap-750-01(카페테리아)과 다른 주제(회의실 예약 시스템)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재(d1p1/d1p2)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, 각 문항 same_word 매력 오답 1+개 배치(type=not_mentioned/wrong_referent/opposite)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 notice — 변경 세부/규정 세부/연락 방법(scanning·collocation), 750-800 평이 어휘" },
    human: { pass: false, reviewer: null, note: "박사 검수 전 — practice" }
  },
  reflectionPrompts: [
    "1번에서 'paper sign-up sheet', 'posted outside each room' 같은 지문에 그대로 나온 단어가 들어간 오답에 반사적으로 끌리지 않았는가?",
    "2·3번처럼 'two hours in advance', 'employee ID', 'available time slot' 같은 익숙한 표현이 보일 때, 그 표현이 질문이 묻는 행동과 실제로 연결되는지 근거 문장을 다시 확인했는가?"
  ],
  version: "2026-06-29"
};
