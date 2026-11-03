/* =========================================================================
   AGENT GORGO WORLD — 아트 엔진
   모든 그림은 외부 이미지 없이 코드로 픽셀을 찍어 만든다 (저작권 깨끗한 오리지널).
   ========================================================================= */
(function (G) {
  'use strict';
  const TS = 16;

  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const P = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w || 1, h || 1); };

  const C = {
    grass: '#9ad86f', grassD: '#84c860', grassL: '#b6ea8c',
    forest: '#7cc35f', forestD: '#69ad50',
    sand: '#fbe7b0', sandD: '#efd38f', sandW: '#e3c98c',
    road: '#f3e6cb', roadE: '#dcc8a0', roadS: '#e8d6b1',
    plaza: '#f1ebf6', plazaG: '#ded4ea', plazaS: '#e7deef',
    soil: '#cc9d66', furrow: '#b3854f', sprout: '#7fcf5a',
    quay: '#cdd3dd', quayS: '#b7bfcc', hazard: '#ffd23f',
    deck: '#b7c0d1', deckL: '#d6dcea', rail: '#68728d', railL: '#eef2fb',
    deep: '#58ade8', shallow: '#7dcbf3', river: '#73c4f0', foamL: '#c3ecff', foam: '#ffffff',
    cliff: '#c99363', cliffD: '#a8744a', wall: '#8f97a6',
    outline: '#4d3f5c',
  };
  const FLOWERS = ['#ff8fb1', '#fff27a', '#ffffff', '#c3b2ff', '#ffb36b'];

  /* ---------------- 지면 ---------------- */
  function paintGround(map) {
    const { W, H, T, tiles, hash } = map;
    const can = cv(W * TS, H * TS), c = can.getContext('2d');
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.DEEP : tiles[y * W + x];
    const isW = (t) => t === T.DEEP || t === T.SHALLOW || t === T.RIVER;
    const isLandish = (t) => !isW(t) && t !== T.BRIDGE;

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = get(x, y), X = x * TS, Y = y * TS;
      const r = (k) => hash(x, y, 100 + k);
      switch (t) {
        case T.DEEP: case T.SHALLOW: case T.RIVER: {
          P(c, X, Y, TS, TS, t === T.DEEP ? C.deep : t === T.RIVER ? C.river : C.shallow);
          // 잔물결
          for (let k = 0; k < 2; k++) if (r(k) < 0.5) { const wx = X + Math.floor(r(k + 3) * 11), wy = Y + 2 + Math.floor(r(k + 5) * 12); P(c, wx, wy, 4, 1, 'rgba(255,255,255,.22)'); }
          // 다리 그림자
          if (get(x, y - 1) === T.BRIDGE) P(c, X, Y, TS, 5, 'rgba(30,60,110,.25)');
          // 해안 포말
          const N = isLandish(get(x, y - 1)), S = isLandish(get(x, y + 1)), Ww = isLandish(get(x - 1, y)), E = isLandish(get(x + 1, y));
          if (N) { P(c, X, Y, TS, 3, C.foamL); for (let i = 0; i < TS; i += 3) if (hash(x * 16 + i, y, 7) < 0.7) P(c, X + i, Y + 2, 2, 1, C.foam); }
          if (S) { P(c, X, Y + TS - 2, TS, 2, C.foamL); for (let i = 0; i < TS; i += 3) if (hash(x * 16 + i, y, 8) < 0.7) P(c, X + i, Y + TS - 3, 2, 1, C.foam); }
          if (Ww) { P(c, X, Y, 2, TS, C.foamL); for (let i = 0; i < TS; i += 3) if (hash(x, y * 16 + i, 9) < 0.7) P(c, X + 2, Y + i, 1, 2, C.foam); }
          if (E) { P(c, X + TS - 2, Y, 2, TS, C.foamL); for (let i = 0; i < TS; i += 3) if (hash(x, y * 16 + i, 10) < 0.7) P(c, X + TS - 3, Y + i, 1, 2, C.foam); }
          break;
        }
        case T.GRASS: case T.FOREST: {
          const base = t === T.GRASS ? C.grass : C.forest, dark = t === T.GRASS ? C.grassD : C.forestD;
          P(c, X, Y, TS, TS, base);
          for (let k = 0; k < 5; k++) { const gx = X + Math.floor(r(k) * 14), gy = Y + Math.floor(r(k + 10) * 14); P(c, gx, gy, 1, 2, dark); P(c, gx + 1, gy + 1, 1, 1, dark); }
          if (r(20) < 0.35) { const gx = X + 2 + Math.floor(r(21) * 11), gy = Y + 2 + Math.floor(r(22) * 11); P(c, gx, gy, 2, 1, C.grassL); }
          if (t === T.GRASS && r(23) < 0.12) { // 꽃
            const fx = X + 3 + Math.floor(r(24) * 9), fy = Y + 3 + Math.floor(r(25) * 9), fc = FLOWERS[Math.floor(r(26) * FLOWERS.length)];
            P(c, fx, fy - 1, 1, 1, fc); P(c, fx - 1, fy, 1, 1, fc); P(c, fx + 1, fy, 1, 1, fc); P(c, fx, fy + 1, 1, 1, fc); P(c, fx, fy, 1, 1, '#ffe066');
          }
          break;
        }
        case T.SAND: {
          P(c, X, Y, TS, TS, C.sand);
          for (let k = 0; k < 4; k++) P(c, X + Math.floor(r(k) * 15), Y + Math.floor(r(k + 9) * 15), 1, 1, C.sandD);
          if (r(30) < 0.05) { const sx = X + 4 + Math.floor(r(31) * 8), sy = Y + 4 + Math.floor(r(32) * 8); // 불가사리
            P(c, sx, sy, 1, 1, '#ff8a65'); P(c, sx - 1, sy, 3, 1, '#ff8a65'); P(c, sx, sy - 1, 1, 3, '#ff8a65'); }
          else if (r(33) < 0.05) { const sx = X + 4 + Math.floor(r(34) * 8), sy = Y + 4 + Math.floor(r(35) * 8); P(c, sx, sy, 2, 1, '#fff'); P(c, sx, sy + 1, 2, 1, '#f3c9d6'); }
          break;
        }
        case T.FARM: {
          P(c, X, Y, TS, TS, C.soil);
          for (let i = 1; i < TS; i += 4) { P(c, X, Y + i, TS, 1, C.furrow); for (let j = 1; j < TS; j += 3) P(c, X + j + (i % 8 ? 1 : 0), Y + i - 1, 1, 1, C.sprout); }
          break;
        }
        case T.PLAZA: {
          P(c, X, Y, TS, TS, C.plaza);
          P(c, X, Y, TS, 1, C.plazaG); P(c, X, Y, 1, TS, C.plazaG); P(c, X, Y + 8, TS, 1, C.plazaS); P(c, X + 8, Y, 1, TS, C.plazaS);
          if (r(40) < 0.06) { P(c, X + 6, Y + 6, 4, 4, '#a7dc85'); P(c, X + 7, Y + 7, 2, 2, '#7fc95a'); }
          break;
        }
        case T.ROAD: {
          P(c, X, Y, TS, TS, C.road);
          for (let k = 0; k < 3; k++) P(c, X + Math.floor(r(k) * 15), Y + Math.floor(r(k + 7) * 15), 1, 1, C.roadS);
          const e = (tt) => tt !== T.ROAD && tt !== T.BRIDGE;
          if (e(get(x, y - 1))) P(c, X, Y, TS, 1, C.roadE);
          if (e(get(x, y + 1))) P(c, X, Y + TS - 1, TS, 1, C.roadE);
          if (e(get(x - 1, y))) P(c, X, Y, 1, TS, C.roadE);
          if (e(get(x + 1, y))) P(c, X + TS - 1, Y, 1, TS, C.roadE);
          break;
        }
        case T.QUAY: {
          P(c, X, Y, TS, TS, C.quay);
          P(c, X, Y, TS, 1, C.quayS); P(c, X, Y, 1, TS, C.quayS);
          if (isW(get(x, y + 1)) || isW(get(x, y - 1)) || isW(get(x - 1, y)) || isW(get(x + 1, y))) {
            if (isW(get(x, y + 1))) for (let i = 0; i < TS; i += 4) P(c, X + i, Y + TS - 4, 2, 2, C.hazard);
          }
          break;
        }
        case T.BRIDGE: {
          P(c, X, Y, TS, TS, C.deck);
          P(c, X, Y + 7, TS, 2, C.deckL);
          const wN = isW(get(x, y - 1)), wS = isW(get(x, y + 1)), wW = isW(get(x - 1, y)), wE = isW(get(x + 1, y));
          if (wN) { P(c, X, Y, TS, 2, C.rail); P(c, X, Y + 2, TS, 1, C.railL); }
          if (wS) { P(c, X, Y + TS - 3, TS, 2, C.rail); P(c, X, Y + TS - 1, TS, 1, '#4c5570'); }
          if (wW) { P(c, X, Y, 2, TS, C.rail); P(c, X + 2, Y, 1, TS, C.railL); }
          if (wE) { P(c, X + TS - 2, Y, 2, TS, C.rail); P(c, X + TS - 3, Y, 1, TS, C.railL); }
          for (let i = 1; i < TS; i += 4) { if (wN) P(c, X + i, Y + 3, 1, 1, '#ffd23f'); if (wS) P(c, X + i, Y + TS - 4, 1, 1, '#ffd23f'); }
          break;
        }
      }
      // 육지 → 바다 절벽 (2.5D 깊이감)
      if (isLandish(t) && isW(get(x, y + 1))) {
        if (t === T.SAND) { P(c, X, Y + TS - 3, TS, 3, C.sandW); }
        else if (t === T.QUAY) { P(c, X, Y + TS - 4, TS, 4, C.wall); P(c, X, Y + TS - 4, TS, 1, '#a8b0bf'); for (let i = 2; i < TS; i += 8) P(c, X + i, Y + TS - 3, 3, 2, '#2f3442'); }
        else { P(c, X, Y + TS - 5, TS, 1, C.grassD); P(c, X, Y + TS - 4, TS, 4, C.cliff); for (let i = 0; i < TS; i += 4) P(c, X + i + (x % 2 ? 2 : 0), Y + TS - 2, 2, 2, C.cliffD); }
      }
    }
    return can;
  }

  /* ---------------- 오브젝트 스프라이트 ---------------- */
  function blob(c, cx, cy, r, base, dark, light, outline, lump) {
    const R = Math.ceil(r) + 1;
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      const a = Math.atan2(y, x), rr = r + (lump ? Math.sin(a * 5) * lump : 0);
      const d = Math.sqrt(x * x + y * y);
      if (d > rr) continue;
      let col = base;
      if (d > rr - 1.1) col = outline;
      else { const s = (x * 0.55 + y * 0.85) / rr; if (s > 0.38) col = dark; else if (s < -0.5) col = light; }
      P(c, cx + x, cy + y, 1, 1, col);
    }
  }

  function makeTree(v) {
    const can = cv(22, 28), c = can.getContext('2d');
    if (v === 'pine') {
      P(c, 9, 21, 4, 6, '#8a5a3c'); P(c, 9, 21, 1, 6, '#5e3b2a'); P(c, 12, 21, 1, 6, '#5e3b2a');
      const tiers = [[11, 2, 3], [11, 7, 6], [11, 12, 8], [11, 16, 10]];
      for (let ti = tiers.length - 1; ti >= 0; ti--) {
        const [cx, top, half] = tiers[ti];
        for (let yy = 0; yy < 7; yy++) {
          const w = Math.round((yy + 1) / 7 * half);
          for (let xx = -w; xx <= w; xx++) {
            let col = xx > w * 0.3 ? '#2f7a4c' : xx < -w * 0.4 ? '#63c07a' : '#3f9a5e';
            if (Math.abs(xx) === w || yy === 6) col = '#235c3a';
            P(c, cx + xx, top + yy, 1, 1, col);
          }
        }
      }
      P(c, 10, 6, 1, 1, '#9ee6a8'); P(c, 8, 12, 1, 1, '#9ee6a8');
      return can;
    }
    const pal = {
      round: ['#5fbf5a', '#3f9a46', '#8fe07a', '#2f6b3a'],
      round2: ['#7ccd5c', '#56a946', '#aeea85', '#357a3a'],
      blossom: ['#ffb6cc', '#f28aac', '#ffdbe6', '#c25a82'],
    }[v] || ['#5fbf5a', '#3f9a46', '#8fe07a', '#2f6b3a'];
    P(c, 9, 17, 4, 9, '#9a6b46'); P(c, 9, 17, 1, 9, '#5e3b2a'); P(c, 12, 17, 1, 9, '#5e3b2a'); P(c, 10, 18, 1, 6, '#b88760');
    blob(c, 11, 11, 9, pal[0], pal[1], pal[2], pal[3], 0.7);
    P(c, 7, 7, 2, 1, '#ffffff88'.slice(0, 7)); P(c, 6, 8, 1, 1, pal[2]);
    if (v === 'blossom') for (let i = 0; i < 6; i++) P(c, 5 + (i * 7) % 12, 6 + (i * 5) % 10, 1, 1, '#ffffff');
    if (v === 'round' && Math.random() < 0) P(c, 0, 0, 1, 1, '#000');
    return can;
  }

  const HOUSE_WALL = ['#fff4e0', '#ffe1ea', '#e3f4ff', '#eafbe0', '#fff6c9', '#f1e6ff', '#ffe9d6', '#e0fbf6'];
  const HOUSE_ROOF = ['#ff7b7b', '#4fb3e8', '#ffb84d', '#6fd08c', '#b48cff', '#ff9ec4', '#3fc1b0', '#f7d154'];
  const darken = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; r = Math.round(r * k); g = Math.round(g * k); b = Math.round(b * k); return '#' + ((1 << 24) | (Math.min(255, r) << 16) | (Math.min(255, g) << 8) | Math.min(255, b)).toString(16).slice(1); };

  function makeHouse(v) {
    const can = cv(24, 26), c = can.getContext('2d'), o = C.outline;
    const wall = HOUSE_WALL[v % 8], roof = HOUSE_ROOF[(v * 3) % 8];
    // 벽
    P(c, 3, 11, 18, 14, o); P(c, 4, 12, 16, 12, wall); P(c, 4, 22, 16, 2, darken(wall, 0.9));
    // 창문
    for (const wx of [6, 14]) { P(c, wx - 1, 14, 6, 5, o); P(c, wx, 15, 4, 3, '#9fdcff'); P(c, wx, 15, 1, 1, '#fff'); P(c, wx - 1, 19, 6, 1, darken(roof, 0.85)); }
    // 문
    P(c, 10, 18, 5, 7, o); P(c, 11, 19, 3, 6, '#b07a52'); P(c, 13, 22, 1, 1, '#ffd23f');
    if (v % 2 === 0) { // 박공지붕
      for (let yy = 0; yy < 9; yy++) {
        const w = 4 + yy * 1.25;
        P(c, Math.round(12 - w) - 1, 3 + yy, Math.round(w * 2) + 2, 1, o);
        P(c, Math.round(12 - w), 3 + yy, Math.round(w * 2), 1, yy % 3 === 2 ? darken(roof, 0.85) : roof);
      }
      P(c, 1, 12, 22, 1, o); P(c, 9, 3, 6, 1, darken(roof, 1.15));
    } else { // 산복도로 평지붕 + 옥상 물탱크
      P(c, 2, 8, 20, 4, o); P(c, 3, 9, 18, 2, roof); P(c, 3, 9, 18, 1, darken(roof, 1.12));
      const tank = v % 4 === 1 ? '#4fa3f7' : '#ff9f43';
      P(c, 13, 2, 7, 7, o); P(c, 14, 3, 5, 5, tank); P(c, 14, 3, 5, 1, darken(tank, 1.2)); P(c, 15, 4, 1, 3, '#ffffff88'.slice(0, 7));
      P(c, 5, 6, 1, 3, o); P(c, 8, 6, 1, 3, o); P(c, 4, 6, 6, 1, '#7a7a7a');
    }
    // 화분
    P(c, 4, 23, 3, 2, '#c97b4a'); P(c, 4, 22, 3, 1, '#ff8fb1');
    return can;
  }

  const APT_COL = ['#ffe8d1', '#e2efff', '#fff1f6', '#e8fff1', '#f3eaff'];
  function makeApt(v, h) {
    const w = 30, hh = 12 + h * 9, can = cv(w + 2, hh + 2), c = can.getContext('2d'), o = C.outline;
    const col = APT_COL[v % 5];
    P(c, 1, 1, w, hh, o); P(c, 2, 2, w - 2, hh - 2, col); P(c, w - 6, 2, 4, hh - 2, darken(col, 0.92));
    P(c, 1, 1, w, 3, o); P(c, 2, 2, w - 2, 1, darken(col, 0.8));
    for (let fy = 6; fy < hh - 6; fy += 9) for (let fx = 4; fx < w - 4; fx += 6) {
      P(c, fx, fy, 4, 5, '#7ec8f2'); P(c, fx, fy, 1, 2, '#e9f7ff'); P(c, fx - 1, fy + 5, 6, 1, darken(col, 0.82));
    }
    P(c, 12, hh - 7, 8, 7, o); P(c, 13, hh - 6, 6, 6, '#8fd0f7'); P(c, 15, hh - 6, 1, 6, o);
    return can;
  }
  function makeTower(v, h) {
    const w = 26, hh = 18 + h * 12, can = cv(w + 2, hh + 6), c = can.getContext('2d'), o = '#2f4e74';
    const tops = ['#7fd0ff', '#89b8ff', '#9be7f2', '#a7c4ff', '#7fe3d3'];
    P(c, 1, 5, w, hh, o);
    for (let yy = 6; yy < hh + 4; yy++) {
      const k = (yy - 6) / hh; P(c, 2, yy, w - 2, 1, k < 0.5 ? tops[v % 5] : darken(tops[v % 5], 0.88));
    }
    for (let yy = 9; yy < hh + 2; yy += 5) P(c, 2, yy, w - 2, 1, 'rgba(255,255,255,.45)');
    for (let xx = 6; xx < w - 1; xx += 6) P(c, xx, 6, 1, hh - 2, 'rgba(40,80,130,.25)');
    for (let i = 0; i < hh; i++) { const xx = 4 + Math.floor(i * 0.4); if (xx < w - 4) P(c, xx, 6 + i, 2, 1, 'rgba(255,255,255,.5)'); }
    P(c, 5, 1, w - 8, 5, o); P(c, 6, 2, w - 10, 3, '#dff3ff'); P(c, w / 2, 0, 1, 2, '#ff5a5a');
    return can;
  }
  const CONT = ['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#9775fa', '#ff922b'];
  function makeContainers(v, h) {
    const can = cv(18, 8 * h + 4), c = can.getContext('2d');
    for (let i = 0; i < h; i++) {
      const col = CONT[(v + i * 2) % 6], y = can.height - 8 * (i + 1) - 1;
      P(c, 1, y, 16, 8, '#3d3550'); P(c, 2, y + 1, 14, 6, col);
      for (let k = 3; k < 16; k += 2) P(c, k, y + 1, 1, 6, darken(col, 0.85));
      P(c, 2, y + 1, 14, 1, darken(col, 1.15));
    }
    return can;
  }
  function makeCrane(v) {
    const can = cv(44, 58), c = can.getContext('2d'), red = v ? '#ff5f5f' : '#3fa9f5', o = '#40354f';
    const leg = (x) => { P(c, x, 14, 4, 43, o); P(c, x + 1, 15, 2, 42, red); for (let y = 18; y < 56; y += 8) P(c, x + 1, y, 2, 3, '#fff'); };
    leg(9); leg(31);
    P(c, 9, 36, 26, 3, o); P(c, 10, 37, 24, 1, red);
    P(c, 0, 10, 44, 6, o); P(c, 1, 11, 42, 4, red); for (let x = 3; x < 42; x += 5) P(c, x, 12, 2, 2, '#fff');
    P(c, 16, 4, 12, 7, o); P(c, 17, 5, 10, 5, '#fff7e0'); P(c, 18, 6, 3, 2, '#7ec8f2');
    P(c, 4, 16, 1, 12, '#40354f'); P(c, 2, 28, 5, 3, '#ffd23f');
    return can;
  }
  function makePylon() {
    const can = cv(40, 72), c = can.getContext('2d'), o = '#4b5470', g = '#e7ecf6', gd = '#b9c2d6';
    for (const x of [3, 33]) { P(c, x, 0, 5, 70, o); P(c, x + 1, 1, 3, 69, g); P(c, x + 3, 1, 1, 69, gd); P(c, x + 1, 0, 3, 2, '#ff5a5a'); }
    for (const y of [6, 26]) { P(c, 3, y, 35, 4, o); P(c, 4, y + 1, 33, 2, g); }
    return can;
  }
  function makeLighthouse() {
    const can = cv(16, 38), c = can.getContext('2d'), o = C.outline;
    P(c, 3, 10, 10, 27, o);
    for (let y = 11; y < 36; y++) { const w = 8 - Math.floor((36 - y) / 12); P(c, 8 - w / 2, y, w, 1, (Math.floor(y / 6) % 2) ? '#ff6b6b' : '#ffffff'); }
    P(c, 4, 4, 8, 7, o); P(c, 5, 5, 6, 5, '#fff3a0'); P(c, 6, 6, 2, 2, '#fff');
    P(c, 3, 2, 10, 3, o); P(c, 4, 2, 8, 2, '#ff6b6b'); P(c, 7, 0, 2, 2, o);
    return can;
  }
  function makeBusanTower() {
    const can = cv(22, 66), c = can.getContext('2d'), o = C.outline;
    P(c, 8, 14, 6, 51, o); P(c, 9, 15, 4, 50, '#f4f6fb'); P(c, 12, 15, 1, 50, '#cfd6e6');
    for (let y = 22; y < 64; y += 6) P(c, 9, y, 4, 1, '#cfd6e6');
    P(c, 2, 8, 18, 8, o); P(c, 3, 9, 16, 6, '#eaf0ff'); for (let x = 4; x < 18; x += 3) P(c, x, 11, 2, 2, '#7ec8f2');
    P(c, 5, 5, 12, 4, o); P(c, 6, 6, 10, 2, '#ff8fa3');
    P(c, 10, 0, 2, 6, o); P(c, 10, 0, 2, 1, '#ff5a5a');
    return can;
  }
  function makeStation() {
    const can = cv(72, 40), c = can.getContext('2d'), o = C.outline;
    P(c, 2, 14, 68, 25, o); P(c, 3, 15, 66, 23, '#fff3df'); P(c, 3, 33, 66, 5, '#f1dcbc');
    for (let x = 6; x < 66; x += 8) { P(c, x, 19, 5, 9, o); P(c, x + 1, 20, 3, 7, '#8fd0f7'); P(c, x + 1, 20, 1, 2, '#fff'); }
    P(c, 28, 26, 16, 13, o); P(c, 29, 27, 14, 12, '#a7dbf9'); P(c, 35, 27, 1, 12, o);
    // 지붕 아치
    for (let x = 0; x < 72; x++) { const h = Math.round(9 * Math.sin(Math.PI * x / 71)); P(c, x, 14 - h, 1, h + 1, o); if (x > 0 && x < 71) P(c, x, 15 - h, 1, h, x % 6 < 3 ? '#5fb3ec' : '#4aa0dd'); }
    P(c, 32, 1, 8, 8, o); P(c, 33, 2, 6, 6, '#fff'); P(c, 36, 3, 1, 3, o); P(c, 36, 5, 2, 1, o);
    return can;
  }

  /* ---- 업무 랜드마크: 센텀 사무실 (AGENT GORGO HQ) ---- */
  function makeOffice() {
    const can = cv(64, 104), c = can.getContext('2d'), o = '#2c4468';
    // 본관 유리 타워
    P(c, 10, 14, 44, 76, o);
    for (let y = 15; y < 89; y++) { const k = (y - 15) / 74; P(c, 11, y, 42, 1, k < 0.45 ? '#86d4ff' : k < 0.8 ? '#6fc0f5' : '#5aafea'); }
    for (let y = 20; y < 88; y += 6) P(c, 11, y, 42, 1, 'rgba(255,255,255,.55)');
    for (let x = 17; x < 53; x += 7) P(c, x, 15, 1, 73, 'rgba(35,75,125,.28)');
    for (let i = 0; i < 70; i++) { const x = 13 + Math.floor(i * 0.5); if (x < 50) P(c, x, 16 + i, 3, 1, 'rgba(255,255,255,.45)'); }
    // 왕관(둥근 꼭대기) + 헬리패드
    for (let x = 0; x < 44; x++) { const h = Math.round(7 * Math.sin(Math.PI * x / 43)); P(c, 10 + x, 14 - h, 1, h + 1, o); if (x > 0 && x < 43) P(c, 10 + x, 15 - h, 1, h, '#e9f6ff'); }
    P(c, 26, 3, 12, 4, o); P(c, 27, 4, 10, 2, '#ffd23f');
    P(c, 31, 0, 2, 4, o); P(c, 31, 0, 2, 1, '#ff5a5a');
    // 엠블럼 (돋보기 + 별) — 에이전트 사무소 표식
    P(c, 24, 24, 16, 16, '#ffffff'); P(c, 24, 24, 16, 1, o); P(c, 24, 39, 16, 1, o); P(c, 24, 24, 1, 16, o); P(c, 39, 24, 1, 16, o);
    blob(c, 31, 30, 4, '#bfe8ff', '#8cc9f0', '#ffffff', '#2c4468', 0);
    P(c, 34, 33, 2, 2, '#2c4468'); P(c, 36, 35, 2, 2, '#2c4468');
    P(c, 30, 29, 2, 2, '#ffd23f');
    // 1층 로비 + 캐노피
    P(c, 4, 82, 56, 4, o); P(c, 5, 83, 54, 2, '#ff8fa3');
    P(c, 10, 86, 44, 17, o); P(c, 11, 87, 42, 16, '#fff7ec');
    for (const x of [13, 43]) { P(c, x, 89, 8, 8, o); P(c, x + 1, 90, 6, 6, '#9fdcff'); P(c, x + 1, 90, 2, 1, '#fff'); }
    P(c, 25, 88, 14, 15, o); P(c, 26, 89, 12, 14, '#bde9ff'); P(c, 31, 89, 2, 14, o); // 자동문
    P(c, 6, 98, 4, 5, '#c97b4a'); P(c, 5, 96, 6, 3, '#6fd08c'); P(c, 54, 98, 4, 5, '#c97b4a'); P(c, 53, 96, 6, 3, '#6fd08c');
    return can;
  }
  /* ---- 업무 랜드마크: 부산출입국·외국인청 ---- */
  function makeImmigration() {
    const can = cv(80, 62), c = can.getContext('2d'), o = '#3d3a5c';
    // 깃대 + 태극기 (단순화)
    P(c, 4, 4, 2, 57, o); P(c, 4, 3, 2, 1, '#ffd23f');
    P(c, 6, 5, 15, 10, o); P(c, 7, 6, 13, 8, '#ffffff');
    P(c, 12, 8, 3, 2, '#e5484d'); P(c, 12, 10, 3, 2, '#2f6fd6'); P(c, 11, 9, 1, 2, '#e5484d'); P(c, 15, 10, 1, 1, '#2f6fd6');
    P(c, 8, 7, 2, 1, '#222'); P(c, 17, 7, 2, 1, '#222'); P(c, 8, 12, 2, 1, '#222'); P(c, 17, 12, 2, 1, '#222');
    // 본관
    P(c, 14, 18, 64, 42, o); P(c, 15, 19, 62, 40, '#f8f9ff');
    P(c, 15, 19, 62, 4, '#4f7fe0'); P(c, 15, 23, 62, 1, '#a9c3ff');
    for (let y = 27; y < 46; y += 9) for (let x = 19; x < 74; x += 8) { if (x > 37 && x < 54) continue; P(c, x, y, 5, 6, o); P(c, x + 1, y + 1, 3, 4, '#a2d8fb'); P(c, x + 1, y + 1, 1, 1, '#fff'); }
    // 입구 박공 + 기둥
    for (let yy = 0; yy < 7; yy++) P(c, 46 - 3 - yy * 1.6, 25 + yy, 6 + yy * 3.2, 1, yy === 6 ? o : '#e3e9ff');
    for (let yy = 0; yy < 7; yy++) { P(c, 46 - 4 - yy * 1.6, 25 + yy, 1, 1, o); P(c, 46 + 2 + yy * 1.6, 25 + yy, 1, 1, o); }
    for (const x of [38, 43, 49, 54]) { P(c, x, 32, 3, 20, o); P(c, x + 1, 32, 1, 20, '#ffffff'); }
    P(c, 41, 40, 13, 12, o); P(c, 42, 41, 11, 11, '#bde9ff'); P(c, 47, 41, 1, 11, o);
    // 계단
    P(c, 34, 52, 26, 3, '#d9dceb'); P(c, 32, 55, 30, 3, '#c9cde0'); P(c, 30, 58, 34, 2, '#b9bed4');
    // 간판 띠
    P(c, 24, 46, 12, 4, '#2f6fd6'); P(c, 58, 46, 14, 4, '#2f6fd6');
    // 화단
    for (const x of [17, 66]) { P(c, x, 54, 10, 5, '#c97b4a'); P(c, x, 51, 10, 4, '#6fd08c'); P(c, x + 2, 51, 1, 1, '#ff8fb1'); P(c, x + 6, 52, 1, 1, '#fff27a'); }
    return can;
  }

  G.GorgoArt = { TS, C, cv, P, blob, darken, paintGround, makeTree, makeHouse, makeApt, makeTower, makeContainers, makeCrane, makePylon,
                  makeLighthouse, makeBusanTower, makeStation, makeOffice, makeImmigration };
})(window);
