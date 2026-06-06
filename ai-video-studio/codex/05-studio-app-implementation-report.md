# 05 - Studio App Implementation Report

## 완료 범위

정적 `mock-app`을 실제 앱 구조로 옮기는 첫 단계를 완료했다. 새 구현은 `ai-video-studio/studio-app/`에 있으며, Next.js 16 + TypeScript 기반이다.

## 추가된 구조

```text
studio-app/
  app/
    api/                         # OpenAPI 의미 계약에 맞춘 route handlers
    page.tsx                     # StudioApp entry
    globals.css
  src/
    domain/                      # Project/Scene/Shot/Take/Job 타입과 intent templates
    server/mock-service.ts       # in-memory mock provider + job state machine
    features/studio/             # React UI + API client
  scripts/
    validate-contracts.ts        # codex config/schema/routing consistency check
    mock-flow.test.ts            # end-to-end mock state transition test
```

## 구현된 API route

| Route | 의미 |
|---|---|
| `GET /api/projects` | 프로젝트 목록 |
| `POST /api/projects` | 프로젝트 생성 + 스토리보드 생성 |
| `GET /api/projects/[projectId]` | 프로젝트 bundle 조회 |
| `POST /api/projects/[projectId]/generate-all` | 전체 컷 mock 생성 |
| `POST /api/shots/[shotId]/generate` | 단일 컷 후보 생성 |
| `POST /api/shots/[shotId]/select-take` | Take 선택 |
| `POST /api/shots/[shotId]/regenerate` | 이전 Take 보존 후 재시도 |
| `POST /api/takes/[takeId]/upgrade` | 게시용 품질 후보 생성 |
| `POST /api/projects/[projectId]/renders` | 6s/15s/30s 렌더 job 생성 |
| `POST /api/jobs/tick` | mock job 상태 진행 |
| `POST /api/cost/estimate` | 비용 estimate |

## 검증 결과

- `npm run validate:contracts` PASS
- `npm run test:mock` PASS
- `npm run typecheck` PASS
- `npm run build` PASS
- `npm audit --omit=dev` PASS, 0 vulnerabilities
- Local dev server `http://127.0.0.1:3020/` HTTP 200 확인
- `GET /api/projects` HTTP 200 확인
- HTTP API flow 확인: `POST /api/projects` -> `POST /api/projects/[projectId]/generate-all`, 30 GenerationJob 큐잉

## 보안/의존성 메모

`next@latest` 설치 후 npm audit이 transitive `postcss <8.5.10` 이슈를 보고했다. `npm audit fix --force`는 Next를 구버전으로 내리려 해서 사용하지 않았다. 대신 `package.json` `overrides.postcss=^8.5.10`로 lockfile을 갱신했고, audit 0건을 확인했다.

## 남은 작업

1. Claude R3 mock-app QA 결과 반영.
2. Playwright E2E 추가: 생성 -> 2컷 실패 -> 재시도 -> 선택 -> 승급 -> 렌더.
3. Remotion/FFmpeg placeholder render worker PoC.
4. DB/queue/storage boundary 설계 후 in-memory store 교체.
5. 첫 실제 provider adapter 1개 연결.
