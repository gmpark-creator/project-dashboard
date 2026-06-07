# 35 · Claude R27 — 비용 모델 3중 불일치 (Codex blocker, UI 무변경)

> 2026-06-08 · Claude(Opus 4.8) · 야간 자율 슬라이스 #5 · [[33]] 후속
> 성격: 검증/블로커 기록. **코드 변경 없음**(보수적 결정). 백로그 "cost/estimate 연결" 항목의 결론.

## 동기

백로그 후보였던 `POST /api/cost/estimate`(read-only) 연결을 검토하던 중, 생성 버튼의 하드코딩 비용이 실제와 맞는지 경험적으로 검증함. 그 결과 **표시값·estimate 엔드포인트·실제 예약(reserved) 세 값이 서로 어긋남**을 발견.

## 검증 데이터 (로컬 dev :3020 mock, reserved 델타 측정)

| 액션 | UI 표시 | `cost/estimate` | 실제 예약(reserved 델타) | 평가 |
|---|---|---|---|---|
| 이 컷 생성 (generateShot, takeCount 3) | 18⚡ | **54⚡** | **18⚡** | UI=실제 ✓ · estimate가 takeCount만큼 ×3 과대 |
| 전체 생성 (generateAll, 10컷) | **96⚡**(초기 하드코딩) | 96⚡ | **180⚡**(=18×10) | UI·estimate flat · 실제는 컷당 18 스케일 → **컷 많으면 과소표시** |
| 이미지 후보 (createImageJob) | 24⚡ | 24⚡ | count4→**16**, count2→**24** | 예약이 count에 **비선형/비단조** |
| 이 컷만 다시 (regenerate) | 12⚡ | 12⚡ | 12⚡(추정 일치) | 일치 |
| 게시용 품질 (upgradeTake) | 22⚡ | 22⚡ | — | estimate 일치 |

추가 관찰: mock 크레딧은 **프로젝트별이 아닌 전역 풀**(reserve→capture→refund). 완료 후에도 reserved가 즉시 해제되지 않고 spent가 누적됨 → 표시 비용이 "예상 확정(capture)"인지 "예약(hold)"인지 계약상 단일 기준이 불명확.

## 결론 — 3중 불일치, Codex 소유

`cost/estimate`(엔진) · 실제 reservation 로직 · UI 하드코딩 표시값이 **서로 다른 수**를 낸다. 특히:
1. `cost/estimate`의 generateShot은 takeCount를 곱해 실제 예약(18)의 3배(54)를 반환.
2. generateAll 실제 예약은 컷당 18로 스케일(10컷=180)하지만 UI·estimate는 flat 96.
3. createImageJob 예약은 count에 비선형.

→ **단일 권위 기준이 없다.** 어느 쪽이 "사용자가 실제 청구받는 값"인지 백엔드 코스트 모델(reserve/capture/refund·margin·전역 풀)을 모르면 단정 불가.

## 결정 (보수적)

- **UI 비용 표시를 변경하지 않음.** reservation 추정만 보고 표시값을 바꾸면 오히려 "capture 기준"과 어긋나 더 틀릴 수 있음. 사용자 노출 비용을 근거 불충분하게 바꾸는 것은 P6를 더 악화시킬 위험.
- **`cost/estimate`를 UI에 연결하지 않음.** 실제 예약과 어긋나므로(특히 generateShot ×3) 연결 시 표시 정확도가 오히려 나빠짐. → 백로그 "cost/estimate 연결" 항목은 **연결 안 함으로 종결**.
- 흥미롭게 코드의 generateAll **부분 재생성** 공식 `generatableShots.length * 18`은 실제(컷당 18)와 일치 — 즉 per-shot 단가 자체는 18로 코드 곳곳에서 일관. 어긋나는 건 generateAll **초기값 하드코딩 96**(flat)뿐이지만, 이것도 표시=capture인지 표시=hold인지 코스트 모델 확정 전엔 손대지 않음.

## Codex가 해야 할 일 (blocker)

1. **단일 권위 비용 함수 정의**: 주어진 액션·파라미터(takeCount/count/shot 수)에 대해 "사용자가 실제 확정 청구받을 값"을 반환하는 하나의 추정. `cost/estimate`가 reservation과 일치하도록 정렬(generateShot ×takeCount 과대 제거, generateAll 컷 수 반영, image count 단가 정합).
2. 그 값을 UI가 액션별로 표시·차감 안내에 쓸 수 있게 노출(export처럼 render-preview.estimate를 쓰는 패턴을 다른 액션에도 확장 가능).
3. 정렬 완료되면 Claude가 생성/이미지/재생성 버튼의 비용 라벨을 그 권위값으로 교체(현재 하드코딩 대체) — **그 시점에 안전하게 가능**.

## 검증 명령

reserved 델타·estimate·capture를 `curl`로 직접 측정(위 표). 코드 변경이 없어 typecheck/test 등은 직전 슬라이스(R26) GREEN 상태 유지.
