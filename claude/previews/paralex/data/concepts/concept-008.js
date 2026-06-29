window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id:"concept-008",
  title:"긴 문장 끊어읽기와 패러프레이즈",
  category:"structure",
  level:"core",
  partFocus:["Part5","Part6","Part7"],
  scoreBandTarget:"700-850",
  estimatedMinutes:8,
  summary:"긴 문장은 전치사구·관계절·삽입구를 떼어내 핵심 주어·동사부터 잡고, Part7 정답은 지문 표현을 동의어·구조로 바꾼 패러프레이즈임을 인식해야 한다.",
  rules:[
    "문장의 뼈대는 '주어(S) + 동사(V)'다. 길이에 압도되지 말고 먼저 핵심 S·V부터 찾는다.",
    "전치사구(of/in/for/with…로 시작하는 덩어리)는 주어나 명사를 꾸미는 살이므로 괄호로 묶어 잠시 건너뛴다.",
    "관계절(who/which/that…)은 바로 앞 명사를 설명하는 곁가지다. 끊어 읽고 핵심 동사를 놓치지 않는다.",
    "콤마와 콤마 사이에 끼어든 삽입구는 빼도 문장이 성립한다. 일단 제거하고 골격을 본 뒤 의미를 더한다.",
    "주어 핵 바로 뒤의 수식어구에 동사를 일치시키지 말고, 진짜 주어 핵의 수(단수/복수)에 동사를 맞춘다.",
    "직독직해는 영어 어순 그대로 의미 덩어리(chunk) 단위로 끊어 앞에서부터 이해하는 것이다. 뒤에서부터 거꾸로 번역하지 않는다.",
    "패러프레이즈는 같은 뜻을 ①동의어 교체 ②품사·구조 전환(능동↔수동, 명사↔동사) ③상위어 일반화로 다시 쓴 것이다.",
    "Part7 정답 선택지는 지문 문장을 그대로 베끼지 않고 패러프레이즈한 경우가 대부분이다. 표면 단어 일치보다 의미 일치를 기준으로 고른다."
  ],
  steps:[
    "1) 골격 추출: 전치사구·관계절·삽입구를 괄호로 묶어 빼고, 남은 핵심 주어와 동사를 먼저 확정한다.",
    "2) 의미 덩어리로 직독직해: 빼 둔 수식어를 앞에서부터 차례로 더하며 '누가-무엇을-어떻게'를 한 방향으로 이해한다.",
    "3) 패러프레이즈 대조(Part7): 지문 핵심 의미를 한 줄로 요약한 뒤, 같은 의미를 동의어·구조 전환으로 바꿔 쓴 선택지를 정답으로 고른다."
  ],
  examples:[
    {
      en:"The report (on quarterly sales) (in the European region) shows a steady increase.",
      ko:"유럽 지역의 분기 매출에 관한 그 보고서는 꾸준한 증가를 보여 준다.",
      point:"전치사구 두 개(on…/in…)를 괄호로 빼면 핵심은 'The report shows'—주어 핵 report는 단수라 동사는 shows다."
    },
    {
      en:"The vendors (that we contacted last month) have not responded yet.",
      ko:"지난달에 우리가 연락한 그 공급업체들은 아직 답하지 않았다.",
      point:"관계절(that…month)을 끊어 내면 골격은 'The vendors have not responded'—진짜 주어는 복수 vendors라 have가 맞다."
    },
    {
      en:"The CEO announced that the merger would be completed by year-end. → The acquisition is expected to be finalized before the end of the year.",
      ko:"대표는 합병이 연말까지 마무리될 것이라고 발표했다. → 그 인수는 연말 전에 최종 확정될 것으로 예상된다.",
      point:"merger→acquisition, completed→finalized, by year-end→before the end of the year로 바꾼 패러프레이즈—단어는 달라도 의미가 같으면 Part7 정답이 된다."
    }
  ],
  toeicPattern:[
    "Part5: 긴 주어 뒤 수식어구(전치사구·관계절)에 휘둘려 동사 수일치를 틀리게 유도—주어 핵을 잡아야 단수/복수 동사를 고른다.",
    "Part6: 앞뒤 문장의 핵심 의미를 직독직해로 파악해야 빈칸의 연결어·대명사가 무엇을 가리키는지 맞출 수 있다.",
    "Part7: True/추론 문제의 정답 보기는 지문 표현을 동의어·구조 전환으로 바꾼 패러프레이즈이고, 오답 보기는 지문 단어를 그대로 베껴 함정을 만든다."
  ],
  traps:[
    "주어 핵 바로 앞·뒤의 명사에 동사를 일치시키는 실수(예: of approved vendors의 vendors에 끌려 복수 동사 선택).",
    "Part7에서 지문과 똑같은 단어가 들어간 보기를 정답으로 고르는 '단어 일치' 함정—실제 정답은 다른 단어로 같은 뜻을 말한다.",
    "삽입구·관계절을 본문 골격으로 착각해 진짜 동사를 놓치고 해석이 꼬이는 경우.",
    "패러프레이즈가 의미를 과장·축소·반전한 오답(too/only/all 등 극단어 추가, 능동↔수동으로 행위 주체를 바꿔치기)을 정답으로 착각."
  ],
  practicePrompts:[
    {
      en:"The new policy, which was approved by the board last week, requires all employees in the overseas branches to submit their reports electronically.",
      task:"핵심 주어·동사에 밑줄, 삽입 관계절(which…week)과 전치사구(by…/in…/their…)를 괄호로 묶어 골격만 한 줄로 적어 보세요. (채점 아님)"
    },
    {
      en:"Original: The factory will suspend operations for routine maintenance next Tuesday.  /  Option: Production at the plant will be temporarily halted for scheduled servicing.",
      task:"두 문장에서 서로 짝이 되는 패러프레이즈(동의어·구조 전환)를 단어별로 연결해 보세요. (예: suspend operations ↔ ___)"
    }
  ],
  relatedGrammarIds:["glab-001"],
  relatedSetIds:["biz-001","news-007"],
  version:"2026-06-30"
});
