/* Paralex set · biz-004 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   토익 Part7 비즈니스 광고(advertisement) 장르 모사. 백지 신규 창작. 가공 브랜드. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-004"] = {
  id: "biz-004",
  setKind: "set",
  track: "business",
  genre: "ad",
  scoreBandTarget: "750-800",
  difficultyRank: 2,
  partFocus: ["Part7"],
  skillFocus: ["scanning", "purpose"],
  trapFocus: ["same_word", "not_mentioned"],
  vocabBand: "TSL",
  targetTimeSec: 190,
  title: "Advertisement: PulseGrove Wellness Studio Spring Membership Offer",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제, 실존 브랜드 미사용",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 119,
  passage: {
    documents: [
      { id: "d1", label: "Advertisement", paragraphs: [
        { id: "d1p1", functionLabel: "광고/혜택", chunks: [
          { en: "Looking for a fresh start to your fitness routine?", ko: "당신의 운동 루틴에 / 새로운 시작을 찾고 계신가요?", note: "광고 도입 의문문(후킹)" },
          { en: "PulseGrove Wellness Studio is now offering", ko: "펄스그로브 웰니스 스튜디오가 / 지금 제공하고 있습니다", note: "be offering: 제공 중(가공 브랜드)" },
          { en: "a New Member Spring Discount.", ko: "신규 회원 봄 할인을.", note: "할인 명칭" },
          { en: "Sign up this month and receive 30 percent off", ko: "이번 달에 가입하시면 / 30퍼센트 할인을 받으세요", note: "명령문+and: ~하면 …" },
          { en: "your first three months of membership.", ko: "멤버십의 첫 3개월에 대해.", note: "할인 적용 범위(첫 3개월)" },
          { en: "Every new plan includes unlimited access", ko: "모든 신규 플랜은 / 무제한 이용을 포함합니다", note: "include: 포함하다" },
          { en: "to our cardio and strength zones,", ko: "유산소 및 근력 구역에 대한,", note: "" },
          { en: "two complimentary personal-training sessions,", ko: "무료 개인 트레이닝 2회,", note: "complimentary = free(무료 제공)" },
          { en: "and free use of the rooftop yoga deck.", ko: "그리고 옥상 요가 데크의 무료 이용.", note: "" }
        ]},
        { id: "d1p2", functionLabel: "기간/가입방법", chunks: [
          { en: "This promotion runs from April 1 through April 30", ko: "이 프로모션은 / 4월 1일부터 4월 30일까지 진행되며", note: "run from A through B: A~B 기간 진행" },
          { en: "and is available to first-time members only.", ko: "그리고 최초 가입 회원에게만 제공됩니다.", note: "first-time members only: 신규 한정" },
          { en: "To enroll, visit our front desk during staffed hours", ko: "가입하시려면, / 직원 근무 시간에 프런트 데스크를 방문하시거나", note: "To enroll: 가입하려면" },
          { en: "or complete the registration form on our website.", ko: "또는 / 저희 웹사이트에서 등록 양식을 작성하세요.", note: "complete the form: 양식 작성" },
          { en: "Bring a valid photo ID to activate your pass.", ko: "이용권을 활성화하려면 / 유효한 사진 신분증을 지참하세요.", note: "activate your pass: 이용권 활성화" },
          { en: "Memberships started during this period are non-transferable,", ko: "이 기간에 시작된 멤버십은 / 양도가 불가하므로,", note: "non-transferable: 양도 불가" },
          { en: "so reserve your spot before the offer ends.", ko: "그러니 / 혜택이 끝나기 전에 자리를 예약하세요.", note: "reserve your spot: 자리 선점" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "Sign up this month and receive 30 percent off", note: "명령문 + and = '~하면 …하게 된다'(조건 함의). 광고 빈출 패턴" },
    { span: "runs from April 1 through April 30", note: "run from A through B = A부터 B까지 (기간) 진행되다. 'through'는 마지막 날 포함" }
  ],
  vocabulary: [
    { lemma: "complimentary", pos: "adj.", glossKo: "무료로 제공되는", collocation: "complimentary personal-training sessions", listTag: "TSL" },
    { lemma: "enroll", pos: "v.", glossKo: "등록하다, 가입하다", collocation: "to enroll, visit our front desk", listTag: "TSL" },
    { lemma: "non-transferable", pos: "adj.", glossKo: "양도 불가한", collocation: "memberships are non-transferable", listTag: "BSL" },
    { lemma: "activate", pos: "v.", glossKo: "활성화하다, 개시시키다", collocation: "activate your pass", listTag: "TSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "Sign up this month and receive 30 percent off your first three months of membership",
      paraphrase: "Join during the month to get a 30 percent reduction on the initial three months" },
    { sourceSpanId: "d1p2", original: "is available to first-time members only",
      paraphrase: "only people who have never joined before can take the offer" }
  ],
  questions: [
    { no: 1, stem: "What is the purpose of the advertisement?",
      choices: [
        { label: "A", text: "To promote a discounted membership for new customers." },
        { label: "B", text: "To announce the opening of a second studio location." },
        { label: "C", text: "To offer free yoga classes to current members." },
        { label: "D", text: "To recruit additional personal trainers for the studio." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["same_word", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "신규 지점 개점에 대한 언급 없음." },
        { label: "C", type: "same_word", note: "'free'·'yoga'가 지문에 나오지만, 무료 요가 데크 이용은 신규 플랜 혜택이지 '기존 회원 무료 강습'이 아님." },
        { label: "D", type: "not_mentioned", note: "personal-training은 회원 혜택일 뿐, 트레이너 채용 광고가 아님." }
      ],
      explanation: "d1p1: 'New Member Spring Discount ... 30 percent off' — 신규 회원 할인 멤버십 홍보가 목적. A가 정답." },
    { no: 2, stem: "What is included with every new membership plan?",
      choices: [
        { label: "A", text: "Two complimentary personal-training sessions." },
        { label: "B", text: "A free fitness tracker device." },
        { label: "C", text: "Thirty percent off all future renewals." },
        { label: "D", text: "Unlimited free guest passes for friends." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["scanning"], trapFocus: ["same_word", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "피트니스 트래커 기기 제공은 지문에 없음." },
        { label: "C", type: "same_word", note: "'30 percent off'를 그대로 재사용했지만 할인은 '첫 3개월'에만 적용 — 향후 갱신 전체가 아님." },
        { label: "D", type: "not_mentioned", note: "동반 게스트 무제한 이용권 언급 없음." }
      ],
      explanation: "d1p1: 'two complimentary personal-training sessions' — 신규 플랜에 무료 PT 2회 포함. A가 정답." },
    { no: 3, stem: "How can a person sign up for the membership?",
      choices: [
        { label: "A", text: "By visiting the front desk or filling out the online form." },
        { label: "B", text: "By mailing a paper application to the studio." },
        { label: "C", text: "By transferring an existing membership." },
        { label: "D", text: "By calling the studio after April 30." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["not_mentioned", "chronology"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "우편 신청 방법은 제시되지 않음." },
        { label: "C", type: "opposite", note: "멤버십은 'non-transferable(양도 불가)' — 양도로 가입 불가, 정반대." },
        { label: "D", type: "chronology", note: "프로모션은 4월 30일에 종료 — 그 이후 연락은 시점이 어긋남." }
      ],
      explanation: "d1p2: 'visit our front desk ... or complete the registration form on our website' — 프런트 방문 또는 온라인 양식. A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자·실존 브랜드 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 광고. 브랜드 PulseGrove 가공명" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재(d1p1/d1p2)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, same_word 오답 2개 포함" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 advertisement — 목적/세부(scanning) 3문항" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "목적 문항(1번)에서 'free'·'yoga'처럼 지문 단어를 그대로 쓴 same_word 오답에 끌리지 않았는가?",
    "혜택 문항(2번)에서 '30 percent off'가 '첫 3개월'에만 걸린다는 적용 범위를 정확히 분리했는가?"
  ],
  version: "2026-06-29"
};
