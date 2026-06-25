# 보세사 중빈도·희소 — 전 선지 + 선지별(정답·오답) 해설 노출 (Claude 구현 → Codex 사후검수 요청)

- 일자: 2026-06-25
- 지시(박사): "중빈도랑 희소유형도 중요개념처럼 모든 선지가 보이게. 지금은 문제+정답만 있는데, 모든 선지 + 왜 오답인지 해설까지. 코덱스랑 협업 검수."
- 구현: Claude(Opus 4.8). 변증법 워크플로 — 본 노트로 Codex 사후검수 요청.

## 핵심 발견 (스코프 확정)
참조 문항의 **선지별 해설(choiceAnalysis)은 이미 원본 기출 데이터에 완비**돼 있었음(06-14 해설 재작성분).
→ 신규 콘텐츠 생성이 아니라 **"이미 있는 전 선지 해설을 학습뷰에 노출하는 렌더링 작업"**.

데이터 완전성 감사(스크립트 audit):
- 중빈도 참조 100문항: 문항없음0 / 선지없음0 / choiceAnalysis없음0 / **전 선지 완비 100**
- 희소 참조 33문항: 동일하게 **전 선지 완비 33**
- 즉 133/133 문항 모두 choices + answer + choiceAnalysis(선지 수 이상) 보유.

## 변경 내용 (렌더링만, 데이터 무변경)
파일 2개: `claude/previews/tradelogix-nexus/index.html`(데스크톱) + `.../bosesa-mobile/index.html`(모바일)

1. 공용 헬퍼 2개 신설(각 파일):
   - `bosesaAllChoicesHTML(q)` / 모바일 `covAllChoicesHTML(q)` — 전 선지 렌더(정답=초록 강조, 나머지=가독 슬레이트). 기존 quiz/concepts와 동일한 `.bq-choice`(데스크톱)·`ol.choices`(모바일) 스타일 재사용.
   - `bosesaChoiceAnalysisHTML(q)` / 모바일 `covChoiceAnalysisHTML(q)` — `q.choiceAnalysis` 전 항목 노출. 정답 라벨=초록, **오답 라벨=장미(rose)**. "선지별 분석 · 정답 근거 + 오답 이유".
2. `renderBosesaMidFreq`·`renderBosesaRareTypes`(데스크톱), `renderMidFreq`·`renderRareTypes`(모바일):
   - 기존 "공식 정답"(정답 선지만) → **"모든 선지"** 블록으로 교체.
   - 기존 "정답 선지 해설"(정답 선지만) → **"선지별 분석"**(전 선지 정답+오답) 으로 교체.
   - 정답 근거(answerBasis)·학습 메타(묶음근거/중빈도판단/공부포인트/다시볼것/시험장팁/희소성판단/재출제대응)는 그대로 유지.

## 자체 검증 (PASS)
- 문법: `node --check` 데스크톱·모바일 양쪽 OK.
- 헤드리스 Chrome 렌더(라이브서버 5500):
  - 데스크톱 중빈도 4과목: 전 선지 + 정답근거 + 선지별 분석 렌더 확인.
  - 모바일 희소 1과목: meta "희소 유형 7개", 선지별 분석에 "①가 오답…②나 오답…③다 오답…④라 오답…" 전 선지 분석 출력 확인.
  - #qlist 영역 1:1 대조 — qcard 7 : 모든선지 7 : 선지별분석 7 (중빈도 2과목·희소 1과목 동일).
  - exitCode 0, 콘솔 에러 0.

## Codex 사후검수 요청 사항 (BLOCK 가능)
1. **렌더 매핑 정합성**: choiceAnalysis[i] ↔ choices[i] 인덱스가 어긋나는 데이터(스키마 혼재: 문자열배열 vs {label,text}/{reason,text} 객체)가 없는지. `analysisTextOf`/`analysisText` 정규화가 전 과목에서 올바른지.
2. **정답/오답 라벨 정확성**: answer 배열 기준 정답 표시가 복수정답·B형 문항에서도 맞는지.
3. **해설 품질 스팟체크**: 06-14 재작성 choiceAnalysis 중 중빈도·희소 참조분에 환각/오기/누락이 없는지(특히 4과목 중빈도 66문항 — 표본 큼).
4. 발견 시 BLOCK + 정정안 → Claude 반영 루프.
