/* =========================================================================
   AGENT GORGO WORLD — 부산 맵 생성기 v2 (실측 지형 기반)
   지형 원천: data/busan-osm.js (© OpenStreetMap contributors, ODbL 1.0)
   좌표계: 타일 단위. x → 동, y → 남. 1타일 ≈ 140m. 범위 = 진해 신항(서) ~ 해운대·송정(동).
   지형 모양은 실측, 그림체는 아기자기한 도트(기존 v1 스타일 유지).
   ========================================================================= */
(function (G) {
  'use strict';
  const SRC = G.BUSAN_OSM;
  const W = SRC.meta.W, H = SRC.meta.H, BB = SRC.meta.bbox;
  const T = { DEEP:0, SHALLOW:1, GRASS:2, SAND:3, ROAD:4, PLAZA:5, FARM:6, FOREST:7, QUAY:8, BRIDGE:9, RIVER:10 };
  const WATER = new Set([T.DEEP, T.SHALLOW, T.RIVER]);

  // 위경도 → 타일 좌표
  const X = (lon) => (lon - BB.w) / (BB.e - BB.w) * W;
  const Y = (lat) => (BB.n - lat) / (BB.n - BB.s) * H;
  const box = (s, w, n, e) => [X(w), Y(n), X(e), Y(s)]; // [x0,y0,x1,y1]

  function hash(x, y, s) {
    let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function decodeB64(b64) {
    if (typeof atob === 'function') { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }

  /* ---------- 실측 지명 · 구역 (위경도) ---------- */
  const BEACHES = [box(35.155, 129.150, 35.163, 129.168), box(35.146, 129.110, 35.157, 129.123), box(35.071, 129.011, 35.081, 129.023),
                   box(35.038, 128.953, 35.053, 128.976), box(35.175, 129.195, 35.185, 129.205)];
  const PLAZAS = [ // 도심 포장지대
    box(35.164, 129.124, 35.176, 129.141), box(35.154, 129.139, 35.161, 129.152), box(35.150, 129.052, 35.163, 129.067),
    box(35.098, 129.030, 35.118, 129.045), box(35.094, 129.024, 35.101, 129.036), box(35.198, 129.072, 35.211, 129.089),
    box(35.174, 129.070, 35.186, 129.086), box(35.084, 128.898, 35.096, 128.916), box(35.083, 128.798, 35.094, 128.822),
  ];
  const GLASS = [box(35.150, 129.120, 35.178, 129.170)]; // 센텀·마린시티·해운대 유리 고층
  const PORTS = [box(35.055, 128.745, 35.095, 128.845), box(35.090, 129.040, 35.125, 129.095), box(35.074, 128.985, 35.092, 129.012),
                 box(35.080, 129.020, 35.092, 129.040), box(35.085, 129.050, 35.100, 129.075)];

  const LANDMARKS = [
    { id:'office', kind:'office', name:'센텀시티 사무실', sub:'AGENT GORGO HQ', lat:35.1690, lon:129.1330, zone:true },
    { id:'immigration', kind:'immigration', name:'부산출입국·외국인청', sub:'BUSAN IMMIGRATION · 중앙동', lat:35.1043, lon:129.0398, zone:true },
    { id:'cfs', kind:'cfs', name:'신항 CFS', sub:'창원시 진해구 · 웅동 배후단지', lat:35.0905, lon:128.7700, zone:true },
    { id:'station', kind:'station', name:'부산역', lat:35.1156, lon:129.0426 },
    { id:'tower', kind:'busantower', name:'부산타워', lat:35.1005, lon:129.0327 },
    { id:'lh1', kind:'lighthouse', name:'오륙도 등대', lat:35.0960, lon:129.1225 },
    { id:'lh2', kind:'lighthouse', name:'태종대 등대', lat:35.0545, lon:129.0855 },
  ];

  const LABELS = [
    // 수역
    ['낙동강', 35.150, 128.982, 'water'], ['서낙동강', 35.150, 128.905, 'water'], ['수영강', 35.181, 129.118, 'water'],
    ['북항', 35.105, 129.058, 'port'], ['남항', 35.087, 129.030, 'water'], ['수영만', 35.142, 129.135, 'water'], ['진해만', 35.055, 128.770, 'water'],
    ['부산 앞바다', 35.020, 129.080, 'water'], ['해운대 앞바다', 35.120, 129.180, 'water'],
    // 지역
    ['부산신항', 35.0745, 128.8080, 'port'], ['서컨테이너부두 (진해)', 35.0770, 128.7660, 'port'], ['가덕도', 35.020, 128.828, 'area'],
    ['을숙도', 35.100, 128.942, 'area'], ['명지', 35.096, 128.907, 'area'], ['강서 들녘', 35.150, 128.940, 'area'], ['김해공항', 35.1795, 128.9382, 'area'],
    ['사상', 35.155, 128.988, 'area'], ['사하', 35.100, 128.975, 'area'], ['다대포', 35.042, 128.965, 'beach'], ['감천문화마을', 35.0963, 129.0088, 'area'],
    ['송도', 35.0755, 129.0173, 'beach'], ['남포 · 자갈치', 35.0960, 129.0280, 'area'], ['영도', 35.078, 129.065, 'area'], ['태종대', 35.0585, 129.0877, 'area'],
    ['서면', 35.158, 129.060, 'area'], ['동래', 35.205, 129.080, 'area'], ['남구', 35.120, 129.095, 'area'], ['광안리', 35.1525, 129.1180, 'beach'],
    ['센텀시티', 35.1730, 129.1310, 'area'], ['해운대해수욕장', 35.1575, 129.1600, 'beach'], ['동백섬', 35.1530, 129.1522, 'area'],
    ['송정', 35.180, 129.199, 'beach'], ['창원시 진해구', 35.110, 128.790, 'region'], ['김해시', 35.215, 128.900, 'region'],
    // 다리
    ['광안대교', 35.1430, 129.1290, 'bridge'], ['부산항대교', 35.0985, 129.0700, 'bridge'], ['남항대교', 35.0790, 129.0320, 'bridge'],
    ['영도대교', 35.0935, 129.0362, 'bridge'], ['을숙도대교', 35.0860, 128.9440, 'bridge'],
  ];
  const DISTRICTS = [
    ['해운대구', 35.163, 129.163], ['해운대구 · 센텀시티', 35.170, 129.131], ['해운대구 · 마린시티', 35.157, 129.145], ['수영구 · 광안리', 35.155, 129.113],
    ['남구', 35.125, 129.095], ['남구 · 용호동 / 이기대', 35.110, 129.115], ['동구 · 부산역', 35.115, 129.042], ['중구 · 중앙동', 35.104, 129.037],
    ['중구 · 남포동', 35.097, 129.030], ['영도구', 35.080, 129.065], ['서구 · 송도', 35.080, 129.015], ['사하구', 35.095, 128.975], ['사하구 · 다대포', 35.050, 128.968],
    ['사상구', 35.155, 128.990], ['부산진구 · 서면', 35.158, 129.060], ['연제구', 35.180, 129.080], ['동래구', 35.205, 129.083], ['북구', 35.200, 129.015],
    ['강서구 · 명지', 35.095, 128.910], ['강서구 · 대저', 35.200, 128.960], ['강서구 · 녹산', 35.095, 128.850], ['부산신항 (부산 강서)', 35.075, 128.815],
    ['강서구 · 가덕도', 35.030, 128.830], ['을숙도', 35.100, 128.942], ['수영구', 35.170, 129.115], ['금정구 방면', 35.245, 129.090], ['기장 방면', 35.240, 129.190],
  ];

  function generate() {
    const raw = decodeB64(SRC.cls);
    const g = new Uint8Array(W * H), inBusan = new Uint8Array(W * H);
    const I = (x, y) => y * W + x;
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.DEEP : g[I(x, y)];
    const isWater = (x, y) => WATER.has(get(x, y));
    const inBox = (x, y, b) => x + 0.5 >= b[0] && x + 0.5 <= b[2] && y + 0.5 >= b[1] && y + 0.5 <= b[3];

    // 1) 실측 클래스 → 타일
    for (let i = 0; i < W * H; i++) {
      const c = raw[i] & 0x7f; inBusan[i] = raw[i] >> 7;
      g[i] = c === 0 ? T.DEEP : c === 1 ? T.RIVER : c === 3 ? T.FOREST : c === 5 ? T.QUAY : c === 6 ? T.FARM : T.GRASS;
    }
    const urban = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) urban[i] = (raw[i] & 0x7f) === 4 ? 1 : 0;

    // 2) 도심 광장 · 해변
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = get(x, y); if (WATER.has(t)) continue;
      for (const b of PLAZAS) if (inBox(x, y, b) && t !== T.QUAY) g[I(x, y)] = T.PLAZA;
      for (const b of BEACHES) if (inBox(x, y, b)) { let near = false; for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) if (isWater(x + ox, y + oy) && get(x + ox, y + oy) !== T.RIVER) near = true; if (near) g[I(x, y)] = T.SAND; }
    }

    // 3) 도로 (OSM 간선) — 물 위면 다리
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
    const bridgeLines = {}; // 이름 있는 다리 → 폴리라인(케이블·주탑용)
    for (const [cls, flat, name] of SRC.roads) {
      const pts = []; for (let i = 0; i < flat.length; i += 2) pts.push([flat[i], flat[i + 1]]);
      stroke(pts, cls === 1 ? 0.62 : 0.5, (x, y) => { g[I(x, y)] = isWater(x, y) || get(x, y) === T.BRIDGE ? T.BRIDGE : T.ROAD; });
      const bk = /광안대교/.test(name) ? "광안대교" : /부산항대교/.test(name) ? "부산항대교" : ""; if (bk) (bridgeLines[bk] = bridgeLines[bk] || []).push(pts);
    }

    // 4) 얕은 바다
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.DEEP) continue;
      let near = false;
      for (let oy = -2; oy <= 2 && !near; oy++) for (let ox = -2; ox <= 2; ox++) { const t = get(x + ox, y + oy); if (!WATER.has(t)) { near = true; break; } }
      if (near) g[I(x, y)] = T.SHALLOW;
    }

    /* ---------- 랜드마크 (발밑이 육지·남쪽이 열린 칸으로 보정) ---------- */
    const walkable = (x, y) => !isWater(x, y) && x >= 0 && y >= 0 && x < W && y < H;
    const landmarks = LANDMARKS.map(l => {
      let bx = Math.floor(X(l.lon)), by = Math.floor(Y(l.lat)), best = null, bd = 1e9;
      for (let r = 0; r <= 6 && !best; r++) for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) {
        const x = bx + ox, y = by + oy;
        if (!walkable(x, y) || !walkable(x, y + 1) || !walkable(x - 1, y) || !walkable(x + 1, y)) continue;
        const d = ox * ox + oy * oy; if (d < bd) { bd = d; best = [x, y]; }
      }
      const [tx, ty] = best || [bx, by];
      return { ...l, x: tx + 0.5, y: ty + 1 };
    });
    // 랜드마크 주변 · 앞마당 정리 (평지 광장으로)
    for (const l of landmarks) {
      const rx = l.kind === 'office' || l.kind === 'immigration' || l.kind === 'cfs' ? 3 : 2;
      for (let y = Math.floor(l.y) - 4; y <= Math.floor(l.y) + 2; y++) for (let x = Math.floor(l.x) - rx; x <= Math.floor(l.x) + rx; x++) {
        if (x < 0 || y < 0 || x >= W || y >= H) continue; const t = get(x, y);
        if (t === T.FOREST || t === T.GRASS || t === T.FARM) g[I(x, y)] = l.kind === 'cfs' ? T.QUAY : T.PLAZA;
      }
    }
    const reserved = landmarks.map(l => (x, y) => Math.abs(x + 0.5 - l.x) <= 3.5 && y + 0.5 <= l.y + 3 && y + 0.5 >= l.y - 6);
    const isReserved = (x, y) => reserved.some(f => f(x, y));

    /* ---------- 오브젝트 ---------- */
    const objs = [];
    const occ = new Uint8Array(W * H);
    const nearRoad = (x, y, r) => { for (let oy = -r; oy <= r; oy++) for (let ox = -r; ox <= r; ox++) { const t = get(x + ox, y + oy); if (t === T.ROAD || t === T.BRIDGE) return true; } return false; };
    const free = (x, y, w, h) => { for (let oy = 0; oy < h; oy++) for (let ox = 0; ox < w; ox++) { const tx = x + ox, ty = y - oy; if (tx < 0 || ty < 0 || tx >= W || ty >= H) return false; if (occ[I(tx, ty)] || isReserved(tx, ty)) return false; } return true; };
    const mark = (x, y, w, h) => { for (let oy = 0; oy < h; oy++) for (let ox = 0; ox < w; ox++) { const tx = x + ox, ty = y - oy; if (tx >= 0 && ty >= 0 && tx < W && ty < H) occ[I(tx, ty)] = 1; } };
    const inAny = (x, y, list) => list.some(b => inBox(x, y, b));

    // 항만: 크레인 + 컨테이너 (항만 구역 안에서만)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.QUAY || !inAny(x, y, PORTS)) continue;
      const sea = isWater(x, y + 1) || isWater(x + 1, y) || isWater(x - 1, y) || isWater(x, y - 1);
      if (sea && (x * 7 + y * 3) % 4 === 0 && free(x, y, 1, 1) && !nearRoad(x, y, 0)) { objs.push({ type:'crane', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 9) * 2) }); mark(x - 1, y, 3, 2); }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== T.QUAY || nearRoad(x, y, 0)) continue;
      let sea = false; for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (isWater(x + ox, y + oy)) sea = true;
      const port = inAny(x, y, PORTS);
      if (!sea && hash(x, y, 10) < (port ? 0.6 : 0.18) && free(x, y, 1, 1)) { objs.push({ type: port ? 'container' : 'factory', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 11) * 6), h: 1 + Math.floor(hash(x, y, 12) * 3) }); mark(x, y, 1, 1); }
    }
    // 도심 고층
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
      if (get(x, y) !== T.PLAZA || get(x + 1, y) !== T.PLAZA || nearRoad(x, y, 0) || nearRoad(x + 1, y, 0)) continue;
      if (hash(x, y, 13) > 0.55 || !free(x, y, 2, 2)) continue;
      const glass = inAny(x, y, GLASS);
      objs.push({ type: glass ? 'tower' : 'apt', x:x + 1, y:y + 1, v: Math.floor(hash(x, y, 14) * 5), h: 3 + Math.floor(hash(x, y, 15) * (glass ? 5 : 3)) });
      mark(x - 1, y + 1, 4, 3);
    }
    // 시가지(OSM 주거·상업) → 산복도로풍 알록달록 주택 / 아파트
    for (let y = 1; y < H; y++) for (let x = 0; x < W; x++) {
      const t = get(x, y);
      if (!urban[I(x, y)] || (t !== T.GRASS && t !== T.FOREST)) continue;
      if (((x + y) & 1) || nearRoad(x, y, 0) || isWater(x, y + 1) || !free(x, y, 1, 1)) continue;
      const r = hash(x, y, 17);
      if (r > 0.7) continue;
      if (r < 0.12 && free(x - 1, y, 2, 2) && get(x + 1, y) === t) { objs.push({ type:'apt', x:x + 1, y:y + 1, v: Math.floor(hash(x, y, 14) * 5), h: 2 + Math.floor(hash(x, y, 15) * 3) }); mark(x - 1, y + 1, 4, 3); continue; }
      objs.push({ type:'house', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 18) * 8) }); mark(x - 1, y, 3, 2);
    }
    // 농가 (강서 들녘)
    for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) {
      if (get(x, y) !== T.FARM || nearRoad(x, y, 0) || hash(x, y, 16) > 0.07 || !free(x, y, 1, 1)) continue;
      objs.push({ type:'house', x:x + 0.5, y:y + 1, v: Math.floor(hash(x, y, 18) * 8) }); mark(x - 1, y, 3, 2);
    }
    // 나무
    for (let y = 1; y < H; y++) for (let x = 0; x < W; x++) {
      const t = get(x, y);
      if (t !== T.GRASS && t !== T.FOREST) continue;
      if (nearRoad(x, y, 0) || occ[I(x, y)] || isReserved(x, y)) continue;
      const p = t === T.FOREST ? 0.5 : urban[I(x, y)] ? 0.03 : 0.06;
      if (hash(x, y, 19) > p) continue;
      const r = hash(x, y, 20);
      const v = t === T.FOREST ? (r < 0.55 ? 'pine' : 'round') : r < 0.14 ? 'blossom' : r < 0.6 ? 'round' : 'round2';
      objs.push({ type:'tree', x:x + 0.5 + (hash(x, y, 21) - 0.5) * 0.4, y:y + 0.9, v });
      occ[I(x, y)] = 1;
    }

    // 다리 주탑 (광안대교=현수교 2주탑, 부산항대교=사장교 2주탑) — 실제 폴리라인 위
    const bridges = [];
    const len = (p) => p.reduce((s, q, i) => i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0, 0);
    const along = (p, t) => { const L = len(p) * t; let acc = 0; for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + d >= L) { const k = (L - acc) / d; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; } acc += d; } return p[p.length - 1]; };
    for (const [name, arr] of Object.entries(bridgeLines)) {
      // 같은 다리의 여러 way(상·하행)를 합쳐 가장 먼 두 점을 다리 축으로
      const all = []; // 폴리라인을 0.25타일 간격으로 짚어 물 위(다리 타일) 지점만
      for (const p of arr) for (let i = 1; i < p.length; i++) { const n = Math.ceil(Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) * 4); for (let k = 0; k <= n; k++) { const q = [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k / n, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k / n]; if (get(Math.floor(q[0]), Math.floor(q[1])) === T.BRIDGE) all.push(q); } }
      if (all.length < 2) continue; let best = [all[0], all[0]], bd = -1;
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) { const d = (all[i][0] - all[j][0]) ** 2 + (all[i][1] - all[j][1]) ** 2; if (d > bd) { bd = d; best = [all[i], all[j]]; } }
      const p = best[0][0] <= best[1][0] ? best : [best[1], best[0]]; if (len(p) < 4) continue;
      const kind = /광안/.test(name) ? 'suspension' : 'stayed';
      const t1 = kind === 'suspension' ? 0.38 : 0.36, t2 = kind === 'suspension' ? 0.62 : 0.64;
      // 주탑·끝점은 축 방향 투영 순서로 정렬한 실제 상판 지점에서 고른다 (곡선 다리 대응)
      const ux = p[1][0] - p[0][0], uy = p[1][1] - p[0][1];
      const ord = all.map(q => [q, (q[0] - p[0][0]) * ux + (q[1] - p[0][1]) * uy]).sort((u, v) => u[1] - v[1]).map(u => u[0]);
      const at = (t) => ord[Math.min(ord.length - 1, Math.max(0, Math.round((ord.length - 1) * t)))];
      const a = at(0.04), b = at(0.96), p1 = at(t1), p2 = at(t2);
      bridges.push({ name, kind, a, b, p1, p2 });
      objs.push({ type:'pylon', x:p1[0], y:p1[1] + 0.3, v: kind }); objs.push({ type:'pylon', x:p2[0], y:p2[1] + 0.3, v: kind });
    }

    const labels = LABELS.map(([t, lat, lon, k]) => ({ t, x: X(lon), y: Y(lat), k }));
    // 실측 산봉우리 라벨 (해발 높은 순, 서로 12타일 이상 떨어진 것만)
    const peaks = SRC.peaks.slice().sort((a, b) => b[3] - a[3]); const chosen = [];
    for (const p of peaks) { if (/^[0-9]+$/.test(p[2])) continue; if (p[3] < 250 || chosen.length >= 14) continue; if (chosen.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 12)) continue; chosen.push(p); }
    for (const p of chosen) labels.push({ t: p[2] + (p[3] ? ` ${Math.round(p[3])}m` : ''), x: p[0], y: p[1], k: 'mt' });

    const districts = DISTRICTS.map(([n, lat, lon]) => [n, X(lon), Y(lat)]);
    const boundary = SRC.boundary.map(f => { const p = []; for (let i = 0; i < f.length; i += 2) p.push([f[i], f[i + 1]]); return p; });

    return { W, H, T, tiles: g, inBusan, objs, landmarks, labels, districts, bridges, boundary, isWaterType: (t) => WATER.has(t), hash, X, Y };
  }

  G.GorgoMapGen = { generate, T, W, H };
})(typeof window !== 'undefined' ? window : globalThis);
