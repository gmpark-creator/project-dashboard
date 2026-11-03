/* =========================================================================
   AGENT GORGO WORLD — 부산 맵 생성기 (순수 데이터, 브라우저/노드 공용)
   좌표계: 타일 단위. x → 동(東), y → 남(南). 1타일 = 16px.
   실제 부산 지형을 '아기자기 데포르메'로 단순화한 배치다 (축척·좌표 정밀 아님).
   ========================================================================= */
(function (G) {
  'use strict';

  const W = 150, H = 90;
  const T = { DEEP:0, SHALLOW:1, GRASS:2, SAND:3, ROAD:4, PLAZA:5, FARM:6, FOREST:7, QUAY:8, BRIDGE:9, RIVER:10 };
  const WATER = new Set([T.DEEP, T.SHALLOW, T.RIVER]);

  function hash(x, y, s) {
    let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function pip(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  /* ---------- 육지 윤곽 (데포르메) ---------- */
  const LAND = {
    // 본토: 낙동강 동안(東岸) ~ 기장 방향 동해안
    main: [[38,0],[150,0],[150,38],[144,42],[138,47],[130,49],[121,49],[118,51],[115,51],[112,48],[106,47],[103,49],
           [100,51],[96,53],[93,57],[95,62],[97,66],[95,69],[90,68],[86,65],[83,61],[80,58],[77,56],[73,53],[70,53],
           [68,56],[66,59],[63,62],[59,63],[56,65],[52,68],[49,70],[47,66],[46,62],[43,61],[41,65],[40,70],[39,76],[38,76]],
    // 강서(낙동강 서안) + 신항
    west: [[0,0],[28,0],[28,40],[27,60],[28,70],[25,74],[20,77],[10,79],[4,78],[0,76]],
    // 을숙도
    eulsuk: [[31,61],[35,61],[35.5,72],[34.5,80],[32.5,82],[31,78]],
    // 영도
    yeongdo: [[60,66],[66,65],[72,65],[76,68],[76,73],[73,78],[69,81],[63,79],[60,75],[58,70]],
  };

  const FORESTS = [ // 산 [cx, cy, rx, ry]
    [64,7,15,7, '금정산'], [52,26,6,5, '백양산'], [87,40,5,4, '황령산'], [137,22,9,9, '장산'],
    [53,51,4,4, '구덕산'], [67,72,4,3, '봉래산'], [93,64,2.6,2.6, '이기대'], [9,11,8,8, ''], [20,4,6,4, ''],
  ];
  const FARMS = [[3,20,24,48], [4,50,22,62]];
  const PLAZAS = [ // [x0,y0,x1,y1] 도심 포장지대
    [65,33,76,42, '서면'], [104,36,115,46, '센텀시티'], [118,40,133,46, '해운대'], [59,53,68,60, '중앙동'],
    [68,46,75,52, '부산역'], [72,15,82,23, '동래'],
  ];
  const BEACHES = [[117,44,134,52], [95,48,105,56], [51,61,58,70], [38,67,44,79]];
  const QUAYS = [[75,53,84,59], [6,69,27,80], [41,57,47,64], [83,59,88,64]];

  const RIVERS = [ // 수영강
    { pts: [[97,0],[98,12],[99,22],[100,34],[101,44],[101.5,50]], r: 1.25 },
  ];
  const ROADS = [
    [[65,58],[67,52],[70,46],[71,38],[76,22],[78,4],[78,0]],                 // 중앙대로
    [[71,38],[80,33],[92,34],[104,40],[124,44],[138,41],[149,37]],             // 수영로 → 해운대
    [[67,51],[74,51],[80,54],[85,58],[90,59],[95,59],[101,59],[107,59],[112,59],[112,47]], // 북항 → 광안대교
    [[78,20],[100,24],[120,30],[126,44]],                                      // 동래 → 해운대
    [[118,47],[134,47]],                                                       // 해운대 해변로
    [[71,38],[60,40],[48,44],[40,44]],                                         // 서면 → 사하
    [[40,2],[40,58]],                                                          // 강변대로
    [[40,58],[42,72]],                                                         // 다대포
    [[40,50],[52,50],[60,55],[65,58]],                                         // 사하 → 중구
    [[24,30],[42,30]], [[24,56],[42,56]],                                      // 낙동강 다리 2
    [[16,75],[20,62],[24,56],[24,30],[22,6]],                                  // 강서 종단
    [[65,58],[64,67],[69,70],[71,76]],                                         // 영도대교 → 영도
    [[73,68],[89,68],[90,63]],                                                 // 부산항대교
    [[85,58],[88,48],[86,40]],                                                 // 남구 종단
    [[104,40],[108,41],[109,44]],                                              // 센텀 진입로
  ];

  function generate() {
    const g = new Uint8Array(W * H).fill(T.DEEP);
    const I = (x, y) => y * W + x;
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.DEEP : g[I(x, y)];
    const isWater = (x, y) => WATER.has(get(x, y));

    // 1) 육지
    const polys = Object.values(LAND);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const jx = (hash(x, y, 1) - 0.5) * 1.1, jy = (hash(x, y, 2) - 0.5) * 1.1;
      for (const p of polys) if (pip(x + 0.5 + jx, y + 0.5 + jy, p)) { g[I(x, y)] = T.GRASS; break; }
    }

    const stroke = (pts, r, fn) => {
      for (let k = 0; k < pts.length - 1; k++) {
        const [ax, ay] = pts[k], [bx, by] = pts[k + 1];
        const minx = Math.floor(Math.min(ax, bx) - r - 1), maxx = Math.ceil(Math.max(ax, bx) + r + 1);
        const miny = Math.floor(Math.min(ay, by) - r - 1), maxy = Math.ceil(Math.max(ay, by) + r + 1);
        const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
        for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
          if (x < 0 || y < 0 || x >= W || y >= H) continue;
          const cx = x + 0.5, cy = y + 0.5;
          let t = ((cx - ax) * dx + (cy - ay) * dy) / L2; t = Math.max(0, Math.min(1, t));
          const ex = ax + t * dx - cx, ey = ay + t * dy - cy;
          if (ex * ex + ey * ey <= r * r) fn(x, y);
        }
      }
    };

    // 2) 강
    for (const rv of RIVERS) stroke(rv.pts, rv.r, (x, y) => { if (get(x, y) === T.GRASS) g[I(x, y)] = T.RIVER; });

    // 3) 지대
    const inBox = (x, y, b) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3];
    const distWater = (x, y, R) => { for (let d = 1; d <= R; d++) for (let oy = -d; oy <= d; oy++) for (let ox = -d; ox <= d; ox++) if (isWater(x + ox, y + oy)) return d; return 99; };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.GRASS) continue;
      for (const f of FORESTS) {
        const nx = (x + 0.5 - f[0]) / f[2], ny = (y + 0.5 - f[1]) / f[3];
        if (nx * nx + ny * ny < 1 + (hash(x, y, 3) - 0.5) * 0.35) g[I(x, y)] = T.FOREST;
      }
      for (const b of FARMS) if (inBox(x, y, b) && hash(Math.floor(x / 4), Math.floor(y / 3), 4) < 0.55 && g[I(x, y)] === T.GRASS) g[I(x, y)] = T.FARM;
      for (const b of PLAZAS) if (inBox(x, y, b)) g[I(x, y)] = T.PLAZA;
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = get(x, y); if (WATER.has(t)) continue;
      for (const b of BEACHES) if (inBox(x, y, b) && distWater(x, y, 2) <= 2 && get(x, y) !== T.RIVER) g[I(x, y)] = T.SAND;
      for (const b of QUAYS) if (inBox(x, y, b)) g[I(x, y)] = T.QUAY;
    }

    // 4) 도로 (물 위면 다리)
    for (const r of ROADS) stroke(r, 0.95, (x, y) => { g[I(x, y)] = isWater(x, y) || get(x, y) === T.BRIDGE ? T.BRIDGE : T.ROAD; });

    // 5) 얕은 바다
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.DEEP) continue;
      let near = false;
      for (let oy = -2; oy <= 2 && !near; oy++) for (let ox = -2; ox <= 2; ox++) {
        const t = get(x + ox, y + oy); if (!WATER.has(t)) { near = true; break; }
      }
      if (near) g[I(x, y)] = T.SHALLOW;
    }

    /* ---------- 랜드마크 (업무 존 포함) ---------- */
    const landmarks = [
      { id:'office', kind:'office', name:'센텀시티 사무실', sub:'AGENT GORGO HQ', x:109.5, y:43, zone:true },
      { id:'immigration', kind:'immigration', name:'부산출입국·외국인청', sub:'BUSAN IMMIGRATION', x:62.5, y:57, zone:true },
      { id:'station', kind:'station', name:'부산역', x:71.5, y:50 },
      { id:'tower', kind:'busantower', name:'부산타워', x:60.5, y:61 },
      { id:'lh1', kind:'lighthouse', name:'오륙도 등대', x:96.5, y:68 },
      { id:'lh2', kind:'lighthouse', name:'태종대 등대', x:69.5, y:80 },
    ];
    const clearAround = (lx, ly, rx, ry) => (x, y) => Math.abs(x - lx) <= rx && y <= ly + 5 && y >= ly - ry;
    const reserved = landmarks.map(l => clearAround(l.x, l.y, l.kind === 'office' ? 4 : 3, l.kind === 'office' ? 6 : 4));
    const isReserved = (x, y) => reserved.some(f => f(x + 0.5, y + 0.5));

    /* ---------- 오브젝트 ---------- */
    const objs = [];
    const occ = new Uint8Array(W * H);
    const nearRoad = (x, y, r) => { for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) { const t = get(x + ox, y + oy); if (t === T.ROAD || t === T.BRIDGE) return true; } return false; };
    const free = (x, y, w, h) => { // w×h 타일 (발밑 기준 위쪽으로)
      for (let oy = 0; oy < h; oy++) for (let ox = 0; ox < w; ox++) {
        const tx = x + ox, ty = y - oy; if (tx < 0 || ty < 0 || tx >= W || ty >= H) return false;
        if (occ[I(tx, ty)] || isReserved(tx, ty)) return false;
      }
      return true;
    };
    const mark = (x, y, w, h) => { for (let oy = 0; oy < h; oy++) for (let ox = 0; ox < w; ox++) { const tx = x + ox, ty = y - oy; if (tx >= 0 && ty >= 0 && tx < W && ty < H) occ[I(tx, ty)] = 1; } };

    // 항만: 크레인 (안벽이 바다와 닿는 곳) + 컨테이너
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.QUAY) continue;
      const sea = isWater(x, y + 1) ? 's' : isWater(x + 1, y) ? 'e' : isWater(x - 1, y) ? 'w' : isWater(x, y - 1) ? 'n' : '';
      if (sea && (x * 7 + y * 3) % 5 === 0 && free(x, y, 1, 1) && !nearRoad(x, y, 0)) { objs.push({ type:'crane', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 9) * 2) }); mark(x - 1, y, 3, 2); }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.QUAY || nearRoad(x, y, 0)) continue;
      let sea = false; for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (isWater(x + ox, y + oy)) sea = true;
      if (!sea && hash(x, y, 10) < 0.55 && free(x, y, 1, 1)) { objs.push({ type:'container', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 11) * 6), h: 1 + Math.floor(hash(x, y, 12) * 3) }); mark(x, y, 1, 1); }
    }

    // 도심: 고층 / 아파트
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 3) {
      if (get(x, y) !== T.PLAZA || get(x + 1, y) !== T.PLAZA || nearRoad(x, y, 1) || nearRoad(x + 1, y, 1)) continue;
      if (hash(x, y, 13) > 0.62 || !free(x, y, 2, 2)) continue;
      const glass = (x >= 104 && x <= 133 && y >= 36 && y <= 49);
      objs.push({ type: glass ? 'tower' : 'apt', x:x + 1, y:y + 1, v: Math.floor(hash(x, y, 14) * 5), h: 3 + Math.floor(hash(x, y, 15) * (glass ? 4 : 3)) });
      mark(x - 1, y + 1, 4, 3);
    }

    // 주택가 (산복도로풍 알록달록)
    const HOODS = [[70,11,85,27,0.35],[58,27,80,46,0.3],[43,50,52,60,0.6],[60,66,75,79,0.45],[41,36,52,56,0.3],
                   [116,28,142,40,0.3],[82,43,95,58,0.35],[3,16,27,66,0.06],[86,22,98,32,0.3],[118,2,148,18,0.2],[42,2,52,16,0.25]];
    for (const hd of HOODS) {
      for (let y = hd[1]; y <= hd[3]; y += 2) for (let x = hd[0]; x <= hd[2]; x += 2) {
        const t = get(x, y); if (t !== T.GRASS && t !== T.FARM) continue;
        if (t === T.FARM && hash(x, y, 16) > 0.25) continue;
        if (nearRoad(x, y, 0) || hash(x, y, 17) > hd[4] || !free(x, y, 1, 1)) continue;
        if (get(x, y - 1) === T.ROAD || isWater(x, y + 1)) continue;
        objs.push({ type:'house', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 18) * 8) });
        mark(x - 1, y, 3, 2);
      }
    }

    // 나무
    for (let y = 1; y < H; y++) for (let x = 0; x < W; x++) {
      const t = get(x, y);
      if (t !== T.GRASS && t !== T.FOREST) continue;
      if (nearRoad(x, y, 0) || occ[I(x, y)] || isReserved(x, y)) continue;
      const p = t === T.FOREST ? 0.55 : 0.05;
      if (hash(x, y, 19) > p) continue;
      let v;
      const r = hash(x, y, 20);
      if (t === T.FOREST) v = r < 0.55 ? 'pine' : 'round';
      else if ((x > 132 && y > 38 && y < 48) || (x > 70 && x < 82 && y > 16 && y < 28) || r < 0.12) v = 'blossom';
      else v = r < 0.6 ? 'round' : 'round2';
      objs.push({ type:'tree', x:x + 0.5 + (hash(x, y, 21) - 0.5) * 0.4, y:y + 0.9, v });
      occ[I(x, y)] = 1;
    }

    // 광안대교 · 부산항대교 주탑
    const pylons = [{ x:101.5, y:59.5 }, { x:107.5, y:59.5 }, { x:78.5, y:68.5 }, { x:84.5, y:68.5 }];
    const bridges = [ // 케이블 (주탑 사이 현수선)
      { a:[95,59.5], p1:101.5, p2:107.5, b:[112,59.5], name:'광안대교' },
      { a:[74,68.5], p1:78.5, p2:84.5, b:[89,68.5], name:'부산항대교' },
    ];
    for (const p of pylons) objs.push({ type:'pylon', x:p.x, y:p.y + 0.5 });

    // 지명 라벨
    const labels = [
      { x:64, y:4, t:'금정산', k:'mt' }, { x:137, y:16, t:'장산', k:'mt' }, { x:87, y:37, t:'황령산', k:'mt' },
      { x:52, y:22, t:'백양산', k:'mt' }, { x:33, y:20, t:'낙동강', k:'water' }, { x:33, y:71, t:'을숙도', k:'area' },
      { x:15, y:40, t:'강서 들녘', k:'area' }, { x:16, y:72, t:'부산신항', k:'port' }, { x:79, y:56, t:'북항', k:'port' },
      { x:70, y:35, t:'서면', k:'area' }, { x:77, y:18, t:'동래', k:'area' }, { x:126, y:51, t:'해운대해수욕장', k:'beach' },
      { x:100, y:54, t:'광안리', k:'beach' }, { x:104, y:61.5, t:'광안대교', k:'bridge' }, { x:81, y:70.5, t:'부산항대교', k:'bridge' },
      { x:67, y:75, t:'영도', k:'area' }, { x:47, y:56, t:'감천문화마을', k:'area' }, { x:44, y:61, t:'감천항', k:'port' },
      { x:54, y:67, t:'송도', k:'beach' }, { x:41, y:79, t:'다대포', k:'beach' }, { x:130, y:58, t:'해운대 앞바다', k:'water' },
      { x:99, y:30, t:'수영강', k:'water' }, { x:89, y:54, t:'남구', k:'area' }, { x:45, y:42, t:'사하', k:'area' },
    ];

    // 구역 (HUD 위치 표시용) — 가장 가까운 중심
    const districts = [
      ['해운대구', 128, 38], ['센텀시티', 109, 41], ['수영구 · 광안리', 98, 48], ['남구', 89, 56], ['동구 · 부산역', 71, 49],
      ['중구 · 중앙동', 63, 57], ['영도구', 67, 72], ['서구 · 송도', 54, 63], ['사하구', 45, 50], ['부산진구 · 서면', 70, 37],
      ['동래구', 77, 19], ['금정구', 64, 8], ['북구', 48, 26], ['강서구', 14, 40], ['부산신항', 16, 73], ['을숙도', 33, 70],
      ['기장 방면', 140, 10], ['연제구', 86, 28], ['부산 앞바다', 100, 85],
    ];

    return { W, H, T, tiles: g, objs, landmarks, labels, districts, bridges, isWaterType: (t) => WATER.has(t), hash };
  }

  G.GorgoMapGen = { generate, T, W, H };
})(typeof window !== 'undefined' ? window : globalThis);
