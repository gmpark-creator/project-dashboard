/* Paralex set · news-001 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   실제 VOA/Wikinews PD 큐레이션은 합법 경로로 교체 예정. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["news-001"] = {
  id: "news-001",
  setKind: "set",
  track: "news",
  genre: "news_report",
  scoreBandTarget: "850-900",
  difficultyRank: 4,
  partFocus: ["Part7"],
  skillFocus: ["paraphrase", "inference", "referent"],
  trapFocus: ["opposite", "not_mentioned", "wrong_referent"],
  vocabBand: "NAWL",
  targetTimeSec: 240,
  title: "Cities Rethink the Four-Day Work Week",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 실존 기사 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 168,
  passage: {
    documents: [
      { id: "d1", label: "News Article", paragraphs: [
        { id: "d1p1", functionLabel: "주제제시", chunks: [
          { en: "A growing number of municipalities", ko: "점점 더 많은 지자체들이", note: "주어(복수)" },
          { en: "are experimenting with a compressed working schedule,", ko: "실험하고 있다 / 단축 근무제를,", note: "experiment with: ~을 실험하다" },
          { en: "hoping that fewer hours at the desk", ko: "바라면서 / 더 적은 근무 시간이", note: "분사구문(=as they hope)" },
          { en: "will not come at the expense of public services.", ko: "공공 서비스를 희생시키지 않을 거라고.", note: "at the expense of: ~을 희생하여" },
          { en: "Early trials suggest", ko: "초기 시도들은 시사한다", note: "" },
          { en: "that productivity need not decline", ko: "생산성이 떨어질 필요는 없다고", note: "need not+동사원형: ~할 필요 없다" },
          { en: "when employees are given an additional day away from the office.", ko: "직원들에게 / 사무실을 벗어난 하루가 더 주어질 때.", note: "수동태 be given" }
        ]},
        { id: "d1p2", functionLabel: "부연/근거", chunks: [
          { en: "In one pilot program,", ko: "한 시범 프로그램에서,", note: "" },
          { en: "city departments reported", ko: "시 부서들은 보고했다", note: "" },
          { en: "that response times to residents' requests", ko: "주민 요청에 대한 응답 시간이", note: "" },
          { en: "actually improved,", ko: "오히려 개선되었다고,", note: "actually: (예상과 달리) 실제로는" },
          { en: "a finding that surprised even the policy's advocates.", ko: "그 정책 지지자들조차 놀라게 한 발견이었다.", note: "동격 명사구+관계절" },
          { en: "Officials attribute the gain to sharper prioritization:", ko: "당국은 그 성과를 / 더 날카로운 우선순위 설정의 덕으로 돌린다:", note: "attribute A to B" },
          { en: "with one less day on the calendar,", ko: "일정에 하루가 줄면서,", note: "with+명사구(부대상황)" },
          { en: "staff were compelled to eliminate meetings", ko: "직원들은 회의를 없앨 수밖에 없었다", note: "be compelled to: ~하지 않을 수 없다" },
          { en: "that had previously consumed entire afternoons.", ko: "이전에는 오후 전체를 잡아먹던 (회의를).", note: "관계절(meetings 수식)" }
        ]},
        { id: "d1p3", functionLabel: "유보/반론", chunks: [
          { en: "Critics caution, however,", ko: "그러나 비판자들은 경고한다,", note: "삽입 however" },
          { en: "that the results may not translate to every sector.", ko: "그 결과가 모든 부문에 적용되진 않을 수 있다고.", note: "translate to: ~로 적용되다" },
          { en: "Roles that depend on continuous coverage,", ko: "지속적인 인력 충원에 의존하는 역할들은,", note: "주어+관계절" },
          { en: "such as emergency dispatch,", ko: "응급 출동 같은,", note: "삽입 예시" },
          { en: "cannot simply be condensed,", ko: "단순히 압축될 수 없다,", note: "수동태" },
          { en: "and some managers worry", ko: "그리고 일부 관리자들은 우려한다", note: "" },
          { en: "that the savings reported so far", ko: "지금까지 보고된 그 이득이", note: "reported: 과거분사 후치수식" },
          { en: "reflect novelty rather than a durable shift", ko: "지속적 변화가 아니라 새로움을 반영한다고", note: "A rather than B" },
          { en: "in how work is organized.", ko: "업무가 조직되는 방식에서의 (변화를).", note: "" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "will not come at the expense of public services", note: "at the expense of A = A를 희생하여" },
    { span: "productivity need not decline", note: "need not + 동사원형 = ~할 필요가 없다(조동사 need)" },
    { span: "reflect novelty rather than a durable shift", note: "A rather than B = B가 아니라 A. '지속적 변화가 아니라 새로움(일시적)을 반영'" }
  ],
  vocabulary: [
    { lemma: "municipality", pos: "n.", glossKo: "지방자치단체, 시", collocation: "a growing number of municipalities", listTag: "NAWL" },
    { lemma: "compressed", pos: "adj.", glossKo: "압축된, 단축된", collocation: "a compressed working schedule", listTag: "BSL" },
    { lemma: "at the expense of", pos: "phr.", glossKo: "~을 희생하여", collocation: "at the expense of quality", listTag: "TSL" },
    { lemma: "attribute A to B", pos: "v.", glossKo: "A를 B의 탓/덕으로 돌리다", collocation: "attribute the gain to prioritization", listTag: "TSL" },
    { lemma: "durable", pos: "adj.", glossKo: "지속적인, 오래가는", collocation: "a durable shift", listTag: "NGSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "fewer hours at the desk will not come at the expense of public services",
      paraphrase: "reducing working hours would not lower the quality of services to the public" },
    { sourceSpanId: "d1p2", original: "staff were compelled to eliminate meetings that had previously consumed entire afternoons",
      paraphrase: "workers were forced to cut out long meetings that used to take up whole afternoons" },
    { sourceSpanId: "d1p3", original: "the savings reported so far reflect novelty rather than a durable shift",
      paraphrase: "the benefits seen until now come from the change being new, not from a lasting improvement" }
  ],
  questions: [
    { no: 1, stem: "What is the main idea of the article?",
      choices: [
        { label: "A", text: "Emergency services have adopted a shorter week nationwide." },
        { label: "B", text: "Some local governments are testing a shorter week without sacrificing service quality." },
        { label: "C", text: "Productivity always falls when offices reduce working hours." },
        { label: "D", text: "Residents have demanded that cities extend office hours." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["inference"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "not_mentioned", note: "응급 서비스는 '압축 불가' 예외로 d1p3에 등장 — 전국 도입은 언급 없음." },
        { label: "C", type: "opposite", note: "d1p1은 'productivity need not decline'로 정반대." },
        { label: "D", type: "not_mentioned", note: "주민의 근무시간 연장 요구는 근거 없음." }
      ],
      explanation: "d1p1이 핵심: 지자체들이 공공 서비스 질을 희생하지 않으면서 단축 근무를 실험. B가 정확한 패러프레이즈." },
    { no: 2, stem: "Why did response times improve in the pilot program?",
      choices: [
        { label: "A", text: "More staff were hired to handle requests." },
        { label: "B", text: "Residents submitted fewer requests overall." },
        { label: "C", text: "Staff prioritized more sharply and cut long meetings." },
        { label: "D", text: "The city extended its emergency dispatch hours." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "not_mentioned", note: "직원 증원 언급 없음. 오히려 'one less day'." },
        { label: "B", type: "not_mentioned", note: "요청 건수 감소 근거 없음." },
        { label: "D", type: "wrong_referent", note: "emergency dispatch는 d1p3의 '압축 불가' 예시일 뿐 개선 원인 아님." }
      ],
      explanation: "d1p2: 개선을 'sharper prioritization' + 회의 제거에 귀속(attribute the gain to). C가 정답." },
    { no: 3, stem: "What concern do critics raise?",
      choices: [
        { label: "A", text: "The benefits may be temporary rather than lasting." },
        { label: "B", text: "Public services have become more expensive." },
        { label: "C", text: "Employees dislike having an extra day off." },
        { label: "D", text: "Every sector can easily adopt the schedule." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "비용 증가 언급 없음." },
        { label: "C", type: "not_mentioned", note: "직원 불만 근거 없음." },
        { label: "D", type: "opposite", note: "비판자들은 '모든 부문에 적용되진 않는다'고 함 — 정반대." }
      ],
      explanation: "d1p3: 효과가 'durable shift가 아니라 novelty(일시적)'일 수 있다는 우려. A가 정확." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 실존 기사 비복제, 제3자 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기존 기사 문장 미사용·미변형, 백지 작성" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 single-passage 주제/세부/추론 3문항" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "1번에서 B를 고른 근거 문장(d1p1)을 짚을 수 있는가?",
    "틀렸다면 오답 함정 유형은? (미언급/반대/지시대상)"
  ],
  version: "2026-06-29"
};
