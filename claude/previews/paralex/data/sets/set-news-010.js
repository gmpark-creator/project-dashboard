/* Paralex set · set-news-010 · 자체작성(original) · documents[]/라우팅 계약 준수.
   가공 도시(Verndale)·가공 노선/교통당국 일반 뉴스, 실존 브랜드/인물 비복제.
   ★ paragraphs[]에 functionLabel 미포함(단일 지문처럼 읽히도록 구조 힌트 제거). */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-010"] = {
  id: "news-010",
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
  title: "Verndale Opens Its First Light-Rail Line to the North",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제 · 가공 도시 Verndale",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 190,
  passage: {
    documents: [
      { id: "d1", label: "News Article", paragraphs: [
        { id: "d1p1", chunks: [
          { en: "The city of Verndale", ko: "번데일 시는", note: "주어(가공 도시명)" },
          { en: "will open its first light-rail line, the Riverside Line,", ko: "첫 경전철 노선인 리버사이드 라인을 개통할 것이다,", note: "light-rail: 경전철, 동격(the Riverside Line)" },
          { en: "next month,", ko: "다음 달,", note: "시점 부사구" },
          { en: "connecting the downtown core to the fast-growing northern suburbs.", ko: "도심부와 빠르게 성장하는 북부 교외를 잇는.", note: "분사구 connecting A to B, suburb: 교외" },
          { en: "The eleven-kilometer route will serve nine stations,", ko: "11킬로미터 구간은 아홉 개 역을 지난다,", note: "serve: (노선이) 운행·연결하다" },
          { en: "several of which sit in neighborhoods", ko: "그중 여럿은 동네에 자리한", note: "several of which: 관계대명사(부분 표현)" },
          { en: "that until now have relied entirely on crowded buses.", ko: "지금까지 혼잡한 버스에 전적으로 의존해 온.", note: "rely on: 의존하다, entirely: 전적으로" }
        ]},
        { id: "d1p2", chunks: [
          { en: "Transit officials say", ko: "교통 당국은 말한다", note: "" },
          { en: "the new trains will run every eight minutes during peak hours", ko: "새 열차가 혼잡 시간대에 8분마다 운행하며", note: "every eight minutes: 8분마다, peak hours: 혼잡 시간" },
          { en: "and should cut the typical commute from the north by nearly half.", ko: "북부에서의 통상 통근 시간을 거의 절반으로 줄일 것이라고.", note: "cut A by half: A를 절반으로 줄이다, commute: 통근" },
          { en: "To encourage residents to try the service,", ko: "주민들이 그 서비스를 시도하도록 유도하기 위해,", note: "to부정사(목적), encourage A to V" },
          { en: "rides will be free for the first three months;", ko: "처음 석 달간 탑승은 무료다;", note: "free: 무료, for the first three months: 처음 석 달간" },
          { en: "after that, a standard fare will apply,", ko: "그 이후에는 표준 요금이 적용된다,", note: "apply: 적용되다, fare: 요금" },
          { en: "though it will match the existing bus fare rather than exceed it.", ko: "다만 그것은 기존 버스 요금을 초과하지 않고 그에 맞출 것이다.", note: "match: 같게 맞추다, rather than: ~하기보다, exceed: 초과하다" }
        ]},
        { id: "d1p3", chunks: [
          { en: "Not every station will be fully ready on opening day.", ko: "모든 역이 개통일에 완전히 준비되는 것은 아니다.", note: "부분부정 not every: 모두 ~인 것은 아니다" },
          { en: "While the platforms and trains will operate on schedule,", ko: "승강장과 열차는 예정대로 운행되지만,", note: "while: ~지만(대조), on schedule: 예정대로" },
          { en: "the elevators at three of the northern stops are still being installed", ko: "북부 정거장 세 곳의 엘리베이터는 아직 설치 중이며", note: "be being installed: 설치되는 중(진행 수동태)" },
          { en: "and may not be finished until early summer.", ko: "초여름까지 완료되지 않을 수 있다.", note: "not ... until: ~에야 비로소, may: ~일 수도" },
          { en: "Officials say riders who cannot use the stairs", ko: "당국은 말한다 / 계단을 이용할 수 없는 승객은", note: "who 관계절(주격)" },
          { en: "should, in the meantime, board at the downtown stations,", ko: "그동안 도심 역에서 탑승해야 한다고,", note: "in the meantime: 그동안, board: 탑승하다" },
          { en: "where lifts are already working.", ko: "그곳은 승강기가 이미 작동 중인.", note: "where 관계부사, lift: 승강기(=elevator)" },
          { en: "They hope the line will eventually ease road traffic", ko: "그들은 바란다 / 그 노선이 결국 도로 교통을 완화하고", note: "hope (that) S V, ease: 완화하다" },
          { en: "and give the northern districts a faster link to jobs in the center.", ko: "북부 지구에 도심 일자리로의 더 빠른 연결을 줄 것을.", note: "give A B(4형식), link to: ~로의 연결" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "several of which sit in neighborhoods that until now have relied entirely on crowded buses", note: "several of which = 관계대명사 부분 표현. that 관계절이 neighborhoods를 수식 — '버스에만 의존하던 동네'" },
    { span: "it will match the existing bus fare rather than exceed it", note: "match A rather than exceed A = 'A를 초과하기보다 A에 맞추다'. 신노선 요금이 버스 요금과 동일함을 뜻함" },
    { span: "the elevators ... are still being installed and may not be finished until early summer", note: "진행 수동(be being installed) + not ... until = '초여름에야 완료'. 엘리베이터만 지연됨" }
  ],
  vocabulary: [
    { lemma: "connect", pos: "v.", glossKo: "연결하다, 잇다", collocation: "connecting downtown to the suburbs", listTag: "NGSL" },
    { lemma: "commute", pos: "n.", glossKo: "통근, 통근 거리·시간", collocation: "cut the typical commute by half", listTag: "NGSL" },
    { lemma: "fare", pos: "n.", glossKo: "(교통) 요금", collocation: "a standard fare will apply", listTag: "NGSL" },
    { lemma: "install", pos: "v.", glossKo: "설치하다", collocation: "the elevators are still being installed", listTag: "NGSL" },
    { lemma: "ease", pos: "v.", glossKo: "완화하다, 덜다", collocation: "ease road traffic", listTag: "NGSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "will open its first light-rail line ... connecting the downtown core to the fast-growing northern suburbs",
      paraphrase: "the city is launching a new rail service that links the city center with its growing northern areas" },
    { sourceSpanId: "d1p2", original: "rides will be free for the first three months; after that, a standard fare will apply, though it will match the existing bus fare",
      paraphrase: "passengers pay nothing at first, and the later price will be the same as the current bus fare" },
    { sourceSpanId: "d1p3", original: "the elevators at three of the northern stops are still being installed and may not be finished until early summer",
      paraphrase: "a few northern stations will not have working elevators until later in the year" }
  ],
  questions: [
    { no: 1, stem: "What is the article mainly about?",
      choices: [
        { label: "A", text: "Verndale is opening a new light-rail line that links its downtown with the northern suburbs." },
        { label: "B", text: "Verndale is closing several bus routes because too few people ride them." },
        { label: "C", text: "Verndale is removing all of its trains and replacing them with new bus lines." },
        { label: "D", text: "Verndale is sharply raising the fares on its existing public transit." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["paraphrase"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "버스 노선 폐지·저조한 이용 언급 없음 — 본문은 새 경전철 '개통'이 핵심." },
        { label: "C", type: "opposite", note: "열차를 버스로 '대체'가 아니라 새 철도 노선을 '추가'하는 것 — 정반대 방향." },
        { label: "D", type: "partial_truth", note: "요금 언급은 있으나 '대폭 인상'이 아니라 석 달 무료 후 버스와 동일 — 핵심 주제도 아님." }
      ],
      explanation: "d1p1: 번데일 시가 도심과 북부 교외를 잇는 첫 경전철 리버사이드 라인을 개통한다는 것이 글 전체의 주제. A가 정확한 패러프레이즈." },
    { no: 2, stem: "What will happen to the fare after the first three months?",
      choices: [
        { label: "A", text: "Rides will remain completely free for all passengers." },
        { label: "B", text: "A standard fare will apply that is the same as the current bus fare." },
        { label: "C", text: "The fare will be set higher than the existing bus fare." },
        { label: "D", text: "Only riders from the northern suburbs will have to pay." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase"], trapFocus: ["partial_truth", "same_word"],
      distractorRationales: [
        { label: "A", type: "partial_truth", note: "무료는 '처음 석 달간'만 — 그 이후에는 표준 요금이 적용되므로 영구 무료는 사실 아님." },
        { label: "C", type: "same_word", note: "'bus fare'를 그대로 가져온 미끼 — 본문은 버스 요금을 '초과하지 않고 그에 맞춘다'고 분명히 함." },
        { label: "D", type: "not_mentioned", note: "북부 주민만 요금을 낸다는 차등 언급 없음 — 표준 요금은 전체 적용." }
      ],
      explanation: "d1p2: 처음 석 달 무료 뒤 표준 요금이 적용되며 그 요금은 기존 버스 요금을 초과하지 않고 동일하게 맞춘다 — B가 정답." },
    { no: 3, stem: "What can be inferred about riders who cannot use the stairs at the northern stops on opening day?",
      choices: [
        { label: "A", text: "They may need to board at downtown stations until the northern elevators are finished." },
        { label: "B", text: "They will be unable to use the Riverside Line at any station." },
        { label: "C", text: "They must wait until early summer before any part of the line opens." },
        { label: "D", text: "They will be given free rides permanently as compensation." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["extreme_word", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "도심 역에는 승강기가 이미 작동 중이라 그곳에서는 탑승 가능 — 어느 역도 못 쓴다는 것은 정반대." },
        { label: "C", type: "extreme_word", note: "초여름까지 미완성인 것은 '북부 정거장 엘리베이터'뿐 — 노선 자체는 예정대로 개통하므로 과장." },
        { label: "D", type: "partial_truth", note: "처음 석 달 무료는 모든 이용자 대상 — 계단 미사용자에게 '영구' 무료를 준다는 보상은 본문에 없는 추가 진술." }
      ],
      explanation: "d1p3: 북부 정거장 세 곳의 엘리베이터가 초여름까지 미완성일 수 있어, 계단 이용이 어려운 승객은 그동안 승강기가 작동하는 도심 역에서 타라고 안내 — A가 추론상 정확." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 기사·브랜드·인물 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성(가공 도시 Verndale·가공 노선 Riverside Line·가공 교통당국)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds(d1p1/d1p2/d1p3) 단일 근거로 정답 유일 도출" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여(opposite/not_mentioned/partial_truth/same_word/extreme_word)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage 주제/세부/추론 3문항, 800-850 밴드 난이도" },
    human: { pass: false, reviewer: null, note: "박사 검수 전 — practice" }
  },
  reflectionPrompts: [
    "2번에서 B를 고른 근거 문장(d1p2)을 짚을 수 있는가? — '버스 요금에 맞춘다'가 핵심.",
    "틀렸다면 오답 함정 유형은? (같은단어/부분진실/반대/과장)"
  ],
  version: "2026-06-30"
};
