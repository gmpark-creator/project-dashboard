/* Paralex set · set-biz-010 · 자체작성(original) · documents[]/라우팅 계약.
   토익 Part7 비즈니스 'notice/memo'(사내 안내문) 장르 모사. 백지 신규 창작. 기출 비복제. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-010"] = {
  id: "biz-010",
  setKind: "set",
  track: "business",
  genre: "memo",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["purpose", "scanning", "inference"],
  trapFocus: ["wrong_referent", "not_mentioned", "opposite"],
  vocabBand: "BSL",
  targetTimeSec: 220,
  title: "Office Memo: Mandatory Renewal of Security Access Badges",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 156,
  passage: {
    documents: [
      { id: "d1", label: "Facilities Memo", paragraphs: [
        { id: "d1p1", functionLabel: "머리말/목적", chunks: [
          { en: "To: All Northvale Plaza Tenants", ko: "수신: 노스베일 플라자 전 입주사", note: "메모 머리말(수신)" },
          { en: "From: Building Facilities Office", ko: "발신: 건물 시설관리 사무소", note: "메모 머리말(발신)" },
          { en: "Re: Mandatory Renewal of Security Access Badges", ko: "제목: 보안 출입증 의무 갱신", note: "mandatory: 의무적인" },
          { en: "Effective next month,", ko: "다음 달부터,", note: "effective + 시점: ~부터 시행되는" },
          { en: "all current access badges will be deactivated", ko: "현재의 모든 출입증이 비활성화됩니다", note: "deactivate: 비활성화하다, 수동태 미래" },
          { en: "as part of a building-wide security upgrade.", ko: "건물 전체 보안 업그레이드의 일환으로.", note: "as part of: ~의 일환으로" },
          { en: "Every employee must obtain a newly encoded badge", ko: "전 직원은 새로 등록된 출입증을 발급받아야 합니다", note: "must obtain: 발급받아야 한다(의무)" },
          { en: "to continue entering the parking garage, elevators, and office floors.", ko: "주차장, 엘리베이터, 사무 층에 계속 출입하려면.", note: "to부정사 목적" }
        ]},
        { id: "d1p2", functionLabel: "절차/일정", chunks: [
          { en: "To renew, please visit the Facilities Office on the second floor", ko: "갱신하려면, 2층 시설관리 사무소를 방문해 주십시오", note: "to renew: 갱신하려면(목적)" },
          { en: "between 8 a.m. and 5 p.m. on any weekday.", ko: "평일 오전 8시에서 오후 5시 사이에.", note: "between A and B: A~B 사이" },
          { en: "Bring a valid photo ID and your current badge.", ko: "유효한 사진 신분증과 현재 출입증을 지참하십시오.", note: "valid: 유효한" },
          { en: "Staff who work remotely may authorize a colleague", ko: "원격 근무 직원은 동료에게 위임할 수 있습니다", note: "who 관계절 / authorize: 위임·권한 부여하다" },
          { en: "to collect a replacement on their behalf", ko: "대신 교체 출입증을 수령하도록", note: "on one's behalf: ~을 대신하여" },
          { en: "by submitting a signed consent form.", ko: "서명된 동의서를 제출함으로써.", note: "by + 동명사: ~함으로써" },
          { en: "All renewals must be completed by the 25th of this month.", ko: "모든 갱신은 이달 25일까지 완료되어야 합니다.", note: "by + 날짜: ~까지(기한)" }
        ]},
        { id: "d1p3", functionLabel: "결과/문의", chunks: [
          { en: "Badges that are not renewed by the deadline", ko: "기한까지 갱신되지 않은 출입증은", note: "that 관계절 / deadline: 기한" },
          { en: "will no longer open any secured door,", ko: "더 이상 어떤 보안 출입문도 열지 못하며,", note: "no longer: 더 이상 ~않다" },
          { en: "and entry will require a temporary visitor pass", ko: "출입 시 임시 방문자 출입증이 필요합니다", note: "temporary: 임시의" },
          { en: "signed in at the lobby desk.", ko: "로비 데스크에서 기록·발급되는.", note: "sign in: 출입 기록하다" },
          { en: "Questions regarding the process", ko: "절차에 관한 문의는", note: "regarding: ~에 관한" },
          { en: "should be directed to Carla Devlin at extension 4120.", ko: "내선 4120번 칼라 데블린에게 문의해 주십시오.", note: "be directed to: ~에게 보내지다 / extension: 내선" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "all current access badges will be deactivated as part of a building-wide security upgrade", note: "effective next month + will be deactivated = 시행 시점 + 수동태 미래. 안내문 빈출" },
    { span: "Staff who work remotely may authorize a colleague to collect a replacement on their behalf", note: "authorize A to do = A에게 ~하도록 위임하다 / on one's behalf = ~을 대신하여" },
    { span: "All renewals must be completed by the 25th of this month", note: "must be completed by + 날짜 = ~까지 완료되어야 한다(기한 의무)" }
  ],
  vocabulary: [
    { lemma: "mandatory", pos: "adj.", glossKo: "의무적인, 필수의", collocation: "mandatory renewal of badges", listTag: "BSL" },
    { lemma: "deactivate", pos: "v.", glossKo: "비활성화하다, 무효화하다", collocation: "badges will be deactivated", listTag: "BSL" },
    { lemma: "renew", pos: "v.", glossKo: "갱신하다", collocation: "renew your access badge", listTag: "BSL" },
    { lemma: "authorize", pos: "v.", glossKo: "위임하다, 권한을 부여하다", collocation: "authorize a colleague to collect", listTag: "BSL" },
    { lemma: "deadline", pos: "n.", glossKo: "기한, 마감일", collocation: "renewed by the deadline", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "all current access badges will be deactivated as part of a building-wide security upgrade",
      paraphrase: "the building is updating its security, so the badges everyone uses now will stop working" },
    { sourceSpanId: "d1p2", original: "Staff who work remotely may authorize a colleague to collect a replacement on their behalf",
      paraphrase: "Remote workers can let a coworker pick up the new badge for them" },
    { sourceSpanId: "d1p3", original: "Badges that are not renewed by the deadline will no longer open any secured door",
      paraphrase: "If you miss the deadline, your old badge will not unlock the secured doors anymore" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the memo?",
      choices: [
        { label: "A", text: "To inform tenants that security access badges must be renewed." },
        { label: "B", text: "To announce that the parking garage is closing for repairs." },
        { label: "C", text: "To advertise a discount on monthly office rent." },
        { label: "D", text: "To apologize for a recent break-in at the building." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "주차장은 출입 가능 구역 예시로 언급될 뿐 폐쇄·수리 공지가 아님." },
        { label: "C", type: "not_mentioned", note: "임대료 할인 언급 전혀 없음." },
        { label: "D", type: "not_mentioned", note: "침입 사건이나 사과 언급 없음 — 예방적 보안 업그레이드일 뿐." }
      ],
      explanation: "d1p1: 'Mandatory Renewal of Security Access Badges' 및 'all current access badges will be deactivated... Every employee must obtain a newly encoded badge'가 목적을 명시. A가 정답." },
    { no: 2, stem: "What should employees bring to the Facilities Office to renew in person?",
      choices: [
        { label: "A", text: "A signed consent form from a colleague." },
        { label: "B", text: "A valid photo ID and their current badge." },
        { label: "C", text: "A temporary visitor pass from the lobby desk." },
        { label: "D", text: "A payment receipt for the new badge." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "동의서는 원격 근무 직원이 동료에게 대리 수령을 위임할 때만 필요하며 본인 방문 지참물 아님." },
        { label: "C", type: "wrong_referent", note: "임시 방문자 출입증은 갱신을 놓쳤을 때의 결과이지 갱신 지참물이 아님." },
        { label: "D", type: "not_mentioned", note: "결제나 영수증 언급 전혀 없음." }
      ],
      explanation: "d1p2: 'Bring a valid photo ID and your current badge.' 본인 방문 시 지참물을 직접 명시. B가 정답." },
    { no: 3, stem: "What is implied about employees who do not renew by the 25th?",
      choices: [
        { label: "A", text: "Their badges will be renewed automatically by the office." },
        { label: "B", text: "They will need a temporary pass to enter secured areas." },
        { label: "C", text: "They will be charged an additional late fee." },
        { label: "D", text: "They will be relocated to a different floor." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p3", "d1p2"],
      skillFocus: ["inference"], trapFocus: ["opposite", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "opposite", note: "갱신하지 않은 출입증은 비활성화되어 문을 못 여는데, 자동 갱신은 정반대." },
        { label: "C", type: "not_mentioned", note: "연체료·추가 비용 언급 없음." },
        { label: "D", type: "not_mentioned", note: "층 이동·재배치 언급 없음." }
      ],
      explanation: "d1p3: 기한까지 갱신 안 된 출입증은 'will no longer open any secured door, and entry will require a temporary visitor pass'. 마감(d1p2의 25th)을 놓치면 임시 출입증이 필요함을 추론. B가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자·실존 브랜드 없음(가공 건물 Northvale Plaza·인물 Carla Devlin)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 출입증 갱신 안내 메모" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 실재 문단(d1p1~d1p3) 근거 존재, 정답 유일 도출 가능" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그(wrong_referent/not_mentioned/opposite) 부여, 본문 단어 함정 활용" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 memo — 목적(purpose)/세부(scanning)/추론(inference) 3종 균형" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "1번 목적 문항에서 '주차장(garage)'처럼 본문에 등장하지만 핵심이 아닌 단어 함정(wrong_referent)에 끌리지 않았는가?",
    "2번·3번에서 '동의서·임시 출입증'이 각각 '원격 대리 수령'과 '갱신 누락 결과'라는 서로 다른 맥락에 걸린다는 점을 분리했는가?"
  ],
  version: "2026-06-29"
};
