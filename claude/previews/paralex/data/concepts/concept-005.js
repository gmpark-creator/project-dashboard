window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];
window.PARALEX_CONCEPTS.push({
  id:"concept-005",
  title:"절 연결: 접속사 vs 전치사 vs 접속부사",
  category:"grammar",
  level:"core",
  partFocus:["Part5","Part6"],
  scoreBandTarget:"700-850",
  estimatedMinutes:8,
  summary:"빈칸 뒤에 '절(주어+동사)'이 오면 접속사, '명사구'면 전치사, 문장과 문장을 '의미로만' 잇고 자리에는 못 끼면 접속부사다.",
  rules:[
    "접속사(because, although, while…)는 뒤에 '주어+동사' 절을 이끌어 한 문장 안의 두 절을 묶는다.",
    "전치사(during, despite, because of…)는 뒤에 '명사/명사구/동명사'만 오며, 절을 이끌 수 없다.",
    "접속부사(therefore, however, moreover…)는 의미만 연결할 뿐 문법적으로 절을 잇지 못한다 — 두 문장은 마침표나 세미콜론(;)으로 끊고 그 사이/문두에 쓴다.",
    "짝 헷갈림 주의: because(접속사)+절 ↔ because of(전치사)+명사, during(전치사)+명사 ↔ while(접속사)+절, despite(전치사) ↔ although(접속사).",
    "therefore, however 등 접속부사는 콤마만으로 두 절을 잇는 데 쓰면 비문(콤마 스플라이스)이 된다.",
    "도치 박스: 부정어 Not only / Hardly / Never가 문두로 나가면 어순이 도치되어 '조동사+주어'가 된다 (Not only did she…, Hardly had the meeting…).",
    "판단은 의미가 아니라 '빈칸 뒤가 절이냐 명사냐, 그리고 문장이 끊겼느냐'로 한다."
  ],
  steps:[
    "1단계: 빈칸 뒤를 본다 — '주어+동사'(절)인가, '명사구'인가?",
    "2단계: 절이면 접속사, 명사구면 전치사로 보기를 좁힌다.",
    "3단계: 두 문장이 마침표/세미콜론으로 이미 끊겨 있으면 접속부사(therefore/however) 자리다."
  ],
  examples:[
    { en:"The launch was delayed because the supplier missed the deadline.",
      ko:"공급업체가 마감을 놓쳤기 때문에 출시가 지연되었다.",
      point:"because 뒤에 'the supplier missed'라는 절이 왔으므로 접속사 자리." },
    { en:"All systems were inspected during the scheduled maintenance window.",
      ko:"예정된 점검 시간 동안 모든 시스템이 점검되었다.",
      point:"during 뒤는 'the scheduled maintenance window'라는 명사구 — 절이 아니므로 전치사." },
    { en:"The vendor raised its prices; therefore, we are reviewing alternative suppliers.",
      ko:"그 업체가 가격을 올렸다; 따라서 우리는 대체 공급처를 검토하고 있다.",
      point:"두 완전한 절을 세미콜론으로 끊고 therefore로 의미만 연결 — 접속부사." }
  ],
  toeicPattern:[
    "Part5: 빈칸 뒤가 절인지 명사구인지로 because vs because of, while vs during, although vs despite를 가르는 단일 문장 문제.",
    "Part6: 지문 흐름상 앞 문장과의 논리 관계(인과·대조·첨가)를 보고 therefore/however/moreover 같은 접속부사를 고르는 빈칸.",
    "Part6: 문장 삽입(text completion)에서 접속부사가 든 문장이 앞뒤 논리에 맞는지 판단하는 형태로 확장."
  ],
  traps:[
    "because of·due to·during·despite를 접속사로 착각해 뒤의 절에 붙이는 오류(이들은 전치사라 명사만 받음).",
    "therefore/however를 콤마 하나로 두 절 사이에 끼워 콤마 스플라이스를 만드는 함정(세미콜론이나 마침표 필요).",
    "Not only/Hardly가 문두인데 도치(조동사+주어)를 빠뜨려 평서문 어순으로 두는 실수.",
    "의미는 통하지만 자리(절 vs 명사 vs 끊긴 문장)가 안 맞는 보기를 정답처럼 배치하는 함정."
  ],
  practicePrompts:[
    { en:"________ the budget was approved, the team could not start hiring during the holiday season.",
      task:"빈칸 뒤가 절인지 명사구인지 표시하고, 접속사/전치사/접속부사 중 무엇이 와야 하는지 골라 근거를 한 줄로 적어 보세요(채점 아님)." },
    { en:"Sales fell sharply last quarter; ________, management decided to cut marketing costs. Not only did they reduce ad spending, but they also froze new hires.",
      task:"세미콜론 뒤 빈칸의 품사(접속부사)와, 둘째 문장의 'Not only did they'가 왜 도치되었는지 구조를 표시해 보세요." }
  ],
  relatedGrammarIds:["glab-001","glab-004"],
  relatedSetIds:["biz-001","news-007"],
  version:"2026-06-30"
});
