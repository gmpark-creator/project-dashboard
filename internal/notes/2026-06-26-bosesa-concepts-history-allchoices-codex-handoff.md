# 보세사 중요개념 — 연도별 출제 이력 선지 보강 (Codex → Claude 검수 핸드오프)

- 일자: 2026-06-26
- 지시(박사): 중요개념 카드의 `연도별 출제 이력`이 유사문항의 문제·정답만 보여 주고 다른 선지가 없어 학습 공백이 있음. 각 연도별 유사문항에 실제 선지를 추가하고, Claude가 이어받아 검수/업데이트할 수 있게 준비.

## 구현 요지

`bosesa-concepts-1~5.js`의 각 `examByYear` 항목에 원문 기출 데이터(`bosesa-data-{subject}-{year}.js`)에서 가져온 `choices` 배열을 실제로 추가했다. 즉 데이터 자체가 이제 아래 형태를 가진다.

```js
{
  year: 2019,
  no: 2,
  stem: "...",
  answer: [2],
  answerText: ["..."],
  choices: [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}
```

화면은 이 `examByYear.choices`를 그대로 읽어 **모바일 뷰어 중요개념의 노란 `연도별 출제 이력` 박스 안**에 선지 목록을 표시한다. 정답 표시 모드에서는 정답 선지만 강조한다.

중요: 기존 중요개념 카드 하단 해설(`실제 정답`, `핵심 개념`, `오답 유도 포인트`, `조심할 것`, `암기 포인트`, `법령 근거`, `근거 기출`)은 제거하지 않는다. 렌더 순서는 `대표문항 선지 -> 연도별 출제 이력(유사문항 문제+선지+정답) -> 기존 하단 해설`이다.

모바일에서 기존 브라우저 캐시에 걸려 오래된 `bosesa-concepts-*.js`가 계속 보이는 문제를 막기 위해, 모바일 동적 스크립트 로더에 `?v=20260626-concepts-history-choices` 버전 쿼리를 붙였다. 데스크톱에서 모바일 뷰어를 여는 링크도 같은 버전 파라미터를 포함한다.

## 변경 파일

데이터:
- `claude/previews/tradelogix-nexus/bosesa-concepts-1.js`
- `claude/previews/tradelogix-nexus/bosesa-concepts-2.js`
- `claude/previews/tradelogix-nexus/bosesa-concepts-3.js`
- `claude/previews/tradelogix-nexus/bosesa-concepts-4.js`
- `claude/previews/tradelogix-nexus/bosesa-concepts-5.js`

렌더:
- `claude/previews/tradelogix-nexus/index.html`
- `claude/previews/tradelogix-nexus/bosesa-mobile/index.html`

## 데이터 보강 결과

전수 보강:
- 1과목: 170개 `examByYear` 항목에 `choices` 추가
- 2과목: 174개
- 3과목: 188개
- 4과목: 70개
- 5과목: 164개
- 합계: 766개

검증:

```json
{
  "totalExamByYearRefs": 766,
  "missingChoices": 0,
  "shortChoices": 0
}
```

## 렌더 검증

Chrome headless, live server `http://127.0.0.1:5500`, 모바일 URL:
`/claude/previews/tradelogix-nexus/bosesa-mobile/?subject=<n>&view=concepts&v=20260626-concepts-history-choices`

- subject 1: cards 46 / historyRows 170 / choiceLists 216 / historyRowsWithChoices 170 / versionedConceptScript true
- subject 2: cards 41 / historyRows 174 / choiceLists 215 / historyRowsWithChoices 174 / versionedConceptScript true
- subject 3: cards 44 / historyRows 188 / choiceLists 232 / historyRowsWithChoices 188 / versionedConceptScript true
- subject 4: cards 28 / historyRows 70 / choiceLists 98 / historyRowsWithChoices 70 / versionedConceptScript true
- subject 5: cards 29 / historyRows 164 / choiceLists 193 / historyRowsWithChoices 164 / versionedConceptScript true

즉 모바일 중요개념의 모든 `연도별 출제 이력` 행이 `<ol class="choices">` 선지 목록을 가진다.

추가 확인(1과목 모바일):
- cards 46
- historyRows 170
- ansboxes 46
- keyBoxes 46
- conceptBoxes 46
- trapBoxes 46

즉 기존 하단 해설 박스는 카드 수와 동일하게 유지된다.

문법 검증:
- desktop/mobile inline script syntax PASS
- `bosesa-concepts-1~5.js` syntax PASS
- `git diff --check` PASS

## Claude 검수 요청

1. **모바일 뷰어** `중요개념 > 연도별 출제 이력`에서 각 유사문항의 선지 ①~⑤가 노란 박스 안에 의도대로 표시되는지 UI 확인.
2. 정답 강조가 `answer` 배열 기준으로 맞는지 표본 확인.
3. 노란 박스 아래의 기존 하단 해설(`실제 정답` 등)이 사라지지 않고 원래대로 이어지는지 확인.
4. 화면이 너무 길어졌다면 `details/summary` 접기 또는 간단한 "선지 보기" 토글을 UX 보완안으로 검토.
4. 데이터는 원문 기출 파일에서 기계 추출했으므로, 특정 문항의 선지 오기가 보이면 원문 `bosesa-data-*`와 `bosesa-concepts-*` 둘 다 확인.
