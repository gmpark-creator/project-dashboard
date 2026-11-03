/* =========================================================================
   AGENT GORGO WORLD — 게임 루프 / 입력 / 카메라 / 업무 존
   ========================================================================= */
(function () {
  'use strict';
  const A = window.GorgoArt, TS = A.TS;
  const map = window.GorgoMapGen.generate();
  const { W, H, T, tiles, hash } = map;
  const WPX = W * TS, HPX = H * TS;
  const getT = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.DEEP : tiles[y * W + x];
  const isWaterT = (t) => t === T.DEEP || t === T.SHALLOW || t === T.RIVER;

  /* ---------- 캔버스 ---------- */
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');
  let scale = 3, VW = 320, VH = 200;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    scale = Math.max(2, Math.min(5, Math.round(Math.min(w / (30 * TS), h / (17 * TS)))));
    VW = Math.ceil(w / scale); VH = Math.ceil(h / scale);
    canvas.width = VW; canvas.height = VH;
    canvas.style.width = VW * scale + 'px'; canvas.style.height = VH * scale + 'px';
    ctx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize); resize();

  /* ---------- 월드 빌드 ---------- */
  const ground = A.paintGround(map);
  const cache = new Map();
  const spr = (key, fn) => { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); };

  const objects = [];      // {img, x, y(foot px), ox, oy}
  const solids = [];       // {x,y,w,h}
  const solidGrid = new Map();
  function addSolid(r) {
    solids.push(r);
    for (let ty = Math.floor(r.y / TS); ty <= Math.floor((r.y + r.h) / TS); ty++)
      for (let tx = Math.floor(r.x / TS); tx <= Math.floor((r.x + r.w) / TS); tx++) {
        const k = ty * W + tx; if (!solidGrid.has(k)) solidGrid.set(k, []); solidGrid.get(k).push(r);
      }
  }
  function place(img, fx, fy, bottomInset, solid) {
    const o = { img, x: fx, y: fy, ox: Math.round(fx - img.width / 2), oy: Math.round(fy - img.height + (bottomInset || 0)) };
    objects.push(o);
    if (solid) addSolid({ x: fx + solid[0], y: fy + solid[1], w: solid[2], h: solid[3] });
    return o;
  }

  for (const o of map.objs) {
    const fx = o.x * TS, fy = o.y * TS;
    switch (o.type) {
      case 'tree': place(spr('tree' + o.v, () => A.makeTree(o.v)), fx, fy, 2, [-3, -4, 6, 4]); break;
      case 'house': place(spr('house' + o.v, () => A.makeHouse(o.v)), fx, fy, 1, [-9, -9, 18, 8]); break;
      case 'apt': place(spr('apt' + o.v + o.h, () => A.makeApt(o.v, o.h)), fx, fy, 1, [-15, -10, 30, 9]); break;
      case 'tower': place(spr('tow' + o.v + o.h, () => A.makeTower(o.v, o.h)), fx, fy, 1, [-13, -10, 26, 9]); break;
      case 'container': place(spr('ct' + o.v + o.h, () => A.makeContainers(o.v, o.h)), fx, fy, 1, [-8, -7, 16, 6]); break;
      case 'crane': place(spr('cr' + o.v, () => A.makeCrane(o.v)), fx, fy, 1, null); addSolid({ x: fx - 13, y: fy - 4, w: 4, h: 3 }); addSolid({ x: fx + 9, y: fy - 4, w: 4, h: 3 }); break;
      case 'pylon': place(spr('pylon', () => makePylonSlim()), fx, fy - 2, 0, null); break;
    }
  }
  function makePylonSlim() {
    const c = A.cv(16, 84), x = c.getContext('2d'), o = '#4b5470';
    for (const lx of [2, 10]) { A.P(x, lx, 2, 4, 82, o); A.P(x, lx + 1, 3, 2, 81, '#eef2fb'); A.P(x, lx + 3, 3, 1, 81, '#bcc5d8'); }
    for (const y of [8, 30, 52]) { A.P(x, 2, y, 12, 3, o); A.P(x, 3, y + 1, 10, 1, '#eef2fb'); }
    A.P(x, 3, 0, 2, 2, '#ff5a5a'); A.P(x, 11, 0, 2, 2, '#ff5a5a');
    return c;
  }

  // 랜드마크
  const zones = [];
  for (const l of map.landmarks) {
    const fx = l.x * TS, fy = l.y * TS;
    if (l.kind === 'office') {
      place(spr('office', A.makeOffice), fx, fy, 1, [-22, -40, 44, 34]);
      addSolid({ x: fx - 30, y: fy - 10, w: 6, h: 6 }); addSolid({ x: fx + 24, y: fy - 10, w: 6, h: 6 });
      zones.push({ ...l, dx: fx, dy: fy + 8 });
    } else if (l.kind === 'immigration') {
      const o = place(spr('immig', A.makeImmigration), fx, fy, 1, null);
      addSolid({ x: o.ox + 14, y: fy - 42, w: 64, h: 32 }); addSolid({ x: o.ox + 3, y: fy - 4, w: 4, h: 3 });
      zones.push({ ...l, dx: o.ox + 47, dy: fy + 6 });
    } else if (l.kind === 'station') place(spr('station', A.makeStation), fx, fy, 1, [-34, -24, 68, 22]);
    else if (l.kind === 'busantower') place(spr('btower', A.makeBusanTower), fx, fy, 1, [-4, -6, 8, 5]);
    else if (l.kind === 'lighthouse') place(spr('lh', A.makeLighthouse), fx, fy, 1, [-5, -6, 10, 5]);
  }

  /* ---------- 배 · 갈매기 · 구름 ---------- */
  function makeShip(v) {
    const c = A.cv(40, 20), x = c.getContext('2d'), o = '#3b3352';
    const band = ['#ff6b6b', '#4dabf7', '#ffb84d'][v % 3];
    A.P(x, 2, 11, 36, 6, o); A.P(x, 3, 12, 34, 4, '#ffffff'); A.P(x, 3, 14, 34, 2, band); A.P(x, 4, 17, 32, 1, o);
    if (v % 2) { for (let i = 0; i < 4; i++) { const cc = ['#ff6b6b', '#ffd43b', '#69db7c', '#4dabf7'][i]; A.P(x, 6 + i * 6, 7, 6, 4, o); A.P(x, 7 + i * 6, 8, 4, 3, cc); } A.P(x, 30, 3, 6, 8, o); A.P(x, 31, 4, 4, 6, '#fff'); A.P(x, 31, 5, 4, 1, '#7ec8f2'); }
    else { A.P(x, 10, 5, 20, 6, o); A.P(x, 11, 6, 18, 5, '#fff7ec'); for (let i = 12; i < 28; i += 4) A.P(x, i, 7, 2, 2, '#7ec8f2'); A.P(x, 22, 1, 4, 5, o); A.P(x, 23, 2, 2, 3, band); }
    return c;
  }
  const ships = [];
  const lanes = [{ y: 66, a: 100, b: 150 }, { y: 73, a: 92, b: 150 }, { y: 84, a: 0, b: 150 }, { y: 88, a: 0, b: 150 }, { y: 82, a: 76, b: 150 }];
  lanes.forEach((ln, i) => { for (let k = 0; k < 2; k++) ships.push({ lane: ln, x: (ln.a + (ln.b - ln.a) * (k * 0.5 + i * 0.13)) * TS, dir: i % 2 ? -1 : 1, spd: 8 + (i * 3) % 7, img: makeShip(i + k), ph: i + k }); });
  const gulls = Array.from({ length: 9 }, (_, i) => ({ cx: [100, 125, 80, 60, 30, 110, 140, 70, 45][i] * TS, cy: [55, 50, 62, 66, 70, 62, 45, 76, 64][i] * TS, r: 60 + i * 9, sp: 0.25 + (i % 4) * 0.07, ph: i * 1.7 }));
  const clouds = Array.from({ length: 7 }, (_, i) => ({ x: (i * 23 % W) * TS, y: ((i * 37) % H) * TS, rx: 60 + (i * 13) % 50, ry: 26 + (i * 7) % 16, sp: 6 + i % 3 * 3 }));

  /* ---------- 플레이어 ---------- */
  const frames = window.Gorgo.build();
  const office = zones.find(z => z.id === 'office');
  const Q = new URLSearchParams(location.search), AT = (Q.get("at") || "").split(",").map(Number);
  const player = { x: AT.length === 2 ? AT[0] * TS : office.dx, y: AT.length === 2 ? AT[1] * TS : office.dy + 14, dir: 'down', moving: false, dist: 0, blink: 0, nextBlink: 2.5, running: false };
  const HB = { w: 8, h: 4 };
  function blocked(px, py) {
    const x0 = px - HB.w / 2, y0 = py - HB.h, x1 = px + HB.w / 2 - 0.01, y1 = py - 0.01;
    for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) {
      const t = getT(Math.floor(cx / TS), Math.floor(cy / TS)); if (isWaterT(t)) return true;
    }
    for (let ty = Math.floor(y0 / TS); ty <= Math.floor(y1 / TS); ty++) for (let tx = Math.floor(x0 / TS); tx <= Math.floor(x1 / TS); tx++) {
      const list = solidGrid.get(ty * W + tx); if (!list) continue;
      for (const r of list) if (x1 > r.x && x0 < r.x + r.w && y1 > r.y && y0 < r.y + r.h) return true;
    }
    return false;
  }

  /* ---------- 입력 ---------- */
  const keys = new Set();
  let target = null; // 클릭 이동
  const panelOpen = () => document.body.classList.contains('panel-open');
  window.addEventListener('keydown', (e) => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(k)) e.preventDefault();
    hideIntro();
    if (k === 'escape') { closePanel(); return; }
    if ((k === ' ' || k === 'enter' || k === 'e') && !panelOpen()) { if (nearZone) openPanel(nearZone); return; }
    keys.add(k); target = null;
  });
  window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());
  canvas.addEventListener('pointerdown', (e) => {
    hideIntro(); if (panelOpen()) return;
    if (e.pointerType === 'touch') return; // 터치는 조이스틱
    target = { x: cam.x + e.clientX / scale, y: cam.y + e.clientY / scale };
    spawnRipple(target.x, target.y);
  });

  // 모바일 조이스틱
  const joy = { active: false, id: null, sx: 0, sy: 0, dx: 0, dy: 0 };
  const joyEl = document.getElementById('joy'), joyKnob = document.getElementById('joy-knob');
  window.addEventListener('touchstart', (e) => {
    hideIntro(); if (panelOpen()) return;
    for (const t of e.changedTouches) {
      if (t.target.closest && t.target.closest('.no-joy')) continue;
      if (!joy.active) { joy.active = true; joy.id = t.identifier; joy.sx = t.clientX; joy.sy = t.clientY; joy.dx = joy.dy = 0;
        joyEl.style.display = 'block'; joyEl.style.left = t.clientX + 'px'; joyEl.style.top = t.clientY + 'px'; joyKnob.style.transform = 'translate(-50%,-50%)'; }
    }
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) if (t.identifier === joy.id) {
      let dx = t.clientX - joy.sx, dy = t.clientY - joy.sy; const d = Math.hypot(dx, dy), m = 42;
      if (d > m) { dx = dx / d * m; dy = dy / d * m; }
      joy.dx = dx / m; joy.dy = dy / m; joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
  }, { passive: true });
  const endTouch = (e) => { for (const t of e.changedTouches) if (t.identifier === joy.id) { joy.active = false; joy.dx = joy.dy = 0; joyEl.style.display = 'none'; } };
  window.addEventListener('touchend', endTouch); window.addEventListener('touchcancel', endTouch);
  document.getElementById('act-btn').addEventListener('click', () => { if (nearZone && !panelOpen()) openPanel(nearZone); });

  /* ---------- 파티클 ---------- */
  const parts = [];
  function spawnDust(x, y) { for (let i = 0; i < 2; i++) parts.push({ x: x + (Math.random() - 0.5) * 6, y: y - 1, vx: (Math.random() - 0.5) * 12, vy: -6 - Math.random() * 6, life: 0.45, max: 0.45, k: 'dust' }); }
  function spawnRipple(x, y) { parts.push({ x, y, life: 0.5, max: 0.5, k: 'ring' }); }
  function spawnSparkle(x, y) { for (let i = 0; i < 10; i++) { const a = Math.random() * 6.28, s = 20 + Math.random() * 30; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 10, life: 0.7, max: 0.7, k: 'star' }); } }

  /* ---------- 카메라 ---------- */
  const cam = { x: player.x - VW / 2, y: player.y - VH / 2 };
  function updateCam(dt, snap) {
    const tx = Math.max(0, Math.min(WPX - VW, player.x - VW / 2)), ty = Math.max(0, Math.min(HPX - VH, player.y - 12 - VH / 2));
    const k = snap ? 1 : 1 - Math.pow(0.0015, dt);
    cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
  }

  /* ---------- DOM 라벨 ---------- */
  const labelLayer = document.getElementById('labels');
  const domLabels = [];
  for (const l of map.labels) {
    const el = document.createElement('div'); el.className = 'place k-' + l.k; el.textContent = l.t; labelLayer.appendChild(el);
    domLabels.push({ el, x: l.x * TS, y: l.y * TS });
  }
  for (const l of map.landmarks) {
    if (l.zone) continue;
    const el = document.createElement('div'); el.className = 'place k-landmark'; el.textContent = l.name; labelLayer.appendChild(el);
    domLabels.push({ el, x: l.x * TS, y: l.y * TS + 10 });
  }
  for (const z of zones) {
    const el = document.createElement('div'); el.className = 'zone-tag';
    el.innerHTML = `<span class="zt-bang">!</span><b>${z.name}</b><small>${z.sub}</small>`;
    labelLayer.appendChild(el);
    z.tag = el;
    const ring = { x: z.dx, y: z.dy };
    z.ring = ring;
  }
  const nameEl = document.createElement('div'); nameEl.className = 'nameplate'; nameEl.textContent = '에이전트 고르고'; labelLayer.appendChild(nameEl);
  const promptEl = document.createElement('div'); promptEl.className = 'prompt'; labelLayer.appendChild(promptEl);

  /* ---------- HUD ---------- */
  const locEl = document.getElementById('loc-name'), coordEl = document.getElementById('loc-coord');
  let lastDistrict = '';
  function districtAt(x, y) {
    const tx = x / TS, ty = y / TS; let best = null, bd = 1e9;
    for (const d of map.districts) { const dd = (d[1] - tx) ** 2 + (d[2] - ty) ** 2; if (dd < bd) { bd = dd; best = d[0]; } }
    return best;
  }
  // 미니맵
  const mm = document.getElementById('minimap'), mctx = mm.getContext('2d');
  mm.width = W * 2; mm.height = H * 2;
  const mmBase = A.cv(W * 2, H * 2); {
    const c = mmBase.getContext('2d');
    const col = { [T.DEEP]: '#5aaee8', [T.SHALLOW]: '#80cdf3', [T.RIVER]: '#80cdf3', [T.GRASS]: '#a3dc7a', [T.SAND]: '#fbe7b0', [T.ROAD]: '#fff3dc', [T.PLAZA]: '#f3ecfa', [T.FARM]: '#d6ad78', [T.FOREST]: '#6db75a', [T.QUAY]: '#c7cdd8', [T.BRIDGE]: '#ffffff' };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) A.P(c, x * 2, y * 2, 2, 2, col[getT(x, y)]);
  }

  /* ---------- 패널 (업무 존) ---------- */
  const panel = document.getElementById('panel');
  const ZONE_CONTENT = {
    office: {
      icon: '🏢', color: '#4f8cff', title: '센텀시티 사무실', en: 'AGENT GORGO HQ · CENTUM CITY',
      intro: '에이전트 고르고의 본부. 서류 작성과 정산 업무가 이곳에 차례로 들어옵니다.',
      items: [
        { t: '인보이스 작성', d: 'Commercial Invoice · 견적/청구 서류', s: '예정' },
        { t: '업무 슬롯', d: '박사님 지시에 따라 순차 추가', s: '대기' },
      ],
    },
    immigration: {
      icon: '🛂', color: '#2f6fd6', title: '부산출입국·외국인청', en: 'BUSAN IMMIGRATION OFFICE · JUNGANG-DONG',
      intro: '선원·승선 관련 출입국 서류를 처리하는 창구입니다.',
      items: [
        { t: 'EDI 전송 정정(삭제) 신청서', d: '입항 명부 승객·선원 정정', s: '예정' },
        { t: '본선 선원명부 (Crew List)', d: '본선 선원명부 양식 작성', s: '예정' },
        { t: '업무 슬롯', d: '박사님 지시에 따라 순차 추가', s: '대기' },
      ],
    },
  };
  function openPanel(z) {
    const c = ZONE_CONTENT[z.id]; if (!c) return;
    panel.style.setProperty('--zc', c.color);
    panel.querySelector('.p-icon').textContent = c.icon;
    panel.querySelector('.p-title').textContent = c.title;
    panel.querySelector('.p-en').textContent = c.en;
    panel.querySelector('.p-intro').textContent = c.intro;
    panel.querySelector('.p-list').innerHTML = c.items.map((it, i) =>
      `<li style="--i:${i}"><div><b>${it.t}</b><small>${it.d}</small></div><span class="chip ${it.s === '예정' ? 'soon' : 'wait'}">${it.s === '예정' ? '곧 추가' : '빈 슬롯'}</span></li>`).join('');
    document.body.classList.add('panel-open');
    keys.clear(); target = null;
    spawnSparkle(z.dx, z.dy - 6);
  }
  function closePanel() { document.body.classList.remove('panel-open'); }
  panel.querySelector('.p-close').addEventListener('click', closePanel);
  document.getElementById('panel-dim').addEventListener('click', closePanel);

  /* ---------- 인트로 ---------- */
  const intro = document.getElementById('intro');
  let introShown = true;
  function hideIntro() { if (!introShown) return; introShown = false; intro.classList.add('gone'); }
  intro.addEventListener('click', hideIntro);
  if (Q.has('nointro')) hideIntro();
  if (Q.get('open')) setTimeout(() => openPanel(zones.find(z => z.id === Q.get('open'))), 300);

  /* ---------- 업데이트 ---------- */
  let nearZone = null, dustT = 0, time = 0;
  function update(dt) {
    time += dt;
    let ix = 0, iy = 0;
    if (!panelOpen()) {
      if (keys.has('arrowleft') || keys.has('a')) ix -= 1;
      if (keys.has('arrowright') || keys.has('d')) ix += 1;
      if (keys.has('arrowup') || keys.has('w')) iy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) iy += 1;
      if (joy.active && Math.hypot(joy.dx, joy.dy) > 0.2) { ix = joy.dx; iy = joy.dy; }
      if (!ix && !iy && target) {
        const dx = target.x - player.x, dy = target.y - player.y, d = Math.hypot(dx, dy);
        if (d < 2) target = null; else { ix = dx / d; iy = dy / d; }
      }
    }
    const len = Math.hypot(ix, iy);
    player.running = keys.has('shift') || (joy.active && Math.hypot(joy.dx, joy.dy) > 0.92);
    player.moving = len > 0.01;
    if (player.moving) {
      ix /= Math.max(1, len); iy /= Math.max(1, len);
      const sp = (player.running ? 128 : 74) * dt;
      const nx = player.x + ix * sp, ny = player.y + iy * sp;
      let moved = false;
      if (!blocked(nx, player.y)) { player.x = nx; moved = true; }
      if (!blocked(player.x, ny)) { player.y = ny; moved = true; }
      if (!moved && target) target = null;
      if (Math.abs(ix) > Math.abs(iy) + 0.05) player.dir = ix > 0 ? 'right' : 'left'; else player.dir = iy > 0 ? 'down' : 'up';
      player.dist += sp;
      dustT -= dt; if (dustT <= 0) { dustT = player.running ? 0.09 : 0.2; spawnDust(player.x, player.y); }
    } else player.dist = 0;
    player.x = Math.max(8, Math.min(WPX - 8, player.x)); player.y = Math.max(20, Math.min(HPX - 4, player.y));

    player.nextBlink -= dt; if (player.nextBlink <= 0) { player.blink = 0.14; player.nextBlink = 2 + Math.random() * 3; }
    player.blink = Math.max(0, player.blink - dt);

    // 존 감지
    nearZone = null;
    for (const z of zones) if (Math.hypot(player.x - z.dx, player.y - z.dy) < 26) nearZone = z;

    for (const s of ships) { s.x += s.dir * s.spd * dt; const a = s.lane.a * TS - 40, b = s.lane.b * TS + 40; if (s.x > b) s.x = a; if (s.x < a) s.x = b; }
    for (const c of clouds) { c.x += c.sp * dt; if (c.x - c.rx > WPX) c.x = -c.rx; }
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; } if (p.vx !== undefined) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 30 * dt; } }

    updateCam(dt);

    const d = districtAt(player.x, player.y);
    if (d !== lastDistrict) { lastDistrict = d; locEl.textContent = d; locEl.parentElement.classList.remove('pop'); void locEl.offsetWidth; locEl.parentElement.classList.add('pop'); }
    coordEl.textContent = `${(player.x / TS).toFixed(0).padStart(3, '0')} · ${(player.y / TS).toFixed(0).padStart(3, '0')}`;
  }

  /* ---------- 렌더 ---------- */
  function draw() {
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    ctx.fillStyle = A.C.deep; ctx.fillRect(0, 0, VW, VH);
    ctx.drawImage(ground, cx, cy, VW, VH, 0, 0, VW, VH);

    // 물결 반짝임
    const tx0 = Math.floor(cx / TS), ty0 = Math.floor(cy / TS), tx1 = Math.ceil((cx + VW) / TS), ty1 = Math.ceil((cy + VH) / TS);
    const tick = Math.floor(time * 2.2);
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      if (!isWaterT(getT(tx, ty))) continue;
      const h = hash(tx, ty, 77);
      if (hash(tx, ty, tick + Math.floor(h * 7)) < 0.16) {
        const sx = tx * TS - cx + Math.floor(h * 10) + 2, sy = ty * TS - cy + Math.floor(hash(tx, ty, 78) * 10) + 3;
        ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(sx, sy, 3, 1); ctx.fillRect(sx + 1, sy - 1, 1, 1);
      }
      const wv = Math.sin(time * 1.6 + tx * 0.7 + ty * 0.35);
      if (wv > 0.82) { ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(tx * TS - cx + 3, ty * TS - cy + 8, 9, 1); }
    }

    // 배
    for (const s of ships) {
      const sx = Math.round(s.x - cx - 20), sy = Math.round(s.lane.y * TS - cy - 14 + Math.sin(time * 2 + s.ph) * 1.2);
      if (sx < -50 || sy < -30 || sx > VW + 10 || sy > VH + 10) continue;
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      for (let i = 1; i < 5; i++) ctx.fillRect(s.dir > 0 ? sx - i * 5 : sx + 40 + i * 3, sy + 16 + (i % 2), 3, 1);
      ctx.save(); if (s.dir < 0) { ctx.translate(sx * 2 + 40, 0); ctx.scale(-1, 1); }
      ctx.drawImage(s.img, sx, sy); ctx.restore();
    }

    // 존 바닥 링
    for (const z of zones) {
      const zx = Math.round(z.dx - cx), zy = Math.round(z.dy - cy), pulse = (Math.sin(time * 3) + 1) / 2;
      ctx.fillStyle = `rgba(255,214,64,${0.22 + pulse * 0.25})`;
      ellipse(zx, zy, 15 + pulse * 3, 6 + pulse, true);
      ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 6; i++) { const a = time * 1.5 + i * 1.047; ctx.fillRect(Math.round(zx + Math.cos(a) * 15), Math.round(zy + Math.sin(a) * 6), 2, 2); }
    }

    // y정렬 오브젝트 + 플레이어
    const vis = [];
    for (const o of objects) { if (o.ox - cx > VW || o.ox + o.img.width - cx < 0 || o.oy - cy > VH || o.oy + o.img.height - cy < 0) continue; vis.push(o); }
    vis.push({ player: true, y: player.y });
    vis.sort((a, b) => a.y - b.y);
    for (const o of vis) {
      if (o.player) { drawPlayer(cx, cy); continue; }
      ctx.fillStyle = 'rgba(40,50,80,.18)';
      ellipse(Math.round(o.x - cx), Math.round(o.y - cy - 1), Math.max(5, o.img.width * 0.42), 3, true);
      ctx.drawImage(o.img, o.ox - cx, o.oy - cy);
    }

    // 다리 케이블
    for (const b of map.bridges) drawCables(b, cx, cy);

    // 파티클
    for (const p of parts) {
      const a = p.life / p.max, px = Math.round(p.x - cx), py = Math.round(p.y - cy);
      if (p.k === 'dust') { ctx.fillStyle = `rgba(255,248,230,${a * 0.9})`; ctx.fillRect(px, py, 2, 2); }
      else if (p.k === 'ring') { ctx.strokeStyle = `rgba(255,214,64,${a})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(px + 0.5, py + 0.5, 4 + (1 - a) * 10, 2 + (1 - a) * 4, 0, 0, 6.29); ctx.stroke(); }
      else { ctx.fillStyle = `rgba(255,${200 + Math.floor(a * 55)},80,${a})`; ctx.fillRect(px, py, 2, 2); }
    }

    // 갈매기
    for (const g of gulls) {
      const a = time * g.sp + g.ph, gx = g.cx + Math.cos(a) * g.r, gy = g.cy + Math.sin(a * 1.3) * g.r * 0.45;
      const sx = Math.round(gx - cx), sy = Math.round(gy - cy); if (sx < -10 || sy < -10 || sx > VW + 10 || sy > VH + 30) continue;
      ctx.fillStyle = 'rgba(30,50,90,.15)'; ctx.fillRect(sx - 2, sy + 22, 5, 1);
      const up = Math.sin(time * 10 + g.ph) > 0;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(sx - 1, sy, 3, 1);
      ctx.fillStyle = '#5a6078';
      if (up) { ctx.fillRect(sx - 3, sy - 2, 1, 1); ctx.fillRect(sx - 2, sy - 1, 1, 1); ctx.fillRect(sx + 3, sy - 2, 1, 1); ctx.fillRect(sx + 2, sy - 1, 1, 1); }
      else { ctx.fillRect(sx - 3, sy + 1, 2, 1); ctx.fillRect(sx + 2, sy + 1, 2, 1); }
    }

    // 구름 그림자
    for (const c of clouds) { ctx.fillStyle = 'rgba(40,60,110,.07)'; ellipse(Math.round(c.x - cx), Math.round(c.y - cy), c.rx, c.ry, true); }

    positionDom(cx, cy);
    drawMinimap();
  }

  function ellipse(x, y, rx, ry, fill) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832); if (fill) ctx.fill(); }

  function drawPlayer(cx, cy) {
    const fr = frames[player.dir][player.blink > 0 ? 1 : 0];
    const idx = player.moving ? Math.floor(player.dist / (player.running ? 7 : 6)) % 4 : 0;
    const bob = player.moving ? (idx % 2 ? -1 : 0) : (Math.sin(time * 2.4) > 0.6 ? -1 : 0) * 0;
    const px = Math.round(player.x - cx), py = Math.round(player.y - cy);
    ctx.fillStyle = 'rgba(40,40,70,.28)'; ellipse(px, py - 1, 6, 2.2, true);
    ctx.drawImage(fr[idx], px - 8, py - 21 + bob);
  }

  function drawCables(b, cx, cy) {
    const deckY = b.a[1] * TS - 4, topY = deckY + 10 - 84;
    const p1 = b.p1 * TS, p2 = b.p2 * TS, ax = b.a[0] * TS, bx = b.b[0] * TS;
    if (Math.max(ax, bx) - cx < -10 || Math.min(ax, bx) - cx > VW + 10 || deckY - cy < -10 || topY - cy > VH + 10) return;
    const seg = (x0, y0, x1, y1, sag) => {
      const n = Math.ceil(Math.abs(x1 - x0));
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t);
        ctx.fillStyle = '#f4f7ff'; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), 1, 1);
        if (i % 6 === 3) { ctx.fillStyle = 'rgba(244,247,255,.55)'; ctx.fillRect(Math.round(x - cx), Math.round(y - cy) + 1, 1, Math.max(0, Math.round(deckY - y - 1))); }
      }
    };
    for (const off of [-0.5, 0.5]) {
      seg(ax, deckY, p1 + off * 8, topY + 2, 18);
      seg(p1 + off * 8, topY + 2, p2 + off * 8, topY + 2, 62);
      seg(p2 + off * 8, topY + 2, bx, deckY, 18);
    }
  }

  function positionDom(cx, cy) {
    const S = scale;
    for (const l of domLabels) {
      const sx = (l.x - cx) * S, sy = (l.y - cy) * S, vis = sx > -120 && sy > -40 && sx < window.innerWidth + 120 && sy < window.innerHeight + 40;
      l.el.style.display = vis ? '' : 'none'; if (vis) l.el.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-50%)`;
    }
    for (const z of zones) {
      const top = z.id === 'office' ? 108 : 66;
      const sx = (z.dx - cx) * S, sy = (z.dy - 8 - top - cy) * S;
      z.tag.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-100%)`;
      z.tag.classList.toggle('near', nearZone === z);
    }
    const px = (player.x - cx) * S, py = (player.y - cy) * S;
    nameEl.style.transform = `translate(${px}px,${py + 4 * S}px) translate(-50%,0)`;
    if (nearZone && !panelOpen()) {
      promptEl.style.display = ''; promptEl.innerHTML = `<kbd>Space</kbd> ${nearZone.name} 들어가기`;
      promptEl.style.transform = `translate(${px}px,${py - 30 * S}px) translate(-50%,-100%)`;
    } else promptEl.style.display = 'none';
    document.getElementById('act-btn').classList.toggle('on', !!nearZone && !panelOpen());
  }

  function drawMinimap() {
    mctx.drawImage(mmBase, 0, 0);
    mctx.strokeStyle = 'rgba(60,50,90,.85)'; mctx.lineWidth = 1;
    mctx.strokeRect(Math.round(cam.x / TS * 2) + 0.5, Math.round(cam.y / TS * 2) + 0.5, Math.round(VW / TS * 2), Math.round(VH / TS * 2));
    for (const z of zones) { mctx.fillStyle = '#ffd23f'; mctx.fillRect(Math.round(z.dx / TS * 2) - 2, Math.round(z.dy / TS * 2) - 2, 5, 5); mctx.fillStyle = '#c0392b'; mctx.fillRect(Math.round(z.dx / TS * 2) - 1, Math.round(z.dy / TS * 2) - 1, 3, 3); }
    const blink = Math.sin(time * 8) > 0;
    mctx.fillStyle = blink ? '#ff4d6d' : '#ffffff';
    mctx.fillRect(Math.round(player.x / TS * 2) - 2, Math.round(player.y / TS * 2) - 2, 5, 5);
  }

  /* ---------- 루프 ---------- */
  let last = performance.now();
  updateCam(0, true);
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    update(dt); draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  window.__gorgo = { player, map, zones, openPanel, closePanel, cam };
})();
