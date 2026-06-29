/* Paralex set · biz-005 · 자체작성(original) · documents[]/라우팅 계약.
   토익 Part7 비즈니스 letter 장르 모사. 백지 신규 창작, 격식체·고난도. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-005"] = {
  id: "biz-005",
  setKind: "set",
  track: "business",
  genre: "letter",
  scoreBandTarget: "900-950",
  difficultyRank: 5,
  partFocus: ["Part7"],
  skillFocus: ["inference", "referent"],
  trapFocus: ["partial_truth", "wrong_referent", "extreme_word"],
  vocabBand: "BSL",
  targetTimeSec: 265,
  title: "Letter: Request to Renegotiate Supply Contract Terms",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 170,
  passage: {
    documents: [
      { id: "d1", label: "Business Letter", paragraphs: [
        { id: "d1p1", functionLabel: "서두/목적", chunks: [
          { en: "Dear Valued Partner of Greylin Supply,", ko: "그레일린 서플라이의 소중한 파트너께,", note: "격식 서신 호칭(가공 상호)" },
          { en: "I am writing on behalf of Marrowfield Processing", ko: "저는 / 마로필드 프로세싱을 대표하여 / 이 글을 씁니다", note: "on behalf of: ~을 대표하여" },
          { en: "to formally request a review of the terms", ko: "조건들의 재검토를 / 공식적으로 요청하고자", note: "request a review of: ~의 재검토를 요청" },
          { en: "set out in our current supply agreement,", ko: "우리의 현행 공급 계약에 명시된,", note: "set out: 명시·규정된(과거분사 후치수식)" },
          { en: "which is due for renewal next quarter.", ko: "그것은 / 다음 분기에 갱신 예정인,", note: "be due for: ~할 예정인" },
          { en: "Recent shifts in raw-material costs and shipping schedules", ko: "원자재 비용과 운송 일정의 최근 변동이", note: "shifts in: ~의 변동" },
          { en: "have prompted us to seek adjustments", ko: "우리로 하여금 / 조정을 모색하도록 / 촉발했습니다", note: "prompt A to do" },
          { en: "that we trust will serve both parties.", ko: "양측 모두에게 도움이 되리라 / 우리가 믿는.", note: "serve both parties: 양측에 이롭다" }
        ]},
        { id: "d1p2", functionLabel: "세부 제안", chunks: [
          { en: "Specifically, we propose that the standard delivery window be shortened", ko: "구체적으로, 우리는 / 표준 납기 기간이 단축되기를 / 제안합니다", note: "propose that + 동사원형(가정법 현재)" },
          { en: "from twenty-one days to fourteen,", ko: "21일에서 14일로,", note: "from A to B" },
          { en: "and that the unit price be revised downward by four percent", ko: "그리고 단가가 / 4퍼센트만큼 하향 조정되기를,", note: "revised downward by: ~만큼 하향" },
          { en: "in exchange for a higher guaranteed volume.", ko: "더 높은 보장 물량의 대가로.", note: "in exchange for: ~의 대가로" },
          { en: "We would also ask that the quality clause be tightened,", ko: "우리는 또한 / 품질 조항이 강화되기를 / 요청드립니다,", note: "ask that + 동사원형" },
          { en: "with rejected batches replaced at no additional charge.", ko: "불합격 배치는 / 추가 비용 없이 교체되는 조건으로.", note: "with + 명사 + 분사(부대상황)" }
        ]},
        { id: "d1p3", functionLabel: "조건부 제안/맺음", chunks: [
          { en: "Should these adjustments prove acceptable,", ko: "혹시 이 조정들이 수용 가능한 것으로 판명된다면,", note: "If these should prove...의 도치(가정법)" },
          { en: "we are prepared to commit to a two-year exclusive arrangement,", ko: "우리는 / 2년 독점 약정에 전념할 / 준비가 되어 있습니다,", note: "be prepared to: ~할 준비가 됨" },
          { en: "which would assure your firm of steady orders.", ko: "그것은 / 귀사에 안정적인 주문을 보장할 것입니다.", note: "assure A of B" },
          { en: "We remain open to discussing alternatives", ko: "우리는 / 대안을 논의하는 데 / 열려 있습니다", note: "remain open to + 동명사" },
          { en: "and would welcome a meeting before the end of the month.", ko: "그리고 / 월말 이전의 면담을 / 환영합니다.", note: "" },
          { en: "Please regard this letter as the opening of a constructive dialogue rather than a fixed demand.", ko: "이 서신을 / 고정된 요구가 아니라 / 건설적 대화의 시작으로 / 여겨 주시기 바랍니다.", note: "regard A as B; A rather than B" },
          { en: "We look forward to your reply.", ko: "귀하의 회신을 / 고대합니다.", note: "look forward to + 명사" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "Should these adjustments prove acceptable", note: "If these should prove...의 도치(가정법). '혹시 ~로 판명된다면'" },
    { span: "in exchange for a higher guaranteed volume", note: "in exchange for = ~의 대가로. 교환 조건 명시" },
    { span: "regard this letter as ... rather than a fixed demand", note: "regard A as B(A를 B로 여기다) + A rather than B(B가 아니라 A)" }
  ],
  vocabulary: [
    { lemma: "set out", pos: "phr.", glossKo: "(문서에) 명시하다, 규정하다", collocation: "the terms set out in the agreement", listTag: "BSL" },
    { lemma: "revise", pos: "v.", glossKo: "수정하다, 조정하다", collocation: "the unit price be revised downward", listTag: "BSL" },
    { lemma: "tighten", pos: "v.", glossKo: "(조항·규정을) 강화하다, 죄다", collocation: "tighten the quality clause", listTag: "BSL" },
    { lemma: "constructive", pos: "adj.", glossKo: "건설적인", collocation: "a constructive dialogue", listTag: "NAWL" },
    { lemma: "in exchange for", pos: "phr.", glossKo: "~의 대가로, ~와 맞바꾸어", collocation: "in exchange for a higher volume", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "Recent shifts in raw-material costs and shipping schedules have prompted us to seek adjustments",
      paraphrase: "Changes in material prices and shipping have led us to ask for revised terms" },
    { sourceSpanId: "d1p2", original: "the unit price be revised downward by four percent in exchange for a higher guaranteed volume",
      paraphrase: "a four-percent lower price in return for a promise to order more" },
    { sourceSpanId: "d1p3", original: "Please regard this letter as the opening of a constructive dialogue rather than a fixed demand",
      paraphrase: "This letter is meant to start a discussion, not to impose firm conditions" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the letter?",
      choices: [
        { label: "A", text: "To propose revised terms for an existing supply agreement." },
        { label: "B", text: "To cancel the supply agreement immediately." },
        { label: "C", text: "To confirm a two-year exclusive deal that has already been agreed upon." },
        { label: "D", text: "To complain about defective goods received last quarter." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["inference"], trapFocus: ["extreme_word", "wrong_referent", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "extreme_word", note: "'cancel ... immediately'는 과장 — 서신은 재검토·조정 요청이지 즉시 해지가 아님." },
        { label: "C", type: "wrong_referent", note: "2년 독점은 조건부 제안(Should ... prove acceptable)일 뿐 이미 합의된 것이 아님." },
        { label: "D", type: "partial_truth", note: "품질 조항은 언급되나 '불량 항의'가 목적은 아님 — 부분적 사실." }
      ],
      explanation: "d1p1: 'formally request a review of the terms set out in our current supply agreement'. 재협상 제안이 목적 — A가 정답." },
    { no: 2, stem: "What does Marrowfield offer in return for a lower unit price?",
      choices: [
        { label: "A", text: "A higher guaranteed volume of orders." },
        { label: "B", text: "Payment within fourteen days of delivery." },
        { label: "C", text: "Free replacement of any rejected batches." },
        { label: "D", text: "An immediate doubling of all orders." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["referent"], trapFocus: ["wrong_referent", "partial_truth", "extreme_word"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'fourteen'은 납기 기간(21→14일)이지 결제 기한이 아님 — 숫자 출처 혼동." },
        { label: "C", type: "partial_truth", note: "불합격 배치 무상 교체는 별개의 품질 조항 요청 — 단가 인하의 교환 조건이 아님." },
        { label: "D", type: "extreme_word", note: "'immediate doubling'은 본문에 없는 과장 — guaranteed volume의 증대일 뿐." }
      ],
      explanation: "d1p2: 'the unit price be revised downward by four percent in exchange for a higher guaranteed volume'. 단가 인하의 대가는 더 높은 보장 물량 — A가 정답." },
    { no: 3, stem: "What is implied about Marrowfield's position?",
      choices: [
        { label: "A", text: "It is willing to negotiate rather than impose fixed terms." },
        { label: "B", text: "It refuses to consider any alternative proposals." },
        { label: "C", text: "It has already secured an exclusive contract." },
        { label: "D", text: "It is concerned only with shipping schedules." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["extreme_word", "wrong_referent", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "extreme_word", note: "'refuses ... any'는 정반대의 과장 — 'remain open to discussing alternatives'와 충돌." },
        { label: "C", type: "wrong_referent", note: "독점 계약은 조건이 수용될 경우의 미래 약정 — 이미 확보된 것이 아님." },
        { label: "D", type: "partial_truth", note: "운송 일정은 조정 '계기'로만 언급 — 유일한 관심사라는 근거 없음." }
      ],
      explanation: "d1p3: 'regard this letter as the opening of a constructive dialogue rather than a fixed demand' + 'remain open to discussing alternatives'. 협상 의지를 암시 — A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음(가공 상호)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 letter" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재(d1p1/d1p2/d1p3)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 type 태그 부여(partial_truth/wrong_referent/extreme_word)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 letter — 목적/세부(referent)/추론(inference), 900-950 격식 고난도" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "1번에서 'cancel immediately' 같은 극단어(extreme_word)와 '불량 항의' 같은 부분적 사실에 흔들리지 않았는가?",
    "2번처럼 같은 숫자(14)가 납기/결제 등 다른 대상에 걸릴 때, 지시 대상(referent)을 정확히 추적했는가?"
  ],
  version: "2026-06-29"
};
