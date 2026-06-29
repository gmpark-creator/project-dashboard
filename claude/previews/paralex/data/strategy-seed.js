/* Paralex · Strategy & Traps 시드 (리서치 기반, 경량 참조). 수치는 prep 추정/체감 라벨. */
window.PARALEX_STRATEGY = {
  trends: [
    { title: "패러프레이징 심화", desc: "정답 보기가 음성·지문을 동의어로 바꿔 말함. 키워드 직출이 줄어 '같은 뜻 다른 표현'을 잡는 힘이 승부 (특히 Part7)." },
    { title: "화자 의도·함축 문제", desc: "Part3·4 고정 출제. \"What does the speaker mean when he says…\" — 표면 문장이 아니라 맥락상 의도를 물음." },
    { title: "구어체·다국적 발음", desc: "미·영·호·캐 4개국 성우 + gonna/wanna 축약·생략 발화. 호주 발음 의문사 청취가 최난관으로 자주 꼽힘." },
    { title: "RC 시간 압박", desc: "75분 100문항 완주가 어려움. 2025 평균 RC<LC. Part5·6을 20분 안에 끝내 Part7에 시간을 적립하는 페이싱이 핵심." },
    { title: "신지문(문자·채팅·삼중지문)", desc: "다자 메신저 대화·트리플 패시지(186~200). 2016 개편 도입분이나 상급자 시간관리의 실질 병목." },
    { title: "Part2 간접·우회 응답", desc: "직답 대신 회피·반문·제3의 답변 비중↑. '너무 쉬운 직답'은 함정 신호." }
  ],
  traps: [
    { part: "Part5", title: "콜로케이션 함정", why: "문법적으론 다 맞지만 실제 결합은 하나뿐", avoid: "빈칸 품사 확정→소거→연어로 최종 판단" },
    { part: "Part5", title: "근접 동의어", why: "뜻이 비슷한 보기 중 뉘앙스 차이로 갈림", avoid: "영영 정의로 미세 의미차 정밀화" },
    { part: "Part7", title: "지문 단어 재활용 오답", why: "지문에 나온 단어를 그대로 쓴 매력 오답", avoid: "단어 일치가 아니라 의미(패러프레이즈) 일치로 판단" },
    { part: "Part7", title: "극단어(always/never/only)", why: "단정적 표현은 대개 과잉 일반화", avoid: "극단어 보기는 일단 의심·소거" },
    { part: "Part7", title: "부분적 사실", why: "일부만 지문과 일치해 정답처럼 보임", avoid: "보기 전체가 근거 span으로 뒷받침되는지 확인" },
    { part: "Part3·4", title: "same-word 함정", why: "음성에서 들린 단어를 그대로 쓴 보기", avoid: "정답은 패러프레이즈 — 들린 단어 보기를 경계" }
  ]
};
