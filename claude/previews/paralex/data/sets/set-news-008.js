/* Paralex set · set-news-008 · 자체작성(original) · documents[]/라우팅 계약 준수.
   가공 도시(Marlowe)·가공 기관 일반 뉴스, 실존 브랜드/인물 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-008"] = {
  id: "news-008",
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
  title: "Marlowe Triples Its Public Bike-Share Network",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제 · 가공 도시 Marlowe",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 150,
  passage: {
    documents: [
      { id: "d1", label: "News Article", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "The city of Marlowe", ko: "말로우 시가", note: "주어(가공 도시명)" },
          { en: "has announced plans to triple", ko: "발표했다 / 세 배로 늘릴 계획을", note: "현재완료, triple: 세 배로 만들다" },
          { en: "the size of its public bike-share program", ko: "그것의 공공 자전거 공유 프로그램의 규모를", note: "of+명사구(수식)" },
          { en: "by the end of next year.", ko: "내년 말까지.", note: "by: ~까지(완료 기한)" },
          { en: "Starting in the spring,", ko: "봄부터 시작하여,", note: "분사구(시점)" },
          { en: "two hundred new docking stations", ko: "200개의 새 거치대가", note: "docking station: 거치대" },
          { en: "will be added across the eastern and southern districts,", ko: "동부와 남부 지구 전역에 추가될 것이다,", note: "수동태 will be added, across: 전역에" },
          { en: "areas that the current network barely reaches.", ko: "현재 망이 거의 닿지 않는 지역들인.", note: "동격 명사구, that 관계절, barely: 거의 ~않다" }
        ]},
        { id: "d1p2", functionLabel: "부연/근거", chunks: [
          { en: "Transit officials say", ko: "교통 당국은 말한다", note: "" },
          { en: "that ridership has grown steadily", ko: "이용량이 꾸준히 늘었다고", note: "ridership: 이용객 수, steadily: 꾸준히" },
          { en: "since the program first opened three years ago,", ko: "그 프로그램이 3년 전 처음 개시된 이래로,", note: "since: ~이래로" },
          { en: "with many riders using the bikes", ko: "많은 이용자들이 그 자전거를 이용하면서", note: "with+명사+분사(부대상황)" },
          { en: "to reach train stations during rush hour.", ko: "혼잡 시간대에 기차역에 닿기 위해.", note: "to부정사(목적), rush hour: 혼잡 시간" },
          { en: "To keep the bikes affordable,", ko: "그 자전거를 저렴하게 유지하기 위해,", note: "to부정사(목적), affordable: 저렴한" },
          { en: "the city will hold the basic monthly fee at its current level", ko: "시는 기본 월 요금을 현재 수준으로 유지할 것이다", note: "hold A at B: A를 B로 유지하다" },
          { en: "even after the expansion.", ko: "확대 이후에도.", note: "even after: ~이후에도" }
        ]},
        { id: "d1p3", functionLabel: "유보/세부", chunks: [
          { en: "For riders who do not use a smartphone,", ko: "스마트폰을 사용하지 않는 이용자들을 위해,", note: "without 대신 who 관계절" },
          { en: "the city plans to install card readers", ko: "시는 카드 단말기를 설치할 계획이다", note: "plan to: ~할 계획이다, card reader: 카드 단말기" },
          { en: "at every new station,", ko: "모든 새 정류장에,", note: "" },
          { en: "though these machines may arrive a few weeks later", ko: "비록 이 기계들은 몇 주 늦게 도착할 수 있지만", note: "though: 비록 ~지만, may: ~일 수도" },
          { en: "than the docks themselves.", ko: "거치대 자체보다.", note: "비교급 than, dock: 거치대" },
          { en: "Officials hope the wider network", ko: "당국은 바란다 / 더 넓어진 망이", note: "hope (that) S V" },
          { en: "will give residents without cars", ko: "차가 없는 주민들에게 줄 것을", note: "give A B(4형식), without: ~없이" },
          { en: "a cheaper and greener way to move around the city.", ko: "도시를 돌아다니는 더 저렴하고 친환경적인 방법을.", note: "greener: 더 친환경적인, move around: 돌아다니다" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "areas that the current network barely reaches", note: "동격(areas) + that 관계절. barely = '거의 ~않다'(준부정어)" },
    { span: "the city will hold the basic monthly fee at its current level", note: "hold A at B = 'A를 B 수준으로 유지하다'. 요금 동결을 뜻함" },
    { span: "these machines may arrive a few weeks later than the docks", note: "비교급 later than = '~보다 늦게'. 단말기가 거치대보다 늦게 옴" }
  ],
  vocabulary: [
    { lemma: "triple", pos: "v.", glossKo: "세 배로 만들다", collocation: "triple the size of the program", listTag: "NGSL" },
    { lemma: "district", pos: "n.", glossKo: "지구, 구역", collocation: "the eastern and southern districts", listTag: "NGSL" },
    { lemma: "ridership", pos: "n.", glossKo: "이용객 수", collocation: "ridership has grown steadily", listTag: "NGSL" },
    { lemma: "affordable", pos: "adj.", glossKo: "저렴한, 감당할 만한", collocation: "keep the bikes affordable", listTag: "NGSL" },
    { lemma: "install", pos: "v.", glossKo: "설치하다", collocation: "install card readers", listTag: "NGSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "two hundred new docking stations will be added across the eastern and southern districts",
      paraphrase: "the city will build many more bike stations in areas the system did not cover well" },
    { sourceSpanId: "d1p2", original: "the city will hold the basic monthly fee at its current level even after the expansion",
      paraphrase: "the standard monthly price will stay the same despite the larger network" },
    { sourceSpanId: "d1p3", original: "the city plans to install card readers at every new station",
      paraphrase: "people will be able to pay with a card, not only a phone, at the new docks" }
  ],
  questions: [
    { no: 1, stem: "What is the article mainly about?",
      choices: [
        { label: "A", text: "Marlowe plans to greatly expand its public bike-share network into more districts." },
        { label: "B", text: "Marlowe will shut down its bike-share program because of low demand." },
        { label: "C", text: "Marlowe is replacing all of its buses and trains with shared bicycles." },
        { label: "D", text: "Marlowe is sharply raising the monthly fee for its bike-share riders." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1", "d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "본문은 규모를 세 배로 '확대' — 폐쇄·저조한 수요는 정반대(ridership는 꾸준히 증가)." },
        { label: "C", type: "not_mentioned", note: "버스·기차를 자전거로 '대체'한다는 언급 없음 — 오히려 기차역 접근을 보완." },
        { label: "D", type: "opposite", note: "d1p2는 기본 월 요금을 현재 수준으로 '유지' — 대폭 인상은 정반대." }
      ],
      explanation: "d1p1·d1p2: 말로우 시가 거치대를 동·남부 지구로 확대해 자전거 공유망을 세 배로 키우는 것이 핵심. A가 정확한 패러프레이즈." },
    { no: 2, stem: "According to transit officials, why has the program been successful?",
      choices: [
        { label: "A", text: "Because the city gave away free bicycles to every resident." },
        { label: "B", text: "Because ridership has risen steadily, with many riders reaching train stations during rush hour." },
        { label: "C", text: "Because the bikes are mainly used by tourists visiting the city." },
        { label: "D", text: "Because the program has always covered the eastern and southern districts." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["same_word", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "not_mentioned", note: "자전거 무상 배포 언급 없음 — 본문은 공유(대여) 이용." },
        { label: "C", type: "wrong_referent", note: "이용자는 혼잡 시간대 통근 '주민'이지 관광객이 아님 — 대상 혼동." },
        { label: "D", type: "same_word", note: "'eastern and southern districts'는 d1p1의 '확대 대상' 표현을 그대로 가져온 미끼 — 그곳은 현재 망이 거의 닿지 않는 지역." }
      ],
      explanation: "d1p2: 3년 전 개시 이래 이용량이 꾸준히 늘었고, 많은 이용자가 혼잡 시간대 기차역 접근에 자전거를 씀. B가 정답." },
    { no: 3, stem: "What can be inferred about riders who do not use a smartphone?",
      choices: [
        { label: "A", text: "They will be able to pay with a card, though the readers may come somewhat later than the docks." },
        { label: "B", text: "They will be completely unable to use the new bike stations." },
        { label: "C", text: "They must buy a smartphone before they are allowed to ride." },
        { label: "D", text: "They will receive a permanent discount that other riders do not get." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["partial_truth", "extreme_word"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "카드 단말기가 모든 새 정류장에 설치 예정 — 전혀 이용 불가는 정반대." },
        { label: "C", type: "extreme_word", note: "'must buy a smartphone'는 과장 — 본문은 비(非)스마트폰 이용자를 위한 카드 결제를 마련." },
        { label: "D", type: "partial_truth", note: "단말기가 늦게 올 수 있다는 '지연'만 사실 — 영구 할인 제공은 본문에 없는 추가 진술." }
      ],
      explanation: "d1p3: 스마트폰 미사용자를 위해 모든 새 정류장에 카드 단말기를 설치하되 거치대보다 몇 주 늦을 수 있음 — A가 추론상 정확." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 기사·브랜드·인물 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성(가공 도시 Marlowe·가공 교통당국)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds(d1p1/d1p2/d1p3) 단일 근거로 정답 유일 도출" },
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
