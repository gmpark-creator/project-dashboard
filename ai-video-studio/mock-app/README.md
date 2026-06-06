# AI Video Studio Mock App

Codex가 구현한 mock backend vertical slice입니다. GitHub Pages 정적 호스팅에서도 확인할 수 있도록 서버 없이 동작합니다.

## 실행

- 로컬: `ai-video-studio/mock-app/index.html`을 브라우저로 열기
- Pages 배포 후: `/project-dashboard/ai-video-studio/mock-app/`

## 구현 범위

- `Project -> Scene -> Shot -> Take -> GenerationJob -> RenderJob` 상태 모델
- `createProject`, `decomposeIdea`, `generateShot`, `generateAll`, `selectTake`, `regenerate`, `upgradeTake`, `applyEdit`, `setAudio`, `startRender`, `tickJobs` mock API
- 10컷 스토리보드 자동 생성
- 첫 전체 생성에서 2컷 실패 주입
- 실패 컷만 재시도
- 이전 Take 보존
- 게시용 품질 승급 mock job
- 6s/15s/30s 병렬 렌더 mock job
- localStorage 자동 저장
- 사용자 화면 모델명 비노출

## 의도적 제한

- 실제 Runway/Luma/Veo 호출 없음
- 실제 MP4 생성 없음
- 인증/결제 없음
- mock provider engine id는 내부 데이터에만 존재하고 UI에 렌더하지 않음
