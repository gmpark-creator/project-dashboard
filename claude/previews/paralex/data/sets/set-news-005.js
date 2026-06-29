/* Paralex set · news-005 · 자체작성(original) · 가공 동네 주말 농산물 직거래 장터 지역뉴스.
   실존 브랜드/인물 비포함, 백지 original. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-005"] = {
  id: "news-005",
  setKind: "set",
  track: "news",
  genre: "news_report",
  scoreBandTarget: "750-800",
  difficultyRank: 2,
  partFocus: ["Part7"],
  skillFocus: ["scanning", "paraphrase"],
  trapFocus: ["same_word", "not_mentioned"],
  vocabBand: "NGSL2k",
  targetTimeSec: 200,
  title: "Weekend Farmers Market Opens in Maplewood",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 131,
  passage: {
    documents: [
      { id: "d1", label: "Local News", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "Starting this Saturday,", ko: "이번 토요일부터,", note: "" },
          { en: "the town of Maplewood will host", ko: "메이플우드 마을은 열 것이다", note: "host: 개최하다" },
          { en: "a new farmers market in the central square.", ko: "새 농산물 직거래 장터를 / 중앙 광장에서.", note: "" },
          { en: "Local growers will sell", ko: "지역 재배 농가들이 판매할 것이다", note: "grower: 재배 농가" },
          { en: "fresh fruit, vegetables, and homemade bread", ko: "신선한 과일, 채소, 그리고 직접 만든 빵을", note: "homemade: 직접 만든" },
          { en: "every weekend from morning until noon.", ko: "매주 주말 / 아침부터 정오까지.", note: "from A until B" }
        ]},
        { id: "d1p2", functionLabel: "부연/세부", chunks: [
          { en: "Organizers say the market", ko: "주최 측은 말한다 / 그 장터가", note: "organizer: 주최자" },
          { en: "will give nearby farms a place", ko: "인근 농장들에게 자리를 줄 거라고", note: "give A B: A에게 B를 주다" },
          { en: "to sell their goods directly to shoppers,", ko: "물건을 직접 손님에게 팔 / (자리를),", note: "directly: 직접" },
          { en: "without using a middleman.", ko: "중간 상인 없이.", note: "without -ing" },
          { en: "Visitors can also enjoy", ko: "방문객들은 또한 즐길 수 있다", note: "" },
          { en: "live music and a small play area for children.", ko: "라이브 음악과 / 아이들을 위한 작은 놀이 공간을.", note: "play area: 놀이 공간" }
        ]},
        { id: "d1p3", functionLabel: "안내/마무리", chunks: [
          { en: "Parking near the square is limited,", ko: "광장 근처 주차는 제한적이다,", note: "limited: 제한된" },
          { en: "so the town encourages residents", ko: "그래서 마을은 주민들에게 권한다", note: "encourage A to B" },
          { en: "to walk or take the free shuttle bus.", ko: "걷거나 / 무료 셔틀버스를 타라고.", note: "free: 무료의" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "will give nearby farms a place to sell their goods directly", note: "give A B(4형식) + to부정사 수식: '농장에 직접 팔 자리를 준다'" },
    { span: "the town encourages residents to walk or take the free shuttle bus", note: "encourage A to B = A에게 B하도록 권하다" }
  ],
  vocabulary: [
    { lemma: "host", pos: "v.", glossKo: "(행사를) 개최하다, 열다", collocation: "host a market", listTag: "NGSL" },
    { lemma: "grower", pos: "n.", glossKo: "재배 농가, 생산자", collocation: "local growers", listTag: "NGSL2k" },
    { lemma: "middleman", pos: "n.", glossKo: "중간 상인, 중개인", collocation: "without using a middleman", listTag: "NGSL2k" },
    { lemma: "encourage", pos: "v.", glossKo: "권하다, 장려하다", collocation: "encourage residents to walk", listTag: "NGSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p2", original: "sell their goods directly to shoppers, without using a middleman",
      paraphrase: "sell products straight to customers instead of through a go-between" },
    { sourceSpanId: "d1p3", original: "the town encourages residents to walk or take the free shuttle bus",
      paraphrase: "the town suggests people come on foot or use the no-cost shuttle" }
  ],
  questions: [
    { no: 1, stem: "What is the article mainly about?",
      choices: [
        { label: "A", text: "A new weekend farmers market opening in Maplewood." },
        { label: "B", text: "A plan to close the central square for repairs." },
        { label: "C", text: "A shortage of fresh vegetables in local stores." },
        { label: "D", text: "A change to the town's weekday bus schedule." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["scanning"], trapFocus: ["not_mentioned"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "광장 보수·폐쇄 언급 없음. 광장은 장터 장소로만 등장." },
        { label: "C", type: "not_mentioned", note: "채소 부족 언급 없음. 오히려 신선 채소를 판매." },
        { label: "D", type: "not_mentioned", note: "평일 버스 시간표 변경 근거 없음. 셔틀은 주말 장터 안내일 뿐." }
      ],
      explanation: "d1p1이 핵심: 메이플우드에 새 주말 농산물 장터가 연다. A가 정답." },
    { no: 2, stem: "According to the organizers, what advantage does the market offer farms?",
      choices: [
        { label: "A", text: "It pays farms a fixed monthly salary." },
        { label: "B", text: "It lets farms sell directly to shoppers without a middleman." },
        { label: "C", text: "It provides farms with free farming equipment." },
        { label: "D", text: "It delivers farm goods to homes every morning." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["not_mentioned"],
      distractorRationales: [
        { label: "A", type: "not_mentioned", note: "고정 급여 지급 언급 없음." },
        { label: "C", type: "not_mentioned", note: "무료 농기구 제공 근거 없음." },
        { label: "D", type: "not_mentioned", note: "가정 배달 언급 없음. '직접 손님에게 판매'와 다름." }
      ],
      explanation: "d1p2: 인근 농장이 중간 상인 없이 손님에게 직접 팔 자리를 줌. B가 정확한 패러프레이즈." },
    { no: 3, stem: "What does the town suggest visitors do because parking is limited?",
      choices: [
        { label: "A", text: "Reserve a parking spot in the central square in advance." },
        { label: "B", text: "Visit the market only on weekday mornings." },
        { label: "C", text: "Walk or ride the free shuttle bus." },
        { label: "D", text: "Buy bread and vegetables before noon." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["scanning"], trapFocus: ["same_word"],
      distractorRationales: [
        { label: "A", type: "same_word", note: "본문 'parking'을 그대로 끌어쓴 함정 — 예약하라는 안내는 없고, 광장 주차는 '제한적'이라고만 함." },
        { label: "B", type: "not_mentioned", note: "장터는 주말 운영. 평일 아침 방문 안내 없음." },
        { label: "D", type: "not_mentioned", note: "빵·채소를 정오 전에 사라는 안내 없음. 운영시간(아침~정오) 정보와 혼동 유도." }
      ],
      explanation: "d1p3: 주차가 제한적이라 마을이 도보 또는 무료 셔틀버스 이용을 권함. C가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 기사·브랜드·인물 비포함, 제3자 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재(d1p1/d1p2/d1p3)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, same_word 매력 오답 1개(3번 A)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage 주제/세부/세부 3문항" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "3번에서 본문 단어 'parking'을 그대로 쓴 오답(A)에 끌리지 않았는가?",
    "각 정답의 근거 문장(d1p1/d1p2/d1p3)을 본문에서 바로 짚을 수 있는가?"
  ],
  version: "2026-06-29"
};
