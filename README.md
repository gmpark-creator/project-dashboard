# Project Dashboard

공개 프로젝트 운영 리포트 저장소.

## 주요 URL

- 메인 인덱스: https://gmpark-creator.github.io/project-dashboard/
- Codex 운영 리포트: https://gmpark-creator.github.io/project-dashboard/codex/
- Solar Project - Codex: https://gmpark-creator.github.io/project-dashboard/solar-project-codex/
- Solar Project - Claude: https://gmpark-creator.github.io/project-dashboard/solar-project-claude/
- INST EXTRACTOR 브리핑: https://gmpark-creator.github.io/project-dashboard/codex/inst-extractor/
- **INST EXTRACTOR 직접 사용 (드래그앤드롭 데모)**: https://gmpark-creator.github.io/project-dashboard/inst-app/
- 2D Match Tracker: https://gmpark-creator.github.io/project-dashboard/match-tracker/

## 현재 포함 프로젝트

1. AIS Ship Tracker
2. Sports Highlight Generator
3. Solar System Simulator
4. INST EXTRACTOR

## 최신 반영

- **반도체 유니버스(#8) — 라벨 폰트·크기 + 화살표 great-circle 재설계 (2026-05-31)**: 지도 국가 라벨을 **Inter 폰트**(로컬 woff)로 교체 + **크기 축소**·자간 보정(너무 컸음). 공급망 **화살표를 솟던 포물선 → 지표에 밀착하는 대권(great-circle) 곡선 + 도착지 화살촉**으로 재설계해 방향이 또렷하고 항로처럼 세련. 회사 선택 시 본사 **지역 레벨로 프레이밍**해 화살표가 보이게(더 깊은 도시/마을 줌은 휠로, 핀은 정확한 주소 유지). Playwright 검증, push `43a0c1e` + 미리보기 재배포.
- **반도체 유니버스(#8) — 지도 국가/주/도시 라벨 + 화살표 정리 (2026-05-31)**: 벡터 지도에 **지명 표기** 추가(troika 3D 텍스트) — 멀리선 **국가명**, 가까이 가면 **주/도**(예: California) + **주요 도시**(점+이름, 예: San Francisco·Los Angeles). 카메라 거리 LOD + 전면 컬링 + 빌보드(영문). 공급망 **화살표는 흐르는 입자 제거**(정신사나움 해소) → 정적 아치+화살촉으로 깔끔·직관적. Playwright 검증, push `8090bf8` + 미리보기 재배포.
- **반도체 유니버스(#8) — 공급망 지도 벡터화: 무한 확대 + 본사 주소 딥 줌 (2026-05-31)**: 래스터(8K 위성) 텍스처는 확대하면 깨지므로 공급망 지도를 **벡터(단색 카툰)**로 전면 교체 — Natural Earth 국가 폴리곤을 `earcut`으로 삼각분할(구면 적응 분할)해 단색으로 채우고 국경·행정경계·위경도 격자를 라인으로 렌더. **벡터라 아무리 확대해도 선명**. 회사 클릭 시 **정확한 본사 좌표로 도시/마을 레벨까지 딥 줌**(minDistance↓), 핀은 카메라 거리 비례로 **화면상 일정 크기 마커** 유지. 8K 텍스처 제거(번들↓). Playwright 검증, push `566c4ff` + 미리보기 재배포.
- **반도체 유니버스(#8) — 공급망 도시 줌 + 우클릭 화면이동 (2026-05-30)**: 공급망에서 회사를 클릭하면 본사 **도시 상공까지 더 깊게 확대**되고, 선택 회사가 **정확한 본사 좌표에 작은 지도 핀**으로 표시(라벨은 화면 고정 크기 → 근접 시 거대화 방지). **마우스 드래그로 화면 이동(pan)** 추가 + 근접 줌 허용(minDistance↓). 버튼 매핑은 기본과 반대 — **좌클릭=화면이동 / 우클릭=각도조절**(휠=줌). Playwright 검증, push `9b20978`·`c39afc5` + 미리보기 재배포.
- **반도체 유니버스(#8) — 좌측 목록 패널 + 기업 세계시장 점유율 (2026-05-30)**: 칩분류·공급망 둘 다 좌측 중단에 클릭 가능한 **목록**을 추가 — 항목을 클릭하면 해당 아이콘으로 이동·선택되고 우측 상세가 열림(아이콘 클릭과 동일), 현재 선택 항목 하이라이트. 기업 28사의 **분야별 세계시장 점유율**(`COMPANY_SHARES`)을 데이터화해 목록 부제 + 우측 상세 패널 「세계시장 점유」 섹션에 표시(예: NVIDIA AI가속기 ≈90%, TSMC 파운드리 ≈70%, ASML EUV 100%, SK hynix HBM ≈60%). Playwright 검증, push `5df1623` + 미리보기 재배포.
- **반도체 유니버스(#8) — UI/아이콘/지도 수정 라운드 (2026-05-30)**: 디렉터 피드백 5건 — ① 칩 분류 휠 줌 활성 + 배경을 깔끔한 그라데이션 카툰으로 교체, ② 칩 아이콘을 실사풍 3D 모델(IC 패키지·DIMM·전력 모듈·카메라 렌즈·실리콘 웨이퍼 등)로 고도화 + `drei Environment`(Lightformer) IBL 조명, ③ 공급망 클러스터 겹침 해소(같은 도시 회사를 도시 중심 링으로 정렬 + 핀 배지 축소), ④ 지구 지도 2K→**8K day/night**([solarsystemscope](https://www.solarsystemscope.com/textures) CC-BY) + anisotropy 16 → 확대 디테일 대폭 향상, ⑤ 전체 3점 조명·PBR 재질 폴리시. **Playwright 헤드리스로 5개 상태 실제 렌더 검증**(콘솔 에러 0, NVIDIA 클릭 시 미국 본사 정합·연계사 펼침 확인). push `7519aa0` + VIEW LIVE 미리보기 재배포.
- **반도체 유니버스(#8) — 시각화 전면 재설계 (2026-05-30)**: 디렉터 지시 반영 — (1) 반짝임/깨져 보이던 현상 제거(Bloom 후처리·가산 글로우 평면·노드 halo 펄스 제거), (2) 자동회전·부유 제거로 가지런하게, (3) 아이콘 클릭 후에도 휠 줌이 항상 작동(카메라 고정 해제, fly-to는 입력 시 즉시 중단). **칩 분류**는 지구를 빼고 자체 생성한 반도체 회로 카툰 배경(`chip-bg.svg`) 위에 패밀리별 그리드로 정렬, **공급망**은 평소 떠 있는 회사 아이콘을 클릭하면 그 회사 본사 위치(`COMPANY_HQ` 28사 위경도)로 지구 위에 핀·확대되며 연계사·화살표(지구 위 호)가 연동되도록 재구성. Earth 자전·축기울기 제거(정적)로 본사 핀이 대륙과 정합. `tsc+vite build`·eslint 통과, push `e38ce50` + VIEW LIVE 미리보기 재배포. (지구 핀 미세 정렬은 `LON_OFFSET` 한 줄로 보정 가능)
- **대시보드 — 프로젝트별 「기술스택 영역별 상세」 섹션 신설 (2026-05-30)**: 기존엔 스택 이름만 칩으로 짧게 표시됐으나, 디렉터 요청으로 각 프로젝트에 "어느 영역 → 어떤 스택 → 어떻게 사용"하는지 자세한 설명을 추가. 8개 프로젝트 전부를 실제 코드·기존 데이터 근거로 분해해 영역별 `stackDetail`(총 54개 항목) 작성 — 예: Solar는 3D 우주 렌더링/케플러 천체력 엔진/지구·태양·위성 GLSL 셰이더/인터스텔라 블랙홀 셰이더/조석·달 위젯 등 8개 영역으로 분리. `projects-data.js`에 `stackDetail` 필드 추가 + `dashboard.js`에 「+ TECH STACK · 영역별 상세」 렌더 섹션 + `dashboard.css` 스타일(issues/timeline과 동일 시각 언어, 다크/라이트·프로젝트 컬러 자동 대응). 두 JS `node --check` 통과
- **반도체 유니버스(#8) — 검수 체크리스트 수정 마감 + ESLint 0 + VIEW LIVE 재배포 (2026-05-30)**: 집 데스크탑에서 HANDOFF 검수 체크리스트(#1~#8)를 9개 에이전트로 적대적 재검증 후 마감 — 자동회전 버그(settling 게이팅)·Designer 클러스터 지구앞 겹침(off-axis 재배치)·Bloom 과다(임계값 0.22→0.7)·앰블럼 배지 toneMapped 제거·aria-label 한글화·Google Fonts 제거(@fontsource self-host)·README 전면 현행화. **ESLint 14건→0** (App lazy-init / CategoryNode `IconMaterial` 모듈 호이스팅 / CompanyGraph 레이아웃·색 `companyLayout.ts` 분리 / Earth 텍스처 colorSpace를 `useTexture` onLoad로 이동). 워드마크 8개사 진짜 로고는 원래 P3 선택항목이라 보류. `tsc + vite build` 통과. semiconductor-universe push(`b8d6be7`) + 대시보드 VIEW LIVE 미리보기를 새 빌드로 교체(폰트 self-host 반영 → 런타임 외부호출 0). #8 카드 progress 1%→35% · 이슈→완료 갱신
- **Claude 대시보드 — 우상단 컬러 패널 정리 + 프로젝트별 자동 컬러 전환 (2026-05-30)**: 디렉터 지시 반영 — (1) 우상단 「Color」 패널의 설명 문구 일체 제거(9 modes·Gemini Nano Banana·localStorage 안내문 + 「+ NOTE」 푸터 + 항목별 hex 코드·dev 배지) → 스와치 + 테마명만 남긴 클린 리스트, (2) 기본 메인 테마는 violet(Midnight Violet) 그대로 유지하되 **각 프로젝트 진입 시 해당 프로젝트 고유 컬러로 자동 전환** — AIS=파랑(cyber)/DDUIM(뜀)=초록(emerald)/Solar=밝은 빨강(신규 `sunburst` 라이트 테마)/INST=믹싱 콘솔 다크(navy)/2026 PRESIDENT KOREA=다크 레드(obsidian)/Frontend & Tone Atelier=웜 라이트(claude-warm)/US-KR Premarket=클린 스카이(nordic)/지식 모음=라이트 인디고(light). 홈/전체 화면은 violet 유지. 매핑은 `index.html` FOUC 스크립트 ↔ `dashboard.js` 단일 소스(`window.__PROJECT_COLOR`) 공유로 무플리커 적용
- **INST EXTRACTOR — Claude 보고서 4번 프로젝트 카드 전면 개편 (2026-05-24)**: 디렉터 지시 반영 — (1) Claude가 만든 부분(UI·FastAPI 골격·홈 PC 자동 세팅·GPU 검증 스크립트·공개 보고서 UI 페이지) 5건을 명시적으로 기재, (2) 「GPT 위주로 만들어진」 사실(separate_instrumental Demucs 엔진 = Codex 영역)과 「AI 협업으로 해결한」 사건(일본어 파일명 500 에러 협업 수정)을 어제 태양계 프로젝트와 동일한 「핵심」 푸시아·핑크 그라데이션 색감으로 시각 구분, (3) 외부인 실사용 불가(GPU 백엔드 필요) → 디렉터 본인 PC 전용 도구로 운영 합의를 summary에 명기. 진척도 68% → 92% 갱신
- **INST EXTRACTOR — 보고서 페이지에 추출기 UI 공개 (`/inst-app/`)**: 원본 frontend를 GitHub Pages 환경에 맞춰 분기 — 데모 모드 기본 ON으로 외부 사용자도 드래그앤드롭 UI 즉시 체험 가능 · 실제 추출 모드 토글 시 본인 백엔드 주소 입력란 노출 · HTTPS 페이지에서 http:// 호출 시 mixed-content 차단 안내까지 포함 ※ 실제 GPU 추출은 백엔드가 필요해 외부인 실사용은 구조상 불가 — 디렉터 본인 PC 전용으로 운영
- **INST EXTRACTOR — Codex 주도로 실음원 추출 성공 (HANDOFF [6])**: 일본어 MP3(`今見える明日_戒める今日_*.mp3`)에서 결과 WAV 생성은 정상이었으나 `X-Original-Filename` 헤더의 비ASCII가 Latin-1 인코딩에 막혀 500이 나던 문제를 Codex가 `urllib.parse.quote()` percent-encoding으로 수정. 재검증 결과 `200 OK` · `41,545,676 bytes` WAV · `235.519초` — 실제 곡에서 보컬 제거 동작 확인됨
- INST EXTRACTOR — 집 데스크탑 GPU 사양 확정: RTX 4060 Ti **8GB 모델** (4-소스 크로스체크 — nvidia-smi 8188 MiB / 레지스트리 qwMemorySize 8.0 GB / PyTorch total_memory 8.00 GB / WMI는 32-bit 한계로 무시). 일반 곡(3~5분) 검증엔 무관, htdemucs_ft + 매우 긴 음원 조합에서만 OOM 주의
- INST EXTRACTOR — 집 데스크탑 RTX 4060 Ti 풀스택 GPU 검증 완료 (HANDOFF [5]): PyTorch 2.11+cu128/CUDA 인식 True, separate_instrumental() 직호출 1.86s/543MB VRAM, HTTP /extract 200 OK 0.81s. 실음원 음질 평가는 디렉터 영역으로 남김

### INST EXTRACTOR — AI별 작업 분담 (4번 프로젝트)
- **Claude (Opus 4.7) 영역**
  - 프론트엔드 `index.html` 전체 — 다크 믹싱 콘솔 UI, 드래그앤드롭, 모델 드롭다운, 진행바, VU 미터, 데모 모드 토글, 완료 팝업 (Tailwind + Lucide)
  - FastAPI 뼈대 (`main.py` 초기 골격) — `POST /extract`·`GET /health`·`GET /` 라우팅, 업로드 검증, 모델 화이트리스트
  - AI 릴레이 로그 시스템 (`HANDOFF.md`·`CODEX_TO_CLAUDE.md`·`NEXT_DESKTOP_STEPS.md`) 설계
  - 홈 PC 자동 세팅 (`SETUP_HOME_PC.md` + `setup_home.bat` + `start_server.bat` + `scripts/setup_windows_desktop.ps1` + `scripts/run_server.ps1`)
  - GPU 검증 스크립트 2종 (`scripts/verify_gpu.py`·`verify_http.py`) + HANDOFF [3]·[5]
  - 보고서 공유판 (`project-dashboard/inst-app/index.html`) — 본 페이지
- **Codex (ChatGPT) 영역**
  - `main.py`의 **`separate_instrumental()`** Demucs 핵심 분리 로직 — `get_model()` 로드 + `(model_name, device)` 캐시 + `torch.cuda.is_available()` 분기 + `apply_model(split=True, overlap=0.25, shifts=1)` + `vocals` 스템 제외 후 나머지 합산 + `soundfile`로 PCM_16 WAV 출력
  - 의존성 확정 (`requirements.txt`의 demucs/torch/torchaudio/soundfile)
  - **비ASCII 파일명 헤더 인코딩 버그 수정** — `X-Original-Filename-Encoded` percent-encoding으로 변경해 일본어 MP3 등 500 오류 해결
  - 실음원 검증 (HANDOFF [2]·[6]) — 일본어 곡에서 41.5MB WAV / 235초 실측
- **디렉터 영역**: 실음원 청취 품질 평가, 카드 사양 확정 (8GB), 외부 공유 정책 결정
- 태양계 Claude 버전 — NASA Eyes 공식 실사 임베드 (JPL 자산): 시뮬레이터 「📡 NASA Eyes」 토글 버튼 + 보고서 preview에 NASA Eyes iframe 항목 추가. 현재 focus 객체에 따라 NASA Eyes도 자동 이동 (NASA_EYES_MAP)
- 태양계 Claude 버전 — 인류 탐사선 3D 모델 (sprite 점 → Voyager 큰 접시·RTG·Mag 붐 / Parker 태양 가리개·패널 / NewHorizons 작은 접시 / JWST 황금 6각형) + 항적 점선(과거 청·미래 주황) + 방향 화살표
- 태양계 Claude 버전 — 태양 GLSL 셰이더(granulation·sunspot·limb darkening) + 가스 행성 atmospheric halo(목·토·천왕·해왕 Fresnel) + 위성 4종 카테고리 GLSL(Cratered·Volcanic·Icy·Hazy)
- 태양계 Claude 버전 — 두 블랙홀 분리 GLSL: 가르강튀아(영화 인터스텔라, view-warp + Einstein Ring + 청색편이) / 사건의 지평선(EHT M87*, 사실 기반 + Doppler crescent)
- 태양계 Claude 버전 — 웜홀 천문학 사실 셰이더 (deep space + 별 분광형 4종 + Einstein Ring lensing, Kip Thorne 자문)
- 보고서 재정비 — HAZE STORY 앰블럼 + 영어 메인 문구 가로 레이아웃, 보라 그라데이션, 「박사님→디렉터님」 일괄 교체, milestones 시간순, Codex 미리보기 제거 + AI 협업 일원화 설명(Claude 메인 구현 + Codex 디버깅 서포트)
- 태양계 Claude 버전 — 인류 탐사선·라그랑주·공궤도·성간/미지 천체 통합 레이어 추가 (Voyager 1·2 / New Horizons / Parker Solar / JWST / 지구-태양 L1~L5 동적 / 목성 트로이 군집 / 카모오알레와 1:1 공명 / 오무아무아 쌍곡선 / Planet Nine 가상). 「🛰 탐사선」「⚖ 라그랑주」「👽 미지」 UI 토글 3개로 카테고리 표시. 셀렉터 그룹 구분자
- 태양계 Claude 버전 — Phase 2: 「인터스텔라」 영화 시스템 통합 (가르강튀아 GLSL 블랙홀 + 웜홀 + 밀러·맨·에드먼즈 행성). Custom GLSL ShaderMaterial로 케플러 회전·fBm 플라즈마 노이즈·Doppler 빔잉·휘어진 lensing halo 실시간 렌더
- 태양계 Claude 버전 — Phase 1: 화성 로버 완전 제거 (박사님 지시), 라그랑주 L1~L5 depthTest:false + renderOrder 강화로 지구 뒤로 안 가려짐, JWST 황금 6각형 mesh + halo로 차별화
- 태양계 Claude 버전 — 위성 셀렉터 계층화 + 클릭 정보: 「초점」 메뉴에 위성 11개 행성 아래 들여쓰기(└), INFO 등록으로 셀렉터/mesh/라벨 클릭 시 사이드바 정보 표시. 위성 라벨을 mesh 본체 크기 비례(meshR×1.6 위, ×3.2 크기)로 본체에 근접하게 보정
- 태양계 Claude 버전 — 고해상 행성 텍스처(7행성 NASA 출처, jsDelivr/threex.planets) + 주요 위성 11개 추가 (포보스·데이모스·갈릴레오 4 · 타이탄·레아·티타니아·오베론·트리톤). 가시성 이중 로직: 행성 포커스 자동 표시 + 「🌙 위성」 전역 토글, opacity 페이드 트윈
- 태양계 Claude 버전 — NASA/Gaia DR3 팩트체크 정밀화: 40 에리다니 A 16.45 → 16.340 광년, α Cen 4.37 → 4.344 광년, 카이퍼 영역에 산란 원반(Scattered Disk, 50~1,000 AU) 입자·윤곽 추가. 정확도 97% → ~99.5%
- Claude 보고서 — 「G.M.PARK 프로젝트 대시보드」 메인 페이지 신설 (사이드바 로고 클릭 → 알록달록 그라데이션 HERO + 프로젝트 컬러풀 카드 + 추가 영역 placeholder)
- Claude 보고서 — Solar 프로젝트 상세에 2026-05-23~24 작업 4건(외태양계 영역·외계 항성계·부산 달 위젯·조석 부산 기본값) issues/milestones 추가
- Codex 공유용 핸드오프 마크다운 `claude/HANDOFF_FROM_CLAUDE.md` 작성 — 코드 위치·알고리즘 의도·피드백 요청 포인트 정리
- 태양계 Claude 버전 — 달 위젯에 실제 NASA 달 텍스처(moon_1024.jpg) 적용, Canvas 2D clip + multiply 합성으로 사실적 표면(크레이터·바다·고지) 표현
- 태양계 Claude 버전 — 달 위젯 색감 보정: 부산 조석예보표 톤(황금빛 노란 + 어두운 회색)으로 통일 (이전 단계)
- 태양계 Claude 버전 — 부산 기준 실시간 달 모양 위젯 추가 (조석 패널 위, Canvas 2D 위상 시각화 + 한국어 8단계 위상명 + 조명률·달 나이)
- 태양계 Claude 버전 — 조석표 기본 지점을 인천 → 부산으로 변경
- 태양계 Claude 버전 — 카이퍼 벨트(30~50 AU) 반투명 평면 띠 + 오르트 구름(2,000~100,000 AU) 반투명 sphere shell 추가로 영역 시각화 강화
- 태양계 Claude 버전 — 외계 항성계 추가: 「프로젝트 헤일메리」의 40 에리다니 A(16.45 광년), 「삼체」의 알파 센타우리(4.37 광년) 실제 거리 반영
- 태양계 Claude 버전 — 카이퍼 벨트·오르트 구름·외계 항성계 모두 「초점」 메뉴에서만 영역 윤곽 표시 (시야 깔끔하게 유지)
- 태양계 Codex / Claude 공개 비교 경로 분리
- 태양계 1년 전후 이동을 시간 흐름형 재생 방식으로 변경
- 태양계 Codex 버전 행성 텍스처 품질 개선
- INST EXTRACTOR 집 데스크탑 실행 인수인계 문서와 스크립트 반영
