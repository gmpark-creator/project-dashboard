# MAGE Supply — Batch 02 (p51~100) 분석 DB

> Module 2 선사업무 / MAGE Project / SUPPLY. 2차 배치(51~100페이지). 전 산출 한국어. 적대검증(2단) 반영 완료. Codex 교차검수 대상.

## 배치 개요

- **출처**: 「페이지 포함 파일 - 26년 4월과 5월의 자료 전체 모음 - 2번 - 51페이지부터 100페이지까지.pdf」 (2026년 4~5월 MAGE supply 조달기록 2차분)
- **추출 방식**: p51~100 = 50p 전량 스캔 이미지. 220DPI 렌더 후 비전 OCR 1차 추출 → **2단 적대검증**(핵심 라인 2~4배 확대 크롭 재판독). raw 변형·정정 모두 보존. **※ '부식'(식료품·프로비전) 파트는 박사 지시로 본 DB에서 제외 — 비식품 표준품목만 수록.**
- **선박단 (MAGE · Marine Arctic Geological Expedition, 북극 해양 지질 탐사)**:
  - **NIKOLAY TRUBYATCHINSKY** (RV 연구선, 등록기호 UB106/UBIQ6, IMO 8705010, 母港 무르만스크, 러시아 RU 선적) — 본 배치 주력(탐사장비·엔진예비품·PROVISION 수령선)
  - **AKADEMIK KAZANIN** (탐사선 / 발주·전달처)
  - **SAPFIR / SAPHIR / 사피르** (RV, 라틴표기 SAPFIR↔SAPHIR 혼용 = 동일선)
  - **★ALMAZ (신규)** (M/V ALMAZ / RV «ALMAZ», MAGE GEOLOGICAL EXPEDITION, IMO 9150024, 무르만스크) — batch-02 다수 적재건의 주 수취선
  - **★FEDOR KOVROV (신규)** (M/V / RV «FEDOR KOVROV») — p93~96 수취선. **단, Owner 요청으로 수취 후 NIKOLAY TRUBYATCHINSKY로 전달(deliver to NIKOLAY)되는 건 명시**
- **공급사·통관 대행**: COENS GLS(코엔스 지엘에스, 담당 Dave Yun) · (주)코엔스 COENS(대표 김영걸/김영철) · 더마린코리아(THE MARINE KOREA, 대표 김정문/김창현) · 다이브앤더보(DIVE & DERBO) · 다이모 다이브 / 해외 발송: St Marine Equipment(불가리아 Sofia·상하이) · Mega Tech Marine Services(인도 Bhavnagar/Ahmedabad) · St Marine Equipment/Airsip / 부산세관(통관·물류심사과) 적재·하선 허가
- **서류 종류**: 내국·외국 선박용품 적재허가(신청)서 · 외국 선박용품 하선허가(신청)서 · DELIVERY NOTE(거래명세서) · Commercial Invoice(상업송장) · Packing List(패킹리스트) · Air Waybill(Turkish Airlines·SWISS WORLD CARGO) · WPX/DHL EXPRESS WORLDWIDE 특송장 · Shipper's Non-Hazardous Cargo Certification · PROVISION/DRINKING WATER 가격표·오더리스트

## 카테고리 구성

| # | 카테고리 | 본 배치 주요 출처 |
|---|---|---|
| C | 기관 예비품(엔진 스페어) | p57·58(실린더헤드)·66~68·72~74(샤프트커플링)·71(St Marine 인보이스 13종)·75(구동벨트)·90(그리스)·95·99(피스톤어셈블리) |
| D | 전자·계측·사무·전기전장 | p52·55(VHF무전기)·60(전장 결선류)·62(밥솥)·77·78·79·80(정류기·배터리·써멀·서지)·88(레이저복합기·토너)·92(BATTERY 외 5종)·93·94(Schneider·AGM축전지)·100(진공기기) |
| E | 공구·위생·방역·선용품·기타 | p53(야광부이)·54(세제)·56(자물쇠)·59·62~64(주방·침구류)·76(블루건)·78(글루건)·89·91(작업복·안전화)·96(O링·구리와셔) |
| — | 배관·유압 (신규) | p51(솔레노이드밸브)·77(압력센서)·80(SS클램프)·98·100(디스차지밸브) |
| — | 항해·통신 (신규) | p52·55(VHF 무전기) |
| — | 안전·구명 (신규) | p53(라이프부이 야광부이) |
| — | 탐사장비(지질·해저) (신규) | p97(DIGICOURSE 5011-E BIRDS) |

> ※ p81~87 = 부식 제외(PROVISION/DRINKING WATER 식료품·식수). p70 = AWB 뒷면 운송약관(품목 無). 상세는 「페이지 회계」 참조.

---

## C. 기관 예비품(엔진 스페어)

> 전역 dedup 핵심: **SHAFT COUPLING CENTAX CM70** 은 (a) ALMAZ向 외국 선박용품 적재허가서(p66)·WPX/DHL 라벨(p67)·Waybill Doc(p68)와 (b) Mega Tech Marine(인도) Commercial Invoice·Packing List·Non-Haz Cert(p72~74)가 **동일 1건 선적**(70kg / USD 10,200 / Mega Tech India→BUSAN→ALMAZ)을 6개 페이지에 분산 기재한 것 → **1행 통합**(출처 p66·67·68·72·73·74). 이중 계상 금지.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **실린더 헤드 컴플리트(밸브 조립 포함)** (Cylinder head cmpl with valves / SHIP SPARES CYLINDER HEAD) | RV SAPFIR 주기관/디젤엔진의 실린더 헤드 교체용 예비품. 밸브가 조립된 완성품으로 공급되어 헤드 어셈블리 통째 교환 | AWB 724-87082412(SWISS WORLD CARGO): '3 PIECES / 66×85×71CM / cylinder head cmpl with valves / NOT RESTRICTED / HS 94099900', 총중량 1,275.00 KG, 운임 PP, 통화 EUR(Charge 5.64/Total 7191), 루트 AMS→(ZRH)→SEOUL INCHON, MN Logistics BV 발행. 적재허가(p57) ZZZZ8409, 3 CT, MAIN DECK, 금액 **111,740 US$(양식상 US$ 명시 — 금액 컬럼·합계라인 US$ 사전인쇄, 내국 양식 ₩과 대조)**, 송하인 St Marine Equipment Ltd(불가리아). MAGE 직인 «САПФИР» 확인. (적재허가 HS 8409 vs AWB 94099900 상이 — 동일품) | SHIP SPARES/CYLINDER HEAD(적재허가 p57) = cylinder head cmpl with valves(AWB p58) | 3 PCS / 3 CT (1,275 KG) |
| **연료 필터 (선박 예비품)** (SHIP SPARES / FUEL FILTER) | RV ALMAZ 디젤기관 연료공급계통 여과용 예비품(연료필터). 외국 선박용품 적재허가 수입통관건 | 외국 선박용품 적재허가서(p65): 화물관리 26TKZ75142100120002, 품목번호 ZZZZ8421, 'SHIP SPARES / FUEL FILTER', 3 CT, 71.70 KG, 금액 4,618 US$, HS부호 8421, MAIN DECK. 헤더 선박 ALMAZ, 부산세관 직인. ※p71(St Marine EUR 필터)·p95(Cummins/Fleetguard 필터)와 선박·통화·금액·문서·화물관리번호 전부 상이 → dedup 통합 아님 | SHIP SPARES/FUEL FILTER(적재허가 p65) | 3 CT (71.70 KG, USD 4,618) |
| **샤프트 커플링 / 축 커플링** (SHAFT COUPLING CENTAX CM70 / CENTAX 70, Mark MTMS-1) | 선박 주기관(추진/동력전달계)과 종동축 사이를 연결하는 CENTA社 탄성(고무요소) 토셔널 댐핑 커플링. 토크 전달과 동시에 비틀림 진동·축 정렬오차 흡수 — 추진/동력전달계 핵심 예비품. ★선박=ALMAZ(검증 정정: 1차 AKADEMIK KAZANIN 오기) | CENTAX-CM 70. HSN 84836090 / 적재허가 HS 8483. **전역 통합 단일 선적**: Mega Tech Marine Services(인도 Bhavnagar/Ahmedabad)→BUSAN, COENS GLS 경유→M/V ALMAZ. INVOICE NO EXP-1(2026-04-09), 2 NOS, 단가 USD 5,100, 합계 USD 10,200, Net 60kg/Gross 70kg, 치수 25×25×11 inch, 100% ADVANCE·C&F BUSAN, 비위험화물 항공운송(AWB 517 997 342 2). 적재허가(p66): 화물관리 26LDZ67558I00032894, ZZZZ8483, 1 CT 70.00kg, MAIN DECK, 가액 10,200, 신청 (주)코엔스(대표 김영철). WPX/DHL(p67·68): WAYBILL 51 7997 3422, KR-PUS-PFS 41, 운임 A/C 10,200.00 USD, Duty&Taxes=Receiver Will Pay | SHIP SPARES/SHAFT COUPLING(적재허가 p66) = DHL라벨(p67) = Waybill Doc(p68) = Commercial Invoice EXP-1(p72) = Packing List(p73) = Non-Haz Cert(p74) | 2 NOS / 1 CT (Gross 70kg, USD 10,200) |
| **푸시 로드 (1차 라인)** (Push rod, Pusher length 142 mm — P/N 1610-005, 도면군 MG160326SAP1) | 선박 디젤기관 연료분사펌프/밸브 구동계의 푸시로드(태핏-로커암 사이 힘 전달). 길이 142mm 규격 정밀 왕복부품 | St Marine Equipment(불가리아) 인보이스 Nr.0000000166(2026-04-14) 1번 라인. Pusher 길이 142 mm, 도면군 MG160326SAP1, 단가 EUR 215.00. ※검증: 9번 라인(별 도면군)과 분리 확정 | Push rod 142mm / 1610-005 / Nr.1 (p71) | 6 pcs (EUR 215) |
| **푸시 로드 (2차 라인 — 검증 추가)** (Push rod — P/N 1610-005, 도면군 MG020326SAP1) | 동일 부품번호 1610-005이나 **도면군·단가·수량이 모두 다른 별개 라인**. 연료분사펌프/밸브 구동계 푸시로드 | St Marine 인보이스 9번 라인. 도면군 MG020326SAP1(O링 1610-015/016/017·스프링 1610-004·실 1610-009와 동일 그룹), 단가 EUR 210.00, 합계 EUR 630.00. **검산: 12개 라인 단순합 = 인보이스 Grand Total EUR 6,599.44 → 두 푸시로드 라인이 각각 독립 계상됨이 수학적으로 입증** (1차는 9번을 1번에 병합해 qty 3·EUR 630 누락) | Push rod / 1610-005 / Nr.9 / qty 3 / EUR 630 (p71) | 3 pcs (EUR 210) |
| **노즐 라인 어셈블리 (버너용)** (Nozzle line compl., NOZZLE LINE B40 — P/N RB117001-05, 도면군 MG101225.2) | 선박 보일러/버너의 연료 분사 노즐 라인 완성품. 버너 튜브 L=202mm 사양에 장착되어 연료를 미립화 분사 — 연소장치 정비 예비품 | St Marine 인보이스 2번 라인. Pos.14, 버너튜브 L=202mm, NOZZLE LINE B40 SER.2 L=191, 단가 EUR 443.40 | Pos.14 Nozzle line compl. / RB117001-05 (p71) | 1 pcs (EUR 443.40) |
| **연결 파이프 어셈블리 (오일 튜브)** (Connecting pipe compl., OIL TUBE B-30/B-40 — P/N RB117119-01) | 버너/연료계통의 오일(연료) 이송용 연결 파이프 완성품. B-30/B-40 사양 오일 튜브 연결 — 연료배관 정비 예비품 | St Marine 인보이스 3번 라인. Pos.18, 단가 EUR 218.84 | Pos.18 Connecting pipe compl. / RB117119-01 (p71) | 1 pcs (EUR 218.84) |
| **오링** (O-ring — P/N 1610-015, 도면군 MG020326SAP1) | 엔진/연료계통 결합부 밀봉(누유 방지)용 고무 오링. 정비 교체 소모 예비품 | St Marine 인보이스 4번 라인. 단가 EUR 1.50 | O-ring / 1610-015 / Nr.4 (p71) | 6 pcs (EUR 1.50) |
| **오링** (O-ring — P/N 1610-016, 도면군 MG020326SAP1) | 엔진/연료계통 결합부 밀봉용 고무 오링(규격 상이). 정비 교체 소모 예비품 | St Marine 인보이스 5번 라인. 단가 EUR 4.50 | O-ring / 1610-016 / Nr.5 (p71) | 6 pcs (EUR 4.50) |
| **오링** (O-ring — P/N 1610-017, 도면군 MG020326SAP1) | 엔진/연료계통 결합부 밀봉용 고무 오링(규격 상이). 정비 교체 소모 예비품 | St Marine 인보이스 6번 라인. 단가 EUR 3.00 | O-ring / 1610-017 / Nr.6 (p71) | 6 pcs (EUR 3.00) |
| **스프링** (Spring, H160·외경82.8·내경58.8mm — P/N 1610-004, 도면군 MG020326SAP1) | 엔진/연료펌프 또는 밸브 조립체의 복원·가압용 압축 스프링. 정비 교체 예비품 | St Marine 인보이스 7번 라인. 높이 160mm, 외경 82.8mm, 내경 58.8mm 코일 스프링, 단가 EUR 105.00 | Spring 160/82.8/58.8 / 1610-004 / Nr.7 (p71) | 6 pcs (EUR 105) |
| **실 / 패킹** (Seal — P/N 1610-009, 도면군 MG020326SAP1) | 엔진/연료계통 회전·왕복부 또는 결합면의 밀봉용 실. 누유 방지 정비 교체 예비품 | St Marine 인보이스 8번 라인. 단가 EUR 18.00 | Seal / 1610-009 / Nr.8 (p71) | 6 pcs (EUR 18) |
| **연료 필터** (Fuel filter — P/N 470002, 도면군 MG090226AKZ.2) | 선박 디젤기관 연료공급계통에서 이물질·수분을 여과하는 연료필터(엘리먼트). 정기 교체 다량 소모품 | St Marine 인보이스 10번 라인. 단가 EUR 26.25, 합계 EUR 2,625.00 | Fuel filter / 470002 / Nr.10 (p71) | 100 pcs (EUR 2,625) |
| **정밀 연료 필터 / 파인 필터** (Fuel fine filter — P/N 1763776, 도면군 MG090226AKZ.2) | 디젤기관 연료계통 2차(미세) 여과용 정밀 연료필터. 분사장치 보호 — 정기 교체 소모품 | St Marine 인보이스 11번 라인. 단가 EUR 12.75, 합계 EUR 255.00 | Fuel fine filter / 1763776 / Nr.11 (p71) | 20 pcs (EUR 255) |
| **조연료 필터 / 코스 필터** (Coarse fuel filter — P/N 1773375, 도면군 MG090226AKZ.2) | 디젤기관 연료계통 1차(조대) 여과용 연료필터. 큰 이물질 1차 제거로 후단 정밀필터 부하 경감 — 정기 교체 소모품 | St Marine 인보이스 12번 라인. 단가 EUR 8.63, 합계 EUR 345.20. (인보이스 Grand Total EUR 6,599.44, VAT 0%, 100% Prepayment) | Coarse fuel filter / 1773375 / Nr.12 (p71) | 40 pcs (EUR 345.20) |
| **구동 벨트 / V벨트** (Drive belt, DAYCO 10A0950C / 대체 V-BELT 3V375) | RV ALMAZ 선상 기계(엔진 보기류·펌프·발전기 등) 동력 전달용 V형 구동벨트. 풀리 간 회전동력 전달 — 정기 교체 소모 예비품 | COENS GLS Delivery Note DN-CGLS-MS-260414-00(Ref Q-CGLS-FO-MS-260408-02-Rev.00, Subject DRIVE BELT MGCB-000742-ALMAZ). DAYCO 10A0950C(폭10mm×길이950mm, A형 단면). 현지 대체품 V-BELT 3V375(원문 오타 'V-BLET'). 별도 DELIVERY CHARGE 1 EA 동반 | drive belt 10×950 DAYCO 10A0950C (p75) | 4 EA |
| **EPPCO 골드 EP2 그리스 (15kg/펄)** (EPPCO GOLD EP2 15kg/pail) | SAPHIR호 기관부·갑판기계 윤활용 다목적 리튬계 극압 그리스. 베어링·핀·계류장비·윈치 등 마찰부 윤활(추정) | COENS GLS DELIVERY NOTE 'LUBRICATION - MGCB-000703 - SAPFIR' 1-1, DN-CGLS-MS-260424-00(Ref Q-CGLS-FO-MS-260414-00-Rev.00). EP2 = 리튬비누기 NLGI 등급 2 극압(EP) 다목적 그리스, 15kg 펄. 별도 TRANSPORTATION 1 TRIP 동반 | EPPCO GOLD EP2 15kg/pail (p90) | 2 PAIL |
| **연료 필터 (Cummins/Fleetguard FS 1226)** (Fuel filter: Cummins 3931063 / Fleetguard FS 1226) | RV FEDOR KOVROV 디젤기관(Cummins 계열, batch-01 Cummins N14 정합)의 연료 여과·수분 분리용 소모성 예비품 | COENS GLS DN-CGLS-MS-260128-01(Ref Q-CGLS-FO-MS-260126-05-Rev.00, Subject FILTERS MGCB-000101-FEDOR KOVROV). Cummins P/N 3931063 = Fleetguard FS 1226(연료/수분분리 스핀온), 'Fleet Guard genuine part' 또는 동등품 | Fuel filter Cummins 3931063 / FS 1226 (p95) | 2 PC |
| **오일 필터 (Fleetguard LF 3345)** (Oil filter: Fleetguard LF 3345) | RV FEDOR KOVROV 디젤기관 윤활유(엔진오일) 여과용 소모성 예비품. 정기 교체 | 동일 DN(p95) 1-2. Fleetguard LF 3345(Cummins/산업용 디젤 스핀온 윤활유 필터), 'Fleet Guard genuine part' 또는 동등품 | Oil filter Fleetguard LF 3345 (p95) | 2 PC |
| **선박 예비부품 일괄** (SHIP SPARE PARTS NOT RESTRICTED — 세부 불명) | ★선박=ALMAZ(검증 정정: 1차 NIKOLAY/SAPFIR 추정 → AWB 하단 'M/V ALMAZ' 직인 근거 확정). 불가리아 St Marine Equipment발 일반 항공화물 선박 예비품 묶음. 세부 품명 미상세(별도 인보이스 필요) | Turkish Airlines AWB **235 SOF 35450295**(끝자리 정정), 5 piece, Gross 87.7 kg, Total Volume 0.76 M3, Chargeable Wt 127, Rate 2.50, 운임 **EUR 317.50**(USD 아님), 라우팅 SOF(Sofia)→IST(Istanbul, TK1030/15)→ICN(Incheon, TK0090/17), 발송일 15-APR-26. 발송인 St Marine Equipment Ltd(85 Aleksandar Malinov Blvd, Sofia 1715, ID 207444305), 발행대리 Delamode Bulgaria/VG Handling, 수하인 COENS GLS CO.,LTD(거제 옥포). 포장 5종 치수(cms): 120×80×64 / 57×51×38 / 32×24×28 / 30×20×15 / 20×20×20 | SHIP SPARE PARTS NOT RESTRICTED (p69) | 5 piece (87.7 kg, EUR 317.50) |
| **엔진 블록 피스톤 어셈블리** (SHIP SPARES ENGINE BLOCK PISTON ASSEMBLY) | NIKOLAY TRUBYATCHINSKY 주기관/발전기관 실린더 블록 장착 피스톤 조립체(피스톤+링+핀 등). 기관 피스톤 교체용 엔진 예비품. ★본 건은 본선에서 내려받는 **하선허가(unloading)** 대상(정비/수리 반출 또는 교체용, 추정) | 외국 선박용품등 **하선허가(신청)서**(별지 제4호) 0001번. HS 8409, 화물관리 UN26030A093513U0008, ZZZZ8409, 물품구분 A. 2 CT, 중량합계 489.00 KG, 금액합계 8,243 US$. 최종입항신고 25JPGLA058I, 하선장소 03078045, 정박위치 MYQ01, 하선예정 2026-05-06 | SHIP SPARES ENGINE BLOCK PISTON ASSEMBLY (p99) | 2 CT (489.00 KG, 8,243 US$) |

---

## D. 전자·계측·사무·전기전장

> 검증 반영: 패널미터 모델 **SPRM→SPPM**, 정류기 **SKB/L 28B→SKB1.2/08**(수량 1→3, 메모 16V 5700uF), 다이오드 수량 1→2, 써멀 **MX-4→MX-6**(4g), 서지보호기 **SP3D-RS→SPG5-B3**, p88 프린터 **Epson XM4000FX/XM2400Sx→Kyocera Ecosys MA4000FX/MA2600cfx(레이저 MFP)**·**TV-1295→Kyocera TK-1285 토너**·TK-5455 4색 토너세트 분리, Danfoss/Schneider 묶음 카테고리 D 통일.

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **VHF 선박용 무전기 ICOM IC-F2100DS** (ICOM IC-F2100DS, IP등급 — 항해·통신) | ALMAZ 갑판부 VHF 음성 교신·해상 통신용 업무용 무전기(트랜시버). 항내·선내·작업선 간 교신 | ICOM IC-F2100DS 시리즈 VHF 디지털/아날로그 겸용. IP등급 패킹리스트 'IP 97' 판독(실제 IP67 방진방수 가능성, OCR 불확실). 세관신고(p52) 'ICOM ICF2100DS 외 1종', 20×30×20CM, 2 PCS, 신고가 924,720원, HS 8409, 갑판부. DELIVERY NOTE(p55): DN-CGLS-MS-260413-00, Ref Q-CGLS-FO-MS-260409-00-Rev.00, SUBJECT RADIOSTATIONS MGCB-000733-ALMAZ, 2 EA. ※카테고리 항해·통신으로도 분류 가능 | 세관 적재허가(p52) = DELIVERY NOTE(p55) | 2 EA / 2 PCS |
| **스마트 프로그램 패널미터** (SPPM-35-C SMART PRGM PANEL METER — 1차 SPRM 정정) | AKADEMIK KAZANIN 수취 → NIKOLAY TRUBYATCHINSKY 전달. 선내 계측·감시반(패널)에 장착해 센서(압력 등) 신호 표시·임계값 프로그래밍하는 디지털 패널 인디케이터 | 모델 **SPPM-35-C**(검증: 'SPPM' 확정, 'SPRM' 오독), SMART PROGRAM PANEL METER = 프로그래머블 디지털 패널 미터. 35=시리즈/사이즈, C=사양. 리드타임 3~5 weeks. DELIVERY NOTE(PANEL METER·PRESSURE SENSOR) MGCB-007767, DN-CGLS-MS-260206-00 | SPPM-35-C SMART PRGM PANEL MTR (p77) | 1 PCS |
| **USB-PC 연결 케이블** (SPPM-CA USB PC CABLE) | AKADEMIK KAZANIN 수취 → NIKOLAY TRUBYATCHINSKY 전달 — 패널미터(SPPM-35-C)/압력센서를 PC에 연결해 설정·프로그래밍·데이터 취득하는 전용 USB 통신 케이블(추정) | 품번 SPPM-CA, USB PC CABLE. 리드타임 3~5 weeks. 패널미터 계열 액세서리(SPPM-35-C 패널미터와 동일 SPPM 접두) | SPPM-CA USB PC CABLE (p77) | 1 PCS |
| **전파정류 브리지 정류기** (SKB1.2/08 Full Wave Bridge Rectifier 1.2A 800V 단상 — 1차 SKB/L 28B 정정) | NIKOLAY TRUBYATCHINSKY 전장 보수용. 선내 전원/제어회로에서 단상 AC를 DC로 변환하는 전파 브리지 정류기. 기존 부품 교체/예비품 | 품명 **SKB1.2/08**, 정격 **1.2 Amp 800 Volt 단상**(검증 정정: 1차 'SKB/L 28B·1.1A·수량1' 오독). 메모 '=> 16V 5700uF'(1차 'see 1/3 alternative'는 오독). DELIVERY NOTE ELECTRICAL ITEMS MGCB-008732, DN-CGLS-MS-260407-00 | SKB1.2/08 Full Wave Bridge Rectifier (p78) | 3 PC |
| **정류 다이오드 BYW29-200** (BYW29-200 Diodes) | NIKOLAY TRUBYATCHINSKY 전장 보수용. 고속 정류 파워 다이오드로 스위칭/전원 회로 보드 수리·예비품 | BYW29-200 = 8A 200V 초고속 회복(ultrafast recovery) 정류 다이오드(통상 TO-220). 수량 1→**2**(검증 정정) | BYW29-200 Diodes (p78) | 2 PC |
| **방수 벽부형 콘센트 박스** (Waterproof white wall outlet box) | NIKOLAY TRUBYATCHINSKY 갑판/습기 구역의 전기 콘센트 설치용 방수 아웃렛 박스. 해수·물기 노출 환경 배선 보호 | 흰색 방수 벽부형 콘센트 박스 | Waterproof white wall outlet box (p78) | 1 PC |
| **보호커버 일체형 단구 표면부착 콘센트** (Single surface-mounted outlet with protection cover) | NIKOLAY TRUBYATCHINSKY 옥외/습식 구역 전원 인출용. 표면 노출형 단구 콘센트 + 방진·방수 보호 덮개 | 단구 surface-mounted outlet + protection cover. 메모 '=> Local alternative'(현지 대체조달 — 1차 'see 1/3 alternative'는 오독) | Single surface-mounted outlet w/ cover (p78) | 1 PC |
| **AAA 건전지 — 에너자이저 알칼라인** (Energizer Primary Alkaline AAA, 4pcs/pack) | NIKOLAY TRUBYATCHINSKY 선내 소형 전자기기·계측기·리모컨 전원용 일차전지(소모성 예비품) | AAA 규격 일차전지, 에너자이저 Primary Alkaline, 4pcs/pack. DELIVERY NOTE BATTERIES MGCB-001162, DN-CGLS-MS-260415-02 | Energizer Primary Alkaline AAA (p79) | 1 PACK (4 pcs) |
| **배터리식 에어블로어 (PC 청소용)** (Battery-powered air blower for cleaning PCs) | SAPFIR 선내 PC·전자장비 청소용. 배터리 구동 송풍기로 컴퓨터·기판·계측기 먼지 제거(전동 더스터) | DELIVERY NOTE AIR BLOWER MGCB-000401, DN-CGLS-MS-260408-00 | Battery-powered air blower (p80) | 1 PC |
| **리튬 코인전지 CR2032** (Power element type CR2032) | SAPFIR 메인보드/계측기 RTC·BIOS·소형 전자장비 백업용 리튬 코인셀 전지(소모성 예비품) | CR2032 = 3V 리튬 코인(버튼)셀 1차전지(직경 20mm) | Power element type CR2032 (p80) | 10 PCS |
| **AAA 알칼라인 건전지 (Duracell LR-3)** (Duracell LR-3 AAA alkaline battery) | SAPFIR 선내 소형 전자기기·리모컨·휴대장비 전원용 AAA 일차전지 | 듀라셀 LR-3(=AAA 규격) 알칼라인 1차전지 | Duracell LR-3 AAA (p80) | 24 PCS |
| **AA 알칼라인 건전지 (Duracell LR-6)** (Duracell LR-6 AA batteries) | SAPFIR 선내 손전등·계측기·휴대장비 전원용 AA 일차전지 | 듀라셀 LR-6(=AA 규격) 알칼라인 1차전지 | Duracell LR-6 AA (p80) | 24 PCS |
| **방열 써멀 컴파운드 Arctic MX-6** (Arctic Cooling MX-6 thermal paste, 4g — 1차 MX-4 정정) | SAPFIR PC·전자장비 CPU/칩과 방열판 사이 열전도용 써멀 그리스. 컴퓨터·계측 전자기기 방열 유지보수 | Arctic Cooling **MX-6**(검증 정정: 1차 MX-4 오독), 비전도성 카본 기반 고성능 써멀 컴파운드(8.5 W/mK급), 용량 4g | Arctic Cooling MX-6 thermal paste => 4g (p80) | 3 PCS |
| **UPS용 서지 보호기 큐브** (Power Cube SPG5-B3 surge protector for UPS — 1차 SP3D-RS 정정) | SAPFIR UPS(무정전전원장치)·전자장비 전원 라인 서지(과전압) 보호용. 낙뢰·과도전압 차단 | Power Cube **SPG5-B3**(검증 정정: 1차 SP3D-RS 오독) surge protector for UPS, 부속 +2.5 mtr cable(2.5m 케이블) | Power Cube SPG5-B3 surge protector (p80) | 4 PCS |
| **전기 밥솥/취반기 (40~50인분급)** (Rice cooker for 40~50 heads, PN brand) | SAPFIR 갤리에서 다인원(40~50인) 밥을 짓는 대용량 취반 장비 | KITCHEN APPLIANCE 항목 1-2, REMARK 'Local / PN brand for 40~50 heads'. 대용량 갤리 가전 | Rice cooker 40~50 heads (p62) | 1 PCS |
| **전기 밥솥/보온밥솥 CUCHEN 3L 220V (옵션)** (CUCHEN RICE COOKER/WARMER R 3L 220V for 17 heads) | SAPFIR 갤리 취사·보온(WARMER) 겸용 소용량 밥솥(옵션 사양, 약 17인) | 항목 1-2 Optional, REMARK 'Local / CUCHEN ... 3L 220V'. 용량 3L, 220V 가전 | CUCHEN R 3L 220V (p62) | 1 PCS |
| **교세라 레이저 복합기 (Ecosys MA4000FX)** (Kyocera Ecosys MA4000FX, PRINTER/MFP) | ALMAZ 선내 사무·서류 출력용 레이저(토너)식 복합기(MFP). 고객 제공 링크 기준 COENS GLS 프록시(대행) 구매 | DELIVERY NOTE 1-1 'Ecosys MA4000FX, PROXY PURCHASE LINK PROVIDED BY THE CLIENT'. Kyocera Ecosys MA 시리즈 = 레이저(토너)식 복합기. D/N DN-CGLS-MS-260331-00, Ref Q-CGLS-FO-MS-260326-00-Rev.01, SUBJECT PRINTER·ORDER 001001·VESSEL NOT SPECIFIED. 재고 미가용 시 지연/취소 단서. 동반 토너(TK-1285·TK-5455)가 레이저식 근거 | Kyocera Ecosys MA4000FX (p88) | 5 EA |
| **교세라 레이저 복합기 (Ecosys MA2600cfx)** (Kyocera Ecosys MA2600cfx, MFP) | ALMAZ 선내 사무용 레이저(토너)식 복합기 추가 모델. 프록시 구매 | 항목 1-2 'Ecosys MA2600cfx'. Kyocera Ecosys MA 시리즈 레이저 MFP. 프록시 구매·재고 미가용 시 대체/취소 단서 | Kyocera Ecosys MA2600cfx (p88) | 5 EA |
| **교세라 토너 카트리지 (TK-1285, 흑백)** (Kyocera TK-1285, black) | ALMAZ 선내 레이저 복합기(Ecosys MA 시리즈)용 흑백 토너 카트리지(사무 소모품). 프록시 구매 | 항목 1-3 'TK-1285, black' 20 EA. Kyocera 흑백 토너 카트리지(위 Ecosys 프린터 소모품). 항목 1-4에 '원 링크 제품 구매 불가→대체상품(TK-5455 4색 토너세트) 20 SET' 프록시 대체 단서 동반 | TK-1285, black (p88) | 20 EA |
| **교세라 4색 컬러토너 세트 (TK-5455, 대체품·비정품)** (Kyocera TK-5455 4 colors set, non-genuine/remanufactured) | ALMAZ 선내 레이저 컬러 복합기용 4색(CMYK) 컬러토너 세트. 1-3 원 링크 제품 구매 불가 시 대체 조달한 비정품(리매뉴팩처드) 토너. 프록시 구매(공급사 면책) | 항목 1-4 'Unable to purchase the linked product => Another linked product, TK-5455 4 colors set / * Not genuine, remanufactured toner / * Proxy purchase made at the customer's request, supplier not liable'. 4색 컬러토너 세트, 비정품/재생 토너 | Kyocera TK-5455 4 colors set (대체품·비정품) (p88) | 20 SET |
| **보조접점 블록(시간지연형) Schneider TeSys D, LADT4** (Contact block with time delay, Schneider TeSys D10...180C LADT4) | FEDOR KOVROV(→NIKOLAY 인도) 전기 제어반(컨택터 회로) 시간지연 절환용 보조접점. TeSys D 컨택터에 부착해 ON 지연 시퀀스 제어 | Schneider Electric TeSys D(D10...180) 컨택터용 시간지연 보조접점. TYPE LADT4(시한동작, ON 지연 0.1~3s급). DELIVERY NOTE 'DANFOSS, SCHNEIDER ELECTRIC' MGCB-000033, DN-CGLS-MS-260128-02, Ref Q-CGLS-FO-MS-260126-01-Rev.00 | LADT4 Contact block w/ time delay (p93) | 1 PC |
| **압력 스위치 Danfoss (코드 060-1101)** (Pressure switch, DANFOSS CODE 060-1101 — 검증: E→D 통일) | FEDOR KOVROV(→NIKOLAY 인도) 냉동/공조 또는 유압·압축공기 계통 압력 감지·제어용 스위치. 설정 압력 도달 시 회로 개폐 | Danfoss 압력 스위치. 코드 **060-1101**(검증: 끝자리 1 확정, 1차 '060-110(?)' 보완). 상위 SUBJECT 'DANFOSS, SCHNEIDER ELECTRIC'. ※검증 권고로 1-2·1-3과 함께 D 통일 | Pressure switch DANFOSS 060-1101 (p93) | 1 PC |
| **온도 릴레이(서모스탯) Danfoss RT-140** (Temperature relay DANFOSS RT-140, TYPE RT140 017-5236 — 검증: E→D 통일) | FEDOR KOVROV(→NIKOLAY 인도) 냉동·공조 또는 온수/엔진 냉각 계통 온도 감지·제어용 서모스탯 릴레이. 설정 온도 도달 시 회로 동작 | Danfoss RT-140 온도 릴레이(또는 동등품). TYPE RT140(017-5236). Danfoss RT 시리즈 산업용 온도/압력 컨트롤. ※검증 권고로 D 통일 | DANFOSS RT-140 / RT140(017-5236) (p93) | 1 PC |
| **AGM 축전지 (TITAN AGM 85.1 VRLA, D31)** (Battery TITAN AGM 85.1 VRLA D31 B00 800A) | FEDOR KOVROV 시동·예비/비상 전원용 무보수 AGM 밀폐 납축전지. 비유출(Non-Spillable)로 선박 탑재 적합 | TITAN AGM 85.1 VRLA(밀폐형 납축전지), D31 B00(PP 케이스), CCA 800A, 외형 305×171×222mm, 품번 4610082702974. 대체품 ROCKET AGM80 12V 80Ah, 315×175×190(H)mm, AGM(semi-gel) Non-Spillable. DELIVERY NOTE AGM BATTERIES MGCB-000150, DN-CGLS-MS-260129-00, Ref Q-CGLS-FO-MS-260126-06-Rev.00 | TITAN AGM 85.1 VRLA D31 (p94) | 2 PC |
| **배터리 외 5종 일괄 (요약 집계)** (BATTERY 외 5종) | NIKOLAY TRUBYATCHINSKY向 배터리 외 5종 전자·전기 품목 일괄. 내국 선박용품 적재허가 요약 집계장(개별 6품목 세부는 원본 미명세). p59 'VEGETABLE CUTTER 외 38종'과 동일한 요약행 처리 | 내국 선박용품 적재허가서(p92): 품목번호 ZZZZ0001, 'BATTERY 외 5종 / 1100×1000×1500MM', 수량합계 6 PCS, 중량합계 35.00 KG, 금액합계 792,220원(₩), HS 8409, 갑판부외. 선박 NIKOLAY TRUBYATCHINSKY(등록기호 UBIQ6), 최종입항신고 25JPGLA0581, 신청 더마린코리아(대표 김정문) | BATTERY 외 5종 요약집계(p92) | 6 PCS (35.00 KG, 792,220원) |
| **진공 기기 (배큠 머신)** (vacuum machine — SHIP SPARES IN TRANSIT) | AKADEMIK KAZANIN(STELLA AIM/코엔스 경유 수하)向 항공 발송 선박 예비품 중 진공 기기(진공펌프/진공청소기/진공포장기 등, 용도 불명) | WPX/DHL EXPRESS WORLDWIDE 운송장 내용 'SHIP SPARES IN TRANSIT, vacuum machine, discharge valve' 중 vacuum machine. 운송장 합계 신고가 320.00 USD·총중량 10.0 kg·1 piece(품목 단위 분리 표기 없음, discharge valve와 공동). CN-SHA-DQE/KR-PUS-JSX, [P] EXPRESS WORLDWIDE(48), WAYBILL 14 9972 7681. 발화주 St-Marine Equipment/Airsip(불가리아/상하이). 사양·PN 미기재 (판독 불확실) | vacuum machine (p100) | 1품(운송장 합계 1 piece, discharge valve와 공동) |

### ※ 서비스·수수료 항목 (D 관련) — 별도 분리

| 항목명 (원문) | 성격·용도 | 출처 p | 수량 |
|---|---|---|---|
| 취급 수수료 (HANDLING CHARGE — Tracking, courier receipt, sorting, palletizing 등) | 프록시 구매 화물의 추적·택배 수령·분류·팔레타이징 등 물류 취급 대행 수수료(ALMAZ 레이저복합기·토너 건) | p88 | 1 LOT |
| 운송비 (TRANSPORTATION — Delivery to the vessel) | ALMAZ 본선까지 배송 운송 서비스 | p88 | 1 TRIP |

---

## E. 공구·위생·방역·선용품·기타

> ※ p62~64 SAPFIR向 KITCHEN APPLIANCE DELIVERY NOTE(MGCB-000516, DN-CGLS-MS-260317-02)의 조리기구·주방잡화(1-1~1-22)와 대량 침구류(1-23~1-38)는 모두 'Local' 조달 선용품(식품 아님). **조리기구는 품목별 개별 행으로 전개**(채소커터·에그슬라이서·강판·필러·도마·랩·콜랜더·체·휘스크·치즈칼·주방칼·팬·소스팬·튀김팬 등 18행), 침구류는 동일품의 색상·패턴 변형을 1행으로 통합(중복통합 칸에 변형 보존).

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **유색 세탁물용 얼룩제거제 (Vanish, 750ml)** (Vanish stain remover for colored laundry, 750ml) | 선내 세탁(승무원 의류·침구) 시 유색 직물 얼룩 제거 세탁 화학용품(세제류, 식품 아님 → E 정상 포함). AKADEMIK KAZANIN 주문 → ALMAZ 전달 | Vanish 유색 세탁물 전용 얼룩제거제 750ml. 메모 '750ml*2/SET'(1차 *3 오기). 단 품명란 'Capacity 750ml -50pcs'와 상충 → **SET 환산 불명**(보수 기재). 주문 25 SET 중 7 SET ALMAZ 부분납품. DELIVERY NOTE DN-CGLS-MS-260225-01-ALMAZ, HOUSEHOLD ITEMS MGCB-000381 | Vanish 750ml (p54) | 7 SET (주문 25 SET 중 부분납품) |
| **트리오빙 5312/8 모티스 자물쇠 (마린 등급)** (TrioVing 5312/8 mortise lock, marine grade) | RV ALMAZ 선내 출입문/캐빈 도어 매립 설치 선박용 자물쇠 본체. 해상 염분·습기 환경용 마린 그레이드 매립형 락. 보안·도어 잠금 | TrioVing(노르웨이 ASSA ABLOY 계열) 5312/8 모티스 락 케이스, 'marine grade'=내식 처리. DELIVERY NOTE 'LOCKS - PROXY PURCHASE' 1-1, 대행구매. SUBJECT LOCKS(2) MGCB-000764-ALMAZ, D/N DN-CGLS-MS-260406-00, Ref Q-CGLS-FO-MS-260401-00-Rev.00 | TrioVing 5312/8 mortise lock (p56) | 2 PCS |
| **베지터블 커터(채소 절단기) 외 38종** (VEGETABLE CUTTER 외 38종) | RV SAPFIR 조리실(갤리) 선용품 39종 묶음(대표 채소 절단기). 식자재 아닌 조리 장비 — 부식 제외 대상 아님 | 내국 선박용품 적재허가서(p59) 단일 집계 라인: ZZZZ0001, 1100×1000×1500MM, 39 PCS, 350.00 KG, 10,809,456원, HS 8409, 갑판부. 대표 VEGETABLE CUTTER(주방 채소절단기), 나머지 38종 세부는 비명세(요약 집계장) | VEGETABLE CUTTER 외 38종 (p59) | 39 PCS (대표 1+38종, 350 KG) |
| **채소 절단기/슬라이서 (Vegetable cutter)** | SAPFIR 선박 갤리(주방)에서 채소를 썰고 다지는 조리 보조기구로 사용 | 주방용 채소 커터(슬라이서). 항목번호 1-1, REMARK 'Local'(현지 조달). 식자재가 아닌 조리기구이므로 식품 제외 대상 아님 | 1-1 Vegetable cutter / 1 / PCS / Local (p62) | 1 PCS |
| **계란 절단기/에그 슬라이서 (Egg slicer)** | SAPFIR 갤리에서 삶은 계란을 균일하게 자르는 조리 소도구(추정) | 에그 슬라이서. 항목번호 1-3, REMARK 'Local'. 조리기구이며 식품 아님 | 1-3 Egg slicer / 1 / PCS / Local (p62) | 1 PCS |
| **플라스틱 보관용기 세트 (Plastic container)** | SAPFIR 갤리/식재료 보관소에서 식자재·잔반을 담아 보관하는 용기(KIT 세트) | 플라스틱 컨테이너(보관 용기). 항목번호 1-4 및 1-5 두 건, 각 1 KIT, REMARK 'Local'. 용기(주방잡화)이며 식품 아님 | 1-4 Plastic container / 1 / KIT / Local; 1-5 Plastic container / 1 / KIT / Local (p62) | 2 KIT (1-4: 1 KIT, 1-5: 1 KIT) |
| **채소 강판/그레이터 (Vegetable grater)** | SAPFIR 갤리에서 채소·치즈 등을 가는 조리 소도구 | 베지터블 그레이터(강판). 항목번호 1-6, 1 PCS, REMARK 'Local'. 조리기구 | 1-6 Vegetable grater / 1 / PCS / Local (p62) | 1 PCS |
| **채소 필러/감자칼 (Vegetable peeler)** | SAPFIR 갤리에서 채소·과일 껍질을 벗기는 조리 소도구 | 베지터블 필러(껍질 벗기개). 항목번호 1-7, 2 PCS, REMARK 'Local'. 조리기구 | 1-7 Vegetable peeler / 2 / PCS / Local (p62) | 2 PCS |
| **도마 (Cutting boards)** | SAPFIR 갤리에서 식재료를 손질하는 도마. 1-8·1-9·1-10 모두 KIT 사양 | 커팅 보드(도마). 항목번호 1-8 (1 KIT), 1-9 (1 KIT), 1-10 (1 KIT), 모두 REMARK 'Local'. 주방 조리기구 | 1-8 Cutting boards / 1 / KIT / Local; 1-9 Cutting boards / 1 / KIT / Local; 1-10 Cutting boards / 1 / KIT / Local (p62) | 1-8: 1 KIT, 1-9: 1 KIT, 1-10: 1 KIT |
| **식품 포장용 랩/필름 (Food film)** | SAPFIR 갤리에서 음식·식재료를 싸서 보관하는 주방용 랩(포장재). 먹는 것이 아닌 위생 포장 소모품 | 푸드 필름(클링 랩). 항목번호 1-11, 3 ROLL, REMARK 'Local'. 식품 포장용 랩 소모품으로 식료품 자체가 아님 → 비식품으로 포함 | 1-11 Food film / 3 / ROLL / Local (p62) | 3 ROLL |
| **체/거름망 콜랜더 시브 (Colander sieve)** | SAPFIR 갤리에서 식재료 물기를 빼거나 거르는 거름망 | 콜랜더 시브(거름망/체). 항목번호 1-12, 1 PCS, REMARK 'Local'. 조리기구 | 1-12 Colander sieve / 1 / PCS / Local (p62) | 1 PCS |
| **체 세트 (Sieve set)** | SAPFIR 갤리에서 가루·액체를 거르고 분리하는 다양한 망 세트 | 시브 세트(체 세트). 항목번호 1-13, 1 KIT, REMARK 'Local'. 조리기구 | 1-13 Sieve set / 1 / KIT / Local (p62) | 1 KIT |
| **채반/소쿠리 콜랜더 (Colander)** | SAPFIR 갤리에서 면·채소 물기를 빼는 채반 | 콜랜더(채반). 항목번호 1-14, 1 PCS, REMARK 'Local'. 조리기구 | 1-14 Colander / 1 / PCS / Local (p62) | 1 PCS |
| **거품기/휘스크 (Whisk)** | SAPFIR 갤리에서 계란·반죽을 휘젓는 거품기 | 휘스크(거품기). 항목번호 1-15, 1 PCS, REMARK 'Local'. 조리기구 | 1-15 Whisk / 1 / PCS / Local (p62) | 1 PCS |
| **치즈 슬라이서/치즈칼 (Нож для нарезки сыра)** | SAPFIR 갤리에서 치즈를 자르는 전용 칼(러시아어 표기 — 러시아 선원 대상) | 러시아어 'Нож для нарезки сыра'(치즈 절단용 칼). 항목번호 1-16, 1 PCS, REMARK 'Local'. 조리기구 | 1-16 Нож для нарезки сыра / 1 / PCS / Local (p62) | 1 PCS |
| **주방칼 (Kitchen knife)** | SAPFIR 갤리에서 식재료를 손질하는 주방용 칼 | 키친 나이프(주방칼). 항목번호 1-17, 1 PCS, REMARK 'Local'. 조리기구 | 1-17 Kitchen knife / 1 / PCS / Local (p62) | 1 PCS |
| **주방칼(러시아어 표기) (Нож кухонный)** | SAPFIR 갤리에서 사용하는 주방칼(러시아어 표기, 러시아 선원 대상) | 러시아어 'Нож кухонный'(주방칼). 항목번호 1-18, 1 PCS, REMARK 'Local'. 조리기구(1-17과 별도 라인) | 1-18 Нож кухонный / 1 / PCS / Local (p62) | 1 PCS |
| **프라이팬 (Pan)** | SAPFIR 갤리에서 부침·볶음 조리용 팬 | 팬(프라이팬류). 항목번호 1-19, 1 PCS, REMARK 'Local'. 조리기구 | 1-19 Pan / 1 / PCS / Local (p62) | 1 PCS |
| **소스팬/냄비 (Saucepan)** | SAPFIR 갤리에서 소스·국물 조리용 냄비 | 소스팬(냄비). 항목번호 1-20, 1 PCS, REMARK 'Local'. 조리기구 | 1-20 Saucepan / 1 / PCS / Local (p62) | 1 PCS |
| **소스팬/냄비 세트 (Set of saucepans)** | SAPFIR 갤리에서 다양한 크기로 조리하는 냄비 세트 | 셋 오브 소스팬(냄비 세트). 항목번호 1-21, 1 PCS, REMARK 'Local'. 조리기구 | 1-21 Set of saucepans / 1 / PCS / Local (p62) | 1 PCS |
| **뚜껑 없는 튀김팬/프라이팬 세트 (Frying pan set, without the lid)** | SAPFIR 갤리에서 튀김·부침용 프라이팬 세트(뚜껑 미포함) | 프라이팬 세트. 항목번호 1-22, 1 PCS, REMARK 'Without the LID'(뚜껑 없음). 조리기구 | 1-22 Frying pan set / 1 / PCS / Without the LID (p62) | 1 PCS |
| **이불/컴포터 (1.5인용, 사계절, 실리콘 충전 200g)** (Blanket 1.5-bed, all-season, siliconized fiber 200g) | SAPFIR 선실 침구. 사계절용 이불(컴포터). 선원 거주 침구 | 1-23, 30 PCS. 충전재 실리콘 가공 섬유 200g, 흰색, KAPOK TYPE, NO RETURN. ★치수 원문 모순: 품명란 'Blanket 140×205' vs REMARK 'COMFORTER 1500×2000MM(=150×200)' — 5cm 차, **원문 그대로 보존(불확실)** | Blanket 1.5-bed 140×205 / 1500×2000MM (p62) | 30 PCS |
| **베개 (50×70cm, 실리콘 충전 섬유)** (Pillow 50x70 cm, siliconized fiber) | SAPFIR 선실 침구. 선원 거주 침구 | 1-24, 30 PCS. 50×70cm, 충전재 실리콘 가공 섬유, KAPOK TYPE BIG SIZE | Pillow 50x70 cm (p62) | 30 PCS |
| **이불커버/듀벳커버 (1.5인용, 147×215cm, GALTEX 6패턴)** (Duvet cover for 1.5 bed, 147x215 cm, cotton calico/poplin, GALTEX Tropics·Grunge·Romance·turquoise) | SAPFIR 선실 침구 듀벳(이불)에 씌우는 커버. 선원 거주 침구. 색상·원단별 6라인 | 1-25~1-30, 각 10 PCS(합 60 PCS). 150×215CM, 면·캘리코/포플린, GALTEX(Tropics 터쿼이즈 / Grunge 터쿼이즈 ×2 / Romance 터쿼이즈 ×2), GRAY PATTEN, ZIPPER TYPE, 100% COTTON, NO RETURN | Duvet cover 1.5 bed ×6라인 (p62~63) | 60 PCS (6라인 × 10) |
| **베갯잇/필로우케이스 (50×70cm, 2매조, GALTEX 4패턴)** (Pillowcases 50x70 cm, 2 pcs, cotton calico/poplin, GALTEX Tropics·Romance·Positive) | SAPFIR 선실 베개에 씌우는 베갯잇. 선원 거주 침구. 원단·색상별 4라인 | 1-31~1-34, 각 10 PCS(합 40 PCS). 50×70cm 2매 1조, 면·캘리코/포플린, GALTEX(Tropics 터쿼이즈 ×2 / Romance 터쿼이즈 / Positive 다크그레이), CASE 55×75CM, ZIPPER TYPE, 2EA 1SET, NO RETURN | Pillowcases ×4라인 (p63) | 40 PCS (4라인 × 10) |
| **매트리스커버/피티드시트 (90×200cm, 면 포플린/캘리코)** (Fitted sheet 90x200 cm, cotton poplin/calico, GALTEX graphite, elastic band) | SAPFIR 선실 매트리스에 씌우는 고무밴드형 시트. 선원 거주 침구. 원단별 4라인 | 1-35~1-38: 1-35 graphite poplin 10 / 1-36 poplin 10 / 1-37 calico 10 / 1-38 calico 20 (합 50 PCS). 90×200cm, ELASTIC BAND TYPE GRAY, 100% COTTON, NO RETURN | Fitted sheet ×4라인 (p63~64) | 50 PCS (10+10+10+20) |
| **글루건/핫멜트 접착건 (FULL WAVE BRIDGE GLUE GUN)** (FULL WAVE BRIDGE GLUE GUN) | NIKOLAY TRUBYATCHINSKY 선내 보수·공작용. 글루건(핫멜트 접착·경미한 봉합/고정/방수 마감용 공구). 신청인 DIVE & DERBO는 통관대행 정보일 뿐 품목 용도 근거 아님 | 내국 선박용품 적재허가서(p76) 단일 라인. 품명 및 규격 'FULL WAVE BRIDGE GLUE GUN / 20×20×30CM', 2 PCS, 중량 2.00KG, 신고가 52,000원(KRW), HS 8409, 갑판부, 품목번호 ZZZZ0001. 같은 p78에 '무선 충전식 글루건' 행 정상 존재 → 본 건도 글루건 부류로 정합 | FULL WAVE BRIDGE GLUE GUN (p76) | 2 PCS |
| **무선 충전식 글루건** (Cordless, battery-powered glue gun) | NIKOLAY TRUBYATCHINSKY 선내 보수·공작용. 배터리 구동 무선 글루건으로 핫멜트 접착·경미한 봉합·고정·방수 마감 | 코드리스 배터리 구동 핫멜트 글루건. 메모 '=> Local alternative'(현지 대체조달 — 1차 'see 1/3 alternative'는 오독). ELECTRICAL ITEMS(p78) | Cordless glue gun (p78) | 1 PC |
| **작업복/안전화 (SAPFIR)** (WORK SUIT, SAFETY SHOES) | SAPFIR 선원 개인보호장구(PPE). 갑판/기관부 작업 시 신체 보호 작업복·발 보호 안전화. 부산세관 내국 선박용품 적재허가. ※p91 DELIVERY NOTE 'WORK SUIT - TBC - SAPFIR'(작업복 1 SET + 안전화 1 PAIR = 2 PCS)와 동일 SAPFIR 작업복+안전화 조달의 적재허가본/거래명세서 관계로 추정(dedup 추정 — 별건 입증 근거 없으면 통계 이중계상 주의) | 내국 선박용품 적재허가서 품목 ZZZZ0001, 2 PCS, 중량 3.00KG, 금액 87,560원(KRW), HS부호 8409(별도), 규격 30×20×30CM, 갑판부. 선박 SAPFIR(=SAPHIR 병기), 최종입항신고 25JPGLA0591, 등록기호 UBUS5, 출항예정 2026-04-30, 신청 더마린코리아(대표 김정문). 부산세관 적재허가 직인 | WORK SUIT, SAFETY SHOES / ZZZZ0001 (p89·p91 추정 연결) | 2 PCS |
| **작업복 상하의 세트 (워크슈트, 3XL)** (Work suit, pants and jacket, height 180cm, size 58 / 3XL) | RV SAPFIR 선원 갑판·기관 작업용 보호 작업복(상의 재킷+하의 팬츠). 통기성 발열·방염 처리 | 신장 180cm 사이즈 58, REMARK 3XL. Breathable Heat Release / Spark Resistant / Cotton Twill. 사이즈 안내 2XL=180cm(73~80KG)/3XL=185cm(80~88KG). DELIVERY NOTE(p91) | Work suit pants+jacket 3XL (p91) | 1 SET |
| **여름용 작업 안전화 (사이즈 44, 흑색)** (Summer work boots, size 44, black) | RV SAPFIR 선상 작업용 안전화. 갑판·기관실 보행 보호. 통기·플라스틱 토캡·케블라 바닥 | 사이즈 44, BLACK. Upper=인조가죽+메시+고무 아웃솔, Lining=통기 샌드위치 에어메시+다이얼 시스템, Plastic toe cap(플라스틱 선심), Bottom=Kevlar. 정사이즈 권장 | Summer work boots size 44 (p91) | 1 PAIR |
| **고무·오일·가스 내성 O링 세트 (NBR90)** (A set of rubber oil and gas resistant rings, NBR90 P,G(mm) 382PCS) | RV FEDOR KOVROV 엔진·유압·연료/오일 계통 배관·펌프·밸브 씰링용 O링 세트. 내유·내가스 사양 누유 차단(추정: 기관실 배관/유압 실링 교체용) | 서로 다른 직경 고무 O링 1세트(2pcs 표기). 재질 NBR(니트릴) 경도 90, 규격 'P,G(mm)'. 한국 내 정품 미입수 → 현지 대체 NBR90 P,G(mm) 382PCS. SUBJECT 'O-RING, COPPER WASHER - MGCB-000105', D/N DN-CGLS-MS-260127-01, Ref G-CGLS-FD-MS-260123-00-Rev.00. ※대체품 면책 문구: 원 요청품과 동일 물성 보장 안 됨, 첨부 제품자료로 적합성 확인 요망 | O-RING set(p96) / 현지대체 NBR90 382PCS | 2(1세트) SET (대체품 382 PCS) |
| **적동(구리) 와셔·개스킷 세트** (A set of red copper rings/gaskets / Copper washer set, 12 sizes 300pcs) | RV FEDOR KOVROV 인젝터·연료분사·드레인 플러그·고압 배관 등 금속 밀봉부 시일링 와셔(개스킷). 체결 시 변형되며 금속면 밀봉 형성 | 서로 다른 직경 적동(red copper) 링(개스킷) 1세트(2pcs 표기). 한국 내 정품 미입수 → 현지 대체 Copper washer set 12 sizes 300pcs. 동일 SUBJECT 'O-RING, COPPER WASHER - MGCB-000105'(O링과 공통 면책 문구 적용) | COPPER WASHER set(p96) / 현지대체 12사이즈 300PCS | 2(1세트) SET (대체품 300 PCS) |

---

## 배관·유압 (신규)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **솔레노이드 밸브 (선박 예비품)** (SHIP SPARES IN TRANSIT, solenoid valve) | 선박 배관/유압·공압 회로의 유체(연료·물·공기·오일) 흐름을 전기신호로 개폐하는 전자제어 밸브. 기관실·갑판 장비 자동제어 라인(추정). ★선박=NIKOLAY TRUBYATCHINSKY(검증: p51 하단 러시아 직인 'НИКОЛАЙ ТРУБЯТЧИНСКИЙ / IMO 8705010 / Мурманск' 근거) | 전자식 솔레노이드 작동 밸브. AWB(WPX/DHL P EXPRESS WORLDWIDE 48): Declared Value 120 USD, 2.0kg, 1 piece, CN-SHA-DQE→KR-PUS-JSX, Service CH40, Waybill 17 2793 8225(판독 불확실). Shipper **St Marine Equipment**(검증: 1차 'Engineering' 오기, Sofia/Shanghai, 담당 Annie), Receiver C/O COENS GLS(거제, STELLA KIM). 밸브 모델/구경/전압 AWB 미기재 (판독 불확실) | solenoid valve (p51) | 1 piece (2.0kg) |
| **압력센서 DMP 333 (비고: CANCELLED)** (Pressure sensor DMP 333, 0-160Bar, 4-20mA/0-10V) | AKADEMIK KAZANIN 수취 → NIKOLAY TRUBYATCHINSKY 전달. 선내 유체(유압/연료/해수 등) 라인 압력을 신호로 변환해 패널미터(SPPM-35-C)로 표시하기 위한 산업용 압력 트랜스미터. ★거래명세 비고 CANCELLED(취소·미공급)이나 사양 보존 차 기록. ※b04 p170 DMP333(D 전자·계측)과 동일 종류 압력 트랜스미터 → 분류 통일 시 D 권장(현 위치 배관·유압 유지·주석) | 모델 DMP 333(BD Sensors). Pressure Range 0-160Bar, Gauge압, Output 4-20mA(2-wire)/0-10V 병기, Accuracy 0.35% FS(11-12bit res), Electrical Conn DIN43650A IP65, Process Conn G1/2 DIN3852 male, Media Seals FKM. DELIVERY NOTE Q'TY 0 PCS, 비고 CANCELLED | Pressure sensor DMP 333 (p77) | 0 PCS (CANCELLED·미공급) |
| **스테인리스 메탈 클램프 (7.9mm × 600mm)** (Stainless steel metal clamp, uncoated, 7.9mm x 600mm — 1차 7.0mm 정정) | SAPFIR 배관/호스 결속·고정용. 무코팅 스테인리스 메탈 밴드 클램프(스트랩)로 호스·케이블·배관을 죄어 고정 | 스테인리스강 무코팅 메탈 클램프(밴드/스트랩), 폭 **7.9mm**(검증 정정, 1차 7.0mm 오독) × 길이 600mm. 메모 '=> 100EA/PKT'(1팩 100개입), Q'TY 1 PKT | SS metal clamp 7.9mm×600mm => 100EA/PKT (p80) | 1 PKT (= 100 EA) |
| **디스차지 밸브 (배출 밸브)** (SHIP SPARES / DISCHARGE VALVE) | NIKOLAY TRUBYATCHINSKY 배관 계통(펌프 토출·빌지·밸러스트·냉각/유압 라인 등)에서 유체 배출을 단속하는 배출 밸브. 펌프·압축기 토출측 또는 탱크 드레인 설치 예비 밸브(추정). WPX 운송장(p100) 'discharge valve'와 동일품 통합 | 외국 선박용품 적재허가(p98): 화물관리 26KE08S4HII00390037(일부 OCR 불확실), ZZZZ3926, HS **3926**(플라스틱 기타제품 — 밸브 바디/부속이 합성수지이거나 단순 신고분류 추정), 1 CT, 10.20 KG, 320 US$, MAIN DECK. WPX(p100): 'SHIP SPARES IN TRANSIT, vacuum machine, discharge valve' 묶음, 합계 1 piece/10.0kg/320 USD, WAYBILL 14 9972 7681 | 적재허가 DISCHARGE VALVE(p98) = WPX discharge valve(p100) | 1 CT (10.20 KG, 320 US$) |

---

## 항해·통신 (신규)

> ICOM IC-F2100DS VHF 무전기는 D(전자·계측·전기전장)에 수록함. 본 카테고리는 항해·통신 장비 분류 위치만 명시(품목은 D 표 참조).

- **VHF 선박용 무전기 ICOM IC-F2100DS** (ALMAZ, 2 EA) — 상세는 D 카테고리 표 참조. 항해·통신 분류 동시 해당.

---

## 안전·구명 (신규)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **야광 부이 / 라이프부이용 발광체** (Luminous buoy for a lifebuoy, QD 10L, MED certified — 1차 'SOLAS·IMO' 삭제) | ALMAZ 구명부환(lifebuoy)에 부착하는 야광/발광 부이. 야간·악천후 해상 인명구조 시 조난자·구명부환 위치를 발광으로 표시하는 구명안전 장비 | 구명부환용 야광 부이. 인증표기 **'QD 10L, MED certified'**(검증: 'SOLAS·IMO'는 환각 — 문서에 없음, 삭제). DELIVERY NOTE DN-CGLS-MS-260406-04, Ref Q-CGLS-FO-MS-260402-01-Rev.00, SUBJECT LUMINOUS BUOY MGCB-001112-ALMAZ, 품목 1-1. 모델/제조사/배터리 미기재 | Luminous buoy for a lifebuoy => QD 10L, MED certified (p53) | 2 PCS |

---

## 탐사장비 (지질·해저) (신규)

| 아이템명/개념 (원문 병기) | 선박 내 용도·사용처 | 상세 설명·특징 | 중복통합(원기재·출처p) | 수량/비고 |
|---|---|---|---|---|
| **디지코스 5011-E '버드' (스트리머 수심제어)** (DIGICOURSE 5011-E BIRDS, NON EXPORT CONTROLLED) | NIKOLAY TRUBYATCHINSKY(해양 지질·탄성파 탐사선)의 토우드 스트리머(towed streamer)에 부착하는 수심·자세 제어 장치('birds'). 예인 하이드로폰 스트리머의 깊이·횡방향 위치를 자동 제어해 탐사 케이블을 정해진 수심에 유지하는 핵심 측위 장비 | DIGICOURSE社(현 ION/Geospace 계열) 5011-E 'BIRD'. **'NON EXPORT CONTROLLED'**=비수출통제(전략물자 비해당) 명시. HS 9015(측량/수로/해양/지구물리 측정기기). 외국 선박용품 적재허가(p97): 화물관리 26ACZ3428410012, ZZZZ9015, 3 CT, 38.00 KG, 13,600 US$, MAIN DECK. 신청 (주)코엔스(대표 김영철), 목적항 RUVVO(Vladivostok) | SHIP SPARES / DIGICOURSE 5011-E BIRDS (p97) | 3 CT (38.00 KG, 13,600 US$) |

---

## 전장 결선·전기 소부품 (p60 SAPFIR RADIO INVENTORY 묶음)

> p60 COENS GLS DELIVERY NOTE(RADIO INVENTORY, MGCB-000877, RV SAPFIR)의 전선 결선·절연·공구류 13라인. 러시아 원문 병기. 카테고리는 D(전자·전기전장) 주축 + 일부 A(화학)·E(공구). 행 밀도 유지 위해 본 묶음으로 별도 수록.

| 아이템명/개념 (원문 병기) | 분류 | 선박 내 용도·사용처 | 상세·검증 | 수량/비고 |
|---|---|---|---|---|
| **PF 프리미엄 부품 크림퍼 통 픽스처** (PF Premium Parts Crimper Tong Fixture / Зажим средний — 1차 PP 정정) | E 공구 | SAPFIR 전기/통신 배선 단자 압착 작업용 수동 크림핑 공구(집게형). 전선 터미널 결선 | 러시아 원문 'Зажим средний'(중간 집게). **PF**(검증: 1차 'PP' 오기, 두 번째 글자 F). p60 1-1 | 2 PCS |
| **Y형 단자 PG 압착 터미널 460PCS 세트 + 스피커 단자** (Y Terminal PG Crimp Terminal 460PCS Set Speaker Terminal Car Electrical) | D 전장 | SAPFIR 전장/오디오 배선 결선용 Y형(포크형) 압착 단자 세트 + 스피커 단자 | 러시아 원문 'Набор обжимных наконечников'. 460개입 세트. p60 1-2 | 1 SET (460 PCS) |
| **방수 열수축 솔더 슬리브 커넥터 200개 세트** (Webermol Waterproof Heat Shrink Soldering Sleeve Connector Wire, Mixed Color, 200pcs — 1차 Webermot 정정) | D 전장 | SAPFIR 전선 접속부 방수·절연 결선용. 내부 솔더링이 든 열수축 슬리브, 가열 시 납이 녹아 결선·수축 방수 절연. 습기·해수 환경 배선 보수 | 러시아 원문 'Набор термоусадочных втулок'. 브랜드 **Webermol**(검증: 1차 'Webermot' 오기, 끝 l). p60 1-3 | 1 SET (200 pcs) |
| **Wago 221-412 레버형 와이어 커넥터** (Wago Connector 221-412, 0.2~4SQ, 450V 32A / Клеммы WAGO 221-412) | D 전장 | SAPFIR 전기 배선 분기/접속용 레버형(Lever-Nuts) 콤팩트 커넥터. 공구 없이 레버로 전선 고정. 2도체 타입 | 적용 전선 0.2~4SQ(mm²), 정격 450V 32A. **발주단위 1 SET**(검증: QTY 컬럼=1 SET, 25개는 1세트 내 구성수). p60 1-4 | 1 SET (구성 25 pcs) |
| **Wago 221-613 고용량 3포트 레버형 커넥터** (Wago Connector 221-613 High Capacity 3P, 1Box 30pcs / WAGO 221-613) | D 전장 | SAPFIR 전기 배선 3선 분기/접속용 고용량 레버형 커넥터. 굵은 전선(고전류) 결선 | 3-conductor 레버 커넥터, 6mm² 대용량. **발주단위 1 SET**(검증: QTY 컬럼=1 SET, 30개는 1세트 내 구성수). p60 1-5 | 1 SET (구성 30 pcs) |
| **3M 자기융착 고무 절연 테이프 (19mm×9m)** (Scotch 3M Self Bonding Rubber Tape 0.76×19×9 / Сырая резина) | A 화학 | SAPFIR 전기 절연·방수 마감용 자기융착(self-bonding) 고무 절연 테이프. 케이블 접속부를 감아 자체 융착 밀봉·절연(염해 배선 보호) | 러시아 원문 'Сырая резина'(생고무). 두께 0.76mm × 폭 19mm × 길이 9m. p60 1-6 | 2 PCS |
| **록타이트 495 순간접착제 (저점도, 20g)** (Krell Loctite 495, low viscosity, 20g / Клей Loctite 495) | A 화학 | SAPFIR 소형 부품 순간 접착/보수용 시아노아크릴레이트계 저점도 순간접착제. 다공성·정밀 표면 접합. 정비 범용 | Loctite 495(Henkel 범용 인스턴트 접착제), 저점도, 20g 병. p60 1-7 | 2 PCS (20g) |
| **TTN 파이어 캠핑 토치 (미니 충전식 가스 토치)** (TTN Fire Camping Torch Mini Torch, Rechargeable, Red / Зажигалка для термоусадочной трубки) | E 공구 | SAPFIR 열수축 튜브 가열·납땜 보조·점화용 휴대용 미니 토치. 원문 용도 '열수축 튜브용 라이터' — 전장 배선 마감 가열 도구 | 러시아 원문 'Зажигалка для термоусадочной трубки'(열수축 튜브용 점화기). 충전식, Red. p60 1-8 | 1 PCS |
| **LED COB 충전식 작업등/캠핑 랜턴 (자석 픽업툴)** (LED Flashlight COB Rechargeable Camping Lantern Work Light Magnetic Pickup Tool / Фонарик LED) | D 전장 | SAPFIR 정비·야간 작업용 휴대 COB LED 작업등 겸 캠핑 랜턴. 자석 부착·픽업툴, 충전식. ★주문 0(쿠팡 판매자 취소·미공급) | 러시아 원문 'Фонарик LED'. REMARK 'Cancelled by the Coupang seller'(판매자 취소). p60 1-9 | 0 PCS (취소·미공급) |
| **이모셔널 컬러 1구 멀티탭/연장코드 (16A)** (Emotional Color 1 Burner Electric Extension Cord Camping Power Strip 16A / Удлинитель 5м) | D 전장 | SAPFIR 선내 전원 연장용 멀티탭/연장 코드(5m). 16A 정격. 작업·캠핑용 콘센트 확장('1 Burner'=1구 소켓 추정) | 러시아 원문 'Удлинитель 5м'(연장선 5m). 길이 5m, 16A. p60 1-10 (판독 불확실: 1구 여부) | 1 PCS (5m, 16A) |
| **현대전기 하이탭 4구 멀티탭 (2800W, 과부하차단·접지)** (Hyundai Electric High Tab 4-Burner 2800W Overload Shut-off Grounding Power Strip / Сетевой фильтр 5м) | D 전장 | SAPFIR 선내 전원 분배용 4구 멀티탭(서지/노이즈 필터 겸, 5m). 2800W 과부하 차단·개별 스위치·접지 안전형. 다수 전장기기 동시 급전 | 러시아 원문 'Сетевой фильтр 5 м'(서지 필터/멀티탭 5m). 2800W, 4구, 5m, 과부하차단·접지. p60 1-11 | 3 PCS (5m, 2800W) |
| **Dymo PnP 7.4V 라벨프린터용 배터리** (Battery for Dymo PnP label printer 7.4V / Аккумулятор для этикет-принтера Dymo PnP 7,4v) | D 전장 | SAPFIR 다이모(Dymo) 라벨프린터 전용 교체 배터리(7.4V 충전지). 케이블·기기 라벨링 작업용 프린터 전원. ★주문 0(구매 불가·미공급) | 러시아 원문 'Аккумулятор для этикет-принтера Dymo PnP 7,4 v'. Dymo PnP(Plug-n-Play)용 7.4V 리튬 배터리. REMARK 'Unable to purchase'. p60 1-12 | 0 PCS (구매불가·미공급) |
| **247 만능 청소 솔/브러시 (키보드·LCD, 2개입)** (247 Brush Cleaner Keyboard LCD All-Purpose Dust Brush, Black, 2 Pieces / Щётка для чистки пыли с аппаратуры) | E 위생 | SAPFIR 무선/전자장비(키보드·LCD·계측기) 미세 먼지 청소용 만능 청소 솔. 라디오/전장 장비 유지보수 위생 | 러시아 원문 'Щётка для чистки пыли с аппаратуры'(장비 먼지 청소솔). 검정 2개입. p60 1-13 | 1 SET (2 Pieces) |

### ※ p60 서비스·수수료 (제외)

| 항목명 (원문) | 성격 | 출처 p |
|---|---|---|
| HANDLING CHARGE | 화물 취급 수수료(용역) | p60 (1 LOT) |
| TRANSPORTATION | 본선 배송 운임(용역) | p60 (1 TRIP) |

---

## ※ 배치 전역 서비스·수수료·운임 항목 (물품 아님) — 분리표

| 항목명 (원문) | 성격·내용 | 출처 p | 수량 |
|---|---|---|---|
| TRANSPORTATION / Delivery to the vessel | 본선까지 배송 운송 서비스 | p53·54·64·75(DELIVERY CHARGE)·80·82·83·88·90·96 (각 1 TRIP/EA) | 다건 |
| HANDLING CHARGE | 화물 추적·수령·분류·팰릿 등 취급 수수료 | p60·88 | 2 LOT |
| Customs duties & VAT / International T/S / Delivery charge | 관세·부가세·국제 환적·배송료(p56 LOCKS 노트) | p56 | 각 1 |
| 항공/특송 운임 (AWB·WPX Freight) | SWISS WORLD CARGO EUR 7191(p58) / Turkish AWB EUR 317.50(p69) / DHL 10,200 USD(p67·68) / WPX 320 USD 신고가(p100) | p58·67·68·69·100 | — |
| PROVISION / DRINKING WATER 운송(TRANSPORTATION) | 식료품·식수 본선 배송(p82·83 거래명세서 운송 라인) | p82·83 | 각 1 TRIP |

---

## 페이지 회계 (p51~100 전수, 누락 0)

| p | 문서종류 | 선박 | 품목 유무·사유 |
|---|---|---|---|
| 51 | AWB(WPX/DHL P Express Worldwide 48) | NIKOLAY TRUBYATCHINSKY(직인) | 솔레노이드 밸브 1건(배관·유압) |
| 52 | 내국 선박용품 적재허가(신청)서(부산세관) | ALMAZ | VHF 무전기 ICOM IC-F2100DS(p55와 통합) |
| 53 | DELIVERY NOTE(COENS GLS) | ALMAZ | 라이프부이 야광부이(안전·구명) + TRANSPORTATION(용역) |
| 54 | DELIVERY NOTE(COENS GLS) | AKADEMIK KAZANIN→ALMAZ | Vanish 세제(E) + Delivery(용역) |
| 55 | DELIVERY NOTE(COENS GLS) | ALMAZ | VHF 무전기(p52와 통합) + Delivery(용역) |
| 56 | DELIVERY NOTE(COENS GLS) | RV ALMAZ | TrioVing 자물쇠(E) + International T/S·Customs·Delivery(용역·세금) |
| 57 | 외국 선박용품 적재허가(신청)서 | RV SAPFIR | 실린더 헤드(C, p58과 통합) |
| 58 | AWB(SWISS WORLD CARGO 724-87082412) | RV SAPFIR | 실린더 헤드(C, p57과 통합) + EUR 운임(용역) |
| 59 | 내국 선박용품 적재허가(신청)서 | RV SAPFIR | VEGETABLE CUTTER 외 38종(E) |
| 60 | DELIVERY NOTE(RADIO INVENTORY) | RV SAPFIR | 전장 결선·소부품 13라인(D/A/E) + HANDLING·TRANSPORTATION(용역) |
| 61 | DELIVERY NOTE 서명/합계 연속장(P2/2) | MAGE(선명 미기재, 직인만) | **품목 無** — 직전 노트 서명·합계장(Sub/Grand Total 공란, Dave Yun 서명, 러시아 직인) |
| 62 | DELIVERY NOTE(KITCHEN APPLIANCE P1/3) | M/V SAPFIR | 밥솥류(D) + 조리기구·주방잡화(E) + 침구류(E) 다수(p62~64 통합) |
| 63 | DELIVERY NOTE(KITCHEN APPLIANCE P2/3) | M/V SAPFIR | 침구류 연속(E) |
| 64 | DELIVERY NOTE(KITCHEN APPLIANCE P3/3 서명/합계) | M/V SAPFIR | 침구류 연속(E) + TRANSPORTATION(용역) |
| 65 | 외국 선박용품 적재허가(신청)서 | ALMAZ | 연료필터(C, SHIP SPARES/FUEL FILTER, HS 8421) |
| 66 | 외국 선박용품 적재허가(신청)서 | ALMAZ(직인) | 샤프트 커플링 CENTAX CM70(C, p67·68·72~74 통합) |
| 67 | WPX/DHL AWB 라벨 | ALMAZ | 샤프트 커플링(통합) + 10,200 USD 운임 |
| 68 | WPX/DHL Waybill Doc | ALMAZ | 샤프트 커플링(통합) |
| 69 | AWB(Turkish Airlines 235 SOF 35450295) | ALMAZ(직인) | 선박 예비부품 일괄(C) + EUR 317.50 운임 |
| 70 | IATA AWB 뒷면 운송계약 책임제한 약관 | — | **품목 無** — 법적 약관 전용 페이지 |
| 71 | Commercial Invoice(St Marine, Nr.0000000166) | MAGE(C/O COENS GLS) | 엔진예비품 13종(C, 푸시로드 2라인·노즐라인·O링×3·스프링·실·연료필터 3종) |
| 72 | Commercial Invoice(Mega Tech, EXP-1) | (BUSAN, →ALMAZ) | 샤프트 커플링(C, p66~68·73·74 통합) |
| 73 | Packing List(Mega Tech, EXP-1) | (BUSAN, →ALMAZ) | 샤프트 커플링(통합) |
| 74 | Shipper's Non-Hazardous Cargo Cert | (→South Korea) | 샤프트 커플링(통합) |
| 75 | DELIVERY NOTE(COENS GLS) | M/V ALMAZ | 구동 벨트 DAYCO(C) + DELIVERY CHARGE(용역) |
| 76 | 내국 선박용품 적재허가(신청)서 | NIKOLAY TRUBYATCHINSKY | BLUE GUN(E) — 신청 DIVE & DERBO |
| 77 | DELIVERY NOTE(PANEL METER·PRESSURE SENSOR) | AKADEMIK KAZANIN→NIKOLAY 전달 | 패널미터 SPPM-35-C(D)·USB케이블 SPPM-CA(D) + 압력센서 DMP 333(CANCELLED, 0 PCS) |
| 78 | DELIVERY NOTE(ELECTRICAL ITEMS) | NIKOLAY TRUBYATCHINSKY | 정류기·다이오드·콘센트박스·콘센트·글루건(D/E) |
| 79 | DELIVERY NOTE(BATTERIES) | NIKOLAY TRUBYATCHINSKY | AAA 에너자이저 건전지(D) |
| 80 | DELIVERY NOTE(AIR BLOWER) | SAPFIR | 에어블로어·CR2032·건전지·써멀MX-6·서지보호기(D) + SS클램프(배관·유압) |
| 81 | 내국 선박용품 적재허가(신청)서 | NIKOLAY TRUBYATCHINSKY | **부식 제외** — '잡화류(잡곡포함)' 110 PCS 통관 합산 라인(실내용물 PROVISION 식료품) |
| 82 | DELIVERY NOTE(COENS GLS) | NIKOLAY TRUBYATCHINSKY | **부식 제외** — PROVISION(1) 식료품 일괄 + TRANSPORTATION(용역) |
| 83 | DELIVERY NOTE(COENS GLS) | NIKOLAY TRUBYATCHINSKY | **부식 제외** — DRINKING WATER(2) 식수 + TRANSPORTATION(용역) |
| 84 | PROVISION 가격표/오더리스트(NO 1~42) | NIKOLAY TRUBYATCHINSKY | **부식 제외** — 식료품 42종(채소·과일·육류·치즈·연어 등) |
| 85 | PROVISION 가격표/오더리스트(NO 43~83) | NIKOLAY TRUBYATCHINSKY | **부식 제외** — 식료품 41종(초콜릿·콜라·베이컨·버터·스파게티·식빵 등) |
| 86 | PROVISION 오더리스트(러·영·한, CODE 84~109) | NIKOLAY TRUBYATCHINSKY | **부식 제외** — 식료품 26종(돈육·계육·소시지·라바쉬·약과·달고나 등) |
| 87 | PROVISION 오더리스트(연속, DRINKING WATER + 서명/직인) | NIKOLAY TRUBYATCHINSKY | **부식 제외** — 2LTR 생수 900 EA(식수) + Babin A. 서명·무르만스크 직인 |
| 88 | DELIVERY NOTE(COENS GLS, PRINTER 프록시) | M/V ALMAZ | Kyocera Ecosys MA4000FX·MA2600cfx·TK-1285 토너·TK-5455 4색토너세트(D) + HANDLING·TRANSPORTATION(용역) |
| 89 | 내국 선박용품 적재허가(신청)서 + 부산세관 직인 | SAPFIR(=SAPHIR, 입항 25JPGLA0591) | 작업복·안전화 WORK SUIT/SAFETY SHOES(E, p91 추정 연결) |
| 90 | DELIVERY NOTE(COENS GLS, LUBRICATION) | M/V SAPFIR(=SAPHIR) | EPPCO GOLD EP2 그리스(C, 2 PAIL) + TRANSPORTATION(용역) |
| 91 | DELIVERY NOTE(COENS GLS) | M/V SAPFIR | 작업복 상하의 세트·여름 안전화(E) |
| 92 | 내국 선박용품 적재허가(신청)서 | NIKOLAY TRUBYATCHINSKY(UBIQ6) | BATTERY 외 5종 일괄(D, 6 PCS, HS 8409) — D표 1행 수록 |
| 93 | DELIVERY NOTE(DANFOSS·SCHNEIDER) | M/V FEDOR KOVROV(→NIKOLAY 인도) | 압력스위치·온도릴레이·보조접점 3종(D) |
| 94 | DELIVERY NOTE(AGM BATTERIES) | M/V FEDOR KOVROV | AGM 축전지 TITAN 85.1(D) |
| 95 | DELIVERY NOTE(FILTERS) | M/V FEDOR KOVROV | Cummins 연료필터·Fleetguard 오일필터(C) |
| 96 | DELIVERY NOTE(O-RING·COPPER WASHER) | M/V FEDOR KOVROV | O링 세트·구리와셔 세트(E) + TRANSPORTATION(용역) |
| 97 | 외국 선박용품 적재허가(신청)서 | NIKOLAY TRUBYATCHINSKY | DIGICOURSE 5011-E BIRDS(탐사장비, HS 9015) |
| 98 | 외국 선박용품 적재허가(신청)서 | NIKOLAY TRUBYATCHINSKY | 디스차지 밸브(배관·유압, p100과 통합) |
| 99 | 외국 선박용품 **하선**허가(신청)서 | NIKOLAY TRUBYATCHINSKY | 엔진 블록 피스톤 어셈블리(C, 하선) |
| 100 | WAYBILL DOC(WPX/DHL) | AKADEMIK KAZANIN(STELLA AIM 경유) | 진공 기기(D) + 디스차지 밸브(p98과 통합) |

- **품목 페이지**: 41개 (p51~60, 62~69, 71~80, 88~100)
- **비품목 페이지**: 2개 — p61(서명/합계 연속장), p70(AWB 뒷면 약관). 부식 전용 7p(p81~87)는 **부식 제외**로 별도 분류
- **부식(식료품·식수) 제외 페이지**: p81~87 (7p) — PROVISION/DRINKING WATER 식료품·식수 **112건** 집계 후 전면 제외 (p84:42 + p85:41 + p86:26 + p87:1[생수] + p82 PROVISION 라인 + p83 DRINKING WATER 라인 = 112)
- **누락 0**: 50/50 페이지 전수 설명 완료

---

## 배치 02 통계

- **비식품 표준품목 표 행 99행** (카테고리별: C 기관예비품 **21행**(p65 연료필터 추가) / D 전자·전기전장 **26행**(p88 토너 분리 +1, p92 BATTERY 외 5종 +1) / E 공구·위생·선용품 **33행**(조리기구 18행 개별 전개 포함) / 배관·유압 **4행** / 안전·구명 **1행** / 탐사장비(지질·해저) **1행** / p60 전장 결선묶음 **13행**). 항해·통신(VHF 무전기 1건)은 D 표에 수록한 중복 분류(별도 카운트 안 함). 서비스·수수료 행(D 2행 + p60 2행 + 전역 분리표 5행)은 물품 아님 → 별도.
  - ※ 침구류만 동일품의 색상·패턴 변형을 1행으로 통합(듀벳커버 6라인 1행, 베갯잇 4라인 1행, 피티드시트 4라인 1행 — 중복통합 칸에 변형 보존). 조리기구는 개별 품목이므로 전개. 라인 환산 시 약 110여 라인.
- **부식(식료품·식수) 제외 112건** (p81~87, PROVISION/DRINKING WATER)
- **처리량**: p51~100 = 50/50p 완료. **누적 100/215p** (batch-01 50p + batch-02 50p)
- **신규 선박**: **ALMAZ**(M/V ALMAZ, IMO 9150024, 무르만스크) · **FEDOR KOVROV**(M/V FEDOR KOVROV — 수취 후 NIKOLAY TRUBYATCHINSKY 전달건 포함). 기존 NIKOLAY TRUBYATCHINSKY·AKADEMIK KAZANIN·SAPFIR(=SAPHIR) 지속 등장
- **공급망**: 발송 St Marine Equipment(불가리아/상하이)·Mega Tech Marine Services(인도)·St Marine Equipment/Airsip → 운송 SWISS WORLD CARGO·Turkish Airlines·WPX/DHL → 대행 COENS GLS·(주)코엔스·더마린코리아·DIVE & DERBO / 부산세관 적재·하선 허가
- **누적 비식품 표준품목 개략**: batch-01 104행 + batch-02 99행 = **약 203행 누적** (전역 dedup·서비스 분리 후. 침구 색상변형만 통합, 그 외 개별 전개)
- **다음**: Codex 교차검수 → batch-03(p101~)

---

## 적용 정정·통합 요약 (검증 반영 로그)

### 주요 정정(verify.corrections 반영) — 핵심 13건
1. p51 솔레노이드밸브 — 선박 NIKOLAY TRUBYATCHINSKY(직인), shipper St Marine **Equipment**(Engineering 오기)
2. p53 야광부이 — 인증 'QD 10L, MED certified'(환각 'SOLAS·IMO' **삭제**)
3. p54 Vanish — 'C 750ml*2/SET'(1차 *3 오기), SET 환산 불명 보수 기재
4. p57/58 실린더헤드 — 금액 **111,740 US$**(외국 적재허가 양식 US$ 표기 — 금액 컬럼·합계라인 US$ 사전인쇄, 내국 양식 ₩과 대조)
5. p60 전장묶음 — PP→**PF** Crimper / Webermot→**Webermol** / Wago 221-412·221-613 **1 SET**(구성 25·30개)
6. p66/69 — 전 선박 **ALMAZ**(1차 AKADEMIK KAZANIN·NIKOLAY·SAPFIR 추정 → ALMAZ 직인 확정), 수하인 COENS **GLS**(BLG 오독)
7. p69 — AWB **235 SOF 35450295**(끝자리), 중량 87.7kg, 운임 **EUR 317.50**(USD 아님), 치수 cms
8. p71 — Push rod 1610-005 **2개 독립 라인 분리**(9번 라인 qty3·EUR630 누락 복구, 검산 EUR 6,599.44 일치)
9. p77 — 패널미터 SPRM→**SPPM-35-C**
10. p78 — 정류기 SKB/L 28B→**SKB1.2/08**(1.2A, 수량 3), 다이오드 수량 **2**, 콘센트/글루건 메모 'Local alternative'(1/3 오독)
11. p80 — 클램프 **7.9mm**(100EA/PKT), 써멀 **MX-6**(4g), 서지보호기 **SPG5-B3**
12. p93 — Danfoss 압력스위치 코드 **060-1101**, Danfoss/Schneider 3종 카테고리 **D 통일**
13. p98 — 디스차지밸브 HS **3926**(플라스틱류 신고), p100 WPX와 통합

### dedup 통합(전역) — 핵심
- **SHAFT COUPLING CENTAX CM70**: p66·67·68·72·73·74 6개 페이지 → **1행 통합**(청구·운송·송장·패킹·비위험증명 분산 기재, 70kg/USD 10,200 동일 선적)
- **실린더 헤드**: p57(적재허가)·p58(AWB) → 1행
- **ICOM IC-F2100DS 무전기**: p52(세관)·p55(거래명세서) → 1행
- **디스차지 밸브**: p98(적재허가)·p100(WPX) → 1행

### 검증 추가(verify.additions)
- p71 **Push rod 1610-005 (2차 라인, 도면군 MG020326SAP1, qty 3, EUR 210)** 별도 행 추가

### 적대검수 R2 정정(원본 재판독 권위 — 외과적 반영)
- **p65 연료필터 누락행 추가**(BLOCK): 외국 적재허가서 'SHIP SPARES/FUEL FILTER' ALMAZ 3 CT/71.70KG/USD 4,618/HS 8421/화물관리 26TKZ75142100120002 — C표 신규 1행(p71·p95 필터와 선박·통화·문서 전부 상이, dedup 아님). → **C 20→21행**
- **p92 BATTERY 외 5종 누락행 추가**(MAJOR): 내국 적재허가서 'BATTERY 외 5종' NIKOLAY(UBIQ6) 6 PCS/35KG/792,220원/HS 8409 — p59 'VEGETABLE CUTTER 외 38종'과 동일한 요약행 처리로 D표 신규 1행. → **D +1**
- **p88 프린터 전면 정정**(BLOCK): Epson XM4000FX/XM2400Sx → **Kyocera Ecosys MA4000FX/MA2600cfx**(레이저 MFP, 잉크젯 아님). TV-1295 텔레비전/모니터 → **Kyocera TK-1285 흑백 토너 카트리지** 20 EA(D 사무소모품, TV 용도 환각 전면 삭제). 1-4 별도행 **Kyocera TK-5455 4색 컬러토너세트(대체품·비정품)** 20 SET 분리. Ref No **G→Q**(Q-CGLS-FO-MS-260326-00-Rev.01). 'Sx/Tx 끝자리 불확실' 검증노트 삭제. → **D +1**(토너세트 분리)
- **p76 BLUE GUN 전면 정정**(BLOCK): 'FULL BASE BR100E BLUE GUN/잠수·해저 용도' → **FULL WAVE BRIDGE GLUE GUN**(글루건/핫멜트 접착건). BR100E·BASE·BLUE 환각 삭제, 잠수·해저 용도 환각 삭제. 치수 25×20×30→**20×20×30CM**, 신고가 '8409 불명확' → **52,000원(KRW), HS 8409, 2.00KG**
- **p77 압력센서 정정**(BLOCK): 모델 'DNPF 35X-D1608er' → **DMP 333**(BD Sensors), 수량 6 → **0 PCS(CANCELLED)**, Accuracy 0.5% → **0.35% FS(11-12bit)**. USB케이블 EPPM-CA → **SPPM-CA**(SPPM 접두 정합). 선박 라우팅 **AKADEMIK KAZANIN 수취 → NIKOLAY 전달** 보강. (b04 p170 DMP333과 동일종류 → 분류 D 통일 권고 주석)
- **p80 정정**: Duracell LR-6 AA **14→24 PCS**, 에어블로어 D/N **…260409→…260408-00**
- **p90 그리스 정정**(BLOCK): 수량 1→**2 PAIL**, 'LUBRICATION MSDS-000705 SAPHIR' → **MGCB-000703 SAPFIR**(DN-CGLS-MS-260424-00, Ref Q-CGLS-FO-MS-260414-00-Rev.00)
- **p89 작업복 정정**: 단가 3.00 → **중량 3.00KG**, 금액 **87,560원** 명기, HS 8409 분리, 신청 '김정원' → **더마린코리아 대표 김정문**, 입항 **25JPGLA0591**, 품목 **ZZZZ0001**, '25/15 불확실' 삭제. p91 DELIVERY NOTE와 dedup 추정(2 PCS=작업복1 SET+안전화1 PAIR) 주석
- **p62 도마**: 1-8 단위 **PCS→KIT**(3행 모두 1 KIT 통일)
- **페이지회계 요약**: 품목 페이지 **47→41개**, 비품목 **3→2개(p61,p70)**(부식 7p 별도)
- **통계 재집계**: C 20→21, D 24→26(토너분리+BATTERY), **총 96→99행**, 누적 약 200→**약 203행**
