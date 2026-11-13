# AI 질문 기록기 → 대시보드 연결

> **사무실→집 동기화 후속 작업:** 저장소 루트의 [AI_QUESTION_LOGGER_HANDOFF.md](../../AI_QUESTION_LOGGER_HANDOFF.md)를 먼저 읽으세요. 아래 bridge는 같은 브라우저의 연결 도구이며 PC 간 동기화 기능이 아닙니다.

대시보드의 **15번 AI 질문 기록기 → 질문 내역**에서 CSV/JSON 파일을 가져오면 내역을 바로 볼 수 있습니다. 날짜·사이트·카테고리·질문 검색, 근무시간 외 필터, 검색 결과 CSV 저장을 지원합니다. 가져온 사본은 현재 브라우저에만 저장되며 서버로 업로드하지 않습니다.

## 기존 확장 연결

이 도구는 기존 기록기에 읽기 연결을 추가합니다. 별도 확장으로 설치하면 기존 기록에 접근할 수 없습니다.

1. 기록기가 설치된 PC에서 `chrome://extensions` 또는 `edge://extensions`를 열고 개발자 모드를 켜 기존 기록기의 압축해제 소스 폴더를 확인합니다.
2. 이 저장소에서 다음 명령을 실행합니다. 경로는 실제 기록기 폴더로 바꾸세요.

   ```powershell
   node tools/ai-question-logger-bridge/install.cjs "C:\실제경로\ai-question-logger"
   ```

3. 확장 관리 화면에서 **기존 기록기 새로고침**을 누릅니다. 기록기를 삭제/재설치하지 마세요.
4. https://gmpark-creator.github.io/project-dashboard/claude/#/p/ai-question-logger 를 다시 열고 **확장 연결 / 새로고침**을 누릅니다. 새 질문을 확인할 때도 버튼을 누릅니다.

연결 코드는 해당 대시보드의 기록기 화면에서 요청할 때만 기록 배열의 표시용 필드를 읽습니다. Chrome과 Edge는 각자 연결해야 하며, 다른 PC 기록을 자동 합치지 않습니다. 원본 기록 삭제·설정 변경·서버 전송은 하지 않습니다. 동일 GitHub Pages 출처의 페이지 코드는 브라우저 보안상 같은 출처를 공유합니다.

알려진 배열 이름은 `records`, `logs`, `entries`, `history`, `questions`, `questionLogs`, `questionHistory`, `aiLogs`입니다. 실제 확장 소스와 저장 구조는 현재 작업 PC에 없어 검증 전입니다. 배열이 여러 개이거나 다른 이름이면 연결 오류를 표시하고, CSV 가져오기는 계속 사용할 수 있습니다. 설치 전 원본 manifest는 `manifest.json.before-dashboard-bridge`에 보관됩니다.

## 파일 형식

JSON은 배열 또는 `{ "records": [...] }` 등 위 배열 컨테이너를 지원합니다. CSV는 헤더가 필요하며 쉼표·줄바꿈·따옴표가 포함된 필드를 지원합니다.

```json
[{"timestamp":"2026-11-13T09:30:00+09:00","site":"Claude","category":"개발","topic":"대시보드 내역 보기","outsideWorkHours":false}]
```

`question/prompt/text/content/topic/title/질문/내용/주제`를 질문으로, `timestamp/createdAt/time/datetime/dateTime/ts/일시/시각`을 시각으로 인식합니다. `날짜` + `시각` 조합도 지원합니다. 시간대 없는 날짜+시각은 한국시간으로 취급합니다. 주제만 저장된 기록에서는 전체 질문을 복구할 수 없습니다. 근무시간 외 표시는 원본 판정을 사용하며 값이 없으면 임의로 추정하지 않습니다.
