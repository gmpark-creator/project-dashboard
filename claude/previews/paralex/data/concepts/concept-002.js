window.PARALEX_CONCEPTS = window.PARALEX_CONCEPTS || [];

window.PARALEX_CONCEPTS.push({
  id:"concept-002",
  title:"수일치",
  category:"grammar",
  level:"core",
  partFocus:["Part5","Part6","Part7"],
  scoreBandTarget:"700-850",
  estimatedMinutes:8,
  summary:"동사는 '진짜 주어의 핵(head noun)'에 일치시킨다. of·전치사구 속 명사에 끌려가지 말 것.",
  rules:[
    "동사의 수는 주어의 핵심 명사(head)에 맞춘다. 바로 앞에 있는 명사가 아니다.",
    "'주어 + of + 명사' 구조에서는 of 앞 명사가 핵이다. of 뒤 명사는 수식어이므로 무시한다.",
    "전치사구(in, with, along with, as well as 등)와 콤마로 삽입된 구는 주어의 수를 바꾸지 못한다.",
    "each / every / either / neither / one of + 복수명사 → 동사는 단수.",
    "주어가 'A and B'면 복수, 'A or B'·'either A or B'·'neither A nor B'면 동사를 B(가까운 쪽)에 일치시킨다.",
    "There/Here is/are 도치문에서는 뒤에 오는 진짜 주어의 수를 본다.",
    "the number of + 복수명사 → 단수, a number of + 복수명사 → 복수.",
    "동명사·to부정사·that절이 주어이면 단수 취급한다."
  ],
  steps:[
    "1단계: 빈칸이 동사 자리면 주어의 '핵 명사'부터 찾는다(of·전치사구·콤마 삽입구는 괄호치고 지운다).",
    "2단계: 핵이 단수인지 복수인지 판정하고, each/every/도치/상관접속사 같은 특수 신호가 있는지 확인한다.",
    "3단계: 시제·태와 충돌 없는 보기 중, 핵의 수에 맞는 동사를 고른다."
  ],
  examples:[
    {
      en:"The list of approved vendors is updated at the end of every quarter.",
      ko:"승인된 공급업체 목록은 매 분기 말에 갱신된다.",
      point:"핵은 단수 'The list', 'of approved vendors'는 수식어 → 단수 is."
    },
    {
      en:"Each of the department managers submits a monthly budget report.",
      ko:"각 부서장은 월간 예산 보고서를 제출한다.",
      point:"'each of + 복수'는 항상 단수 → submits(-s)."
    },
    {
      en:"Attached to the email are the revised contract and the invoice.",
      ko:"이메일에 첨부된 것은 수정 계약서와 송장이다.",
      point:"도치 구조. 진짜 주어는 뒤의 복수 'the contract and the invoice' → are."
    }
  ],
  toeicPattern:[
    "Part5: 'The ___ of + 복수명사 ___ ...' 형태로 빈칸이 동사일 때, of 뒤 복수명사에 일치시킨 오답을 함정으로 배치.",
    "Part5: each/every/one of/a number of 등 수량 표현이 주어일 때 단·복수 동사를 고르게 함.",
    "Part6: 지문 흐름상 주어가 길어진 문장에서 동사의 단·복수가 정답 단서가 됨."
  ],
  traps:[
    "바로 앞 복수명사(vendors, managers 등)에 동사를 일치시키게 유도하는 'of ~' 함정.",
    "'A as well as B' / 'along with B'를 'A and B'로 착각해 복수 동사를 고르는 함정(핵은 A뿐, 단수 가능).",
    "each/every가 붙은 주어를 복수로 오인하는 함정.",
    "There/Here is·are 도치문에서 앞의 형식주어 there만 보고 수를 정하는 함정."
  ],
  practicePrompts:[
    {
      en:"The quality of the materials used in these products has been verified by an external lab.",
      task:"주어의 핵 명사에 동그라미 치고, 'of ~' 수식어구에 괄호를 친 뒤 동사가 왜 단수(has)인지 한 줄로 설명해 보세요."
    },
    {
      en:"Neither the supervisor nor the new interns were informed of the schedule change.",
      task:"상관접속사 주어에서 동사가 어느 명사에 일치하는지 표시하고, 'interns'를 'intern'(단수)으로 바꾸면 동사가 어떻게 바뀌는지 적어 보세요."
    }
  ],
  relatedGrammarIds:["glab-001"],
  relatedSetIds:["biz-001","news-007"],
  version:"2026-06-30"
});
