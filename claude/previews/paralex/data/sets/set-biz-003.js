/* Paralex set · biz-003 · 자체작성(original) · documents[]/라우팅 계약 마이그레이션.
   토익 Part6/7 비즈니스 notice 장르 모사. 백지 신규 창작. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-003"] = {
  id: "biz-003",
  setKind: "set",
  track: "business",
  genre: "notice",
  scoreBandTarget: "850-900",
  difficultyRank: 4,
  partFocus: ["Part6", "Part7"],
  skillFocus: ["inference", "referent"],
  trapFocus: ["wrong_referent", "partial_truth"],
  vocabBand: "BSL",
  targetTimeSec: 250,
  title: "Notice: Revised Building Security Access Policy",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 162,
  passage: {
    documents: [
      { id: "d1", label: "Company Notice", paragraphs: [
        { id: "d1p1", functionLabel: "공지/목적", chunks: [
          { en: "NOTICE — Revised Building Security Access Policy.", ko: "공지 — 개정된 건물 보안 출입 정책.", note: "notice 헤더" },
          { en: "Effective Monday, August 4.", ko: "8월 4일 월요일부로 시행.", note: "effective+날짜: ~부 시행" },
          { en: "Please be advised that our facility will adopt a new access-control system", ko: "알려드리니, 우리 시설은 새로운 출입 통제 시스템을 도입할 것입니다", note: "be advised that: ~을 알아두십시오(격식 공지)" },
          { en: "across all entrances of the processing plant.", ko: "가공 공장의 모든 출입구에 걸쳐.", note: "across: ~전반에 걸쳐" },
          { en: "The current magnetic badges will no longer open the perimeter doors,", ko: "현재의 자기 배지는 외곽 출입문을 더 이상 열지 못하므로,", note: "no longer: 더 이상 ~않다" },
          { en: "so every employee must obtain a reissued access card before the changeover date.", ko: "그러니 모든 직원은 교체일 전에 재발급된 출입카드를 받아야 합니다.", note: "reissued: 재발급된 / changeover: 전환·교체" }
        ]},
        { id: "d1p2", functionLabel: "카드 재발급/방문객 절차", chunks: [
          { en: "To collect your replacement card, report to the Security Desk in the main lobby", ko: "교체 카드를 수령하려면, 중앙 로비의 보안 데스크로 가십시오", note: "report to: ~로 가서 신고하다" },
          { en: "between 8 a.m. and 5 p.m. with a valid staff identification number.", ko: "오전 8시에서 오후 5시 사이에 / 유효한 직원 식별 번호를 지참하여.", note: "with+소지품: ~을 지참하여" },
          { en: "Visitors are no longer admitted at the front gate without prior registration;", ko: "방문객은 사전 등록 없이는 정문에서 더 이상 입장이 허용되지 않습니다;", note: "admit: 입장시키다 / prior: 사전의" },
          { en: "each host is responsible for logging guests through the online portal at least one day in advance.", ko: "각 담당 직원은 온라인 포털을 통해 손님을 등록할 책임이 있습니다 / 적어도 하루 전에.", note: "be responsible for: ~할 책임이 있다 / in advance: 미리" }
        ]},
        { id: "d1p3", functionLabel: "야간 출입/예외", chunks: [
          { en: "After-hours entry will require both the reissued card and a one-time security code,", ko: "업무 시간 외 출입은 재발급 카드와 일회성 보안 코드 둘 다 필요할 것입니다,", note: "after-hours: 업무 시간 외의 / both A and B" },
          { en: "which the night supervisor releases only to staff listed on the approved roster.", ko: "그 코드는 야간 관리자가 승인된 명단에 오른 직원에게만 발급합니다.", note: "which=code 지칭 / listed on: ~에 등재된" },
          { en: "Personnel who lose a card must report it immediately,", ko: "카드를 분실한 직원은 즉시 신고해야 합니다,", note: "personnel: 인원·직원(집합)" },
          { en: "as unreported cards may be deactivated without notice.", ko: "미신고된 카드는 통보 없이 비활성화될 수 있으므로.", note: "as: ~때문에 / deactivate: 비활성화하다" },
          { en: "Questions should be directed to the Security Office before the transition.", ko: "문의는 전환 전에 보안 사무실로 보내야 합니다.", note: "direct A to B: A를 B로 보내다" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "The current magnetic badges will no longer open the perimeter doors", note: "no longer = 더 이상 ~않다. 정책 '변경 전/후' 대비를 만드는 핵심 신호" },
    { span: "Visitors are no longer admitted at the front gate without prior registration", note: "without prior registration = 사전 등록 없이는(조건). 방문객 vs 직원 절차를 가르는 referent 단서" },
    { span: "the night supervisor releases only to staff listed on the approved roster", note: "only to ... listed on the approved roster = 명단 등재자에게만. 야간 출입의 제한 조건(inference 근거)" }
  ],
  vocabulary: [
    { lemma: "reissue", pos: "v.", glossKo: "재발급하다", collocation: "obtain a reissued access card", listTag: "BSL" },
    { lemma: "admit", pos: "v.", glossKo: "입장을 허락하다, 들이다", collocation: "visitors are admitted at the gate", listTag: "BSL" },
    { lemma: "prior registration", pos: "phr.", glossKo: "사전 등록", collocation: "without prior registration", listTag: "BSL" },
    { lemma: "after-hours", pos: "adj.", glossKo: "업무 시간 외의", collocation: "after-hours entry", listTag: "TSL" },
    { lemma: "deactivate", pos: "v.", glossKo: "비활성화하다", collocation: "cards may be deactivated", listTag: "NAWL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "every employee must obtain a reissued access card before the changeover date",
      paraphrase: "all staff need to pick up a newly issued card before the switch takes place" },
    { sourceSpanId: "d1p2", original: "each host is responsible for logging guests through the online portal at least one day in advance",
      paraphrase: "the employee hosting a visitor must register that guest online a day or more beforehand" },
    { sourceSpanId: "d1p3", original: "the night supervisor releases only to staff listed on the approved roster",
      paraphrase: "the after-hours code is given out solely to workers whose names appear on the cleared list" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the notice?",
      choices: [
        { label: "A", text: "To announce a new building access policy and required actions." },
        { label: "B", text: "To advertise a newly constructed processing plant." },
        { label: "C", text: "To recall defective magnetic badges from the manufacturer." },
        { label: "D", text: "To invite employees to a visitor appreciation event." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["inference"], trapFocus: ["partial_truth", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "공장의 '신축'이나 광고는 언급 없음 — facility는 출입 정책의 배경일 뿐." },
        { label: "C", type: "partial_truth", note: "자기 배지가 언급되지만 '결함 회수'가 아니라 더 이상 작동 안 함 — 회수·제조사 무관." },
        { label: "D", type: "not_mentioned", note: "방문객 등록 절차는 있으나 행사 초대는 없음." }
      ],
      explanation: "d1p1: 'Revised Building Security Access Policy ... will adopt a new access-control system ... every employee must obtain a reissued access card'가 공지 목적을 명시. A가 정답." },
    { no: 2, stem: "What must employees do to receive a replacement card?",
      choices: [
        { label: "A", text: "Register through the online portal at least one day in advance." },
        { label: "B", text: "Report to the Security Desk with a valid staff identification number." },
        { label: "C", text: "Obtain a one-time code from the night supervisor." },
        { label: "D", text: "Hand in their magnetic badge at the front gate." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["referent"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "온라인 포털 사전 등록은 '방문객(guests)' 절차 — 카드 수령과 다른 대상." },
        { label: "C", type: "wrong_referent", note: "일회성 코드는 '야간 출입' 조건이지 카드 수령 방법이 아님." },
        { label: "D", type: "not_mentioned", note: "정문에서 배지를 반납하라는 지시는 지문에 없음." }
      ],
      explanation: "d1p2: 'To collect your replacement card, report to the Security Desk ... with a valid staff identification number'. B가 정답." },
    { no: 3, stem: "What is implied about after-hours entry?",
      choices: [
        { label: "A", text: "It is restricted to staff named on an approved roster." },
        { label: "B", text: "It no longer requires any access card." },
        { label: "C", text: "It is available to visitors who have registered online." },
        { label: "D", text: "It is personally supervised by each guest's host." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["wrong_referent", "partial_truth"],
      distractorRationales: [
        { label: "B", type: "partial_truth", note: "코드가 추가될 뿐, 재발급 카드도 '둘 다' 필요 — 카드 불필요는 정반대 추론." },
        { label: "C", type: "wrong_referent", note: "온라인 등록은 방문객 절차이며, 야간 출입은 명단 등재 '직원'에 한정." },
        { label: "D", type: "wrong_referent", note: "host의 책임은 손님 등록이지 야간 출입 감독이 아님 — 코드 발급은 야간 관리자 소관." }
      ],
      explanation: "d1p3: 'a one-time security code, which the night supervisor releases only to staff listed on the approved roster' — 명단 등재 직원으로 제한됨을 암시. A가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 notice" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 단일 근거(d1p1/d1p2/d1p3) 존재" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 distractorRationales 타입태그 부여(wrong_referent/partial_truth/not_mentioned)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part6/7 notice — 목적/세부(referent)/암시(inference), 850-900대 난도" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "2번에서 '온라인 등록'과 '코드 발급'이 각각 누구(방문객/야간 직원)의 절차인지 referent를 구분했는가?",
    "3번 추론에서 '카드+코드 둘 다'라는 조건을 '카드 불필요(부분적 사실)'로 잘못 단순화하지 않았는가?"
  ],
  version: "2026-06-29"
};
