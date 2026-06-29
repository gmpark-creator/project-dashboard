window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id:"concept-007",
  title:"비교·병렬·대명사/한정사",
  category:"grammar",
  level:"core",
  partFocus:["Part5","Part6","Part7"],
  scoreBandTarget:"700-850",
  estimatedMinutes:8,
  summary:"than/as~as/the -est의 비교 형태, A and B 병렬 일치, 대명사 수·재귀, much/many/few/little/most 한정사를 한 흐름으로 정리한다.",
  rules:[
    "비교급은 '-er(짧은 형용사)' 또는 'more+원급(긴 형용사·부사)'이며 짝꿍 than과 함께 쓴다. 두 형식을 겹쳐 쓰는 'more better'는 틀린다.",
    "원급 비교는 'as + 원급 + as' 구조로 동등함을 나타내고, 부정형은 'not as[so] ~ as'다. 빈칸 양옆의 as를 보면 가운데는 반드시 원급(형용사/부사 원형)이다.",
    "최상급은 'the + 최상급(-est / most + 원급)'이며 비교 범위를 in/of로 제한한다(the largest in Asia, the most reliable of all).",
    "병렬구조는 등위접속사 and/or/but이나 상관접속사(both A and B, not only A but also B, either A or B)로 이어진 A와 B의 품사·형태를 똑같이 맞춘다.",
    "대명사는 가리키는 명사(선행사)와 수·성·격이 일치해야 한다. 집합명사 team/staff/committee를 하나의 단위로 보면 단수(its), 구성원으로 보면 복수(their)로 받는다.",
    "주어와 목적어가 같은 사람일 때는 재귀대명사(himself/themselves)를 쓰고, by oneself는 '혼자서/스스로'를 뜻한다.",
    "한정사는 가산·불가산을 가른다: 가산 복수에는 many/few/a few, 불가산에는 much/little/a little, 둘 다에는 most/some/all/a lot of를 쓴다.",
    "few/little(거의 없는)은 부정적, a few/a little(약간 있는)은 긍정적 뉘앙스로 의미가 정반대다."
  ],
  steps:[
    "1단계: 빈칸 주변에서 신호어를 먼저 잡는다 — than이 있으면 비교급, as~as 사이면 원급, the와 in/of 범위가 있으면 최상급.",
    "2단계: and/or/콤마로 나열된 자리면 앞 요소의 품사·형태를 그대로 복사해 병렬을 맞춘다.",
    "3단계: 대명사·한정사는 가리키는 명사를 찾아 수(단/복)·가산성(셀 수 있나)을 확인한 뒤 형태를 고른다."
  ],
  examples:[
    {
      en:"This year's logistics costs are significantly lower than last year's.",
      ko:"올해 물류비는 작년보다 현저히 낮다.",
      point:"than이 보이면 비교급(lower)이 정답이고, significantly는 비교급을 강조하는 부사다."
    },
    {
      en:"The new supplier is not as reliable as the previous one, so we extended the trial period.",
      ko:"새 공급업체는 이전 업체만큼 믿을 만하지 않아서 시험 기간을 연장했다.",
      point:"as ~ as 사이는 원급(reliable)이며, not as ~ as는 '~만큼 …하지 않다'는 동등 부정이다."
    },
    {
      en:"The committee asked the staff to review the figures themselves and submit far fewer printed copies.",
      ko:"위원회는 직원들에게 직접 수치를 검토하고 인쇄본을 훨씬 더 적게 제출하라고 요청했다.",
      point:"복수 staff를 받는 재귀대명사 themselves, 가산 복수 copies에는 fewer(few의 비교급)를 쓴다."
    }
  ],
  toeicPattern:[
    "Part 5 어형 문제: 빈칸 뒤 than/앞뒤 as를 단서로 비교급·원급·최상급을 고르게 하거나, much/many/few/little을 명사의 가산성으로 가르게 출제한다.",
    "Part 6 빈칸 채우기: 앞 문장에 나열된 동명사·명사와 형태를 맞추는 병렬 자리, 또는 앞 문장의 회사·팀을 받는 대명사(its/their)의 수일치를 묻는다.",
    "Part 7 문장 의미 파악: the most ~ / fewer than 같은 비교 표현이 들어간 문장을 근거로 '가장 ~한 것', '~보다 적은' 같은 추론·일치 문제를 풀게 한다."
  ],
  traps:[
    "more와 -er을 겹쳐 쓴 'more easier' 같은 이중 비교급, 또는 than 자리에 then을 넣는 철자 함정.",
    "as ~ as 구문에서 부사가 필요한데 형용사를 넣게 유도(as quick → as quickly).",
    "집합명사 team/company를 무조건 복수로 착각해 their를 고르게 하거나, 단수 each/every 뒤에 복수 명사·동사를 붙이게 하는 함정.",
    "much(불가산)와 many(가산), few(가산)와 little(불가산)을 명사 종류와 어긋나게 배치해 가산성 판단을 흐리는 함정."
  ],
  practicePrompts:[
    {
      en:"Our division generated more revenue this quarter than any other team in the region.",
      task:"비교급 'more revenue', 짝꿍 than, 비교 범위 'in the region'을 각각 표시하고 무엇과 무엇을 비교하는지 말로 설명해 보라(채점 아님)."
    },
    {
      en:"Few applicants met all the requirements, but most of them were invited to a second interview.",
      task:"한정사 Few와 most가 각각 어떤 명사(가산/불가산·단수/복수)를 받는지, 대명사 them의 선행사가 무엇인지 표시해 보라."
    }
  ],
  relatedGrammarIds:["glab-001","glab-005"],
  relatedSetIds:["biz-007","news-005"],
  version:"2026-06-30"
});
