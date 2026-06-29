/* Paralex set · biz-008 · 자체작성(original) · documents[]/라우팅 계약.
   토익 Part7 비즈니스 'form'(안내문) 장르 모사. 백지 신규 창작. 기출 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-008"] = {
  id: "biz-008",
  setKind: "set",
  track: "business",
  genre: "form",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["scanning", "purpose"],
  trapFocus: ["not_mentioned", "wrong_referent", "same_word"],
  vocabBand: "TSL",
  targetTimeSec: 215,
  title: "Notice: Registration for the Food Safety Certification Course",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 150,
  passage: {
    documents: [
      { id: "d1", label: "Training Notice", paragraphs: [
        { id: "d1p1", functionLabel: "안내/목적", chunks: [
          { en: "Registration is now open", ko: "등록이 지금 열렸습니다", note: "Registration is open: 등록 접수 시작" },
          { en: "for the autumn session of the Food Safety Certification Course,", ko: "식품안전 인증 과정의 가을 기수에 대해,", note: "session: 기수/회차" },
          { en: "offered by the Training Center at Meridian Food Processing.", ko: "메리디언 식품가공의 교육센터가 제공하는.", note: "offered by: ~가 제공하는(후치수식)" },
          { en: "The course covers hygiene standards, equipment handling, and quality control", ko: "이 과정은 / 위생 기준, 장비 취급, 품질 관리를 다룹니다", note: "cover: (주제를) 다루다" },
          { en: "over a six-week period beginning September 8.", ko: "9월 8일에 시작하는 6주 기간에 걸쳐.", note: "over a period: ~기간에 걸쳐" },
          { en: "Spaces are limited, so early registration is encouraged.", ko: "자리가 한정되어 있으니, 조기 등록이 권장됩니다.", note: "spaces are limited: 정원 한정" }
        ]},
        { id: "d1p2", functionLabel: "자격요건/신청방법", chunks: [
          { en: "The program is open to current employees", ko: "이 프로그램은 / 재직 중인 직원에게 열려 있습니다", note: "open to: ~에게 열린(대상)" },
          { en: "who have completed at least three months of service.", ko: "최소 3개월의 근속을 마친.", note: "at least: 최소 / service: 근속" },
          { en: "To enroll, submit the online application form available on the staff portal,", ko: "등록하려면, / 직원 포털에서 이용 가능한 온라인 신청서를 제출하십시오,", note: "available on: ~에서 이용 가능한" },
          { en: "along with a brief statement of approval from your supervisor.", ko: "상사의 승인 진술서와 함께.", note: "along with: ~와 함께" },
          { en: "Incomplete forms will not be processed.", ko: "미비한 양식은 처리되지 않습니다.", note: "incomplete: 미비한/불완전한" },
          { en: "Applications must be received by August 25.", ko: "신청서는 / 8월 25일까지 접수되어야 합니다.", note: "be received by: ~까지 접수되다(마감)" }
        ]},
        { id: "d1p3", functionLabel: "환불규정/문의", chunks: [
          { en: "A refundable deposit of 40 dollars is required at the time of registration.", ko: "환불 가능한 40달러의 보증금이 / 등록 시점에 요구됩니다.", note: "refundable deposit: 환불 가능 보증금" },
          { en: "The deposit will be returned in full to participants who attend every session.", ko: "보증금은 / 모든 회차에 출석한 참가자에게 전액 반환됩니다.", note: "in full: 전액으로" },
          { en: "Those who withdraw after the first week will forfeit the deposit.", ko: "첫 주 이후에 철회하는 사람은 / 보증금을 잃게 됩니다.", note: "withdraw: 철회하다 / forfeit: 몰수당하다" },
          { en: "No partial refunds will be granted.", ko: "부분 환불은 허용되지 않습니다.", note: "partial: 부분적인" },
          { en: "Questions may be directed to the Training Center.", ko: "문의는 / 교육센터로 보내시면 됩니다.", note: "be directed to: ~로 보내지다" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "offered by the Training Center at Meridian Food Processing", note: "offered by ... = 과거분사 후치수식. '~가 제공하는 과정'" },
    { span: "who have completed at least three months of service", note: "현재완료 + at least = 자격요건 표현. '최소 3개월 근속한'" },
    { span: "Those who withdraw after the first week will forfeit the deposit", note: "Those who ... = ~하는 사람들. 조건부 환불 규정의 핵심 문장" }
  ],
  vocabulary: [
    { lemma: "registration", pos: "n.", glossKo: "등록, 신청", collocation: "registration is now open", listTag: "TSL" },
    { lemma: "enroll", pos: "v.", glossKo: "등록하다, 수강 신청하다", collocation: "to enroll, submit the form", listTag: "TSL" },
    { lemma: "refundable", pos: "adj.", glossKo: "환불 가능한", collocation: "a refundable deposit", listTag: "BSL" },
    { lemma: "forfeit", pos: "v.", glossKo: "(권리·돈을) 잃다, 몰수당하다", collocation: "forfeit the deposit", listTag: "NAWL" },
    { lemma: "eligible", pos: "adj.", glossKo: "자격이 있는", collocation: "eligible to apply for the program", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p2", original: "The program is open to current employees who have completed at least three months of service",
      paraphrase: "Staff who have worked for the company for three months or more may apply" },
    { sourceSpanId: "d1p3", original: "The deposit will be returned in full to participants who attend every session",
      paraphrase: "Anyone who shows up to all the classes gets their entire deposit back" },
    { sourceSpanId: "d1p2", original: "Incomplete forms will not be processed",
      paraphrase: "Applications that are missing information will be rejected" }
  ],
  questions: [
    { no: 1, stem: "What is the purpose of the notice?",
      choices: [
        { label: "A", text: "To invite employees to sign up for a training course." },
        { label: "B", text: "To announce the opening of a new processing plant." },
        { label: "C", text: "To report the results of a quality control inspection." },
        { label: "D", text: "To revise the company's hygiene standards." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["same_word", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "same_word", note: "'processing'은 회사명(Meridian Food Processing)에서만 등장 — 새 공장 개설 안내가 아님." },
        { label: "C", type: "not_mentioned", note: "'quality control'은 과정에서 다루는 주제일 뿐, 점검 결과 보고가 아님." },
        { label: "D", type: "not_mentioned", note: "'hygiene standards'는 교육 내용 항목 — 기준을 개정한다는 언급 없음." }
      ],
      explanation: "d1p1: 'Registration is now open ... Course'가 안내문의 목적. 직원에게 교육 과정 등록을 안내하는 글이므로 A가 정답." },
    { no: 2, stem: "Who is eligible to apply for the program?",
      choices: [
        { label: "A", text: "Employees who have worked at the company for at least three months." },
        { label: "B", text: "Supervisors who approve their staff's applications." },
        { label: "C", text: "New hires still within their first month of service." },
        { label: "D", text: "Customers of the food processing company." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "상사는 승인 진술서를 써 주는 역할일 뿐, 지원 대상이 아님." },
        { label: "C", type: "opposite", note: "최소 3개월 근속이 요건 — 1개월 미만 신입은 정반대로 자격 미달." },
        { label: "D", type: "not_mentioned", note: "고객은 대상으로 언급되지 않음(현 재직 직원 한정)." }
      ],
      explanation: "d1p2: 'open to current employees who have completed at least three months of service'. A가 정답." },
    { no: 3, stem: "What happens to participants who attend every session?",
      choices: [
        { label: "A", text: "They receive a full refund of the deposit." },
        { label: "B", text: "They forfeit the deposit they paid." },
        { label: "C", text: "They are charged an additional fee." },
        { label: "D", text: "They are enrolled in the next session automatically." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["scanning"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "보증금 몰수는 '첫 주 이후 철회한' 사람에게 적용 — 전원 출석자와 정반대." },
        { label: "C", type: "not_mentioned", note: "추가 요금 부과는 지문에 없음." },
        { label: "D", type: "not_mentioned", note: "다음 기수 자동 등록은 언급되지 않음." }
      ],
      explanation: "d1p3: 'returned in full to participants who attend every session'. 전 회차 출석 시 전액 환불이므로 A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 안내문(form)" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거(d1p1~d1p3) 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, same_word 1개(1번 B) 포함" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 form 안내문 — 목적/세부(scanning) 3문항 구성" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "1번 목적 문항에서 'processing'·'quality control'처럼 지문 단어를 그대로 쓴 오답에 휘둘리지 않았는가?",
    "환불 규정처럼 조건(전원 출석 vs 중도 철회)에 따라 결과가 갈리는 문장을 정확히 매칭했는가?"
  ],
  version: "2026-06-29"
};
