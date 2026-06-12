# BOSesa 1과목 PDF 텍스트 불일치 후속 부분검수 인덱스

- 작성일: 2026-06-12
- 목적: 이후 Claude/Codex 어느 버전이든 1과목 PDF 원문 대조 이력을 다시 볼 때 전체 175문항을 재검수하지 않고, 이미 불일치가 발견된 문항/필드만 먼저 검수하도록 하는 빠른 진입점
- 대상: 보세사 1과목 2019~2025년
- 관련 기계판독 매니페스트: `internal/notes/bosesa-subject1-pdf-text-audit-target-index.json`

## 사용 규칙

1. 후속 검수자는 먼저 아래 `부분검수 타겟` 표의 문항만 확인한다.
2. 정확한 변경 전/후 문구가 필요하면 `연도별 원본 노트`를 연다.
3. 이 인덱스는 문제 본문/보기 텍스트 불일치 기록이다. 정답·오답·해설 정합성은 당시 검수 범위에서 제외했다.
4. 정답 검수 중 불일치가 새로 발견되면 JSON의 `answerTargets`와 이 문서의 `정답 관련 후속 타겟`에 추가한다.
5. Windows CP949 환경에서는 모든 노트와 데이터 파일을 UTF-8로 읽는다.

## 부분검수 타겟

| 연도 | 먼저 볼 문항 | 보지 않아도 되는 문항(텍스트 기준) | 원본 노트 |
| --- | --- | --- | --- |
| 2025 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24 | 10, 19, 20, 25 | `2026-06-12-bosesa-subject1-2025-pdf-text-audit.md` |
| 2024 | 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 | 2, 14 | `2026-06-12-bosesa-subject1-2024-pdf-text-audit.md` |
| 2023 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25 | 19 | `2026-06-12-bosesa-subject1-2023-pdf-text-audit.md` |
| 2022 | 1~25 | 없음 | `2026-06-12-bosesa-subject1-2022-pdf-text-audit.md` |
| 2021 | 1~25 | 없음 | `2026-06-12-bosesa-subject1-2021-pdf-text-audit.md` |
| 2020 | 5, 10, 11, 12, 18, 20, 21, 23, 25 | 1, 2, 3, 4, 6, 7, 8, 9, 13, 14, 15, 16, 17, 19, 22, 24 | `2026-06-12-bosesa-subject1-2020-pdf-text-audit.md` |
| 2019 | 3, 4, 6, 7, 9, 10, 11, 14, 15, 17, 18, 23 | 1, 2, 5, 8, 12, 13, 16, 19, 20, 21, 22, 24, 25 | `2026-06-12-bosesa-subject1-2019-pdf-text-audit.md` |

## 정답 관련 후속 타겟

이번 PDF 텍스트 대조에서는 정답·해설을 검수하지 않았다. 다만 기존 데이터에서 보존해야 하는 특이 정답 케이스는 후속 정답 검수 시작점으로 별도 표시한다.

| 연도 | 문항 | 보존/확인할 사항 |
| --- | --- | --- |
| 2023 | 3 | 복수정답 유지: `[4, 5]` |
| 2022 | 11 | 복수정답 유지: `[4, 5]` |
| 2021 | 19 | 모두정답 유지: `[1, 2, 3, 4, 5]` |

## 연도별 원본 노트

- `internal/notes/2026-06-12-bosesa-subject1-2025-pdf-text-audit.md`
- `internal/notes/2026-06-12-bosesa-subject1-2024-pdf-text-audit.md`
- `internal/notes/2026-06-12-bosesa-subject1-2023-pdf-text-audit.md`
- `internal/notes/2026-06-12-bosesa-subject1-2022-pdf-text-audit.md`
- `internal/notes/2026-06-12-bosesa-subject1-2021-pdf-text-audit.md`
- `internal/notes/2026-06-12-bosesa-subject1-2020-pdf-text-audit.md`
- `internal/notes/2026-06-12-bosesa-subject1-2019-pdf-text-audit.md`
