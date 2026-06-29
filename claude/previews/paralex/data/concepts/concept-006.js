window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id:"concept-006",
  title:"관계사·명사절",
  category:"grammar",
  level:"core",
  partFocus:["Part5","Part6","Part7"],
  scoreBandTarget:"700-850",
  estimatedMinutes:8,
  summary:"선행사의 종류와 빈칸 뒤 절의 완전·불완전을 보고 관계대명사 격·관계부사·명사절 접속사를 가른다.",
  rules:[
    "관계대명사는 사람이면 who(주격)/whom(목적격)/whose(소유격), 사물이면 which, 둘 다 가능하면 that을 쓴다.",
    "격 판단은 빈칸 뒤 구조로: 뒤에 동사가 오면 주격(who/which/that), 뒤에 「주어+동사」면 목적격(whom/which/that), 뒤에 명사가 오면 소유격(whose)이다.",
    "관계부사 where(장소)/when(시간)/why(이유)는 뒤에 완전한 절이 오고, 「전치사+which」로 바꿔 쓸 수 있다.",
    "관계대명사 뒤에는 주어나 목적어가 빠진 불완전한 절, 관계부사 뒤에는 빠진 것 없는 완전한 절이 온다.",
    "명사절 that은 뒤에 완전한 절을 이끌어 주어·목적어·보어 자리에 들어가고, 안에 빠진 성분이 없다.",
    "명사절 what은 선행사를 포함한 관계대명사여서 'the thing which'와 같고, 뒤 절에 주어나 목적어가 빠진다.",
    "whether/if는 '~인지 아닌지'의 명사절을 이끌며, whether는 주어·전치사 뒤·to부정사 앞에 두루 쓰지만 if는 그 자리에 못 쓴다.",
    "콤마(,) 뒤 계속적 용법에는 that을 쓸 수 없고, 사람은 who, 사물은 which를 쓴다."
  ],
  steps:[
    "1단계: 빈칸 앞 선행사가 있는가/사람인가 사물인가, 아니면 선행사 없이 절 전체가 명사 자리인가를 본다.",
    "2단계: 빈칸 뒤 절이 완전한가 불완전한가를 확인한다(주어·목적어가 빠졌으면 불완전 → 관계대명사/what, 빠진 것 없으면 완전 → 관계부사/that·whether).",
    "3단계: 불완전이면 빠진 성분의 격(주격·목적격·소유격)에 맞는 관계대명사를, 완전이면 의미(장소·시간·이유·사실·여부)에 맞는 부사/접속사를 고른다."
  ],
  examples:[
    {
      en:"The consultant who revised our budget forecast will present the findings on Thursday.",
      ko:"우리 예산 전망을 수정한 그 컨설턴트가 목요일에 결과를 발표할 것이다.",
      point:"선행사가 사람(consultant)이고 뒤에 동사(revised)가 바로 오므로 주격 관계대명사 who."
    },
    {
      en:"Please confirm whether the shipment has cleared customs before we notify the client.",
      ko:"고객에게 알리기 전에 그 화물이 통관되었는지 확인해 주세요.",
      point:"confirm의 목적어로 '~인지 아닌지'를 이끄는 명사절 whether (뒤는 완전한 절)."
    },
    {
      en:"What the marketing team proposed last week exceeded the committee's expectations.",
      ko:"마케팅팀이 지난주에 제안한 것은 위원회의 기대를 넘어섰다.",
      point:"선행사 없이 주어 자리에 온 명사절, 뒤 절에 목적어가 빠졌으므로 관계대명사 what."
    }
  ],
  toeicPattern:[
    "Part5: 빈칸 앞 명사(선행사)와 뒤 절 구조를 주고 who/which/whose/that·where/when을 보기로 섞어 격과 종류를 가리게 한다.",
    "Part6: 한 문장이 길어진 문맥에서 명사절 that/what/whether 또는 관계사를 골라 절을 자연스럽게 잇게 한다.",
    "Part7: 직접 빈칸 문제는 아니지만, 긴 관계사절·명사절을 빠르게 끊어 읽어야 세부 정보 문항의 근거 문장을 정확히 잡는다."
  ],
  traps:[
    "뒤 절이 완전한데도 관계대명사(which/that)를 고르게 유도 — 완전하면 관계부사(where/when) 또는 명사절 that이 정답이다.",
    "선행사가 사물인데 빈칸 뒤에 명사가 오는 소유격 자리를 which로 착각 — 소유 관계면 사물·사람 모두 whose.",
    "명사절 that과 what 혼동 — 뒤 절이 완전하면 that, 주어·목적어가 빠진 불완전이면 what.",
    "주어 자리·전치사 뒤·to부정사 앞에서는 if를 쓸 수 없는데 whether 대신 if를 고르게 유도한다."
  ],
  practicePrompts:[
    {
      en:"The downtown branch where the regional summit was held has since been relocated.",
      task:"선행사와 관계부사를 표시하고, where 뒤 절이 완전한지(빠진 성분이 없는지) 확인해 보세요."
    },
    {
      en:"Management has not yet decided whose proposal will receive the additional funding.",
      task:"명사절의 시작과 끝을 괄호로 묶고, whose가 어느 명사와 소유 관계인지 화살표로 표시해 보세요."
    }
  ],
  relatedGrammarIds:["glab-004"],
  relatedSetIds:["biz-001","news-007"],
  version:"2026-06-30"
});
