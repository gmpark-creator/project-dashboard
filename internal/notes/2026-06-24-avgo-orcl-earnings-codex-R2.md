# 브로드컴·오라클 실적 카테고리 — Codex 검수 핸드오프 (R2: 완성 산출물)

작성: Claude · 2026-06-24. R1(데이터·설계) 검수 반영 완료. 본 R2는 빌드된 페이지 적대 검수.

## 산출물
- 신규 페이지: `claude/previews/us-kr-premarket/broadcom-oracle-earnings/index.html` (자급 단일 HTML, Tailwind/FontAwesome CDN=기존 Polaris 페이지들과 동일 패턴).
- 허브 카드: `claude/previews/us-kr-premarket/index.html` 「섹션 0.7 실적 발표 후 주가」.
- 대시보드: `claude/js/projects-data.js` Polaris(us-kr-premarket) preview 라벨 + issues 업데이트.
- 데이터 원본(검증 소스): `internal/notes/2026-06-24-avgo-orcl-earnings-dataset.json`.

## R1 반영 사항(확인 대상)
- "1주일" 정확화: AVGO 1주일후=6/10(거래일5·주간저), ORCL=6/17. 6/18은 "표본 종료(회복)"로 분리.
- SOXS decay 분리: 6/3~18 SOXL≈-0.4%(제자리) vs SOXS -26.9% 별도 명시.
- 레버리지 경고: "일일 목표 수익률·보유기간 누적은 지수 누적의 3배 아님(복리 경로 의존)" 추가.
- SOX×3은 "근사", SOXL/SOXS 추종지수=ICE 반도체지수(SOXX 동일, PHLX SOX와 별개) 표기.
- 외부 보도주장(2020년 이후 최대·$1T·IDC -13%)은 "보도 기준"으로, 내부 등락률 검산과 분리 표기.

## R2 검수 요청 (read-only)
1. **페이지 DATA vs 데이터셋 JSON 일치**: 페이지 인라인 DATA.daily(14행)·이벤트 카드 수치가 dataset.json과 일치하는지(표본 대조). 이미 Claude가 프로그램 대조로 0불일치 확인했으나 재확인.
2. **렌더/코드**: cls()/pct() 색상 로직(상승 빨강 up·하락 파랑 down)이 부호와 맞는지, 표 행 강조(실적/반응/급락) 정확한지, 깨진 마크업/접근성 이슈 없는지.
3. **표기·면책**: R1 반영 5건이 페이지에 실제 반영됐는지, 레버리지/연구교육용/색상관례/출처분리 충분한지, 오해 소지(예: ORCL 디커플링, SOXS decay) 없는지.
4. **사실/내러티브**: 당일·다음날·1주일 프레이밍과 수치 정합, "호실적인데 급락" 서술이 데이터와 모순 없는지.
5. 기타 결함.

PASS/수정요구(구체 지목)/반대. 치명/경미 분리. 한국어 불릿, 이모지·특수기호 금지.
