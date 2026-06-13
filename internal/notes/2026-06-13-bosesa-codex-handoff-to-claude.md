# 2026-06-13 Codex 보세사 작업 인수인계

이 문서는 클로드가 프로젝트 대시보드 보세사 기출문제 최종 정리를 이어받기 위한 Codex 작업 요약이다.

## 전체 범위

- 기준 PDF 루트: `C:\Users\pkm77\Downloads\보세사 기출\기출과 정답`
- 대시보드 데이터 루트: `claude/previews/tradelogix-nexus`
- Codex가 직접 다룬 과목: 2과목, 4과목, 5과목
- 클로드 진행 영역으로 남겨둔 과목: 1과목, 3과목
- 사용자 요구 수준: PDF 파일에 있는 문제문, 선지, 정답과 프로젝트 대시보드 데이터가 일치하는지 확인하고, 불일치하면 PDF 기준으로 맞추는 것
- 이번 Codex 패스에서 제외한 것: 법령 조문을 별도로 찾아가며 상세 해설의 법리 정합성을 재검증하는 작업

## 작업트리 주의

현재 작업트리에는 Codex 작업 외 변경도 섞여 있다. 최종 정리 시 무관한 파일을 되돌리지 말 것.

- Codex가 수정한 데이터 파일:
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2019.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2020.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2021.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2022.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2023.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2024.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-2-2025.js`
- Codex가 추가한 보세사 노트:
  - `internal/notes/2026-06-13-bosesa-subject2-correction-pass.md`
  - `internal/notes/2026-06-13-bosesa-subject2-pdf-text-audit.md`
  - `internal/notes/2026-06-13-bosesa-subject2-pdf-text-audit-targets.json`
  - `internal/notes/2026-06-13-bosesa-subject4-pdf-dashboard-audit.md`
  - `internal/notes/2026-06-13-bosesa-subject5-pdf-dashboard-audit.md`
  - `internal/notes/2026-06-13-bosesa-codex-handoff-to-claude.md`
- Codex가 확인만 하고 수정하지 않은 데이터 파일:
  - `claude/previews/tradelogix-nexus/bosesa-data-4-2019.js` ~ `bosesa-data-4-2025.js`
  - `claude/previews/tradelogix-nexus/bosesa-data-5-2019.js` ~ `bosesa-data-5-2025.js`
- Codex 작업과 무관하게 작업트리에 보이는 항목:
  - `ai-video-studio/studio-app/next-env.d.ts`
  - `ai-video-studio/codex/131-resume-handoff-token-reset.md`
  - `claude/previews/ai-invest-board/`

## 2과목 보세구역관리

### 결론

2과목은 PDF와 대시보드 텍스트 불일치가 광범위해서 실제 데이터 파일을 보정했다.

### 반영 내용

- 대상: `bosesa-data-2-2019.js` ~ `bosesa-data-2-2025.js`
- PDF OCR 감사 후보 725건 중 자동 적용 가능한 591건을 문제문/선지에 반영했다.
- OCR이 빈 값이거나 표/조합형 선택지를 잘못 분리한 후보는 자동 치환하지 않았다.
- 자동 분리 실패 문항 중 PDF 이미지로 직접 확인한 10문항을 수동 보정했다.
  - 2019-6
  - 2020-2, 2020-21
  - 2021-8, 2021-11, 2021-21
  - 2022-23
  - 2024-12, 2024-23
  - 2025-22
- 2019~2025년 2과목 정답을 공식 정답표 기준으로 전면 재반영했다.
- 기존 해설이 새 정답/문항 원문과 충돌하지 않도록 모든 문항의 `answerBasis`와 `choiceAnalysis`를 공식 정답표 기준의 보수적 문구로 재작성했다.
- 세부 법령 근거형 해설은 새로 검증하지 않았다. 사용자 요청 우선순위가 PDF-대시보드 일치였기 때문이다.

### 2과목 정답 배열

- 2019: `3 1 5 5 1 3 3 1 5 4 3 3 1 2 1 4 5 2 3 5 2 4 4 2 5`
- 2020: `3 1 5 3 2 2 1 1 2 2 4 5 2 3 5 4 5 1 5 4 [1,2,3,4,5] 3 4 1 5`
- 2021: `4 3 3 2 3 1 4 5 2 4 5 2 2 1 2 4 4 2 1 4 3 3 3 5 4`
- 2022: `[1,4] 3 2 4 2 5 1 2 2 3 1 3 2 5 4 5 1 1 1 2 1 1 5 4 3`
- 2023: `4 5 3 2 1 2 2 4 5 2 5 3 2 4 1 5 3 3 4 5 1 1 1 3 5`
- 2024: `1 4 2 [2,5] 5 1 1 2 1 3 3 4 1 5 3 2 4 4 2 5 3 3 3 4 5`
- 2025: `5 3 2 4 1 3 2 4 2 5 4 4 1 3 3 2 4 1 1 1 3 5 5 5 3`

### 2과목 참고 노트

- 상세 작업 요약: `internal/notes/2026-06-13-bosesa-subject2-correction-pass.md`
- PDF 텍스트 감사 기록: `internal/notes/2026-06-13-bosesa-subject2-pdf-text-audit.md`
- 감사 후보 JSON: `internal/notes/2026-06-13-bosesa-subject2-pdf-text-audit-targets.json`

## 4과목

### 결론

4과목은 PDF 문제문/선지/정답과 대시보드 데이터가 일치했다. 데이터 파일 수정 없음.

### 확인 사항

- 대상: `bosesa-data-4-2019.js` ~ `bosesa-data-4-2025.js`
- 2019년 4과목은 `자율관리 및 관세벌칙`
- 2020년 이후 4과목은 `수출입안전관리`
- Windows OCR로 PDF 문제 페이지를 렌더링/대조했고, 각 문항 `sourcePage` 기준 페이지 단위 저일치 항목 0건
- 공식 정답표와 대시보드 `answer` 값 전부 일치
- 조합형/표형 보기에서 자동 문항 분리 파서가 낮은 유사도 경고를 낸 항목이 있었지만, 페이지 단위 원문 존재는 확인되어 수정 대상에서 제외했다.

### 4과목 특이 정답

- 2022년 16번: `[4, 5]`
- 2023년 8번: `[3, 5]`
- 2024년 2번: `[1, 2, 3, 4, 5]`

### 4과목 참고 노트

- `internal/notes/2026-06-13-bosesa-subject4-pdf-dashboard-audit.md`

## 5과목

### 결론

5과목도 PDF 문제문/선지/정답과 대시보드 데이터가 일치했다. 데이터 파일 수정 없음.

### 확인 사항

- 대상: `bosesa-data-5-2019.js` ~ `bosesa-data-5-2025.js`
- 2019년 5과목은 `수출입안전관리`
- 2020년 이후 5과목은 `자율관리 및 관세벌칙`
- Windows OCR로 PDF 문제 페이지를 렌더링/대조했고, 각 문항 `sourcePage` 기준 페이지 단위 저일치 항목 0건
- 공식 정답표와 대시보드 `answer` 값 전부 일치
- 조합형/표형 문항은 OCR이 보기 셀을 일부 분리하지 못할 수 있어, 데이터 덮어쓰기는 하지 않고 페이지 단위 원문 존재 여부를 우선 기준으로 삼았다.

### 5과목 특이 정답

- 2021년 18번: `[1, 3]`
- 2025년 10번: `[1, 4]`

### 5과목 참고 노트

- `internal/notes/2026-06-13-bosesa-subject5-pdf-dashboard-audit.md`

## 검증 결과

Codex가 확인한 검증은 다음과 같다.

- 2과목:
  - `node --check` 통과: `bosesa-data-2-2019.js` ~ `bosesa-data-2-2025.js`
  - 각 연도 25문항
  - 각 문항 5개 선지
  - `answerBasis` 존재
  - `choiceAnalysis` 5개
  - 공식 정답표 배열과 파일 내 `answer` 일치
- 4과목:
  - `node --check` 통과: `bosesa-data-4-2019.js` ~ `bosesa-data-4-2025.js`
  - 각 연도 25문항/5선지 구조 확인
  - 공식 정답표 배열과 파일 내 `answer` 일치
  - PDF OCR 페이지 단위 문제문/선지 저일치 0건
- 5과목:
  - `node --check` 통과: `bosesa-data-5-2019.js` ~ `bosesa-data-5-2025.js`
  - 각 연도 25문항/5선지 구조 확인
  - 공식 정답표 배열과 파일 내 `answer` 일치
  - PDF OCR 페이지 단위 문제문/선지 저일치 0건

## 임시 파일 정리

작업 중 생성한 OCR/렌더링 임시 파일은 삭제했다.

- `internal/tmp-bosesa-ocr-winrt.ps1`
- `internal/tmp-bosesa-subject4-render/`
- `internal/tmp-bosesa-subject4-answer-render/`
- `internal/tmp-bosesa-subject4-render-test/`
- `internal/tmp-bosesa-subject5-render/`
- `internal/tmp-bosesa-subject5-answer-render/`
- 4/5과목 임시 감사 JSON/스크립트

## 클로드가 최종 정리할 때 볼 포인트

- 2과목 데이터 파일은 실제 수정이 들어갔으므로 최종 diff를 중심으로 확인한다.
- 4과목과 5과목 데이터 파일은 Codex가 수정하지 않았다. 검수 노트만 추가됐다.
- 2과목 `answerBasis`/`choiceAnalysis`는 법령 상세 해설이 아니라 공식 정답표 기준의 보수적 설명이다. 사용자 요구가 PDF 일치였기 때문에 이 방식으로 맞췄다.
- 최종 산출 전에는 1과목/3과목 클로드 작업 결과와 충돌이 없는지 확인한다.
- 작업트리에 있는 `ai-video-studio` 및 `ai-invest-board` 관련 변경은 보세사 작업과 무관하므로 최종 정리 범위에서 제외하는 것이 맞다.
