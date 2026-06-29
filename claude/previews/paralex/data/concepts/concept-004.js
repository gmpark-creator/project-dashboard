window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id: "concept-004",
  title: "준동사: to / -ing / p.p.",
  category: "grammar",
  level: "core",
  partFocus: ["Part5", "Part6", "Part7"],
  scoreBandTarget: "700-850",
  estimatedMinutes: 8,
  summary: "동사를 to부정사·동명사·분사로 바꿔 쓰는 준동사를, 형태가 결정되는 '자리'와 동사별 목적어 선호로 가른다.",
  rules: [
    "준동사는 동사에서 나왔지만 문장에서 명사·형용사·부사 역할을 한다: to부정사(명사·형용사·부사), 동명사(명사 자리 전용), 분사(형용사·부사 역할).",
    "to부정사는 '앞으로 할 일·목적·미래 지향'을 담는 동사 뒤에 온다: want/plan/decide/hope/agree/offer/aim + to do.",
    "동명사는 '이미 하던 일·행위 자체'를 받는 동사와 모든 전치사 뒤에 온다: enjoy/finish/avoid/consider/recommend/suggest/keep + -ing, 그리고 전치사 in/of/for/by + -ing.",
    "한 동사 안에 둘 다 받지만 의미가 갈리는 부류 주의: remember/forget/stop to do(앞으로 할 일) vs -ing(이미 한 일/행위 자체).",
    "명사를 앞뒤에서 꾸미는 분사는 능동·진행이면 현재분사(-ing), 수동·완료면 과거분사(p.p.): a rising cost(오르는) vs a revised budget(개정된).",
    "분사구문은 부사절의 접속사+주어를 지우고 동사를 분사로 바꾼 축약형으로, 주절 주어가 능동이면 -ing, 수동이면 p.p.를 쓴다.",
    "감정동사의 분사는 주체에 따라 갈린다: 원인은 현재분사(the results were surprising), 사람이 느끼면 과거분사(we were surprised)."
  ],
  steps: [
    "1) 빈칸이 어느 '자리'인지부터 본다 — 전치사 바로 뒤·주어 자리면 동명사, 명사를 꾸미는 자리면 분사.",
    "2) 앞 동사(본동사)를 확인한다 — want/plan류면 to부정사, enjoy/recommend/avoid류면 동명사로 목적어 형태가 고정된다.",
    "3) 분사라면 꾸밈받는 명사와의 관계를 따진다 — 명사가 행위를 '하면' -ing, '당하면' p.p."
  ],
  examples: [
    {
      en: "The board decided to postpone the merger until the audit is complete.",
      ko: "이사회는 감사가 끝날 때까지 합병을 연기하기로 결정했다.",
      point: "decide는 '앞으로 할 일'을 받는 동사라 목적어가 to부정사(to postpone)로 고정된다."
    },
    {
      en: "We recommend booking your seats early to avoid the holiday surcharge.",
      ko: "연휴 할증료를 피하려면 좌석을 일찍 예약하시기를 권합니다.",
      point: "recommend는 동명사(booking)를 받고, avoid도 동명사를 받는 대표 동사다 — to부정사 booking이 아님에 주의."
    },
    {
      en: "Customers receiving the updated invoice should disregard the previous statement.",
      ko: "개정된 청구서를 받는 고객은 이전 명세서를 무시하셔야 합니다.",
      point: "receiving(현재분사)은 명사 Customers가 직접 '받는' 능동 관계라 -ing, 반면 updated(p.p.)는 청구서가 '개정된' 수동 관계다."
    }
  ],
  toeicPattern: [
    "Part5: 'want/plan/agree ____ ' 또는 'enjoy/avoid/finish ____ ' 빈칸에서 to do와 -ing 중 동사별 선호를 묻는다.",
    "Part5·6: 명사 앞뒤 빈칸에 현재분사 vs 과거분사를 놓고, 꾸밈받는 명사가 행위의 주체인지 대상인지로 정답을 가른다.",
    "Part6·7: 문장 첫머리 분사구문(Founded in 1998, the firm... / Having reviewed the data, ...)으로 시간·이유 관계를 압축해 제시한다."
  ],
  traps: [
    "to를 무조건 '~로'라는 전치사로 착각해 동명사를 고르는 함정 — look forward to / be committed to / object to의 to는 전치사라 뒤에 -ing가 와야 한다.",
    "동사별 목적어 선호를 안 외워 'suggest to do'처럼 쓰는 오류 — suggest/recommend/consider는 동명사만 받는다.",
    "현재분사와 과거분사를 형태만 보고 고르는 함정 — 반드시 꾸밈받는 명사와의 능동/수동 관계를 확인해야 한다.",
    "감정분사 혼동 — 'The audience was bored'(청중이 지루함을 느낌, p.p.)와 'The lecture was boring'(강연이 지루하게 만듦, -ing)을 뒤집어 고르기 쉽다."
  ],
  practicePrompts: [
    {
      en: "After completing the orientation, all new hires are required to submit the signed agreement to verify their enrollment.",
      task: "준동사 4개(completing / to submit / signed / to verify)를 찾아 각각 역할을 표시하라 — 전치사 뒤 동명사 / 의무동사 뒤 to부정사 / 명사수식 과거분사 / 목적의 to부정사."
    },
    {
      en: "The manager who reviewed the proposal recommended ____ the launch date.",
      task: "빈칸에 들어갈 형태를 to delay와 delaying 중 고르고, recommend의 목적어 선호를 근거로 한 줄로 이유를 적어 보라."
    }
  ],
  relatedGrammarIds: ["glab-001", "glab-004"],
  relatedSetIds: ["biz-003", "news-007"],
  version: "2026-06-30"
});
