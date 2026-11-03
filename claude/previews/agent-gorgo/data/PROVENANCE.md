# 지도 데이터 출처 (PROVENANCE)

- 원천: **OpenStreetMap** — © OpenStreetMap contributors (https://www.openstreetmap.org/copyright)
- 라이선스: `data/busan-osm.js` 는 OSM 유래 Derivative Database → **ODbL 1.0** (https://opendatacommons.org/licenses/odbl/1-0/)
- 범위(bbox): 34.98–35.25°N, 128.74–129.20°E (진해 신항 서컨테이너부두 ~ 해운대·송정)
- 투영: 등거리 원통, 300×214 타일, 1타일 ≈ 140m — `x=(lon−128.74)/0.46×300`, `y=(35.25−lat)/0.27×214`
- 재현: `node tools/osm-fetch.mjs <RAW_DIR>` → `node tools/osm-to-grid.mjs <RAW_DIR>` (원시 응답은 레포에 넣지 않음, 이 두 스크립트가 변환 수단)
- 변환: 해안선 장벽 + 남쪽 바다 시드 flood fill(4× 슈퍼샘플) → 강·호수 짝홀 채우기(25% 이상이면 강) → 토지이용(주거·상업/산업·항만/농지) → 산림 → 간선 도로(motorway·trunk·primary + secondary 다리) Douglas–Peucker ε=0.35타일 → 부산광역시 경계(선 + 안팎 마스크) → 산봉우리
- 게임 코드(js/)와 코드로 그린 그림(캐릭터·건물·타일)은 OSM 데이터를 포함하지 않으며 ODbL 대상이 아님.

## 조회 기록
| 레이어 | 조회 시각(UTC) | 요소 수 | 엔드포인트 |
|---|---|---|---|
| coastline | 2026-11-03T07:28:31.228Z | 185 | https://overpass-api.de/api/interpreter |
| water | 2026-11-03T07:29:01.847Z | 312 | https://overpass-api.de/api/interpreter |
| forest | 2026-11-03T07:29:40.155Z | 540 | https://overpass-api.de/api/interpreter |
| landuse | 2026-11-03T07:30:22.970Z | 2096 | https://overpass-api.de/api/interpreter |
| roads | 2026-11-03T07:31:15.192Z | 4373 | https://overpass-api.de/api/interpreter |
| boundary | 2026-11-03T07:31:57.012Z | 1 | https://overpass-api.de/api/interpreter |
| peaks | 2026-11-03T07:32:31.966Z | 187 | https://overpass-api.de/api/interpreter |

## 쿼리 원문
### coastline
```
[out:json][timeout:180];way["natural"="coastline"](34.98,128.74,35.25,129.20);out geom;
```

### water
```
[out:json][timeout:180];(way["natural"="water"](34.98,128.74,35.25,129.20);relation["natural"="water"](34.98,128.74,35.25,129.20);way["waterway"="riverbank"](34.98,128.74,35.25,129.20);relation["waterway"="riverbank"](34.98,128.74,35.25,129.20););out geom;
```

### forest
```
[out:json][timeout:240];(way["landuse"="forest"](34.98,128.74,35.25,129.20);relation["landuse"="forest"](34.98,128.74,35.25,129.20);way["natural"="wood"](34.98,128.74,35.25,129.20);relation["natural"="wood"](34.98,128.74,35.25,129.20););out geom;
```

### landuse
```
[out:json][timeout:240];(way["landuse"~"^(residential|commercial|retail|industrial|port|farmland)$"](34.98,128.74,35.25,129.20);relation["landuse"~"^(residential|commercial|retail|industrial|port|farmland)$"](34.98,128.74,35.25,129.20););out geom;
```

### roads
```
[out:json][timeout:180];way["highway"~"^(motorway|trunk|primary|secondary)$"](34.98,128.74,35.25,129.20);out geom tags;
```

### boundary
```
[out:json][timeout:180];relation["boundary"="administrative"]["admin_level"="4"]["name"="부산광역시"];out geom;
```

### peaks
```
[out:json][timeout:60];node["natural"="peak"]["name"](34.98,128.74,35.25,129.20);out;
```
