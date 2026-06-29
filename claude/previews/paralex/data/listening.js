/* Paralex Listening(LC) — ★합법성 락: 외부 링크 + 메타데이터만. 오디오/전문 비내장(embedAllowed:false).
   Today는 queue에서 '오늘 1개'를 회전 노출. Listening 뷰는 recommendations 전체 + 3단계 프로토콜을 보여준다.
   섀도잉은 영상 전체가 아니라 30~60초 '구간' 단위(Codex R2 락). */
window.PARALEX_LC = {
  /* 3단계 프로토콜(과외 디테일) */
  protocol: {
    stages: [
      { id:"A", title:"이해(Comprehension)", steps:[
        "1회: 한글 자막 ON — 내용 전체 파악(끊지 말고 통으로).",
        "2회: 영어 자막 ON — 안 들렸던 표현 2~3개만 메모(문장째).",
        "3회: 자막 OFF — 방금 메모한 표현이 들리는지 확인." ] },
      { id:"B", title:"섀도잉(Shadowing)", steps:[
        "30~60초 '한 구간'만 고른다(영상 전체 X).",
        "자막 OFF, 0.5초 지연으로 성우를 그림자처럼 따라 말한다.",
        "같은 구간을 5회 반복. 발음·억양·연음(gonna/wanna)까지 흉내.",
        "주 2회는 받아쓰기: 구간을 듣고 받아쓴 뒤 자막과 대조." ] },
      { id:"C", title:"속청(Speed-up)", steps:[
        "익숙해진 구간을 1.25x 배속, 자막 OFF로.",
        "토익 LC 실제 속도+α에 귀를 적응시킨다." ] }
    ],
    rule: "토익 LC는 미·영·호·캐 4개국 발음. 처음엔 미국/영국(또박발화)부터, 익숙해지면 호주 발음 클립을 의도적으로 섞어라."
  },

  /* Today '오늘의 LC' 회전 큐 — 안정적 인덱스/채널 링크(특정 회차 URL은 휘발성이라 채널/플레이리스트로). */
  queue: [
    { id:"lc-001", sourceRef:"BBC 6 Minute English", provider:"BBC Learning English",
      url:"https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
      fallbackUrl:"https://www.youtube.com/@bbclearningenglish/videos",
      kind:"youtube_web", durationMinutes:6, level:"medium", accent:"UK",
      task:"최신 6 Minute English 1편 — Stage A 풀세트 후, 진행자 발화 중 30~60초 1구간 Stage B 섀도잉 5회.",
      license:"link-only", embedAllowed:false },
    { id:"lc-002", sourceRef:"VOA Learning English (Let's Learn English / News)", provider:"VOA",
      url:"https://learningenglish.voanews.com/",
      fallbackUrl:"https://www.youtube.com/@voalearningenglish/videos",
      kind:"web_video", durationMinutes:5, level:"easy", accent:"US",
      task:"VOA 뉴스 1편(느리고 또렷). Stage A 후, 앵커 멘트 30~60초 Stage B 섀도잉 5회.",
      license:"link-only", embedAllowed:false },
    { id:"lc-003", sourceRef:"TED-Ed", provider:"TED-Ed",
      url:"https://ed.ted.com/lessons",
      fallbackUrl:"https://www.youtube.com/@TEDEd/videos",
      kind:"youtube_web", durationMinutes:5, level:"medium", accent:"US",
      task:"관심 주제 TED-Ed 1편. Stage A 후 핵심 설명 30~60초 Stage B 섀도잉 5회. 영어 자막으로 표현 3개 수집.",
      license:"link-only", embedAllowed:false },
    { id:"lc-004", sourceRef:"Netflix — The Office (US)", provider:"Netflix",
      url:"https://www.netflix.com/title/70136120",
      fallbackUrl:"",
      kind:"netflix", durationMinutes:22, level:"hard", accent:"US",
      task:"한 에피소드 중 사무실 대화 30~60초 1장면만. Stage A(한글→영어자막) 후 Stage B 섀도잉 5회. 연음·축약 집중.",
      license:"link-only", embedAllowed:false },
    { id:"lc-005", sourceRef:"Reuters / AP 비즈니스 클립", provider:"Reuters",
      url:"https://www.reuters.com/business/",
      fallbackUrl:"https://www.youtube.com/@Reuters/videos",
      kind:"web_video", durationMinutes:3, level:"hard", accent:"mixed",
      task:"1~2분 비즈니스 뉴스 클립. 토익 Part4(공지·보도) 톤. Stage A 2회 + Stage B 1구간 5회.",
      license:"link-only", embedAllowed:false }
  ],

  /* Listening 뷰의 큐레이션 추천 카탈로그(레벨·용도별) */
  recommendations: [
    { id:"r-bbc6", title:"BBC 6 Minute English", url:"https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
      level:"중급", accent:"영국", forPart:"Part3·4", why:"또렷한 두 진행자 대화 + 스크립트 제공. 패러프레이즈 훈련에 최적." },
    { id:"r-voa", title:"VOA Learning English", url:"https://learningenglish.voanews.com/",
      level:"초·중급", accent:"미국", forPart:"Part4", why:"느리고 명확한 뉴스. 받아쓰기·섀도잉 입문에 좋음." },
    { id:"r-teded", title:"TED-Ed / TED Talks", url:"https://ed.ted.com/lessons",
      level:"중·상급", accent:"미국 외 다양", forPart:"Part4", why:"주제 다양·자막 정확. 다양한 억양 노출." },
    { id:"r-office", title:"Netflix — The Office (US)", url:"https://www.netflix.com/title/70136120",
      level:"상급", accent:"미국", forPart:"Part3", why:"사무실 일상 대화·연음·축약. 자연 발화 귀 트이기." },
    { id:"r-suits", title:"Netflix — Suits", url:"https://www.netflix.com/title/70195800",
      level:"상급", accent:"미국", forPart:"Part3", why:"비즈니스·법률 어휘가 많은 빠른 대화. 상급 청해." },
    { id:"r-reuters", title:"Reuters / AP 비즈니스 클립", url:"https://www.reuters.com/business/",
      level:"상급", accent:"혼합", forPart:"Part4", why:"실제 공지·보도 톤. 토익 Part4 시뮬레이션." }
  ]
};
