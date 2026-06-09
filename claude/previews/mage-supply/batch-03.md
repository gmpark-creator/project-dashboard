# MAGE Supply — Batch 03 (p101~160) 분석 DB

> Module 2 선사업무 / MAGE Project / SUPPLY. 3차 배치(101~160페이지). 전 산출 한국어. 적대검증(2단) 반영 완료. Codex 교차검수 대상. **★batch-02 기수록 품목(SAPFIR 주방·침구류, 디스차지밸브/진공기기)과의 cross-batch 중복은 재계상하지 않고 별도 섹션·페이지회계로만 처리.**

## 배치 개요

- **출처**: 「페이지 포함 파일 - 26년 4월과 5월의 자료 전체 모음 - 3번 - 101부터 160페이지까지.pdf」 (2026년 4~5월 MAGE supply 조달기록 3차분)
- **추출 방식**: p101~160 = 60p 전량 스캔 이미지. 220DPI 렌더 후 비전 OCR 1차 추출 → **2단 적대검증**(핵심 라인·직인·코드 2~4.5배 확대 크롭 재판독). raw 변형·정정 모두 보존. **※ '부식'(식료품·프로비전) 파트는 박사 지시로 본 DB에서 제외 — 비식품 표준품목만 수록.**
- **선박단 (MAGE · Marine Arctic Geological Expedition, 북극 해양 지질 탐사)**:
  - **NIKOLAY TRUBYATCHINSKY** (NIS «НИКОЛАЙ ТРУБЯЧИНСКИЙ», RV, IMO 8705010, 母港 무르만스크) — **본 배치에서 직인 근거 확정**(p102~105 Sound Oceanics 탄성파 부품 수령 직인)
  - **AKADEMIK KAZANIN** (탐사선 / 발주·전달처) — p101·106 송장·운송장 헤더 SHIP TO
  - **SAPFIR / SAPHIR / 사피르** (RV «SAPFIR»/«САПФИР», 등록기호 **UBUS5**(검증: 1차 UB55/UB055 오기), IMO 9182057(p120 직인) — ALMAZ와 별개 선박) — 본 배치 적재허가 다수 수취선
  - **ALMAZ** (M/V ALMAZ / RV «ALMAZ», IMO 9150024, 등록기호 **UBWQ4**(검증 정정: p113·p114 ④등록기호칸 4x 확대 판독, 1차 'UB104'는 1→W·0→Q OCR 오독), 무르만스크) — 통신간행물·건자재 수취선
  - **FEDOR KOVROV** (M/V / RV «FEDOR KOVROV») — ALMAZ와 공동 SHIP TO(p136~140)
  - **North Ocean** (MOL Global Ship Management) — **비 MAGE 선박**(p121 식료품 거래명세서, 부식 전량 제외)
- **신규 공급사**: **Sound Oceanics LLC**(미국 Houston/Porter, TX — 탄성파 스트리머 부품)·**MKS Consulting**(p102 송장 양식)·**DTOC Express Inc**(뉴욕, Air Canada 대리점)·**BALTIC STREAM UAB**(리투아니아 Klaipeda — 엔진정비공구·피스톤)·**Sea Bridge Technical Supply(SBTS)**(홍콩 — Caterpillar 오링)·**Tianjin Botai Heat-Exchanger**(중국 — 열교환기 개스킷)·**Tianjin Seamaster / MANA SEIS TECH(홍콩) / SPARKLE HARMONY(호주)**(탄성파 에어건·하이드로폰·Trelleborg 벤드리스트릭터)·**Trelleborg**(벤드리스트릭터 DRG 8444 제조)·**TNT / FINNAIR cargo / ECU Worldwide / MNCL Line / DUHA YAPI(터키, 지급인) / Delamode Bulgaria / VG Handling** 등 운송·결제 당사자
- **서류 종류**: Proforma/Commercial Invoice · Packing List · DELIVERY NOTE(거래명세서) · 내국/외국 선박용품 적재허가(신청)서 · 외국 선박용품 하선허가(신청)서 · **Bill of Lading(선하증권, ECU Worldwide — 추가)** · **DETAILED MANIFEST(TNT 상세 적하목록 — 추가)** · Air Waybill(Air Canada·Turkish Airlines·FINNAIR) · WPX/DHL 특송 운송장 · PROVISION 거래명세서(부식, 제외)

## 카테고리 구성

| # | 카테고리 | 본 배치 주요 출처 |
|---|---|---|
| A | 화학·건자재 | p114·115(시멘트·모래·액상유리) |
| C | 기관 예비품(엔진 스페어) | p107·109(피스톤 어셈블리)·116~120(밸브로커/스프링/로커샤프트·VALVE ROCKER)·126·128(열교환기 가스켓·진공펌프 로터)·131·132·134(Caterpillar 오링)·136·140(노즐셋·서보모터·O링)·146·148(열교환기 개스킷)·155(베어링셸)·158·159(밸브스프링·푸시로드) |
| D | 전자·계측·사무·전기전장 | p108(막시미터·게이지·뎁스게이지·마이크로미터)·130(서보모터)·157(점퍼케이블) |
| E | 공구·위생·방역·선용품·기타 | p108(호닝공구·풀러·공구함·그라인더·드릴·렌치·체인블록·샌딩/연마머신(Chris Marine) 등 BALTIC STREAM 공구류) |
| — | 배관·유압 (신규) | p108(유압잭·유압프레스·유압호스)·122·124(벤드리스트릭터·밸브)·131·135·136(버터플라이밸브·기계식오일씰·압력파이프커플링)·146(논리턴밸브·솔레노이드밸브) |
| — | 항해·통신 (신규) | p113·116(ITU List V 간행물) |
| — | 안전·구명 (신규) | — |
| — | 탐사장비(지질·해저) (신규·**batch-03 최대 비중**) | p102~105(Sound Oceanics QuickCUFF·Digicourse 5011-E)·p150(벤드리스트릭터/PEH칼라/케이블그립)·p151~153(Trelleborg DRG 8444·칼라스토퍼·케이블그립·에어호스피팅·피그테일·옥토퍼스·점퍼케이블·압력/수심 트랜스듀서·하이드로폰·벌크헤드 커넥터) |
| — | 갑판·계류 (신규) | p151(케블라 케이블 그립 — 견인·인양) |

> ※ p110~112 = batch-02 p62~64 동일 SAPFIR 주방·침구 DELIVERY NOTE 재등장(중복) — 신규 품목 없음(기수록). p111·112 잔여 침구(1-36~1-38)도 batch-02 수록 범위와 동일품 → 재계상 제외. p121 = North Ocean(비 MAGE) 식료품 31건 부식 제외. p118·123·125·127·129·131·133·156 = crew 명단 / p103~105·138·139·141~145·154 = AWB·BOL·매니페스트 부본·약관(품목 無/중복). 상세는 「페이지 회계」 참조.

---

## A. 화학·건자재

> p114(적재허가 묶음 '시멘트외 2종')·p115(DELIVERY NOTE 상세)는 동일 화물 → 3품목 분해 후 양쪽 출처 보존. SAPHIR 인도 후 선주 요청으로 ALMAZ 전달.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **시멘트 (Cement, 40kg/bag, SAMPYO) — 비상예비용·품질증명서 동봉** (CEMENT WITH A CERTIFICATE) | ALMAZ 선체·갑판 비상보수용 건자재. 선박 긴급 예비자재(ship's emergency reserve)로 비축, 누수·균열 응급 보수에 사용(추정) | 시멘트(품질증명서 동봉). 규격 40kg/bag, 브랜드 SAMPYO(삼표시멘트, 한국). 거래명세서(p115) 행 1-1 = 3 BAG. 적재허가(p114)는 'CEMENT, SAND, LIQUID GLASS'를 '시멘트외 2종'으로 묶음 신고(1100×1000×1500MM, 3 PCS, 240kg, ZZZZ0001, HS 8409, 가액 90,860(검증 정정: 1차 90,880, p114 데이터칸·합계칸 5x 확대 판독 '860' 명확), 신청업체 (주)더 마린 코리아(대표 김정문)) | CEMENT WITH A CERTIFICATE / =>Cement 40kg/bag SAMPYO / 시멘트외 2종(p114·115) | 3 BAG (40kg/bag) |
| **모래 (Sand, 20kg/bag) — 비상예비용(품질증명 미동봉)** (SAND WITH A CERTIFICATE) | ALMAZ 선체·갑판 비상보수용 건자재. 시멘트와 함께 모르타르 배합용 비축. 갑판 미끄럼방지·응급 보수(추정) | 모래(ship's emergency reserve). 규격 20kg/bag, 품질증명서 미동봉('no quality cert available'). 거래명세서(p115) 행 1-2 = 5 BAG. 적재허가(p114) '시멘트외 2종' 묶음 포함(HS 8409) | SAND WITH A CERTIFICATE / =>Sand 20kg/bag, no quality cert(p114·115) | 5 BAG (20kg/bag) |
| **액상 유리 / 물유리 (Liquid glass, 4 LTR/BTL) — 속경화제, 비상예비용** (LIQUID GLASS WITH A CERTIFICATE) | ALMAZ 선체·갑판 비상보수용 화학건자재. 시멘트 속경화제(quick-setting agent)로 쓰는 물유리(규산소다 수용액). 응급 콘크리트/모르타르 급결·방수·균열 충전(추정) | 액상 유리(규산나트륨 수용액 sodium silicate, 러 водяное стекло). 속경화제, 4 LTR/BTL(병당 4리터). 품질증명서 동봉. 거래명세서(p115) 행 1-3 = 5 BTL. 적재허가(p114) '시멘트외 2종' 묶음 포함(HS 8409) | LIQUID GLASS WITH A CERTIFICATE / =>Quick-setting agent 4 LTR/BTL(p114·115) | 5 BTL (4 LTR/BTL) |

---

## C. 기관 예비품(엔진 스페어)

> 전역 dedup 핵심: **피스톤 어셈블리**는 (a) 패킹리스트 No.223(p107)과 (b) Proforma Invoice No.223(p109)이 동일 1건(2 pcs, USD 600, HS 8409990090) → **1행 통합**. **밸브 스프링/로커/로커샤프트**(p119 송장 ↔ p120 AWB)는 동일 화물 → 각 1행 통합(출처 p119·120). **SHIP SPARES BEARING SHELL**(p155)은 하선허가 건. p116~120과 p140의 부품번호는 모두 상이 → 개별 행.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **엔진 블록 — 피스톤 어셈블리(중고, 재생용)** (Engine block / Piston assembly used, for renovation, HS 8409990090) | BALTIC STREAM UAB(리투아니아 클라이페다) 경유 러시아 탐사선단 주기관(디젤엔진) 정비·재생용 예비 피스톤 조립체(피스톤+링+핀 등) 교체용 기관 예비품(추정) | 'Piston assembly used (for renovation)'. HS 8409990090. 2 pcs(2조), 단가 USD 300, 합계 USD 600(Proforma Inv. No.223, 2026-04-29). 패킹리스트 No.223 기준 net 180kg/gross 224kg. 결제 20일 이내(2026-05-19 기한), 은행 BNK 부산은행 SWIFT PUSBKR2PXXX. shipper COENS GLS(부산)→consignee BALTIC STREAM UAB(Tilzes str.18-44 LT-91130). 하단 러시아 원형직인 | Packing List #223(p107) = Proforma Invoice No.223(p109) | 2 pcs (USD 600, 단가 USD 300) |
| **밸브 스프링 (Spring, H160·외경82.8·내경58.8mm — P/N 1610-004)** | SAPFIR 주기관/발전기관 실린더헤드 밸브 트레인의 복원·가압용 압축 스프링. 밸브로커·로커샤프트와 동일 송장으로 묶여 공급(실린더헤드 정비) | St Marine Equipment Commercial Invoice 000000173(2026-04-17) 1번. 높이 160mm·외경 82.8mm·내경 58.8mm 코일 스프링, P/N 1610-004. 3 pcs, 단가 EUR 105.00, 합계 EUR 315.00. 목재상자 1개 64×45×29cm·52kg. ★선박 SAPFIR(검증: p120 직인 МС«САПФИР»·IMO 9182057·МАГЭ 근거로 '미상'→SAPFIR 확정) | Spring 1610-004(p119 송장) = AWB 105-58199920(p120) | 3 pcs (EUR 315) |
| **밸브 로커 / 로커 암 (Valve rocker, Ø65mm — P/N 1430-003)** | SAPFIR 실린더헤드 밸브 트레인 부품. 캠/푸시로드 운동을 밸브 스템에 전달해 흡·배기 밸브를 개폐하는 로커 암. 밸브기구 정비/교체용 ★p117 적재허가 'VALVE ROCKER'(검증: 1차 'VALVE BONNET' 오독)와 정합 | St Marine Commercial Invoice 000000173 2번. Ø65mm, P/N 1430-003. 6 pcs, 단가 EUR 375.00, 합계 EUR 2,250.00. p117 외국 선박용품 적재허가서 동일 화물(화물관리 26AYZ56437100001, 품목 ZZZZ8409, HS 8409, 1 CT 52kg, 3,664 US$, MAIN DECK, 신청 (주)코엔스, 선기명 SAPFIR/호출 UBU55, 목적항 Vladivostok) | Valve rocker 1430-003(p119 송장) = 적재허가 VALVE ROCKER(p117) = AWB(p120) | 6 pcs (EUR 2,250) |
| **밸브 로커 샤프트 / 로커 축 (Valve rocker shaft, Ø65mm — P/N 1430-002)** | SAPFIR 밸브 로커 암이 회전하는 지지축. 밸브 트레인 정비 시 로커 암과 세트로 교체되는 기관 예비품 | St Marine Commercial Invoice 000000173 3번. Ø65mm, P/N 1430-002. 3 pcs, 단가 EUR 187.50, 합계 EUR 562.50. 송장 Sub Total EUR 3,127.50, VAT 0%. AWB 105-58199920(FINNAIR cargo) 'Ship Spare Parts HS 8409 9900', 52kg, FREIGHT PREPAID, 목적공항 SEOUL INCHON INT(검증 정정: 1차 'VANTAA' 오기), Agent M9 Logistics B.V.(MS 아님), Consignee COENS GLS(거제) | Valve rocker shaft 1430-002(p119) = AWB(p120) | 3 pcs (EUR 562.50) |
| **서보 모터 PM 우드워드 모터 (포팅형 24VDC)** (Servo motor PM Woodward Motor-Potted PM 24VDC, Cat# 8N-7848, 5rpm — P/N 5484-803) | ALMAZ&FEDOR KOVROV 디젤엔진 연료분사·거버너(조속기) 액추에이터 구동용 영구자석(PM) 서보 모터. Woodward 거버너/엔진 제어계통 위치·속도 제어 구동부(추정) | p140 거래명세서(St Marine Inv 0000000150, 2026-03-02) 품목1. PM=영구자석, Potted(수지몰딩 봉입), 24VDC, 5rpm, Cat# 8N-7848, 부품그룹 MG040226.1. 2 pcs, 단가 EUR 1,070.43, 소계 EUR 2,140.86 | Servo motor PM Woodward 5484-803(p140 item1) | 2 pcs (EUR 2,140.86) |
| **오링 (O-RING — P/N 180 0236, 도면군 MG260126AKZ1)** | ALMAZ&FEDOR KOVROV 엔진/기계 어셈블리(MG260126AKZ1)의 유체·압력 연결부 밀봉용 환형 고무 실링(추정) | p140 거래명세서 품목2. P/N 180 0236. 6 pcs, 단가 EUR 16.08, 소계 EUR 96.48 | O-RING 180 0236(p140 item2) | 6 pcs (EUR 96.48) |
| **오링 (O-RING — P/N 180 0237, 도면군 MG260126AKZ1)** | ALMAZ&FEDOR KOVROV 엔진/기계 어셈블리 결합부 밀봉용 환형 고무 실링(규격 상이)(추정) | p140 거래명세서 품목3. P/N 180 0237. 6 pcs, 단가 EUR 8.92, 소계 EUR 53.52 | O-RING 180 0237(p140 item3) | 6 pcs (EUR 53.52) |
| **오링 (O-RING — P/N 180 0238, 도면군 MG260126AKZ1)** | ALMAZ&FEDOR KOVROV 엔진/기계 어셈블리 결합부 밀봉용 환형 고무 실링(규격 상이)(추정) | p140 거래명세서 품목4. P/N 180 0238. 6 pcs, 단가 EUR 12.14, 소계 EUR 72.84 | O-RING 180 0238(p140 item4) | 6 pcs (EUR 72.84) |
| **오링 (O-ring — P/N FOF-26, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 연료분사 노즐 어셈블리(MG311024NT2)의 노즐·인젝터 접합부 밀봉용 환형 고무 실링(추정) | p140 거래명세서 품목6. P/N FOF-26. 5 pcs, 단가 EUR 2.70, 소계 EUR 13.50 | O-ring FOF-26(p140 item6) | 5 pcs (EUR 13.50) |
| **조정 스크류 (Adjusting screw — P/N VTO-T218, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 연료분사 노즐 어셈블리의 분사 압력/리프트 조정 스크류. 인젝터 개방압 세팅 조정(추정) | p140 거래명세서 품목8. P/N VTO-T218. 5 pcs, 단가 EUR 44.00, 소계 EUR 220.00 | Adjusting screw VTO-T218(p140 item8) | 5 pcs (EUR 220) |
| **노즐 스프링 (Nozzle spring — P/N VTO-T184, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 연료분사 노즐 어셈블리의 니들 밸브 복귀 스프링. 인젝터 개방압 결정·니들 폐쇄 복원(추정) | p140 거래명세서 품목9. P/N VTO-T184. 5 pcs, 단가 EUR 34.50, 소계 EUR 172.50 | Nozzle spring VTO-T184(p140 item9) | 5 pcs (EUR 172.50) |
| **스프링 스핀들 (Spring spindle — P/N VTO-T186, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 노즐 어셈블리의 스프링 하중을 니들 밸브에 전달하는 압봉(스핀들)(추정) | p140 거래명세서 품목10. P/N VTO-T186. 5 pcs, 단가 EUR 22.50, 소계 EUR 112.50 | Spring spindle VTO-T186(p140 item10) | 5 pcs (EUR 112.50) |
| **노즐 너트 (Nozzle nut — P/N VTO-T230, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 노즐 어셈블리에서 노즐 팁/바디를 인젝터 홀더에 체결·고정하는 캡 너트(추정) | p140 거래명세서 품목11. P/N VTO-T230. 5 pcs, 단가 EUR 42.00, 소계 EUR 210.00 | Nozzle nut VTO-T230(p140 item11) | 5 pcs (EUR 210) |
| **중간 링 / 미들 링 (The middle ring — P/N VTO-T190, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 노즐 어셈블리의 중간 스페이서/시트 링. 노즐 바디와 홀더 사이 정렬·밀봉(추정) | p140 거래명세서 품목12. P/N VTO-T190. 5 pcs, 단가 EUR 8.90, 소계 EUR 44.50 | The middle ring VTO-T190(p140 item12) | 5 pcs (EUR 44.50) |
| **노즐 어셈블리 (Nozzle assembly — P/N LTO-BNZ/E, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 디젤엔진 연료분사 노즐 완성품 어셈블리. 연소실로 연료를 미립화 분사하는 인젝터 노즐 셋. 기관 핵심 예비품(추정) | p140 거래명세서 품목14(최고가). P/N LTO-BNZ/E. 5 pcs, 단가 EUR 319.00, 소계 EUR 1,595.00. 송장 Total EUR 5,013.70, VAT 0%, Bank UBB AO. 지급인 DUHA YAPI TAAHHUT(터키), 배송지 COENS GLS | Nozzle assembly LTO-BNZ/E(p140 item14) | 5 pcs (EUR 1,595) |
| **기계식 오일 씰 (Mechanical oil seal, HS 8484200090)** | ALMAZ&FEDOR KOVROV 엔진·펌프 회전축의 윤활유 누유 방지·밀봉용 기계 씰(추정). p135 특송 화물의 송장 품목 | St-Marine Equipment(상하이) Proforma(p136) 품목2. COO CN, HS IB:848420/OB:8484200090, 순중량 2.0kg/총중량 2.5kg. 단가 10.000 USD, 2 PCS, 소계 20.00 USD. WPX(p138/139·p135) 'SHIP SPARES IN TRANSIT' 운송 | Mechanical oil seal(p136 송장)=WPX content(p135·138·139) | 2 PCS (USD 20) |
| **진공펌프용 로터 (Rotor for vacuum pump, HS 8414909090)** | ALMAZ&FEDOR KOVROV 선박 진공펌프 내부 회전체(임펠러/로터). 펌프 흡입·배기 작동 핵심 회전부품, 마모 시 교체. 기관 예비품(추정) | St-Marine Proforma(p137) 품목4. COO CN, HS IB:841490/OB:8414909090, 순중량 6.0kg/총중량 8.0kg. 단가 80.000 USD, 2 PCS, 소계 160.00 USD. 송장 합계 4품목 10units, Net 19.4kg/Gross 23.0kg, 인보이스 282.00 USD, DAP GEOJE-SI | Rotor for vacuum pump(p137 item4) | 2 PCS (USD 160) |
| **오링 (O ring, HS 4016931000)** | ALMAZ&FEDOR KOVROV 유압·유체 연결부·기계 접합면 누설 방지용 환형 고무 실링. 기관·배관 예비품(추정) | St-Marine Proforma(p136) 품목3. COO CN, HS IB:401693/OB:4016931000, 순중량 0.4kg/총중량 0.5kg. 단가 0.500 USD, 4 PCS, 소계 2.00 USD. ※p140 거래명세서 O-RING(180 0236/0237/0238)과는 PN·송장 상이한 별개 품목 | O ring(p136 item3, 4016931000) | 4 PCS (USD 2) |
| **진공펌프용 로터 (ROTOR FOR VACUUM PUMP) — 선박예비품 적재허가** (SHIP SPARES / ROTOR FOR VACUUM PUMP, HS 8414) | SAPFIR 진공펌프(밸러스트/빌지/기관 진공계통) 회전자(로터) 예비품. 진공펌프 내부 회전·흡입 작동 핵심부품 교체용(추정). ※p137 Proforma 로터와 별개 적재건(중량·금액·문서 상이) | 외국 선박용품등 적재허가(신청)서(p128). 화물관리 26MUZ69599100280400(검증 정정: 1차 26MIZ65599… 2개소 오독), 품목번호 ZZZZ8414(검증: ZZZ→ZZZZ), HS 8414. 1 CT, 10.60 KG, 160 US$, MAIN DECK, 물품구분 A, 신청 (주)코엔스, 신청번호 …U0088 | SHIP SPARES/ROTOR FOR VACUUM PUMP(p128) | 1 CT (10.60kg, 160 US$) |
| **열교환기용 가스켓 (GASKET FOR HEAT EXCHANGER) — 선박예비품 적재허가** (SHIP SPARES / GASKET FOR HEAT EXCHANGER, HS 4016) | SAPFIR 기관실 열교환기(쿨러/오일·청수 냉각기) 플레이트·커버 사이 밀봉용 예비 가스켓. 누설 차단·정비 교체용. 합성고무(EPDM/NBR 계열) 추정 | 외국 선박용품등 적재허가(신청)서(p126). 화물관리 26LDZ67918100020607, 품목번호 ZZZZ4016(검증: ZZZ→ZZZZ), HS 4016. 1 CT, 3.70 KG, 219 US$, MAIN DECK, 물품구분 A, 신청 (주)코엔스, 신청번호 …U0091. 선박등록기호 UBUS5(검증 정정: 1차 UB055) | SHIP SPARES/GASKET FOR HEAT EXCHANGER(p126) | 1 CT (3.70kg, 219 US$) |
| **열교환기용 개스킷 Type A (Gasket for heat exchanger, 10 PCS, HS 401693)** | MAGE 선단 판형/관형 열교환기(엔진 청수·해수 냉각, 윤활유 쿨러) 플레이트·커버 기밀 실링용 개스킷. 전열판 밀봉·정비 예비품(추정) | Tianjin Botai Heat-Exchanger Commercial Invoice(p148, 2026-04-24, Ref Z1091). HS 401693(가황고무 가스켓류). COO CN, 순중량 0.8kg/총중량 1.0kg. 10 PCS, 단가 2.400 USD, 소계 24.00 USD. WPX(p149) AWB 28 6222 7163. ※Type B(46PCS)와 단가·중량 상이한 별도 사양 | GASKET(p148 item1)=WPX content(p149) | 10 PCS (USD 24) |
| **열교환기용 개스킷 Type B (Gasket for heat exchanger, 46 PCS, HS 401693)** | MAGE 선단 판형 열교환기 플레이트 실링용 개스킷(소형 규격). 엔진 냉각·윤활 계통 열교환기 밀봉(추정) | Tianjin Botai Commercial Invoice(p148) 2번. HS 401693. 순중량 2.2kg/총중량 2.6kg. 46 PCS, 단가 1.200 USD, 소계 55.20 USD. 송장 합계 상품 79.20 + 운임 140.00 = 청구 219.20 USD, 총 56units. ※Type A(10PCS)와 단가·중량 상이 | GASKET(p148 item2)=WPX content(p149) | 46 PCS (USD 55.20) |
| **베어링 셸 / 메탈 베어링 라이너 (SHIP SPARES BEARING SHELL, HS 8483) — 하선** | SAPFIR 기관 예비품으로 하선(반출). 베어링 셸(메탈/저널 베어링 반쪽 라이너)은 디젤 주기관·발전기 크랭크샤프트·저널을 지지하는 분할형 슬리브 베어링. 마모 교체용(추정) | 외국 선박용품등 **하선허가**(신청)서(p155). 화물관리 UN26030A093513U0009, 품목번호 ZZZZ8483, 관리구분 Q, HS 8483(축·베어링·기어류). 2 CT, 70.00 KG, 1,340 US$. 신청 (주)코엔스, 하선장소 (주)오리엔트스타한진로직스센터, 하선일 2026-05-11, 부산세관장 허가, 선장확인 11.05.2026. 선박 SAPFIR/UBUS5/입항선고 25JPQLA0591 | SHIP SPARES BEARING SHELL(p155, 하선) | 2 CT (70.00kg, 1,340 US$) |
| **밸브 스프링 (SHIP SPARES / VALVE SPRING, HS 7320) — 적재허가** | SAPFIR 디젤 주기관/발전기관 실린더헤드 흡·배기 밸브를 닫힘 위치로 복귀시키는 밸브 스프링. 정비/오버홀 시 교체용 기관 예비품(추정) | 외국 선박용품등 적재허가(신청)서(p158). 화물관리 26TKZ7574510009, 품목번호 ZZZZ7320, HS 7320(강철 스프링류). 1 CT, 4.00 KG, 785 US$, MAIN DECK, 적재구분 C, 신청 (주)코엔스, 선박 SAPFIR(UBUS5), 도착항 Vladivostok | SHIP SPARES/VALVE SPRING(p158) | 1 CT (4.00kg, 785 US$) |
| **푸시 로드 / 밀대 (SHIP SPARES / PUSH ROD, HS 8409) — 적재허가+AWB** | SAPFIR 디젤기관 밸브 트레인 부품. 캠/태핏의 운동을 로커암으로 전달해 흡·배기 밸브를 작동시키는 푸시 로드. OHV 디젤엔진 밸브기구 예비/교체부품(추정) | 적재허가(p159): 화물관리 26FXZ4530314050004, 품목번호 ZZZZ8409, HS 8409, 1 CT, 9.40 KG, 1,517 US$, MAIN DECK. AWB 235-39192204(p160, Turkish Airlines): 'SHIP SPARE PARTS / PUSH ROD'(원문 첫 글자 G로도 판독·OCR 모호), NOT RESTRICTED, HS 84099900, 27×22×17cm, 1pc, 과금중량 4kg, 운임 120.00 USD, shipper St.Marine(Sofia)→consignee COENS GLS. 적재 1,517 USD=물품가 / AWB 120 USD=항공운임 | SHIP SPARES/PUSH ROD(p159 적재허가) = AWB 235-39192204(p160) | 1 CT (9.40kg, 1,517 US$) |

---

## D. 전자·계측·사무·전기전장

> p108 BALTIC STREAM TOOLS 송장(no.30/12-2025)의 계측기군 + p130 서보모터(적재허가) + p157 점퍼케이블(적재허가). 통신간행물(ITU List V)은 「항해·통신」 표 참조.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **막시미터 / 최대 연소압 측정기 (Maximeter / Maksimetras)** | BALTIC STREAM 수취(선단 전달 추정). 디젤엔진 실린더 최대 연소압력(피크 압력) 측정 계측기. 각 실린더 폭발압 균형·연소 상태 진단(추정) | TOOLS 송장(p108) 2번. UNIT compl., Q-TY 1, 단가/합계 EUR 240. 리투아니아어 'Maksimetras' | 2 Maximeter/Maksimetras(p108) | 1 compl. (EUR 240) |
| **구멍 게이지 / 내경 측정기 (Hole-gauge / Vidmatis)** | BALTIC STREAM 수취. 구멍·보어(내경) 치수 측정 게이지. 베어링·실린더 내경 등 정밀 검사용(추정) | TOOLS 송장(p108) 3번. UNIT compl., Q-TY **2**(검증 정정: 1차 1→2, 2×110=220 정합), 단가 EUR 110, 합계 EUR 220. 리투아니아어 'Vidmatis' | 3 Hole-gauge/Vidmatis(p108) | 2 compl. (EUR 220) |
| **교정용 표준 평판 / 게이지 블록 (Calibration plates / Matuoklio plokštės)** | BALTIC STREAM 수취. 계측기·측정기 영점 교정 및 평면도 기준용 표준 평판(게이지 블록). 정비 공작실 측정 기준기(추정) | TOOLS 송장(p108) 4번. UNIT compl., Q-TY 1, 단가/합계 EUR 80. 리투아니아어 'Matuoklio plokštės' | 4 Calibration plates(p108) | 1 compl. (EUR 80) |
| **디플렉션 측정기 (크랭크축 변위) (Deflection measuring / Alkuninio veleno poslinkio matavimo pretaisas)** | BALTIC STREAM 수취. 디젤엔진 크랭크축(crankshaft) 디플렉션(휨·변위) 측정 장치. 크랭크웹 사이 간극 변화 측정으로 축정렬·베어링 마모 진단(추정) | TOOLS 송장(p108) 5번. UNIT compl., Q-TY 1, 단가/합계 EUR 220. 리투아니아어 'Alkuninio veleno poslinkio matavimo pretaisas' | 5 Deflection measuring(p108) | 1 compl. (EUR 220) |
| **전동 그라인더 (마키타) (Electric grinder Makita / Šlifavimo mašinele elektrine)** | BALTIC STREAM 수취. 전동 연삭·절단용 그라인더(Makita). 금속 연마·버 제거·절단 작업용 전동공구(추정) | TOOLS 송장(p108) 10번. 브랜드 Makita. UNIT pcs., Q-TY 1, 단가/합계 EUR 60. 리투아니아어 'Šlifavimo mašinele elektrine' | 10 Electric grinder Makita(p108) | 1 pcs (EUR 60) |
| **전동 드릴 (라이버) (Electric drill Raiber / Elektrinis gręžtuvas Raiber)** | BALTIC STREAM 수취. 전동 드릴(Raiber 브랜드). 정비·의장 작업 시 천공·체결용 전동공구(추정) | TOOLS 송장(p108) 12번. 브랜드 Raiber. UNIT pcs., Q-TY 1, 단가/합계 EUR 85. 리투아니아어 'Elektrinis gręžtuvas Raiber' | 12 Electric drill Raiber(p108) | 1 pcs (EUR 85) |
| **깊이 게이지 / 심도 측정기 (Depth gauge / Gylio matuoklis)** | BALTIC STREAM 수취. 구멍·홈·단차 깊이 측정용 뎁스 게이지. 가공 깊이·마모량 측정(추정) | TOOLS 송장(p108) 21번. UNIT pcs., Q-TY 1, 단가/합계 EUR 35. 원문 'Depth gaude'(gauge OCR 변형). 리투아니아어 'Gylio matuoklis' | 21 Depth gaude/Gylio matuoklis(p108) | 1 pcs (EUR 35) |
| **마이크로미터 클램프 / 마이크로미터 (Micrometric clamp / Mikrometras)** | BALTIC STREAM 수취. 정밀 외경·치수 측정용 마이크로미터. 핀·축·라이너 정밀 치수 검사용(추정) | TOOLS 송장(p108) 23번(최종). UNIT compl., Q-TY 7, 단가 55, 합계 EUR 385. 리투아니아어 'Mikrometras'. 송장 전체 Total EUR 6,525, 패킹 96×60×65cm·Net 239kg/Gross 265kg | 23 Micrometric clamp/Mikrometras(p108) | 7 compl. (EUR 385) |
| **서보 모터 (SHIP SPARES / SERVO MOTOR, HS 8501) — 적재허가** | SAPFIR 정밀 위치/속도 제어용 서보모터 예비품. 조타·밸브 액추에이터·자동제어/계측 장비 또는 탐사장비 구동의 정밀 위치제어 전동기 교체부품(추정) | 외국 선박용품등 적재허가(신청)서(p130). 화물관리 26FXZ40463140050030, 품목번호 ZZZZ8501(검증: ZZZ→ZZZZ), HS 8501(전동기·발전기). 1 CT, 1.60 KG, 2,518 US$(고가 정밀부품), MAIN DECK, 물품구분 A, 신청 (주)코엔스, 신청번호 …U0089, 선박 SAPFIR(UBUS5) | SHIP SPARES/SERVO MOTOR(p130) | 1 CT (1.60kg, 2,518 US$) |
| **점퍼 케이블 (SHIP SPARES / JUMPER CABLE, HS 8544) — 적재허가** | SAPFIR 전기/전장 계통 점퍼 케이블(전원·신호 우회 연결용 절연 도체). 배터리·기관 시동·전장 패널 간 임시/예비 연결 또는 손상 케이블 교체용(추정) | 외국 선박용품등 적재허가(신청)서(p157). 화물관리 26EASK030117810005, 품목번호 ZZZZ8544, HS 8544(절연 전선·케이블류). 2 GT, 중량합계 1,082.00 KG, 금액 83,348(총금액합계칸과 동일 표기→단일품목 단가 불명확, 판독 불확실), MAIN DECK, 적재구분 A, 선박 SAPFIR(UBUS5), 신청 (주)코엔스 | SHIP SPARES/JUMPER CABLE(p157) | 2 GT (1,082.00kg, 83,348 USD)·(판독 불확실) |

---

## E. 공구·위생·방역·선용품·기타

> p108 BALTIC STREAM UAB 'TOOLS' Proforma(no.30/12-2025, HS 8206000000) 정비공구·위생용 23라인 중 공구류. 계측기는 D, 유압공구는 「배관·유압」으로 분리. 리투아니아어 원문 병기.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **호닝 공구 (Honing tool / Honingavimo įrankis)** | BALTIC STREAM 수취. 기관 정비 시 실린더 내벽 호닝(미세 연마) 가공 공구. 엔진 실린더 보링 후 표면 마무리·재생용(추정) | TOOLS 송장(p108) 1번. UNIT compl., Q-TY 1, 단가/합계 EUR 280. 리투아니아어 'Honingavimo įrankis' | 1 Honing tool/Honingavimo įrankis(p108) | 1 compl. (EUR 280) |
| **마그네틱 스탠드 / 자석 받침대 (Magnetic stand / Magnetinis stovas)** | BALTIC STREAM 수취. 다이얼게이지·측정기를 자력으로 금속면에 고정하는 마그네틱 베이스. 디플렉션/내경 측정 시 게이지 거치(추정) | TOOLS 송장(p108) 6번. UNIT compl., Q-TY 1, 단가/합계 EUR 40. 리투아니아어 'Magnetinis stovas' | 6 Magnetic stand/Magnetinis stovas(p108) | 1 compl. (EUR 40) |
| **커플링 분해용 풀러 세트(7개입 상자) (Box with a set of pullers for pressing couplings / Deze su rinkiniu movams nupresoti)** | BALTIC STREAM 수취. 축 커플링·베어링 등 압입(프레스) 부품을 분해·탈거하는 풀러(추출기) 세트. 기관·기계 정비 압입부 탈거(추정) | TOOLS 송장(p108) 7번. UNIT pcs., Q-TY 1, 단가/합계 EUR 80. 'seto f'=set of(OCR 변형). 리투아니아어 'Deze su rinkiniu movams nupresoti' | 7 Box with a set of pullers(p108) | 1 pcs(세트) (EUR 80) |
| **기계공 공구 금속 박스 / 공구함 (Metal box with locksmiths tools / Meteline saltkalvio deze su saltkalvio irankiais)** | BALTIC STREAM 수취. 기계공·정비공용 수공구 일습이 든 금속 공구함. 정비 작업장 휴대형 공구세트(추정) | TOOLS 송장(p108) 8번. UNIT pcs., Q-TY 1, 단가/합계 EUR 120. 리투아니아어 'Meteline(=Metaline) saltkalvio deze su saltkalvio irankiais' | 8 Metal box with locksmiths tools(p108) | 1 pcs (EUR 120) |
| **스터드 제거기 / 스터드 추출기 (Stud remover / Smeigiu išsuktuvas)** | BALTIC STREAM 수취. 엔진·기계에 박힌 스터드 볼트를 손상 없이 풀어 빼는 추출 공구. 부러지거나 고착된 스터드 탈거(추정) | TOOLS 송장(p108) 9번. UNIT pcs., Q-TY 2, 단가 30, 합계 EUR 60. 리투아니아어 'Smeigiu išsuktuvas' | 9 Stud remover/Smeigiu išsuktuvas(p108) | 2 pcs (EUR 60) |
| **공압 그라인더 / 에어 그라인더 (Pneumatic grinder / Šlifavimo mašinele pnevmo)** | BALTIC STREAM 수취. 압축공기 구동 연삭 그라인더. 방폭·고하중 연마, 선체·기관실 금속면 가공용 공압공구(추정) | TOOLS 송장(p108) 11번. UNIT pcs., Q-TY 1, 단가/합계 EUR 30. 리투아니아어 'Šlifavimo mašinele pnevmo' | 11 Pneumatic grinder(p108) | 1 pcs (EUR 30) |
| **토크 부스터 / 토크 증배기 (Torque booster / Sukimo momento stiprintuvas)** | BALTIC STREAM 수취. 볼트 체결 시 토크를 배가시키는 토크 멀티플라이어. 대형 볼트·너트 고토크 체결/해체용 정비공구(추정) | TOOLS 송장(p108) 14번. UNIT pcs., Q-TY 1, 단가/합계 EUR 320. 리투아니아어 'Sukimo momento stiprintuvas' | 14 Torque booster(p108) | 1 pcs (EUR 320) |
| **토크 렌치 / 다이나모메트릭 렌치 (Torque wrench / Dinamometrinis raktas)** | BALTIC STREAM 수취. 규정 토크값으로 볼트·너트를 조이는 토크 렌치. 기관·기계 조립 시 정확한 체결력 관리(추정) | TOOLS 송장(p108) 15번. UNIT pcs., Q-TY 3, 단가 240, 합계 EUR 720. 리투아니아어 'Dinamometrinis raktas' | 15 Torque wrench(p108) | 3 pcs (EUR 720) |
| **스패너 세트 S6~24mm (Key set S6-24 mm / Raktu rinkinis S6-24 mm)** | BALTIC STREAM 수취. 6~24mm 규격 스패너(렌치) 세트. 볼트·너트 체결·해체용 수공구 세트(추정) | TOOLS 송장(p108) 16번. UNIT set., Q-TY 1, 단가/합계 EUR 40. 'S'=양구/스패너. 리투아니아어 'Raktu rinkinis S6-24 mm' | 16 Key set S6-24 mm(p108) | 1 set (EUR 40) |
| **육각 비트(헤드) 세트 (Set of hexagon heads / Galvučiu komplektas)** | BALTIC STREAM 수취. 육각(헥스) 소켓 비트·헤드 세트. 라쳇·렌치에 끼워 육각 볼트 체결(추정) | TOOLS 송장(p108) 17번. UNIT set., Q-TY 1, 단가/합계 EUR 80. 리투아니아어 'Galvučiu komplektas' | 17 Set of hexagon heads(p108) | 1 set (EUR 80) |
| **체인 호이스트 0.5톤 / 수동 체인블록 0.5톤 (Hand hoists 0,5 tons / Rankines tales 0,5 tonos)** | BALTIC STREAM 수취. 0.5톤 용량 수동 체인 호이스트(체인블록). 기관 부품·중량물 인양·이동용 양중기구(추정) | TOOLS 송장(p108) 22번. 용량 0.5 ton. UNIT pcs., Q-TY 4, 단가 30, 합계 EUR 120. 리투아니아어 'Rankines tales 0,5 tonos' | 22 Hand hoists 0,5 tons(p108) | 4 pcs (EUR 120) |
| **샌딩/연마 머신 (크리스 마린) (Sanding machine Chris Marine / Šlifavimo stakles Chris Marine)** | BALTIC STREAM 수취. Chris Marine = 선박 엔진 밸브시트·실린더 정비용 래핑/연마 머신 브랜드. 기관정비 공작실 장비(밸브시트·실린더 래핑/연마)(추정) | TOOLS 송장(p108) 20번. 브랜드 Chris Marine. UNIT pcs., Q-TY 1, 단가/합계 EUR 3,000(송장 단일 최고가, 총액 6,525 EUR의 약 46%). 리투아니아어 'Šlifavimo stakles Chris Marine'. 검증 추가: 1차 누락(item19→item21 건너뜀)됐던 라인을 5x 확대 재판독으로 복원, 23라인 SUM 직접 합산 = 6,525 EUR 정합 | 20 Sanding machine Chris Marine(p108) | 1 pcs (EUR 3,000) |
| **나사 / 스크류 (Screw — P/N VTO-T068, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 연료분사 노즐 어셈블리(MG311024NT2) 체결용 나사. 노즐 구성부품 고정(추정) | p140 거래명세서 품목7. P/N VTO-T068. 5 pcs, 단가 EUR 5.00, 소계 EUR 25.00 | Screw VTO-T068(p140 item7) | 5 pcs (EUR 25) |
| **핀 (Pin — P/N D7-5H7X8LON, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 연료분사 노즐 어셈블리의 위치결정/도웰 핀. 노즐 바디와 홀더 정렬·회전 방지(추정) | p140 거래명세서 품목13. P/N D7-5H7X8LON(자획 일부 판독 불확실). 10 pcs, 단가 EUR 1.20, 소계 EUR 12.00 | Pin D7-5H7X8LON(p140 item13) | 10 pcs (EUR 12)·(판독 불확실) |

---

## 배관·유압 (신규)

> p108 BALTIC STREAM 유압공구 + p122·124 SAPFIR 적재허가(벤드리스트릭터·밸브) + p131·135·136 버터플라이밸브/기계식 오일씰/압력 파이프 커플링 + p146 St-Marine 논리턴/솔레노이드 밸브.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **유압 잭 / 유압 도크라스 (Jack hydraulic / Hidraulinis domkratas)** | BALTIC STREAM 수취. 유압식 잭(중량물 인양). 기관 부품·중량 장비 정비 시 들어올림·지지용 유압공구(추정) | TOOLS 송장(p108) 13번. UNIT pcs., Q-TY 1, 단가/합계 EUR 110. 리투아니아어 'Hidraulinis domkratas' | 13 Jack hydraulic(p108) | 1 pcs (EUR 110) |
| **유압 프레스 (Hydraulic press / Higraulinis presas)** | BALTIC STREAM 수취. 유압식 압입 프레스. 베어링·부싱·커플링 압입·탈거 및 부품 교정용 공작실 장비(추정) | TOOLS 송장(p108) 18번. UNIT pcs., Q-TY 1, 단가/합계 EUR 120. 원문 'Hidraulic press'(=Hydraulic), 리투아니아어 'Higraulinis presas'(OCR 변형) | 18 Hidraulic press(p108) | 1 pcs (EUR 120) |
| **유압 호스 (Hydraulic hoses / Hidraulines zarnos)** | BALTIC STREAM 수취. 유압 공구·유압 시스템 연결용 고압 호스. 유압잭/프레스 등 유압 정비툴 연결(추정) | TOOLS 송장(p108) 19번. UNIT pcs., Q-TY 4, 단가 20, 합계 EUR 80. 리투아니아어 'Hidraulines zarnos'(브랜드 표기 없음 — 검증 정정: 1차 'Chris Marine' 오귀속, Chris Marine은 item20 Sanding machine 브랜드를 윗줄에 잘못 붙인 것) | 19 Hydraulic hoses(p108) | 4 pcs (EUR 80) |
| **벤드 리스트릭터 (SHIP SPARES / BEND RESTRICTOR, HS 3926) — 적재허가** | SAPFIR 적재 예비품. 라이저·엄빌리컬·플렉시블 호스·케이블 등 유연관이 인출될 때 최소굽힘반경 이하로 과도하게 꺾이는 것을 막아 좌굴·파손을 방지하는 굽힘 제한 보호구. 탐사선의 해저 탐사장비/유압·유체 라인 보호(추정) | 외국 선박용품등 적재허가(신청)서(p122). 품목코드 26SNK01624\|00650003, 1 GT, 528.70 KG, 49,030 US$, HS 3926(폴리우레탄/폴리머 성형품 정합), MAIN DECK, 신청번호 …U0092, 목적항 Vladivostok, 선박 SAPFIR(UBUS5) | SHIP SPARES/BEND RESTRICTOR(p122) | 1 GT (528.70kg, 49,030 US$) |
| **밸브 (SHIP SPARES / VALVE, HS 8481) — 적재허가** | SAPFIR 적재 예비품. 선내 배관·유체(연료·해수·냉각수·유압) 계통 유량/차단 제어용 밸브 예비품. 일반 산업/선박 배관용 밸브(추정) | 외국 선박용품등 적재허가(신청)서(p124). 품목코드 26KJ00099210015\|0263, 1 CT, 7.10 KG, 270 US$, HS 8481(밸브·콕류), MAIN DECK, 신청번호 …U0090, 목적항 Vladivostok, 선박 SAPFIR(UBUS5), 접수 2026-05-11 14:30:43 | SHIP SPARES/VALVE(p124) | 1 CT (7.10kg, 270 US$) |
| **캐터필러 연료캡 오링 (CATERPILLAR FUEL CAP O-RING / DH-2602-0150) — 적재허가** | SAPHIR MAIN DECK 구역에서 캐터필러(Caterpillar) 엔진/발전기 연료 주입구 캡(Fuel Cap) 밀봉용 오링 예비품. 연료 누유·이물질 차단 정비 교체부품(추정) | 내국 선용품 적재허가(신청)서(p132)+부산세관 적재허가. 원기재 'CATERPILLAR FEUL CAP ORING'(FEUL=FUEL 오기·ORING 붙여쓰기 원문대로), P/N DH-2602-0150(검증 정정: 1차 'CH-2632-0150', 5x 확대 재판독으로 첫 글자 D·중간 2602 명확). 합성고무(NBR/FKM) 추정. 품목번호 ZZZZ4016(HS 4016), 란번호 0001, 단위 CT, 수량 1, MAIN DECK, 신청번호 …52-U0005, (주)코엔스. 중량 1.00 KG, 금액 2,382,811 KRW, HS 4016(검증 정정: 1차 '중량/금액 판독 불확실·개별중량 4096' 환각 — 4016은 HS코드를 중량으로 오인한 것) | CATERPILLAR FEUL CAP ORING DH-2602-0150(p132) | 1 CT (1.00kg, 2,382,811원) |
| **캐터필러 연료캡 오링 (SD-5957 Caterpillar Fuel Cap O-RING)** | 코엔스 GLS 경유 보급. 캐터필러 엔진 연료캡(Fuel Cap) 밀봉용 오링 예비품. 연료계통 정비 시 캡 누유 방지용 소모성 씰(추정). SBTS(홍콩) 견적송장 공급 | SEA BRIDGE TECHNICAL SUPPLY(홍콩) PROFORMA INVOICE(p134, 2026-04-27, Our Ref 4391/2408.1/2026/SBTS) ITEM 16. P/N SD-5957(Caterpillar 정품). 단위 PCS, 단가 43.88 EUR, Q'TY 20, 소계 877.60 EUR. ATTN STELLA KIM | SD-5957 Caterpillar Fuel Cap O-RING(p134 item16) | 20 PCS (EUR 877.60) |
| **캐터필러 오일캡 오링 (6V-3907 Caterpillar Oil Cap O-RING)** | 코엔스 GLS 경유 보급. 캐터필러 엔진 오일캡(Oil Cap, 윤활유 주입구 캡) 밀봉용 오링 예비품. 엔진오일 누유·오염 방지용 소모성 씰(추정) | SBTS PROFORMA INVOICE(p134) ITEM 17. P/N 6V-3907(Caterpillar 정품). 단위 PCS, 단가 55.57 EUR, Q'TY 20, 소계 1,111.40 EUR. TOTAL(16+17) EUR 1,989.00. 원기재 'Oil Cap RING'(O 누락)·중간 '5957' 잔영 가능(검증: 표기 보존) | 6V-3907 Caterpillar Oil Cap O-RING(p134 item17) | 20 PCS (EUR 1,111.40) |
| **기계식 오일 씰 (Mechanical oil seal) — WPX 특송** | St-Marine Equipment(상하이) → 코엔스 GLS 특송 선박 예비품(SHIP SPARES IN TRANSIT). 회전축·펌프·기관 축계의 윤활유 누유를 차단하는 기계식 오일 씰. 기관·배관 정비 교체용(추정). ※C 카테고리 p136 송장(HS 8484200090)과 동일 품목군 — 본 행은 p135 특송장 단독 출처 | WPX Waybill Doc(p135, WAYBILL 15 4168 2376) 'Content for Customs': SHIP SPARES IN TRANSIT, Mechanical oil seal, Butterfly Valve. 송하인 St-Marine(Sofia/상하이)→수하인 COENS GLS(STELLA KIM). CN-SHA-DQE/KR-PUS-JSX, 신고가 282.00 USD, 총중량 23.0 kg, Pieces 2 | Mechanical oil seal(p135 WPX) | 2개·23.0kg 중 1품(개별 수량 미구분) |
| **버터플라이 밸브 (Butterfly Valve)** | 선박 배관(해수·청수·연료·밸러스트) 계통에서 원판형 디스크가 90도 회전하며 유체 흐름을 개폐·조절하는 나비형 밸브. 유량 차단·제어용 예비품. p135 특송(St-Marine 상하이) + p136 Proforma(ALMAZ&FEDOR KOVROV) 동일 화물 | p136 Proforma Invoice 품목1. COO CN, 순중량 11.0kg/총중량 12.0kg, 단가 50.000 USD, 2 PCS, 소계 100.00 USD. p135 WPX Content for Customs에도 'Butterfly Valve' 기재(동일 선적 23.0kg/2 piece). p138/139 WPX 라벨 동일 운송장 | Butterfly Valve(p136 item1) = WPX content(p135·138·139) | 2 PCS (USD 100) |
| **압력 파이프 커플링 (Pressure pipe coupling — P/N VTN-T027A, 도면군 MG311024NT2)** | ALMAZ&FEDOR KOVROV 연료분사 고압 파이프 연결 커플링. 인젝터/연료분사 노즐 어셈블리의 고압 연료라인 접속부. 누유 없이 고압 밀봉 연결(추정) | p140 거래명세서 품목5. P/N VTN-T027A. 5 pcs, 단가 EUR 49.00, 소계 EUR 245.00 | Pressure pipe coupling VTN-T027A(p140 item5) | 5 pcs (EUR 245) |
| **논 리턴 밸브 / 체크밸브 (Non return valve, HS 8481804090)** | MAGE 선단(GEOJE-SI 인도) 배관계통(연료·윤활유·냉각수·빌지)에서 유체의 역류를 방지하는 체크밸브. SHIP SPARES IN TRANSIT 예비 밸브(추정) | St-Marine Equipment(상하이) Proforma Invoice(p147, 2026-03-09) 1번. HS IB:848180/OB:8481804090. 8 NO, 단가 3.750 USD, 소계 30.00 USD, COO CN. WPX(p146) AWB 6856075085 'The Non-return valve'. 솔레노이드 밸브와 1건(7.0kg, 1 piece) SHA→PUS | Non return valve(p147 item1) = WPX content(p146) | 8 NO (USD 30) |
| **솔레노이드 밸브 / 전자밸브 (Solenoid valve, HS 8481202090)** | MAGE 선단(GEOJE-SI 인도) 전자코일 작동식 전동밸브. 유압·공압·연료·냉각수 제어계통에서 전기신호로 유체 흐름 개폐. SHIP SPARES IN TRANSIT 제어밸브(추정) | St-Marine Proforma(p147) 2번. HS IB:848120/OB:8481202090. 8 NO, 단가 30.000 USD, 소계 240.00 USD, COO CN. 송장 합계 270.00 USD/16units/순5.0kg·총7.0kg, DAP GEOJE-SI. WPX(p146) 'The solenoid valve' | Solenoid valve(p147 item2) = WPX content(p146) | 8 NO (USD 240) |

---

## 항해·통신 (신규)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **ITU List V — 선박국·해상이동업무 식별부호 일람표 (List of Ship Stations and Maritime Mobile Service Identity Assignments)** | ALMAZ 선교/무선실 비치용 ITU 공식 간행물. 전 세계 선박국 호출부호·MMSI 등 해상이동업무 식별부호를 수록한 항해·무선통신 필수 참고도서. GMDSS/무선국 운용 시 상대국 식별·교신용(SOLAS 무선설비 요구 비치물, 추정) | DELIVERY NOTE(p116, SUBJECT MGCB-001486-ALMAZ, Ref Q-CGLS-FO-MS-260507-00) ITEM 1-1 'ITU List V', 1 EA + 운송용역(품목 아님). 적재허가(p113): 품목코드 ZZZZ0001, HS 8409, 신고가 834,900 KRW, 1 PCS, 1kg, 갑판부, 규격 10×20×10cm(검증 정정: 1차 '100M'→'10CM'), 선박 ALMAZ(**UBWQ4**, 검증 정정: 1차 'UB104' OCR 오독, 신고 2026-03061519-52-U0005), 신청업체 **(주)더 마린 코리아(대표 김정문)**(검증 정정: 배치 전반 '신청 (주)코엔스' 일괄 가정은 p113·p114에 적용 안 됨). 원문 'AN'='AND'·'UST'='LIST' 인쇄 결락 | ITU List V(p116 거래명세서) = 적재허가 List V(p113) | 1 EA / 1 PCS |

---

## 탐사장비 (지질·해저) — batch-03 최대 비중

> **해양 지진파(seismic) 탐사 맥락**: MAGE 탐사선단은 예인식 음향탐사 배열(towed seismic array)을 운용한다. 선미에서 에어건(공기총)으로 음원을 발사하고, 예인 스트리머/하이드로폰 어레이로 반사파를 수신해 해저 지질구조를 영상화한다. 본 카테고리 부품은 이 시스템의 (a) 스트리머 외장·심도제어(QuickCUFF·Digicourse·트랜스듀서), (b) 케이블 굽힘·고정 하드웨어(벤드리스트릭터·칼라스토퍼·케이블그립), (c) 신호 결선(피그테일·옥토퍼스·점퍼·벌크헤드 커넥터), (d) 음원·수신(에어호스피팅·하이드로폰)으로 구성된다.
>
> 전역 dedup: Sound Oceanics 4종(p102~105)은 상업송장(p102)↔AWB 3부본(p103/104/105) → 각 1행, 출처 전 페이지 보존. Trelleborg·하이드로폰 등 p152~153은 송장↔패킹리스트 동일 → 각 1행(출처 152·153). p150 BOL 4종은 해저 케이블 하드웨어(박스 단위 적재).

### 가. Sound Oceanics 스트리머 부품 (p102~105, NIKOLAY TRUBYATCHINSKY 직인 확정)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **퀵커프 이너 레이스 프론트 (QuickCUFF Inner race Front)** | NIKOLAY TRUBYATCHINSKY 예인 스트리머에 장착되는 QuickCUFF 시스템의 전방(Front) 이너 레이스(내측 레이스/베어링 링). 버드/디플렉터 부착·회전 지지용 정밀 부품(추정) | Sound Oceanics LLC 상업송장(p102, Invoice INVMKS20260327, 2026-03-27, MKS CONSULTING 양식). HS 9015.80.40(지구물리 측정기·부분품). 20 PC, 단가 USD 130.00, 금액 USD 2,600.00. EXW Houston TX, 송장 Total USD 13,600.00. AWB 014-79197086(Air Canada, DTOC Express 대리). ★선박: p102~105 하단 러시아 원형직인 NIS «НИКОЛАЙ ТРУБЯЧИНСКИЙ»·IMO 8705010·МАГЭ·МУРМАНСК 확정 | QuickCUFF Inner race Front(p102 송장 = p103/104/105 AWB 일괄기재) | 20 PC (USD 2,600) |
| **퀵커프 이너 레이스 리어 (QuickCUFF Inner race Rear)** | NIKOLAY TRUBYATCHINSKY QuickCUFF 시스템의 후방(Rear) 이너 레이스. 프론트 레이스와 짝을 이뤄 스트리머 외장 칼라/버드 회전부의 후측 지지(추정) | Sound Oceanics 상업송장(p102). HS 9015.80.40. 20 PC, 단가 USD 130.00, 금액 USD 2,600.00. EXW Houston TX | QuickCUFF Inner race Rear(p102 = p103/104/105) | 20 PC (USD 2,600) |
| **퀵커프 칼라 (QuickCUFF Collar)** | NIKOLAY TRUBYATCHINSKY 스트리머 외피에 장착되어 버드/디플렉터 등을 고정·결합하는 외측 클램프 링(칼라). 스트리머 케이블 정비/교체용 소모성 부품(추정) | Sound Oceanics 상업송장(p102). HS 9015.80.40. 40 PC, 단가 USD 130.00, 금액 USD 5,200.00. EXW Houston TX | QuickCUFF Collar(p102 = p103/104/105) | 40 PC (USD 5,200) |
| **디지코스 5011-E 버드 (비수출통제품) (Digicourse 5011-E Birds, Non Export Controlled)** | NIKOLAY TRUBYATCHINSKY 예인 스트리머에 부착되는 심도 제어 장치(streamer depth control bird). DigiCOURSE/ION 5011-E 모델로 스트리머 수중 심도·자세를 능동 제어해 정확한 탐사 자료 취득. 'Non Export Controlled'(수출통제 비대상) 명기 | Sound Oceanics 상업송장(p102). 제조 계열 DigiCOURSE(ION Geophysical) 5011-E. HS 9015.80.40. 1 PC, 단가/금액 USD 3,200.00(4품목 중 최고가). EXW Houston TX. ※batch-02 p97 DIGICOURSE 5011-E BIRDS(NIKOLAY, 적재허가)와 동일 모델군이나 별개 선적·문서(본 건은 미국 Houston 직수입 상업송장) | Digicourse 5011-E Birds Non Export Controlled(p102 = p103/104/105) | 1 PC (USD 3,200) |

### 나. ECU Worldwide BOL 해저 케이블 하드웨어 (p150, 화인 MAGE:09022026)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **벤드 리스트릭터(굴곡 제한기) 및 클램프 (Bend restrictor with clamp)** | MAGE 탐사선단 해저 케이블·엄빌리컬·라이저의 단말 연결부에서 과도한 굴곡을 방지해 최소곡률반경을 유지·보호하는 굴곡제한 부싱. 클램프로 케이블/장비에 고정(추정) | ECU Worldwide 선하증권(p150, B/L LS15HB2604040, B/L SURRENDERED) 2 WOODEN BOX(총중량 1,082.00 KGS, 1.59 M3) 구성품. 화인 MAGE:09022026, Contract 09022026, FREIGHT PREPAID, GOODS IN TRANSIT. Tianjin Seamaster→부산 인도. 운송모선 EASLINE OSAKA V.2617E(컨테이너선, MNCL Line 부산대행, TIANJIN→BUSAN). 박스 단위 적재(개별 수량 미상) | BEND RESTRICTOR WITH CLAMP(p150 BOL) | 미상(2 WOODEN BOX 내) |
| **PEH 스테인리스강 칼라 포건 케이블 (로컬) (PEH/Stainless steel collar forgun cable, LOCAL)** | MAGE 탐사선단 음향 탐사장비(에어건 어레이 등) 또는 ROV/예인장비 연결 케이블. 스테인리스강 칼라(고정링) 부착, 'LOCAL'=국내 조달분. PEH는 폴리에틸렌계 피복/장비코드 추정 | ECU Worldwide B/L LS15HB2604040(p150) 2 WOODEN BOX 구성품. 'forgun'=air gun/source gun 류 음원장비 명칭 오기 가능(불확실). 화인 MAGE:09022026. 박스 단위(개별 수량 미상) | PEH/STAINLESS STEEL COLLAR FORGUN CABLE (LOCAL)(p150 BOL) | 미상(2 WOODEN BOX 내)·(판독 불확실) |
| **칼라 스토퍼 (Collar stopper)** | MAGE 탐사선단 케이블/엄빌리컬의 칼라(고정링) 위치를 고정·정지시키는 스토퍼. 케이블이 굴곡제한기·하우징에서 축방향으로 밀리지 않게 정지점 형성(추정) | ECU Worldwide B/L LS15HB2604040(p150) 2 WOODEN BOX 구성품. 화인 MAGE:09022026. 박스 단위(개별 수량 미상) | COLLAR STOPPER(p150 BOL) | 미상(2 WOODEN BOX 내) |
| **케이블 그립 (Cable grip)** | MAGE 탐사선단 해저 케이블/엄빌리컬을 견인·인양·고정할 때 케이블 외피를 감싸 미끄럼 없이 장력을 분산·파지하는 그립(케이블 스톡킹)(추정) | ECU Worldwide B/L LS15HB2604040(p150) 2 WOODEN BOX 구성품. 화인 MAGE:09022026. 박스 단위(개별 수량 미상) ※p151 케블라 케이블 그립과 별개 BOL·출처 | CABLE GRIP(p150 BOL) | 미상(2 WOODEN BOX 내) |

### 다. Trelleborg 벤드리스트릭터 외 (p151, Tianjin Seamaster 상업송장, CNY)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **클램프형 벤드 리스트릭터, 트렐레보그 DRG 8444, 073(75)mm용 (Bend restrictor with clamp, Trelleborg DRG 8444, umbilical 073(75)mm)** | 지구물리 탐사선의 견인식 음향탐사 배열에서 엄빌리컬 케이블이 선미·연결부에서 급격히 꺾이지 않도록 굴곡반경을 제한해 케이블 손상을 방지. 외경 73(75)mm 케이블용, 클램프 고정(추정) | Tianjin Seamaster Commercial Invoice(p151, SYHY-202604236, 계약 09022026, EXWORK TIANJIN, CNY). 제조사 Trelleborg(트렐레보그) DRG 8444, 클램프 일체형. 단가 ¥38,700(CNY), 수량 5, 합계 ¥193,500. 총계약 CNY 333,086.5(검증 정정: 1차 333,066.5), 50% 선급, 인도 12주. 'LOCAL' | Bend restrictor Trelleborg DRG 8444 073(75)mm(p151) | 5 PCS (¥193,500) |
| **클램프형 벤드 리스트릭터, 트렐레보그 DRG 8444, 065mm용 (Bend restrictor with clamp, Trelleborg DRG 8444, umbilical 065mm)** | 위 벤드 리스트릭터의 외경 65mm 케이블용 변형. 음향탐사 엄빌리컬 케이블의 굴곡반경 제한·손상방지(추정) | Tianjin Seamaster Commercial Invoice(p151). Trelleborg DRG 8444, 클램프 일체형, 외경 65mm. 단가 ¥38,700(CNY), 수량 1, 합계 ¥38,700. 'LOCAL' | Bend restrictor Trelleborg DRG 8444 065mm(p151) | 1 PCS (¥38,700) |
| **현지조달 부품 (품명 본문 미인쇄, '(LOCAL)' 단독) — 엄빌리컬/케이블 부속 추정** | 송장상 벤드리스트릭터·칼라스토퍼 사이 행. 엄빌리컬 케이블 부속(현지조달분)으로 추정되나 품명 본체 판독 불가(추정) | Tianjin Seamaster Commercial Invoice(p151) item 3. 단가 ¥3,760(CNY), 수량 12, 합계 ¥45,120. 품명 본문이 '(LOCAL)'만 인쇄되어 정확 명칭 불명(원본·OCR 모두 본문 결락) | (LOCAL)(p151 item3) | 12 PCS (¥45,120)·(판독 불확실) |
| **칼라 스토퍼, 075mm용 (Collar stopper for umbilical 075mm)** | 엄빌리컬 케이블이 종방향으로 미끄러지지 않도록 케이블 외주에 물려 위치를 고정하는 칼라. 외경 75mm 케이블용(추정) | Tianjin Seamaster Commercial Invoice(p151). 외경 75mm. 단가 ¥1,700(CNY), 수량 7, 합계 ¥11,900 | Collar stopper umbilical 075mm(p151) | 7 PCS (¥11,900) |
| **칼라 스토퍼, 065mm용 (Collar stopper for umbilical 065mm)** | 위 칼라 스토퍼의 외경 65mm 케이블용 변형. 케이블 종방향 위치 고정(추정) | Tianjin Seamaster Commercial Invoice(p151). 외경 65mm. 단가 ¥1,700(CNY), 수량 1, 합계 ¥1,700 | Collar stopper umbilical 065mm(p151) | 1 PCS (¥1,700) |
| **케이블 그립 (케블라, 10TX8.53M, 아이 4.57M) (Cable Grip, Kevlar)** | 엄빌리컬/음향탐사 케이블을 견인·인양 시 외주를 그물망처럼 감싸 인장하중을 분산·고정하는 케이블 그립(스타킹 그립). 케블라(아라미드) 고강도·경량, 끝단 아이로 샤클·계류 연결(추정). ※갑판·계류 동시 해당 | Tianjin Seamaster Commercial Invoice(p151). 재질 Kevlar. 규격 10TX8.53M(본체 8.53m), eye size 4.57M. 단가 ¥5,288(CNY), 수량 6, 합계 ¥31,728 | Cable Grip 10TX8.53M Kevlar(p151) | 6 PCS (¥31,728) |
| **1인치 에어호스 피팅 (1" Air Hose Fitting)** | 탄성파 에어건(공기총) 계통의 고압 공기호스를 연결하는 1인치 피팅. 에어건·컴프레서·매니폴드 간 압축공기 배관 접속(추정) | Tianjin Seamaster Commercial Invoice(p151). 구경 1인치. 단가 ¥0.00(무상/별도청구 없음), 수량 250(대량 소모성 연결구) | 1" Air Hose Fitting(p151) | 250 PCS (¥0) |

### 라. MANA SEIS TECH 에어건·하이드로폰 결선 (p152~153, Invoice 41526-1, USD, 계약 29122025)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **리지드 피그테일, 볼트 건용 (보호캡·스프링 포함) (Rigid Pigtail for Bolt Gun; AGS-6204 Gun connector with protector and spring to AGPU2004-M Wiring Type D)** | 탄성파 음향탐사용 Bolt Gun(볼트형 에어건)에 신호/전원을 연결하는 리지드 피그테일(경성 분기 케이블). AGS-6204 건 커넥터(보호캡·스프링)를 AGPU2004-M에 Wiring Type D로 접속(추정) | Commercial Invoice 41526-1(p152, GOODS IN TRANSIT)+Packing List(p153) item 1. 단가 USD 470.00, 수량 20, 합계 USD 9,400 | Rigid Pigtail for Bolt Gun item1(p152·153) | 20 ea (USD 9,400) |
| **리지드 피그테일, 볼트 건용 (길이 2.2m) (Rigid Pigtail for Bolt Gun; AGS-6204 Gun connector to AGPU2004-M Wiring Type D, Length 2.2m)** | Bolt Gun(에어건)용 리지드 피그테일. AGS-6204 건 커넥터를 AGPU2004-M에 Type D 배선·길이 2.2m로 연결(추정) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 2. AGS-6204→AGPU2004-M, Wiring Type D, Length 2.2m. 단가 USD 375.00, 수량 30, 합계 USD 11,250. (검증: 옥토퍼스는 별도 item3로 분리) | Rigid Pigtail for Bolt Gun 2.2m item2(p152·153) | 30 ea (USD 11,250) |
| **옥토퍼스(분기 하니스), 볼트 건 신호 1→4 분기 (Octopus AGTR-8594-5; In:AGP-2116-M ×1Ft(Black) Out:4 of AGP2104-F ×2Ft(Red/Blue/Black/Yellow))** | 탄성파 음향탐사 배열에서 볼트 건(에어건)/하이드로폰 계통 신호를 분기하는 옥토퍼스(스플리터) 하니스. 입력 1계통(AGP-2116-M, 흑)을 4계통 출력(AGP2104-F, 적/청/흑/황)으로 분배(추정). ★검증 추가(1차가 item2 피그테일에 흡수해 누락한 독립 라인) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 3. 모델 AGTR-8594-5(끝자리 5/S 모호), In=AGP-2116-M ×1Ft(Black), Out=4 of AGP2104-F ×2Ft(Red/Blue/Black/Yellow). 단가 USD 876.00, 수량 10, 합계 USD 8,760.00 | Octopus AGTR-8594-5 item3(p152·153) | 10 ea (USD 8,760) |
| **압력 변환기 (프레셔 트랜스듀서), 모델 TDP 8 (Pressure Transducer, Model: TDP 8)** | 탄성파 에어건/공기배관 또는 탐사 배열의 압력을 전기신호로 변환·계측하는 압력 변환기. 에어건 발사압·심도압 모니터링(추정) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 14. 모델 TDP 8(검증 정정: 1차 'TDP B', 8↔B 오독). 단가 USD 2,200.00, 수량 2, 합계 USD 4,400 | Pressure Transducer TDP 8(p152·153) | 2 ea (USD 4,400) |
| **수심 변환기 (뎁스 트랜스듀서), 모델 TPP 8 (Depth Transducer, Model: TPP 8)** | 견인 음향탐사 배열의 수중 심도(깊이)를 측정하는 수심 변환기. 스트리머/에어건 예인 심도 제어·기록(추정) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 15. 모델 TPP 8(검증 정정: 1차 'TPP B'). 단가 USD 2,200.00, 수량 2, 합계 USD 4,400 | Depth Transducer TPP 8(p152·153) | 2 ea (USD 4,400) |
| **근접형 하이드로폰 (수중청음기, 로컬, HJC-100) (Near Hydrophone, Local brand; HJC-100 on 1M cable to AGP-2104-M)** | 탄성파 음향탐사에서 에어건 발사 신호·반사파를 수신하는 수중청음기(하이드로폰). 근접(Near) 배치형, 에어건 근방 음압 모니터링. 1m 케이블로 AGP-2104-M 커넥터 연결(Pin1+ Pin3-)(추정) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 16. HJC-100, 주파수 5~1000Hz, 정전용량 10nF±5%, 전압감도 -216.54dB(1.49V/bar), 사용온도 0~50°C, 보관 -10~50°C, 최대충격 50Mpa. 로컬 브랜드. 단가 USD 1,100.00, 수량 10, 합계 USD 11,000. 원문 'Near Hydropone'(오타 보존) | Near Hydropone HJC-100 item16(p152·153) | 10 ea (USD 11,000) |
| **암 양압형 벌크헤드 커넥터, 1¼" NPT (Female Positive Bulkhead Connector, 1 1/4" NPT, AGP-2516-F, 0.5 wires)** | 탐사장비 하우징/격벽(bulkhead)을 수밀 관통해 신호선을 인출하는 암(female) 양압형 벌크헤드 커넥터. 1¼인치 NPT 나사식으로 압력용기 벽체 체결(추정) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 17. 1 1/4" NPT STYLE, AGP-2516-F, 0.5 wires. 단가 USD 410.00, 수량 15, 합계 USD 6,150 | Female Positive Bulkhead Connector 1 1/4" NPT(p152·153) | 15 ea (USD 6,150) |
| **암 양압형 벌크헤드 커넥터, 1⅝" 직나사 (Female Positive Bulkhead Connector, 1 5/8" Straight Thread, AGP-2716-F, 0.5 wires)** | 위와 동일 용도의 벌크헤드 커넥터, 1⅝인치 스트레이트 스레드(직나사) 체결식. 탐사 하우징 격벽 수밀 관통 결선(추정) | Commercial Invoice 41526-1(p152)+Packing List(p153) item 18. 1 5/8" Straight Thread, AGP-2716-F, 0.5 wires. 단가 USD 410.00, 수량 15, 합계 USD 6,150 | Female Positive Bulkhead Connector 1 5/8"(p152·153) | 15 ea (USD 6,150) |

### 마. 점퍼 케이블 (p152~153, AGP/AGM 커넥터 계열, 음향탐사 배열 모듈 연결)

> 음향탐사 배열의 모듈/섹션 간 신호·전원을 잇는 점퍼(연결) 케이블. 동일 커넥터 계열이나 **길이·단가·수량이 모두 다른 개별 라인아이템** → 개별 행 유지(중복통합 칸에 송장 item번호 보존).

| 아이템명/개념 (원문 병기) | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|
| **점퍼 케이블 AGP-2116-M(흑)↔AGP-2116-F(흑), 17.25m** | Length 17.25m. 단가 USD 791.00, 수량 3, 합계 USD 2,373(net 33.6kg) | Jumper Cable …17.25m item4(p152·153) | 3 ea (USD 2,373) |
| **점퍼 케이블 AGP-2116-M(흑)↔AGP-2116-F(흑), 19.75m** | Length 19.75m. 단가 USD 846.00, 수량 3, 합계 USD 2,538(net 38.1kg) | Jumper Cable …19.75m item5(p152·153) | 3 ea (USD 2,538) |
| **점퍼 케이블 AGP-2116-M(흑)↔AGP-2116-F(흑), 22m** | Length 22m. 단가 USD 917.00, 수량 3, 합계 USD 2,751(net 42kg) | Jumper Cable …22m item6(p152·153) | 3 ea (USD 2,751) |
| **점퍼 케이블 AGP-2116-M(흑)↔AGP-2116-F(흑), 25m** | Length 25m. 단가 USD 985.00, 수량 3, 합계 USD 2,955(net 47.1kg) | Jumper Cable …25m item7(p152·153) | 3 ea (USD 2,955) |
| **점퍼 케이블 AGP-2116-M(흑)↔AGP-2116-F(흑), 27.5m** | Length 27.5m. 단가 USD 1,028.00, 수량 3, 합계 USD 3,084(net 53.6kg) | Jumper Cable …27.5m item8(p152·153) | 3 ea (USD 3,084) |
| **점퍼 케이블 AGP-2116-M(흑)↔AGP-2116-F(흑), 30m** | Length 30m. 단가 USD 1,095.00, 수량 3, 합계 USD 3,285(net 54.9kg) | Jumper Cable …30m item9(p152·153) | 3 ea (USD 3,285) |
| **점퍼 케이블 AGP-2004-M↔AGP-2004-F, 12m** | Length 12m. 단가 USD 335.00, 수량 10, 합계 USD 3,350(net 12.5kg) | Jumper Cable AGP-2004 …12m item10(p152·153) | 10 ea (USD 3,350) |
| **점퍼 케이블 AGP-2004-M↔AGM-1104-M, 4m** | Length 4m. 단가 USD 260.00, 수량 10, 합계 USD 2,600(net 3.5kg) | Jumper Cable AGP-2004↔AGM-1104 …4m item11(p152·153) | 10 ea (USD 2,600) |
| **점퍼 케이블 AGP-2004-M↔AGM-1104-M, 14m** | Length 14m. 단가 USD 352.00, 수량 6, 합계 USD 2,112(net 9kg) | Jumper Cable …14m item12(p152·153) | 6 ea (USD 2,112) |
| **점퍼 케이블 AGP-2004-M↔AGM-1104-M, 27m** | Length 27m. 단가 USD 473.00, 수량 6, 합계 USD 2,838(net 18kg) | Jumper Cable …27m item13(p152·153) | 6 ea (USD 2,838) |

---

## ※ Cross-batch 보강·중복 (batch-02 기수록 항목의 추가정보)

> batch-03 PDF에 재등장한 batch-02 기수록 품목의 추가/정정 정보. **본문 품목표에는 재계상하지 않고** 여기에만 기록.

| batch-02 기수록 품목 | batch-03 재등장 출처 | batch-03이 보강·정정하는 내용 |
|---|---|---|
| **디스차지 밸브 (discharge valve)** (batch-02 p98 적재허가·p100 WPX, 'WPX 합계 1 piece'로 계상) | p101 St-Marine Proforma Invoice(AKADEMIK KAZANIN, 송장 합계 USD 320, AWB 1499727681 = batch-02 WPX 14 9972 7681) / p106 WPX 동일 화물 | **수량·단가·HS 구체화**: discharge valve **4 PCS**, 단가 USD 35.00, 소계 USD 140.00, HS IB:392690 / OB:**3926909090**(검증 정정: 1차 39265D9090 OCR 오기, 'D' 없음), Net 5.0kg/Gross 6.0kg, COO CN. 직인은 NIKOLAY TRUBYATCHINSKY(IMO 8705010) — 헤더 SHIP TO=AKADEMIK KAZANIN과 불일치(선단 내 수령/전달) |
| **진공 기기 / 진공 머신 (vacuum machine)** (batch-02 p100 WPX, 'WPX 합계 1 piece'로 계상) | p101 St-Marine Proforma Invoice(AKADEMIK KAZANIN) / p106 WPX 'SHIP SPARES IN TRANSIT' | **수량·단가·HS 구체화**: vacuum machine **4 PCS**, 단가 USD 45.00, 소계 USD 180.00, HS IB:842199 / OB:**8421999090**(검증 정정: 1차 8421999000, 끝 4자리 9090), Net 3.0kg/Gross 4.0kg, COO CN. p101 송장 합계 Total 320 USD, 2 line items 8 units, DAP GEOJE-SI |
| **SAPFIR KITCHEN APPLIANCE DELIVERY NOTE (주방기구 1-1~1-22 + 침구류 1-23~1-38)** (batch-02 p62~64, MGCB-000516, DN-CGLS-MS-260317-02) | p110·111·112 (동일 거래명세서 P1/3·P2/3·P3/3 중복 사본, 수량까지 동일) | **신규 품목 없음 — 전량 기수록.** batch-03 PDF가 동일 DELIVERY NOTE를 재수록(채소커터·밥솥·도마·휘스크·주방칼·팬류 + 듀벳커버/베갯잇/시트 GALTEX 침구). batch-02 표에 이미 개별 전개됨 → 재계상 제외. (단 batch-02 검증으로 1-18 'Нож кухонный' 러시아어 주방칼이 별도 행이며, 행번호 1-18~1-22는 Pan=1-19/Saucepan=1-20/Set of saucepans=1-21/Frying pan set=1-22로 정렬됨이 batch-03 재판독으로 확인 — batch-02 수록 내용의 정정 메모) |

---

## ※ 서비스·수수료·운임 항목 (물품 아님) — 분리표

| 항목명 (원문) | 성격·내용 | 출처 p | 수량 |
|---|---|---|---|
| TRANSPORTATION / Delivery to the vessel | 본선까지 배송 운송 서비스 | p112(린넨 거래명세서 2.TRANSPORTATION)·p116(ITU List V) | 각 1 TRIP |
| FREIGHT (열교환기 개스킷 운임) | Tianjin Botai 송장 내 운임(상품 79.20 + 운임 140.00 = 219.20 USD) | p148·149 | 140.00 USD |
| 항공/특송·해상 운임 (AWB·WPX·B/L·DETAILED MANIFEST) | Air Canada AWB 014-79197086(Sound Oceanics)·FINNAIR AWB 105-58199920(750)·Turkish AWB 235-39192204(운임 120 USD)·WPX 특송(282/270/219.20 USD 신고가)·ECU B/L LS15HB2604040·LS15HB2604032(FREIGHT PREPAID)·TNT DETAILED MANIFEST Con 356884711(Invoice Value 5013.7 EUR 운송) | p103~105·120·138·139·141~145·146·149·150·154·160 | — |
| North Ocean PROVISION 운송 | 비 MAGE 선박(MOL) 식료품 거래명세서 — 부식 제외 | p121 | — |

---

## 페이지 회계 (p101~160 전수, 누락 0)

| p | 문서종류 | 선박 | 품목 유무·사유 |
|---|---|---|---|
| 101 | Proforma Invoice(St-Marine, SHANGHAI) | AKADEMIK KAZANIN(헤더)/NIKOLAY TRUBYATCHINSKY(직인) | **Cross-batch 보강** — discharge valve 4PCS·vacuum machine 4PCS(=batch-02 p98/100 동일선적 수량·HS 구체화). 본문 신규 미계상 |
| 102 | Commercial Invoice(Sound Oceanics, MKS Consulting 양식) | NIKOLAY TRUBYATCHINSKY(직인) | 탐사장비 4종(QuickCUFF Front/Rear/Collar·Digicourse 5011-E, p103~105와 통합) |
| 103 | AWB 014-79197086(Air Canada) FOR ISSUING CARRIER 부본 | NIKOLAY TRUBYATCHINSKY | **품목 無** — AWB 부본, 'GEOPHYSICAL INSTRUMENTS' 일괄기재(p102 통합) |
| 104 | AWB 014-79197086 FOR SHIPPER 부본 | NIKOLAY TRUBYATCHINSKY | **품목 無** — AWB 부본(p102 통합) |
| 105 | AWB 014-79197086 EXTRA COPY 부본 | NIKOLAY TRUBYATCHINSKY | **품목 無** — AWB 부본(p102 통합) |
| 106 | WPX EXPRESS(GLS API1.0 라벨) | AKADEMIK KAZANIN | **Cross-batch 중복** — 'SHIP SPARES IN TRANSIT, vacuum machine, discharge valve'(=batch-02/p101 동일). 본문 신규 미계상 |
| 107 | PACKING LIST No.223 | BALTIC STREAM UAB 수취 | 피스톤 어셈블리(C, p109와 통합) |
| 108 | PROFORMA INVOICE no.30/12-2025 — TOOLS | BALTIC STREAM UAB 수취 | 정비공구·계측기 23라인(E/D/배관·유압) |
| 109 | PROFORMA INVOICE No.223 — Engine block | BALTIC STREAM UAB 수취 | 피스톤 어셈블리(C, p107과 통합) |
| 110 | DELIVERY NOTE(KITCHEN APPLIANCE P1/3, MGCB-000516) | SAPFIR | **Cross-batch 중복** — batch-02 p62~64 동일(주방·침구). 신규 미계상 |
| 111 | DELIVERY NOTE(P2/3, 침구·린넨) | MAGE 선단(МАГЭ 직인) | **Cross-batch 중복** — batch-02 p62~64 동일 침구. 신규 미계상 |
| 112 | DELIVERY NOTE(P3/3, 침구 마무리+TRANSPORTATION+합계) | MAGE 선단(МАГЭ 직인) | **Cross-batch 중복**(침구) + TRANSPORTATION(용역). 신규 미계상 |
| 113 | 내국 선박용품 적재허가(신청)서 | ALMAZ(UBWQ4) | ITU List V(항해·통신, p116과 통합). 신청 (주)더 마린 코리아(김정문) |
| 114 | 내국 선박용품 적재허가(신청)서 | ALMAZ(UBWQ4) | 시멘트·모래·액상유리 '시멘트외 2종'(A, p115와 통합). 신청 (주)더 마린 코리아(김정문) |
| 115 | DELIVERY NOTE(CEMENT,SAND,LIQUID GLASS) | SAPHIR→ALMAZ 전달 | 시멘트·모래·액상유리 3종(A, p114와 통합) |
| 116 | DELIVERY NOTE(ITEMS, MGCB-001486) | ALMAZ(IMO 9150024) | ITU List V(항해·통신, p113과 통합) + TRANSPORTATION(용역) |
| 117 | 외국 선박용품 적재허가(신청)서 | SAPFIR(UBU55) | VALVE ROCKER(C, p119와 정합·검증: BONNET 오독) |
| 118 | 외국 선박용품 적재허가 — crew 명단 연속장 | SAPFIR(추정) | **품목 無** — 적재선원 인적사항(강갑근/원영재/문동빈/서동근) |
| 119 | Commercial Invoice(St Marine 000000173) | SAPFIR(p120 직인 확정) | 밸브스프링·밸브로커·로커샤프트 3종(C, p120과 통합) |
| 120 | AWB 105-58199920(FINNAIR cargo) | SAPFIR(МС САПФИР IMO 9182057 직인) | p119 화물 운송장(C 3종 통합) + 운임 |
| 121 | DELIVERY NOTE(COENS, NOC) | **North Ocean(MOL, 비 MAGE)** | **부식 제외** — BEEF/PORK/POULTRY/FISH/VEG/DAIRY/OTHERS 식료품 31건 전량 |
| 122 | 외국 선박용품등 적재허가(신청)서 | SAPFIR(UBUS5) | BEND RESTRICTOR(배관·유압, …U0092) |
| 123 | 적재허가 별지 — crew 명단 연속장 | SAPFIR | **품목 無** — 적재승선자 명단 + MAGE 직인(p122 연속) |
| 124 | 외국 선박용품등 적재허가(신청)서 | SAPFIR(UBUS5) | VALVE(배관·유압, …U0090) |
| 125 | 적재허가 별지 — crew 명단 연속장 | SAPFIR | **품목 無** — 적재승선자 명단 + MAGE 직인(p124 연속) |
| 126 | 외국 선박용품등 적재허가(신청)서(본지) | SAPFIR(UBUS5) | 열교환기 가스켓(C, GASKET FOR HEAT EXCHANGER, …U0091) |
| 127 | 적재허가 2면 — crew 명단 | SAPFIR | **품목 無** — 적재승선자 명단(p126 연속, U0091) |
| 128 | 외국 선박용품등 적재허가(신청)서(본지) | SAPFIR(UBUS5) | 진공펌프 로터(C, ROTOR FOR VACUUM PUMP, …U0088) |
| 129 | 적재허가 2면 — crew 명단 | SAPFIR | **품목 無** — 적재승선자 명단(p128 연속, U0088) |
| 130 | 외국 선박용품등 적재허가(신청)서(본지) | SAPFIR(UBUS5) | 서보모터(D, SERVO MOTOR, …U0089) |
| 131 | 외국 선박용품 적재허가(신청)서 표지 | SAPFIR(추정) | **품목 無** — 적재책임자 선원 명단 + NIKOLAY 계열 직인 |
| 132 | 내국 선용품 적재허가(신청)서+부산세관 | SAPHIR | Caterpillar 연료캡 오링 DH-2602-0150(배관·유압/C) |
| 133 | 내국 선용품 적재허가(신청)서 표지 | SAPHIR(검증: 미상→SAPHIR) | **품목 無** — 적재책임자 선원 명단 + 직인 |
| 134 | PROFORMA INVOICE(SBTS 홍콩) | (코엔스 GLS 경유, 선명 미기재) | Caterpillar 오링 2종(SD-5957·6V-3907, 배관·유압) |
| 135 | WPX WAYBILL DOC(특송) | (선명 미기재, SHIP SPARES IN TRANSIT) | 기계식 오일씰·버터플라이밸브(C/배관·유압, p136과 통합) |
| 136 | Proforma Invoice 1/2(St-Marine) | ALMAZ & FEDOR KOVROV | 버터플라이밸브·기계식오일씰·O ring(배관·유압/C, p135·138·139 통합) |
| 137 | Proforma Invoice 2/2(St-Marine) | ALMAZ & FEDOR KOVROV | 진공펌프 로터(C) + 송장 합계 |
| 138 | WPX 라벨 1/2 | ALMAZ & FEDOR KOVROV | **품목 無** — 동일 운송장(p136 통합, 중복) |
| 139 | WPX 라벨 2/2 | ALMAZ & FEDOR KOVROV | **품목 無** — 동일 운송장(p136 통합, 중복) |
| 140 | Delivery Note/Invoice 0000000150(St Marine) | ALMAZ & FEDOR KOVROV(추정) | 서보모터·O링×3·노즐셋 등 14품목(C/E/배관·유압) |
| 141 | TNT AIR 운송장 라벨 1/3 | MAGE 선단(МАГЕ 직인) | **품목 無** — 운송 라벨(Con 356884711) |
| 142 | TNT AIR 운송장 라벨 2/3 | MAGE 선단 | **품목 無** — 운송 라벨 |
| 143 | TNT AIR 운송장 라벨 3/3 | MAGE 선단 | **품목 無** — 운송 라벨 |
| 144 | TNT DETAILED MANIFEST | MAGE 선단 | **품목 無** — 'Spare parts for ships' 일반기재만(개별 명세 없음) + 운송약관 |
| 145 | TNT DETAILED MANIFEST(사본/연속장) | MAGE 선단 | **품목 無** — p144 동일 데이터(중복) + 운송약관 |
| 146 | WPX/DHL AWB(WAYBILL DOC) | (선명 미기재, GEOJE-SI 인도) | 논리턴밸브·솔레노이드밸브(배관·유압, p147과 통합) |
| 147 | Proforma Invoice(St-Marine 상하이) | (선명 미기재) | 논리턴밸브·솔레노이드밸브 2종(배관·유압, p146과 통합) |
| 148 | Commercial Invoice(Tianjin Botai) | (선명 미기재) | 열교환기 개스킷 2종(C, p149와 통합) + FREIGHT(용역) |
| 149 | WPX/DHL AWB(WAYBILL DOC) | (선명 미기재) | 열교환기 개스킷(C, p148과 통합) |
| 150 | Bill of Lading(ECU Worldwide, SURRENDERED) | MAGE 선단(화인 MAGE:09022026) | 벤드리스트릭터·PEH칼라·칼라스토퍼·케이블그립 4종(탐사장비) |
| 151 | Commercial Invoice(Tianjin Seamaster, CNY) | MAGE 탐사선단(미기재) | Trelleborg 벤드리스트릭터·칼라스토퍼·케블라그립·에어호스피팅 등 7종(탐사장비/배관·유압) |
| 152 | Commercial Invoice 41526-1(MANA SEIS TECH) | MAGE 탐사선단(계약 29122025) | 피그테일·옥토퍼스·점퍼케이블·트랜스듀서·하이드로폰·벌크헤드커넥터 다수(탐사장비, p153과 통합) |
| 153 | Packing List(Invoice 41526-1) | MAGE 탐사선단 | p152 동일 화물(탐사장비, 통합) |
| 154 | Bill of Lading LS15HB2604032(ECU/MNCL) | MAGE 탐사선단 | **품목 無** — '1 WOODEN BOX/CABLE' 통합기재(p152/153 통합) |
| 155 | 외국 선박용품등 **하선**허가(신청)서 | SAPFIR(UBUS5) | 베어링 셸(C, BEARING SHELL, 하선) |
| 156 | 외국 선박용품등 **하선**허가(신청)서 | (미기재, SAPFIR 추정) | **품목 無** — 하선승선자 명단(물품 아님) + MAGE 직인 |
| 157 | 외국 선박용품등 적재허가(신청)서 | SAPFIR(UBUS5) | 점퍼 케이블(D, JUMPER CABLE) |
| 158 | 외국 선박용품등 적재허가(신청)서 | SAPFIR | 밸브 스프링(C, VALVE SPRING) |
| 159 | 외국 선박용품등 적재허가(신청)서 | SAPFIR | 푸시 로드(C, PUSH ROD, p160과 통합) |
| 160 | AWB 235-39192204(Turkish Airlines) | SAPFIR | 푸시 로드(C, p159와 통합) + 운임 |

- **품목 페이지**: 신규 품목 보유 35개 — p102·107·108·109·113·114·115·116·117·119·120·122·124·126·128·130·132·134·135·136·137·140·146·147·148·149·150·151·152·153·155·157·158·159·160. (별도로 p101·106·110·111·112는 cross-batch 보강/중복으로 본문 신규 미계상)
- **비품목 페이지(품목 無)**: 20개 — AWB·BOL·매니페스트 부본/약관/통합기재 p103·104·105·138·139·141·142·143·144·145·154 (11p) / crew 명단 p118·123·125·127·129·131·133·156 (8p) / 부식 전용 p121 (1p)
- **Cross-batch 중복/보강 페이지(본문 신규 미계상)**: 5개 — p101(디스차지밸브/진공 보강)·p106(WPX 재등장)·p110·p111·p112(SAPFIR 주방·침구 batch-02 p62~64 재수록)
- ※ 합계 검산: 신규품목 35 + cross-batch 5 + 비품목 20 = **60/60**
- **crew(승선원) 명단 전용 페이지**: p118·123·125·127·129·131·133·156 (8p)
- **AWB/BOL/매니페스트 부본·약관·통합기재 페이지**: p103·104·105·138·139·141·142·143·144·145·154 (11p)
- **부식(식료품) 제외 페이지**: p121 (North Ocean=비 MAGE MOL 선박, BEEF/PORK/POULTRY/FISH·SEAFOOD/VEGETABLES/MILK·DAIRY/GRAINS·CEREALS/OTHERS 식료품 **31건** 전량 제외)
- **누락 0**: 60/60 페이지 전수 설명 완료

---

## 배치 03 통계

- **비식품 신규 표준품목 표 행: 99행** (카테고리별: A 화학·건자재 **3** / C 기관예비품 **25** / D 전자·계측·전기전장 **10** / E 공구·위생·선용품 **14**(검증 정정: 1차 13, p108 item20 Sanding machine 누락행 복원 +1) / 배관·유압 **13** / 항해·통신 **1**(ITU List V) / 탐사장비(지질·해저) **33**(가. Sound Oceanics 4 + 나. ECU BOL 4 + 다. Trelleborg 7 + 라. MANA SEIS 8 + 마. 점퍼케이블 10)). ※탐사장비가 본 배치 최대 비중.
- **Cross-batch 중복으로 본문 신규 계상 제외**: **40품목** — SAPFIR 주방기구·침구류 38품목(p110~112 = batch-02 p62~64 기수록) + 디스차지 밸브·진공 머신 2품목(p101/106 = batch-02 p98/100 기수록, '보강 섹션'으로만 기록). 침구류는 batch-02에서 색상변형 1행 통합 기준이므로 라인 환산 시 더 큼.
- **적용 검증 정정: 약 14건 핵심** (discharge valve OB코드 3926909090·vacuum OB 8421999090·선박 NIKOLAY TRUBYATCHINSKY 직인 확정·List V 치수 10CM·VALVE BONNET→VALVE ROCKER·선박 SAPFIR(IMO 9182057) 확정·AWB 목적공항 SEOUL INCHON·등록기호 UB55/UB055→UBUS5·품목번호 ZZZ→ZZZZ·화물관리 26MUZ69599·옥토퍼스 독립행 분리·TDP8/TPP8·총계약 333,086.5·Hole-gauge Q-TY 2 등)
- **dedup 통합 건**: Sound Oceanics 4종(p102=p103/104/105) / 피스톤 어셈블리(p107=p109) / 밸브스프링·로커·로커샤프트(p119=p120) / 버터플라이밸브·기계식오일씰(p135=p136=p138/139) / 열교환기개스킷(p148=p149) / 논리턴·솔레노이드밸브(p146=p147) / MANA SEIS 탐사장비(p152=p153) / 푸시로드(p159=p160) — **8개 선적 다중 페이지 통합**
- **부식(식료품) 제외: 31건** (p121 North Ocean 비 MAGE 선박 식료품)
- **처리량**: p101~160 = **60/60p 완료**. **누적 160/215p** (batch-01 50 + batch-02 50 + batch-03 60)
- **신규 공급망**: Sound Oceanics LLC(미국 Houston/Porter TX)·MKS Consulting·DTOC Express·BALTIC STREAM UAB(리투아니아)·Sea Bridge Technical Supply(홍콩)·Tianjin Botai Heat-Exchanger·Tianjin Seamaster·MANA SEIS TECH(홍콩)·SPARKLE HARMONY(호주)·Trelleborg(제조) / 운송 Air Canada·FINNAIR cargo·Turkish Airlines·TNT·ECU Worldwide·MNCL Line·Delamode Bulgaria·VG Handling / 결제 DUHA YAPI(터키) / 부산세관 적재·하선 허가
- **누적 비식품 표준품목 개략**: batch-01 104 + batch-02 96 + batch-03 99(신규, cross-batch 40 제외) = **약 299행 누적** (전역 dedup·cross-batch 중복 제외 후). ※batch-01/02 누적치는 각 배치 담당의 재집계(b01 129 등) 확정 후 별도 갱신 대상
- **다음**: Codex 교차검수 → **batch-04 (p161~215, 55p)**

---

## 적용 정정·통합 요약 (검증 반영 로그)

### 주요 정정 (verify.corrections 반영) — 핵심
1. p101 — discharge valve OB코드 **3926909090**(1차 39265D9090 'D' 삽입 오기), vacuum machine OB **8421999090**(1차 8421999000)
2. p102~105 — 선박 **NIKOLAY TRUBYATCHINSKY**(NIS «НИКОЛАЙ ТРУБЯЧИНСКИЙ», IMO 8705010, МАГЭ, МУРМАНСК) 직인 확정(1차 '미상/AKADEMIK KAZANIN 후보' 철회)
3. p108 — Hole-gauge Q-TY **2**(1차 1, 2×110=220 정합으로 uncertain 철회)
4. p110 — 1-18 'Нож кухонный'(러시아어 주방칼) 별도 행 / 행번호 1-19 Pan·1-20 Saucepan·1-21 Set of saucepans·1-22 Frying pan set 정렬(batch-02 수록분 정정 메모)
5. p113 — ITU List V 규격 **10×20×10CM**(1차 '100M' 오기), 'AN'='AND'·'UST'='LIST' 인쇄결락 보존. **(2R 추가)** 선박 ALMAZ 등록기호 **UBWQ4**(1차 'UB104' 오독, 배치개요·항해통신·페이지회계 전파 위치 모두 정정), 신청업체 **(주)더 마린 코리아(대표 김정문)** 명시(배치 전반 '(주)코엔스' 일괄가정 미적용)
6. p117 — **VALVE ROCKER**(1차 'VALVE BONNET' 오독), 화물관리 **26AYZ56437100001**·품목 ZZZZ8409, 신청업체 (주)코엔스
7. p119/120 — 화물 선박 **SAPFIR**(p120 МС«САПФИР»·IMO 9182057 직인 확정), AWB Agent **M9 Logistics**(MS 아님), 목적공항 **SEOUL INCHON**(1차 VANTAA 오기), HS **8409 9900**
8. p116 — SUBJECT **MGCB-001486**(1차 MGCR 오독)
9. p122/124 — 등록기호 **UBUS5**(1차 UB55)
10. p126/128/130 — 등록기호 **UBUS5**(1차 UB055), 품목번호 **ZZZZ**4016/8414/8501(1차 ZZZ), p128 화물관리 **26MUZ69599**100280400(1차 26MIZ65599…)
11. p133 — 선박 **SAPHIR**(1차 미상)
12. p151 — 총계약 **CNY 333,086.5**(1차 333,066.5, 라인합산 검산 일치)
13. p152 — **옥토퍼스 AGTR-8594-5(USD 8,760) 독립 라인 분리**(1차 item2 피그테일에 흡수돼 누락), 압력/수심 트랜스듀서 **TDP 8 / TPP 8**(1차 TDP B/TPP B, 8↔B 오독)
14. p160 — AWB 품명 'SHIP/GRIP SPARE PARTS / PUSH ROD'(첫 글자 G/S OCR 모호, rawVariants 보존)
15. **(2R 추가)** p114 — 시멘트외2종 적재허가 가액 **90,860**(1차 90,880, 데이터칸·합계칸 5x 확대 '860' 명확). 신청업체 (주)더 마린 코리아(김정문)
16. **(2R 추가)** p132 — Caterpillar 연료캡 오링 P/N **DH-2602-0150**(1차 CH-2632-0150, 첫 글자 D·중간 2602), 중량 **1.00KG**·금액 **2,382,811원**·HS **4016**(1차 '판독 불확실·개별중량 4096' 환각 — 4016 HS코드를 중량으로 오인), 품목번호 **ZZZZ4016(HS 4016)**·란번호 **0001**(1차 품목번호 '0001'은 란번호 오기)
17. **(2R 추가)** p108 — item19 유압호스에서 **'Chris Marine' 브랜드 오귀속 제거**(item20 Sanding machine 브랜드를 윗줄에 잘못 붙임), item20 **Sanding machine Chris Marine(EUR 3,000)** 누락행 복원

### dedup 통합 (전역)
- **Sound Oceanics QuickCUFF/Digicourse 4종**: p102(상업송장) = p103/104/105(AWB 3부본 'GEOPHYSICAL INSTRUMENTS' 일괄기재) → 각 1행
- **피스톤 어셈블리**: p107(패킹리스트 No.223) = p109(Proforma No.223) → 1행
- **밸브스프링·밸브로커·로커샤프트**: p119(St Marine 송장 000000173) = p120(AWB 105-58199920) → 각 1행, p117 적재허가 VALVE ROCKER 정합
- **버터플라이밸브·기계식오일씰**: p135(WPX) = p136(Proforma) = p138/139(WPX 라벨) → 각 1행
- **열교환기 개스킷 2종**: p148(Tianjin Botai 송장) = p149(WPX) → 각 1행(10PCS/46PCS 사양 분리)
- **논리턴·솔레노이드 밸브**: p146(WPX) = p147(Proforma) → 각 1행
- **MANA SEIS 탐사장비**: p152(송장 41526-1) = p153(패킹리스트) → 각 1행
- **푸시로드**: p159(적재허가) = p160(AWB 235-39192204) → 1행

### Cross-batch 중복 처리 (batch-02 기수록, 재계상 제외)
- **p110~112 = batch-02 p62~64 SAPFIR KITCHEN APPLIANCE(MGCB-000516)** 동일 사본 — 주방기구 22 + 침구류 16라인 **재계상 안 함**(기수록), 페이지회계·보강섹션에만 명시
- **p101 디스차지밸브 4PCS·vacuum 4PCS = batch-02 p98/p100(AWB 1499727681=WPX 14 9972 7681)** — 본문 신규 미계상, **Cross-batch 보강 섹션**에 수량·단가·HS 정정 기록

### 검증 추가 (verify.additions)
- p110 **1-18 'Нож кухонный'(러시아어 주방칼)** — 단, batch-02 cross-batch 중복분이므로 batch-03 본문 신규 계상 아님(batch-02 정정 메모로만 반영)
- p152 **옥토퍼스 AGTR-8594-5(USD 8,760, 10ea)** — 탐사장비 표에 정식 신규 행 추가
- p108 **Sanding machine Chris Marine(item20, EUR 3,000, 1 pcs)** — 적대검수 2R 확정: 1차가 item19(유압호스)→item21(Depth gauge)로 건너뛰며 누락한 라인을 E 카테고리에 신규 행 복원. 23라인 SUM 합산 = 6,525 EUR로 송장 인쇄 총액 검산 일치. 동시에 윗줄 item19(유압호스)에 잘못 붙은 'Chris Marine' 브랜드 오귀속 제거

### 미해결 판독 불확실(uncertain) 항목
- p140 **핀 P/N D7-5H7X8LON** — 자획 일부 판독 불확실
- p151 **item 3 '(LOCAL)'** — 품명 본체 미인쇄(원본·OCR 모두 결락), 명칭 불명(¥3,760×12)
- p150 **PEH/STAINLESS STEEL COLLAR FORGUN CABLE** — 'forgun'(=air/source gun 추정) 및 'PEH' 의미 불확실, 박스 단위 적재로 개별 수량 미상
- p157 **JUMPER CABLE** — 금액 83,348 USD가 총금액합계칸과 동일 표기되어 단일품목 단가 불명확
- p160 **PUSH ROD AWB 품명** — 첫 글자 'SHIP' vs 'GRIP' OCR 모호(동일 품목임은 확정)
