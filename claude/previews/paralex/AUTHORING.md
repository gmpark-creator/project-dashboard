# Paralex 콘텐츠 추가 키트 (standardBatch)

> 디렉터가 "토익 문제 양 추가해줘"라고 하면 **이 문서대로 1회 분량(standardBatch)을 찍어** `data/`에 파일을 만들고 `data/manifest.js`의 `content[]`에 등록한 뒤 `node validator.mjs`로 검수한다. index.html은 **수정 불필요**(manifest를 읽어 자동 로드).

## 1회 분량 = standardBatch (manifest.standardBatch)
| 종류 | 수량 | 파일 | 등록 위치 |
|---|---|---|---|
| 독해(reading) | 4세트 | `data/sets/set-<biz|news>-NNN.js` 또는 `set-cap-<band>-NN.js` | `window.PARALEX_SETS["<id>"]` |
| 문법(grammar) | 1 glab / 8문항 | `data/grammar/glab-NNN.js` | `window.PARALEX_GLAB["glab-NNN"]` |
| 어휘(vocab) | 1 Day / 30카드 | `data/vocab-day-NNN.js` | `window.PARALEX_VOCAB_DAYS.push({day:N,...})` |
| 듣기(LC) | 2큐 항목(선택) | `data/listening.js`의 `queue[]`에 추가 | 외부 링크+메타만 |

> ★id 컨벤션: 레지스트리 키 = manifest content.id = **무접두**(`biz-009`, `news-007`, `cap-850-03`, `glab-004`). 파일명만 `set-`/`glab-` 접두.

## 콘텐츠 추가 절차 (5단계)
1. **생성**: 아래 스키마대로 파일 작성(기존 형제 파일을 템플릿으로 미러링). 100% 자체작성 original, 실존 기출/브랜드 비복제, 가공 도시·인물.
2. **manifest 등록**: `data/manifest.js`의 `content[]`에 `{ id, kind, file, order, planDay, band }` 한 줄씩 추가(order=학습 궤도 순서).
3. **검수**: `node validator.mjs` → `issueCount: 0` 확인. 경고(coverage 불균형 등)는 허용.
4. **멀티에이전트 적대검증**: 정답 재도출·정답 유일성·스키마·중복 lemma·영문법을 독립 검증(권장).
5. **커밋**: paralex 경로만 스코프(`git add claude/previews/paralex`).

## 6게이트 통과 최소 체크리스트 (Codex R3 락)
- [ ] 모든 id stable·unique, manifest ↔ 레지스트리 ↔ plan 역참조 일치
- [ ] reading: 지문(documents/chunks en+ko 직독직해)·문항(answer·evidenceSpanIds 실재·distractorRationales 전 오답·explanation)·정답 유일
- [ ] grammar: 8문항, 빈칸 1개, 정답 유일(빈칸에 한 보기만 성립), grammarPoint 유효
- [ ] vocab: 정확히 30카드, 기존 Day와 lemma 중복 0, 글로스·예문 누락 없음
- [ ] LC: 외부 링크만(provider/license:link-only/embedAllowed:false/fallbackUrl/durationMinutes), 오디오·전문 비내장
- [ ] reviewGates: 품질 게이트 pass:true(reviewer Claude·근거 note), human pass:false(practice)
- [ ] 금칙어(TODO/placeholder/미작성/작성예정) 0, version 기입

## 스키마 요약 (필드는 기존 파일을 정본으로)
- **reading**: `id,setKind,track(news|business),genre,scoreBandTarget(BANDS),difficultyRank(1-5),partFocus,skillFocus(SKILLS),trapFocus(TRAPS),vocabBand(VBANDS),targetTimeSec,title,source,license,attribution,storageAllowed,thirdPartyContentExcluded:true,wordCount,passage{documents[{id,label,paragraphs[{id,functionLabel,chunks[{en,ko,note}]}]}]},keyStructures,vocabulary,paraphrases,questions[{no,stem,choices,answer,evidenceSpanIds,skillFocus,trapFocus,distractorRationales[{label,type(DR_TYPES),note}],explanation}],reflectionPrompts,reviewGates,version`
- **grammar**: `id,title,partFocus,scoreBandTarget,targetTimeSec,items[{no,part,questionType,sentence(빈칸 _____ 1개),choices,answer,grammarPoint(GPOINTS),contextEvidence,explanation,trapNote,distractorRationales[{label,type(GDR),note}]}],reviewGates(legal/originality/answerability/grammarAccuracy/distractor/human),version`
- **vocab day**: `PARALEX_VOCAB_DAYS.push({day,title,cards[{id,lemma,pos,glossKo,collocation,example,listTag(VBANDS),tags}]})` — 30개
- **LC queue item**: `{id,sourceRef,provider,url,fallbackUrl,kind,durationMinutes,level,accent,task,license:"link-only",embedAllowed:false}`

## 공급 균형(validator 경고)
`standardBatch` 1회는 대략 reading 4일치 / grammar 1.3일치 / vocab 3일치를 공급한다. 문법이 가장 빨리 소진되므로, **문법은 2~3 배치마다 1개 더** 얹어 균형을 맞추는 것을 권장(`coverageDays` 경고로 표시됨).
