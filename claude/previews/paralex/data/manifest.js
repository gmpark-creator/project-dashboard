/* Paralex 단일 소스 manifest — 콘텐츠 레지스트리 + Today 번들 + standardBatch + studyDay 플랜.
   ★Codex R3 락: file:// 지원 위해 ES module/fetch 금지. classic script 전역(window.PARALEX_MANIFEST)만.
   동적 로더가 content[].file 을 순차 <script> 주입한다. 새 콘텐츠 = 파일 추가 + 아래 content[] 한 줄 추가. */
window.PARALEX_MANIFEST = {
  version: 1,

  defaults: { targetBand: "800-850", dailyMinutes: 35, lcEnabled: false },

  /* Today 처방 번들 — 설정 최소·처방 최대. 비중 노브 없음(진행기록·오답태그가 자동 조정). */
  today: {
    core: [
      { slot: "warmup",  kind: "vocabReview", reviewCount: 10, minutes: 3,
        label: "복습 워밍업", desc: "직전에 본 어휘 10개를 뜻을 가리고 떠올려 보세요." },
      { slot: "grammar", kind: "grammar", questions: 6, minutes: 9,
        label: "문법", desc: "Grammar Lab에서 아직 안 푼 6문항. 틀린 함정은 한 줄로 메모." },
      { slot: "vocab",   kind: "vocab", newCount: 10, reviewCount: 10, minutes: 8,
        label: "어휘", desc: "오늘 신규 10 + 복습 10. 예문을 소리 내어 2번." },
      { slot: "reading", kind: "reading", sets: 1, timed: true, minutes: 12,
        label: "독해", desc: "타이머를 켜고 1세트. 직독직해 → 패러프레이즈 확인." }
    ],
    /* dailyMinutes 자동 변형(비중 노브 대신) */
    minutesProfiles: {
      "25": { grammar: 5, vocabNew: 8,  vocabReview: 8,  reading: 1 },
      "35": { grammar: 6, vocabNew: 10, vocabReview: 10, reading: 1 },
      "50": { grammar: 8, vocabNew: 12, vocabReview: 12, reading: 1, lcExtra: true }
    },
    lc: { enabledWhen: "lcEnabled", count: 1, stage: "B", shadowingReps: 5, minutes: 15,
          label: "듣기(선택)", desc: "오늘의 LC 1개 — 30~60초 구간 섀도잉 5회." }
  },

  /* 요구7 — 콘텐츠 추가 단위(학습 1세션 아님). validator가 coverageDays·imbalance 경고. */
  standardBatch: {
    id: "standard-v1",
    readingSets: 4, grammarLabs: 1, grammarQuestionsPerLab: 8,
    vocabDays: 1, vocabWordsPerDay: 30, optionalLcItems: 2,
    note: "1회 작업분량. AUTHORING.md의 체크리스트대로 생성 후 content[]에 추가."
  },

  /* 콘텐츠 레지스트리 — 동적 로더(file)·Today resolver(kind/band/order)·validator의 단일 소스.
     order 오름차순이 학습 궤도. reading은 쉬운 밴드부터. */
  content: [
    /* ── Grammar Lab ── */
    { id:"glab-001", kind:"grammar", file:"data/grammar/glab-001.js", order:10, planDay:1, band:"700-800" },
    { id:"glab-003", kind:"grammar", file:"data/grammar/glab-003.js", order:11, planDay:2, band:"700-800" },
    { id:"glab-002", kind:"grammar", file:"data/grammar/glab-002.js", order:12, planDay:4, band:"800-850" },
    { id:"glab-004", kind:"grammar", file:"data/grammar/glab-004.js", order:13, planDay:5, band:"750-850" },
    { id:"glab-005", kind:"grammar", file:"data/grammar/glab-005.js", order:14, planDay:6, band:"750-850" },

    /* ── Vocab (PARALEX_VOCAB_DAYS 로 self-register) ── */
    { id:"vocab-days",    kind:"vocab", file:"data/vocab-days.js",    order:20, planDay:1 },
    { id:"vocab-day-003", kind:"vocab", file:"data/vocab-day-003.js", order:21, planDay:3 },
    { id:"vocab-day-004", kind:"vocab", file:"data/vocab-day-004.js", order:22, planDay:5 },
    { id:"vocab-day-005", kind:"vocab", file:"data/vocab-day-005.js", order:23, planDay:6 },

    /* ── Reading: Business (쉬운 밴드부터) ── */
    { id:"biz-009", kind:"reading", file:"data/sets/set-biz-009.js", order:100, planDay:1, band:"750-800" },
    { id:"biz-001", kind:"reading", file:"data/sets/set-biz-001.js", order:101, planDay:1, band:"750-800" },
    { id:"biz-002", kind:"reading", file:"data/sets/set-biz-002.js", order:102, planDay:2, band:"750-800" },
    { id:"biz-003", kind:"reading", file:"data/sets/set-biz-003.js", order:103, planDay:2, band:"750-800" },
    { id:"biz-004", kind:"reading", file:"data/sets/set-biz-004.js", order:104, planDay:3, band:"800-850" },
    { id:"biz-005", kind:"reading", file:"data/sets/set-biz-005.js", order:105, planDay:3, band:"800-850" },
    { id:"biz-010", kind:"reading", file:"data/sets/set-biz-010.js", order:106, planDay:4, band:"750-850" },
    { id:"biz-006", kind:"reading", file:"data/sets/set-biz-006.js", order:107, planDay:4, band:"800-850" },
    { id:"biz-007", kind:"reading", file:"data/sets/set-biz-007.js", order:108, planDay:5, band:"800-850" },
    { id:"biz-008", kind:"reading", file:"data/sets/set-biz-008.js", order:109, planDay:5, band:"800-850" },
    { id:"biz-011", kind:"reading", file:"data/sets/set-biz-011.js", order:110, planDay:6, band:"750-800" },
    { id:"biz-012", kind:"reading", file:"data/sets/set-biz-012.js", order:111, planDay:6, band:"800-850" },
    { id:"biz-013", kind:"reading", file:"data/sets/set-biz-013.js", order:112, planDay:6, band:"750-800" },
    { id:"biz-014", kind:"reading", file:"data/sets/set-biz-014.js", order:113, planDay:7, band:"800-850" },

    /* ── Reading: News ── */
    { id:"news-007", kind:"reading", file:"data/sets/set-news-007.js", order:120, planDay:3, band:"750-850" },
    { id:"news-001", kind:"reading", file:"data/sets/set-news-001.js", order:121, planDay:3, band:"800-850" },
    { id:"news-002", kind:"reading", file:"data/sets/set-news-002.js", order:122, planDay:4, band:"800-850" },
    { id:"news-003", kind:"reading", file:"data/sets/set-news-003.js", order:123, planDay:5, band:"800-850" },
    { id:"news-004", kind:"reading", file:"data/sets/set-news-004.js", order:124, planDay:6, band:"800-850" },
    { id:"news-005", kind:"reading", file:"data/sets/set-news-005.js", order:125, planDay:6, band:"800-850" },
    { id:"news-006", kind:"reading", file:"data/sets/set-news-006.js", order:126, planDay:7, band:"800-850" },
    { id:"news-008", kind:"reading", file:"data/sets/set-news-008.js", order:127, planDay:7, band:"800-850" },
    { id:"news-009", kind:"reading", file:"data/sets/set-news-009.js", order:128, planDay:7, band:"750-850" },
    { id:"news-010", kind:"reading", file:"data/sets/set-news-010.js", order:129, planDay:8, band:"800-850" },
    { id:"news-011", kind:"reading", file:"data/sets/set-news-011.js", order:130, planDay:8, band:"750-850" },
    { id:"news-012", kind:"reading", file:"data/sets/set-news-012.js", order:131, planDay:8, band:"800-850" },

    /* ── Reading: Ladder Capsule (750→950+) ── */
    { id:"cap-750-01", kind:"reading", file:"data/sets/set-cap-750-01.js", order:140, planDay:6,  band:"750-800" },
    { id:"cap-750-02", kind:"reading", file:"data/sets/set-cap-750-02.js", order:141, planDay:7,  band:"750-800" },
    { id:"cap-800-01", kind:"reading", file:"data/sets/set-cap-800-01.js", order:142, planDay:8,  band:"800-850" },
    { id:"cap-800-02", kind:"reading", file:"data/sets/set-cap-800-02.js", order:143, planDay:9,  band:"800-850" },
    { id:"cap-850-01", kind:"reading", file:"data/sets/set-cap-850-01.js", order:144, planDay:10, band:"850-900" },
    { id:"cap-850-02", kind:"reading", file:"data/sets/set-cap-850-02.js", order:145, planDay:11, band:"850-900" },
    { id:"cap-900-01", kind:"reading", file:"data/sets/set-cap-900-01.js", order:146, planDay:12, band:"900-950" },
    { id:"cap-900-02", kind:"reading", file:"data/sets/set-cap-900-02.js", order:147, planDay:13, band:"900-950" },
    { id:"cap-950-01", kind:"reading", file:"data/sets/set-cap-950-01.js", order:148, planDay:14, band:"950+" },
    { id:"cap-950-02", kind:"reading", file:"data/sets/set-cap-950-02.js", order:149, planDay:15, band:"950+" }
  ],

  /* studyDay 궤도(달력 아님). Today resolver는 이 순서를 참고하되 '다음 미완 eligible'을 동적 선택. */
  planNote: "order 오름차순 = 권장 궤도. 완료 판정은 stable id(localStorage paralex:v1:*) 기반."
};
