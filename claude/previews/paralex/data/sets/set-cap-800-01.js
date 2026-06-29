/* Paralex Ladder Capsule · cap-800-01 · 100% 자체작성(original) · 실존 기사 비복제.
   band 800-850 핵심 = paraphrase: 정답은 동의어 치환, same_word/partial_truth 함정 배치. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["cap-800-01"] = {
  id: "cap-800-01",
  setKind: "ladder_capsule",
  track: "news",
  genre: "news_report",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["paraphrase"],
  trapFocus: ["same_word", "partial_truth"],
  vocabBand: "NGSL2k",
  targetTimeSec: 240,
  title: "Harborview Moves to Double Its Bike-Share Network",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 가공 도시/사실 · 실존 기사 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 153,
  passage: {
    documents: [
      { id: "d1", label: "News Article", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "The city of Harborview announced this week", ko: "하버뷰 시는 이번 주 발표했다", note: "주어+동사+시점" },
          { en: "that it will nearly double the size of its public bike-share network", ko: "공용 자전거 공유망의 규모를 거의 두 배로 늘릴 것이라고", note: "that절 목적어 / double: 두 배로 하다" },
          { en: "by next spring.", ko: "내년 봄까지.", note: "by+기한: ~까지" },
          { en: "Officials say the expansion responds to steady demand", ko: "당국은 말한다 / 그 확장이 꾸준한 수요에 부응한다고", note: "respond to: ~에 부응하다" },
          { en: "from commuters who want a cheaper alternative to driving,", ko: "통근자들로부터의 / 운전보다 더 저렴한 대안을 원하는,", note: "who 관계절(commuters 수식)" },
          { en: "and they describe the current system as one of the city's quiet success stories.", ko: "그리고 그들은 현재 시스템을 / 그 도시의 조용한 성공 사례 중 하나로 묘사한다.", note: "describe A as B: A를 B로 묘사하다" }
        ]},
        { id: "d1p2", functionLabel: "부연/근거", chunks: [
          { en: "Under the plan,", ko: "그 계획에 따라,", note: "under: ~에 따라" },
          { en: "sixty new docking stations will be installed", ko: "60개의 새 거치대가 설치될 것이다", note: "수동태 will be installed" },
          { en: "in neighborhoods that currently have little access.", ko: "현재 접근성이 거의 없는 동네들에.", note: "that 관계절 / little: 거의 없는" },
          { en: "The transit department reported", ko: "교통국은 보고했다", note: "" },
          { en: "that ridership rose by forty percent last year,", ko: "작년에 이용객이 40퍼센트 증가했다고,", note: "rise by+수치: ~만큼 증가" },
          { en: "and that most trips were short journeys to nearby train platforms", ko: "그리고 대부분의 이동은 인근 기차 승강장으로의 짧은 여정이었다고", note: "두 번째 that절" },
          { en: "rather than long commutes.", ko: "긴 통근이 아니라.", note: "rather than: ~가 아니라" },
          { en: "Planners hope the additional stations will attract residents", ko: "기획자들은 바란다 / 추가 거치대가 주민들을 끌어들이길", note: "hope (that) 절" },
          { en: "who live too far from the existing docks.", ko: "기존 거치대에서 너무 멀리 사는 (주민들을).", note: "too far: 너무 먼 / who 관계절" }
        ]},
        { id: "d1p3", functionLabel: "유보/반론", chunks: [
          { en: "Not everyone is convinced", ko: "모두가 확신하는 것은 아니다", note: "부분부정 not everyone" },
          { en: "the program will pay for itself.", ko: "그 프로그램이 자체적으로 비용을 충당할 것이라고.", note: "pay for itself: 본전을 뽑다, 자체 채산이 맞다" },
          { en: "Some council members point out", ko: "일부 시의원들은 지적한다", note: "point out: 지적하다" },
          { en: "that maintenance costs have climbed as the fleet ages,", ko: "유지비가 올랐다고 / 차량들이 노후화되면서,", note: "as: ~함에 따라 / climb: (비용이) 오르다" },
          { en: "and they urge the city to secure private sponsorship", ko: "그리고 그들은 시에 촉구한다 / 민간 후원을 확보하라고", note: "urge A to B / secure: 확보하다" },
          { en: "before adding more bicycles to the streets.", ko: "거리에 자전거를 더 추가하기 전에.", note: "before+동명사" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "it will nearly double the size of its public bike-share network", note: "double = 두 배로 하다. nearly double = 거의 두 배로" },
    { span: "most trips were short journeys ... rather than long commutes", note: "A rather than B = B가 아니라 A. 짧은 이동이지 긴 통근이 아님" },
    { span: "the program will pay for itself", note: "pay for itself = (수익으로) 비용을 스스로 충당하다, 채산이 맞다" }
  ],
  vocabulary: [
    { lemma: "expansion", pos: "n.", glossKo: "확장, 확대", collocation: "the expansion responds to demand", listTag: "NGSL" },
    { lemma: "commuter", pos: "n.", glossKo: "통근자", collocation: "demand from commuters", listTag: "NGSL" },
    { lemma: "install", pos: "v.", glossKo: "설치하다", collocation: "stations will be installed", listTag: "NGSL" },
    { lemma: "maintenance", pos: "n.", glossKo: "유지·보수, 정비", collocation: "maintenance costs have climbed", listTag: "NGSL2k" },
    { lemma: "secure", pos: "v.", glossKo: "확보하다", collocation: "secure private sponsorship", listTag: "NGSL2k" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "it will nearly double the size of its public bike-share network",
      paraphrase: "the city plans to greatly enlarge its shared-bicycle system" },
    { sourceSpanId: "d1p2", original: "ridership rose by forty percent last year",
      paraphrase: "use of the bikes increased substantially over the past year" },
    { sourceSpanId: "d1p3", original: "Not everyone is convinced the program will pay for itself",
      paraphrase: "some doubt that the system can cover its own costs" }
  ],
  questions: [
    { no: 1, stem: "What is the article mainly about?",
      choices: [
        { label: "A", text: "A city's plan to greatly enlarge its shared-bicycle system." },
        { label: "B", text: "A decision to double the fees charged for the bike-share network." },
        { label: "C", text: "A new program that adds stations only beside downtown train platforms." },
        { label: "D", text: "A study showing that commuters now prefer driving to cycling." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "'double'과 'bike-share network'를 지문 그대로 가져온 same_word 함정. 그러나 두 배가 되는 것은 망의 규모이지 '요금'이 아님 — 요금 인상은 미언급." },
        { label: "C", type: "partial_truth", note: "train platforms는 d1p2에 실재하나 '오직 도심 승강장 옆에만' 설치는 과장. 거치대는 접근성 낮은 동네에 설치됨." },
        { label: "D", type: "wrong_referent", note: "commuters는 '운전보다 더 저렴한 대안을 원한다'고 했으므로 운전 선호는 정반대 지시." }
      ],
      explanation: "d1p1 핵심: 시가 공용 자전거 공유망을 거의 두 배로 확장. double→greatly enlarge, bike-share network→shared-bicycle system로 동의어 치환한 A가 정답." },
    { no: 2, stem: "What does the transit department's report indicate?",
      choices: [
        { label: "A", text: "Use of the bikes increased substantially during the previous year." },
        { label: "B", text: "Forty new docking stations were installed across the city." },
        { label: "C", text: "Most riders took long commutes to distant train stations." },
        { label: "D", text: "Ridership grew because sixty stations had already been added." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'forty'를 그대로 쓴 same_word 함정 — 그러나 40은 거치대 수가 아니라 이용객 증가율(percent). 거치대는 60개." },
        { label: "C", type: "partial_truth", note: "train platforms로의 이동은 맞지만 'short journeys rather than long commutes'이므로 '긴 통근'은 정반대." },
        { label: "D", type: "not_mentioned", note: "60개 거치대는 아직 설치 전(미래 계획)이며 증가 원인으로 제시되지 않음." }
      ],
      explanation: "d1p2: ridership rose by forty percent → increased substantially로 패러프레이즈한 A가 정답. B는 forty라는 같은 단어로 끌어들이는 매력 오답." },
    { no: 3, stem: "What can be inferred about the critics' position?",
      choices: [
        { label: "A", text: "They doubt the system can eventually cover its own running costs." },
        { label: "B", text: "They want more bicycles added to the streets right away." },
        { label: "C", text: "Rising maintenance costs have already forced the program to shut down." },
        { label: "D", text: "They believe private sponsorship has made the program profitable." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'more bicycles to the streets'를 그대로 쓴 same_word 함정 — 비판자들은 자전거를 더 늘리기 '전에' 신중하라는 입장으로 정반대." },
        { label: "C", type: "partial_truth", note: "유지비 상승은 사실이나 '이미 폐쇄되었다'는 비약. 폐쇄는 언급 없음." },
        { label: "D", type: "not_mentioned", note: "민간 후원은 아직 '확보하라고 촉구'하는 단계 — 수익화 달성은 근거 없음." }
      ],
      explanation: "d1p3: pay for itself를 'cover its own running costs'로 치환. 자체 채산을 의심한다는 A가 정답. B는 같은 단어(bicycles/streets)로 끄는 함정." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "100% 자체작성 original, 가공 도시(Harborview)/가공 통계, 실존 기사·브랜드·인물 비복제", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 문장 미사용·미변형, 백지 작성" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds(d1p1/d1p2/d1p3) 단일 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "각 오답 타입태그 부여, 문항마다 same_word 1개+partial_truth 1개 보장" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage 주제/세부/추론 3문항, paraphrase 정답·same_word 함정 구조" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "각 정답이 지문의 어떤 단어를 '동의어로 바꿔' 표현했는지 한 쌍씩 짚을 수 있는가?",
    "오답 중 지문 단어를 그대로 쓴 same_word 보기를 골랐다면, 그 단어가 가리키는 대상이 실제로 무엇이었는가?"
  ],
  version: "2026-06-29"
};
