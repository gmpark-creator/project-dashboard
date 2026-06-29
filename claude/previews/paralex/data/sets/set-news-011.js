/* Paralex set · news-011 · 자체작성(original) · feature · 750-850 · 균형 논조.
   주제: 지역 농산물 직거래 장터 확대. 실존 기사 비복제 · 실존 도시/인물/브랜드 미사용(전부 가공). 직독직해 ko=어순보존.
   ★디렉터 지시: 문단 functionLabel 제거 — 구조 힌트 없이 단일 지문처럼 읽힘. 문단 id(d1p1..)는 근거 span용으로 유지. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-011"] = {
  id: "news-011",
  setKind: "set",
  track: "news",
  genre: "feature",
  scoreBandTarget: "800-850",
  difficultyRank: 4,
  partFocus: ["Part7"],
  skillFocus: ["inference", "paraphrase", "referent"],
  trapFocus: ["partial_truth", "extreme_word", "wrong_referent", "not_mentioned"],
  vocabBand: "NAWL",
  targetTimeSec: 250,
  title: "When the Market Comes Back to Main Street",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제 · 실존 도시/인물/브랜드 미사용",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 172,
  passage: {
    documents: [
      { id: "d1", label: "Feature Article", paragraphs: [
        { id: "d1p1", chunks: [
          { en: "As shoppers grow wary of long supply chains,", ko: "쇼핑객들이 긴 공급망을 경계하게 되면서,", note: "As+주어+동사(부사절). wary of: ~을 경계하는 / supply chain: 공급망" },
          { en: "a rising number of small towns", ko: "점점 더 많은 작은 도시들이", note: "a rising number of: 점점 더 많은 (복수 취급)" },
          { en: "have reopened weekly markets", ko: "주간 장터를 다시 열었다", note: "reopen: 다시 열다 / weekly market: 주간 장터" },
          { en: "where farmers sell directly to the public.", ko: "농민이 대중에게 직접 파는.", note: "관계부사 where(markets 수식) / sell directly: 직접 판매하다" },
          { en: "Local councils see these stalls", ko: "지역 의회는 이 가판대들을", note: "see A as B: A를 B로 보다(아래 as 연결) / council: 의회 / stall: 가판대" },
          { en: "as a way to keep food money in the region", ko: "식료품 지출을 지역에 묶어 두는 방법으로 본다", note: "keep money in: 돈을 ~에 묶어 두다 / region: 지역" },
          { en: "and to draw weekend visitors downtown.", ko: "그리고 주말 방문객을 도심으로 끌어들이는 (방법으로).", note: "draw ... downtown: 도심으로 끌어들이다 / 두 번째 to부정사 병렬" }
        ]},
        { id: "d1p2", chunks: [
          { en: "The hillside town of Brackenford offers one example.", ko: "언덕배기 마을 브래큰퍼드가 한 사례를 제공한다.", note: "가공 지명. offer an example: 한 사례가 되다" },
          { en: "After its council waived the stall fees for one season,", ko: "의회가 한 시즌 동안 가판대 사용료를 면제한 뒤,", note: "waive: 면제하다 / stall fee: 가판대 사용료 / for one season: 한 시즌 동안" },
          { en: "the number of registered sellers nearly doubled.", ko: "등록 판매자 수가 거의 두 배가 되었다.", note: "registered: 등록된 / nearly double: 거의 두 배가 되다" },
          { en: "Still, the benefits did not reach everyone.", ko: "그렇지만 그 혜택이 모두에게 닿은 것은 아니었다.", note: "still: 그렇지만 / not reach everyone: 모두에게 닿지는 않음(부분 부정)" },
          { en: "Growers who offered something the supermarkets lacked —", ko: "대형 마트에 없는 것을 내놓은 재배농들은 —", note: "grower: 재배농 / lack: ~이 없다 / 관계절(something ... lacked)" },
          { en: "rare apple varieties, raw honey, same-morning greens —", ko: "희귀 사과 품종, 가공 안 한 꿀, 당일 아침 채소 —", note: "동격 나열(something의 구체 예) / raw honey: 비가공 꿀" },
          { en: "kept their regulars", ko: "단골을 지켜 냈다", note: "본동사(Growers ... kept) / regulars: 단골손님" },
          { en: "while those who simply undercut chain prices did not.", ko: "반면 단지 체인점 가격을 후려친 이들은 그러지 못했다.", note: "while: 반면 / undercut: (가격을) 후려치다·밑돌다 / those=growers" }
        ]},
        { id: "d1p3", chunks: [
          { en: "Analysts caution that Brackenford's rebound is hard to repeat.", ko: "분석가들은 브래큰퍼드의 반등이 재현하기 어렵다고 주의를 준다.", note: "caution that: ~라고 주의를 주다 / rebound: 반등 / hard to repeat: 재현하기 어려운" },
          { en: "Dario Quint, who tracks rural commerce, points out", ko: "농촌 상업을 추적하는 다리오 퀸트는 지적한다", note: "가공 인물 / 삽입 관계절 / point out: 지적하다 / rural commerce: 농촌 상업" },
          { en: "that the markets which lasted", ko: "오래간 장터들은", note: "명사절+관계절(주어) / last: 지속되다" },
          { en: "usually stood near a steady stream of foot traffic", ko: "대개 꾸준한 보행 인파 가까이에 있었다고", note: "stand near: ~가까이에 있다 / foot traffic: 보행 인파·유동 인구" },
          { en: "or anchored a wider shopping street.", ko: "또는 더 넓은 상점가의 중심을 잡아 줬다고.", note: "anchor: 중심을 잡다·핵심이 되다 / shopping street: 상점가" },
          { en: "For isolated towns with neither,", ko: "둘 다 없는 외딴 마을에게는,", note: "neither: (유동 인구·상점가) 둘 다 아닌 / isolated: 외딴" },
          { en: "he argues, a fee holiday alone", ko: "그는 주장하길, 사용료 면제 하나만으로는", note: "삽입 he argues / fee holiday: 사용료 면제 기간 / alone: ~만으로는" },
          { en: "seldom keeps stalls full past the first summer.", ko: "첫여름이 지나도록 가판대를 채워 두는 일이 드물다고.", note: "seldom: 좀처럼 ~않다(준부정) / past the first summer: 첫여름을 넘겨" },
          { en: "The revival, he concludes, is real but patchy.", ko: "그 부활은, 그가 결론짓길, 진짜이지만 들쭉날쭉하다고.", note: "revival: 부활 / real: 진짜의 / patchy: 들쭉날쭉한·고르지 않은" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "markets where farmers sell directly to the public", note: "관계부사 where가 markets를 수식 — '농민이 대중에게 직접 파는 장터'. 장소 명사 뒤 where절" },
    { span: "Growers who offered something the supermarkets lacked ... kept their regulars while those who simply undercut chain prices did not", note: "대조 구문 while ... did not(=did not keep their regulars). those=growers 대용, lacked=마트에 없던 것" },
    { span: "a fee holiday alone seldom keeps stalls full past the first summer", note: "준부정어 seldom(좀처럼 ~않다)이 문장 전체를 부정 — '사용료 면제만으로는 첫여름을 넘겨 가판대를 채워 두기 어렵다'" }
  ],
  vocabulary: [
    { lemma: "waive", pos: "v.", glossKo: "면제하다, (권리·요금을) 적용하지 않다", collocation: "waived the stall fees for one season", listTag: "NAWL", nuance: "cancel은 단순 취소 / waive는 '받을 권리가 있는 요금·권리를 의도적으로 면제해 줌' 함의" },
    { lemma: "undercut", pos: "v.", glossKo: "(값을) 후려치다, 더 싸게 팔다", collocation: "undercut chain prices", listTag: "NAWL", nuance: "lower는 단순 인하 / undercut은 '경쟁자보다 일부러 더 낮게 매겨 밑돎' 함의" },
    { lemma: "anchor", pos: "v.", glossKo: "중심을 잡다, 핵심 역할을 하다", collocation: "anchored a wider shopping street", listTag: "NAWL", nuance: "join은 단순 합류 / anchor는 '주변을 끌어 모으는 구심점이 됨' 뉘앙스" },
    { lemma: "rebound", pos: "n.", glossKo: "반등, 회복", collocation: "Brackenford's rebound", listTag: "NAWL", nuance: "change는 단순 변화 / rebound는 '떨어졌다가 다시 올라옴' 함의(되튀어 오름)" },
    { lemma: "patchy", pos: "adj.", glossKo: "들쭉날쭉한, 고르지 않은", collocation: "real but patchy", listTag: "NGSL", nuance: "different는 단순 차이 / patchy는 '곳·때에 따라 있다가 없다가 해 균일하지 않음' 함의" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "a rising number of small towns have reopened weekly markets where farmers sell directly to the public",
      paraphrase: "more and more small towns are bringing back weekly markets in which growers sell straight to shoppers" },
    { sourceSpanId: "d1p2", original: "Growers who offered something the supermarkets lacked kept their regulars while those who simply undercut chain prices did not",
      paraphrase: "sellers who stocked items big stores did not carry held on to their repeat customers, whereas those who only matched chains on price failed to" },
    { sourceSpanId: "d1p3", original: "For isolated towns with neither, a fee holiday alone seldom keeps stalls full past the first summer",
      paraphrase: "In remote towns that have neither steady passersby nor a shopping street, waiving fees by itself rarely keeps the stalls busy beyond the first summer" }
  ],
  questions: [
    { no: 1, stem: "What is the main idea of the article?",
      choices: [
        { label: "A", text: "Weekly farmers' markets have completely shut down every supermarket in small towns." },
        { label: "B", text: "Many small towns are reviving direct-sale markets to keep money local, and sellers offering something distinctive have benefited most, though the gains are uneven." },
        { label: "C", text: "Small towns have abandoned weekly markets because shoppers prefer long supply chains." },
        { label: "D", text: "National authorities have ordered every town to waive all stall fees permanently." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p1", "d1p2"],
      skillFocus: ["inference"], trapFocus: ["extreme_word", "opposite"],
      distractorRationales: [
        { label: "A", type: "extreme_word", note: "'completely shut down every supermarket'는 과장. 본문은 마트에 '없는 것'을 내놓은 재배농이 단골을 지켰다 했을 뿐 마트 전면 폐업은 없음." },
        { label: "C", type: "opposite", note: "d1p1 'have reopened weekly markets' 및 'wary of long supply chains'와 정반대 — 쇼핑객이 긴 공급망을 선호해 장터를 버렸다는 진술 없음." },
        { label: "D", type: "not_mentioned", note: "당국이 모든 마을에 사용료 영구 면제를 명령했다는 진술 없음. 브래큰퍼드 의회가 '한 시즌'만 면제한 사례만 제시." }
      ],
      explanation: "d1p1(작은 도시가 직거래 장터로 지역에 돈을 묶어 두려 함)과 d1p2(고유한 것을 내놓은 재배농이 더 잘됨, 다만 혜택은 고르지 않음)를 종합하면 B가 균형 논지를 정확히 요약. A·C·D는 과장·정반대·미언급." },
    { no: 2, stem: "According to the article, what happened in Brackenford?",
      choices: [
        { label: "A", text: "The number of registered sellers nearly doubled after the council waived stall fees for one season." },
        { label: "B", text: "Seller numbers rose, and the benefits were shared equally among all the stalls." },
        { label: "C", text: "The market kept its regulars mainly by undercutting chain-store prices." },
        { label: "D", text: "The council waived the stall fees permanently to attract new growers." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["paraphrase", "referent"], trapFocus: ["partial_truth", "wrong_referent"],
      distractorRationales: [
        { label: "B", type: "partial_truth", note: "판매자 수가 는 것은 사실이나, 본문은 'the benefits did not reach everyone' — '모든 가판대에 균등 분배'는 사실 일부에 반대 사실을 덧붙인 함정." },
        { label: "C", type: "wrong_referent", note: "단골을 지킨 것은 '마트에 없는 것을 내놓은' 재배농 — 가격을 '후려친(undercut)' 쪽은 오히려 단골을 못 지킴(did not). 주체·방식을 뒤바꾼 지시대상 오류." },
        { label: "D", type: "not_mentioned", note: "사용료 면제는 'for one season'(한 시즌) 한정 — 영구 면제라는 근거 없음." }
      ],
      explanation: "d1p2: 의회가 한 시즌 가판대 사용료를 면제한 뒤 등록 판매자 수가 거의 두 배가 됨. A가 'nearly doubled'의 정확한 패러프레이즈." },
    { no: 3, stem: "What point does Dario Quint make about Brackenford's success?",
      choices: [
        { label: "A", text: "Isolated towns lacking both steady foot traffic and a shopping street rarely keep stalls full past the first summer through a fee holiday alone." },
        { label: "B", text: "Any town can guarantee a permanent market simply by waiving stall fees once." },
        { label: "C", text: "Quint recommends that isolated towns build new shopping streets to draw sellers." },
        { label: "D", text: "The markets that lasted succeeded precisely because they were isolated and had no nearby foot traffic." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference", "referent"], trapFocus: ["extreme_word", "wrong_referent"],
      distractorRationales: [
        { label: "B", type: "extreme_word", note: "'Any town ... guarantee a permanent market simply by'는 과장. d1p3는 부활이 'real but patchy'이며 둘 다 없는 마을은 'seldom keeps stalls full'이라 단서를 붙임." },
        { label: "C", type: "not_mentioned", note: "퀸트가 외딴 마을에 상점가 신설을 권고했다는 진술 없음 — 그는 조건의 유무를 분석할 뿐 처방을 제시하지 않음." },
        { label: "D", type: "wrong_referent", note: "오래간 장터는 '꾸준한 보행 인파 인근'이거나 '상점가의 중심'을 잡은 곳 — 외딴·유동 인구 부재가 '성공 원인'이라는 것은 근거를 정반대로 뒤집은 지시대상 오류." }
      ],
      explanation: "d1p3: 퀸트는 오래간 장터가 대개 꾸준한 보행 인파 가까이 있거나 상점가의 중심이었고, 둘 다 없는 외딴 마을은 사용료 면제 하나로 첫여름을 넘겨 가판대를 채우기 어렵다고 본다. A가 정확. 부활은 '진짜이나 들쭉날쭉하다'." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 기사 비복제, 실존 도시/인물/브랜드 미사용(브래큰퍼드·다리오 퀸트 전부 가공), 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 실재 id(d1p1~d1p3) 근거로 정답 유일 도출" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그(distractorRationales) 부여, extreme_word·opposite·partial_truth·wrong_referent·not_mentioned 분포" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage feature 750-850 주제/세부/추론 3문항" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "1번에서 A(completely shut down every supermarket)를 거른 근거를 본문 d1p2의 어느 구절('something the supermarkets lacked')로 반박하는가?",
    "3번에서 오래간 장터의 결정적 조건(보행 인파 인접·상점가 중심 여부)을 d1p3의 어느 구절로 짚을 수 있는가?"
  ],
  version: "2026-06-30"
};
