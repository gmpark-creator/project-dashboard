# MAGE Supply — Batch 01 (p1~50) 분석 DB

> Module 2 선사업무 / MAGE Project / SUPPLY. 1차 배치(1~50페이지). 전 산출 한국어. Codex 교차검수 대상.

## 배치 개요

- **출처**: 「페이지 포함 파일 - 26년 4월과 5월의 자료 전체 모음 - 1번 - 50페이지.pdf」 (2026년 4~5월 MAGE supply 조달기록)
- **추출 방식**: p1~8 = 디지털 텍스트(pymupdf), p9~50 = 스캔 이미지(비전 판독). raw 품목 **361건** → 표준 통합. **※ '부식'(식료품·프로비전) 파트는 박사 지시로 본 DB에서 제외 — 비식품 표준품목만 수록.**
- **페이지 회계 — p9 제외 명시**: p9 = 부식(BLACK OLIVES 외, 1100×1000×1500MM 111 PCS / 1,300KG / 13,692,928원 / HS 8409, 부식창고 통합 customs 라인, NIKOLAY TRUBYATCHINSKY) → 부식 제외정책으로 본 DB 미수록(검토 후 제외).
- **선박단 (MAGE · Marine Arctic Geological Expedition, 북극 해양 지질 탐사)**:
  - **NIKOLAY TRUBYATCHINSKY** (RV 연구선, 등록기호 UBIQ6, 러시아 RU 선적) — 본 배치 주력
  - **AKADEMIK KAZANIN** (탐사선, ORDER 9 발주처)
  - **SAPFIR / 사피르** (RV)
- **공급사·통관 대행**: COENS GLS(코엔스 지엘에스, 담당 Dave Yun)·더마린코리아(대표 김정문) / 부산세관(물류감시과) 적재허가
- **서류 종류**: 내국·외국 선박용품 적재허가(신청)서 · DELIVERY NOTE(거래명세서) · Commercial Invoice(상업송장) · Packing List(패킹리스트) · Air Waybill(항공운송장) · DHL 특송장 · Proforma Invoice(견적송장) · PROVISION 가격표/오더리스트

## 카테고리 구성

| # | 카테고리 | 비고 |
|---|---|---|
| A | 화학·건자재 | p1~8 (시멘트 성적서 + 규산나트륨 MSDS) |
| C | 기관 예비품(엔진 스페어) | p20~37·49·50 (Cummins N14 계열 디젤엔진 — 송장↔패킹리스트 중복 통합) |
| D | 전자·계측·사무·전기전장 | p10·11·13·43·45·46·48 |
| E | 공구·위생·방역·선용품·기타 | p12·38~42·44·47 |

---

## A. 화학·건자재 (p1~8)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **보통 포틀랜드 시멘트 1종** (KS L 5201) | 선체·탱크·구조물 보수 및 차수(누수 차단) 공사의 콘크리트 결합재로 추정 (선박 적재 자재) | 삼표시멘트 부산공장 출하(생산/품질관리=삼척공장, 품질팀장 직인), 풍신건재 납품. 시험성적: 비표면적 3,750㎠/g(기준 2,800↑), 초결 294분, 종결 6:40, 오토클레이브 팽창 0.19%. KS L 5201 1종(범용). | p1 (시험성적표) | 수량 미기재(성적서) |
| **액상규산나트륨** (SODIUM SILICATE SOLUTION) · 일반명 "급결 지수액" | **시멘트 급결제·지수(止水)제** — 시멘트와 병용해 누수부위를 급속 응결·차단. 위 시멘트와 한 세트(선체/탱크 차수·보수 추정) | 권고용도=시멘트급결제. 고려화학산업사(부산 강동). 규산소다 3종, 비중 1.380↑, Na₂O 9~10%, SiO₂ 28~30%. **CAS 1344-09-8 · UN 1760**(8급 부식성 액체). 피부부식성/눈손상 **구분1(위험)** — 보안경·내화학장갑 필수, 5℃ 이상·산(酸)과 격리 보관. | p2~8 (MSDS, 16개 항목 전체) | 수량 미기재(MSDS) |

> A 비고: 시멘트+규산나트륨(급결 지수액)은 **누수 급속 차단(지수) 세트**. 선박 내 정확한 사용처(선체·밸러스트탱크·빌지 보수 vs 탐사기지)는 원문에 미명시 → **추정**. 후속 배치에서 동일 공급/용도 단서 발견 시 확정.


---

## C. 기관 예비품(엔진 스페어 · Cummins N14 계열)

## 기관 예비품(엔진 스페어) — 통합 명세 (Cummins N14 계열 디젤엔진 추정)

> 공급사 WINS GABLE DEVELOPMENT LIMITED(홍콩) / 수입자 COENS GLS(부산) / 최종 인수 선박 MAGE(무르만스크). 전 품목 HS 8409 = 압축착화(디젤)기관 부품. **상업송장(Commercial Invoice, p24·25·27·28·30)** 과 **패킹리스트(Packing List, p31·32·33·34·35·37)** 가 동일 P/I 0167 묶음을 이원 기재 → 부품번호 기준 1행 통합(출처 페이지 모두 보존). "수량합"은 동일 물품의 양 서류 일치 수량(이중 계상 아님).

### A. 피스톤·크랭크 구동계 (Power assembly / 운동부)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 피스톤 링 세트 (Ring, Set, Piston) — P/N 4089811-10 | 주기관/발전기 디젤엔진의 피스톤 외주에 장착. 실린더 벽과 피스톤 사이를 밀봉하고 윤활유를 긁어내림 | 압축링+오일스크레이퍼링 1세트. 압축가스 누설(블로바이) 방지·연소압 유지·오일소모 제어의 핵심 마모성 소모품. 오버홀 필수 교체 | Ring,Set,Piston(CI p24, 739.25CNY) = Ring,Set,Piston(PL p34, Net13.20KG) | 6 PCS |
| 커넥팅 로드 어셈블리 (Assembly, Connecting Rod) — P/N 3013930-20 | 피스톤과 크랭크샤프트를 연결, 직선왕복운동을 회전운동으로 변환 | 커넥팅로드 본체 조립품. 폭발 하중을 크랭크축에 전달하는 주요 구조부품 | Assembly,Connecting Rod(CI p24, 2,516.76CNY) = (PL p34, Net25.20KG) | 6 PCS |
| 커넥팅 로드 베어링 (Bearing, Connecting Rod) — P/N 214950-20 | 커넥팅로드 대단부와 크랭크핀 사이 미끄럼 베어링 | 메탈(평면 베어링). 유막으로 회전저널을 지지, 마모 시 교체하는 소모성 정밀부품 | Bearing,Connecting Rod(CI p24, 58.47CNY) = (PL p34, Net1.30KG) | 12 PCS |
| 피스톤 핀 (Pin, Piston) — P/N 191970-20 | 피스톤과 커넥팅로드 소단부를 결합하는 핀(피스톤 핀/리스트 핀) | 피스톤의 왕복력을 커넥팅로드에 전달. 고강도 경화강 | Pin,Piston(CI p24, 162.37CNY) = (PL p34, Net8.88KG, Total9.51 원문표기) | 6 PCS |
| 메인 베어링 세트 (Set, Main Bearing) — P/N 3801260-10 | 크랭크샤프트 메인저널을 엔진블록에 지지 | 주베어링 1세트. 크랭크축 회전의 기본 지지부, 오버홀 시 일괄 교체 | Set,Main Bearing(CI p24, 1,291.14CNY) = (PL p34, Net3.50KG) | 1 PCS |
| 다웰 링 / 위치결정 핀 (Dowel, Ring) — P/N 3037045-20 | 부품 간 정확한 위치 정렬용 위치결정 링/핀 | 조립 시 부품 동심·정렬 고정. 소형 정밀 위치결정 요소 | Dowel,Ring(CI p24, 7.36CNY) = (PL p34, Net0.07KG) | 7 PCS |

### B. 밸브트레인·실린더 헤드 (밸브 구동계)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 흡기 밸브 (Valve, Intake) — P/N 3803512-10 | 실린더 헤드. 흡기행정에서 열려 공기를 연소실로 유입 | 포핏 밸브. 흡입 공기 충전 담당, 정기 교체 마모부품 | Valve,Intake(CI p24, 56.68CNY) = (PL p34, Net3.60KG) | 12 PCS |
| 배기 밸브 (Valve, Exhaust) — P/N 3803519-10 | 실린더 헤드. 배기행정에서 열려 연소가스 배출 | 고온 노출 내열강 포핏 밸브. 흡기밸브보다 가혹 조건, 소모성 | Valve,Exhaust(CI p24, 115.46CNY) = (PL p34, Net3.60KG) | 12 PCS |
| 밸브 스프링 가이드 (Valve Spring Guide) — P/N 170296-20 | 밸브 스프링의 좌면/가이드 (밸브트레인) | 스프링 안착·직진 안내. 송장에 동일 P/N이 2개 라인으로 중복 기재됨(각 24개) | Valve Spring Guide ×2라인(CI p24, 각 12.46CNY) = (PL p34, ×2라인 각 Net0.58KG) | 48 PCS (24×2) |
| 밸브 스프링 (Spring, Valve) — P/N 211999-20 | 밸브를 닫힘 방향으로 복귀시키는 스프링 | 캠 리프트 후 밸브 폐쇄력 제공. 피로 마모성 | Spring,Valve(CI p24, 72.30CNY) = (PL p34, Net3.41KG) | 24 PCS |
| 밸브 스템 가이드 (Guide, Valve Stem) — P/N 3006456-20 | 밸브 스템을 안내하는 부싱(헤드 내) | 밸브 직진 왕복 안내·열전달. CI·PL 동일 부품번호 3006456-20 | Guide,Valve Stem 3006456-20(CI p24, 36.68CNY) = 3006456-20(PL p34, Net2.64KG) | 24 PCS |
| 밸브 스프링 리테이너 (Retainer, Valve Spring) — P/N 3042745-20 | 밸브 스프링 상단을 스템에 고정(코터와 함께) | 스프링 장력을 밸브에 전달하는 고정 캡 | Retainer,Valve Spring(CI p24, 5.88CNY) = (PL p34, Net2.40KG) | 24 PCS |
| 밸브 시트 인서트, 배기 (Insert, Valve Exhaust) — P/N 200354-20 | 헤드에 압입되는 배기 밸브 시트 링 | 밸브 안착면. 내마모·내열 인서트, 밀봉면 형성 | Insert,Valve Exhaust(CI p24, 36.13CNY) = (PL p34, Net4.99KG) | 12 PCS |
| 밸브 시트 인서트, 흡기 (Insert, Valve Intake) — P/N 3017759-20 | 헤드에 압입되는 흡기 밸브 시트 링 | 흡기 밸브 안착면 형성 인서트 | Insert,Valve Intake(CI p24, 188.13CNY) = (PL p34, Net0.43KG) | 12 PCS |
| 익스팬션 플러그 (Expansion Plug) — P/N 3007635-20 | 블록/헤드 주조 코어홀 밀봉 플러그(워터재킷) | 코어홀 막음·동결 시 압력 릴리프. 부식성 교체부품 | Expansion Plug(CI p24, 10.35CNY) = (PL p34, Net0.19KG) | 24 PCS |
| 익스팬션 플러그 (Expansion Plug) — P/N 3007634-20 | 워터재킷/오일통로 코어홀 밀봉 | 위와 동일 기능, 소형 사이즈 | Expansion Plug(CI p29 Item17, 2.96CNY) = (PL p32 Item17, Net0.08KG) | 9 PCS |
| 익스팬션 플러그 (Expansion Plug) — P/N 3811952-20 (PL 3011952-20) | 코어홀 밀봉 플러그 | CI/PL 번호 차(스캔), 동일 위치(Item51)로 동일품 판정 | Expansion Plug 3811952-20(CI p29, 5.35CNY) = 3011952-20(PL p32, Net0.08KG) | 1 PCS |
| 싱글 헤드 개스킷(세트) (Single Head Gasket Set) — P/N 4915303-10 | 실린더 헤드와 블록 사이 밀봉 | 연소압·냉각수·오일 통로 동시 밀봉하는 핵심 헤드 개스킷. 오버홀 필수 교체 | Single Head Gasket(CI p25, 2,446.74CNY) = Single Head Gasket Set(PL p35, Net1.25KG) | 1 PCS |
| 로어 엔진 개스킷 키트 (Lower Engine Gasket Kit) — P/N 4915302-10 | 엔진 하부(오일팬/하부 커버 등) 일괄 밀봉 키트 | 하부 정비 시 사용하는 개스킷 묶음 | Lower Engine Gasket(CI p25, 1,559.94CNY) = Lower Engine Gasket Kit(PL p35, Net2.30KG) | 1 PCS |

### C. 캠샤프트·로커·캠팔로워 (동밸브 구동·연료캠계)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 캠샤프트 (Camshaft) — P/N 3042568-20 | 엔진 캠축. 회전하며 밸브·인젝터 구동 타이밍 결정 | 별도 P/I 0167-4·별도 팔레트로 단독 포장. 밸브트레인 구동의 핵심 회전축 | Camshaft(CI p28, 3,484.57CNY) = Camshaft(PL p37, Net22.77KG, Item01) | 1 PCS |
| 캠샤프트 기어 (Camshaft Gear) — P/N 3035195-20 | 캠축 구동 타이밍 기어 | 크랭크↔캠 타이밍 전달. 정밀 기어 | Camshaft Gear(CI p25, 1,598.93CNY) = (PL p35, Net6.22KG) | 1 PCS |
| 캠샤프트 부싱 세트 (Set, Camshaft Bushing) — P/N 3801106-20 | 캠축 저널 지지 부싱 1세트 | 캠축 회전 지지·유막 형성, 오버홀 교체 | Set,Camshaft Bushing(CI p25, 694.10CNY) = (PL p35, Net1.41KG) | 1 PCS |
| 캠샤프트 스러스트 (서포트) (Camshaft Thrust / Support) — P/N 3008530-20 | 캠축 축방향 유격 제어 스러스트 부품 | 캠축 전후 위치 고정 | Camshaft Thrust(CI p30 Item71, 90.91) = Camshaft Thrust Support(PL p33, Net0.47KG) | 1 PCS |
| 로커 레버(로커암) (Lever, Rocker) — P/N AR2308-20 | 밸브트레인. 푸시로드 운동을 밸브로 전달 | 밸브 개폐 레버. 마모·점검 대상 | Lever,Rocker AR2308-20(CI p24, 185.38CNY) = (PL p34, Net6.24KG) | 6 PCS |
| 로커 레버(로커암) (Lever, Rocker) — P/N BM95162-20 | 밸브트레인 로커암(별 형식) | 위와 동일 기능, 다른 부품번호 | Lever,Rocker BM95162-20(CI p29 Item25, 153.00) = (PL p32, Net3.67KG) | 6 PCS |
| 로커 레버(로커암) (Lever, Rocker) — P/N BM95161-20 | 밸브트레인 로커암(짝 형식) | 위와 동일, 좌/우 또는 흡/배기 구분 추정 | Lever,Rocker BM95161-20(CI p29 Item26, 153.00) = (PL p32, Net3.64KG) | 6 PCS |
| 로커 레버 샤프트 (Rocker Lever Shaft) — P/N 3038904-20 | 로커암 회전 지지축 | 로커암 피벗축, 윤활 통로 포함 | Rocker Lever Shaft(CI p24, 158.27CNY) = (PL p34, Net3.70KG) | 3 PCS |
| 로커 레버 샤프트(플러그) (Rocker Lever Shaft / Plug) — P/N 3038903-20 | 로커암 축/축 단부 플러그 | CI는 샤프트, PL은 'Shaft Plug' 표기 — 동일 P/N 통합 | Rocker Lever Shaft(CI p25, 19.99CNY) = Rocker Lever Shaft Plug(PL p35, Net0.32KG) | 6 PCS |
| 캠 팔로워 하우징 (Cam Follower Housing) — P/N 3081251-20 | 캠 팔로워(태핏) 어셈블리 수용 하우징 | 연료/밸브 캠 팔로워 지지 구조체, 고가 주물 | Cam Follower Housing(CI p24, 2,366.92CNY) = (PL p34, Net20.50KG) | 3 PCS |
| 캠 팔로워 레버 (Cam Follower Lever) — P/N 3056568-20 | 캠과 푸시로드 사이 종동 레버 | 캠 윤곽을 따라 운동 전달, 마모부품 | Cam Follower Lever 3056568-20(CI p24, 381.79CNY) = (PL p34, Net7.80KG) | 12 PCS |
| 캠 팔로워 레버 (Cam Follower Lever) — P/N 3081250-20 | 캠 종동 레버(다른 형식) | 위와 동일 기능, 다른 번호 | Cam Follower Lever 3081250-20(CI p24, 419.96CNY) = (PL p34, Net5.40KG) | 6 PCS |
| 캠 팔로워 하우징 개스킷 (Gasket, Cam Follower Hsg) — P/N 3068473-20 | 캠팔로워 하우징 접합부 밀봉 | 오일 누유 방지 개스킷 | Gasket,Cam Follower Hsg(CI p29 Item33, 33.64) = (PL p32, Net0.17KG) | 3 PCS |
| 캠팔로워 완충판(발톱형 커플링편) (爪式联轴节缓冲片) — P/N 3046200-20 | 발톱형(claw) 커플링 완충/감쇠편 | 구동 커플링 진동 흡수편. CI·PL 동일 3046200-20 | 爪式联轴节缓冲片 3046200-20(CI p30 Item64, 14.53) = 3046200-20(PL p33, Net0.02KG) | 1 PCS |

### D. 실린더 라이너·부싱·구조 (실린더계)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 실린더 라이너 키트 (Kit, Cylinder Liner) — P/N 3801826-10 | 실린더 보어 내벽(라이너) 교체 키트 | 피스톤 습동면. 오버홀 시 라이너+씰 일괄 교체, 단일 품목 중 최대 중량(약 50KG/6개) | Kit,Cylinder Liner(CI p29 Item1, 487.71) = (PL p32, Net50.22KG) | 6 PCS |
| 라이너 씰 링 (Ring, Liner Seal) — P/N 3054948-20 | 실린더 라이너 하부 냉각수 밀봉 링 | 라이너-블록 사이 냉각수 누수 방지 O링/씰 | Ring,Liner Seal(CI p29 Item2, 85.37) = (PL p32, Net0.30KG) | 6 PCS |
| 부싱 (Bushing) — P/N 3028075-20 | 엔진 내 회전/지지부 부싱 | 미끄럼 베어링 부싱 | Bushing(CI p29 Item8, 95.89) = (PL p32, Net4.00KG) | 4 PCS |
| 부싱 (Bushing) — P/N 3028269-20 | 지지부 부싱 | CI·PL 동일 3028269-20, 동일 위치 Item10 | Bushing 3028269-20(CI p29 Item10, 112.69) = 3028269-20(PL p32 Item10, Net0.50KG) | 2 PCS |
| 부싱 (Bushing) — P/N 3811051-20 (PL 3011951-20) | 지지부 부싱 | CI/PL 번호 차, 동일 위치 Item10·11 | Bushing 3811051-20(CI p29, 97.88) = 3011951-20(PL p32, Net0.17KG) | 1 PCS |
| 부싱/라이너 슬리브 (衬套 / Bushing-liner sleeve) — P/N 132770-20 | 라이너 슬리브형 부싱 | 중국어 衬套(부싱) 원문. CI·PL 동일 衬套 | 衬套(CI p29 Item41, 429.96) = 衬套(PL p32 Item41, Net0.07KG) | 1 PCS |
| 인젝터 슬리브 (Sleeve, Injector) — P/N 3406702-20 | 인젝터를 헤드에 장착하는 동(銅) 슬리브 | 인젝터 냉각·밀봉. 연료/냉각수 격리, 누수 시 교체 | Sleeve,Injector(CI p29 Item19/20, 48.18) = (PL p32, Net0.60KG) | 6 PCS |
| 심/조정판 (Shim) — P/N 65259C-20 | 간극·예압 조정용 박판 | 조립 공차 보정 심 | Shim(CI p29 Item42, 4.13) = (PL p32, Net0.01KG) | 1 PCS |
| 베어링 스페이서 (Bearing Spacer) — P/N 196844-20 | 베어링 축방향 간격 유지 스페이서 | 베어링 위치 고정 링 | Bearing Spacer 196844-20(CI p30 Item81, 22.66) = BEARING SPACER 196844-20(PL p33 Item81, Net0.04KG) | 1 PCS |
| 스러스트 베어링 (Thrust Bearing) — P/N 215233-20 | 크랭크/캠축 축방향 하중 지지 | 축방향 유격 제어 베어링 | Thrust Bearing(CI p30 Item60, 49.56) = (PL p33, Net0.04KG) | 1 PCS |
| 오프셋 우드러프 키 (Offset Woodruff Key) — P/N 3021600-20 | 기어/풀리 회전방지 반월키 | 축-허브 회전 고정용 키, 오프셋형 | Offset Woodruff Key(CI p30 Item93, 24.54) = (PL p33, Net0.004KG) | 1 PCS |
| 액세서리 드라이브 (Accessory Drive) — P/N 3005131-20 | 보기류(펌프 등) 구동 드라이브 | 엔진 부속기기 구동 전달부, 고가 조립품 | Accessory Drive(CI p30 Item59, 2,582.66) = (PL p33, Net8.82KG) | 1 PCS |
| 크랭크케이스 브리더 (Crankcase Breather) — P/N 255180-20 | 크랭크케이스 블로바이 가스 환기/유분 분리 | 케이스 내압 조절·오일미스트 분리 | Crankcase Breather(CI p29 Item39, 190.14) = (PL p32, Net0.11KG) | 1 PCS |

### E. 연료계통 (Fuel system) — 핵심 카테고리

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 인젝터/연료분사기 (Injector) — P/N 3047973-20 | 연료를 연소실에 고압 분사 | 디젤 분사의 핵심. 6기통분 6개, 고가 정밀부품 | Injector(CI p30 Item63, 1,291.33) = (PL p33, Net3.86KG) | 6 PCS |
| 전자식 연료제어 액추에이터 (Electronic Fuel Control Actuator) — P/N 4914697-10 | 연료량 전자 제어(거버닝) 액추에이터 | 단일 품목 최고가(12,359.52CNY). 전자 조속 제어 핵심 | E-fuel control actuator(CI p30 Item89, 12,359.52) = (PL p33 Item89, Net0.97KG, Total1.06) | 1 PCS |
| 연료 차단 밸브 (Valve, Fuel Shutoff) — P/N 3043000-20 | 연료 공급 차단(정지·비상 차단) | 엔진 정지/긴급차단용 솔레노이드 차단밸브 | Valve,Fuel Shutoff(CI p25, 1,418.55CNY) = Valve,Fuel Shutoff(PL p35, Net0.60KG) | 1 PCS |
| 연료 공급 튜브 (Fuel Supply Tube) — P/N 3033007-20 | 연료를 인젝터/펌프로 공급하는 강관 | 고압 연료 배관. CI·PL 동일 3033007-20, 동일 Item67 | Fuel Supply Tube 3033007-20(CI p27, 48.20CNY) = 3033007-20(PL p31, Net0.10KG) | 1 PCS |
| 연료 바이패스 튜브 (Fuel Bypass Tube) — P/N 3038028-20 | 잉여 연료 환수(리턴) 배관 | 바이패스/리턴 라인. CI·PL 동일 3038028-20, 동일 Item68 | Fuel Bypass Tube 3038028-20(CI p27, 32.87CNY) = 3038028-20(PL p31, Net0.12KG) | 1 PCS |
| 연료 공급 튜브 (Fuel Supply Tube) — P/N 3033005-20 | 연료 공급 강관(다른 위치) | 고압 연료 배관, Item69 | Fuel Supply Tube 3033005-20(CI p27, 45.69CNY) = (PL p31, Net0.11KG) | 1 PCS |
| 퓨얼 튜빙/연료 튜브 (Fuel Tubing) — P/N AK4015MS-20 | 연료 배관(어셈블리) | 연료 이송 튜브. p20 세관신고 'FUEL TUBE'와 정합 | Fuel Tubing(CI p25, 388.57CNY) = Fuel Tubing(PL p35, Net0.13KG) | 1 PCS |
| 연료 필터 (Fuel Filter) — P/N FF105D | 연료 중 이물·수분 여과 | 인젝터 보호 소모성 필터, 정기 교체 | Fuel filter(CI p30 Item62, 39.09) = (PL p33, Net0.92KG) | 2 PCS |
| 체크밸브/일방향밸브 (单向阀 / Check Valve) — P/N 3028325-20 | 연료/유체 역류 방지 | 일방향 흐름 보장 체크밸브 | 单向阀(CI p30 Item66, 207.37) = (PL p33, Net0.21KG) | 1 PCS |
| 체크밸브/일방향밸브 (单向阀 / Check Valve) — P/N 178079-20 | 연료/유체 역류 방지(다른 위치) | 일방향 밸브 | 单向阀(CI p30 Item70, 233.87) = (PL p33, Net0.23KG) | 1 PCS |
| 압축 스프링 (Spring, Compression) — P/N 3030803 | 바이패스/릴리프 밸브 복귀 스프링 | 밸브 가압용 압축 스프링 | Spring,Compression(CI p25, 249.15CNY); PL p35 普通软管(64775-20)와 묶음 인접 | 1 PCS |
| 바이패스 밸브 피스톤 (Piston, Bypass Valve) — P/N 3030804 | 연료/오일 바이패스 밸브의 피스톤 | 압력 도달 시 바이패스 개폐 | Piston,Bypass Valve(CI p25, 380.14CNY) = Piston,Bypass Valve-KC 3030804(PL p35, Net0.01KG) | 1 PCS |
| 압력 센싱 피스톤 (Piston, Pressure / Pressure Sensing) — P/N 3030805 | 압력 감지/조절 밸브 피스톤 | CI 'PISTON,PRESSURE', PL 'PISTON,PRESSURE SENSING'. CI·PL 동일 3030805 | Piston,Pressure 3030805(CI p29 Item43, 150.59) = Piston,Pressure Sensing 3030805(PL p32 Item45, Net0.01KG) | 1 PCS |

### F. 냉각계통 (Cooling system)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 워터 펌프 샤프트 (Water Pump Shaft) — P/N 3050394-20 | 냉각수 펌프 구동축 | 냉각수 순환 임펠러 구동축 | Water Pump Shaft(CI p25, 177.00CNY) = (PL p35, Net0.35KG) | 1 PCS |
| 워터 펌프 씰 (Seal, Water Pump) — P/N 4026357 (N14) | 냉각수 펌프 축 밀봉(메커니컬 씰) | **'N14' 명시** → 엔진 기종 추정 근거. 냉각수 누수 방지 | Seal,Water Pump N14(CI p25, 172.71CNY) = Seal,Water Pump N14(PL p35, Net0.06KG) | 1 PCS |
| 워터 펌프 개스킷 (Water Pump Gasket) — P/N 3076522-20 | 워터펌프 접합부 밀봉 | 냉각수 누수 방지 개스킷. CI·PL 동일 3076522-20, 동일 위치 Item85 | Water Pump Gasket 3076522-20(CI p30, 28.45) = 3076522-20(PL p33 Item85, Net0.01KG) | 1 PCS |
| 써모스탯 씰 (Thermostat Seal) — P/N 186780-20 | 수온조절기(서모스탯) 밀봉 씰 | 냉각수 온도조절 밸브 누수 방지 | Thermostat Seal(CI p30 Item52, 299.27) = (PL p33, Net0.02KG) | 1 PCS |
| 라디에이터 개스킷 (Gasket, Radiator) — P/N 3019158-20 | 라디에이터/방열기 접합 밀봉 | 냉각수 라인 밀봉 개스킷 | Gasket,Radiator(CI p29 Item35, 5.54) = (PL p32, Net0.01KG) | 1 PCS |
| 물 이송 연결부 개스킷 (Gasket, Wtr Trf Connection) — P/N 3029032-20 | 냉각수 이송관 연결부 밀봉 | 워터 트랜스퍼 라인 개스킷 | Gasket,Wtr Trf Connection(CI p30 Item74, 4.56) = (PL p33, Net0.00KG) | 1 PCS |
| 송수관 조인트 가스켓 (输水管接头衬垫) — P/N 3008832-20 | 송수관 접합부 밀봉 | 중국어 원문(송수관 접두 패킹). PL은 한자 일부 불명 | 输水管接头衬垫(CI p30 Item73, 5.81) = (PL p33, Net0.00KG) | 2 PCS |

### G. 윤활·터보·필터·호스 (Lube / Turbo / Filter / Hose)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 윤활유 펌프 (Pump, Lubricating Oil) — P/N 4345692-20 | 엔진 윤활유 가압 순환 펌프 | 고가 핵심부품(5,838.27CNY). 베어링·습동부 급유 | Pump,Lubricating Oil(CI p30 Item90, 5,838.27) = (PL p33, Net13.70KG) | 1 PCS |
| 피스톤 쿨링 노즐 (Piston Cooling Nozzle) — P/N 3013591-20 | 피스톤 하부에 오일 분사로 냉각 | 피스톤 열부하 냉각 제트 노즐 | Piston Cooling Nozzle(CI p25, 32.31CNY) = (PL p35, Net0.08KG) | 6 PCS |
| 오일 필터 (Oil Filter) — P/N LF9009 | 윤활유 이물 여과 | 풀플로우 오일 필터, 정기 교체 소모품 | Oil filter(CI p29 Item45/46, 169.96) = (PL p32, Net1.70KG) | 1 PCS |
| 스핀온 필터 (Spin-on Filter) — P/N WF2076 | 냉각수 첨가제(SCA) 스핀온 필터 | 수처리/방청 첨가 필터 | Spin-on Filter(CI p30 Item58, 118.97) = (PL p33, Net0.76KG) | 1 PCS |
| 터보차저 오일(드레인) (Turbocharger Oil / Oil Drain) — P/N 3076164-20 | 터보차저 오일 드레인 라인 | CI 'TURBOCHARGER OIL', PL 'OIL DRAIN' — 동일 P/N. 터보 윤활 환유 | Turbocharger Oil(CI p25, 503.97CNY) = Turbocharger Oil Drain(PL p35, Net1.03KG) | 1 PCS |
| 일반 호스/플레인 호스 (Plain Hose) — P/N 3060613-20 | 유체 이송 일반 호스 | 저압 유체 연결 호스 | Plain Hose(CI p25, 194.74CNY) = (PL p35, Net0.14KG) | 1 PCS |
| 일반 호스 (普通软管 / Plain Hose) — P/N 64775-20 | 유체 이송 호스 | CI·PL 동일 普通软管(Plain Hose) — 동일 P/N | 普通软管(CI p25, 9.72CNY) = 普通软管(PL p35 Item40, Net0.02KG) | 1 PCS |
| 플렉시블 호스 (Flexible Hose) — P/N 209957-20 | 진동부 연결용 가요성 호스 | 유연 배관, 진동 흡수 | Flexible Hose(CI p25, 205.67CNY) = (PL p35, Net0.20KG) | 1 PCS |
| 벨트 (Belt) — P/N 178691-20 | 보기류(팬·알터네이터 등) 구동 벨트 | 동력 전달 벨트, 마모 소모품 | Belt(CI p29 Item48, 145.34) = (PL p32, Net0.23KG) | 1 PCS |
| V리브드 벨트 (Belt, V-Ribbed) — P/N 5413187-20 | 다중 리브 구동 벨트 | CI·PL 동일 5413187-20, 동일 Item49 | Belt,V Ribbed 5413187-20(CI p29, 101.77) = 5413187-20(PL p32, Net0.12KG) | 1 PCS |

### H. 씰·O링·개스킷·체결류 (Seals / O-rings / Gaskets / Fasteners)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| O링 씰 (Seal, O-Ring) — P/N 3007759-20 | 정적/동적 밀봉 O링 | 유체 누설 방지 표준 씰 | Seal,O Ring(CI p29 Item19, 11.63) = (PL p32 Item19, Net0.41KG) | 6 PCS |
| O링 씰 (O Ring Seal) — P/N 212161-20 | 밀봉 O링 | 소형 O링 | O RING SEAL(CI p30 Item72, 3.76) = (PL p33, Net0.00KG) | 1 PCS |
| O링 씰 (O Ring Seal) — P/N 3034412-20 | 밀봉 O링 | CI·PL 동일 3034412-20, 동일 Item86 | O RING SEAL 3034412-20(CI p30, 42.75) = 3034412-20(PL p33 Item86, Net0.10KG) | 1 PCS |
| O링 씰 (O Ring Seal) — P/N 3037537-20 | 밀봉 O링 | 표준 O링, Item87 | O RING SEAL 3037537-20(CI p30, 43.31) = (PL p33 Item87, Net0.01KG) | 1 PCS |
| O링 씰 (Seal, O-Ring) — P/N 4346(3)A-20 (PL 43463A-20) | 밀봉 O링 | 판독 일부 불확실, Item84 | Seal,O-Ring 4346(3)A-20(CI p30, 6.27) = 43463A-20(PL p33, Net0.00KG) | 1 PCS |
| 로커 레버 커버 개스킷 (Gasket, Rocker Lever Cover) — P/N 3067459-20 | 로커커버(밸브커버) 밀봉 | 헤드 상부 오일 누유 방지 개스킷 | Gasket,Rocker Lever Cover(CI p29 Item34, 단가148.04/금액444.11) = (PL p32, Net1.82KG) | 3 PCS |
| 흡기 매니폴드 개스킷 (Gasket, Intake Manifold) — P/N 3019227-20 | 흡기 매니폴드-헤드 접합 밀봉 | 흡기 누설 방지 개스킷 | Gasket,Intake Manifold(CI p29 Item36, 49.92) = (PL p32, Net0.06KG) | 2 PCS |
| 기어 커버 개스킷 (Gear Cover Gasket) — P/N 4058949-20 | 타이밍 기어 커버 밀봉 | 기어실 오일 밀봉 | Gear cover gasket 4058949-20(CI p30 Item77, 204.87) = Gear cover gasket 4058949-20(PL p33 Item77, Net0.03KG) | 1 PCS |
| 핸드홀 개스킷 (Gasket, Hand Hole) — P/N 3068466-20 | 점검구(핸드홀) 밀봉 | 워터재킷/케이스 점검구 밀봉 | Gasket,Hand Hole 3068466-20(CI p30 Item78, 117.84) = Gasket,Hand Hole 3068466-20(PL p33 Item78, Net0.04KG) | 1 PCS |
| 커버 플레이트 개스킷 (Gasket, Cover Plate) — P/N 3069098 | 커버 플레이트 밀봉 | 커버 접합 개스킷 | Gasket,Cover Plate 3069098(CI p30 Item80, 122.66) = GASKET,COVER PLATE 3069098(PL p33 Item80, Net0.01KG) | 1 PCS |
| 연결 가스켓 (联接衬垫 / Connection Gasket) — P/N 3202117-20 | 부품 연결부 밀봉 | 중국어 联接衬垫. CI·PL 동일 3202117-20, 동일 Item79 | 联接衬垫 3202117-20(CI p30 Item79, 54.73) = 联接衬垫 3202117-20(PL p33 Item79, Net0.00KG) | 1 PCS |
| 서포트 가스켓 (Support Gasket / 材垫) — P/N 3009457-20 | 지지부 밀봉 개스킷 | 중국어 材垫. CI·PL 동일 3009457-20, 동일 Item76 | Support gasket 3009457-20(CI p30 Item76, 6.24) = Support gasket 3009457-20(PL p33 Item76, Net0.01KG) | 1 PCS |
| 가스켓/패킹 (衬垫 / Gasket) — P/N 3055769-20 | 일반 밀봉 패킹 | 중국어 衬垫. CI·PL 동일 3055769-20, 동일 Item75 | 衬垫 3055769-20(CI p30 Item75, 8.70) = 衬垫 3055769-20(PL p33 Item75, Net0.01KG) | 2 PCS |
| 헥사곤 플랜지 너트 (Hexagon Flange Nut) — P/N 3056158-20 | 플랜지 일체형 육각 너트(체결) | 와셔 일체 너트, 진동 풀림 방지 | Hexagon Flange Nut(CI p25, 6.29CNY) = (PL p35, Net0.04KG) | 4 PCS |
| 필리스터 헤드 캡 스크류 (Fillister Head Cap Screw) — P/N 70772-20 | 원통머리 캡 스크류(체결) | 정밀 체결 볼트 | Fillister Head Cap(CI p25, 3.03CNY) = Fillister Head Cap Screw(PL p35, Net0.07KG) | 12 PCS |
| 와이어링 하니스 (Harness, Wiring) — P/N 213273-20 | 엔진 센서/전장 배선 하네스 | 전기 신호·전원 배선 묶음 | Harness,Wiring(CI p24, 834.74CNY) = (PL p34, Net0.22KG) | 1 PCS |

### I. 세관 적재허가 박스단위 신고 (개별 부품 통합 불가 — 카톤/중량 단위 보존)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 선박용품 연료 튜브 (SHIP SPARES / FUEL TUBE) | 선박 SAPFIR 적재 — 연료계 예비품 | 한국 부산세관 외국물품 적재허가(별지3호). H.S.8409, MAIN DECK 보관, US$18 | 적재허가(p20, 화물관리 26KJ001323110010003) | 1 CT |
| 엔진수리용 예비품 (SHIP SPARES / ENGINE REPAIR SPARES) | 선박 SAPFIR 적재 — 엔진 예비품(박스) | 세관신고. 중량 169KG, US$8,927, H.S.8409, MAIN DECK (상기 부품군의 한국 세관 신고면) | 적재허가(p21, 화물관리 26KJ001323110010001) | 2 CT |
| 엔진수리용 예비품 (SHIP SPARES / ENGINE REPAIR SPARES) | 선박 SAPFIR 적재 — 엔진 예비품(박스) | 세관신고. 중량 107KG, US$5,605, H.S.8409, MAIN DECK | 적재허가(p22, 화물관리 26KJ001323110010002) | 1 CT |

### J. 솔레노이드 밸브 별건 특송 (DHL, St-Marine Equipment 발 — p49·50)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 솔레노이드 밸브 (Solenoid Valve) | 연료·유공압 라인 전자 개폐 밸브 | 전자석 코일로 유체 흐름 ON/OFF 제어. DHL 라벨 'SHIP SPARES IN TRANSIT'. COO 중국, @25 USD | DHL 라벨 solenoid valve(p49, 2.0kg) = 견적송장 solenoid valve(p50, Item1, Net0.5kg×3) | 3 PCS |
| 밸브 코일 (Valve Coil) | 솔레노이드 밸브 구동 전자 코일 | 솔레노이드 밸브의 교체용 전자 코일(예비). COO 중국, @15 USD | 견적송장 Valve Coil(p50, Item2) | 3 PCS |

---

### ※ 서비스·수수료 항목 (운송·취급) — 별도 분리

| 항목명 (원문) | 구분 | 내용·근거 | 출처 페이지 |
|---|---|---|---|
| 항공운임 (Freight: AS AGREED) | 항공운송(HAWB) | 광저우(CAN)→부산(PUS), 항공편 KJ934, 02-APR-26. HAWB YAF26030862C, spare parts 1PCS/1kg, 운임 협의(AS AGREED), 보험 NIL | p23 |
| 항공운임 (Freight: AS AGREED) | 항공운송(HAWB) | CAN→PUS, KJ934, 02-APR-26. HAWB YAF26030862B, spare parts 1PCS/107kg(0.35CBM), 운임 협의 | p26 |
| 항공운임 (Freight: AS AGREED) | 항공운송(HAWB) | CAN→PUS, KJ934, 02-APR-26. HAWB YAF26030862A, spare parts 2PCS/169kg, 운임 협의 | p36 |
| 특송운임 (DHL Express Worldwide WPX) | 특송운송 라벨 | 상하이(SHA)→거제(GEOJE), WAYBILL 17 2793 8225, C-PLT, 2.0kg. (별도 운임액 미기재) | p49 |
| 견적송장 화물가액 (Total Invoice 120.00 USD, Terms DAP) | 견적송장 | 솔레노이드밸브+코일 물품가 합계 120 USD(운임 별도, DAP GEOJE-SI). 운송수수료 라인 없음 | p50 |

> 비고: 본 담당 페이지(20~37, 49, 50)에는 'Delivery to vessel / TRIP / HANDLING CHARGE / SSCEC fee' 등 명시적 취급수수료 라인아이템이 **없음**(해당 항목은 타 카테고리 Delivery Note에 존재). 위 소표는 운송성(항공·특송) 항목만 정리함.



---

## D. 전자·계측·사무·전기전장

## 전자·계측·사무·전기전장 — 표준 품목 통합표 (담당 페이지: 10, 11, 13, 43, 45, 46, 48)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 디지털 오실로스코프 (RIGOL Digital Oscilloscope DHO914S / 리골 DHO914S) | 선내 전기·전자 정비 작업장(엔진제어실·전기공작실 등)에서 전자회로·계측장비의 전압 파형을 시간축으로 표시·진단하는 데 사용. 제어기판·센서·통신선로 신호 점검 및 고장 진단 목적. | 전기 신호의 시간에 따른 변화를 화면에 파형으로 그려 보여주는 계측기. 모델 DHO914S(쿠팡 링크 제공 품목). 문서상 'Quality Assurance' 표기로 품질보증 대상 장비. ORDER 9 그룹(고객 제공 쿠팡 링크) 품목이며 실제 인도처는 NIKOLAY TRUBYATCHINSKY. | RIGOL Digital Oscilloscope DHO914S, NO.1-25 (p10) | 1 EA |
| 복합 레이저 프린터 (KYOCERA ECOSYS M2540dn / 교세라 에코시스 M2540dn) | 선내 사무실·선교(브리지)·기관제어실 등에서 항해서류·정비기록·공문 등 문서를 인쇄·복사·스캔하는 사무용 복합기. | 교세라 ECOSYS 라인의 흑백 레이저 복합기(인쇄/복사/스캔). 원기재 비고: 단종되어 구매 불가(Discontinued, unable to purchase), 대체·후속 제품 Ecosys MA4000FX로 안내됨. 단종·대체 정보 보존. | ECOSYS M2540dn, PRINTER (TRUBY) 그룹 NO.1-1 (p11) | 1 EA |
| 복합 컬러 레이저 프린터 (KYOCERA ECOSYS M5526cdn / 교세라 에코시스 M5526cdn) | 선내 사무·행정 구역에서 컬러 문서·도표·라벨 등 인쇄·복사·스캔. | 교세라 ECOSYS 컬러 레이저 복합기. 원기재 비고: 단종되어 구매 불가(Discontinued), 대체·후속 제품 Ecosys MA2600cfx로 안내됨. 단종·대체 정보 보존. | ECOSYS M5526cdn, PRINTER (TRUBY) 그룹 NO.1-2 (p11) | 1 EA |
| 토너 카트리지 (KYOCERA TK-5244KK, black / 교세라 토너 TK-5244KK 검정) | 선내 사무용 컬러 레이저 프린터의 검정 토너 소모품 교체용. | 교세라 정품 토너 모델 TK-5244KK(검정). 원기재 비고: 취소됨(Cancelled), 대체품 TK-1285(검정)로 안내. 취소·대체 정보 보존. | TK-5244KK, NO.1-3 (p11) | 10 EA |
| 토너 카트리지 세트 (KYOCERA TK-1188K / 교세라 토너 TK-1188K) | 선내 사무용 프린터 토너 소모품 교체용(세트). | 교세라 토너 모델 TK-1188K(SET 단위). 원기재 비고: 취소됨(Cancelled), 연계 제품 TK-5455 4색 세트(4 colors set)로 안내. 정품 아님·재생 토너(Not genuine, remanufactured), 고객 요청에 의한 대리 구매이며 사용으로 인한 손실·손상에 공급사 면책. 취소·대체·재생품 정보 보존. | TK-1188K, NO.1-4 (p11) | 5 SET |
| 무정전 전원장치 UPS (APC Easy UPS SRV2KI-E / APC SRV2KI-E) | 선내 정전·전압변동 시 사무기기·통신·항해전자장비 등 핵심 전원에 무정전 전력을 공급하고 서지·순간정전으로부터 장비를 보호. | APC Easy UPS 라인 모델 SRV2KI-E. 원기재 규격 2000VA/1800W, 확정 비고는 'SRV2KI-E APC UPS 2000VA 1600W'(용량 표기 1800W↔1600W 병존, 원문대로 보존). | APC Easy UPS SRV2KI-E (2000VA/1800W → 1600W), APC UPS 그룹 항목 1-1 (p13) | 1 EA |
| 스포트라이트 (Spotlight / 스포트라이트) | 선내 작업·점검 구역, 갑판·기관실 등 국소 조명이 필요한 지점을 집중 조명. | 한 방향으로 빛을 집중시키는 조명기구(쿠팡 대리구매 품목, 참고 URL 제공). 사양 미상(unknown). | Spotlight, 품목번호 1-1 (p43) | 7 EA |
| 블레이드 세트 (Blades set / 블레이드 세트) | 선내 정비·절단 작업용 교체 날(blade) 세트. | 절단·커터용 교체 블레이드 세트(쿠팡 대리구매 품목, 참고 URL 제공). 사양 미상(unknown). | Blades set, 품목번호 1-2 (p43) | 3 EA |
| 접점 세정제 (CONTACT CLEANER / 접점 세정제) | 선내 전기·전자 접점, 스위치, 커넥터, 릴레이 접점 등의 산화막·오염 제거 및 도전성 회복(전기전장 정비). | 그리스 없는 건식 접점 세정제(Dry contact cleaner without grease). 국내 대체품 BEX BW-100 Electro contact cleaner 220g로 안내됨. 대체품 정보 보존. | CONTACT CLEANER, NO.1/1-1 (p45) | 15 PCS |
| 유선 전화기 (Landline Telephone / 유선 전화기) | 선내 내선·구내 통화용 유선 전화 단말(선교·기관실·사무실·선실 간 통화). | 유선 전화 단말기(쿠팡 대리구매 링크 제공). COUPANG (3) 그룹(고객 제공 대행구매 링크) 품목. 사양 미상. | Landline Telephone, NO.1/1-1 (p46) | 5 PCS |
| 조명 기구 (Lighting Fixture / 조명 기구) | 선내 통로·선실·작업구역 일반 조명 설치·교체용 조명기구. | 일반 조명기구(쿠팡 대리구매 링크 제공). COUPANG (3) 그룹 품목. 사양 미상. | Lighting Fixture, 항목 1-2 (p46) | 20 PCS |
| 정션 박스 (Junction Box / 정션 박스) | 선내 전기 배선의 분기·접속을 한곳에 모아 보호·결선하는 단자함(전기전장 배선 작업). | 전선 접속·분기를 수용·보호하는 박스(쿠팡 대리구매 링크 제공). 사양 미상. | Junction Box, 항목 1-4 (p46) | 1 PCS |
| 접착식 케이블 몰드/덕트 (Adhesive Cable Conduit / 접착식 케이블 몰드) | 선내 노출 배선을 벽·구조물 표면에 부착하여 정리·보호·은폐하는 배선 정리용 몰드(케이블 보호). | 접착면이 있어 표면에 붙여 케이블을 수납·보호하는 몰드/덕트(쿠팡 대리구매 링크 제공). 원기재 수량 '10' 빨간색 강조. 사양 미상. | Adhesive Cable Conduit, 항목 1-6 (p46) | 10 PCS |
| 커넥터 (Connector / T-Shaped Connector·Connectors / 커넥터·T자형 커넥터) | 선내 전기·배관 배선의 분기·연결 접속부 결선용 커넥터(전기전장·배선 작업). | 전선·배관 연결용 커넥터. p46은 'T자형 커넥터(T-Shaped Connector)' 10 PCS, p48은 'Connectors' 10 EA로 형상 표기 차이 존재(원기재 명칭 변형 보존, 동일 커넥터류로 통합). 모두 쿠팡 대리구매 링크 제공. | T-Shaped Connector 10 PCS, 항목 1-3 (p46) + Connectors 10 EA, 행 1-2 (p48) | 20 (10 PCS + 10 EA) |
| 볼트·너트 세트 (Bolt and Nut Set / 볼트·너트 세트) | 선내 기계·구조물·전장 설비 체결용 일반 볼트·너트 소모자재. | 체결용 볼트와 너트 세트(쿠팡 대리구매 품목, COUPANG (2) 그룹). 사양 미상(qty. 2 pcs 표기). | Bolt and Nut Set, 행번호 1-1 (p48) | 2 EA |
| 접착식 열수축 튜브 (Heat Shrink with Adhesive / 접착식 열수축튜브) | 선내 전선 접속부·단자 절연 및 방수·기계적 보호(전기전장 결선 마감). | 열을 가하면 수축하며 내부 접착제가 녹아 밀봉·절연하는 튜브(쿠팡 대리구매 링크 제공). 사양 미상(qty. 3 pcs). | Heat Shrink with Adhesive, 행번호 1-3 (p48) | 3 EA |
| 직류전압계 (DC Voltmeter / 직류전압계) | 선내 직류 전원계통(배터리·DC 패널 등)의 전압 측정·점검(전기 계측). | 직류 전압을 표시·측정하는 계기(쿠팡 대리구매 링크 제공). 사양 미상(qty. 1 pcs). | DC Voltmeter, 행번호 1-4 (p48) | 1 EA |
| 알람/경보기 (Alarm / 알람·경보기) | 선내 이상상황(전기·기계 등) 발생 시 음향·신호로 경보를 발생시키는 경보장치. | 경보·알람 장치(쿠팡 대리구매 링크 제공). 사양 미상(qty. 1 pcs). | Alarm, 행번호 1-5 (p48) | 1 EA |
| 릴레이 (Relay / 릴레이) | 선내 전기제어 회로에서 소신호로 대전류 회로를 개폐하는 전자 스위칭 부품(전기전장 제어). | 전자식 개폐 접점 부품(쿠팡 대리구매 링크 제공). 원기재 수량란 0 + 빨간색 '=> Unable to purchase(구매불가)' 비고. 구매 불가 품목으로 실제 인도 수량 0. | Relay, 행번호 1-6 (p48) | 0 EA (구매불가) |

※ 단종/대체 안내 요약(원문 보존): ECOSYS M2540dn→MA4000FX, ECOSYS M5526cdn→MA2600cfx, TK-5244KK→TK-1285, TK-1188K→TK-5455 4색(재생토너), CONTACT CLEANER→BEX BW-100, Heat Gun(열풍기, p46 항목1-5)→대체링크. (열풍기는 본 카테고리 전기전장 인접 공구로 p46에 동봉 기재되어 있으나 지침 표준품목 외 공구류로, 단종·대체 정보만 여기 보존.)

---

### ※ 서비스·수수료 항목 (운송·취급수수료 분리)

| 서비스·수수료 항목 (원문 병기) | 내용·목적 | 중복통합(출처p) | 수량합 |
|---|---|---|---|
| 선박까지 배송/운송 (Delivery to the vessel / TRANSPORTATION) | 공급사(COENS GLS) 창고에서 선박(NIKOLAY TRUBYATCHINSKY)까지 물품을 운반·인도하는 운송 서비스. | p10(NO.4 TRANSPORTATION), p11(NO.2), p13(항목2), p43(품목2), p45(NO.2), p46(NO.3), p48(항목3) | 7 TRIP |
| 취급 수수료 (HANDLING CHARGE) | 추적·택배 수령·분류·팰릿 작업(palletizing) 등 공급사 창고에서의 화물 취급·보관 서비스 비용(Tracking, courier receipt, sorting, palletizing, etc., at our storage). | p46(NO.2), p48(항목2) | 2 LOT |



---

## E. 공구·위생·방역·선용품·기타

## 공구·위생·방역·선용품·기타 (담당 페이지: 12, 38, 39, 40, 41, 42, 44, 47)

> 약어: SSCEC = Ship Sanitation Control Exemption Certificate(선박위생관리면제증서). 깃발/검역 관련 개념 설명은 표 하단 ※ 참고 참조.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량합 |
|---|---|---|---|---|
| 라쳇 렌치 (Ratchet Wrench / 신축식 라쳇 렌치 Telescopic Ratchet, 3/4 라쳇 렌치 3/4 Ratchet) | 기관실·갑판부 정비 작업장에서 볼트·너트 체결 및 풀림 작업. 좁은 공간에서 한 방향 반복 회전으로 빠른 조임/풀림 | 라쳇(역회전 멈춤) 기구가 내장된 수공구. 손잡이를 떼지 않고 한쪽으로만 토크가 전달돼 협소한 선내 배관·기계 정비에 유리. '신축식(Telescopic)'은 손잡이 길이 가변형으로 토크 조절 가능, '3/4'은 3/4인치 드라이브(소켓 결합부) 규격. 고객 지정 셀러 대리구매 품목(반품·교환·하자 불보증) | 신축식 라쳇 렌치(Telescopic Ratchet) 2 PCS / 3/4 라쳇 렌치(3/4 Ratchet) 2 PCS — p12 (Coupang 대리구매) | 4 PCS |
| 렌치 세트 (Wrench Set) | 기관실·갑판 정비 시 다양한 규격의 볼트·너트에 대응하는 기본 공구 세트 | 여러 사이즈의 렌치(스패너)를 한 케이스에 묶은 세트 공구. 규격 미상(unknown). 고객 지정 셀러 대리구매 품목 | 렌치 세트(Wrench Set) — p12 | 3 SET |
| 마커/마킹펜 (Markers) | 선체·배관·자재에 표시·식별 마킹, 정비/도장/작업 위치 표기 | 산업용 표시 필기구(마킹펜) 세트. 규격 미상. 고객 지정 셀러 대리구매 품목 | 마커/마킹펜(Markers) — p12 | 3 SET |
| 줄자 (Tape Measure) — 대체품 DeWalt 7.5M x 25mm (DWHT36338) | 정비·자재 가공·설치 시 길이·치수 측정 | 7.5m 길이·25mm 폭 강철 테이프 줄자(DeWalt 디월트, 모델 DWHT36338). 원 주문품 구매 불가로 DeWalt 제품으로 대체 제시. 고객 지정 셀러 대리구매 품목 | 줄자(Tape Measure), 대체 DeWalt 7.5Mx25mm DWHT36338 — p12 | 5 PCS |
| 이발기 / 헤어클리퍼 (Hair Clipper) | 선원 개인 위생·이미용. 장기 항해 중 선내에서 머리·수염 손질 | 전동 모발 절단기. 선용품(개인 위생용품). 고객(선주) 지정품 대리구매(SUBJECT: HAIR CLIPPER, MGCB-000937). 재고 미확인으로 배송지연·취소 가능, 반품·교환·하자 불보증 | 이발기/헤어클리퍼(Hair Clipper / HAIR CLIPPER) — p39 | 1 EA |
| 진공청소기 / 산업용 진공청소기 (Industrial Vacuum Cleaner) | 선내 청소·정비. 기관실·작업구역의 분진·이물·오일 흡입 청소 등 작업 위생 유지 | 산업용 진공청소기(가정용 대비 흡입력·집진용량이 큰 작업용). 선용품/위생·정비용. 고객(선주) 지정품 대리구매(SUBJECT: VACUUM CLEANER, MGCB-001140). 재고 미확인으로 배송지연·취소 가능 | 진공청소기/산업용 진공청소기(Vacuum Cleaner / Industrial vacuum cleaner) — p40 | 1 EA |
| 쥐막이판 / 랫가드 (Rat Guard) | 정박 중 계류로프(mooring line)에 끼워 부두↔선박 간 쥐 등 설치류의 승선 이동을 차단. 검역·방역(SSCEC 갱신) 필수 물품 | 계류줄에 끼우는 원형/원뿔형 차단판. 쥐가 로프를 타고 선내로 침입하는 것을 물리적으로 막아 위생·방역 확보. p38은 갑판부 보관, 규격 50×60×50cm, HS 8409, 중량 28kg, 금액 110,500원(세관 적재허가 품목). p41은 SSCEC RENEWAL(위생증서 갱신) 하위 5개 세트 | 쥐막이판/래트가드(RAT GUARD) 3 PCS — p38(세관 적재허가, 갑판부) / 쥐막이판·랫가드(Rat guard) 5 PCS — p41(SSCEC RENEWAL) | 8 PCS |
| 에어로졸 살충제 (Aerosol Insecticide, 300㎖/400㎖) | 선내 해충(모기·바퀴·파리 등) 방제. 거주구·창고·주방 등 위생·검역(SSCEC 갱신) 목적 분사 방역 | 분무식(에어로졸) 살충제. SSCEC RENEWAL 하위 항목으로 선박위생관리 면제증서 갱신 검역에 필요한 방역 물품. 용량 표기 300㎖→400ml×12개로 정정 메모(원문 혼재) | 에어로졸 살충제(Aerosol, 300㎖ → 400ml x 12ea) — p41(SSCEC RENEWAL) | 12 EA |
| 크레졸 (Cresol) | 선내 소독·살균. 화장실·하수구·축사성 공간·오염구역 소독 등 위생·방역(SSCEC 갱신) | 페놀계 소독·살균제(크레졸 비누액 등). 강한 살균력으로 방역에 사용. SSCEC RENEWAL 하위 항목. 규격 2L(250ML×4개/리터) | 크레졸(Cresol) 2L, 250ML x 4ea/ltr — p41(SSCEC RENEWAL) | 2 LTR |
| 기 / 깃발 · 대한민국 국기 (Flag / 旗 / Flag of the Republic of South Korea) | 선박 신호·예의 게양. 입항국 국기(태극기) 게양, 국제관례상 외국 항만 정박 시 기국기와 입항국 국기를 함께 게양(courtesy flag) | 선박용 깃발(선용품). p42는 'FLAG 외 2종', 규격 50 X 30 X 50CM, HS 8409, 중량 48.00KG, 금액 102,850원, 세관 적재허가 품목(더마린코리아, 대표 김정문). p44는 대한민국 국기(태극기) 90×135cm, 양끝 고리(two loops)·박음질 모서리(stitched corners), 대체규격 Alternative 3'X4' (약 91.5x122cm) | 기 旗(FLAG) 3 PCS — p42(세관 적재허가) / 대한민국 국기(Flag of the Republic of South Korea) 5 PC — p44(SUBJECT: FLAG, MGCB-001139) | 3 PCS + 5 PC |
| 변기 / 위생도기 (TOTO CES85510 complete / wall type) | 선내 화장실(거주구) 위생설비. 일체형 양변기 교체·설치 | 일본 TOTO 사 일체형(원피스) 벽걸이형(wall type) 양변기, 모델 CES85510(비데일체형 워시렛 계열). 선용품/위생설비. 고객 카잔인 겐나디(Mr. Kazanin Gennady) 요청품. TOTO 대리점 재입고 예정(4/6~15), 입고일 기준 영업일 7~9일 리드타임 | 토토 변기/위생도기(TOTO) CES85510 complete / wall type — p47(SUBJECT: TOTO) | 1 PCS |

### ※ 서비스·수수료 항목 (운송·취급·검사비 — 물품 아님)

| 항목명 (원문 병기) | 성격·용도 | 출처 p | 수량합 |
|---|---|---|---|
| 운송 - 선박까지 배송 (Transportation - Delivery to the vessel) | 공급사 창고→선박까지 물품 배송 운송 서비스 | p12, p39, p40, p44, p47 (각 1 TRIP) | 5 TRIP |
| SSCEC 검사 수수료 (SSCEC inspection fee) | 선박위생관리면제증서(SSCEC) 갱신 검사비. 검역 위생검사 용역 | p41 | 1 TIME |
| 배송 및 취급 (DELIVERY AND HANDLING) | SSCEC 관련 물품의 배송·취급 통합 수수료 | p41 | 1 TIME |
| 운송비 - TOTO 대리점 부과 (Transportation cost charged by the TOTO distributor, TOTO → COENS GLS storage) | TOTO 대리점→공급사(COENS GLS) 창고 구간 운송비 | p47 | 1 EA |

### ※ 참고: SSCEC / 검역(위생) 개념

- **SSCEC (Ship Sanitation Control Exemption Certificate, 선박위생관리면제증서)**: 국제보건규칙(IHR 2005)에 따라 선박이 쥐·해충·감염원 등 공중보건 위해요인이 없음을 검역당국이 확인하고 발급하는 증서. 위해요인이 없으면 '면제증서(Exemption, SSCEC)', 방역조치(소독·구서 등)를 실시했으면 '관리증서(Control, SSCC)'를 발급하며 통상 유효기간 6개월. 항만 입·출항 시 검역 절차에 필요.
- **검역·방역(Quarantine/Sanitation)**: 선박을 매개로 한 감염병·매개생물(쥐·모기·바퀴 등) 유입을 차단하는 위생관리. 본 카테고리의 쥐막이판(랫가드)·에어로졸 살충제·크레졸은 SSCEC 갱신 시 요구되는 구서(쥐 차단)·소독·살충 방역 물품이며, p41은 'SSCEC RENEWAL' 묶음으로 함께 납품됨.



---

## 배치 01 통계

- 비식품 표준품목 **129건** (A=2 / C=97 / D=19 / E=11) — C 내역: 엔진 스페어 A~H 92 + 세관 박스단위 I 3 + 솔레노이드 별건 J 2 = 97. ※ '부식'(식료품·프로비전) 95품목은 박사 지시로 삭제(원 raw 361건에서 식자재 제외)
- 선박단: NIKOLAY TRUBYATCHINSKY(RV) · AKADEMIK KAZANIN · SAPFIR (러시아 북극탐사 선단)
- 공급사/대행: COENS GLS · 더마린코리아 (부산세관 물류감시과 적재허가)
- 진행: p1~50 완료 / 215p 중 50p. **다음 = Codex 교차검수 → batch-02(p51~)**
