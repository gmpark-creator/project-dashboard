/* Paralex set · news-002 · 자체작성(original) · documents[]/라우팅 계약 준수.
   가공 도시(Greenford)·가공 기관 일반 뉴스, 실존 브랜드/인물 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-002"] = {
  id: "news-002",
  setKind: "set",
  track: "news",
  genre: "news_report",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["paraphrase", "inference"],
  trapFocus: ["same_word", "partial_truth"],
  vocabBand: "NGSL2k",
  targetTimeSec: 240,
  title: "City Library Expands Free Weekend Coding Classes",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제 · 가공 도시 Greenford",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 142,
  passage: {
    documents: [
      { id: "d1", label: "News Article", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "The public library of Greenford", ko: "그린포드의 공공도서관이", note: "주어(가공 도시명)" },
          { en: "has announced a major expansion", ko: "발표했다 / 대규모 확대를", note: "현재완료" },
          { en: "of its free weekend courses", ko: "그것의 무료 주말 강좌의", note: "of+명사구(수식)" },
          { en: "in coding and basic digital skills.", ko: "코딩과 기초 디지털 기술의.", note: "" },
          { en: "Beginning next month,", ko: "다음 달부터,", note: "분사구(시점)" },
          { en: "the program will offer many more seats", ko: "그 프로그램은 훨씬 더 많은 자리를 제공할 것이다", note: "many more+가산명사" },
          { en: "to residents of every age,", ko: "모든 연령의 주민들에게,", note: "" },
          { en: "from young students to retired workers.", ko: "어린 학생들부터 은퇴한 근로자들까지.", note: "from A to B: A부터 B까지" },
          { en: "Library officials call it the city's largest learning effort yet.", ko: "도서관 당국은 그것을 시의 지금까지 가장 큰 학습 노력이라 부른다.", note: "call A B(5형식), yet=지금까지" }
        ]},
        { id: "d1p2", functionLabel: "부연/근거", chunks: [
          { en: "Library staff say", ko: "도서관 직원들은 말한다", note: "" },
          { en: "that the earlier sessions filled up quickly,", ko: "이전 강좌들이 빠르게 찼다고,", note: "fill up: 가득 차다" },
          { en: "and that many visitors asked for extra times.", ko: "그리고 많은 방문객들이 추가 시간을 요청했다고.", note: "ask for: ~을 요청하다" },
          { en: "To meet the demand,", ko: "그 수요를 맞추기 위해,", note: "to부정사(목적)" },
          { en: "volunteers including retired teachers and college students", ko: "은퇴한 교사들과 대학생들을 포함한 자원봉사자들이", note: "including: ~을 포함하여" },
          { en: "will lead small groups", ko: "소규모 그룹을 이끌 것이다", note: "" },
          { en: "on both Saturday and Sunday mornings,", ko: "토요일과 일요일 아침 둘 다,", note: "both A and B" },
          { en: "teaching simple programming and safe online habits.", ko: "간단한 프로그래밍과 안전한 온라인 습관을 가르치며.", note: "분사구문(부대상황)" }
        ]},
        { id: "d1p3", functionLabel: "유보/세부", chunks: [
          { en: "For residents without a computer at home,", ko: "집에 컴퓨터가 없는 주민들을 위해,", note: "without: ~없이" },
          { en: "laptops can be borrowed at the front desk,", ko: "노트북은 안내 데스크에서 빌릴 수 있다,", note: "조동사 수동태 can be p.p." },
          { en: "though the number available is still limited.", ko: "비록 이용 가능한 수는 여전히 제한적이지만.", note: "though: 비록 ~지만, available 후치수식" },
          { en: "Officials hope the wider schedule", ko: "당국은 바란다 / 더 넓어진 일정이", note: "hope (that) S V" },
          { en: "will help people who cannot attend on weekdays", ko: "평일에 참석할 수 없는 사람들을 도울 것을", note: "help+목적어+동사원형, who 관계절" },
          { en: "feel more comfortable with everyday technology and the internet.", ko: "일상 기술과 인터넷에 더 편안함을 느끼도록.", note: "help A (to) feel: A가 느끼도록 돕다" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "from young students to retired workers", note: "from A to B = A부터 B까지(범위)" },
    { span: "laptops can be borrowed at the front desk", note: "조동사+be+p.p. = 수동태. '빌려질 수 있다 → 빌릴 수 있다'" },
    { span: "will help people who cannot attend on weekdays feel more comfortable", note: "help+목적어+(to)동사원형: 'people이 feel하도록 돕다'. who절은 people 수식" }
  ],
  vocabulary: [
    { lemma: "expansion", pos: "n.", glossKo: "확대, 확장", collocation: "a major expansion of courses", listTag: "NGSL" },
    { lemma: "resident", pos: "n.", glossKo: "주민, 거주자", collocation: "residents of every age", listTag: "NGSL" },
    { lemma: "volunteer", pos: "n.", glossKo: "자원봉사자", collocation: "volunteers including retired teachers", listTag: "NGSL" },
    { lemma: "borrow", pos: "v.", glossKo: "빌리다", collocation: "laptops can be borrowed", listTag: "NGSL" },
    { lemma: "schedule", pos: "n.", glossKo: "일정, 시간표", collocation: "the wider schedule", listTag: "NGSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "the program will offer many more seats to residents of every age",
      paraphrase: "the courses will be open to far more people of all ages" },
    { sourceSpanId: "d1p2", original: "the earlier sessions filled up quickly, and many visitors asked for extra times",
      paraphrase: "the previous classes became full fast, and people requested additional slots" },
    { sourceSpanId: "d1p3", original: "laptops can be borrowed at the front desk",
      paraphrase: "people may take out a laptop from the help desk" }
  ],
  questions: [
    { no: 1, stem: "What is the article mainly about?",
      choices: [
        { label: "A", text: "A city library is expanding its free weekend coding and digital classes for residents." },
        { label: "B", text: "A library will begin charging new fees for its weekend courses." },
        { label: "C", text: "A library is closing on weekends to reduce its costs." },
        { label: "D", text: "Every resident in the city already owns a personal computer." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["paraphrase"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "본문은 'free' 강좌 확대 — 요금 부과는 정반대." },
        { label: "C", type: "not_mentioned", note: "주말 폐관·비용 절감 언급 없음. 오히려 주말 강좌를 늘림." },
        { label: "D", type: "opposite", note: "d1p3은 '컴퓨터 없는 주민'을 전제 — 모두 보유는 정반대." }
      ],
      explanation: "d1p1: 그린포드 공공도서관이 무료 주말 코딩·디지털 강좌를 확대하고 자리를 늘림. A가 정확한 패러프레이즈." },
    { no: 2, stem: "Who will lead the small weekend groups?",
      choices: [
        { label: "A", text: "Professional programmers hired by the city." },
        { label: "B", text: "Volunteers such as retired teachers and college students." },
        { label: "C", text: "Visitors who attended the earlier sessions." },
        { label: "D", text: "Officials who hope the schedule will work well." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "not_mentioned", note: "유급 전문 프로그래머 고용 언급 없음 — 강사는 자원봉사자." },
        { label: "C", type: "wrong_referent", note: "visitors는 '추가 시간을 요청한' 주체일 뿐 강의 진행자가 아님." },
        { label: "D", type: "same_word", note: "'officials'·'hope'·'schedule'은 d1p3에서 그대로 따온 단어 미끼 — 강사 정보가 아님." }
      ],
      explanation: "d1p2: 'volunteers including retired teachers and college students will lead small groups.' B가 정답." },
    { no: 3, stem: "What can be inferred about residents who do not own a computer?",
      choices: [
        { label: "A", text: "They can still join by borrowing a laptop, although the supply is limited." },
        { label: "B", text: "They are not permitted to take part in the classes." },
        { label: "C", text: "They must buy a brand-new laptop before they can attend." },
        { label: "D", text: "They are each given a free laptop to keep permanently." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["partial_truth", "extreme_word"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "노트북 대여로 참여 가능 — 참여 불가는 정반대." },
        { label: "C", type: "extreme_word", note: "'must buy a brand-new laptop'는 과장 — 본문은 대여만 언급." },
        { label: "D", type: "partial_truth", note: "노트북은 '빌리는' 것이지 영구 소유로 주는 것이 아님 — 일부만 맞는 함정." }
      ],
      explanation: "d1p3: 컴퓨터 없는 주민은 안내 데스크에서 노트북을 빌릴 수 있으나 수량 제한 — A가 추론상 정확." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 기사·브랜드·인물 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성(가공 도시 Greenford)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds(d1p1/d1p2/d1p3) 단일 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여(opposite/not_mentioned/wrong_referent/same_word/extreme_word/partial_truth)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage 주제/세부/추론 3문항, 800-850 밴드 난이도" },
    human: { pass: false, reviewer: null, note: "박사 검수 전 — practice" }
  },
  reflectionPrompts: [
    "2번에서 B를 고른 근거 문장(d1p2)을 짚을 수 있는가?",
    "틀렸다면 오답 함정 유형은? (같은단어/부분진실/반대/과장)"
  ],
  version: "2026-06-29"
};
