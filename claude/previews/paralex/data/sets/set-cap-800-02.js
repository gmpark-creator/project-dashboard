/* Paralex Ladder Capsule · cap-800-02 · 100% 자체작성(original) · 실존 기사 비복제.
   band 800-850 핵심 = paraphrase: 정답은 동의어 치환, same_word/partial_truth 함정 배치. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["cap-800-02"] = {
  id: "cap-800-02",
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
  title: "Maplecrest Overhauls Its Recycling Program",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 가공 도시/사실 · 실존 기사 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 151,
  passage: {
    documents: [
      { id: "d1", label: "News Article", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "The town of Maplecrest unveiled a redesigned recycling program on Monday,", ko: "메이플크레스트 시는 / 개편된 재활용 프로그램을 공개했다 / 월요일에,", note: "unveil: 공개하다" },
          { en: "replacing its color-coded bins", ko: "색깔별 분류 통을 대체하면서", note: "분사구문 replacing / replace A with B" },
          { en: "with a single container that residents no longer sort by hand.", ko: "하나의 통으로 / 주민들이 더 이상 손으로 분류하지 않는.", note: "no longer: 더 이상 ~않다 / that 관계절" },
          { en: "Officials say the change aims to lift participation,", ko: "당국은 말한다 / 그 변화가 참여를 높이는 것을 목표로 한다고,", note: "aim to: ~을 목표로 하다 / lift: 끌어올리다" },
          { en: "which had stalled", ko: "그것은 정체되어 있었다", note: "which 관계절(participation) / stall: 정체되다" },
          { en: "because many households found the old rules confusing.", ko: "많은 가구가 옛 규칙을 혼란스럽게 여겼기 때문에.", note: "find A B: A를 B하게 여기다" }
        ]},
        { id: "d1p2", functionLabel: "부연/근거", chunks: [
          { en: "Under the new system,", ko: "새 시스템에 따라,", note: "under: ~에 따라" },
          { en: "a regional facility separates paper, plastic, and metal automatically after collection.", ko: "한 지역 시설이 / 종이, 플라스틱, 금속을 자동으로 분리한다 / 수거 후에.", note: "separate: 분리하다" },
          { en: "The sanitation office reported", ko: "위생국은 보고했다", note: "" },
          { en: "that contamination of recyclables had reached nearly a third of all material,", ko: "재활용품의 오염이 / 전체 물량의 거의 3분의 1에 달했다고,", note: "reach: ~에 이르다 / a third: 3분의 1" },
          { en: "forcing crews to send usable items to the landfill.", ko: "작업반이 쓸 만한 품목을 매립지로 보내게 만들면서.", note: "분사구문 / force A to B" },
          { en: "Planners expect the automated sorting to lower the fees the town pays per ton.", ko: "기획자들은 기대한다 / 자동 분류가 / 시가 톤당 내는 비용을 낮추기를.", note: "expect A to B / per ton: 톤당" }
        ]},
        { id: "d1p3", functionLabel: "유보/반론", chunks: [
          { en: "Still, some neighborhood groups question", ko: "그래도, 일부 동네 단체들은 의문을 제기한다", note: "still: 그래도 / question: 의문을 제기하다" },
          { en: "whether the promised savings will materialize.", ko: "약속된 절감액이 실현될지를.", note: "materialize: 실현되다" },
          { en: "They note that glass is excluded from the single bin", ko: "그들은 지적한다 / 유리가 단일 통에서 제외된다고", note: "exclude: 제외하다" },
          { en: "and must be dropped off at three central depots,", ko: "그리고 세 곳의 중앙 집하장에 따로 가져다 놔야 한다고,", note: "drop off: 갖다 놓다 / depot: 집하장" },
          { en: "an extra trip that older residents may skip.", ko: "고령 주민들이 건너뛸 수 있는 추가 이동인.", note: "동격 명사구 / may: ~할 수도 있다" },
          { en: "Critics urge the council to add more depots", ko: "비판자들은 시의회에 촉구한다 / 집하장을 더 늘리라고", note: "urge A to B" },
          { en: "before declaring the rollout a success.", ko: "그 시행을 성공이라 선언하기 전에.", note: "declare A B / rollout: 시행" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "replacing its color-coded bins with a single container", note: "replace A with B = A를 B로 대체하다. 색깔 분류 통 → 단일 통" },
    { span: "forcing crews to send usable items to the landfill", note: "force A to B = A가 B하게 만들다. 오염 때문에 멀쩡한 것까지 매립" },
    { span: "whether the promised savings will materialize", note: "materialize = (계획·약속이) 실제로 실현되다. 절감액이 진짜 생길지 의문" }
  ],
  vocabulary: [
    { lemma: "unveil", pos: "v.", glossKo: "공개하다, 발표하다", collocation: "unveiled a redesigned program", listTag: "NGSL2k" },
    { lemma: "participation", pos: "n.", glossKo: "참여", collocation: "the change aims to lift participation", listTag: "NGSL" },
    { lemma: "contamination", pos: "n.", glossKo: "오염", collocation: "contamination of recyclables", listTag: "NGSL2k" },
    { lemma: "exclude", pos: "v.", glossKo: "제외하다", collocation: "glass is excluded from the bin", listTag: "NGSL" },
    { lemma: "materialize", pos: "v.", glossKo: "실현되다", collocation: "the savings will materialize", listTag: "NGSL2k" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "a single container that residents no longer sort by hand",
      paraphrase: "one bin that people do not have to separate themselves" },
    { sourceSpanId: "d1p2", original: "contamination of recyclables had reached nearly a third of all material",
      paraphrase: "close to one third of the collected items were too dirty or mixed to recycle" },
    { sourceSpanId: "d1p3", original: "some neighborhood groups question whether the promised savings will materialize",
      paraphrase: "certain local groups doubt that the expected cost reductions will actually appear" }
  ],
  questions: [
    { no: 1, stem: "What is the article mainly about?",
      choices: [
        { label: "A", text: "A town simplified recycling into one no-sort bin to get more residents to take part." },
        { label: "B", text: "The town introduced new color-coded bins to enforce stricter sorting." },
        { label: "C", text: "Because the old rules confused people, the town ended recycling pickup altogether." },
        { label: "D", text: "Residents petitioned the town to let them keep sorting recyclables by hand." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "'color-coded bins'를 그대로 쓴 same_word 함정 — 그러나 그 색깔 분류 통은 '없애는' 대상이며, 더 엄격한 분류 도입은 언급 없음." },
        { label: "C", type: "partial_truth", note: "옛 규칙이 혼란스러웠다는 건 사실이나 '재활용 수거 자체 폐지'는 비약. 시는 단일 통으로 간소화했을 뿐." },
        { label: "D", type: "opposite", note: "주민의 손분류 청원은 근거 없고, 단일 통은 손분류를 없애는 방향이라 정반대." }
      ],
      explanation: "d1p1 핵심: 색깔 분류 통 → 단일 통으로 간소화해 참여를 높이려는 것. no longer sort by hand→no-sort bin, lift participation→get more residents to take part로 동의어 치환한 A가 정답." },
    { no: 2, stem: "What did the sanitation office report?",
      choices: [
        { label: "A", text: "Nearly a third of the collected recyclables were too contaminated to use and ended up in the landfill." },
        { label: "B", text: "The fees the town pays per ton had already dropped by a third." },
        { label: "C", text: "A regional facility now sorts glass automatically after each collection." },
        { label: "D", text: "Crews had stopped collecting recyclables because of rising contamination." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'per ton'과 'a third'를 그대로 쓴 same_word 함정 — 3분의 1은 오염 비율이고, 톤당 비용 인하는 아직 '기대(expect)'하는 미래일 뿐 달성된 사실이 아님." },
        { label: "C", type: "partial_truth", note: "지역 시설이 자동 분리하는 건 맞지만 대상은 종이·플라스틱·금속 — 유리는 단일 통에서 제외되어 자동 분리되지 않음." },
        { label: "D", type: "not_mentioned", note: "오염 때문에 수거를 중단했다는 내용은 없음 — 보고된 것은 오염률과 매립 전환." }
      ],
      explanation: "d1p2: 위생국 보고 = 오염이 거의 3분의 1에 달해 멀쩡한 품목까지 매립. reached nearly a third→close to a third, send to the landfill→ended up in the landfill로 치환한 A가 정답. B는 per ton/third라는 같은 단어로 끄는 매력 오답." },
    { no: 3, stem: "What can be inferred about the critics' position?",
      choices: [
        { label: "A", text: "They doubt the expected savings will appear and want more glass drop-off sites." },
        { label: "B", text: "The single bin now accepts glass at the three central depots." },
        { label: "C", text: "Older residents may skip the glass trip, so the council has already removed those depots." },
        { label: "D", text: "Critics hailed the rollout as a clear success." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'glass'와 'depots'를 그대로 쓴 same_word 함정 — 유리는 단일 통에서 '제외'되어 집하장에 따로 가져가야 하며, 통이 유리를 받지 않음." },
        { label: "C", type: "partial_truth", note: "고령 주민이 그 이동을 건너뛸 수 있다는 건 사실이나 '시의회가 이미 집하장을 없앴다'는 비약 — 오히려 더 늘리라고 촉구함." },
        { label: "D", type: "opposite", note: "비판자들은 '성공 선언 전에 신중하라'는 입장이라 성공 찬사는 정반대." }
      ],
      explanation: "d1p3: 비판자들은 절감액 실현을 의심하고 유리 집하장 증설을 촉구. savings will materialize→savings will appear, add more depots→want more drop-off sites로 치환한 A가 정답. B는 glass/depots라는 같은 단어로 끄는 함정." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "100% 자체작성 original, 가공 도시(Maplecrest)/가공 통계, 실존 기사·브랜드·인물 비복제", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 문장 미사용·미변형, 백지 작성. cap-800-01(자전거공유)과 다른 주제(재활용 개편)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds(d1p1/d1p2/d1p3) 단일 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "각 오답 타입태그 부여, 문항마다 same_word 매력 오답 1개(not_mentioned/wrong_referent)+partial_truth 1개 보장" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage 주제/세부/추론 3문항, paraphrase 정답·same_word 함정 구조" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "각 정답이 지문의 어떤 표현을 동의어로 바꿔 말했는지 한 쌍씩 짚을 수 있는가?",
    "오답 중 지문 단어를 그대로 가져온 same_word 보기를 골랐다면, 그 단어가 실제로 가리킨 대상은 무엇이었는가?"
  ],
  version: "2026-06-29"
};
