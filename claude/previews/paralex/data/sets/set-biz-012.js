/* Paralex set · set-biz-012 · 자체작성(original) · documents[]/라우팅 계약.
   토익 Part7 비즈니스 'notice'(사내 안내문) 장르 모사 — 사무실 장비 교체·일정 안내. 백지 신규 창작. 기출 비복제.
   ★문단에 functionLabel 미사용(구조 힌트 제거, 단일 지문처럼 읽히게). */
window.PARALEX_SETS = window.PARALEX_SETS || {};
window.PARALEX_SETS["biz-012"] = {
  id: "biz-012",
  setKind: "set",
  track: "business",
  genre: "notice",
  scoreBandTarget: "800-850",
  difficultyRank: 3,
  partFocus: ["Part7"],
  skillFocus: ["purpose", "scanning", "inference"],
  trapFocus: ["wrong_referent", "not_mentioned", "opposite"],
  vocabBand: "BSL",
  targetTimeSec: 220,
  title: "Office Notice: Replacement of Workstation Computers and Setup Schedule",
  source: { name: "Paralex 자체작성 (original)", url: "" },
  license: "original",
  attribution: "Paralex 편집팀 작성 · 토익 유형 모사, 기출 비복제",
  storageAllowed: true,
  thirdPartyContentExcluded: true,
  wordCount: 168,
  passage: {
    documents: [
      { id: "d1", label: "IT Notice", paragraphs: [
        { id: "d1p1", chunks: [
          { en: "To: All Marston Tower Staff", ko: "수신: 마스턴 타워 전 직원", note: "안내문 머리말(수신)" },
          { en: "From: Information Technology Department", ko: "발신: 정보기술 부서", note: "안내문 머리말(발신)" },
          { en: "Re: Replacement of Workstation Computers", ko: "제목: 업무용 컴퓨터 교체", note: "replacement: 교체" },
          { en: "Over the coming two weeks,", ko: "앞으로 2주에 걸쳐,", note: "over + 기간: ~에 걸쳐" },
          { en: "the aging desktop computers on every floor will be replaced", ko: "각 층의 노후된 데스크톱 컴퓨터가 교체될 예정입니다", note: "aging: 노후된 / 수동태 미래" },
          { en: "with faster models that support the new accounting software.", ko: "새 회계 소프트웨어를 지원하는 더 빠른 모델로.", note: "support: 지원하다" },
          { en: "Each department will be upgraded one floor at a time", ko: "각 부서는 한 번에 한 층씩 업그레이드됩니다", note: "one at a time: 한 번에 하나씩" },
          { en: "to keep daily operations running with minimal disruption.", ko: "일상 업무가 최소한의 중단으로 유지되도록.", note: "minimal disruption: 최소한의 중단" }
        ]},
        { id: "d1p2", chunks: [
          { en: "Before your floor's scheduled date,", ko: "해당 층의 예정일 전에,", note: "scheduled date: 예정일" },
          { en: "please save all important files to the shared network drive,", ko: "모든 중요 파일을 공유 네트워크 드라이브에 저장해 주십시오,", note: "shared network drive: 공유 네트워크 드라이브" },
          { en: "as documents stored only on the local hard drive will not be transferred.", ko: "로컬 하드 드라이브에만 저장된 문서는 이전되지 않기 때문입니다.", note: "transfer: 이전하다 / as: ~이므로" },
          { en: "Technicians will arrive at 7 a.m. and finish each floor by noon,", ko: "기술자가 오전 7시에 도착해 정오까지 각 층을 마칩니다,", note: "by noon: 정오까지" },
          { en: "so affected staff are encouraged to begin work after lunch on that day.", ko: "따라서 해당 직원은 그날 점심 이후에 업무를 시작하시길 권합니다.", note: "be encouraged to: ~하도록 권장되다" }
        ]},
        { id: "d1p3", chunks: [
          { en: "The detailed floor-by-floor schedule is posted on the staff intranet", ko: "층별 상세 일정은 직원 인트라넷에 게시되어 있으며", note: "floor-by-floor: 층별로 / post: 게시하다" },
          { en: "and will also be emailed to each team leader this Friday.", ko: "이번 주 금요일에 각 팀장에게도 이메일로 발송됩니다.", note: "team leader: 팀장" },
          { en: "Old computers must remain switched on until a technician collects them,", ko: "기존 컴퓨터는 기술자가 수거할 때까지 켜진 상태로 두어야 합니다,", note: "remain switched on: 켜진 상태로 유지하다" },
          { en: "as final data backups are performed on site.", ko: "현장에서 최종 데이터 백업이 수행되기 때문입니다.", note: "on site: 현장에서" },
          { en: "Any questions should be sent to Priya Nandakumar at extension 3380.", ko: "문의 사항은 내선 3380번 프리야 난다쿠마르에게 보내 주십시오.", note: "extension: 내선" }
        ]}
      ]}
    ]
  },
  keyStructures: [
    { span: "the aging desktop computers on every floor will be replaced with faster models that support the new accounting software", note: "replace A with B = A를 B로 교체하다 / will be replaced = 수동태 미래. 안내문 빈출" },
    { span: "documents stored only on the local hard drive will not be transferred", note: "stored only on ~ = 과거분사 후치수식 / will not be transferred = 수동태 미래 부정(경고)" },
    { span: "Old computers must remain switched on until a technician collects them, as final data backups are performed on site", note: "must remain + 과거분사 = ~된 상태로 유지해야 한다 / as = 이유 접속사" }
  ],
  vocabulary: [
    { lemma: "replacement", pos: "n.", glossKo: "교체, 대체", collocation: "replacement of workstation computers", listTag: "BSL" },
    { lemma: "disruption", pos: "n.", glossKo: "중단, 지장", collocation: "with minimal disruption", listTag: "BSL" },
    { lemma: "transfer", pos: "v.", glossKo: "이전하다, 옮기다", collocation: "files will not be transferred", listTag: "BSL" },
    { lemma: "technician", pos: "n.", glossKo: "기술자", collocation: "a technician collects them", listTag: "BSL" },
    { lemma: "intranet", pos: "n.", glossKo: "사내 전산망, 인트라넷", collocation: "posted on the staff intranet", listTag: "BSL" }
  ],
  paraphrases: [
    { sourceSpanId: "d1p1", original: "the aging desktop computers on every floor will be replaced with faster models that support the new accounting software",
      paraphrase: "the old computers everywhere are being swapped for quicker ones that work with the new accounting program" },
    { sourceSpanId: "d1p2", original: "documents stored only on the local hard drive will not be transferred",
      paraphrase: "anything saved just on your own computer will be lost during the change" },
    { sourceSpanId: "d1p3", original: "Old computers must remain switched on until a technician collects them, as final data backups are performed on site",
      paraphrase: "Leave the old machine powered on until staff take it away, because they back up the data right there" }
  ],
  questions: [
    { no: 1, stem: "What is the main purpose of the notice?",
      choices: [
        { label: "A", text: "To announce that workstation computers will be replaced on each floor." },
        { label: "B", text: "To request that staff stop using the shared network drive." },
        { label: "C", text: "To advertise a training course for new accounting software." },
        { label: "D", text: "To report a security breach in the company intranet." }
      ],
      answer: ["A"], evidenceSpanIds: ["d1p1"],
      skillFocus: ["purpose"], trapFocus: ["wrong_referent", "not_mentioned"],
      distractorRationales: [
        { label: "B", type: "opposite", note: "공유 드라이브는 파일을 저장하라고 권하는 대상이지 사용 중지 대상이 아님 — 정반대." },
        { label: "C", type: "wrong_referent", note: "새 회계 소프트웨어는 새 컴퓨터가 지원하는 기능으로 언급될 뿐 교육 과정 광고가 아님." },
        { label: "D", type: "not_mentioned", note: "보안 침해·사고 언급 전혀 없음." }
      ],
      explanation: "d1p1: 제목 'Replacement of Workstation Computers'와 'the aging desktop computers on every floor will be replaced with faster models'가 목적을 명시. A가 정답." },
    { no: 2, stem: "What are staff asked to do before their floor's scheduled date?",
      choices: [
        { label: "A", text: "Email their important files to the IT Department." },
        { label: "B", text: "Save important files to the shared network drive." },
        { label: "C", text: "Turn off their computers the night before." },
        { label: "D", text: "Pick up a new computer from the IT office." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p2"],
      skillFocus: ["scanning"], trapFocus: ["wrong_referent", "opposite"],
      distractorRationales: [
        { label: "A", type: "not_mentioned", note: "파일을 IT 부서에 이메일로 보내라는 지시는 없음 — 공유 드라이브 저장만 요구." },
        { label: "C", type: "opposite", note: "기존 컴퓨터는 수거 전까지 켜 두어야 한다고 했으므로 끄라는 것은 정반대." },
        { label: "D", type: "wrong_referent", note: "기술자가 각 층에 와서 교체하므로 직원이 직접 수령하러 가지 않음." }
      ],
      explanation: "d1p2: 'please save all important files to the shared network drive, as documents stored only on the local hard drive will not be transferred.' 예정일 전 요청 사항을 직접 명시. B가 정답." },
    { no: 3, stem: "What is implied about the floor-by-floor schedule?",
      choices: [
        { label: "A", text: "It has not yet been finalized by the IT Department." },
        { label: "B", text: "It is available before team leaders receive the email on Friday." },
        { label: "C", text: "It requires each employee to choose a preferred date." },
        { label: "D", text: "It will be mailed to staff homes as a printed copy." }
      ],
      answer: ["B"], evidenceSpanIds: ["d1p3"],
      skillFocus: ["inference"], trapFocus: ["not_mentioned", "wrong_referent"],
      distractorRationales: [
        { label: "A", type: "opposite", note: "상세 일정이 이미 인트라넷에 게시되어 있다고 했으므로 미확정이라는 것은 정반대." },
        { label: "C", type: "not_mentioned", note: "직원이 희망일을 고른다는 언급 없음 — 일정은 IT가 정해 게시함." },
        { label: "D", type: "wrong_referent", note: "게시·이메일 발송이라 했을 뿐 자택 우편 인쇄본 발송은 언급 없음." }
      ],
      explanation: "d1p3: 일정이 '이미 인트라넷에 게시(is posted)'되어 있고 금요일에 팀장에게 '이메일로도(will also be emailed)' 발송된다고 하므로, 금요일 이메일 전에 이미 인트라넷에서 열람 가능함을 추론. B가 정답." }
  ],
  reviewGates: {
    legal: { pass: true, reviewer: "Claude", note: "자체작성 original, 토익 기출 비복제, 제3자·실존 브랜드 없음(가공 건물 Marston Tower·인물 Priya Nandakumar)", sourceEvidence: "original draft" },
    originality: { pass: true, reviewer: "Claude", note: "기출 문장 미사용·미변형, 백지 작성 컴퓨터 교체·일정 안내문" },
    answerability: { pass: true, reviewer: "Claude", note: "전 문항 evidenceSpanIds 실재 문단(d1p1~d1p3) 근거 존재, 정답 유일 도출 가능" },
    distractor: { pass: true, reviewer: "Claude", note: "오답 전부 타입태그(wrong_referent/not_mentioned/opposite) 부여, 본문 단어 함정 활용" },
    toeicLikeness: { pass: true, reviewer: "Claude", note: "Part7 notice — 목적(purpose)/세부(scanning)/추론(inference) 3종 균형" },
    human: { pass: false, reviewer: null, note: "박사 최종 검수 전 — practice 버킷" }
  },
  reflectionPrompts: [
    "1번 목적 문항에서 '공유 드라이브·새 회계 소프트웨어'처럼 본문에 등장하지만 핵심이 아닌 단어 함정에 끌리지 않고 전체 주제(컴퓨터 교체)를 잡았는가?",
    "2번·3번에서 '컴퓨터를 켜 두라'와 '일정은 이미 게시됨'이라는 단서가 각각 오답(끄기/미확정)의 정반대임을 근거로 구분했는가?"
  ],
  version: "2026-06-30"
};
