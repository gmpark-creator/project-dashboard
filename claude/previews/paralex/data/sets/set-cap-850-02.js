/* Paralex set · cap-850-02 · 자체작성(original) · Ladder Capsule (2-document 연계지문).
   토익 Part7 multi-passage(주문확인 이메일+청구서) 모사. 백지 신규 창작, 기출 비복제, 실존 브랜드/인물 없음. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["cap-850-02"] = {
  id: "cap-850-02",
  setKind: "ladder_capsule",
  track: "business",
  genre: "email",
  scoreBandTarget: "850-900",
  difficultyRank: 4,
  partFocus: ["Part6", "Part7"],
  skillFocus: ["multi_passage", "referent"],
  trapFocus: ["wrong_referent"],
  vocabBand: "BSL",
  targetTimeSec: 300,
  title: "Order Confirmation & Invoice: Meadowfold Processing",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 연계지문 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 192,
  passage: {
    documents: [
      { id: "d1", label: "Email", paragraphs: [
        { id: "d1p1", functionLabel: "확인/주문정보", chunks: [
          { en: "Dear Mr. Halvorsen,", ko: "할보르센 씨께,", note: "이메일 인사말" },
          { en: "Thank you for the wholesale order", ko: "도매 주문에 감사드립니다", note: "thank you for + 명사" },
          { en: "you placed with Meadowfold Processing on June 3.", ko: "귀하가 6월 3일에 메도우폴드 프로세싱에 넣으신.", note: "place an order: 주문하다 (회사명·날짜 가공)" },
          { en: "Your order, number MP-4471, has been confirmed", ko: "귀하의 주문, 번호 MP-4471은, 확정되었으며", note: "현재완료 수동태 · 주문번호 연결고리" },
          { en: "and is scheduled to ship within three business days.", ko: "그리고 영업일 3일 이내에 발송될 예정입니다.", note: "be scheduled to + 동사원형" }
        ]},
        { id: "d1p2", functionLabel: "청구/정책 안내", chunks: [
          { en: "The attached invoice lists each item separately.", ko: "첨부된 청구서에 각 품목이 개별적으로 기재되어 있습니다.", note: "두 번째 문서로의 연결 신호" },
          { en: "Please note that the loyalty credit you requested", ko: "귀하가 요청하신 적립 크레딧은", note: "loyalty credit: 적립 할인" },
          { en: "has been applied only to the dried-fruit items,", ko: "건과일 품목에만 적용되었음을, 유의해 주십시오,", note: "only to ~: ~에만 — 핵심 함정 지점" },
          { en: "not to the bottled goods.", ko: "병입 제품에는 (적용되지) 않았습니다.", note: "not to ~: ~에는 아님 — wrong_referent 유도" },
          { en: "If any item arrives damaged,", ko: "어떤 품목이든 파손되어 도착하면,", note: "조건절" },
          { en: "return it within ten days for a full refund.", ko: "10일 이내에 반품하시면 전액 환불됩니다.", note: "within ten days: 10일 이내 — 발송 3일과 혼동 유도" },
          { en: "Payment is due no later than June 30.", ko: "결제는 늦어도 6월 30일까지입니다.", note: "no later than: 늦어도 ~까지 · 6월 3일과 혼동 유도" }
        ]}
      ]},
      { id: "d2", label: "Invoice", paragraphs: [
        { id: "d2p1", functionLabel: "청구 명세", chunks: [
          { en: "Invoice MP-4471 — Meadowfold Processing", ko: "청구서 MP-4471 — 메도우폴드 프로세싱", note: "청구서 제목 · 이메일 주문번호와 교차참조" },
          { en: "Item 1: Dried-apricot trays, 40 units, $320.", ko: "품목 1: 건살구 트레이, 40개, 320달러.", note: "건과일 — 크레딧 적용 대상" },
          { en: "Item 2: Dried-fig trays, 25 units, $200.", ko: "품목 2: 건무화과 트레이, 25개, 200달러.", note: "건과일 — 크레딧 적용 대상" },
          { en: "Item 3: Bottled pear nectar, 60 units, $540.", ko: "품목 3: 병입 배 넥타, 60개, 540달러.", note: "병입 — 크레딧 제외" },
          { en: "Item 4: Bottled berry nectar, 30 units, $270.", ko: "품목 4: 병입 베리 넥타, 30개, 270달러.", note: "병입 — 크레딧 제외" }
        ]},
        { id: "d2p2", functionLabel: "합계/조건", chunks: [
          { en: "Subtotal before credit: $1,330.", ko: "크레딧 적용 전 소계: 1,330달러.", note: "소계 — 최종액과 혼동 유도" },
          { en: "Loyalty credit on dried-fruit items: -$52.", ko: "건과일 품목 적립 크레딧: -52달러.", note: "크레딧 금액 — 단독 금액 함정" },
          { en: "Total amount due: $1,278.", ko: "납부할 총액: 1,278달러.", note: "최종 청구액" },
          { en: "The refund policy is printed on the reverse side.", ko: "환불 정책은 뒷면에 인쇄되어 있습니다.", note: "정책 문서 연결 신호" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "has been applied only to the dried-fruit items, not to the bottled goods", note: "only to A, not to B 구문. '어느 품목'에 적용됐는지를 청구서 품목과 연결해야 풀림 — wrong_referent 핵심" },
    { span: "return it within ten days for a full refund", note: "'within ten days'(환불 기한)와 'within three business days'(발송 기한)를 헷갈리게 배치 — 같은 within 구문 함정" },
    { span: "Payment is due no later than June 30", note: "no later than = 늦어도 ~까지. 주문일(6월 3일)과 마감일(6월 30일)을 구분해야 함" }
  ],
  vocabulary: [
    { lemma: "invoice", pos: "n.", glossKo: "청구서, 송장", collocation: "the attached invoice lists each item", listTag: "BSL" },
    { lemma: "apply", pos: "v.", glossKo: "적용하다", collocation: "the credit has been applied to", listTag: "BSL" },
    { lemma: "refund", pos: "n.", glossKo: "환불", collocation: "return it for a full refund", listTag: "BSL" },
    { lemma: "due", pos: "adj.", glossKo: "(지불) 기한인, 만기인", collocation: "payment is due no later than", listTag: "BSL" },
    { lemma: "subtotal", pos: "n.", glossKo: "소계", collocation: "subtotal before credit", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "Your order, number MP-4471, has been confirmed and is scheduled to ship within three business days",
      paraphrase: "Order MP-4471 is now finalized and will be dispatched in three working days" },
    { sourceSpanId: "d1p2", original: "the loyalty credit you requested has been applied only to the dried-fruit items, not to the bottled goods",
      paraphrase: "the discount was given solely on the dried fruit and excluded the bottled products" },
    { sourceSpanId: "d2p2", original: "Total amount due: $1,278",
      paraphrase: "The final balance payable comes to 1,278 dollars" }
  ],
  questions: [
    { no: 1, stem: "According to the email, what should Mr. Halvorsen do if an item arrives damaged?",
      choices: [
        { label: "A", text: "Return it within ten days for a full refund." },
        { label: "B", text: "Pay the balance by June 30." },
        { label: "C", text: "Reship the order within three business days." },
        { label: "D", text: "Request a new loyalty credit." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "6월 30일은 결제 마감일이지 파손 시 행동이 아님 — 다른 안내를 가져온 함정." },
        { label: "C", type: "wrong_referent", note: "'영업일 3일 이내'는 판매자의 발송 일정이지 구매자의 반품 조건이 아님 — within 구문 혼동." },
        { label: "D", type: "not_mentioned", note: "크레딧 재요청은 언급된 바 없음." }
      ],
      explanation: "d1p2: 'If any item arrives damaged, return it within ten days for a full refund.' A가 정답." },
    { no: 2, stem: "Based on both documents, which invoice items received the loyalty credit?",
      choices: [
        { label: "A", text: "Items 1 and 2" },
        { label: "B", text: "Items 3 and 4" },
        { label: "C", text: "All four items" },
        { label: "D", text: "Item 3 only" }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2", "d2p1"],
      skillFocus: ["multi_passage", "referent"], trapFocus: ["wrong_referent"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "품목 3·4는 병입 제품 — 이메일이 명시적으로 크레딧에서 제외한 항목." },
        { label: "C", type: "too_broad", note: "크레딧은 건과일에만 적용됨 — 전 품목으로 확대한 함정." },
        { label: "D", type: "wrong_referent", note: "품목 3은 병입 제품이며 단독 적용 대상도 아님 — 엉뚱한 품목 참조." }
      ],
      explanation: "교차참조: d1p2에서 크레딧은 '건과일 품목에만' 적용. d2p1에서 건과일은 품목 1(건살구)·품목 2(건무화과) → A가 정답." },
    { no: 3, stem: "Based on both documents, what is the total price of the items that did NOT receive the credit?",
      choices: [
        { label: "A", text: "$810" },
        { label: "B", text: "$520" },
        { label: "C", text: "$540" },
        { label: "D", text: "$1,278" }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2", "d2p1"],
      skillFocus: ["multi_passage", "referent"], trapFocus: ["wrong_referent"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "$520은 건과일(품목 1+2) 합계 — 오히려 크레딧을 받은 쪽임. 적용/제외를 뒤집은 함정." },
        { label: "C", type: "partial_truth", note: "$540은 품목 3(배 넥타) 단일 가격 — 병입 제품의 일부만 계산." },
        { label: "D", type: "too_broad", note: "$1,278은 크레딧 적용 후 전체 납부 총액 — '제외 품목'만 묻는 질문에 전액을 끌어온 함정." }
      ],
      explanation: "교차참조: d1p2에서 크레딧 제외 = 병입 제품. d2p1에서 병입은 품목 3($540) + 품목 4($270) = $810 → A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 실존 브랜드/인물 없음(가공명)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 주문확인 이메일+청구서 연계지문" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 실재 근거 존재(2·3번은 d1+d2 교차참조로 유일해 풀림)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, 핵심 함정=wrong_referent(어느 문서·품목인지 혼동)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 연계지문(이메일+청구서) — 교차참조 품목/금액 추적, 850-900 난도" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "3번에서 '크레딧을 받은 품목'(건과일)과 '받지 못한 품목'(병입)을 뒤집어 고르지 않았는가? only/not 구문을 품목 가격과 정확히 연결했는가?",
    "이메일은 '어느 부류'에 크레딧이 적용됐는지만, 청구서는 '품목별 가격'만 준다 — 두 문서를 한쪽만 보고 답을 고르려 하지 않았는가?"
  ],
  version: "2026-06-29"
};
