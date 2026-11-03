// OSM 원자료(RAW_DIR) → 게임 타일 격자(data/busan-osm.js)
// 사용: node tools/osm-to-grid.mjs <RAW_DIR>
// 출력 데이터는 OSM 유래 Derivative Database → ODbL 1.0 (© OpenStreetMap contributors)
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const RAW = process.argv[2]; if (!RAW) throw new Error("RAW_DIR 필요");
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "..", "data", "busan-osm.js");
const J = (k) => JSON.parse(fs.readFileSync(path.join(RAW, k + ".json"), "utf8"));

// ---- 투영 (등거리 원통, 1타일 ≈ 140m) ----
const BB = { s: 34.98, w: 128.74, n: 35.25, e: 129.20 };
const W = 300, H = 214, SS = 4;                     // SS = 슈퍼샘플 배수
const GW = W * SS, GH = H * SS;
const px = (lon) => (lon - BB.w) / (BB.e - BB.w) * W;
const py = (lat) => (BB.n - lat) / (BB.n - BB.s) * H;

// ---- 유틸 ----
function waysOf(el) { // way 또는 relation(members) → [[ [x,y],... ], ...] (타일 좌표)
  const out = [];
  const conv = (g) => g.map(p => [px(p.lon), py(p.lat)]);
  if (el.type === "way" && el.geometry) out.push(conv(el.geometry));
  if (el.type === "relation" && el.members) for (const m of el.members) if (m.type === "way" && m.geometry) out.push(conv(m.geometry));
  return out;
}
// 짝홀 규칙 스캔라인 채우기 (링 조립 없이 세그먼트 집합으로 동작)
function fillEvenOdd(lines, grid, gw, gh, s, val, onlyIf) {
  const segs = [];
  for (const l of lines) for (let i = 0; i < l.length - 1; i++) segs.push([l[i][0] * s, l[i][1] * s, l[i + 1][0] * s, l[i + 1][1] * s]);
  if (!segs.length) return;
  let miny = Infinity, maxy = -Infinity;
  for (const g of segs) { miny = Math.min(miny, g[1], g[3]); maxy = Math.max(maxy, g[1], g[3]); }
  const y0 = Math.max(0, Math.floor(miny)), y1 = Math.min(gh - 1, Math.ceil(maxy));
  for (let y = y0; y <= y1; y++) {
    const cy = y + 0.5, xs = [];
    for (const [ax, ay, bx, by] of segs) if ((ay > cy) !== (by > cy)) xs.push(ax + (cy - ay) * (bx - ax) / (by - ay));
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const xa = Math.max(0, Math.ceil(xs[k] - 0.5)), xb = Math.min(gw - 1, Math.floor(xs[k + 1] - 0.5));
      for (let x = xa; x <= xb; x++) { const i = y * gw + x; if (!onlyIf || onlyIf(i)) grid[i] = val; }
    }
  }
}
function drawLine(grid, gw, gh, ax, ay, bx, by, val) { // supercover 래스터
  const n = Math.ceil(Math.max(Math.abs(bx - ax), Math.abs(by - ay)) * 2) + 1;
  for (let i = 0; i <= n; i++) {
    const x = Math.floor(ax + (bx - ax) * i / n), y = Math.floor(ay + (by - ay) * i / n);
    for (const [ox, oy] of [[0, 0], [1, 0], [0, 1]]) { const X = x + ox, Y = y + oy; if (X >= 0 && Y >= 0 && X < gw && Y < gh) grid[Y * gw + X] = val; }
  }
}
function simplify(pts, eps) { // Douglas–Peucker
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  let md = -1, mi = 0; const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / L; if (d > md) { md = d; mi = i; } }
  if (md <= eps) return [pts[0], pts[pts.length - 1]];
  return simplify(pts.slice(0, mi + 1), eps).slice(0, -1).concat(simplify(pts.slice(mi), eps));
}

// ---- 1) 바다/육지: 해안선 장벽 + 남쪽 바다 시드 flood fill (슈퍼샘플) ----
const BAR = 1, SEA = 2;
const sub = new Uint8Array(GW * GH);
for (const el of J("coastline").elements) for (const l of waysOf(el)) for (let i = 0; i < l.length - 1; i++)
  drawLine(sub, GW, GH, l[i][0] * SS, l[i][1] * SS, l[i + 1][0] * SS, l[i + 1][1] * SS, BAR);
{
  const q = new Int32Array(GW * GH); let h = 0, t = 0;
  const seeds = [[GW * 0.5, GH - 2], [GW * 0.85, GH - 2], [GW * 0.3, GH - 2], [GW - 2, GH * 0.7]];
  for (const [sx, sy] of seeds) { const i = Math.floor(sy) * GW + Math.floor(sx); if (!sub[i]) { sub[i] = SEA; q[t++] = i; } }
  while (h < t) { const i = q[h++], x = i % GW, y = (i / GW) | 0;
    if (x > 0 && !sub[i - 1]) { sub[i - 1] = SEA; q[t++] = i - 1; } if (x < GW - 1 && !sub[i + 1]) { sub[i + 1] = SEA; q[t++] = i + 1; }
    if (y > 0 && !sub[i - GW]) { sub[i - GW] = SEA; q[t++] = i - GW; } if (y < GH - 1 && !sub[i + GW]) { sub[i + GW] = SEA; q[t++] = i + GW; } }
  // 장벽 셀은 이웃 다수결
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { const i = y * GW + x; if (sub[i] !== BAR) continue; let s = 0, n = 0;
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { const X = x + ox, Y = y + oy; if (X < 0 || Y < 0 || X >= GW || Y >= GH) continue; const v = sub[Y * GW + X]; if (v === BAR) continue; n++; if (v === SEA) s++; }
    sub[i] = n && s * 2 > n ? 3 : 0; }
  for (let i = 0; i < sub.length; i++) if (sub[i] === 3) sub[i] = SEA;
}
// ---- 2) 강·호수 (슈퍼샘플, 육지 위에만) ----
const FW = 4; // fresh water 마크
for (const el of J("water").elements) fillEvenOdd(waysOf(el), sub, GW, GH, SS, FW, (i) => sub[i] !== SEA);

// ---- 다운샘플 → 기본 격자 ----
// 클래스: 0 바다, 1 강/호수, 2 육지, 3 산림, 4 시가지, 5 산업·항만, 6 농지
const cls = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let sea = 0, fw = 0;
  for (let oy = 0; oy < SS; oy++) for (let ox = 0; ox < SS; ox++) { const v = sub[(y * SS + oy) * GW + x * SS + ox]; if (v === SEA) sea++; else if (v === FW) fw++; }
  const half = SS * SS / 2;
  cls[y * W + x] = sea >= half ? 0 : (fw + sea) >= SS * SS * 0.25 ? 1 : 2; // 강은 25%만 차도 강으로 (끊김 방지)
}
// ---- 3) 토지이용 (육지 칸에만, 타일 해상도) ----
const landOnly = (i) => cls[i] >= 2;
for (const el of J("landuse").elements) {
  const lu = (el.tags && el.tags.landuse) || "";
  const v = /residential|commercial|retail/.test(lu) ? 4 : /industrial|port/.test(lu) ? 5 : lu === "farmland" ? 6 : 0;
  if (v) fillEvenOdd(waysOf(el), cls, W, H, 1, v, landOnly);
}
for (const el of J("forest").elements) fillEvenOdd(waysOf(el), cls, W, H, 1, 3, (i) => cls[i] === 2 || cls[i] === 6);

// ---- 4) 도로 (간선만: motorway/trunk/primary) — 단순화한 폴리라인 ----
const roads = [];
for (const el of J("roads").elements) {
  const hw = el.tags.highway, isBridge = !!el.tags.bridge && el.tags.bridge !== "no";
  if (!/^(motorway|trunk|primary)$/.test(hw) && !(hw === "secondary" && isBridge)) continue; // 간선 + 보조간선 다리(영도대교·부산대교 등)
  const nm = el.tags["bridge:name"] || el.tags.name || "";
  for (const l of waysOf(el)) { const s = simplify(l, 0.35); roads.push([hw === "primary" || hw === "secondary" ? 2 : 1, s.flatMap(p => [+p[0].toFixed(2), +p[1].toFixed(2)]), nm, isBridge ? 1 : 0]); }
}
// ---- 5) 부산광역시 경계 (선 + 안/밖 마스크 → cls 최상위 비트 0x80 = 부산 안) ----
const boundary = [];
{ const inB = new Uint8Array(W * H); for (const el of J("boundary").elements) fillEvenOdd(waysOf(el), inB, W, H, 1, 1);
  for (let i = 0; i < W * H; i++) if (inB[i]) cls[i] |= 0x80; }
for (const el of J("boundary").elements) for (const l of waysOf(el)) {
  const s = simplify(l, 0.4).filter(p => p[0] > -5 && p[0] < W + 5 && p[1] > -5 && p[1] < H + 5);
  if (s.length > 1) boundary.push(s.flatMap(p => [+p[0].toFixed(2), +p[1].toFixed(2)]));
}
// ---- 6) 산봉우리 ----
const peaks = J("peaks").elements.map(e => [+px(e.lon).toFixed(2), +py(e.lat).toFixed(2), e.tags.name, +(e.tags.ele || 0)]).filter(p => p[0] >= 0 && p[0] < W && p[1] >= 0 && p[1] < H);

// ---- 출력 ----
const b64 = Buffer.from(cls).toString("base64");
const log = JSON.parse(fs.readFileSync(path.join(RAW, "_fetchlog.json"), "utf8"));
const meta = { W, H, bbox: BB, projection: "equirectangular, x=(lon-W)/(E-W)*W, y=(N-lat)/(N-S)*H, 1 tile ≈ 140m", fetched: log.map(l => ({ layer: l.layer, at: l.fetchedAt, n: l.elements })) };
const js = `/* AGENT GORGO — 부산 실측 지형 격자 (자동 생성: tools/osm-to-grid.mjs)
   지도 데이터 © OpenStreetMap contributors — ODbL 1.0 (https://www.openstreetmap.org/copyright)
   이 파일은 OSM 유래 Derivative Database이며 ODbL 1.0으로 제공된다. 수정 금지(재생성할 것). */
(function (G) { G.BUSAN_OSM = ${JSON.stringify({ meta, cls: b64, roads, boundary, peaks })}; })(typeof window !== 'undefined' ? window : globalThis);
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, js);
const cnt = [0, 0, 0, 0, 0, 0, 0]; let inBusan = 0; for (const v of cls) { cnt[v & 0x7f]++; if (v & 0x80) inBusan++; }
console.log("written", OUT, (js.length / 1024).toFixed(0) + "KB", "classes", cnt.join(","), "roads", roads.length, "boundary", boundary.length, "peaks", peaks.length, "inBusan", inBusan);
