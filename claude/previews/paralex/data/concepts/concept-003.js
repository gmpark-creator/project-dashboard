window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id: "concept-003",
  title: "동사 형태: 시제·상·태",
  category: "grammar",
  level: "core",
  partFocus: ["Part5", "Part6", "Part7"],
  scoreBandTarget: "700-850",
  estimatedMinutes: 8,
  summary: "완료시제는 '기준 시점'을, 태는 '주어가 행위자인가 대상인가'를 묻는다 — 시간 단서와 주어·목적어 관계로 형태를 결정한다.",
  rules: [
    "현재완료(have/has + p.p.)는 과거에 시작된 일이 현재까지 이어지거나 결과가 남을 때 쓰며, for·since·already·recently·over the past ~ 같은 단서와 함께 나온다.",
    "과거완료(had + p.p.)는 과거의 어떤 시점보다 '더 먼저' 일어난 일을 가리킨다(대과거). 과거 사건이 둘일 때 먼저 끝난 쪽이 had + p.p.",
    "미래완료(will have + p.p.)는 미래의 기준 시점까지 완료될 일을 나타내며, 'By the time + 현재시제(미래 의미)' / 'by next month' 같은 마감 표현과 짝을 이룬다.",
    "시제일치: by the time, when, after, before 같은 시간 부사절 안에서는 미래 의미라도 현재시제를 쓰고, 주절에서 미래/미래완료로 받는다.",
    "수동태는 'be + p.p.' 형태로, 주어가 동작을 '당하는' 대상일 때 쓴다. 조동사 뒤에서는 'will/must/should + be + p.p.'가 된다.",
    "행위자를 밝힐 때는 'by + 행위자'를 붙이지만, 자명하거나 불특정하면 생략한다(by 가 보이면 수동태일 가능성이 높다).",
    "능동/수동 판별: 빈칸 동사의 목적어가 뒤에 있으면 능동, 목적어 없이 주어가 영향을 받으면 수동으로 본다.",
    "자동사(arrive, occur, rise, happen 등)는 목적어가 없어 애초에 수동태로 쓸 수 없다."
  ],
  steps: [
    "1) 시간 단서를 먼저 찾는다 — since/for/by the time/by next ~ 가 시제(현재완료·미래완료)를 지정한다.",
    "2) 주어와 동사의 관계를 본다 — 주어가 직접 '하는가(능동)' vs '당하는가(수동)'.",
    "3) 동사 뒤 목적어 유무와 'by + 행위자' 단서로 능동/수동을 확정하고 형태를 맞춘다."
  ],
  examples: [
    {
      en: "By the time the auditors arrive, the finance team will have finalized the quarterly report.",
      ko: "감사관들이 도착할 무렵이면, 재무팀은 분기 보고서를 이미 마무리했을 것이다.",
      point: "시간 부사절(By the time ~ arrive)은 현재시제, 주절은 미래완료(will have finalized)로 받는다."
    },
    {
      en: "All shipping requests must be approved by the warehouse supervisor before processing.",
      ko: "모든 배송 요청은 처리 전에 창고 관리자에게 승인을 받아야 한다.",
      point: "조동사 must 뒤 'be + p.p.'(be approved) 수동태 — 요청은 승인을 '당하는' 대상이고 행위자는 'by ~'로 제시."
    },
    {
      en: "The company has expanded into three new markets since it relocated its headquarters last year.",
      ko: "그 회사는 작년에 본사를 이전한 이후로 세 개의 신규 시장에 진출해 왔다.",
      point: "since + 과거시점 절과 함께 쓰는 현재완료(has expanded) — 과거부터 현재까지 이어진 결과."
    }
  ],
  toeicPattern: [
    "Part 5: 빈칸 동사에 since/for/by the time/by next ~ 같은 단서를 깔아 단순과거 vs 현재완료 vs 미래완료를 구분시키는 시제 문제.",
    "Part 5: 빈칸 앞 'be/조동사 + be'와 뒤 'by + 행위자'를 단서로 능동형/수동형 동사를 고르게 하는 태(voice) 문제.",
    "Part 6: 지문 전체의 시간 흐름(공지·이메일의 시점)을 근거로 빈칸 문장의 시제·태를 앞뒤 문장과 일치시키는 문제."
  ],
  traps: [
    "by the time 절 안에 미래시제(will)를 넣도록 유도 — 시간 부사절은 현재시제, 미래완료는 주절에서.",
    "자동사(arrive, rise, occur)를 'be + p.p.' 수동형으로 제시 — 목적어가 없으니 수동태 자체가 불가.",
    "'by + 행위자'가 보여 무조건 수동을 고르게 하지만, 능동 진행형(be -ing)을 섞어 형태 혼동을 노림.",
    "과거 사건이 둘인데 먼저 끝난 일에 단순과거를 써서 과거완료(had + p.p.)와 헷갈리게 함."
  ],
  practicePrompts: [
    {
      en: "By the time the new policy takes effect, the HR department will have notified every employee by email.",
      task: "시간 부사절(현재시제)과 주절(미래완료)을 각각 표시하고, 'will have + p.p.'에 동그라미 친 뒤 왜 미래완료인지 한 줄로 메모하세요. (채점 아님)"
    },
    {
      en: "The damaged units were inspected by the quality team and replaced within two business days.",
      task: "수동태 동사 두 개와 'by + 행위자'를 찾아 밑줄을 긋고, 주어가 행위자인지 대상인지 옆에 적어 보세요. (채점 아님)"
    }
  ],
  relatedGrammarIds: ["glab-001", "glab-005"],
  relatedSetIds: ["biz-003", "news-007"],
  version: "2026-06-30"
});
