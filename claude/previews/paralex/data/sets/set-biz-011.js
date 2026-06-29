/* Paralex set · set-biz-011 · 자체작성(original) · documents[]/라우팅 계약 미러링.
   토익 Part7 비즈니스 공지(notice) 장르 모사. 백지 신규 창작. 주제: 사내 교육 워크숍 등록 안내.
   ★ functionLabel 미사용(디렉터 지시: 구조 힌트 제거, 단일 지문처럼 읽히게). */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-011"] = {
  id: "biz-011",
  setKind: "set",
  track: "business",
  genre: "notice",
  scoreBandTarget: "750-800",
  difficultyRank: 2,
  partFocus: ["Part7"],
  skillFocus: ["purpose", "scanning", "paraphrase"],
  trapFocus: ["not_mentioned", "opposite", "wrong_referent"],
  vocabBand: "TSL",
  targetTimeSec: 180,
  title: "Notice: In-House Training Workshop Registration",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 152,
  passage: {
    documents: [
      { id: "d1", label: "Notice", paragraphs: [
        { id: "d1p1", chunks: [
          { en: "NOTICE — Staff Development Workshop.", ko: "공지 — 직원 역량 개발 워크숍.", note: "notice 머리말" },
          { en: "The Human Resources team is pleased to announce", ko: "인사팀이 알리게 되어 기쁩니다", note: "be pleased to announce: ~을 알리게 되어 기쁘다" },
          { en: "a half-day workshop on effective business writing", ko: "효과적인 비즈니스 작문에 관한 반일 워크숍을", note: "half-day: 반일, 오전/오후만" },
          { en: "for all office employees,", ko: "전 사무직 직원을 대상으로,", note: "for + 대상" },
          { en: "to be held on Thursday, September 18.", ko: "9월 18일 목요일에 개최되는.", note: "to be held: 개최될 예정인" }
        ]},
        { id: "d1p2", chunks: [
          { en: "The session will run from 9:00 a.m. to 12:30 p.m.", ko: "세션은 오전 9시부터 낮 12시 30분까지 진행됩니다", note: "run from A to B: A부터 B까지 진행되다" },
          { en: "in Meeting Room C on the third floor.", ko: "3층 회의실 C에서.", note: "장소 안내" },
          { en: "Because seats are limited to twenty people,", ko: "좌석이 20명으로 제한되어 있으므로,", note: "be limited to: ~으로 제한되다" },
          { en: "staff who wish to attend must sign up in advance", ko: "참석을 원하는 직원은 사전에 등록해야 합니다", note: "sign up in advance: 사전 등록하다" },
          { en: "through the HR page on the company intranet.", ko: "회사 인트라넷의 인사팀 페이지를 통해.", note: "through the intranet: 인트라넷을 통해" }
        ]},
        { id: "d1p3", chunks: [
          { en: "Registration closes on Friday, September 12,", ko: "등록은 9월 12일 금요일에 마감됩니다,", note: "registration closes: 등록 마감" },
          { en: "and places will be given on a first-come, first-served basis.", ko: "그리고 자리는 선착순으로 배정됩니다.", note: "first-come, first-served: 선착순" },
          { en: "A light lunch will be provided after the workshop.", ko: "워크숍 후에 가벼운 점심이 제공됩니다.", note: "be provided: 제공되다" },
          { en: "For any questions, please contact Ms. Dela Verne at extension 240.", ko: "문의 사항은 내선 240번 델라 베른 씨에게 연락 바랍니다.", note: "extension: 내선번호" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "seats are limited to twenty people", note: "be limited to + 수: '~으로 제한되다'. 정원 안내 빈출" },
    { span: "staff who wish to attend must sign up in advance", note: "who 관계절 + must: 참석 희망자의 의무를 한정해 서술" },
    { span: "places will be given on a first-come, first-served basis", note: "on a ~ basis: '~ 방식으로'. first-come, first-served = 선착순" }
  ],
  vocabulary: [
    { lemma: "workshop", pos: "n.", glossKo: "워크숍, 실습 강좌", collocation: "attend a workshop", listTag: "NGSL2k" },
    { lemma: "register", pos: "v.", glossKo: "등록하다", collocation: "register in advance", listTag: "TSL" },
    { lemma: "limited", pos: "adj.", glossKo: "제한된", collocation: "limited to twenty people", listTag: "TSL" },
    { lemma: "in advance", pos: "phr.", glossKo: "미리, 사전에", collocation: "sign up in advance", listTag: "TSL" },
    { lemma: "first-come, first-served", pos: "phr.", glossKo: "선착순의", collocation: "on a first-come, first-served basis", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p2", original: "staff who wish to attend must sign up in advance",
      paraphrase: "employees who want to join have to register beforehand" },
    { sourceSpanId: "d1p2", original: "seats are limited to twenty people",
      paraphrase: "only twenty employees can take part" },
    { sourceSpanId: "d1p3", original: "A light lunch will be provided after the workshop",
      paraphrase: "the company will give attendees a small meal once it ends" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the notice?",
      choices: [
        { label: "A", text: "To invite employees to register for a training workshop." },
        { label: "B", text: "To report the results of a recent staff survey." },
        { label: "C", text: "To announce a change to the company lunch menu." },
        { label: "D", text: "To introduce a new member of the HR team." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1", "d1p2"],
      skillFocus: ["purpose"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "B", type: "not_mentioned", note: "설문조사·그 결과 보고는 지문에 전혀 없음." },
        { label: "C", type: "partial_truth", note: "점심(lunch)이 d1p3에 언급되나 워크숍 후 제공일 뿐 '메뉴 변경'은 과장·왜곡." },
        { label: "D", type: "wrong_referent", note: "델라 베른 씨는 문의 담당자로만 등장 — 신규 직원 소개가 아님." }
      ],
      explanation: "d1p1의 워크숍 개최 안내와 d1p2의 'must sign up in advance'(사전 등록 요구)가 결합해 '등록 안내'가 목적임을 명시. A가 정답." },
    { no: 2, stem: "How can employees secure a place at the workshop?",
      choices: [
        { label: "A", text: "By visiting Meeting Room C before the event." },
        { label: "B", text: "By signing up through the HR page on the intranet." },
        { label: "C", text: "By calling extension 240 to reserve a seat." },
        { label: "D", text: "By sending a paper form to Human Resources." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "A", type: "wrong_referent", note: "회의실 C는 워크숍 '장소'일 뿐 등록 수단이 아님." },
        { label: "C", type: "wrong_referent", note: "내선 240번은 '문의'용 — 좌석 예약 수단으로 안내되지 않음." },
        { label: "D", type: "not_mentioned", note: "종이 양식 제출 방식은 지문에 없음 — 인트라넷 등록만 안내." }
      ],
      explanation: "d1p2: 'must sign up in advance through the HR page on the company intranet'. B가 정답." },
    { no: 3, stem: "What is indicated about the workshop?",
      choices: [
        { label: "A", text: "It will last for a full day." },
        { label: "B", text: "It is open to clients as well as staff." },
        { label: "C", text: "Attendees will be given a light lunch afterward." },
        { label: "D", text: "Registration remains open until September 18." }
      ],
      answer: ["C"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["paraphrase"], trapFocus: ["opposite", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "opposite", note: "d1p1은 'half-day'(반일), d1p2는 9:00~12:30이라고 명시 — 종일이 아님." },
        { label: "B", type: "not_mentioned", note: "고객 대상 개방 언급 없음 — 'all office employees' 대상." },
        { label: "D", type: "wrong_referent", note: "9월 18일은 워크숍 '개최일'이고 등록 마감은 9월 12일." }
      ],
      explanation: "d1p3: 'A light lunch will be provided after the workshop'을 'given a light lunch afterward'로 패러프레이즈. C가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자 콘텐츠 없음", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 공지문" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 근거로 유일 정답 도출" },
    distractor: { pass: true, reviewer: "Claude", note: "모든 오답 라벨에 타입태그·근거 부여" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 notice — 목적/세부(scanning)/패러프레이즈, LC Part3·4 등록 안내 상황 모사" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "목적 문항(1번)에서 lunch·HR처럼 지문에 '부분 등장'하는 단어로 만든 오답에 끌리지 않았는가?",
    "3번처럼 날짜(9/18 개최·9/12 등록마감)와 시간(9:00~12:30=반일)이 섞일 때 각 수치가 무엇에 걸리는지 분리했는가?"
  ],
  version: "2026-06-30"
};
