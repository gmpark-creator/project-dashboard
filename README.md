# Project Dashboard

공개 프로젝트 운영 리포트 저장소.

## 주요 URL

- 메인 인덱스: https://gmpark-creator.github.io/project-dashboard/
- Codex 운영 리포트: https://gmpark-creator.github.io/project-dashboard/codex/
- Solar Project - Codex: https://gmpark-creator.github.io/project-dashboard/solar-project-codex/
- Solar Project - Claude: https://gmpark-creator.github.io/project-dashboard/solar-project-claude/
- INST EXTRACTOR 브리핑: https://gmpark-creator.github.io/project-dashboard/codex/inst-extractor/
- 2D Match Tracker: https://gmpark-creator.github.io/project-dashboard/match-tracker/

## 현재 포함 프로젝트

1. AIS Ship Tracker
2. Sports Highlight Generator
3. Solar System Simulator
4. INST EXTRACTOR

## 최신 반영

- INST EXTRACTOR — 비ASCII 파일명 추출 실패 수정: 일본어 원본 파일명에서 결과 WAV 생성 후 `X-Original-Filename` 헤더 인코딩으로 500이 나던 문제를 percent-encoded 헤더로 변경. 같은 MP3 재검증 `POST /extract` 200 OK, 41.5MB WAV, 235.519초
- INST EXTRACTOR — 집 데스크탑 GPU 사양 확정: RTX 4060 Ti **8GB 모델** (4-소스 크로스체크 — nvidia-smi 8188 MiB / 레지스트리 qwMemorySize 8.0 GB / PyTorch total_memory 8.00 GB / WMI는 32-bit 한계로 무시). 일반 곡(3~5분) 검증엔 무관, htdemucs_ft + 매우 긴 음원 조합에서만 OOM 주의
- INST EXTRACTOR — 집 데스크탑 RTX 4060 Ti 풀스택 GPU 검증 완료 (HANDOFF [5]): PyTorch 2.11+cu128/CUDA 인식 True, separate_instrumental() 직호출 1.86s/543MB VRAM, HTTP /extract 200 OK 0.81s. 실음원 음질 평가는 디렉터 영역으로 남김
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
