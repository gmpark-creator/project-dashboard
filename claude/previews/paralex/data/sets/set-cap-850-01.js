/* Paralex set · cap-850-01 · 자체작성(original) · Ladder Capsule (2-document 연계지문).
   토익 Part7 multi-passage(이메일+일정표) 모사. 백지 신규 창작, 기출 비복제, 실존 브랜드/인물 없음. */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["cap-850-01"] = {
  id: "cap-850-01",
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
  title: "Registration Confirmation: Northbridge Data Workshop",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 연계지문 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 188,
  passage: {
    documents: [
      { id: "d1", label: "Email", paragraphs: [
        { id: "d1p1", functionLabel: "확인/등록정보", chunks: [
          { en: "Dear Ms. Caldera,", ko: "칼데라 씨께,", note: "이메일 인사말" },
          { en: "Thank you for registering", ko: "등록해 주셔서 감사합니다", note: "thank you for + 동명사" },
          { en: "for the Northbridge Data Workshop", ko: "노스브리지 데이터 워크숍에", note: "행사명(가공)" },
          { en: "on Thursday, August 21.", ko: "8월 21일 목요일에 (열리는).", note: "on + 요일/날짜" },
          { en: "Your payment has been received,", ko: "귀하의 결제가 접수되었으며,", note: "현재완료 수동태" },
          { en: "and your place is now confirmed.", ko: "그리고 귀하의 자리가 이제 확정되었습니다.", note: "place: 참가 자리" }
        ]},
        { id: "d1p2", functionLabel: "배정/안내", chunks: [
          { en: "Based on the track you selected,", ko: "귀하가 선택한 트랙에 따라,", note: "based on: ~에 근거하여" },
          { en: "you have been assigned to the Analytics session.", ko: "귀하는 애널리틱스 세션에 배정되었습니다.", note: "assign A to B의 수동태 — 핵심 연결고리" },
          { en: "Please arrive fifteen minutes before your session begins", ko: "귀하의 세션이 시작되기 15분 전에 도착해 주십시오", note: "before + 절" },
          { en: "to collect your badge at the registration desk.", ko: "등록 데스크에서 배지를 수령하기 위해.", note: "to부정사 목적" },
          { en: "The detailed timetable is attached below.", ko: "상세 시간표가 아래에 첨부되어 있습니다.", note: "두 번째 문서로의 연결 신호" },
          { en: "If your preferred track has changed,", ko: "귀하의 선호 트랙이 변경되었다면,", note: "조건절" },
          { en: "reply to this message no later than August 15.", ko: "늦어도 8월 15일까지 이 메시지에 회신해 주십시오.", note: "no later than: 늦어도 ~까지" }
        ]}
      ]},
      { id: "d2", label: "Schedule", paragraphs: [
        { id: "d2p1", functionLabel: "일정표", chunks: [
          { en: "Northbridge Data Workshop — Session Timetable (August 21)", ko: "노스브리지 데이터 워크숍 — 세션 시간표 (8월 21일)", note: "일정표 제목" },
          { en: "9:00 a.m. Foundations session, Room A, led by D. Owusu.", ko: "오전 9시 파운데이션스 세션, A실, D. 오우수 진행.", note: "시간 · 세션명 · 장소 · 진행자" },
          { en: "10:30 a.m. Analytics session, Room C, led by R. Hassan.", ko: "오전 10시 30분 애널리틱스 세션, C실, R. 하산 진행.", note: "d1p2의 배정 세션과 교차참조 지점" },
          { en: "1:00 p.m. Visualization session, Room A, led by P. Lindqvist.", ko: "오후 1시 비주얼라이제이션 세션, A실, P. 린드크비스트 진행.", note: "오후 세션" },
          { en: "2:30 p.m. Deployment session, Room C, led by M. Tan.", ko: "오후 2시 30분 디플로이먼트 세션, C실, M. 탄 진행.", note: "마지막 세션" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "you have been assigned to the Analytics session", note: "assign A to B의 수동태. 이메일은 '세션 이름'만 주고, 시간은 일정표에서 찾아야 함(연계의 핵심)" },
    { span: "Please arrive fifteen minutes before your session begins", note: "'your session'이 가리키는 대상을 일정표와 연결해야 도착 시각이 계산됨" },
    { span: "reply to this message no later than August 15", note: "no later than = 늦어도 ~까지. 마감 기한 빈출 표현" }
  ],
  vocabulary: [
    { lemma: "confirm", pos: "v.", glossKo: "확정하다, 확인해 주다", collocation: "your place is now confirmed", listTag: "BSL" },
    { lemma: "assign", pos: "v.", glossKo: "배정하다, 할당하다", collocation: "be assigned to a session", listTag: "BSL" },
    { lemma: "timetable", pos: "n.", glossKo: "시간표, 일정표", collocation: "the detailed timetable is attached", listTag: "BSL" },
    { lemma: "no later than", pos: "phr.", glossKo: "늦어도 ~까지", collocation: "reply no later than August 15", listTag: "TSL" },
    { lemma: "collect", pos: "v.", glossKo: "(가서) 받다, 수령하다", collocation: "collect your badge", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "Your payment has been received, and your place is now confirmed",
      paraphrase: "We have processed your payment and secured your spot" },
    { sourceSpanId: "d1p2", original: "you have been assigned to the Analytics session",
      paraphrase: "your registration places you in the Analytics track" },
    { sourceSpanId: "d2p1", original: "10:30 a.m. Analytics session, Room C, led by R. Hassan",
      paraphrase: "The Analytics session starts at half past ten in Room C" }
  ],
  questions: [
    { no: 1, stem: "According to the email, what should Ms. Caldera do if her track has changed?",
      choices: [
        { label: "A", text: "Reply to the email by August 15." },
        { label: "B", text: "Arrive fifteen minutes early." },
        { label: "C", text: "Visit the registration desk on August 15." },
        { label: "D", text: "Resend her payment." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "wrong_referent", note: "'15분 전 도착'은 배지 수령 안내이지 트랙 변경 시 행동이 아님 — 다른 지시를 가져온 함정." },
        { label: "C", type: "wrong_referent", note: "8월 15일은 회신 마감일이지 데스크 방문일이 아님 — 날짜에 엉뚱한 행동을 붙인 함정." },
        { label: "D", type: "not_mentioned", note: "결제는 이미 접수됨 — 재결제 언급 없음." }
      ],
      explanation: "d1p2: 'If your preferred track has changed, reply to this message no later than August 15.' A가 정답." },
    { no: 2, stem: "At what time should Ms. Caldera arrive at the venue?",
      choices: [
        { label: "A", text: "At 8:45 a.m." },
        { label: "B", text: "At 9:00 a.m." },
        { label: "C", text: "At 10:15 a.m." },
        { label: "D", text: "At 10:30 a.m." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p2", "d2p1"],
      skillFocus: ["multi_passage", "referent"], trapFocus: ["wrong_referent"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "9:00 Foundations 세션 기준 15분 전 — 칼데라가 배정된 세션이 아님(엉뚱한 세션 참조)." },
        { label: "B", type: "wrong_referent", note: "9:00은 Foundations 세션 시작 시각 — 배정 세션(Analytics)이 아님." },
        { label: "D", type: "wrong_referent", note: "10:30은 Analytics '시작' 시각 — '15분 전' 도착 조건을 빠뜨린 함정." }
      ],
      explanation: "두 문서 교차참조: d1p2에서 칼데라는 Analytics 세션 배정 + '세션 시작 15분 전 도착'. d2p1에서 Analytics는 10:30 a.m. 시작 → 15분 전 = 10:15 a.m. C가 정답." },
    { no: 3, stem: "Who will lead the session Ms. Caldera is scheduled to attend?",
      choices: [
        { label: "A", text: "D. Owusu" },
        { label: "B", text: "R. Hassan" },
        { label: "C", text: "P. Lindqvist" },
        { label: "D", text: "M. Tan" }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2", "d2p1"],
      skillFocus: ["multi_passage", "referent"], trapFocus: ["wrong_referent"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "D. Owusu는 Foundations 세션 진행자 — 배정 세션이 아님." },
        { label: "C", type: "wrong_referent", note: "P. Lindqvist는 Visualization 세션 진행자 — 다른 트랙." },
        { label: "D", type: "wrong_referent", note: "M. Tan은 Deployment 세션 진행자 — 다른 트랙." }
      ],
      explanation: "교차참조: d1p2에서 배정 세션 = Analytics, d2p1에서 Analytics 진행자 = R. Hassan. B가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 실존 브랜드/인물 없음(가공명)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 이메일+일정표 연계지문" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 실재 근거 존재(2·3번은 d1+d2 교차참조로 유일해 풀림)" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그 부여, 핵심 함정=wrong_referent(엉뚱한 세션/날짜 참조)" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 연계지문(이메일+일정표) — 교차참조 시간/진행자 추적, 850-900 난도" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "2번에서 '세션 시작 시각'(10:30)과 '도착 시각'(15분 전)을 구분했는가? 일정표 시각을 그대로 답으로 고르지 않았는가?",
    "이메일은 세션 '이름'만, 일정표는 '시간·장소·진행자'만 준다 — 두 문서를 어느 한 쪽만 보고 답을 고르려 하지 않았는가?"
  ],
  version: "2026-06-29"
};
