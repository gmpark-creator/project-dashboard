window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id:"concept-001",
  title:"문장 뼈대와 빈칸 자리",
  category:"structure",
  level:"core",
  partFocus:["Part5","Part6","Part7"],
  scoreBandTarget:"700-850",
  estimatedMinutes:8,
  summary:"빈칸 문제는 해석보다 먼저 주어·동사라는 뼈대를 찾고, 빈칸이 어느 품사 자리인지를 판단해 푼다.",
  rules:[
    "모든 문장에는 반드시 주어(S)와 동사(V)가 있다. 빈칸을 만나면 먼저 이 둘부터 찾는다.",
    "필수성분은 문장이 성립하는 데 꼭 필요한 자리(주어·동사·목적어·보어)이고, 수식어는 빼도 문장이 성립한다.",
    "주어 자리·목적어 자리·전치사 뒤 자리에는 명사가 들어간다.",
    "관사(a/an/the)나 형용사 뒤이면서 동사 앞 자리는 명사 자리일 가능성이 높다.",
    "명사 앞에서 그 명사를 꾸미거나 be동사 뒤 보어 자리에는 형용사가 들어간다.",
    "동사·형용사·다른 부사·문장 전체를 꾸미는 자리, 즉 빼도 되는 수식어 자리에는 부사가 들어간다.",
    "이미 동사가 있는 문장에서 또 하나의 동사 형태가 빈칸이면 본동사가 아니라 준동사(to부정사·~ing·~ed)나 수식어를 의심한다.",
    "빈칸 앞뒤 단어의 품사를 보면 빈칸의 품사가 결정된다. 단어 뜻을 몰라도 자리로 답을 좁힐 수 있다."
  ],
  steps:[
    "1단계: 문장에서 진짜 주어(S)와 진짜 동사(V)를 표시해 뼈대를 잡는다.",
    "2단계: 빈칸이 필수성분 자리인지 빼도 되는 수식어 자리인지 가른다.",
    "3단계: 빈칸 앞뒤 단어를 보고 들어갈 품사(명사·동사·형용사·부사)를 확정한 뒤 보기에서 그 품사를 고른다."
  ],
  examples:[
    {
      en:"The marketing team submitted the quarterly report on time.",
      ko:"마케팅 팀이 분기 보고서를 제때 제출했다.",
      point:"주어 The marketing team, 동사 submitted, 목적어 the quarterly report가 필수 뼈대이고 on time은 빼도 되는 수식어다."
    },
    {
      en:"All applicants must complete the registration form carefully.",
      ko:"모든 지원자는 등록 양식을 신중하게 작성해야 한다.",
      point:"동사 complete 뒤 목적어(명사 form)는 필수, 문장 끝 carefully는 동사를 꾸미는 부사 수식어 자리다."
    },
    {
      en:"The newly hired manager reviewed every contract thoroughly.",
      ko:"새로 채용된 관리자가 모든 계약서를 꼼꼼히 검토했다.",
      point:"명사 manager 앞은 형용사(hired) 자리, 그 형용사를 꾸미는 newly는 부사 자리로 품사가 자리마다 다르다."
    }
  ],
  toeicPattern:[
    "Part5: 한 문장에 빈칸 하나가 있고 보기 A~D가 같은 어근의 명사·동사·형용사·부사 파생형으로 나와 '자리=품사'로 답을 고르게 한다.",
    "Part6: 지문 속 한 문장의 빈칸도 같은 원리이며, 앞뒤 문장 맥락보다 해당 문장의 주어·동사 구조를 먼저 본다.",
    "Part7: 직접 빈칸을 채우진 않지만 긴 문장의 주어·동사를 빠르게 끊어 읽으면 수식어를 걷어내고 핵심 정보를 빨리 잡을 수 있다."
  ],
  traps:[
    "빈칸 바로 앞 명사에 동사를 맞춰버리는 함정(진짜 주어는 더 앞의 명사인 경우가 많다).",
    "보기에 부사가 보이면 무조건 고르려는 습관(그 자리가 필수 보어·목적어면 명사가 답이다).",
    "이미 동사가 있는데 또 동사를 넣어 한 문장에 본동사를 둘로 만드는 실수.",
    "단어 뜻만 보고 해석으로 풀려다 자리(품사) 단서를 놓치는 것."
  ],
  practicePrompts:[
    {
      en:"The company's new safety guidelines were explained clearly during the orientation session.",
      task:"주어(S)와 동사(V)에 표시하고, clearly와 during the orientation session이 각각 필수성분인지 수식어인지 적어 보세요."
    },
    {
      en:"Employees who attended the workshop received a certificate of completion.",
      task:"진짜 주어와 진짜 동사를 찾아 동그라미 치고, who attended the workshop이 무엇을 꾸미는 수식어인지 표시해 보세요."
    }
  ],
  relatedGrammarIds:["glab-001"],
  relatedSetIds:["biz-001","news-007"],
  version:"2026-06-30"
});
