/* Paralex set · news-003 · 자체작성(original) · documents[]/라우팅 계약 준수.
   100% 백지 original · 실존 브랜드/인물 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-003"] = {
  id: "news-003",
  setKind: "set",
  track: "news",
  genre: "feature",
  scoreBandTarget: "850-900",
  difficultyRank: 4,
  partFocus: ["Part7"],
  skillFocus: ["inference", "referent"],
  trapFocus: ["wrong_referent", "partial_truth", "not_mentioned"],
  vocabBand: "NAWL",
  targetTimeSec: 260,
  title: "A City Tests Free Buses — and Learns Who Really Rides",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 175,
  passage: {
    documents: [
      { id: "d1", label: "Feature Article", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "The transit authority of Veraport,", ko: "베라포트의 교통 당국은,", note: "Veraport=가공 지명" },
          { en: "a mid-sized coastal city,", ko: "중간 규모의 해안 도시인,", note: "동격 삽입구" },
          { en: "has eliminated fares", ko: "요금을 없앴다", note: "eliminate: 없애다/철폐하다" },
          { en: "on three of its busiest bus routes", ko: "가장 붐비는 버스 노선 세 곳에서", note: "" },
          { en: "as part of a year-long experiment.", ko: "1년짜리 실험의 일환으로.", note: "as part of: ~의 일환으로" },
          { en: "Planners hoped", ko: "기획자들은 기대했다", note: "" },
          { en: "that removing the cost of a ticket", ko: "승차권 비용을 없애는 것이", note: "동명사 주어절" },
          { en: "would coax commuters out of their cars", ko: "통근자들을 차에서 끌어낼 것이라고", note: "coax A out of B: A를 B에서 구슬려 끌어내다" },
          { en: "and ease the congestion", ko: "그리고 혼잡을 완화할 것이라고", note: "ease: 완화하다" },
          { en: "that clogs the downtown core each morning.", ko: "매일 아침 도심 중심부를 막히게 하는 (혼잡을).", note: "관계절(congestion 수식)" }
        ]},
        { id: "d1p2", functionLabel: "부연/근거", chunks: [
          { en: "Ridership on the free routes climbed sharply,", ko: "무료 노선의 승객 수는 가파르게 올랐다,", note: "ridership: 이용객 수" },
          { en: "rising by nearly a third within four months.", ko: "넉 달 만에 거의 3분의 1 늘면서.", note: "분사구문(부연)" },
          { en: "Yet a survey of the new passengers", ko: "그러나 신규 승객 설문조사는", note: "역접 Yet" },
          { en: "revealed an unexpected pattern:", ko: "예상치 못한 양상을 드러냈다:", note: "" },
          { en: "most of them had previously walked or cycled,", ko: "그들 대부분은 이전에 걷거나 자전거를 탔었고,", note: "had p.p.(대과거)" },
          { en: "not driven.", ko: "운전한 것이 아니라.", note: "not A: A가 아니라" },
          { en: "Only a small fraction", ko: "오직 소수만이", note: "a fraction: 일부/소수" },
          { en: "had given up a car for the bus,", ko: "버스를 위해 차를 포기했고,", note: "give up A for B" },
          { en: "which meant the program eased crowding on sidewalks", ko: "이는 그 프로그램이 인도의 붐빔을 완화했음을 뜻했다", note: "which=앞 절 전체 지시" },
          { en: "more than it thinned traffic on the roads.", ko: "도로의 교통량을 줄인 것보다 더.", note: "it=the program / A more than B" }
        ]},
        { id: "d1p3", functionLabel: "유보/반론", chunks: [
          { en: "Officials remain cautious about expanding the scheme.", ko: "당국은 그 계획을 확대하는 데 신중함을 유지한다.", note: "scheme: 계획/제도" },
          { en: "The lost fare revenue,", ko: "잃어버린 요금 수입은,", note: "lost: 과거분사 수식" },
          { en: "modest while only three routes are free,", ko: "노선이 세 곳뿐일 때는 미미하지만,", note: "삽입 양보구(while)" },
          { en: "would balloon", ko: "급증할 것이다", note: "balloon: (비용이) 급증하다" },
          { en: "if the policy covered the entire network.", ko: "만약 그 정책이 전체 노선망을 포괄한다면.", note: "가정법 if" },
          { en: "Without a new source of funding,", ko: "새로운 재원 없이는,", note: "without: ~없이는" },
          { en: "one administrator warned,", ko: "한 행정관은 경고했다,", note: "삽입 전달절" },
          { en: "the city might be forced to cut service frequency elsewhere,", ko: "도시는 다른 곳에서 운행 빈도를 줄여야 할지도 모른다고,", note: "be forced to: ~하지 않을 수 없다" },
          { en: "trading a popular perk for slower buses", ko: "인기 있는 혜택을 더 느린 버스와 맞바꾸면서", note: "trade A for B: A를 B와 맞바꾸다" },
          { en: "across the rest of the system.", ko: "시스템의 나머지 전역에 걸쳐.", note: "" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "would coax commuters out of their cars", note: "coax A out of B = A를 B에서 (구슬려) 끌어내다" },
    { span: "eased crowding on sidewalks more than it thinned traffic on the roads", note: "A more than B 비교 + it=the program(앞 주어 재지시)" },
    { span: "trading a popular perk for slower buses", note: "trade A for B = A를 B와 맞바꾸다(분사구문, 부대상황)" }
  ],
  vocabulary: [
    { lemma: "coax", pos: "v.", glossKo: "구슬려 ~하게 하다, 달래어 끌어내다", collocation: "coax commuters out of their cars", listTag: "NAWL" },
    { lemma: "congestion", pos: "n.", glossKo: "혼잡, 정체", collocation: "ease the congestion", listTag: "NAWL" },
    { lemma: "ridership", pos: "n.", glossKo: "(대중교통) 이용객 수, 승객 수", collocation: "ridership climbed sharply", listTag: "NAWL" },
    { lemma: "fraction", pos: "n.", glossKo: "일부, 소수, 분수", collocation: "only a small fraction", listTag: "NGSL" },
    { lemma: "balloon", pos: "v.", glossKo: "(비용 등이) 급증하다, 부풀다", collocation: "costs would balloon", listTag: "NAWL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "removing the cost of a ticket would coax commuters out of their cars",
      paraphrase: "making rides free was meant to persuade drivers to leave their cars at home" },
    { sourceSpanId: "d1p2", original: "most of them had previously walked or cycled, not driven",
      paraphrase: "the majority of the new riders used to travel on foot or by bike rather than by car" },
    { sourceSpanId: "d1p3", original: "the city might be forced to cut service frequency elsewhere",
      paraphrase: "the city could have to run buses less often on its other routes" }
  ],
  questions: [
    { no: 1, stem: "What is the main idea of the article?",
      choices: [
        { label: "A", text: "Veraport has made every bus in the city permanently free." },
        { label: "B", text: "A trial of fare-free buses raised ridership but largely missed its main goal." },
        { label: "C", text: "Residents are urging the city to replace buses with cycling lanes." },
        { label: "D", text: "The transit authority announced a major increase in its funding." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p1", "d1p2"],
      skillFocus: ["inference"], trapFocus: ["partial_truth", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "partial_truth", note: "무료는 '세 노선·1년 실험'일 뿐(d1p1) — '모든 버스·영구'는 과장." },
        { label: "C", type: "not_mentioned", note: "자전거 도로로 버스 대체 요구는 근거 없음." },
        { label: "D", type: "not_mentioned", note: "오히려 d1p3는 재원 부족 우려 — 재정 증액 발표 아님." }
      ],
      explanation: "d1p1·d1p2: 요금 무료 시범으로 승객은 늘었으나, 차에서 끌어내 혼잡을 푼다는 본래 목표는 대체로 달성하지 못함. B가 정답." },
    { no: 2, stem: "In paragraph 2, what does \"it\" refer to in \"more than it thinned traffic on the roads\"?",
      choices: [
        { label: "A", text: "the survey of the new passengers" },
        { label: "B", text: "the fare-free program" },
        { label: "C", text: "the bus that riders gave up a car for" },
        { label: "D", text: "the downtown core" }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["referent"], trapFocus: ["wrong_referent"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "survey는 양상을 '드러낸' 주체일 뿐, 인도 붐빔을 완화한 주어가 아님." },
        { label: "C", type: "wrong_referent", note: "the bus는 give up의 목적어 — 비교절의 주어 it과 무관." },
        { label: "D", type: "wrong_referent", note: "downtown core는 d1p1의 혼잡 발생 장소일 뿐 지시 대상 아님." }
      ],
      explanation: "병렬 구조상 'the program eased ... more than it thinned ...'에서 it=the program. B가 정답." },
    { no: 3, stem: "What can be inferred about expanding the program to the whole network?",
      choices: [
        { label: "A", text: "It has already been approved for the entire system." },
        { label: "B", text: "It would quickly eliminate downtown congestion." },
        { label: "C", text: "It could force service cuts elsewhere unless new funding is found." },
        { label: "D", text: "It would pay for itself through higher ridership." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "chronology", note: "당국은 확대에 '신중'할 뿐(d1p3) — 전체망 승인은 아직 일어나지 않음." },
        { label: "B", type: "partial_truth", note: "혼잡 완화는 본래 목표였으나 d1p2에서 대체로 실패 — '신속 해소'는 비약." },
        { label: "D", type: "not_mentioned", note: "승객 증가로 자체 충당된다는 언급 없음 — 오히려 수입 급증 우려." }
      ],
      explanation: "d1p3: 전체 적용 시 요금 손실이 급증하고, 새 재원이 없으면 다른 곳 운행 빈도를 줄여야 할 수 있다. C가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 브랜드/인물 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성(가공 지명 Veraport)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일/명시 근거 존재(d1p1·d1p2·d1p3)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 9개 전부 type 태그 부여(partial_truth/not_mentioned/wrong_referent/chronology)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage feature 주제/지시대상/추론 3문항" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "2번에서 'it'의 지시 대상을 문장의 병렬 구조(eased ... more than it thinned ...)로 짚을 수 있는가?",
    "틀렸다면 오답 함정 유형은? (잘못된 지시대상/부분적 진실/미언급)"
  ],
  version: "2026-06-29"
};
