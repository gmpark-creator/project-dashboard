# Handoff to Claude — Unused Stack Visual Lab

Date: 2026-06-05
Repo: `project-dashboard`
Branch: `master`
Owner: Codex

## Summary

박사 요청에 따라 대시보드 메인 하단의 `STACK_ATLAS.unused`에 있는 **미사용 기술스택 전체**를 참고용 웹 시각화 자료로 만들었다.

URL:

- Local: `http://127.0.0.1:8019/claude/stack-lab/`
- GitHub Pages after push/deploy: `https://gmpark-creator.github.io/project-dashboard/claude/stack-lab/`

## What Changed

- Added `claude/stack-lab/index.html`
  - standalone reference page.
  - loads existing `../js/projects-data.js`, then reads `window.STACK_ATLAS.unused`.
- Added `claude/stack-lab/styles.css`
  - dark dashboard visual system, responsive cards, matrix, filters, canvas panel.
- Added `claude/stack-lab/stack-lab.js`
  - renders all unused candidates from the original atlas data.
  - shows **18 groups / 88 stacks / 10 combination prototypes**.
  - includes search, category filters, and animated Canvas stack-flow visualization.
- Updated root `index.html`
  - added link: `미사용 기술스택 시각화 랩`.
- Updated `README.md`
  - added GitHub Pages URL.

## Prototype Combinations

The page includes 10 stack-combo examples, each showing which stack is used in which part:

1. `AIS Edge Operations`
   - Cloudflare Workers + Hono: AIS API proxy/cache.
   - PostgreSQL + Redis + WebSocket: track storage, latest-position cache, live push.
   - MapLibre + Turf + deck.gl: route buffers, risk zones, high-volume vessel layers.
2. `Premarket Macro Brain`
   - DuckDB + Pandas/NumPy + SQL: macro/time-series aggregation.
   - Hugging Face + LangChain: news/filing summary.
   - ECharts + Observable Plot + TanStack Query: signal dashboard.
3. `DDUIM Vision Track`
   - OpenCV + TensorFlow.js/MediaPipe: player/ball detection.
   - ONNX Runtime + DuckDB: inference and frame analytics.
   - PixiJS + Phaser + WebRTC: tactical board and watch sync.
4. `INST Audio Workbench`
   - Web Audio API + WaveSurfer.js: waveform/spectrum UI.
   - Whisper + librosa + Tone.js: lyrics, BPM/key analysis, practice tools.
   - Tauri + SQLite + Docker: local GPU app packaging/history/reproducible env.
5. `Knowledgeverse Graph Studio`
   - D3.js + visx + Recharts: relationship graph and charts.
   - shadcn/ui + Radix + Jotai/XState: panels, modal state, selection state machine.
   - Storybook + Iconify + Variable Fonts: component catalog and asset standardization.
6. `Solar WebGPU Lab`
   - Rust + WGSL + WebGPU: ephemeris/particle compute path.
   - Three postprocessing + Rapier: lens effects and physics experiments.
   - Blender + Spline + glTF DRACO/KTX2: compressed 3D asset pipeline.
7. `Korea Gov Sim Multiplayer`
   - Socket.IO + Supabase/Firebase: rooms, leaderboard, save sync.
   - Godot + Flutter + React Native: web export and mobile companion candidates.
   - Redux Toolkit + Vitest + Testing Library: game state and UI regression.
8. `Monorepo Delivery Control`
   - pnpm workspace + Turborepo: preview build and shared package cache.
   - Bun + Deno + Node/Fastify: data scripts and lightweight API runtime comparisons.
   - GitHub Actions + Biome + Sentry: quality gate and runtime error collection.
9. `Immersive GIS Twin`
   - Cesium + 3D Tiles + OpenLayers: logistics/port/city digital twin.
   - Babylon.js + Spline: container yard and logistics equipment 3D scenes.
   - NestJS/Django + PostgreSQL: customs/warehouse event API and storage.
10. `JP Global Motion System`
   - Astro + SvelteKit + Vue/Nuxt: static content and interaction framework options.
   - GSAP + Lottie + Motion One: scroll sequence, icon motion, micro-interactions.
   - Vite + Variable Fonts: self-host bundles and typography experiments.

## Verification

- `node --check claude/stack-lab/stack-lab.js` PASS.
- `git diff --check` PASS. Git reported only CRLF normalization warnings for `README.md` and `index.html`.
- Playwright Edge headless desktop check PASS:
  - groups `18`, stacks `88`, combos `10`.
  - matrix rows `88`, combo cards `10`, filters `19`.
  - console/page errors `0`.
- Playwright Edge headless mobile 390px check PASS:
  - overflow `0`.
  - audio filter shows 4 rows.
- Local HTTP check PASS:
  - `http://127.0.0.1:8019/claude/stack-lab/` returned HTTP 200.

## Notes for Claude

- This is a reference visualization, not a production implementation of those stacks.
- The important contract is that all stack candidates are sourced from `STACK_ATLAS.unused`; do not duplicate a second stack catalog.
- If expanding later, add new combo definitions in `claude/stack-lab/stack-lab.js` and keep the matrix data-driven from `projects-data.js`.
