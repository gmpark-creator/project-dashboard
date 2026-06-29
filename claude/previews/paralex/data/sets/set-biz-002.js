/* Paralex set · biz-002 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   토익 Part7 비즈니스 이메일 장르 모사. 백지 신규 창작. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-002"] = {
  id: "biz-002",
  setKind: "set",
  track: "business",
  genre: "email",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["purpose", "scanning"],
  trapFocus: ["wrong_referent", "not_mentioned"],
  vocabBand: "BSL",
  targetTimeSec: 220,
  title: "Customer Support Email: Refund Processing for a Cancelled Order",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 151,
  passage: {
    documents: [
      { id: "d1", label: "Support Email", paragraphs: [
        { id: "d1p1", functionLabel: "인사/목적", chunks: [
          { en: "Dear Valued Customer,", ko: "고객님께,", note: "이메일 격식 인사" },
          { en: "Thank you for contacting our Customer Care team", ko: "저희 고객지원팀에 연락 주셔서 감사합니다", note: "Thank you for + 동명사" },
          { en: "regarding the cancellation of your recent order.", ko: "최근 주문 취소 건과 관련하여.", note: "regarding: ~에 관하여" },
          { en: "We are writing to confirm", ko: "확인해 드리고자 이 글을 씁니다", note: "be writing to: ~하고자 메일을 쓰다(목적)" },
          { en: "that the cancellation has been processed", ko: "취소가 처리되었음을", note: "현재완료 수동태" },
          { en: "and that a full refund will be issued", ko: "그리고 전액 환불이 진행될 것임을", note: "will be issued: 수동태 미래" },
          { en: "to your original payment method.", ko: "원래 결제 수단으로.", note: "" }
        ]},
        { id: "d1p2", functionLabel: "일정/방법", chunks: [
          { en: "Please allow five to seven business days", ko: "영업일 기준 5~7일을 잡아 주십시오", note: "allow + 기간: ~의 시간을 두다" },
          { en: "for the refunded amount to appear on your statement.", ko: "환불 금액이 명세서에 나타나기까지.", note: "for A to do: A가 ~하기까지" },
          { en: "If the order was paid by credit card,", ko: "주문이 신용카드로 결제되었다면,", note: "조건절" },
          { en: "the amount will be returned to the same card.", ko: "그 금액은 동일 카드로 반환됩니다", note: "" },
          { en: "Customers who paid by bank transfer", ko: "계좌 이체로 결제하신 고객은", note: "who 관계절" },
          { en: "must submit a copy of their bank details", ko: "은행 정보 사본을 제출하셔야 합니다", note: "must submit: 의무" },
          { en: "so that the funds can be deposited correctly.", ko: "자금이 정확히 입금될 수 있도록.", note: "so that: ~하도록" }
        ]},
        { id: "d1p3", functionLabel: "안내/마무리", chunks: [
          { en: "You may upload the required document", ko: "필요 서류를 업로드하실 수 있습니다", note: "may: 가능" },
          { en: "through the secure link in your account portal.", ko: "계정 포털의 보안 링크를 통해.", note: "through: ~을 통해" },
          { en: "Should you have any further questions,", ko: "추가 문의가 있으시면,", note: "If you should have의 도치(가정법)" },
          { en: "please reply to this email directly.", ko: "이 이메일에 직접 회신해 주십시오.", note: "" },
          { en: "We appreciate your patience", ko: "기다려 주셔서 감사드립니다", note: "" },
          { en: "throughout this process.", ko: "이 과정 내내.", note: "throughout: ~동안 내내" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "We are writing to confirm that the cancellation has been processed", note: "be writing to confirm = 확인하고자 메일을 씁니다. 이메일 목적 빈출 표현" },
    { span: "Please allow five to seven business days for the refunded amount to appear", note: "allow + 기간 + for A to do = A가 ~하기까지 (기간)을 두십시오" },
    { span: "Should you have any further questions", note: "If you should have...의 도치(가정법). '혹시 ~가 있으면'" }
  ],
  vocabulary: [
    { lemma: "cancellation", pos: "n.", glossKo: "취소", collocation: "the cancellation of your order", listTag: "BSL" },
    { lemma: "issue", pos: "v.", glossKo: "(환불·서류를) 발급하다, 진행하다", collocation: "a refund will be issued", listTag: "BSL" },
    { lemma: "business day", pos: "n.", glossKo: "영업일", collocation: "allow five to seven business days", listTag: "BSL" },
    { lemma: "bank transfer", pos: "n.", glossKo: "계좌 이체", collocation: "paid by bank transfer", listTag: "BSL" },
    { lemma: "deposit", pos: "v.", glossKo: "입금하다, 예치하다", collocation: "the funds can be deposited", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "a full refund will be issued to your original payment method",
      paraphrase: "you will get all of your money back through the way you originally paid" },
    { sourceSpanId: "d1p2", original: "Customers who paid by bank transfer must submit a copy of their bank details",
      paraphrase: "If you paid by transfer, you need to send your account information" },
    { sourceSpanId: "d1p3", original: "You may upload the required document through the secure link in your account portal",
      paraphrase: "The needed file can be submitted via the protected link on your account page" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the email?",
      choices: [
        { label: "A", text: "To confirm that a cancelled order is being refunded." },
        { label: "B", text: "To promote a new payment method." },
        { label: "C", text: "To apologize for a delayed shipment." },
        { label: "D", text: "To request a customer satisfaction review." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "결제 수단(카드/이체)은 환불 방법 맥락일 뿐 신규 결제수단 홍보 아님." },
        { label: "C", type: "not_mentioned", note: "배송 지연·사과는 지문에 없음." },
        { label: "D", type: "not_mentioned", note: "만족도 평가 요청 언급 없음." }
      ],
      explanation: "d1p1: 'We are writing to confirm that the cancellation has been processed and that a full refund will be issued'가 목적을 명시. A가 정답." },
    { no: 2, stem: "What must customers who paid by bank transfer do?",
      choices: [
        { label: "A", text: "Wait seven business days before contacting support." },
        { label: "B", text: "Submit a copy of their bank details." },
        { label: "C", text: "Visit a branch office in person." },
        { label: "D", text: "Re-enter their credit card number." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "5~7 영업일은 환불 반영 기간이지 이체 고객의 의무 행동이 아님." },
        { label: "C", type: "not_mentioned", note: "지점 방문 요구 없음 — 업로드는 온라인 포털." },
        { label: "D", type: "wrong_referent", note: "카드 재입력은 카드 결제 맥락이며 이체 고객 절차 아님." }
      ],
      explanation: "d1p2: 'Customers who paid by bank transfer must submit a copy of their bank details'. B가 정답." },
    { no: 3, stem: "What is suggested about the required document?",
      choices: [
        { label: "A", text: "It can be uploaded online through the account portal." },
        { label: "B", text: "It must be mailed as a paper copy." },
        { label: "C", text: "It is needed from every customer." },
        { label: "D", text: "It will be prepared by the support team." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3", "d1p2"],
      skillFocus: ["scanning"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "우편 발송 요구 없음 — 보안 링크 업로드." },
        { label: "C", type: "wrong_referent", note: "서류는 이체 결제 고객에게만 해당, 모든 고객 아님." },
        { label: "D", type: "not_mentioned", note: "지원팀이 서류를 준비한다는 언급 없음 — 고객이 제출." }
      ],
      explanation: "d1p3: 'You may upload the required document through the secure link in your account portal' — 포털 온라인 업로드. A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자·실존 브랜드 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 환불 안내 이메일" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 실재 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그(wrong_referent/not_mentioned) 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 email — 목적(purpose)/세부(scanning)/추론(scanning)" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "목적 문항(1번)에서 결제수단·배송 같은 '맥락상 등장 단어' 오답(wrong_referent)에 끌리지 않았는가?",
    "2번·3번처럼 '카드 결제'와 '계좌 이체' 조건이 갈릴 때 어느 절차가 누구에게 걸리는지 분리했는가?"
  ],
  version: "2026-06-29"
};
